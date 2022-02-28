import React from 'react';
import { Input, Switch } from 'webapps-react';

const EmploymentDetails = props => {
    const {
        person,
        change,
        check
    } = props;

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-xl mt-8">
            <section>
                <p className="text-xl font-semibold mb-6">Employment Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                    <Input
                        id="title"
                        name="title"
                        label="Job Title"
                        type="text"
                        value={person.title || ''}
                        onChange={change} />
                    <Input
                        id="phone"
                        name="phone"
                        label="Phone Number"
                        type="text"
                        value={person.phone || ''}
                        onChange={change} />
                </div>
                <div className="flex flex-col lg:flex-row items-center my-2">
                    <div className="w-full lg:w-4/12 flex flex-row items-center px-2 py-2 xl:py-0">
                        <Switch checked={(person.onLeave === "1" || person.onLeave === 1)}
                            id="onLeave"
                            name="onLeave"
                            label="Staff member is on leave"
                            onChange={check} />
                    </div>
                    <div className="w-full lg:w-4/12 flex flex-row items-center px-2 py-2 xl:py-0">
                        <Switch checked={(person.isCover === "1" || person.isCover === 1)}
                            id="isCover"
                            name="isCover"
                            label="Staff member is Maternity Cover"
                            onChange={check} />
                    </div>
                    <div className="w-full lg:w-4/12 flex flex-row items-center px-2 py-2 xl:py-0">
                        <Switch checked={(person.isSenior === "1" || person.isSenior === 1)}
                            id="isSenior"
                            name="isSenior"
                            label="Staff member is Senior"
                            onChange={check} />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default EmploymentDetails;