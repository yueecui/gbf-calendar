<template>
    <div class="gbf-calendar">
        <div class="month-title" @mousedown.prevent.stop="change_month()">{{show_month.year}}年{{show_month.month + 1}}月</div>
        <div class="week-row" v-for="(week, i) in all_week" :key="i">
        <div class="days-row">
            <div v-for="(day, j) in week" :key="i+'-'+j" :class="{ 'has-event': is_has_event_start(day), 'disable': day == -1 }" @mousedown.prevent.stop="toggle_detail(i, day)"><template v-if="day > -1">{{day}}</template></div>
        </div>
        <div class="detail" v-if="detail_show_week == i" v-html="detail_content"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { MonthInfo } from '../util/interface';
import { getCalendarData  } from '../util/getData';
import { getMonthBase, getMonthAllWeek, eventsInProgress, eventStartInDay } from '../util/CalendarData';

@Component({})
export default class CalendarMode1 extends Vue {
  readonly blank_content = '本日无活动';
  private show_month: MonthInfo = getMonthBase();
  private current_year = this.show_month.year;
  private current_month = this.show_month.month;
  private calendar_data = getCalendarData();
  private detail_show_week = -1;
  private detail_show_day = -1;
  private detail_content = this.blank_content;

  get all_week(){
    return getMonthAllWeek(this.show_month, 0);
  }

  mounted(){
    this.hide_detail();
  }

  // 隐藏详情行
  hide_detail(){
    this.detail_show_week = -1;
    this.detail_show_day = -1;
    this.detail_content = this.blank_content;
  }

  // 切换月份
  change_month(){
    if (this.show_month.month == this.current_month){
      this.show_month = getMonthBase(this.current_year, this.current_month - 1);
    }else{
      this.show_month = getMonthBase();
    }
    this.hide_detail();
  }

  // 判断这一天是否有活动开始
  is_has_event_start(day: number){
    if (day < 0){ return false; }
    return eventStartInDay(this.calendar_data, this.show_month.year, this.show_month.month, day).length > 0;
  }

  // 切换详情显示
  toggle_detail(week: number, day: number){
    // if (!(event.target as HTMLElement).classList.contains('has-event')){
    //   return;
    // }
    if (day == -1){
      return;
    }
    if (this.detail_show_week == week && this.detail_show_day == day){
      this.hide_detail();
    }else{
      this.detail_show_week = week;
      this.detail_show_day = day;
      this.detail_content = (() => {
        const content = [];
        const this_day_events = eventsInProgress(this.calendar_data, this.show_month.year, this.show_month.month, day);
        for (let i=0;i<this_day_events.length;i++){
          content.push((i+1)+'. '+this_day_events[i].title)
        }
        if (content.length == 0){
          return this.blank_content;
        }else{
          return content.join('<br>');
        }
      })();
    }
  }
}
</script>

<style src="./mode1.less" lang="less"></style>
