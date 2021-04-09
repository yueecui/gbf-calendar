<template>
    <div class="gbf-calendar">
        <div class="week-row-title">
          <div v-for="name in week_index_text" :key="name">{{name}}</div>
        </div>
        <div class="week-row" v-for="(week, i) in all_week" :key="i">
          <div class="days-row">
              <DayItem v-for="(day, j) in week" :key="i+'-'+j" :day="day" />
          </div>
          <div class="detail" v-if="detail_show_week == i" v-html="detail_content"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { MonthInfo } from '../util/interface';
import { getCalendarData } from '../util/getData';
import { getMonthBase, getMonthAllWeek } from '../util/CalendarData';
import DayItem from './mode2-day.vue';

@Component({
  components:{ 
    DayItem,
  }
})
export default class CalendarMode2 extends Vue {

  readonly week_index_text = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  private show_month: MonthInfo = getMonthBase();
  // private current_year = this.show_month.year;
  // private current_month = this.show_month.month;
  private calendar_data = getCalendarData();

  get all_week(){
    return getMonthAllWeek(this.show_month, 0);
  }
  // mounted(){
  // }

}
</script>

<style src="./mode2.less" lang="less"></style>
