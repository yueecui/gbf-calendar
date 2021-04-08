<template>
  <div id="app-calendar">
    <div>{{current_month.year}}年{{current_month.month + 1}}月</div>
    <div class="week-row" v-for="(week, i) in all_week" :key="i">
      <div class="days-row">
        <div v-for="(day, j) in week" :key="i+'-'+j"><template v-if="day > -1">{{day}}</template></div>
      </div>
      <div class="detail"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { MonthInfo } from './util/interface';

@Component({})
export default class App extends Vue {
  readonly version = '1';
  readonly last_date = '2021-04-04'
  private current_month: MonthInfo = this.get_month_base();

  get all_week(){
    return this.get_month_all_week(this.current_month);
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
}
</script>

<style>
#app-calendar{
  min-height: 600px;
}
</style>

<style src="./css/App.less" lang="less"></style>
