<template>
    <div>
      <template v-if="day > -1">{{day}}</template>   
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
// import { MonthInfo } from '../util/interface';

@Component({})
export default class CalendarMode2DayItem extends Vue {
  @Prop() day!: number;
}
</script>

<style src="./mode2-day.less" lang="less"></style>
