import * as COLORS from './colors'

const VECTOR_MAP_BASE = {
  map: 'us_aea_en',
  backgroundColor: COLORS.WHITE,
  zoomStep: 2,
  zoomOnScroll: false,
  regionStyle: {
    initial: {
      fill: COLORS.LIGHT_GRAY
    },
    hover: {
      'fill-opacity': 1
    }
  },
  regionLabelStyle: {
    initial: {
      display: 'none'
    },
    hover: {
      display: 'none'
    }
  },
  onRegionTipShow: function (e) {
    e.preventDefault()
  },
  markerLabelStyle: {
    initial: {
      display: 'none'
    },
    hover: {
      display: 'visible'
    }
  },
  markers: [],
  series: {
    markers: [{
      values: [],
      attribute: 'r',
      scale: {
        'topTen': 16,
        'notTopTen': 5
      }
    }]
  },
  regionsSelectable: false,
  markersSelectable: false,
  markersSelectableOne: false,
  onMarkerTipShow: function (e) {
    e.preventDefault()
    // console.log('onMarkerTipShow', arguments)
  }
}

const CLASS_MARKER_BASE = 'jvectormap-marker jvectormap-element'
// const CLASS_MARKER_TOP_CITY_MOST_IMPROVED = CLASSNAME_MARKER_BASE
// const CLASS_MARKER_TOP_CITY_NEW_LOCATION = CLASSNAME_MARKER_BASE + ' '

const MARKER_STYLE_TOP_CITY = {
  initial: {
    stroke: COLORS.LIGHT_CYAN_BLUE,
    fill: COLORS.DARK_CYAN_BLUE,
    'class': CLASS_MARKER_BASE
  }
}

const MARKER_STYLE_DENSITY = {
  initial: {
    stroke: COLORS.LIGHT_MAGENTA_RED,
    fill: COLORS.MAGENTA_RED,
    'class': CLASS_MARKER_BASE
  }
}

const MARKER_STYLE_RAIN_SNOW = {
  initial: {
    stroke: COLORS.LIGHT_BLUE,
    fill: COLORS.DARK_BLUE,
    'class': CLASS_MARKER_BASE
  }
}

const VECTOR_MAPS = {
  TOP_CITY: Object.assign({}, VECTOR_MAP_BASE, {
    markerStyle: MARKER_STYLE_TOP_CITY
  }),
  DENSITY: Object.assign({}, VECTOR_MAP_BASE, {
    markerStyle: MARKER_STYLE_DENSITY
  }),
  RAIN_SNOW: Object.assign({}, VECTOR_MAP_BASE, {
    markerStyle: MARKER_STYLE_RAIN_SNOW
  })
}

export default VECTOR_MAPS
