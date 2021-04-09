<template>
  <div id="app-calendar">
    <div class="gbf-calendar">
      <div class="month-title" @mousedown.prevent.stop="change_month()">{{show_month.year}}年{{show_month.month + 1}}月</div>
      <div class="week-row" v-for="(week, i) in all_week" :key="i">
        <div class="days-row">
          <div v-for="(day, j) in week" :key="i+'-'+j" :class="{ 'has-event': is_has_event_start(day), 'disable': day == -1 }" @mousedown.prevent.stop="toggle_detail(i, day)"><template v-if="day > -1">{{day}}</template></div>
        </div>
        <div class="detail" v-if="detail_show_week == i" v-html="detail_content"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { MonthInfo } from './util/interface';
import { getCalendarData } from './util/getData'

@Component({})
export default class App extends Vue {
  readonly version = '1';
  readonly last_date = '2021-04-04';

  readonly blank_content = '本日无活动';
  private show_month: MonthInfo = this.get_month_base();
  private current_year = this.show_month.year;
  private current_month = this.show_month.month;
  private calendar_data = getCalendarData();
  private detail_show_week = -1;
  private detail_show_day = -1;
  private detail_content = this.blank_content;

  get all_week(){
    return this.get_month_all_week(this.show_month);
  }

  mounted(){
    this.hide_detail();
  }

  // 切换月份
  change_month(){
    if (this.show_month.month == this.current_month){
      this.show_month = this.get_month_base(this.current_year, this.current_month - 1);
    }else{
      this.show_month = this.get_month_base();
    }
    this.hide_detail();
  }

  hide_detail(){
    this.detail_show_week = -1;
    this.detail_show_day = -1;
    this.detail_content = this.blank_content;
  }

  get_month_all_week(month_info: MonthInfo){
    // 获取第一周
    let all_week_array = [];
    let one_week_array = [];
    for (let i = 0;i<month_info.first_day_index;i++){
      one_week_array.push(-1);
    }
    let current_day = 1;
    for (let i = month_info.first_day_index;i < 7;i++){
      one_week_array.push(current_day);
      current_day += 1;
    }
    // 获取后面的周
    while (current_day < month_info.last_day){
      all_week_array.push(one_week_array);
      one_week_array = [];
      for (let i=0;i<7;i++){
        if (current_day > month_info.last_day){
          one_week_array.push(-1);
        }else{
          one_week_array.push(current_day);
          current_day += 1;
        }
      }
    }
    all_week_array.push(one_week_array);
    return all_week_array;
  }

  get_month_base(year?: number, month?: number): MonthInfo{
    let target_day;
    if (year == undefined || month == undefined){
      target_day = new Date();
    }else{
      target_day = new Date(year, month);
    }
    let current: MonthInfo = {
      year: target_day.getFullYear(),
      month: target_day.getMonth(),
      day: target_day.getDate(),
      first_day_index: new Date(target_day.getFullYear(), target_day.getMonth(), 1).getDay(),
      last_day: new Date(target_day.getFullYear(), target_day.getMonth()+1, 0).getDate(),
    };
    return current;
  }

  is_has_event_start(day: number){
    if (day < 0){ return false; }
    return this.event_start_in_day(day).length > 0;
  }

  event_start_in_day(day: number){
    const date_day = new Date(this.show_month.year, this.show_month.month, day, 0, 0, 0);
    return this.calendar_data.filter((e) => {
      const time_start = (new Date(e.date_start.getTime())).setHours(0, 0, 0);
      return time_start == date_day.getTime();
    })
  }

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
        const this_day_events = this.events_in_day(day);
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

  events_in_day(day: number){
    return this.calendar_data.filter((e) => {
      const date_day = new Date(this.show_month.year, this.show_month.month, day, 0, 0, 0);
      const time_start = (new Date(e.date_start.getTime())).setHours(0, 0, 0);
      if (isNaN(e.date_end.getTime())){
        // 没有结束时间，判断日期与任意活动的开始时期是否相同
        return time_start == date_day.getTime();
      }else{
        date_day.setHours(12, 0, 0);
        const time_end = (new Date(e.date_end.getTime())).setHours(23, 59, 59);
        return date_day.getTime() > time_start && date_day.getTime() < time_end;
      }
    })
  }
}
</script>

<style src="./css/App.less" lang="less"></style>
