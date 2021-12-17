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
        <div className="w-full flex flex-col xl:flex-row py-4 px-4">
            <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="person_select">
                Select the person you wish to display
            </label>
            <PersonSelect
                name="person_select"
                id="person_select"
                options={people}
                onChange={onChange}
                value={value} />
        </div>
    )
}

export default PersonFilter;