import React, { Component } from "react";
import * as d3 from "d3";
import { XAxis, YAxis, YGrid, Line } from "./ChartComponents.js";

class LineChart extends Component {
  constructor(props) {
    super();

  }

  updateScale(props) {
    const data = props.data;
    const xScale = d3.scaleTime();
    const yScale = d3.scaleLinear().nice();

    const xDomain = d3.extent(data, d => d.date);
    const yDomain = props.yDomain || [0, d3.max(data, d => props.yFn(d))];

    xScale
      .domain(xDomain)
      .range([0, props.width - (props.margin.left + props.margin.right)]);

    
    yScale
      .domain(yDomain)
      .range([props.height - (props.margin.top + props.margin.bottom), 0]);
      
      return {xScale, yScale}
  }
  
  updatePlotSize(props){
    const plotWidth =
      props.width - (props.margin.left + props.margin.right);
    const plotHeight =
      props.height - (props.margin.top + props.margin.bottom);
      
      return {plotWidth, plotHeight}
    
    
  }
  

  render() {
    const {xScale, yScale} =  this.updateScale(this.props);

    const {plotWidth, plotHeight} = this.updatePlotSize(this.props);
      
    const metaData = {
      xScale: xScale,
      yScale: yScale,
      plotWidth: plotWidth,
      plotHeight: plotHeight,
      xSlide: -xScale(this.props.xFn(this.props.data[1]))
    };
    const plotData = {
      plotData: this.props.data.map((d, i) => {
        return {
          id: i,
          data: d,
          x: xScale(this.props.xFn(d)),
          y: yScale(this.props.yFn(d))
        };
      })
    };

    return (
      <svg width={this.props.width} height={this.props.height}>
        <g
          className="axisLaeyr"
          width={plotWidth}
          height={plotHeight}
          transform={`translate(${this.props.margin.left}, ${this.props.margin
            .top})`}
        >
          <YGrid {...metaData} />
          <XAxis {...metaData} transform={`translate(0,${plotHeight})`} />
          <YAxis {...metaData} />
        </g>
        <g
          className="plotLayer"
          width={plotWidth}
          height={plotHeight}
          transform={`translate(${this.props.margin.left}, ${this.props.margin
            .top})`}
        >
          <Line {...metaData} {...plotData} />
        </g>
      </svg>
    );
  }
}

export default LineChart;