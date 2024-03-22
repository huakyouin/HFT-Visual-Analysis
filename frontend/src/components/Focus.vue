<template>
  <div ref="foucus"></div>
</template>

<script>
import * as d3 from 'd3';

export default {

    data() {
        return {
            ts: [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
                [10, 11, 12],
                [13, 14, 15],
                [16, 17, 18],
                [19, 20, 21],
                [22, 23, 24]
            ],
            colors:  [
                '#1f77b4', // blue
                '#ff7f0e', // orange
                '#2ca02c', // green
                '#d62728', // red
                '#9467bd', // purple
                '#8c564b', // brown
                '#e377c2', // pink
                '#7f7f7f' // gray
            ],
            labels:  [
                'Series 1',
                'Series 2',
                'Series 3',
                'Series 4',
                'Series 5',
                'Series 6',
                'Series 7',
                'Series 8'
            ],
        }
    },
    

    mounted() {
        console.log(this.data)
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // Create scale functions
        const x = d3.scaleLinear().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        // Create the axes
        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y);

        // Define the line function
        const line = d3.line()
        .x((d, i) => x(i))
        .y((d) => y(d));

        // Add the SVG to the focus div
        const svg = d3.select(this.$refs.focus)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        // Set the domains of the x and y scales
        x.domain([0, this.data[0].length - 1]);
        y.domain([d3.min(this.data, (d) => d3.min(d)), d3.max(this.data, (d) => d3.max(d))]);

        // Add the X axis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        // Add the Y axis
        svg.append("g")
        .call(yAxis);

        // Add the lines
        for (let i = 0; i < this.data.length; i++) {
        svg.append("path")
            .datum(this.data[i])
            .attr("class", "line")
            .attr("d", line)
            .style("stroke", this.colors[i])
            .append("title")
            .text(this.labels[i]);
        }
    }
}
</script>

<style scoped>
.line {
  fill: none;
  stroke-width: 1.5px;
}
</style>