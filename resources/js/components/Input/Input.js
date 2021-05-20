import React from 'react';
import classNames from 'classnames';

let id = '';

const Input = props => {
    const {
        error,
        state,
        className
    } = props;

    const classes = classNames(
        className,
        'input-field',
        (state === 'error') ? 'border-red-500 text-red-500' : '',
        (state === 'saved') ? 'border-green-500 text-green-500' : '',
        (state === 'saving') ? 'border-orange-500' : '',
    );

    // render

    return (
        <>
            <input {...props} className={classes} />
            {
                (state === 'error' && error !== '') ?
                    (
                        <span className="text-sm text-red-500">{error}</span>
                    ) : null
            }
        </>
    )
}

export default Input;