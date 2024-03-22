<template>
  <div id = "StreamBlock">
    <div class="panel-header">StreamGraph</div>
    <div class="panel-header-end"></div>
    <div id = "Stream"  class="Stream" style = 'width:{{svgWidth}}px; height:{{svgHeight}}px'></div>
  </div>
  
</template>


<script>
// import axios from 'axios'
//import moment from 'moment'
import * as d3 from 'd3'

export default {
  name:'Stream',
  data(){
    return {
      // set the dimensions and margins of the graph
      margin : {top: 40, right: 30, bottom: 0, left: 50},
      svgHeight: 400,
      svgWidth: 900,
      
    };
  },
  computed:{
    width(){
      return this.svgWidth - this.margin.left - this.margin.right
    },
    height(){
      return this.svgHeight - this.margin.top - this.margin.bottom
    },
  },
  mounted(){
    // append the svg object to the body of the page
    const svg = d3.select("#Stream")
      .append("svg")
        .attr("width", this.svgWidth)
        .attr("height", this.svgHeight)
      .append("g")
        .attr("transform",
              `translate(${this.margin.left}, ${this.margin.top})`);
    
    // Parse the Data

    d3.csv("/dataset/流图数据.csv").then((datum)=> {
      const keys= ['bias BTC value','bias BNB value','bias ETH value','bias usd value']
      for(var i=0;i<datum.length;i++) {
        datum[i].time= new Date(datum[i].time * 1000)
        // datum[i]['bias BTC value']=parseFloat(datum[i]['bias BTC value'])
        // datum[i]['bias BNB value']=parseFloat(datum[i]['bias BNB value'])
        // datum[i]['bias ETH value']=parseFloat(datum[i]['bias ETH value'])
      }
      // 按时间排序
      datum.sort(function(a,b){
          return a.time < b.time ? 1 : -1
      });
      console.log(datum)
      console.log(keys)
      console.log(d3.extent(datum, function(d) { return d.time; }))
      const maxy=d3.extent(datum, function(d) { 
        return parseFloat(d['bias BTC value'])+parseFloat(d['bias BNB value'])+parseFloat(d['bias ETH value']) + parseFloat(d['bias usd value']); 
        })[1]
      console.log(maxy)

    // d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv").then((datum)=> {
    //   // List of groups = header of the csv files
    //   var keys = datum.columns.slice(1)
      
    //   for(var i=0;i<datum.length;i++) {
    //     datum[i].time=datum[i].year
    //   }
    //   console.log(datum)
    //   console.log(keys)
    //   const maxy=200000

      // 定义时间格式
      const timeFormat = d3.timeFormat('%m-%d %H:%M:%S');   //"%Y-%m-%d %H:%M:%S"

      // Add X axis
      const x = d3.scaleLinear()
        .domain(d3.extent(datum, function(d) { return d.time; }))
        .range([ 0, this.width ]);
      const g2=svg.append("g")
        .attr("transform", `translate(0, ${this.height*0.8})`)
        // .call(d3.axisBottom(x).tickSize(-this.height*.7).tickValues([1900, 1925, 1975, 2000]))
        .call(d3.axisBottom(x)
                .tickFormat(d => timeFormat(new Date(d)))
                .tickSize(-this.height*.7)
                .tickValues(d3.extent(datum, function(d) { return d.time; })))
        // x坐标竖过来
        .selectAll("text") // 选择所有 x 轴标签
        .attr("transform", "rotate(-30)") // 旋转标签文字
        .style("text-anchor", "end") // 设置文字对齐方式
        .attr("dx", "2.8em") // 调整文字位置
        .attr("dy", "0.3em");
        svg.select(".domain").remove()
        
        
      // Customization
      svg.selectAll(".tick line").attr("stroke", "#b8b8b8")

      // Add X axis label:
      svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", this.width)
          .attr("y", this.height-30 )
          .text("Time");

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([0,maxy])
        .range([ this.height-100, 0 ]);

      // color palette
      const color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeDark2);

      //stack the data?
      const stackedData = d3.stack()
        // .order(d3.stackOrderAppearance)  //排序方式,最大块的放下面
        .order(d3.stackOrderInsideOut) //排序方式,块最大值最大的的放下面
        .offset(d3.stackOffsetNone)  // 以0为基准线
        // .offset(d3.stackOffsetSilhouette)
        .keys(keys)(datum)
      console.log(stackedData)

      // create a tooltip
      const Tooltip = svg
        .append("text")
        .attr("x", 10)
        .attr("y", 10)
        .style("opacity", 0)
        .style("font-size", 17)

      // Three function that change the tooltip when user hover / move / leave a cell
      const mouseover = function(event,d) {
        Tooltip.style("opacity", 1)
        d3.selectAll(".myArea").style("opacity", .2)
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
      }
      const mousemove = function(event,d,i) {
        let grp = d.key
        Tooltip.text(grp)
      }
      const mouseleave = function(event,d) {
        Tooltip.style("opacity", 0)
        d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
      }

      // Area generator
      const area = d3.area()
        .x(function(d) { return x(d.data.time); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })

      // Show the areas
      svg
        .selectAll("mylayers")
        .data(stackedData)
        .join("path")
          .attr("class", "myArea")
          .style("fill", function(d) { return color(d.key); })
          .attr("d", area)
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)
    }) 

   
  },
  // methods:{

  // },

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
  left:3px;
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
  left:93px;
  border-top: 18px solid #455a64;
  border-right: 18px solid #ffffff;
  border-bottom: 0px solid #ffffff;
  z-index:98;
}
</style>
