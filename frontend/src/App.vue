<template>
  <div class="container">
    <svg id = "botteomLayer" style = 'width: 100%; height: 100%; background-color:lightgrey'></svg>
    <Stream></Stream>
    <!-- <Spiral></Spiral> -->
    <!-- <Heatmap @day_detail = 'DayDetail'></Heatmap>  -->
    <!-- <Candlestick></Candlestick> -->
    <TimeSeriesChart></TimeSeriesChart>
    <Focus></Focus>
  </div>
</template>
<script>
import Focus from './components/Focus.vue';
// import Heatmap from "./components/Heatmap.vue"
// import Candlestick from "./components/Candlestick.vue"
// import Spiral from "./components/Spiral.vue"
import Stream from "./components/Stream.vue"
import TimeSeriesChart from './components/TimeSeriesChart.vue';

export default {
    name:'App',
    components:{
      // Candlestick,
      // Spiral,
      Stream,
      // Heatmap,
      TimeSeriesChart,
      Focus
    },
 
 
    data(){
      return{
      details_display: 0,
      epoch_index:-1,
      value:0
      }
    },
    mounted(){
  },
    methods:{
      // check(){
      //   this.value ++;
      //   console.log(this.value);
      // },
      Details(data){
        this.details_display = data;
      },
      DayDetail(data){
        this.epoch_index = data;
      }
    }
  }
</script>
<style lang="scss">
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}


#bottomLayer{
  z-index: -1;
}

#Candlestick {
  position: absolute;
  top:0px;
  left:3px;
  background: #ffffff;
  border-radius: 2px;
  border-color: blueviolet;
  z-index:0;
}

#Spiral {
  position: absolute;
  top:0px;
  left:830px;
  background: #ffffff;
  border-radius: 2px;
  border-color: blueviolet;
  z-index:0;
}

#Focus {
  position: absolute;
  top:0px;
  left:3px;
  background: #ffffff;
  border-radius: 2px;
  border-color: blueviolet;
  z-index:0;
}

#TimeSeriesChart {
  position: absolute;
  top:420px;
  left:3px;
  background: #ffffff;
  border-radius: 2px;
  border-color: blueviolet;
  z-index:0;
}

#Stream {
  position: absolute;
  top:0px;
  left:3px;
  background: #ffffff;
  border-radius: 2px;
  border-color: blueviolet;
  z-index:0;
}

#Heatmap {
  position: absolute;
  top:345px;
  left:3px;
  background: #ffffff;
  border-radius: 2px;
  border-color: blueviolet;
  z-index:0;
}

#app {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
