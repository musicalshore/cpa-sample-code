import React from 'react'
import {string, array, object, bool, instanceOf, oneOfType, func} from 'prop-types'
import Styles from './EchoDatePicker.scss'
import classnames from 'classnames'

import Calendar from './../../shared_components/InternalDateComponents/Calendar'
import moment from 'moment'
import momentTimeZone from 'moment-timezone'
import { EchoDropDown } from './../EchoDropDown'
import { EchoInput } from './../EchoInput'
import { EchoButton } from './../EchoButton';
import _ from 'lodash/fp'

/**
 * Enter description.
 *
 * @name EchoDatePicker
 * @published
 * @status done
 * @stability experimental
 */
const EchoDatePicker = class EchoDatePicker extends React.Component {
  constructor (props) {
    super(props)
    const inputDateFormat = _.castArray(props.inputDateFormat)
    const valueMoment = props.value === '' || !this.moment(props.value, inputDateFormat).isValid() ? this.moment() : this.moment(props.value, inputDateFormat)
    let placeholder
    if (_.isEmpty(props.placeholder)) {
      var str = valueMoment.format(...inputDateFormat)
      placeholder = _.replace(/[^/.]/gi, '-', str)
    } else {
      placeholder = props.placeholder
    }

    this.state = {
      isActive: false,
      inputDateFormat,
      locale: props.locale,
      timeZone: props.timeZone,
      startDate: valueMoment.clone().startOf('month'),
      endDate: valueMoment.clone().endOf('month'),
      value: props.value === '' ? '' : valueMoment.format(...inputDateFormat),
      placeholder,
      error: props.error
    }

    this.debounceOnDateSelect = _.debounce(100, this.props.onDateSelect);
  }

  moment = (...args) => {
    let localMoment = momentTimeZone.locale(this.props.locale);;
    if (this.props.timeZone) {
      localMoment = momentTimeZone.tz.apply(null, [...args, this.props.timeZone]);
    } else {
      localMoment = momentTimeZone.apply(null, args);
    }

    return localMoment
  }

  componentWillReceiveProps (nextProps) {
    let nextState = {};

    const inputDateFormat = _.castArray(nextProps.inputDateFormat)
    const valueMoment = this.moment(nextProps.value, inputDateFormat).isValid() ? this.moment(nextProps.value, inputDateFormat) : this.moment();
    const value = nextProps.value === '' ? '' : valueMoment.format(...inputDateFormat);

    if (!_.isEqual(value, this.props.value)) {
      const startDate = valueMoment.clone().startOf('month');
      const endDate = valueMoment.clone().endOf('month');

      this.inputValue = value;
      nextState = {...nextState, startDate, endDate, value};
    }

    if (!_.isEqual(this.props.error, nextProps.error)) {
      nextState = {...nextState, error: nextProps.error};
    }

    this.setState(nextState);
  }

  goToNextMonth = e => {
    e.preventDefault()
    let currentMonth = this.state.startDate
    let nextMonth = this.moment(currentMonth).add(1, 'month')
    this.setState({
      startDate: nextMonth,
      endDate: nextMonth.endOf('month')
    })
  }

  goToPrevMonth = e => {
    e.preventDefault()
    let currentMonth = this.state.startDate
    let prevMonth = this.moment(currentMonth).subtract(1, 'month')
    this.setState({
      startDate: prevMonth,
      endDate: prevMonth.endOf('month')
    })
  }

  dateSelect = (date, event) => {
    const value = date.format(...this.state.inputDateFormat);
    this.inputValue = value;
    this.updateValue(this.inputValue, true); // always raise event on selection
    this.setState({
      isActive: false
    });
  }

  dropDownStateHook = state => {

    if (this.state.isActive !== state.isOpen) {
      this.updateValue(this.inputValue, !state.isOpen);
      this.setState({isActive: state.isOpen})
    }
  };

  inputChange = e => {
    this.inputValue = e.target.value;
  }

  dateInRange = (date, min, max) => {
    let inRange = true

    if (min) {
      inRange &= date.isAfter(min)
    }
    if (max) {
      inRange &= date.isBefore(max)
    }
    return inRange
  }

  timeInRange = (time, min, max) => {
    let inRange = true

    if (min) {
      inRange &= !time.isBefore(min)
    }
    if (max) {
      inRange &= !time.isAfter(max)
    }
    return inRange;
  }

  updateValue = (value, raiseEvent) => {
    if (typeof raiseEvent === 'undefined') raiseEvent = true;
    let date = this.moment(value, this.state.inputDateFormat);
    if ((value !== '' && !date.isValid()) || !this.dateInRange(date, this.props.minimumDate, this.props.maximumDate)) {
      date = this.moment(this.state.value, this.state.inputDateFormat);
    }
    let dateValue = null;
    if (date.isValid()) {
      dateValue = date.format(...this.state.inputDateFormat);
      if (!_.isEqual(this.state.value, dateValue)) {
        this.setState({
          value: dateValue,
          startDate: date.clone().startOf('month'),
          endDate: date.clone().endOf('month'),
          error: ''
        });
      }
    } else {
      this.setState({ value: '', error: '' })
    }

    if (raiseEvent) {
      // this.debounceOnDateSelect(dateValue);
      this.props.onDateSelect(dateValue)
    }
  }

  onBlur = e => {
    this.updateValue(e.target.value, !this.state.isActive);
  }

  render () {
    const subcomponentMods = [
      {
        component: [ 'day' ],
        events: {
          onClick: this.dateSelect
        }
      },
      {
        date: this.moment(),
        classNames: ['Current'],
        component: ['day']
      },
      {
        date: this.moment(this.state.value, _.head(this.state.inputDateFormat)),
        classNames: ['Selected'],
        component: ['day']
      }
    ]
    let calendar = (
      <div className={Styles.calendarWrapper}>
        <Calendar
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          minimumDate={this.props.minimumDate}
          maximumDate={this.props.maximumDate}
          next={this.goToNextMonth}
          prev={this.goToPrevMonth}
          mods={subcomponentMods}
          locale={this.state.locale}
          monthNameFormat={this.props.headerDateFormat}
          timeZone={this.state.timeZone}
        />
        { this.props.showTodayButton &&
          <div className={Styles.todayButtonWrapper}>
            <hr />
            <EchoButton
              onClick={() => this.dateSelect(this.moment())}
              isDisabled={this.moment(this.state.value).isSame(this.moment(), 'day')}
              className={Styles.todayButton}
            >
              {this.props.todayButtonText}
            </EchoButton>
          </div>
        }
      </div>
    )

    let dropdownClasses = classnames({[this.props.dropDownClassName]: this.props.dropDownClassName}, Styles.datePickerDropdown)
    let inputClasses = classnames({[this.props.inputClassName]: this.props.inputClassName}, Styles.datePickerInput, {
      [ Styles.inputIsActive ]: this.state.isActive
    })

    // If not showing the input box, just render the calendar
    let input = null
    if (this.props.showInput) {
      input = (
        <EchoDropDown
          contents={calendar}
          isActiveFunction={this.dropDownStateHook}
          isDisabled={this.props.isDisabled}
          isOpen={this.state.isActive}
          closeIfLabelClicked={false}
          className={dropdownClasses}
        >
          <EchoInput
            className={inputClasses}
            leftIcon={{name: 'ico-date', color: '$gray'}}
            rightIcon={{name: 'ico-chevron-down', color: '$gray', width: 16, className: Styles['datePickerChevron']}}
            value={this.state.value}
            label={this.props.label}
            error={this.state.error}
            placeholder={this.state.placeholder}
            isRequired={this.props.isRequired}
            isReadOnly={this.props.isReadOnly}
            isDisabled={this.props.isDisabled}
            showIsRequiredText={this.props.showIsRequiredText}
            onChange={this.inputChange}
            onBlur={this.onBlur}
          />
        </EchoDropDown>
      )
    } else {
      input = (
        <div>
          {calendar}
        </div>
      )
    }
    return <div className={this.props.className}>{input}</div>
  }
}

EchoDatePicker.defaultProps = {
  onDateSelect: _.noop,
  showInput: true,
  showTodayButton: false,
  todayButtonText: 'Today',
  locale: 'en',
  headerDateFormat: 'MMMM YYYY',
  inputDateFormat: ['L', 'YYYY-MM-DD', 'MM/DD/YYYY'],
  placeholder: '',
  value: ''
}
EchoDatePicker.propTypes = {
  /**
     * Starting value for datepicker (shown in input). defaults to current date.
     * Value is passed to momentjs date library, so for best, most consistent results,
     * value should be formatted as
     * EITHER
     * an ISO_8601 string (YYYY-MM-DD),
     * OR
     * a js Date object,
     * OR
     * a momentjs date object
     */

  value: oneOfType([
    string,
    instanceOf(Date),
    instanceOf(moment),
    instanceOf(momentTimeZone)
  ]),
  /**
     * Adds the specified class to the outer div of EchoDatePicker
     */
  className: string,
  /**
     * Adds the specified class to the EchoDropDown component of EchoDatePicker
     */
  dropDownClassName: string,
  /**
     * Adds the specified class to the EchoInput component of EchoDatePicker
     */
  inputClassName: string,
  /**
     * Label for the DatePicker input
     */
  label: string,

  /**
     * handler for date selection. receives the selected date as a parameter
     */
  onDateSelect: func,
  /**
     * Error to be displayed.
     */
  error: string,
  /**
     * Placeholder text to be displayed.
     */
  placeholder: string,
  /**
     * Controls if input is required.
     */
  isRequired: bool,
  /**
     * Controls if input is read only.
     */
  isReadOnly: bool,
  /**
     * Controls if input is disabled.
     */
  isDisabled: bool,
  /**
     * determines whether or not to show the warning text that an input is required.
     */
  showIsRequiredText: bool,
  /**
     * Determines whether or not to show input box. If false, only the calendar will be rendered.
     */
  showInput: bool,

  /**
     * Determines what locale the calendar should be set to. Defaults to English
     */
  locale: string,

  /**
   * determines TimeZone for date formatting. Defaults to English
   */
  timeZone: string,

  /**
     * Date format to show in header of date picker
     */
  headerDateFormat: string,

  /**
     * Date format to show when modal is closed. Defaults to ["L", "YYYY-MM-DD", "MM/DD/YYYY].
     * L (locale specific) i.e en => MM/DD/YYYY, es => DD/MM/YYYY. Can contain a date format string or an array of date format strings.
     */
  inputDateFormat: oneOfType([
    string,
    array
  ]),

  /**
     * Earliest date that can be selected (moment object)
     */
  minimumDate: object,

  /**
    * Latest date that can be selected (moment object)
    */
  maximumDate: object,
  /**
   * Shows/Hides the today button, default is false
   */
  showTodayButton: bool,
  /**
   * The text to show in the Today Button
   */
  todayButtonText: string

}

export default EchoDatePicker