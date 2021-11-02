import { MonthInfo, eventData, eventDataShow } from './interface';
import { CategoryMap } from './config';

// 获取生成日历的array数组
// 每行一周，数字为当日的日期，-1为不显示
// 输入参数：start为第一天为星期几，0为星期日，1为星期一
export function getMonthAllWeek(month_info: MonthInfo, start: number): Array<Array<Date>>{
  // 获取第一周
  const all_week_array = [];
  let one_week_array = [];
  for (let i = start;i<month_info.first_day_index;i++){
    one_week_array.push(new Date(month_info.year, month_info.month, i + 1 - month_info.first_day_index));
  }
  let current_day = 1;
  for (let i = month_info.first_day_index;one_week_array.length < 7;i++){
    one_week_array.push(new Date(month_info.year, month_info.month, current_day));
    current_day += 1;
  }
  // 获取后面的周
  while (current_day <= month_info.last_day){
    all_week_array.push(one_week_array);
    one_week_array = [];
    for (let i=0;i<7;i++){
      one_week_array.push(new Date(month_info.year, month_info.month, current_day));
      current_day += 1;
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

export function eventsInProgress(calendar_data: Array<any>, date_day: Date){
  return calendar_data.filter((ev) => {
    date_day.setHours(0, 0, 0);
    const time_start = (new Date(ev.start.getTime())).setHours(0, 0, 0);
    if (isNaN(ev.end.getTime())){
      // 没有结束时间，判断日期与任意活动的开始时期是否相同
      return time_start == date_day.getTime();
    }else{
      date_day.setHours(12, 0, 0);
      const time_end = (new Date(ev.end.getTime())).setHours(23, 59, 59);
      return date_day.getTime() > time_start && date_day.getTime() < time_end;
    }
  })
}

export function eventStartInDay(calendar_data: Array<any>, date_day: Date){
  date_day.setHours(0, 0, 0);
  return calendar_data.filter((e) => {
    const time_start = (new Date(e.start.getTime())).setHours(0, 0, 0);
    return time_start == date_day.getTime();
  })
}


// 按周过滤出本周的活动生成行数情况
export function cleanUpEventData(calendar_data: Array<eventData>, week: Array<Date>){
  const temp_data: Record<string, eventData[][]> = {}

  const first_day_time = new Date(week[0].getTime()).setHours(0, 0, 0);
  const last_day_time = new Date(week[week.length-1].getTime()).setHours(23, 59, 59);

  // 按开始时间正序排列
  calendar_data = calendar_data.filter((ev) => {
    return Boolean(ev.end);
  }).sort((a,b) => {
    return b.start.getTime() - a.start.getTime();
  })

  // 将所有活动，按本周时间分组
  for (const e of calendar_data){
    // 先不处理没有结束时间的
    if (!e.end){ continue; }

    if (!temp_data[e.category]) {temp_data[e.category] = [
      [],  // 0类，活动贯穿本周
      [],  // 1类，活动开始于之前，结束于本周
      [],  // 2类，本周内开始的活动，本周内结束
      []   // 3类，本周开始的活动，本周未结束
    ];}

    if (e.start.getTime() < first_day_time && e.end.getTime() > last_day_time){
      temp_data[e.category][0].push(eventExtraData(e, week, 0));
    }else if (e.start.getTime() < first_day_time && e.end.getTime() >= first_day_time && e.end.getTime() <= last_day_time){
      temp_data[e.category][1].push(eventExtraData(e, week, 1));
    }else if (e.start.getTime() >= first_day_time && e.end.getTime() <= last_day_time){
      temp_data[e.category][2].push(eventExtraData(e, week, 2));
    }else if (e.start.getTime() >= first_day_time && e.start.getTime() <= last_day_time && e.end.getTime() > last_day_time){
      temp_data[e.category][3].push(eventExtraData(e, week, 3));
    }
  }

  // 根据分组排列输出顺序
  // 组越靠后输出位置越靠下
  const cleanedData: Record<string, eventData[][]> = {};
  for (const category in temp_data){
    const tc_data = temp_data[category];
    const category_data = [...tc_data[0].map((ev) => {
      return [ev]
    })]; // 0类排最前面

    // 从3类判断到1类，不判断0类
    for(let i=3;i>0;i--){
      for (let j=0;j<tc_data[i].length;j++){
        const ev = tc_data[i][j];
        
        let start = ev.start;
        const line = [ev];
        for (let k=i-1;k>0;k--){
          if (tc_data[k].length > 0){
            const current_start = new Date(start.getTime()).setHours(0, 0, 0);
            // eslint-disable-next-line
            const prev_end = new Date(tc_data[k][0].end!.getTime()).setHours(23, 59, 59);
            if (prev_end < current_start){
              const prev_ev = tc_data[k].splice(0, 1)[0];
              start = prev_ev.start;
              line.splice(0, 0, prev_ev);
            }
          }
        }
        category_data.push(line);
      }
    }
    // 合并数据
    cleanedData[category] = category_data;
  }

  // 整合并排序数据
  const output: eventData[][] = [];
  // for (const order of ['活动', '运营']){
  //   if (cleanedData[order]){
  //     output.push(...(cleanedData[order].reverse()));
  //   }
  // }

  for (const category in cleanedData){
    output.push(...(cleanedData[category]));
  }

  output.sort((a, b) => {
    const a_category_sort = CategoryMap[a[0].category].sort ? CategoryMap[a[0].category].sort : 999;
    const b_category_sort = CategoryMap[b[0].category].sort ? CategoryMap[b[0].category].sort : 999;
    if (a_category_sort != b_category_sort){
      return a_category_sort - b_category_sort;
    }else{
      return a[0].start.getTime() - b[0].start.getTime();
    }
  })
  
  return output;
}

function eventExtraData(ev: eventData, week: Array<Date>, part: number){
  const new_ev = Object.assign({}, ev) as eventDataShow;
  const start_time = new Date(new_ev.start.getTime()).setHours(0, 0, 0);
  const end_time = new Date(new_ev.end.getTime()).setHours(0, 0, 0);
  const first_day_time = new Date(week[0].getTime()).setHours(0, 0, 0);
  const last_day_time = new Date(week[week.length-1].getTime()).setHours(0, 0, 0);
  // 开始的格数
  if (part <= 1){
    new_ev.start_pos = 0;
  }else{
    new_ev.start_pos = (start_time - first_day_time) / (1000*60*60*24);
  }
  if (part == 0 || part == 3){
    new_ev.width = week.length - new_ev.start_pos;
  }else{
    new_ev.width = (end_time - first_day_time) / (1000*60*60*24) + 1 - new_ev.start_pos;
  }

  new_ev.start_in_first = start_time == first_day_time;
  new_ev.end_in_last = end_time == last_day_time;

  return new_ev;
}