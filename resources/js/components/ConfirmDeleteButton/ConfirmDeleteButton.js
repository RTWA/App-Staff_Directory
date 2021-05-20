import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
            return <FontAwesomeIcon icon={['fas', 'trash']} />
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