import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Input } from 'webapps-react';

import Calendar from './Calender';
import { getDateISO } from './helpers/calendar';

class DatePicker extends React.Component {

    state = { date: null, calendarOpen: false, calendarFocus: false }

    showCalendar = () => {
        if (!this.props.readOnly) {
            this.setState({ calendarOpen: true })
        }
    }

    handleChange = evt => evt.preventDefault()

    inputBlur = () => {
        if (this.state.calendarOpen && !this.state.calendarFocus) {
            this.setState({ calendarOpen: false });
        }
    }

    calendarEnter = () => {
        this.setState({ calendarFocus: true });
    }
    calendarLeave = () => {
        this.setState({ calendarFocus: false });
    }

    handleDateChange = date => {
        const { onDateChange } = this.props;
        const { date: currentDate } = this.state;
        const newDate = getDateISO(date);

        (currentDate !== newDate) && this.setState({ date: newDate, calendarOpen: false }, () => {
            (typeof onDateChange === 'function') && onDateChange(newDate);
        });
    }

    get value() {
        return this.state.date || '';
    }

    get date() {
        const { date } = this.state;
        return date ? new Date(date) : null;
    }

    componentDidMount() {
        const { value: date } = this.props;

        const newDate = getDateISO(date ? new Date(date) : null);

        newDate && this.setState({ date: newDate });
    }

    componentDidUpdate(prevProps) {
        const { value: date } = this.props;
        const { value: prevDate } = prevProps;

        const dateISO = getDateISO(new Date(date));
        const prevDateISO = getDateISO(new Date(prevDate));

        (dateISO !== prevDateISO) && this.setState({ date: dateISO });
    }

    labelClasses = classNames(
        'block',
        'mb-2',
        'text-sm',
        'font-medium',
        'text-gray-700',
        'dark:text-gray-300',
        this.props.labelClassName,
    )

    render() {
        const {
            wrapperClassName,
            label,
            id,
            name,
            readOnly,
            action
        } = this.props;

        const { calendarOpen } = this.state;
        const [value, placeholder] = [this.value, 'YYYY-MM-DD'].map(v => v.replace(/-/g, ' / '));

        return (
            <div className={wrapperClassName}>
                {
                    (label !== '') ? <label htmlFor={id} className={this.labelClasses}>{label}</label> : null
                }
                <div className="relative">
                    <Input
                        id={id}
                        name={name}
                        type="text"
                        value={value}
                        onChange={this.handleChange}
                        onFocus={this.showCalendar}
                        onBlur={this.inputBlur}
                        placeholder={placeholder}
                        inputClassName={classNames('pl-10',this.props.inputClassName)}
                        wrapperClassName=""
                        readOnly={readOnly}
                        action={action} />
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2" onClick={this.showCalendar}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </span>
                    <div className={`bg-white dark:bg-gray-600 absolute shadow-lg p-2 rounded-lg z-50 ${(calendarOpen) ? '' : 'hidden'}`}>
                        {calendarOpen && <Calendar date={this.date} onDateChanged={this.handleDateChange} enter={this.calendarEnter} leave={this.calendarLeave} />}
                    </div>
                </div>
            </div>
        )
    }

}

DatePicker.propTypes = {
    value: PropTypes.string,
    onDateChange: PropTypes.func
};

export default DatePicker;