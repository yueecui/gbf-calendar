<template>
  <div id="app-calendar">
    <div>2020年4月</div>
    <div class="week-row">
      <div class="days-row"></div>
      <div class="detail"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class App extends Vue {
  readonly version = '1';
  readonly last_date = '2021-04-04'

  mounted(){
    console.log(this.get_mouth_info());
    console.log(this.get_mouth_info(2021, 2));
  }

  get_mouth_info(year?: number, month?: number){
    let target_day;
    if (year == undefined || month == undefined){
      target_day = new Date();
    }else{
      target_day = new Date(year, month);
    }
    let current: Record<string, any> = {
      year: target_day.getFullYear(),
      month: target_day.getMonth(),
      day: target_day.getFullYear(),
    };
    current.first_day_index = new Date(current.year, current.month, 1).getDay();
    current.last_day = new Date(current.year, current.month+1, 0).getDate();
    return current;
  }
}
</script>

<style>
#app-calendar{
  min-height: 600px;
}
</style>