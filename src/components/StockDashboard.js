import React, { Component } from 'react'
import '../styles/StockDashboard.css'
import LineChart from './LineChart'
import { getSecuritiesInfo } from '../helpers'
import integrateData from './APIcall'

const widMod = .60

class StockDashboard extends Component {
  constructor() {
    super()
    this.state = {
      isFetchingAPI: false,
      body_width: document.body.clientWidth * widMod,
      securities: getSecuritiesInfo(),
      security: 'MMM',
      timeScales: {'1D':1, '1W':8, '1M':32, '3M':(94), '6M':(187), '1Y':(366), '2Y':(731)},
      timeScaleArr: [1, 8, 32, 94, 187, 366, 731],
      timeScale: 1,
      TEXT: '',
      datePrice1: '',
      closeData1: '',
      datePrice8: '',
      closeData8: '',
      datePrice32: '',
      closeData32: '',
      datePrice94: '',
      closeData94: '',
      datePrice187: '',
      closeData187: '',
      datePrice366: '',
      closeData366: '',
      datePrice731: '',
      closeData731: '',
      currPrice: '',
      currClose: ''
    }

    this.renderSecuritiesOptions = this.renderSecuritiesOptions.bind(this)
    this.renderTimeOptions = this.renderTimeOptions.bind(this)
    this.handleSymbolSelection = this.handleSymbolSelection.bind(this)
    this.handleTimeScaleSelection = this.handleTimeScaleSelection.bind(this)
    this.updateData = this.updateData.bind(this)
    this.checkIfItsFetching = this.checkIfItsFetching.bind(this)
    window.addEventListener("resize", this.resize().bind(this));
    // this.callSecuritiesInfoAPI = this.callSecuritiesInfoAPI.bind(this)
    // callDatePriceAPI(1, 'MMM', this.updateData)
    
  }

  resize() {
    let t;

    return event => {
      if (t) {
        clearTimeout(t)
      }
      t = setTimeout( () => {
        const state = Object.assign(this.state, {
          body_width: document.body.clientWidth * widMod
        });
        this.setState(state)
      }, 100)
    }
  }

  

  // callSecuritiesInfoAPI() {
  //
  //   let myHeaders = new Headers({
  //     'Access-Control-Allow-Origin': 'http://localhost:3000/',
  //     'Content-Type': 'multipart/form-data'
  //   });
  //
  //   let myInit = {
  //     method : 'GET',
  //     headers: myHeaders,
  //     mode   : 'cors',
  //     cache  : 'default'
  //   }
  //
  //   let http = 'https://pkgstore.datahub.io/core/s-and-p-500-companies/latest/data/json/data/constituents.json'
  //
  //   let myRequest = new Request(http, myInit)
  //
  //   fetch(myRequest)
  //   .then(response => {
  //     return response.json()
  //   })
  //   .then(json => {
  //     this.setState({
  //       securities: json
  //     }, function() {
  //       console.log(`callSecuritiesInfoAPI json parsing SUCCEEDED!!!. call = ${http}.  json.length = ${json.length}. this.state.securities.length = ${this.state.securities.length}`)
  //     })
  //
  //   })
  //   .catch(error => {
  //     console.log('callSecuritiesInfoAPI json parsing failed: ', error)
  //   })
  // }

  updateData(datum) {
    console.log('datum in update callback = ', datum)

    let i = this.state.timeScaleArr.indexOf(this.state.timeScale)

    let 
      currPrice = datum[i].datePrice,
      currClose = datum[i].closeData
    this.setState({
      datePrice1: datum[0].datePrice,
      closeData1: datum[0].closeData,
      datePrice8: datum[1].datePrice,
      closeData8: datum[1].closeData,
      datePrice32: datum[2].datePrice,
      closeData32: datum[2].closeData,
      datePrice94: datum[3].datePrice,
      closeData94: datum[3].closeData,
      datePrice187: datum[4].datePrice,
      closeData187: datum[4].closeData,
      datePrice366: datum[5].datePrice,
      closeData366: datum[5].closeData,
      datePrice731: datum[6].datePrice,
      closeData731: datum[6].closeData,
      currPrice,
      currClose
     })
  }

  componentDidMount() {
    this.setState({
      TEXT: ['MMM','3M Company', 'Industrials']
    }, () => {
      integrateData(this.state.TEXT[0], this.updateData,this.checkIfItsFetching)
    })
  }

  renderSecuritiesOptions() {
    let { securities } = this.state
    
    if (securities) {
      let selectOptions = securities.map((security) => 
        <option key={security.Symbol} value={security.Symbol + ',' + security.Name + ',' + security.Sector}>{security.Symbol}</option>
      )
  
      return (
        <select onChange={this.handleSymbolSelection}>
          {selectOptions}
        </select> 
      )
    }
  }

  renderTimeOptions() {
    let { timeScales } = this.state

    if (timeScales) {
      let 
        periods       = Object.keys(timeScales),
        selectOptions = periods.map((period) => 
          <option key={period} value={timeScales[period]}>{period}</option>
        )
  
      return (
        <select onChange={this.handleTimeScaleSelection}>
          {selectOptions}
        </select> 
      )
    }
  }

  handleSymbolSelection(event) {
    let { timeScale } = this.state
    let string = event.target.value
    let securityArray = string.split(',')
    console.log('securityArray = ', securityArray);
    this.setState({
      TEXT: securityArray,
      timeScale: timeScale
    }, () => {
      let { TEXT } = this.state
      if (TEXT) {
        integrateData(this.state.TEXT[0], this.updateData,this.checkIfItsFetching)
      }
    })
  }

  handleTimeScaleSelection(e) {
    let num = e.target.value
    
    this.setState({
      currPrice: this.state[`datePrice${num}`],
      currClose: this.state[`closeData${num}`]
     })
  }

  checkIfItsFetching(isFetchingAPI) {
    this.setState({
      isFetchingAPI
    })
  }

  render() {

    return (
      <div className="dashboard">
        {
          this.state.currPrice.length>0 
          ? <div className="LineChartContainer">
              <LineChart 
                data={this.state.currPrice}
                TEXT={this.state.TEXT}
                NUMERIC={this.state.NUMERIC}
                securities={this.state.securities}
                isFetchingAPI={this.state.isFetchingAPI}
                renderSecuritiesOptions={this.renderSecuritiesOptions}
                renderTimeOptions={this.renderTimeOptions}
                handleSymbolSelection={this.handleSymbolSelection}
                handleTimeScaleSelection={this.handleTimeScaleSelection}
              />
            </div>
          : ''
        }
        {/* <BouncingBall /> */}
      </div>
    )
  }


}

export default StockDashboard;
