import _ from 'lodash/fp'
import React from 'react'
import PropTypes from 'prop-types'
import './style.scss'
import {YEARS, US_STATES} from 'constants/maps'

const MapSelector = class MapSelector extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleYearChange = this.handleYearChange.bind(this)
    this.handleStateChange = this.handleStateChange.bind(this)
    this.state = {
      selectedYear: this.props.selectedMap.year,
      selectedState: this.props.selectedMap.stateFilter
    }
  }
  handleYearChange (event) {
    this.setState({selectedYear: event.target.value})
  }
  handleStateChange (event) {
    this.setState({selectedState: event.target.value})
  }
  handleClick () {
    const newMap = _.extend(this.props.selectedMap, {
      year: this.state.selectedYear,
      stateFilter: this.state.selectedState
    })
    console.log('newMap', newMap);

    this.props.onMapSelect(newMap)
  }
  render () {
    let {selectedMap} = this.props
    const years = _.map(year => <option key={year} value={year}>{year}</option>, YEARS)
    const usStates = _.map(pair => <option key={pair[0]} value={pair[0]}>{pair[1]}</option>, _.toPairs(US_STATES))
    return (
      <div styleName="container">
        <label>
          Year
          <select value={this.state.selectedYear} onChange={this.handleYearChange}>
            {years}
          </select>
        </label>
        <label>
          State
          <select value={this.state.selectedState} onChange={this.handleStateChange}>
            <option value=""></option>
            {usStates}
          </select>
        </label>
        <button type="button" styleName="button" onClick={this.handleClick}>Go</button>
      </div>
    )
  }
}

MapSelector.propTypes = {
  onMapSelect: PropTypes.func.isRequired,
  selectedMap: PropTypes.object.isRequired
}
export default MapSelector
