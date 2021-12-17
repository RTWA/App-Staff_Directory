import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'webapps-react';

const TypeAhead = ({ data, labelKey, select, placeholder, noMatchesText, limit, ...props }) => {
    const [active, setActive] = useState(0);
    const [filtered, setFiltered] = useState([]);
    const [show, setShow] = useState(false);
    const [input, setInput] = useState('');

    const onChange = e => {
        const input = e.currentTarget.value;

        const _filtered = data.filter(
            item => item[labelKey].toLowerCase().indexOf(input.toLowerCase()) > -1
        );

        setActive(0);
        setFiltered(_filtered);
        setShow(true);
        setInput(e.currentTarget.value);
    };

    const onClick = e => {
        e.stopPropagation();

        setInput(filtered[e.currentTarget.dataset.key][labelKey]);
        select(filtered[e.currentTarget.dataset.key]);

        setActive(0);
        setFiltered([]);
        setShow(false);
    };

    const onKeyDown = e => {
        if (e.keyCode === 13) {
            setInput(filtered[active][labelKey]);
            select(filtered[active]);

            setShow(false);
            setActive(0);
        }
        else if (e.keyCode === 38) {
            if (active === 0) {
                return;
            }
            setActive(active - 1);
        }
        else if (e.keyCode === 40) {
            if (active + 1 === filtered.length) {
                return;
            }
            setActive(active + 1);
        }
    }

    let listComponent;

    if (show && input) {
        if (filtered.length) {
            let count = 1;
            listComponent = (
                <ul className="absolute inset-x-0 bg-white dark:bg-gray-700 rounded-b border border-gray-200 dark:border-gray-600 text-gray-900 text-sm font-medium dark:text-white cursor-pointer">
                    {
                        filtered.map((item, index) => {
                            if (limit === 0 || count <= limit) {
                                let className = "flex flex-row gap-x-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-900";

                                if (index === active) {
                                    className = "flex flex-row gap-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-900";
                                }

                                count = count + 1;

                                return (
                                    <li className={className} key={index} data-key={index} onClick={onClick}>
                                        {item[labelKey]}
                                    </li>
                                )
                            }
                        })
                    }
                </ul>
            )
        } else {
            listComponent = (
                <ul className="absolute inset-x-0 bg-white dark:bg-gray-700 rounded-b border border-gray-200 dark:border-gray-600 text-gray-900 text-sm font-medium dark:text-white cursor-pointer">
                    <li className="px-4 py-2 text-center"><em>{noMatchesText}</em></li>
                </ul>
            );
        }
    }

    return (
        <div className="relative w-full">
            <Input type="text" onChange={onChange} onKeyDown={onKeyDown} value={input}
                placeholder={placeholder} autoComplete="no" {...props} />
            {listComponent}
        </div>
    );
}

TypeAhead.propTypes = {
    data: PropTypes.instanceOf(Array),
    labelKey: PropTypes.string,
    select: PropTypes.instanceOf(Function),
    placeholder: PropTypes.string,
    noMatchesText: PropTypes.string,
    limit: PropTypes.number,
};

TypeAhead.defaultProps = {
    data: [],
    labelKey: 'label',
    select: function () { return true; },
    placeholder: 'Search...',
    noMatchesText: 'No matching options found!',
    limit: 0
};

export default TypeAhead;