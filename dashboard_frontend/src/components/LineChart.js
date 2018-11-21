import * as React from "react"
import * as d3 from "d3"
import { easement } from '../helpers'
import '../styles/styles.css'
import * as Axis from "d3-axis"

class LineChart extends React.Component {
  constructor() {
    super()

    this.state = {
      totalLength: '',
      TEXT: '',
      NUMERIC: [new Date(), 0, 0, 0, 0, 0, 0],
      data: [],
      line: '',
      hori: '',
      vert: '',
      frmHeight: '',
      frmWidth: ''

    }
  }

  componentWillReceiveProps(nextProps) {
    let 
      oldData = this.props.data,
      data    = nextProps.data,
      height  = nextProps.height,
      width   = nextProps.width,
      margin  = nextProps.margin,
      scootRt = nextProps.scootRt,
      tickTxtSz = nextProps.tickTextSize

    if (oldData != data && tickTxtSz) {
      this.applyTransitions(margin, height, width, scootRt, tickTxtSz, data, false)
    }
  }

  componentDidMount() {
    let {
          data,
          NUMERIC,
          TEXT,
          height,
          width,
          margin,
          scootRt,
          tickTxtSz
        } = this.props
console.log('tickTxtSz = ', tickTxtSz)
    this.setState({
      data,
      NUMERIC,
      TEXT,
      height,
      width,
      margin,
      scootRt,
      tickTxtSz
    }, () => {
      this.applyTransitions(margin, height, width, scootRt, tickTxtSz, data, false)
    })
  }

  calculateScales = (data, height, width, margin) => {
    let
      minX      = d3.min(data.map(o => o.date)),
      maxX      = d3.max(data.map(o => o.date)),
      minY      = d3.min(data.map(o => o.price)),
      maxY      = d3.max(data.map(o => o.price)),
      axlHeight = height - margin.top - margin.bottom,
      axlWidth  = width - margin.left - margin.right,
      xScale    = d3.scaleTime().domain([minX, maxX]).range([0, axlWidth]),
      yScale    = d3.scaleLinear().domain([minY, maxY]).range([axlHeight, 0])
  
    return {
      xScale,
      yScale,
      axlHeight, 
      axlWidth
    }
  }

  drawLine = (data, height, width, margin) => {
    let
      res    = this.calculateScales(data, height, width, margin),
      yScale = res.yScale, 
      xScale = res.xScale

    const drawLine  = d3.line().x(function(d) {
      return xScale(d.date)
    })
    .y(function(d) {
      return yScale(d.price)
    })
    
    return drawLine(data)
  }

  applyTransitions = (margin, height, width, scootRt, tickTxtSz, data, isFirstLoad) => {
    console.log('tickTxtSz = ', tickTxtSz)
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
      line      = d3.selectAll("#line"),
      svg       = d3.select('.svg'),
      hori      = d3.select('#hori'),
      vert      = d3.select('#vert'),
      scootLf   = 0,
      scootDn   = 0

    svg
      .attr("width", frmWidth.toString())
      .attr("height", frmHeight.toString())

    hori.transition()
      .duration(1000)
      .ease(easement)
      .attr("stroke-width", 1)
      .attr("width", "880")
      .attr("transform", `translate(${scootRt}, ${axlHeight})`)
      .call(xAxis)

    vert.transition()
      .duration(1000)
      .ease(easement)
      .attr("stroke-width", 1)
      .attr("text-anchor", "end")
      .attr("transform", `translate(${scootRt}, ${scootDn})`)
      .call(yAxis)

    let 
      horiTickText = d3.selectAll('#vert .tick text'),
      vertTickText = d3.selectAll('#hori .tick text')

    horiTickText
      .attr("transform", `translate(${axlWidth+scootRt}, ${scootDn})`)
      .attr("font-size", `${tickTxtSz} px`)
    vertTickText
      .attr("transform", `translate(${scootLf},0)`)
      .attr("font-size", `${tickTxtSz} px`)
    line
      .attr("transform", `translate(${scootRt}, ${scootDn})`)

    if (isFirstLoad && line) {
      // console.log('line = ', line)
      // console.log('line.node() = ', line.node())
      let totalLength = line.node().getTotalLength()
      line
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength)
        .attr("stroke-width", 1)
        .attr("stroke", "#6788ad")
        .transition()
        .duration(1000)
        .ease(easement)
        // .attr("stroke-width", 0) // this makes the line disappear
        .attr("stroke-dashoffset", 0)
      
    } else if (line) {
      line.transition()
        .duration(1000)
        .ease(easement)
        .attr("d", this.drawLine(data, height, width, margin))
        .on("end", () => 
          this.setState({
            data
          })
        )
    }

    this.setState({
      // line,
      // hori,
      // vert,
      frmHeight,
      frmWidth
    })

  }

  render() {
    let {
          data,
          NUMERIC,
          TEXT,
          frmHeight,
          frmWidth
        } = this.state

    let { 
          height, 
          width,
          margin 
        }  = this.props

    const boxStyles = {
      width: frmWidth,
      height: frmHeight,
      borderRadius: 5,
      margin: "0 auto"
    }

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
        <svg className="svg" height={600} width={820}>
          <path
            id={"line"}
            d={this.drawLine(data, height, width, margin)}
            fill={"transparent"}
            stroke={"transparent"}
          />
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
    )
  }
}

export default LineChart
