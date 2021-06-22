import React from 'react';
import classNames from 'classnames';
import { withWebApps } from 'webapps-react';

const DateButton = props => {
    const { UI, isToday, isCurrent, inMonth, onClick } = props;

    const classes = classNames(
        'text-center',
        'select-none',
        'm-1',
        'w-8',
        'rounded',
        'hover:bg-gray-200',
        'dark:hover:bg-gray-500',
        (inMonth) ? '' : 'text-gray-300 dark:text-gray-500',
        (isCurrent) ? `text-${UI.theme}-600 font-semibold bg-gray-50 dark:bg-gray-700 dark:text-${UI.theme}-500` : '',
        (isToday) ? 'bg-gray-200 dark:bg-gray-800' : '',
    )
    
    
    return <div className={classes} onClick={onClick}>{props.children}</div>
}

export default withWebApps(DateButton);