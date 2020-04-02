/* eslint-disable no-return-assign */
import _ from 'lodash/fp'
import React from 'react'
import PropTypes from 'prop-types'
import Slider from 'rc-slider'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import topodata from './us.json'
import './style.scss'

const projection = d3.geoAlbersUsa()
const path = d3.geoPath().projection(projection)
const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', zoomed)

function zoomed () {
  d3.select('g').style('stroke-width', 1.5 / d3.event.scale + 'px')
  d3.select('g').attr('transform', d3.event.transform)
}
function zoomIn (props) {
  let { width, height, selectedCity } = props
  let lat = selectedCity.latLng[0]
  let lon = selectedCity.latLng[1]
  let point = { 'type': 'Point', 'coordinates': [lon, lat] }
  const centroid = path.centroid(point)
  const x = centroid[0]
  const y = centroid[1]
  const scale = 4
  const translateX = width / 2 - scale * x
  const translateY = height / 2 - scale * y


  d3.select('svg').transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale))
}

function zoomOut () {
  d3.select('svg').transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity)
}

const Choropleth = class Choropleth extends React.Component {
  constructor (props) {
    super(props)
    this.onMarkerClick = this.onMarkerClick.bind(this)
    this.addMap = this.addMap.bind(this)
    this.addFeatures = this.addFeatures.bind(this)
    this.addMesh = this.addMesh.bind(this)
    this.updateMarkers = this.updateMarkers.bind(this)
    this.updateNumbers = this.updateNumbers.bind(this)
    this.handleRange = this.handleRange.bind(this)
    this.state = {rangeValue: zoom.scaleExtent()[0]}
  }
  handleRange (event) {
    this.setState({rangeValue: event.target.value})
  }
  addMap (selection) {
    selection.selectAll('path')
      .call(this.addFeatures)
    selection.append('path')
      .call(this.addMesh)
  }

  updateMarkers (selection, props = this.props) {
    // ;
    const markers = _.cloneDeep(props.selectedMap.mapData.markers)
    const className = _.kebabCase(props.selectedMap.id)
    const circle = selection.selectAll('circle')
      .data(markers)
    circle.exit().remove()
    circle
      .enter().append('circle')
      .merge(circle)
      .attr('cx', marker => {
        let lat = marker.latLng[0]
        let lon = marker.latLng[1]
        let points = projection([lon, lat])
        if (!points || !points[1]) {
          throw new Error('Missing coordinates', marker)
        }
        return points[0]
      })
      .attr('cy', marker => {
        let lat = marker.latLng[0]
        let lon = marker.latLng[1]
        let points = projection([lon, lat])
        if (!points || !points[1]) {
          throw new Error('Missing coordinates', marker)
        }
        return points[1]
      })
      .attr('r', d => d.seriesValue === 'topTen' ? '16px' : '5px')
      .attr('class', `marker ${className}`)
      .on('click', this.onMarkerClick)
  }

  updateNumbers (selection, props = this.props) {
    const markers = _.filter(marker => marker.seriesValue === 'topTen', props.selectedMap.mapData.markers)
    const text = selection.selectAll('text')
      .data(markers)
    text.exit().remove()
    text
      .enter().append('text')
      .merge(text)
      .text(d => d.rank)
      .attr('x', marker => {
        let lat = marker.latLng[0]
        let lon = marker.latLng[1]
        let points = projection([lon, lat])
        if (!points || !points[1]) {
          throw new Error('Missing coordinates', marker)
        }
        return points[0]
      })
      .attr('y', marker => {
        let lat = marker.latLng[0]
        let lon = marker.latLng[1]
        let points = projection([lon, lat])
        if (!points || !points[1]) {
          throw new Error('Missing coordinates', marker)
        }
        return points[1] + 3
      })
      .attr('text-anchor', 'middle')
      .style('font-family', 'sans-serif')
      .attr('font-size', '11px')
      .attr('fill', '#ffffff')
      .on('click', this.onMarkerClick)
  }
  addFeatures (selection) {
    selection
      .data(topojson.feature(topodata, topodata.objects.states).features)
      .enter().append('path')
      .attr('d', path)
      .attr('class', 'feature')
  }

  addMesh (selection) {
    selection
      .datum(topojson.mesh(topodata, topodata.objects.states, (a, b) => a !== b))
      .attr('class', 'mesh')
      .attr('d', path)
  }



  onStop () {
    if (d3.event.defaultPrevented) d3.event.stopPropagation()
  }


  onMarkerClick (d) {
    this.props.onMarkerClick(d)
  }
  componentDidMount () {
    let { width, height } = this.props
    projection
      .scale(1000)
      .translate([width / 2, height / 2])

    d3.select(this.g).call(this.addMap)
    d3.select(this.g).call(this.updateMarkers)
    d3.select(this.g).call(this.updateNumbers)
  }

  shouldComponentUpdate (nextProps, nextState) {
    let { selectedMap, selectedCity } = this.props
    if ((selectedMap.id !== nextProps.selectedMap.id) ||
        (selectedMap.year !== nextProps.selectedMap.year) ||
        (selectedMap.stateFilter !== nextProps.selectedMap.stateFilter)) {

      d3.select(this.g).call(this.updateMarkers, nextProps)
      d3.select(this.g).call(this.updateNumbers, nextProps)
    }
    if (!nextProps.selectedCity) {
      zoomOut()
    } else {
      zoomIn(nextProps)
    }
   
    return false
  }

  render () {
    const handleStyle = {
      'background-color': '#0096d6',
      'width': '15px',
      'height': '15px',
      'border-radius': '300px'
    }
   
    return (
      <div styleName="container">
        <svg width={this.props.width} height={this.props.height} ref={(node) => this.svg = node}>
          <rect styleName="background" width={this.props.width} height={this.props.height} />
          <g ref={(node) => this.g = node} />
        </svg>
      </div>
    )
  }
}

Choropleth.propTypes = {
  selectedMap: PropTypes.object.isRequired,
  selectedCity: PropTypes.object,
  onMarkerClick: PropTypes.func.isRequired,
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired
}
export default Choropleth
