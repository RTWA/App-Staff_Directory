import React from 'react';
import PropTypes from 'prop-types';
import calendar, { isDate, dateDiff, isSameDay, isSameMonth, getDateISO, getDateArray, getNextMonth, getPreviousMonth, getMonthDays, WEEK_DAYS, CALENDAR_MONTHS } from './helpers/calendar';
import DateButton from './DateButton';

class Calendar extends React.Component {

    state = { ...this.stateFromProp(), today: new Date }

    stateFromDate({ date } = {}) {
        const { current: stateCurrent } = this.state || {};
        const currentDate = date || stateCurrent;
        const current = currentDate;

        const calendarDate = current || new Date;

        const [year, month] = getDateArray(
            calendarDate
        );

        return { current, month, year, };
    }

    stateFromProp() {
        return this.stateFromDate(this.props);
    }

    changeHandler = date => () => {
        const { onDateChanged } = this.props;
        (typeof onDateChanged === 'function') && onDateChanged(date);
    }

    getCalendarDates = () => {
        const { current, month, year } = this.state;
        const [currentYear, currentMonth] = current ? getDateArray(current) : [];
        return calendar(new Date([year || currentYear, month || currentMonth]));
    }

    gotoDate = date => evt => {
        evt && evt.preventDefault();
        const { current } = this.state;
        const isCurrent = current && isSameDay(date, current);

        !(isCurrent) && this.setState(this.stateFromDate({ date }), this.changeHandler(date));
    }

    gotoPreviousMonth = () => {
        const { month, year } = this.state;
        const previousMonth = getPreviousMonth(new Date([year, month]));
        const previous = new Date([previousMonth.year, previousMonth.month]);

        this.setState(previousMonth);
    }

    gotoNextMonth = () => {
        const { month, year } = this.state;
        const nextMonth = getNextMonth(new Date([year, month]));
        const next = new Date([nextMonth.year, nextMonth.month]);

        this.setState(nextMonth);
    }

    gotoPreviousYear = () => {
        const { month, year } = this.state;
        const previous = new Date([year - 1, month]);
        this.setState({ year: year - 1 });
    }

    gotoNextYear = () => {
        const { month, year } = this.state;
        const next = new Date([year + 1, month]);
        this.setState({ year: year + 1 });
    }

    handlePressure = evt => (fn, fnShift) => {
        if (typeof fn === 'function' && typeof fnShift === 'function') {
            this.pressureShift = evt.shiftKey;
            this.pressureShift ? fnShift() : fn();

            this.pressureTimeout = setTimeout(() => {
                this.pressureTimer = setInterval(() => this.pressureShift ? fnShift() : fn(), 100);
            }, 500);

            document.addEventListener('keyup', this.handlePressureKeyup);
            document.addEventListener('keydown', this.handlePressureKeydown);
        }
    }

    handlePressureKeyup = evt => {
        evt.preventDefault();
        !evt.shiftKey && (this.pressureShift = !evt.shiftKey && false);
    }

    handlePressureKeydown = evt => {
        evt.preventDefault();
        evt.shiftKey && (this.pressureShift = true);
    }

    clearPressureTimer = () => {
        this.pressureTimer && clearInterval(this.pressureTimer);
        this.pressureTimeout && clearTimeout(this.pressureTimeout);

        this.pressureShift = false;

        document.removeEventListener('keyup', this.handlePressureKeyup);
        document.removeEventListener('keydown', this.handlePressureKeydown);
    }

    clearDayTimeout = () => {
        this.dayTimeout && clearTimeout(this.dayTimeout);
    }

    handlePrevious = evt => {
        evt && (
            evt.preventDefault(),
            this.handlePressure(evt)(this.gotoPreviousMonth, this.gotoPreviousYear)
        );
    }

    handleNext = evt => {
        evt && (
            evt.preventDefault(),
            this.handlePressure(evt)(this.gotoNextMonth, this.gotoNextYear)
        );
    }

    leftChevron = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        );
    }

    rightChevron = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        );
    }

    renderMonthAndYear = () => {
        const { month, year } = this.state;
        const monthname = Object.keys(CALENDAR_MONTHS)[Math.max(0, Math.min(month - 1, 11))];
        const props = { onMouseUp: this.clearPressureTimer };

        return (
            <div className="flex items-center justify-between">
                <button className="inline-block outline-none cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-500" 
                        title="Previous" onMouseDown={this.handlePrevious} {...props}>{this.leftChevron()}</button>
                <div className="text-center select-none font-semibold p-2">{monthname} {year}</div>
                <button className="inline-block outline-none cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-500"
                         title="Next" onMouseDown={this.handleNext} {...props}>{this.rightChevron()}</button>
            </div>
        )
    }

    renderDayLabels = (day, index) => {
        const daylabel = WEEK_DAYS[day].toUpperCase();
        return <div className="text-center select-none font-semibold w-8 m-1" style={{}} key={`${daylabel}-${index}`} index={index}>{daylabel}</div>
    }

    renderCalendarDate = (date, index) => {
        const { current, month, year, today } = this.state;
        const thisDay = new Date(date);
        const monthFirstDay = new Date([year, month]);

        const isToday = !!today && isSameDay(thisDay, today);
        const isCurrent = !!current && isSameDay(thisDay, current);
        const inMonth = !!(month && year) && isSameMonth(thisDay, monthFirstDay);

        const props = {
            index,
            isToday,
            isCurrent,
            inMonth,
            onClick: this.gotoDate(thisDay),
            title: thisDay.toDateString()
        };

        return (
            <DateButton key={getDateISO(thisDay)} onClick={props.onClick} {...props} >
                { thisDay.getDate()}
            </DateButton>
        )
    }

    componentDidMount() {
        const tomorrow = new Date().setHours(0, 0, 0, 0) + (24 * 60 * 60 * 1000);

        this.dayTimeout = setTimeout(() => {
            this.setState({ today: new Date }, this.clearDayTimeout);
        }, dateDiff(tomorrow));
    }

    componentDidUpdate(prevProps) {
        const { date, min, max } = this.props;
        const { date: prevDate, min: prevMin, max: prevMax } = prevProps;

        const dateMatch = (date === prevDate) || isSameDay(date, prevDate);
        const minMatch = (min === prevMin) || isSameDay(min, prevMin);
        const maxMatch = (max === prevMax) || isSameDay(max, prevMax);

        !(dateMatch && minMatch && maxMatch) && this.setState(this.stateFromDate(date), this.changeHandler(date));
    }

    componentWillUnmount() {
        this.clearPressureTimer();
        this.clearDayTimeout();
    }

    render() {
        return (
            <div onMouseEnter={this.props.enter} onMouseLeave={this.props.leave}>

                { this.renderMonthAndYear()}

                <div className="grid" style={{ gridTemplate: 'repeat(7, auto) / repeat(7, auto)' }}>
                    <React.Fragment>
                        {Object.keys(WEEK_DAYS).map(this.renderDayLabels)}
                    </React.Fragment>

                    <React.Fragment>
                        {this.getCalendarDates().map(this.renderCalendarDate)}
                    </React.Fragment>
                </div>

            </div>
        )
    }

}

Calendar.propTypes = {
    min: PropTypes.instanceOf(Date),
    max: PropTypes.instanceOf(Date),
    date: PropTypes.instanceOf(Date),
    onDateChanged: PropTypes.func
};

export default Calendar;