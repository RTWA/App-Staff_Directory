import React, { useEffect } from 'react';
import ReactUserAvatar from 'react-user-avatar';

import { DatePicker } from '../DatePicker'

const PersonalDetails = props => {
    const {
        person,
        change,
        dateChange
    } = props;

    return (
        <div className="relative bg-white dark:bg-gray-800 py-6 px-6 rounded shadow-xl">
            <div className="w-20 h-20 text-white flex items-center absolute rounded-full p-2 shadow-xl bg-indigo-600 dark:bg-indigo-500 left-4 -top-6">
                {/* TODO: Actual picture */}
                {
                    (person.forename !== undefined)
                        ? <img className="w-20 rounded-full" src={`https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`} id="person-photo" alt={`${person.forename} ${person.surname} - Photo`} />
                        : <ReactUserAvatar size="64" name={`${person.forename || 'Creating'} ${person.surname || 'New Record'}`} />
                }
            </div>
            <section>
                <p className="text-xl font-semibold my-2 ml-20 -mt-3">{person.forename || 'Creating'} {person.surname || 'New Record'}</p>
                <div className="flex flex-auto py-2 mt-8">
                    <div className="w-full lg:w-6/12 flex flex-auto px-2 lg:px-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="forename">Forename</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <input name="forename"
                                type="text"
                                id="forename"
                                value={person.forename || ''}
                                onChange={change}
                                className="input-field" />
                        </div>
                    </div>
                    <div className="w-full lg:w-6/12 flex flex-auto px-2 lg:px-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="surname">Surname</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <input name="surname"
                                type="text"
                                id="surname"
                                value={person.surname || ''}
                                onChange={change}
                                className="input-field" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-auto py-2">
                    <div className="w-full lg:w-6/12 flex flex-auto px-2 lg:px-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="username">Username</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <input name="username"
                                type="text"
                                id="username"
                                value={person.username || ''}
                                onChange={change}
                                className="input-field" />
                        </div>
                    </div>
                    <div className="w-full lg:w-6/12 flex flex-auto px-2 lg:px-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="employee_id">Employee ID</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <input name="employee_id"
                                type="text"
                                id="employee_id"
                                value={person.employee_id || ''}
                                onChange={change}
                                className="input-field" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-auto py-2">
                    <div className="w-full lg:w-6/12 flex flex-auto px-2 lg:px-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="email">Email Address</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <input name="email"
                                type="text"
                                id="email"
                                value={person.email || ''}
                                onChange={change}
                                className="input-field" />
                        </div>
                    </div>
                    <div className="w-full lg:w-6/12 flex flex-auto px-2 lg:px-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="employee_id">Start Date</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <DatePicker value={person.startDate || ''} onDateChange={dateChange} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PersonalDetails;