import { eventData } from './interface';
import { getImageUrl } from './getImageUrl';

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
            title: parserTitle(r_ev.title),
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

// 预处理标题
function parserTitle(title: string){
    const all = title.match(/\[\[(.*?)]]/g);
    if (all == null) {return title;}
    for (const find of all){
        // 图片（仅限于item模板解析出来的结果）
        const find_img = /\[\[(?:File|文件):([^|]*)\|(.*)]]/.exec(find);
        if (find_img){
            const img = document.createElement('img');
            let link = '';
            img.src = getImageUrl(find_img[1]);
            const params = find_img[2].split('|');
            for (const param of params){
                const find_size = /(\d*)x?(\d*)px/.exec(param)
                if (find_size){
                    img.style.setProperty('width', find_size[1] != '' ? find_size[1]+'px' : 'auto');
                    img.style.setProperty('height', find_size[2] != '' ? find_size[2]+'px' : 'auto');
                    continue;
                }
                const find_link = /link=(.+)/.exec(param)
                if (find_link){
                    link = find_link[1];
                    continue;
                }

                if (!img.title){
                    img.title = param;
                }
            }

            let new_html = '';
            if (link != ''){
                const elem_a = document.createElement('a');
                elem_a.href = '/wiki/' + link;
                elem_a.innerHTML = img.outerHTML;
                new_html = elem_a.outerHTML;
            }else{
                new_html = img.outerHTML;
            }

            title = title.replaceAll(find, new_html);
            continue;
        }

        // 链接
        const find_a = /\[\[([^|]*?)\|([^|]*?)]]/.exec(find);
        if (find_a){
            title = title.replaceAll(find, '<a href="/wiki/'+find_a[1]+'">'+find_a[2]+'</a>');
            continue;
        }
    }

    return title;
}