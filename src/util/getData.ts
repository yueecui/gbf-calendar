import { eventData } from './interface';

// 获取数据
export function getData(key: string){
    const mw = (window as any).mw;
    let data: Record<string, any>;
    if (typeof(mw) == "undefined"){
        data = (window as any).DATA;
    }else{
        data = mw.config.get('wgHuijiVars.DATA');        
    }
    return data[key];
}

// 获取日历数据
export function getCalendarData(): Array<eventData>{
    const raw_data = getData('calendar');
    const calendar_data: Array<eventData> = [];
    for (const index in raw_data){
        const r_ev = raw_data[index];
        const ev: eventData ={
            title: r_ev.title,
            index: parseInt(index),
            category: r_ev.category ? r_ev.category : '活动',
            start: new Date(r_ev.start),
            end: new Date(r_ev.end),
        }
        // 开始时间不正确的话会跳过
        if (isNaN(ev.start.getTime())){
            console.error('数据<'+index+' - '+ev.title+'>的开始时间“'+ev.start+'”格式不正确')
            continue;
        }

        // if (isNaN(ev.end!.getTime())) {
        //     ev.end = ev.start;
        // }
        calendar_data.push(ev);
    }
    return calendar_data;
}