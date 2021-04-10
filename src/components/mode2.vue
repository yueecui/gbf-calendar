<template>
    <div class="gbf-calendar">
        <div class="week-row">
          <div class="days-row title">
            <div v-for="name in week_index_text" :key="name.n" :class="name.c">
              <div class="date">{{name.n}}</div>
            </div>
          </div>
        </div>
        <div class="week-row" v-for="(week, i) in all_week" :key="i">
          <div class="days-row">
              <div v-for="(day, j) in week"
                :key="i+'-'+j"
                :class="getDayClass(day)">
                <div class="cover" v-if="isToday(day)"></div>
                <div class="date">{{day.getDate()}}</div>
                <div class="detail"></div>
              </div>
          </div>
          <div class="bar-block" v-if="week_detail(i).length > 0">
            <div :class="getBarGroupClass(ev_arr)" v-for="(ev_arr, k) in week_detail(i)" :key="i+'-'+k">
              <div class="bar" v-for="(ev, l) in ev_arr" :key="i+'-'+k+'-'+l" :style="getBarStyle(ev)"><div>{{ev.title}}</div></div>
            </div>
          </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { MonthInfo, eventDataShow } from '../util/interface';
import { getCalendarData } from '../util/getData';
import { getMonthBase, getMonthAllWeek, cleanUpEventData } from '../util/CalendarData';

@Component({})
export default class CalendarMode2 extends Vue {
  readonly week_index_text = [
    { n:'日', c:'red' },
    { n:'一' },
    { n:'二' },
    { n:'三' },
    { n:'四' },
    { n:'五' },
    { n:'六', c:'blue' },
  ];
  readonly today_info: Date = new Date();
  readonly calendar_data = getCalendarData();

  readonly app_width = 828; // 需要与less文件中同步修改
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
    switch(ev_arr[0].category){
      case '活动':
        group_class.push('event');
        break;
      case '运营':
        group_class.push('bonus');
        break;
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
    bar_style.left += 'px';
    bar_style.width += 'px';
    return bar_style;
  }
}
</script>

<style scoped src="./mode2.less" lang="less"></style>
