<template>
  <div id = "Tip">
    <div class="panel-header">Candlestick</div>
    <div class="panel-header-end"></div>
    <svg id = "Candlestick"  class="candlestick" style = 'width:810px; height:340px'>
    </svg>
    <div class="tooltip"></div>
    <div class="tooltip2"></div>
  </div>
</template>

<script>
import axios from 'axios'
//import moment from 'moment'
import * as d3 from 'd3'

export default {
  name:'Candlestick',
  data(){
    return {
      market:[],
      width: 780,
      height: 330,
      margin:{
        top:40,
        right:20,
        bottom:10,
        left:25
      },
      r:10,
      c:20,
      startday:"",
      flag:"",
      timegap:100,
      pricegap:1,
      timelist:[],
      pricelist:[],
      heat_aggregated:[]
    };
  },
  mounted(){
    this.Scale();
  },
  computed:{
    markets(){
      console.log(this.market)
      return this.market;
    },
    innerWidth(){
      return this.width - this.margin.left - this.margin.right
    },
    innerHeight(){
      return this.height - this.margin.top - this.margin.bottom
    }
  },
  methods:{
     getMarket(){
      const path = 'http://127.0.0.1:5000/Candlestick/?year='+ eval('2022')+'&month='+eval('2')+'&day='+eval('21');
      axios
         .get(path)
         .then(res => {
           console.log(res.data);
           this.market=res.data;
           this.startday=this.market[0].date;
         })
         .catch(error => {
           console.error(error);
         });
     },

     Scale(){
      //const gap = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
      const g = d3.select('#Candlestick').append('g').attr('id', 'marketscale')
                  .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
      var b = d3.max(this.market, function(d){return d['high']});
      var a = d3.min(this.market, function(d){return d['low']});
      // var [a,b] = d3.extent(this.market, function(d){return d3.extent(d['bid5_price'],d['ask5_price']);})
      let that = this;
      const xscale = d3.scaleLinear()
                       .domain([0,that.c])
                       .range([0, this.innerWidth]);
      const yscale = d3.scaleLinear()
                       .domain([b,a])
                       .range([0, this.innerHeight]);
      console.log([a,b])
      const yaxis = d3.axisLeft(yscale)
                      .ticks(10)
                      .tickSize(5)
                      .tickPadding(5);
      const xaxis = d3.axisBottom(xscale)
                      .ticks(20)
                      .tickSize(-5)
                      .tickPadding(-15)
                      .tickFormat(function(d,i){
                        return (i>0)?(that.market[i-1]['date']):""
                      })
                     g.append('g').call(yaxis)
                      .attr('id' ,'yaxis');
                     g.append('g').call(xaxis)
                      .attr('id', 'xaxis');

  },

  Candle(){
    let that = this;
    const b = d3.max(this.market, function(d){return d['high']});
    const a = d3.min(this.market, function(d){return d['low']});
    const xscale = d3.scaleLinear()
                       .domain([0,that.c])
                       .range([0, this.innerWidth]);
    const yscale = d3.scaleLinear()
                       .domain([b,a])
                       .range([0, this.innerHeight]);
    const g = d3.select('#Candlestick').append('g').attr('id', 'marketview1')
                .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    g.selectAll("rect")
     .data(that.market).enter()
     .append("rect")
     .attr('width',that.innerWidth/that.c-20)
     .attr('height',function(d){
      return Math.abs(yscale(d['open'])-yscale(d['close']));
     })
     .attr("x",function(d,i){return xscale(i+1)-that.innerWidth/2/that.c+10;})
     .attr("y",function(d){return yscale(d['open']>d['close']?d['open']:d['close']);})
     .attr("fill",function(d){return d['open']<d['close']?"green":"red";})

     d3.select('#Candlestick').append('g').attr('id','marketview2')
       .attr('transform', `translate(${this.margin.left},${this.margin.top})`)  
       .selectAll("rect")
       .data(that.market).enter()
       .append("rect")
       .attr('width',5)
       .attr('height',function(d){
        return yscale(d['low'])-yscale(d['close']);
       })
       .attr("x",function(d,i){return xscale(i+1)-2.5;})
       .attr("y",function(d){return yscale(d['close']);})
       .attr("fill",function(d){return d['open']<d['close']?"green":"red";})

       
     d3.select('#Candlestick').append('g').attr('id','marketview3')
       .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
       .selectAll("rect")
       .data(that.market).enter()
       .append("rect")
       .attr('width',5)
       .attr('height',function(d){
        return yscale(d['open'])-yscale(d['high']);
       })
       .attr("x",function(d,i){return xscale(i+1)-2.5;})
       .attr("y",function(d){return yscale(d['high']);})
       .attr("fill",function(d){return d['open']<d['close']?"green":"red";})
  },

  colorbox(sel, size, colors){
    var [x0,x1] = d3.extent( colors.domain());
    var bars = d3.range( x0, x1, (x1-x0)/size[1]);
    var sc = d3.scaleLinear()
        .domain([x0,x1]).range([0, size[1]]);
    sel.selectAll("line").data(bars).enter().append("line")
      .attr("x1", 0).attr("x2",size[0])
      .attr("y1", sc).attr("y2",sc)
      .attr("stroke",colors);
    
    sel.append("rect")
        .attr("width",size[0]).attr("height",size[1])
        .attr("fill","none").attr("stroke","black")
      }
  },
  created(){
    this.getMarket();
  },
  beforeUnmount() {
  },
  watch:{
    markets(){
      d3.selectAll('#marketview').remove();
      this.Scale();
      this.Candle();
    }
  }
};
</script>

<style scoped>
.tooltip{
    position: absolute;
    padding-left:5px;
    padding-right:5px;
    width:auto;
    height:auto;
    border:1px solid #2ea44f;
    border-radius:5px;
    background-color: white;
    font-size: 8px;
    text-align: center;
    opacity:0;
    z-index:999;
		}

.tooltip2{
  position:absolute;
  left:0px;
  top:0px;
  width:auto;
  height:auto;
  border:2px solid lightcoral;
  border-radius:5px;
  padding-left:1px;
  padding-right:1px;
  padding-top:1px;
  padding:1px;
  background-color: white;
  font-size: 1px;
  text-align: center;
  opacity:0;
  z-index:99;
}
.panel-header {
  position: absolute;
  left:0px;
  top:0px;
  padding: -10px 20px;
  width: 90px;
  height: 18px;
  line-height: 18px;
  font-size: 8px;
  text-align: left;
  background: #415c68;
  color: #fcfcfc;
  display: flex;
  font-weight: bold;
  border-radius: 1px;
  box-shadow: 0 1px 2px rgba(26 26 26 0.2);
  z-index:99;

}

.panel-header-end {
  position: absolute;
  top: 0px;
  left:90px;
  border-top: 18px solid #455a64;
  border-right: 18px solid #ffffff;
  border-bottom: 0px solid #ffffff;
  z-index:98;
}
</style>
