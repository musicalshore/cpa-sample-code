import { connect } from 'react-redux'
import { selectMap, selectCity, selectState } from 'redux/actions'
import TabbedMap from 'components/TabbedMap'


const mapStateToProps = (state) => {
  return {
    selectedMap: state.selectedMap,
    selectedCity: state.selectedCity,
    selectedState: state.selectedState
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onMapSelect: (selectedMap) => {
      dispatch(selectMap(selectedMap))
    },
    onCitySelect: (selectedCity) => {
      dispatch(selectCity(selectedCity))
    }
  }
}

const Report = connect(
  mapStateToProps,
  mapDispatchToProps
)(TabbedMap)

export default Report

