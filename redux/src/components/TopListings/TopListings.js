import _ from 'lodash/fp'
import React from 'react'
import PropTypes from 'prop-types'
import Listing from 'components/Listing'
import './style.scss'

// const years = ['2007', '2008', '2009', '2010', '2011', '2012', '2014', '2015', '2016', '2017']


const TopListings = ({ onCitySelect, selectedMap, selectedCity }) => (
  <div styleName="container">
    <div styleName={`heading ${_.kebabCase(selectedMap.id)}`}>
      <h4 styleName="year">{ selectedMap.year }</h4>
      <h3 styleName="title">
        {selectedMap.id === 'TOP_CITY' && 'Top Cities'}
        {selectedMap.id === 'DENSITY' && 'Population Density'}
        {selectedMap.id === 'RAIN_SNOW' && 'Rain & Snow'}
      </h3>
      <p styleName="byline">
        {(selectedMap.id === 'TOP_CITY') && 'Explore which cities are least likely to experience collisions.'}
        {selectedMap.id === 'DENSITY' && 'See how population density impacts driving in your city.'}
        {selectedMap.id === 'RAIN_SNOW' && 'See how precipitation (or lack thereof) impacts your city\'s ranking.'}
      </p>
    </div>
    <Listing selectedMap={selectedMap} selectedCity={selectedCity} onCitySelect={onCitySelect} />
  </div>
)

TopListings.propTypes = {
  onCitySelect: PropTypes.func.isRequired,
  selectedMap: PropTypes.object.isRequired,
  selectedCity: PropTypes.object
}

export default TopListings
