import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";

const ConfirmDeleteButton = props => {
    const {
        text,
        confirmText,
        onClick,
        timeout,
        className,
        initialColor,
        confirmColor,
        icon
    } = props;

    const [waiting, setWaiting] = useState(false);

    const onConfirm = e => {
        e.preventDefault();
        setWaiting(false);
        onClick();
    }

    const onQuery = e => {
        e.preventDefault();
        setWaiting(true);

        setTimeout(() => {
            setWaiting(false);
        }, timeout)
    }

    const queryClasses = classNames(
        className,
        initialColor
    )

    const confirmClasses = classNames(
        className,
        confirmColor
    )

    const trashIcon = () => {
        if (icon) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            )
        }
        return null;
    }

    return (
        waiting ?
            <a href="#" onClick={onConfirm} className={confirmClasses}>{trashIcon()} {confirmText}</a> :
            <a href="#" onClick={onQuery} className={queryClasses}>{trashIcon()} {text}</a>
    )
}

ConfirmDeleteButton.propTypes = {
    text: PropTypes.string,
    confirmText: PropTypes.string,
    onClick: PropTypes.func,
    timeout: PropTypes.number,
    className: PropTypes.string,
    initialColor: PropTypes.string,
    confirmColor: PropTypes.string,
    icon: PropTypes.bool,
}

ConfirmDeleteButton.defaultProps = {
    text: "DELETE",
    confirmText: "DELETE - Are you sure?",
    timeout: 2000,
    className: 'mx-auto my-auto px-4 py-2',
    initialColor: 'bg-red-500',
    confirmColor: 'bg-orange-500',
    icon: true
}

export default ConfirmDeleteButton;