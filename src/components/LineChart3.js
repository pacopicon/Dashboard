import * as React from "react";
import * as d3 from "d3";
import { easement } from '../helpers'
import '../styles/LineChart.css'

import * as Axis from "d3-axis";

class LineChart3 extends React.Component {
  constructor() {
    super();

    this.state = {
      totalLength: '',
      TEXT: '',
      NUMERIC: [new Date(), 0, 0, 0, 0, 0, 0],
      data: [0,0,0,0,0],
      data: [],
      line: '',
      hori: '',
      vert: '',
      frmHeight: '',
      frmWidth: ''

    };
  }

  componentWillReceiveProps(nextProps) {
    let 
      oldData = this.props.data,
      data    = nextProps.data,
      height  = nextProps.height,
      width   = nextProps.width,
      margin  = nextProps.margin
    
    if (oldData != data) {
      this.paintChart(margin, height, width, data, false)
    }
  }

  componentDidMount() {
    let {
          data,
          NUMERIC,
          TEXT,
          height,
          width,
          margin
        } = this.props

    this.setState({
      data,
      NUMERIC,
      TEXT,
      height,
      width,
      margin
    }, () => {
      this.paintChart(margin, height, width, data, true)
    })
  }

  paintChart = (margin, height, width, data, isFirstLoad) => {
    let 
      minX      = d3.min(data.map(o => o.date)),
      maxX      = d3.max(data.map(o => o.date)),
      minY      = d3.min(data.map(o => o.price)),
      maxY      = d3.max(data.map(o => o.price)),
      axlHeight = height - margin.top - margin.bottom,
      axlWidth  = width - margin.left - margin.right,
      frmHeight = height + margin.top + margin.bottom,
      frmWidth  = width + margin.left + margin.right,
      xScale    = d3.scaleTime().domain([minX, maxX]).range([0, axlWidth]),
      yScale    = d3.scaleLinear().domain([minY, maxY]).range([axlHeight, 0]),
      xAxis     = d3.axisBottom().scale(xScale).ticks(20).tickSize(-axlHeight),
      yAxis     = d3.axisLeft().scale(yScale).ticks(10).tickSize(-axlWidth),
      lineDraw  = d3.line().x(function(d) {
                    return xScale(d.date)
                  })
                  .y(function(d) {
                    return yScale(d.price)
                  }),
      line      = d3.selectAll("#line"),
      svg       = d3.select('.svg'),
      hori      = d3.select('#hori'),
      vert      = d3.select('#vert')

    svg
      .attr("width", frmWidth)
      .attr("height", frmHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    hori.transition()
      .duration(1000)
      .ease(easement)
      .attr("class", "x axis")
      .attr("stroke-width", 1)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    vert.transition()
      .duration(1000)
      .ease(easement)
      .attr("stroke-width", 1)
      .attr("class", "y axis")
      .call(yAxis);

    if (isFirstLoad && line) {
      console.log('line = ', line)
      console.log('line.node() = ', line.node())
      let totalLength = line.node().getTotalLength();
      line
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength)
        .attr("stroke-width", 1)
        .attr("stroke", "#6788ad")
        .transition()
        .duration(1000)
        .ease(easement)
        // .attr("stroke-width", 0) // this makes the line disappear
        .attr("stroke-dashoffset", 0);
    } else if (line) {
      line.transition()
        .duration(1000)
        .ease(easement)
        .attr("stroke-width", 1)
        .attr("stroke", "#6788ad")
        .attr("d", lineDraw(data))
        .on("end", () => 
          this.setState({
            data
          })
        )
    }

    this.setState({
      line,
      hori,
      vert,
      frmHeight,
      frmWidth
    })

  }

  render() {
    let {
          line,
          hori,
          vert,
          data,
          NUMERIC,
          TEXT,
          frmHeight,
          frmWidth
        } = this.state;

    let { 
          height, 
          width 
        }  = this.props

    const boxStyles = {
      width: frmWidth,
      height: frmHeight,
      borderRadius: 5,
      margin: "0 auto"
    };

    // const minX = d3.min(data.map(o => o.date));
    // const maxX = d3.max(data.map(o => o.date));
    // const minY = d3.min(data.map(o => o.price));
    // const maxY = d3.max(data.map(o => o.price));

    // let xScale = d3
    //   .scaleLinear()
    //   .domain([minX, maxX])
    //   .range([0, width]);

    // let yScale = d3
    //   .scaleTime()
    //   .domain([minY, maxY])
    //   .range([height, height / 3]);

    // let line = d3
    //   .line()
    //   .x(function(d) {
    //     return xScale(d.date);
    //   })
    //   .y(function(d) {
    //     return yScale(d.price);
    //   });
    
    // let svg = d3.select(".svg")
    //   .attr("width", width + margin.left + margin.right)
    //   .attr("height", height + margin.top + margin.bottom)
    //   .append("g")
    //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // let xAxis = d3.axisBottom().scale(xScale).ticks(20).tickSize(-height)
    // let yAxis = d3.axisLeft().scale(yScale).ticks(10).tickSize(-width)

    // d3.select('#xAxis')
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(xAxis);
    
    // d3.select('#yAxis')
    //   .call(yAxis);

    // let area = d3
    //   .area()
    //   .x(function(d) {
    //     return x(d.date);
    //   })
    //   .y0(function(d) {
    //     return maxY;
    //   })
    //   .y1(function(d) {
    //     return y(d.price);
    //   });

    return (
      <div style={boxStyles}>
        {
          line && vert && hori 
          ? <div>
                  {/*<div className="stockInfo">
                <h1><p>{TEXT[0]} ({TEXT[1]}) <small>sector: {TEXT[2]}</small></p></h1>
                <div className="rightInfo col-xs-6">
                  <h3>open: ${NUMERIC.open}</h3>
                  <h3>high: ${NUMERIC.high}</h3>
                  <h3>low: ${NUMERIC.low}</h3>
                </div>
                <div className="leftInfo col-xs-6">
                  <h3>close: ${NUMERIC.close}</h3>
                  <h3>volume: {NUMERIC.totalVol}</h3>
                  <small>last update: {NUMERIC.date} ({NUMERIC.alert})</small>
                </div>
              </div>*/}

              <svg className="svg" height={height} width={width}>
                <defs>
                  <linearGradient id="MyGradient">
                    <stop offset="-10%" stopColor="#3b83d4" />
                    <stop offset="95%" stopColor="#6788ad" />
                  </linearGradient>
                </defs>
                <path
                  id={"line"}
                  d={line(data)}
                  fill={"transparent"}
                  stroke={"transparent"}
                />
                  {/* <path
                    id={"area"}
                    d={area(data)}
                    fill={"url(#MyGradient)"}
                    style={{ opacity: 0.8 }}
                  /> */}
                <g id="hori">
                </g>
                <g id="vert">
                </g>

              </svg>
              <div className="select">
                <form>
                  {
                    !this.props.isFetchingAPI 
                      ? this.props.renderSecuritiesOptions()
                      : <div>waiting on Data</div> 
                  }
                  { this.props.renderTimeOptions() }
                </form>
              </div>
            </div>
          : null
        }
      </div>
    );
  }
}

export default LineChart3
