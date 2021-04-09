import { MonthInfo } from './interface';

// 获取生成日历的array数组
// 每行一周，数字为当日的日期，-1为不显示
// 输入参数：start为第一天为星期几，0为星期日，1为星期一
export function getMonthAllWeek(month_info: MonthInfo, start: number): Array<Array<number>>{
  // 获取第一周
  const all_week_array = [];
  let one_week_array = [];
  for (let i = start;i<month_info.first_day_index;i++){
    one_week_array.push(-1);
  }
  let current_day = 1;
  for (let i = month_info.first_day_index;one_week_array.length < 7;i++){
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

export function getMonthBase(year?: number, month?: number): MonthInfo{
  let target_day;
  if (year == undefined || month == undefined){
    target_day = new Date();
  }else{
    target_day = new Date(year, month);
  }
  const current: MonthInfo = {
    year: target_day.getFullYear(),
    month: target_day.getMonth(),
    day: target_day.getDate(),
    first_day_index: new Date(target_day.getFullYear(), target_day.getMonth(), 1).getDay(),
    last_day: new Date(target_day.getFullYear(), target_day.getMonth()+1, 0).getDate(),
  };
  return current;
}

export function eventsInProgress(calendar_data: Array<any>, year: number, month: number, day: number){
  return calendar_data.filter((e) => {
    const date_day = new Date(year, month, day, 0, 0, 0);
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

export function eventStartInDay(calendar_data: Array<any>, year: number, month: number, day: number){
  const date_day = new Date(year, month, day, 0, 0, 0);
  return calendar_data.filter((e) => {
    const time_start = (new Date(e.date_start.getTime())).setHours(0, 0, 0);
    return time_start == date_day.getTime();
  })
}
