export interface MonthInfo{
    year: number;               // 年
    month: number;              // 月
    day: number;                // 日
    last_day: number;           // 月末最后一天
    first_day_index: number;    // 第一天是星期几
}

export interface eventData{
    title: string;
    index: number;
    category: string;
    start: Date;
    end?: Date;
}

export interface eventDataShow extends eventData{
    end: Date;
    start_pos: number;     // 在绘图时第几格
    width: number;         // 绘图时的宽度
    start_in_first: boolean;     // 开始于第一格（true的情况下第一格有缩进）
    end_in_last: boolean;        // 结束于最后一格（true的情况下最后一格有缩进）
}