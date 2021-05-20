import React from 'react';
import { PersonSelect } from '../Selects';

const PersonFilter = props => {
    const {
        people,
        onChange,
        value
    } = props;

    if (!props.display) {
        return null;
    }

    return (
        <div className="flex flex-auto px-4 lg:px-10 py-4">
            <div className="w-full lg:w-3/12">
                <label className="block py-2">Select the person you wish to display</label>
            </div>
            <div className="w-full lg:w-9/12">
                <PersonSelect options={people} onChange={onChange} value={value} />
            </div>
        </div>
    )
}

export default PersonFilter;