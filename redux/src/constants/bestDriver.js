import _ from 'lodash/fp'
import bestDriverData from 'data/best-driver-2017.json'

const BEST_DRIVER_DATA = _.map(location => _.extend({
  cityState: location.City + ', ' + location.State,
  latLng: [ location.Lat, location.Lon ],
  newLocation: location['New Location'],
  mostImproved: location['Most Improved'],
  biggestDecrease: location['Biggest Decrease'],
  metropolitanArea: location['Metropolitan Area']
}, location), bestDriverData)

export default BEST_DRIVER_DATA
