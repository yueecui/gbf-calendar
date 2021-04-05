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
