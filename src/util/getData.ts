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
export function getCalendarData(){
    const raw_data = getData('calendar');
    const calendar_data = [];
    for (const index in raw_data){
        const event = raw_data[index]
        event.index = index;
        event.date_start = new Date(event.start);
        // 开始时间不正确的话会跳过
        if (isNaN(event.date_start.getTime())){
            console.error('数据<'+index+' - '+event.title+'>的开始时间“'+event.start+'”格式不正确')
            continue;
        }
        event.date_end = new Date(event.end)
        calendar_data.push(event);
    }
    return calendar_data;
}