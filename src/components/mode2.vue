<template>
    <div class="gbf-calendar">
      <div class="week-row">
        <div class="days-row title">
          <div v-for="name in week_index_text" :key="name.n" :class="name.c">
            <div class="date">{{name.n}}</div>
          </div>
        </div>
      </div>
      <div class="week-row" v-for="(week, i) in all_week" :key="i" :style="{'--row': week_detail(i).length}">
        <div class="days-row">
            <div v-for="(day, j) in week"
              :key="i+'-'+j"
              :class="getDayClass(day)">
              <div class="cover" v-if="isToday(day)"></div>
              <div class="date">{{day.getDate()}}</div>
              <div class="detail"><div><div class="star" v-if="hasUpdate(day)"></div></div></div>
              <div class="interactivity" @mousedown="show_detail(day, $event)"></div>
            </div>
        </div>
        <div class="bar-block" v-if="week_detail(i).length > 0">
          <div :class="getBarGroupClass(ev_arr)" v-for="(ev_arr, k) in week_detail(i)" :key="i+'-'+k">
            <div class="bar" v-for="(ev, l) in ev_arr" :key="i+'-'+k+'-'+l" :style="getBarStyle(ev)"><div v-html="ev.title"></div></div>
          </div>
        </div>
      </div>
      <CalendarMode2Detail :detail_data="detail_data" :detail_from_area="detail_from_area" v-if="show_detail_frame" @closeFrame="show_detail_frame = false"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CalendarMode2Detail from './mode2-detail.vue';
import { MonthInfo, eventDataShow, eventData } from '../util/interface';
import { getCalendarData } from '../util/getData';
import { getMonthBase, getMonthAllWeek, cleanUpEventData, eventsInProgress } from '../util/CalendarData';
import { CategoryMap } from '../util/config';
import { getOffsetToClass } from '../util/calcOffset';

@Component({
  components: {
    CalendarMode2Detail
  }
})
export default class CalendarMode2 extends Vue {
  readonly week_index_text = [
    { n:'日', f:'星期日', c:'red' },
    { n:'一', f:'星期一' },
    { n:'二', f:'星期二' },
    { n:'三', f:'星期三' },
    { n:'四', f:'星期四' },
    { n:'五', f:'星期五' },
    { n:'六', f:'星期六', c:'blue' },
  ];
  readonly today_info: Date = new Date();
  readonly calendar_data = getCalendarData();

  readonly app_width = 100;
  readonly row_padding = this.app_width/828*15;
  readonly cell_width = (this.app_width - this.row_padding * 2) /7;

  // 当前显示的月份数据
  private show_month_info: MonthInfo = getMonthBase();

  get all_week(){
    return getMonthAllWeek(this.show_month_info, 0);
  }

  get all_week_detail(){
    const detail = [];
    for(const week of this.all_week){
      detail.push(cleanUpEventData(this.calendar_data, week));
    }
    return detail;
  }

  week_detail(week:number){
    return this.all_week_detail[week];
  }

  get all_detail_data(){
    const all_detail_data: Record<number, any> = {};
    for(const week of this.all_week){
      for (const day of week){
        const key = new Date(day.getTime()).setHours(0, 0, 0);

        // 过滤需要展示的事件
        const detail_data: Record<string, any> = {
          time_text: day.getFullYear() + '.' + (day.getMonth()+1) + '.' + day.getDate() + ' ' + this.week_index_text[day.getDay()].f,
          ev_list: eventsInProgress(this.calendar_data, day),
        };
        detail_data.ev_list.sort((a: eventData, b: eventData) => {
          const a_category_sort = CategoryMap[a.category].sort ? CategoryMap[a.category].sort : 999;
          const b_category_sort = CategoryMap[b.category].sort ? CategoryMap[b.category].sort : 999;
          if (a_category_sort != b_category_sort){
            return a_category_sort - b_category_sort;
          }else{
            return a.start.getTime() - b.start.getTime();
          }
        })
        detail_data.ev_list.forEach((ev: any) => {
          ev.start_time_text = ev.start.getFullYear() + '.' + (ev.start.getMonth()+1) + '.' + ev.start.getDate() + ' ' + ev.start.getHours().toString().padStart(2, '0') + ':' + ev.start.getMinutes().toString().padStart(2, '0');
          if (ev.end && !isNaN(ev.end.getTime())){
            ev.end_time_text = ev.end.getFullYear() + '.' + (ev.end.getMonth()+1) + '.' + ev.end.getDate() + ' ' + ev.end.getHours().toString().padStart(2, '0') + ':' + ev.end.getMinutes().toString().padStart(2, '0');
          }
          ev.s_class = CategoryMap[ev.category] ? CategoryMap[ev.category].s_class : '';
        });

        all_detail_data[key] = detail_data;
      }
    }
    return all_detail_data;
  }

  getDetailData(day: Date){
    const key = new Date(day.getTime()).setHours(0, 0, 0);
    return this.all_detail_data[key];
  }

  
  isToday(day: Date): boolean{
    return day.getDate() == this.today_info.getDate()
     && day.getMonth() == this.today_info.getMonth()
     && day.getFullYear() == this.today_info.getFullYear();
  }

  getDayClass(day: Date){
    const day_class = [];
    if (this.isToday(day)){
       day_class.push('today');
    }else if (day.getMonth() != this.show_month_info.month){
      day_class.push('gary');
    }else{
      switch(day.getDay()){
        case 0: day_class.push('red');break;
        case 6: day_class.push('blue');break;
        default: break;
      }
    }
    return day_class;
  }

  getBarGroupClass(ev_arr: Array<eventDataShow>){
    const group_class = ['bar-group'];
    if (CategoryMap[ev_arr[0].category]){
      group_class.push(CategoryMap[ev_arr[0].category].s_class)
    }
    return group_class;
  }

  getBarStyle(ev: eventDataShow){
    const bar_style: Record<string, any> = {};
    bar_style.width = ev.width * this.cell_width;
    if (ev.start_pos == 0){
      bar_style.left = ev.start_in_first ? this.row_padding: 0;
      bar_style.width += ev.start_in_first ? 0: this.row_padding;
      bar_style.width += (ev.start_pos + ev.width == 7 && !ev.end_in_last) ? this.row_padding : 0;
    }else{
      bar_style.left = ev.start_pos * this.cell_width + this.row_padding;
      bar_style.width += (ev.start_pos + ev.width == 7 && !ev.end_in_last) ? this.row_padding : 0;
    }
    bar_style.left += '%';
    bar_style.width += '%';
    return bar_style;
  }

  // 浮层数据
  private show_detail_frame = false;
  private detail_from_area = {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  };
  private detail_data: Record<string, any> = {};

  show_detail(day: Date, e: MouseEvent){
    if (e.button != 0){
      return;
    }
    
    // 生成起始区域
    const offset = getOffsetToClass(e.target as HTMLElement, 'gbf-calendar');
    this.detail_from_area = {
      top: offset.top,
      left: offset.left,
      width: (e.target as HTMLElement).offsetWidth,
      height: (e.target as HTMLElement).offsetHeight,
    }
    this.detail_data = this.getDetailData(day);
    this.show_detail_frame = true;
  }

  hasUpdate(day: Date){
    const detail_data = this.getDetailData(day);
    return detail_data.ev_list.filter((ev: Record<string, any>) => {
      return ev.category == '更新';
    }).length > 0;
  }
}
</script>

<style scoped src="./mode2.less" lang="less"></style>
