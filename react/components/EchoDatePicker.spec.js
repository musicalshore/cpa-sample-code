import React from 'react'
import _ from 'lodash/fp'
import moment from 'moment'
import EchoDatePicker from './EchoDatePicker.js'

Date.now = jest.fn(() => 1497589200001)

const props = {
  ...EchoDatePicker.defaultProps,
  onDateSelect: jest.fn()
}
const setup = (additionalProps = {}) => {
  const allProps = {
    ...props,
    ...additionalProps
  }
  return {
    props: allProps,
    wrapper: shallow(<EchoDatePicker {...allProps} />),
    mounted: mount(<EchoDatePicker {...allProps} />)
  }
}

describe('<EchoDatePicker />', () => {
  it('should set the default state', () => {
    const {wrapper, props} = setup()
    expect(wrapper).toHaveState('isActive', false)
    expect(wrapper).toHaveState('locale', props.locale)
    expect(wrapper).toHaveState('inputDateFormat', ['L', 'YYYY-MM-DD', 'MM/DD/YYYY'])
    expect(wrapper).toHaveState('placeholder', '--/--/----')
    expect(wrapper).toHaveState('value', '')
    expect(wrapper).toHaveState('startDate', moment().clone().startOf('month'))
    expect(wrapper).toHaveState('endDate', moment().clone().endOf('month'))
    expect(wrapper).toMatchSnapshot()
  })
  it('should call onDateSelect', () => {
    const todayMoment = moment()
    const tomorrowMoment = moment().add(1, 'd')
    const {wrapper, props} = setup({
      value: todayMoment
    })
    expect(wrapper).toHaveState('value', todayMoment.format(...props.inputDateFormat))
    wrapper.instance().dateSelect(tomorrowMoment)
    expect(props.onDateSelect).toHaveBeenCalledWith(tomorrowMoment.format(...props.inputDateFormat))
    expect(wrapper).toMatchSnapshot()
  })

  it('should update the value', () => {
    const todayMoment = moment()
    const tomorrowMoment = moment().add(1, 'd')
    const {wrapper, props} = setup({
      value: todayMoment
    })
    expect(wrapper).toHaveState('value', todayMoment.format(...props.inputDateFormat))
    wrapper.instance().dateSelect(tomorrowMoment)
    expect(wrapper).toHaveState('value', tomorrowMoment.format(...props.inputDateFormat))
  })
})