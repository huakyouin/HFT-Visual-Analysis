<template>
  <div id = "Tip3">
    <div class="panel-header">Spiral map</div>
    <div class="panel-header-end"></div>
    <svg id = "Spiral"  class="Spiral" style = '340px; height:340px'></svg>
  </div>
</template>

<script>
// import axios from 'axios'
//import moment from 'moment'
import * as d3 from 'd3'

export default {
  name:'Spiarl',
  data(){
    return {
      data_t:[  
        {
          track: 1,
          color: "red",
          name: "test",
          tag: "test",
          from: 0,
          to: 10
        },
        {
          track: 5,
          color: "darkblue",
          name: "life in hometown",
          tag: "life",
          from: 0,
          toDate: "2000-09-01"
        },
        {
          track: 5,
          color: "royalblue",
          name: "life in St.Petersburg",
          tag: "life",
          fromDate: "2000-09-01",
          toDate: "2008-09-15"
        },
        {
          track: 5,
          color: "dodgerblue",
          name: "life in USA",
          tag: "life",
          fromDate: "2008-09-15"
        },

        {
          track: 6,
          color: "salmon",
          name: "work @ STAR",
          tag: "work",
          fromDate: "2002-08-01",
          toDate: "2006-01-01"
        },
        {
          track: 6,
          color: "tomato",
          name: "work @ Sun Microsystems",
          tag: "work",
          fromDate: "2006-01-01",
          toDate: "2010-02-01"
        },
        {
          track: 6,
          color: "darkred",
          name: "work @ Oracle",
          tag: "work",
          fromDate: "2010-02-01",
          toDate: "2010-09-01"
        },
        {
          track: 6,
          color: "brown",
          name: "work @ RethinkDB",
          tag: "work",
          fromDate: "2010-09-01",
          toDate: "2012-10-01"
        },
        {
          track: 6,
          color: "firebrick",
          name: "work @ Google/MySQL",
          tag: "work",
          fromDate: "2012-10-01",
          toDate: "2014-11-01"
        },
        {
          track: 6,
          color: "crimson",
          name: "work @ Google/Dataflow",
          tag: "work",
          fromDate: "2014-11-01",
          toDate: "2021-06-07"
        },
        {
          track: 6,
          color: "red",
          name: "work @ Google/Security Realms",
          tag: "work",
          fromDate: "2021-06-07"
        },

        {
          track: 4,
          color: "limegreen",
          name: "choir",
          tag: "music",
          from: 6,
          to: 12.5
        },
        {
          track: 3,
          color: "limegreen",
          name: "Stanford Summer Chorus 2014",
          tag: "music",
          fromDate: "2014-06-01",
          toDate: "2014-08-01"
        },
        {
          track: 2,
          color: "limegreen",
          name: "Stanford Summer Chorus 2015",
          tag: "music",
          fromDate: "2015-06-01",
          toDate: "2015-08-01"
        },
        {
          track: 2,
          color: "limegreen",
          name: "Stanford Summer Chorus 2016",
          tag: "music",
          fromDate: "2016-06-01",
          toDate: "2016-08-01"
        },
        {
          track: 3,
          color: "chartreuse",
          name: "piano",
          tag: "music",
          from: 9,
          to: 12.5
        },
        {
          track: 4,
          color: "teal",
          name: "guitar",
          tag: "music",
          from: 14
        },
        {
          track: 3,
          color: "seagreen",
          name: "drums",
          tag: "music",
          fromDate: "2015-01-01"
        },
        {
          track: 2,
          color: "limegreen",
          name: "orchestra",
          tag: "music",
          fromDate: "2016-09-01"
        },
        {
          track: 1,
          color: "lawngreen",
          name: "piano (again!)",
          tag: "music",
          fromDate: "2020-05-01"
        },
        {
          track: 0,
          color: "greenyellow",
          name: "trumpet",
          tag: "music",
          fromDate: "2021-01-01"
        },

        {
          track: 7,
          color: "saddlebrown",
          name: "woodworking",
          tag: "making",
          fromDate: "2016-05-25"
        },
        {
          track: 8,
          color: "peru",
          name: "metalworking",
          tag: "making",
          fromDate: "2016-11-01"
        },
        {
          track: 9,
          color: "goldenrod",
          name: "member of go/pishops staff",
          tag: "making",
          fromDate: "2017-07-14"
        },
        {
          track: 10,
          color: "olive",
          name: "leatherworking @ Amblard Leather Atelier",
          tag: "making",
          fromDate: "2017-10-27",
          toDate: "2019-03-30"
        }],
      
      width: 300,
      height: this.width,
      stepsPerYear: 30,
      strokeWidth: 0.4,
      trackPadding: 0.05,
      spiralPadding: 0.25,
      viewBoxScale: 50,
      yearsPerRotation: 10,
      phase: 90,

      heatmap:[],
      trade:[],
     
      margin:{
        top:40,
        right:30,
        bottom:10,
        left:40
      },
      r:10,
      c:40,
      flag:"",
      timegap:100,
      // pricegap:1,
      timelist:[],
      pricelist:[],
      heat_aggregated:[],
      start:"1645361597595"
    };
  },
  computed:{
    numTracks() {
      let data_set = new Set(this.data_t.map(d=>d.track));
      return data_set.size
    },
    today(){
      return new Date().toISOString().split('T')[0]
    },
  },
  mounted(){
    const svg = d3.select("#Spiral")
      .append("g")
      .attr("id", "lifepath-ui")
      .attr("viewBox", [0, 0, this.width, this.height]);
      // .attr("viewBox", "0, 0, 800, 800");
    const innerSvg = svg
      .append("svg")
      .attr("id", "lifepath")
      .attr("viewBox", [
        -this.viewBoxScale / 2,
        -this.viewBoxScale / 2,
        this.viewBoxScale,
        this.viewBoxScale
      ]);
    //.attr("transform", "scale(1 -1)");

    let node = innerSvg
      .selectAll("path")
      .data(this.data_t)
      .join("path")
      //    .attr("fill", "none")
      //    .attr("stroke-linecap", "butt")
      .attr("stroke", d => d.color)
      .attr("fill", d => d.color)
      .attr("stroke-width", "0.1%")
      //    .attr("stroke-width", strokeWidth)
      //    .attr("stroke-linejoin", "bevel")
      .attr("d", this.spiral)
      .on("mouseenter", this.handleMouseOver)
      .on("mouseout", this.handleMouseOut);

    let info = svg
      .append("g")
      .attr("id", "lifepath-tooltip")
      .attr("pointer-events", "none")
      .attr("font-family", "Futura")
      .attr("font-size", 32)
      .attr("font-weight", "bold")
      .attr("stroke-width", 1)
      .attr("stroke", "white")
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(this.data_t)
      .join("text")
      .attr("display", "none")
      .attr("y", this.height)
      //.text(d => `[${d.track}] ${d.name} (${formatYears(datumDuration(d))})`);
      .text(d => `${d.name} (${this.formatYears(this.datumDuration(d))})`);
    // return svg.node();
  },
  methods:{
    spiral(datum) {
      const angleSeparation = 0.3;
      const yearSeparation = (angleSeparation / 360) * this.yearsPerRotation;
      // `thickness` represents the radial size of the bundle of all the tracks
      // together. It is a constant throughout the whole spiral.
      //
      // `trackPadding` is the radial distance between the adjacent strokes,
      // measured in fractions of `strokeWidth`.
      //
      // `spiralPadding` is the amount of radial distance between the bundles
      // of all the tracks that are adjacent after a full rotation, measured
      // in fractions of `strokeWidth`.
      let thickness =
        (this.numTracks + this.spiralPadding) * this.strokeWidth * (1 + this.trackPadding);

      let from = this.datumFromAge(datum);
      let to = this.datumToAge(datum);
      // Reduce the end date to add slight gaps in the track between consecutive
      // events, but don't reduce the events ending in "today".
      let toWithGap = to < this.dateToAge(this.today) ? to - yearSeparation : to;
      let years = [from, toWithGap > from ? toWithGap : to];
      
      // Generate a lot of points between the `from` and `to`.
      //
      // `steps` calculates the total number of intermediate points,
      // proportional to the duration of the datum interval and a minimum
      // of 3 points for very short intervals.
      //
      // `quantized` is an array of doubles that is a quantization of the
      // `from`..`to` interval into `steps`.
      let steps = Math.max(
        3,
        Math.ceil(this.stepsPerYear * (d3.max(years) - d3.min(years)))
      );
      let quantized = d3.quantize(d3.interpolateNumber(...years), steps);

      // `insideOutside` is a combination of the `quantized` and a flag for
      // inside of the stroke curve: first we produce the points for the
      // outside of the curve, then for the inside in the reverse order,
      // and then close the curve.
      let insideOutside = d3.merge([
        d3.map(quantized, year => [year, false]),
        d3.map(d3.reverse(quantized), year => [year, true]),
        [[quantized[0], false]]
      ]);
      

      // spiralX and spiralY generate coordinates for the outline boundaries of
      // the individual section of the spiral corresponding to the current datum.
      // The input is a pair (year, inside), where `year` is a double corresponding
      // to the year that we are mapping to a point on the spiral, `inside` is
      // a bool that represents whether the coordinates should be produced for
      // the inside or outside of the spiral section curved bar (aka stroke).
      //
      // Spiral coordinates are easy to think of in terms of polar coordinate system:
      // the angle is proportional to the year, the radius is proportional to the
      // year as well, but the proportionality coefficient for the radius accounts
      // for there being multiple tracks + padding.
      const spiralX = yearInside => {
        let year = yearInside[0];
        let inside = yearInside[1] ? 0 : 1;
        let rotation = year / this.yearsPerRotation;
        let x =
          (datum.track * this.strokeWidth * (1 + this.trackPadding) +
            thickness * rotation +
            inside * this.strokeWidth) *
          Math.cos((this.phase / 360 + rotation) * 2 * Math.PI);
        return -x;
      };
      const spiralY = yearInside => {
        let year = yearInside[0];
        let inside = yearInside[1] ? 0 : 1;
        let rotation = year / this.yearsPerRotation;
        let y =
          (datum.track * this.strokeWidth * (1 + this.trackPadding) +
            thickness * rotation +
            inside * this.strokeWidth) *
          Math.sin((this.phase / 360 + rotation) * 2 * Math.PI);
        return -y;
      };
      
      return d3
        .line()
        .x(spiralX)
        .y(spiralY)(insideOutside);
    },
    handleMouseOver(e, datum) {
      //debugger;
      d3.select('#lifepath')
        .selectAll('path')
        .filter((d, i) => d != datum)
        .style('filter', 'saturate(50%) opacity(20%)');
      //    .attr('stroke', 'lightgrey')
      //    .attr('fill', 'lightgrey');
      let tooltip = d3
        .select('#lifepath-tooltip')
        .selectAll('text')
        .filter((d, i) => d == datum);
      var tooltipX = e.offsetX;
      tooltip
        .attr('x', tooltipX)
        .attr('y', e.offsetY - 20)
        .attr('display', 'block');

      let tooltipBBox = tooltip.node().getBBox();
      if (tooltipX < tooltipBBox.width / 2) tooltipX = tooltipBBox.width / 2;
      else if (this.width - tooltipX < tooltipBBox.width / 2)
        tooltipX = this.width - tooltipBBox.width / 2;

      tooltip
        .attr('x', tooltipX)
        .attr('y', e.offsetY - 20)
        .attr('display', 'block');
    },
    handleMouseOut(e, datum){
      //debugger;
      d3.select('#lifepath')
        .selectAll('path')
        .attr("stroke", d => d.color)
        .attr("fill", d => d.color)
        .style('filter', 'saturate(100%) opacity(100%)');
      d3.select('#lifepath-tooltip')
        .selectAll('text')
        .filter((d, i) => d == datum)
        .attr('display', 'none');
    },
    dateToAge(s) {
      return d3
        .scaleTime()
        // .domain([new Date("1983-10-01"), this.today])
        .domain([new Date("1983-10-01"), new Date("1984-10-01")])
        .range([0, 1])(new Date(s))
    },
    datumFromAge(datum){
      return datum.from || this.dateToAge(datum.fromDate) || 0
    },
    datumToAge(datum){

      return datum.to || this.dateToAge(datum.toDate) || this.dateToAge(this.today)
    },
    datumDuration(datum) {
      return this.datumToAge(datum) - this.datumFromAge(datum)
    },
    formatYears(x) {
      let y = Math.floor(x);
      let m = Math.floor((x - y) * 12);
      let d = Math.floor((((x - y) * 12 - m) * 365.25) / 12);
      if (y == 0) {
        if (m == 0) return `${d}d`;
        if (d == 0) return `${m}mo`;
        return `${m}mo${d}d`;
      }
      if (m == 0) return `${y}y`;
      return `${y}y${m}mo`;
    },
    // numTracks : new Set(this.data_t.map(d => d.track)).size,
    






  },

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
  left:830px;
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
  left:920px;
  border-top: 18px solid #455a64;
  border-right: 18px solid #ffffff;
  border-bottom: 0px solid #ffffff;
  z-index:98;
}
</style>
