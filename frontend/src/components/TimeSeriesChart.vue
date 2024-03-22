<template>
  <div id='TSBlock'>
    <div id="TimeSeriesChart" style = 'width:{{svgWidth}}px; height:{{svgHeight}}px'></div>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  data() {
    return {
      svgWidth: 900,
      svgHeight: 400,
      df1: null,
      df2: null
    };
  },
  mounted() {
    // 读取CSV文件
    Promise.all([
      d3.csv("/dataset/策略图数据.csv"),
      d3.csv("/dataset/策略建议.csv")
    ]).then(data => {
      this.df1 = data[0];
      this.df2 = data[1];

    // 处理数据
    console.log(this.df2)
      // 创建颜色比例尺
    const colorScale = d3.scaleOrdinal()
      .domain(['nan', 'up', 'down'])
      .range(['black', 'red', 'blue']);
    
    this.df1.forEach(d => {
      d['start time'] = new Date(d['start time']);
      d['mmcolor'] = d['Market Making']=="" ? colorScale('nan') : colorScale(d['Market Making'] == 'up' ? 'up' : 'down');
      d['hedgecolor']= d['hedge']=='0.0' ? 'black':'red';
    });

    // console.log(this.df1)

    // 设置画布大小和边距
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = this.svgWidth - margin.left - margin.right;
    const height = this.svgHeight - margin.top - margin.bottom;
    
    // 创建SVG元素
    const svg = d3.select("#TimeSeriesChart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    console.log(d3.extent(this.df1, d => d['start time']))
    // 定义x轴和y轴比例尺
    const xScale = d3.scaleTime()
      .domain(d3.extent(this.df1, d => d['start time']))
      .range([0, width]);
    const yScale = d3.scaleLinear()
      .domain([d3.min(this.df1, d => d.bid1_price), d3.max(this.df1, d => d.bid1_price)])
      .range([height, 0]);

    // 定义颜色比例尺
    const colorScale2 = d3.scaleOrdinal()
      .domain(this.df1.map(d => d.color))
      .range(d3.schemeCategory10);

    // 添加x轴和y轴
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);
    svg.append("g")
      .call(yAxis);

    // 绘制线段并为其着色
    const line = d3.line()
      .x(d => { return xScale(d['start time'])})
      .y(d => yScale(d.bid1_price))
      .curve(d3.curveMonotoneX);
    const paths = svg.selectAll(".line")
      .data(this.df1)
      .enter()
      .append("path")
      .attr("class", "line")
      // .attr("d", d => line([d]))
      .attr("d", (d, i) => {
        if(i === 0) return null; // 第一个数据没有前一个点，不能画线
        return line([this.df1[i-1], d]);
      })
      .style("stroke", d => d.mmcolor)
      // .style("stroke", 'black')
      .style("stroke-width", 2)
      .style("fill", "none");

     // 绘制箭头
    const arrow = svg.append("svg:defs").selectAll("marker")
      .data(["arrow"])
      .enter().append("svg:marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", -1.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

    const df1=this.df1
    const df2=this.df2
    paths.attr("marker-end",function(d, i) {
      if (i === 0) return null; // 第一个数据没有前一个点，不能画箭头
      const x1 = xScale(df1[i - 1]['start time']);
      const y1 = yScale(df1[i - 1].bid1_price);
      const x2 = xScale(d['start time']);
      const y2 = yScale(d.bid1_price);
      const linex=x2-x1
      const liney=y2-y1
      const group = df2.filter((item) => parseInt(item.MMgroup) === parseInt(d.MMgroup))[0];
      if (typeof group === 'undefined')  return null; //无策略区域直接跳过
      const suggest1=group.suggest1;
      const suggest2=group.suggest2;
      const dx = - parseInt(suggest1);
      let dy = 0;
      if (suggest2 == 1) {
        dy = -1;
      } else if (suggest2 == 2) {
        dy = 1;
      }
      if (dx==0 && dy==0 ) return null; //没有策略建议
      const length = Math.sqrt(dx * dx + dy * dy);
      const unitDx = dx / length;
      const unitDy = dy / length;
      const arrowLength = 10;
      const arrowWidth = 6;
      const arrowMargin = 3;
      if (Math.sqrt(linex * linex + liney * liney) < arrowWidth + arrowMargin * 2) return null; // 线段太短，不能画箭头
      // const arrowX = x1 + unitDx * (length - arrowMargin - arrowWidth);
      // const arrowY = y1 + unitDy * (length - arrowMargin - arrowWidth);
      const arrowX = (x1+x2)/2 -6
      const arrowY = (y1+y2)/2 -6
      if (d['MMgroup']!==0){
        svg.append("path")
          .attr("d", `M ${arrowX},${arrowY} L ${arrowX + unitDx * arrowLength / 2},${arrowY + unitDy * arrowLength / 2} L ${arrowX - unitDx * arrowLength / 2},${arrowY - unitDy * arrowLength / 2} Z`)
          .style("fill", 'black')
          .attr("marker-end", "url(#arrow)");
      }
      
    });
  });


  }
};
</script>


