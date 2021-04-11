<template>
    <div class="gbf-calendar">
        <div class="month-title" @mousedown.prevent.stop="change_month()">{{show_month.year}}年{{show_month.month + 1}}月</div>
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
              :class="{ 'has-event': is_has_event_start(day), 'disable': show_month.month != day.getMonth(), 'selected': (detail_show_week == i && detail_show_day == day.getDate()) }"
              @mouseenter="hover_detail(i, day)"
              @mouseleave="hide_detail()"
              @mousedown.prevent.stop="toggle_detail(i, day)">
                <template v-if="day.getMonth() == show_month.month">
                  {{day.getDate()}}
                </template>
              </div>
          </div>
          <div class="detail" v-if="detail_show_week == i">
            <div>
              <template v-if="detail_content.length > 0">
                <div class="detail-row" v-for="(e, k) in detail_content" :key="i+'-'+k">
                  <div class="index">{{e.index}}.</div>
                  <div :class="{title:true, today:e.today}" v-html="e.ev.title"></div>
                  <div class="time-range">
                    <span class="date">{{e.start_date}}<span class="time">{{e.start_time}}</span></span>
                    <template v-if="e.end_date">
                      <span>～</span>
                      <span class="date">{{e.end_date}}<span class="time">{{e.end_time}}</span></span>
                    </template>
                  </div>
                </div>
              </template>
              <template v-else>{{blank_content}}</template>
            </div>
          </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { eventData, MonthInfo } from '../util/interface';
import { getCalendarData  } from '../util/getData';
import { getMonthBase, getMonthAllWeek, eventsInProgress, eventStartInDay } from '../util/CalendarData';

@Component({})
export default class CalendarMode1 extends Vue {
  readonly week_index_text = [
    { n:'日' },
    { n:'一' },
    { n:'二' },
    { n:'三' },
    { n:'四' },
    { n:'五' },
    { n:'六' },
  ];
  readonly blank_content = '本日无活动';

  // 当前显示的月份信息
  private show_month: MonthInfo = getMonthBase();

  // 今天的年份和月份
  readonly today_info: Date = new Date();

  // 所有活动数据
  private calendar_data = getCalendarData();

  // 当前显示详情的页面
  private detail_lock = false;  // 锁定时hover显示无效
  private detail_show_week = -1;
  private detail_show_day = -1;
  private detail_content: Array<any> = [];

  get all_week(){
    return getMonthAllWeek(this.show_month, 0);
  }

  mounted(){
    this.hide_detail();
  }

  // 隐藏详情行
  hide_detail(){
    if (this.detail_lock) {return;}
    this.detail_show_week = -1;
    this.detail_show_day = -1;
    this.detail_content = [];
  }

  // 显示详情行
  show_detail(week: number, day: Date){
    this.detail_show_week = week;
    this.detail_show_day = day.getDate();
    this.detail_content = (() => {
      const content = [];
      const this_day_events = eventsInProgress(this.calendar_data, day);
      for (let i=0;i<this_day_events.length;i++){
        const ev: eventData = this_day_events[i];
        let temp: Record<string, any> = {
          index: i+1,
          ev: ev,
          today: this.isSameDay(ev.start, day),
          start_date: (ev.start.getMonth()+1).toString().padStart(2, '0') + '.' + ev.start.getDate().toString().padStart(2, '0'),
          start_time: ev.start.getHours().toString().padStart(2, '0') + ':' + ev.start.getMinutes().toString().padStart(2, '0'),
        }
        if (ev.end && !isNaN(ev.end.getTime())){
          temp.end_date = (ev.end.getMonth()+1).toString().padStart(2, '0') + '.' + ev.end.getDate().toString().padStart(2, '0');
          temp.end_time = ev.end.getHours().toString().padStart(2, '0') + ':' + ev.end.getMinutes().toString().padStart(2, '0');
        }
        content.push(temp);
      }
      return content;
    })();
  }

  isSameDay(day_a:Date, day_b?:Date): boolean{
    if (!day_b) { day_b = this.today_info; }
    return day_a.getDate() == day_b.getDate()
     && day_a.getMonth() == day_b.getMonth()
     && day_a.getFullYear() == day_b.getFullYear();

  }

  // 切换月份
  change_month(){
    if (this.show_month.month == this.today_info.getMonth()){
      this.show_month = getMonthBase(this.today_info.getFullYear(), this.today_info.getMonth() - 1);
    }else{
      this.show_month = getMonthBase();
    }
    this.hide_detail();
  }

  // 判断这一天是否有活动开始
  is_has_event_start(day: Date){
    if (day.getMonth() != this.show_month.month){ return false; }
    return eventStartInDay(this.calendar_data, day).length > 0;
  }

  // 切换详情显示
  toggle_detail(week: number, day: Date){
    // if (!(event.target as HTMLElement).classList.contains('has-event')){
    //   return;
    // }
    if (day.getMonth() != this.show_month.month){
      return;
    }
    if ( this.detail_lock && this.detail_show_week == week && this.detail_show_day == day.getDate()){
      this.detail_lock = false;
      this.hide_detail();
    }else{
      this.detail_lock = true;
      this.show_detail(week, day);
    }
  }
  
  // hover详情显示
  hover_detail(week: number, day: Date){
    if (this.detail_lock) { return; }
    if (day.getMonth() != this.show_month.month){
      return;
    }
    this.show_detail(week, day);
  }
}
</script>

<style scoped src="./mode1.less" lang="less"></style>
