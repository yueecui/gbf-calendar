<template>
  <div id="app-calendar">
    <Mode1 v-if="mode == 1"/>
    <Mode2 v-if="mode == 2"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getData } from './util/getData';
import Mode1 from './components/mode1.vue';
import Mode2 from './components/mode2.vue';

@Component({
  components:{
    Mode1,
    Mode2,
  }
})
export default class App extends Vue {
  readonly version = '1';
  readonly last_date = '2021-04-04';

  get mode(){
    let mode = getData('mode');
    return mode ? mode : 1;
  }

  mounted(){
    console.log('碧蓝幻想日历加载成功 版本:'+this.version+'，最后更新日期：'+this.last_date+'，模式：'+this.mode);
  }
}
</script>

<style src="./css/App.less" lang="less"></style>
