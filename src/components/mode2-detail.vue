<template>
    <div class="detail-frame">
      <div class="detail-layer" ref="layer">
        <div class="detail-layer__date">{{detail_data.time_text}}</div>
        <div class="detail-layer__content">
          <a v-if="detail_data.ev_list.length == 0"
            class="detail-layer__event blank"
          >
            <div class="title">本日暂无活动记录</div>
          </a>
          <a v-for="(ev, i) in detail_data.ev_list"
            v-else
            :key="detail_data.time_text+i"
            :class="['detail-layer__event', ev.s_class]"
            :href="ev.link ? '/wiki/'+ev.link : null"
            target="_blank"
          >
            <div class="title" v-html="ev.title"></div>
            <div class="time">{{ev.start_time_text}}<template v-if="ev.end_time_text"> ～ {{ev.end_time_text}}</template></div>
            <div class="link" v-if="ev.link"><i class="fa fa-angle-right" aria-hidden="true"></i></div>
          </a>
        </div>
      </div>
      <div class="close-layer" @mousedown="closeFrame"></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
// import { MonthInfo, eventDataShow } from '../util/interface';
// import { getCalendarData } from '../util/getData';
// import { getMonthBase, getMonthAllWeek, cleanUpEventData } from '../util/CalendarData';

@Component({})
export default class CalendarMode2Detail extends Vue {
  @Prop() detail_data!: Record<string, any>;
  @Prop() detail_from_area!: Record<string, number>;
  private open = false;

  mounted(){
    this.init_layer();
  }

  init_layer(){
    const layer = this.$refs.layer as HTMLElement;
    layer.style.cssText = 'top:'+this.detail_from_area.top+'px;left:'+this.detail_from_area.left+'px;width:'+this.detail_from_area.width+'px;height:'+this.detail_from_area.height+'px;transform: none;';
    layer.classList.add('init');
    setTimeout(()=>{
      this.show_layer();
    }, 5)
  }

  show_layer(){
    const layer = this.$refs.layer as HTMLElement;
    layer.style.cssText = '';
    setTimeout(()=>{
      layer.classList.remove('init');
    }, 350);
    setTimeout(()=>{
      this.open = true;
    }, 500);
  }

  hide_layer(){
    const layer = this.$refs.layer as HTMLElement;
    layer.style.cssText = 'top:'+this.detail_from_area.top+'px;left:'+this.detail_from_area.left+'px;width:'+this.detail_from_area.width+'px;height:'+this.detail_from_area.height+'px;transform: none;';
    setTimeout(()=>{
      layer.classList.add('init');
    }, 100)
  }

  closeFrame(e: MouseEvent) {
    if (e.button == 0 && this.open){
      this.hide_layer();
      setTimeout(()=>{
        this.$emit('closeFrame');
      }, 500);
      e.preventDefault();
    }
  }
}
</script>

<style scoped src="./mode2-detail.less" lang="less"></style>
