import React from 'react'
import moment from 'moment'
import momentTimeZone from 'moment-timezone'
import _ from 'lodash/fp'
import {string, number, oneOfType, instanceOf} from 'prop-types'

const TIME_FORMAT = 'LT'
const LOCALE = 'en'
// cribbed from http://underground.infovark.com/2008/07/22/iso-date-validation-regex/
const ISO_DATETIME_REGEXP = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])-?[1-7]|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s](([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)?(\15([0-5]\d))?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/ // eslint-disable-line no-useless-escape

const withMoment = function withMoment (WrappedComponent) {
  const Wrapper = class Wrapper extends React.Component {
    constructor (props = {}) {
      super(props)
      const {timeFormat, interval} = props
      const minimumTime = this.getMoment(timeFormat, props.minimumTime)
      const maximumTime = this.getMoment(timeFormat, props.maximumTime)
      const options = this.buildTimeList(timeFormat, interval, minimumTime, maximumTime)

      this.state = {
        minimumTime,
        maximumTime,
        options,
        getMoment: this.getMoment(timeFormat),
        formatTime: this.formatTime(timeFormat),
        timeInRange: this.timeInRange(timeFormat, minimumTime, maximumTime)
      }
    }
    componentWillReceiveProps (nextProps) {
      const {timeFormat, interval} = nextProps
      const minimumTime = this.getMoment(timeFormat, nextProps.minimumTime)
      const maximumTime = this.getMoment(timeFormat, nextProps.maximumTime)
      const isNewSchedule = (!minimumTime.isSame(this.state.minimumTime, 'minute') || !maximumTime.isSame(this.state.maximumTime, 'minute') || interval !== this.props.interval)

      if (isNewSchedule) {
        this.setState({
          minimumTime,
          maximumTime
        })
      }
      if (timeFormat !== this.props.timeFormat) {
        this.setState({
          getMoment: this.getMoment(timeFormat),
          formatTime: this.formatTime(timeFormat)
        })
      }
      if (isNewSchedule || timeFormat !== this.props.timeFormat) {
        this.setState({
          options: this.buildTimeList(timeFormat, interval, minimumTime, maximumTime),
          timeInRange: this.timeInRange(timeFormat, minimumTime, maximumTime)
        })
      }
    }
    componentRef = el => { this.component = el }

    /**
   * Normalizes datetimey values
   * Returns null if value is invalid. Uses a regex that is more forgiving than Moment's parser
   * @param {*} value - A date/datetime string, JSDate, or MomentJS object
   */
    normalizeTime = value => {
      const {timeFormat} = this.props
      const valueMoment = this.getMoment(timeFormat, value)

      if (valueMoment.isValid()) {
        return valueMoment.format(timeFormat)
      } else {
        return null
      }
    }
    getMoment = _.curry((timeFormat, value) => {
      if (moment.isMoment(value) || _.isDate(value) || ISO_DATETIME_REGEXP.test(value)) {
        return this.moment(value) // ensures locale is correct
      } else if (value && this.moment(value, timeFormat).isValid()) {
        return this.moment(value, timeFormat)
      } else {
        return moment.invalid()
      }
    })
    formatTime = _.curry((timeFormat, value) => (moment.isMoment(value) ? value.format(timeFormat) : this.getMoment(timeFormat, value).format(timeFormat)))
    moment = (...args) => {
      let localMoment
      if (this.props.timeZone) {
        localMoment = momentTimeZone.tz(...args, this.props.timeZone)
      } else {
        localMoment = moment(...args);
      }
      localMoment.locale(this.props.locale)
      return localMoment
    }
    /**
     * timeInRange - checks if time falls within a range.
     * We're only concerned with the time, so we format first to ensure the dates are equal
     */
    timeInRange = _.curry((timeFormat, minimumTime, maximumTime, value) => {
      const time = this.getMoment(timeFormat, this.formatTime(timeFormat, value))
      const minTime = this.getMoment(timeFormat, this.formatTime(timeFormat, minimumTime))
      const maxTime = this.getMoment(timeFormat, this.formatTime(timeFormat, maximumTime))
      return time.isSameOrAfter(minTime, 'minute') && time.isSameOrBefore(maxTime, 'minute')
    })

    buildTimeList = _.curry((timeFormat, interval, minimumTime, maximumTime) => {
      const minTime = this.getMoment(timeFormat, minimumTime)
      const maxTime = this.getMoment(timeFormat, maximumTime)
      const startTime = minTime.clone().startOf('hour')
      const endTime = maxTime.clone().add(1, 'hour').startOf('hour')
      const duration = moment.duration(interval, 'minutes')
      const list = []

      while (!startTime.isSameOrAfter(minTime)) {
        startTime.add(duration)
      }
      while (!endTime.isSameOrBefore(maxTime)) {
        endTime.subtract(duration)
      }

      for (const time = startTime.clone(); time.isSameOrBefore(endTime); time.add(duration)) {
        if (!time.isValid()) {
          return list
        }
        list.push(time.format(timeFormat))
      }
      return list
    })

    validateTime = value => (!!value && (moment.isMoment(value) || _.isDate(value) || ISO_DATETIME_REGEXP.test(value) || this.moment(value, this.props.timeFormat).isValid()))

    toDate = value => this.state.getMoment(value).toDate()
    render () {
      const minimumTime = this.state.minimumTime.format(this.props.timeFormat)
      const maximumTime = this.state.maximumTime.format(this.props.timeFormat)

      return (
        <WrappedComponent
          {...this.props}
          validator={this.validateTime}
          toDate={this.toDate}
          options={this.state.options}
          format={this.state.formatTime}
          timeInRange={this.state.timeInRange}
          minimumTime={minimumTime}
          maximumTime={maximumTime}
          ref={this.componentRef}
        />
      )
    }
  }
  Wrapper.defaultProps = {
    ...WrappedComponent.defaultProps,
    locale: LOCALE,
    interval: 30,
    minimumTime: moment(new Date()).startOf('day'),
    maximumTime: moment(new Date()).endOf('day'),
    timeFormat: TIME_FORMAT
  }
  Wrapper.propTypes = {
    ...WrappedComponent.propTypes,
    locale: string,
    timeZone: string,
    timeFormat: string,
    minimumTime: oneOfType([string, instanceOf(Date), instanceOf(moment)]),
    maximumTime: oneOfType([string, instanceOf(Date), instanceOf(moment)]),
    interval: number
  }
  return Wrapper
}

export default withMoment