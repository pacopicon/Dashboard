import * as React from "react";
import * as d3 from "d3";
import { easement } from '../helpers'

import * as Axis from "d3-axis";

class LineChart extends React.Component {
  constructor() {
    super();

    this.state = {
      totalLength: '',
      TEXT: '',
      NUMERIC: [new Date(), 0, 0, 0, 0, 0, 0],
      data: [0,0,0,0,0],
      data: []
    };
  }

  componentWillReceiveProps(nextProps) {
    let 
      oldData = this.props.data,
      data = nextProps.data
    
    if (oldData != data) {
      let 
        height    = 300,
        width     = 500,
        minX      = d3.min(data.map(o => o.date)),
        maxX      = d3.max(data.map(o => o.date)),
        minY      = d3.min(data.map(o => o.price)),
        maxY      = d3.max(data.map(o => o.price)),
        x         = d3.scaleLinear().domain([minX, maxX]).range([0, width]),
        y         = d3.scaleLinear().domain([minY, maxY]).range([height, height / 3]),
        lineDraw  = d3.line().x(function(d) {
                      return x(d.date)
                    })
                    .y(function(d) {
                      return y(d.price)
                    }),
        line      = d3.selectAll("#line") // WORKS!!!

      // let svg = d3.select(".svg").transition() // pattern # 1 -> DOES NOT WORK
      //  let svg = d3.select(this.svgRef.current) // pattern # 2 -> DOES NOT WORK
      //   |--> svgRef = React.createRef()
      //   |--> <svg className="svg" ref={this.svgRef} height={height} width={width}>
      //  let svg = d3.select(".svg") // pattern # 3 -> DOES NOT WORK
      // svg.select("#line") // pattern # 1,2,3 -> DOES NOT WORK

        
        // svg.transition() // pattern # 1,2 -> DOES NOT WORK
        // svg // pattern # 3 -> DOES NOT WORK
        line.transition() // WORKS!!!
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
  }

  componentDidMount() {
    let {
          data,
          NUMERIC,
          TEXT
        } = this.props

    this.setState({
      data,
      NUMERIC,
      TEXT
    }, () => {

      let line = d3.selectAll("#line");
      let totalLength = line.node().getTotalLength();
      console.log(totalLength);
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

    })
  }

  render() {
    let {
          data,
          NUMERIC,
          TEXT
        } = this.state;

    const height = 300;
    const width = 500;

    const boxStyles = {
      width: width,
      height: height,
      borderRadius: 5,
      margin: "0 auto"
    };

    const minX = d3.min(data.map(o => o.date));
    const maxX = d3.max(data.map(o => o.date));
    const minY = d3.min(data.map(o => o.price));
    const maxY = d3.max(data.map(o => o.price));

    let x = d3
      .scaleLinear()
      .domain([minX, maxX])
      .range([0, width]);

    let y = d3
      .scaleLinear()
      .domain([minY, maxY])
      .range([height, height / 3]);

    let line = d3
      .line()
      .x(function(d) {
        return x(d.date);
      })
      .y(function(d) {
        return y(d.price);
      });

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

          <g id={"xAxis"}>
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
    );
  }
}

export default LineChart
