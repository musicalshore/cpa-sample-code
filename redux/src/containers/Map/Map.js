import { connect } from 'react-redux'
import _ from 'lodash/fp'
import Choropleth from 'components/Choropleth'
import { selectCity } from 'redux/actions'

const mapStateToProps = (state) => {
  return {
    selectedMap: state.selectedMap,
    currentYear: state.currentYear,
    selectedCity: state.selectedCity
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onMarkerClick: (selectedCity) => {
      dispatch(selectCity(selectedCity))
    }
  }
}

const Map = connect(
  mapStateToProps,
  mapDispatchToProps
)(Choropleth)

export default Map

