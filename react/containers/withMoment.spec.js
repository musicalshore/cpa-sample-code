import React from 'react'
import moment from 'moment'
import _ from 'lodash/fp'
import withMoment from './withMoment'

const LOCAL_DATETIME = '2019-01-30 09:00:00'
const ISO8601_GMT = '2019-01-30T15:00:00+00:00'
Date.now = jest.fn(() => 1517324400000)
const MockComponent = jest.fn(() => {
  return class {
    render () {
      return <div />
    }
  }
})
const Component = withMoment(MockComponent)
var props = {...Component.defaultProps}

describe('withMoment', () => {
  describe('formatTime', () => {
    const wrapper = shallow(<Component />)
    const formatTime = wrapper.state().formatTime
    it('should format a JS Date', () => {
      const value = moment('9:00 AM', 'LT', 'en').toDate()
      expect(formatTime(value)).toBe('9:00 AM')
    })
    it('should format a string', () => {
      expect(formatTime('9:00 AM')).toBe('9:00 AM')
    })
    it('should format a local datetime string', () => {
      expect(formatTime(LOCAL_DATETIME)).toBe('9:00 AM')
    })
    it('should format Moments', () => {
      expect(formatTime(moment(ISO8601_GMT))).toBe('9:00 AM')
    })
  })

  describe('normalizeTime', () => {
    const normalizeTime = shallow(<Component />).instance().normalizeTime
    it('should return null if value is invalid', () => {
      expect(normalizeTime('foo')).toBe(null)
      expect(normalizeTime('')).toBe(null)
      expect(normalizeTime(null)).toBe(null)
      expect(normalizeTime()).toBe(null)
    })
    it('should return a formatted time string if value is valid', () => {
      expect(normalizeTime(ISO8601_GMT)).toBe('9:00 AM')
      expect(normalizeTime(LOCAL_DATETIME)).toBe('9:00 AM')
      expect(normalizeTime(moment(ISO8601_GMT))).toBe('9:00 AM')
      expect(normalizeTime(new Date(Date.now()))).toBe('9:00 AM')
    })
  })

  describe('validateTime', () => {
    const validateTime = shallow(<Component minimumTime={'11:00 AM'} maximumTime={'12:00 PM'} />).instance().validateTime
    it('should return true for valid time values', () => {
      expect(validateTime(ISO8601_GMT)).toBe(true)
      expect(validateTime(LOCAL_DATETIME)).toBe(true)
      expect(validateTime(moment(ISO8601_GMT))).toBe(true)
      expect(validateTime(new Date(Date.now()))).toBe(true)
    })
    it('should return false if value is invalid', () => {
      expect(validateTime('foo')).toBe(false)
      expect(validateTime('')).toBe(false)
      expect(validateTime(null)).toBe(false)
      expect(validateTime()).toBe(false)
    })
  })
  describe('getMoment', () => {
    const value = moment()
    it('should set the locale', () => {
      expect(shallow(<Component locale="es" />).state().getMoment(value).locale()).toBe('es')
    })
    it('should persist the locale', () => {
      const value = moment()
      value.locale('es')
      expect(shallow(<Component locale="ca" />).state().getMoment(value).locale()).toBe('ca')
    })

    it('should return an invalid moment if input is inscrutable', () => {
      const getMoment = shallow(<Component />).state().getMoment
      let foo // undefined value
      expect(moment.isMoment(getMoment(foo))).toBe(true)
      expect(getMoment(foo).isValid()).toBe(false)
      expect(moment.isMoment(getMoment('foo'))).toBe(true)
      expect(getMoment('foo').isValid()).toBe(false)
    })
  })
  describe('moment (wrapper)', () => {
    it('should set and persist the locale', () => {
      const value = moment()
      value.locale('es')
      expect(shallow(<Component />).instance().moment(ISO8601_GMT).locale()).toBe(props.locale)
      expect(shallow(<Component locale="ca" />).instance().moment(value).locale()).toBe('ca')
      expect(shallow(<Component locale="ca" />).instance().moment(value).locale()).not.toBe('es')
      expect(shallow(<Component locale="ca" />).instance().moment(value).locale()).not.toBe(props.locale)
    })

    it('should set and persist the timezone', () => {
      const value = moment.tz(ISO8601_GMT, 'America/New_York')
      expect(value.format('LT')).toBe('10:00 AM')
      const momentWrapper = shallow(<Component timeZone="America/Los_Angeles" />).instance().moment
      expect(momentWrapper(ISO8601_GMT).format('LT')).toBe('7:00 AM')
    })
  })
  describe('timeInRange', () => {
    const rangeProps = {
      ...props,
      minimumTime: '2000-01-10 10:00:00',
      maximumTime: '2000-01-10 12:00:00'
    }
    const timeInRange = shallow(<Component {...rangeProps} />).state().timeInRange
    it('should check if minimumTime <= time <=  maximumTime and ignore the date part', () => {
      expect(timeInRange('2000-01-10 11:00:00')).toBe(true)
      expect(timeInRange('2000-01-10 13:00:00')).toBe(false)
      expect(timeInRange('2000-01-10 09:00:00')).toBe(false)
      expect(timeInRange('11:00:00')).toBe(true)
      expect(timeInRange('13:00:00')).toBe(false)
      expect(timeInRange('09:00:00')).toBe(false)
    })
  })
  describe('render', () => {
    it('should render what it wrapped', () => {
      expect(shallow(<Component />).is(MockComponent)).toBe(true)
    })
  })
})