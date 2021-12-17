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
                <div className="flex flex-col sm:flex-row mt-2">
                    <div className="w-full sm:w-6/12 flex flex-col xl:flex-row py-4 px-2">
                        <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="title">Job Title</label>
                        <Input name="title"
                            type="text"
                            id="title"
                            value={person.title || ''}
                            onChange={change} />
                    </div>
                    <div className="w-full sm:w-6/12 flex flex-col xl:flex-row py-4 px-2">
                        <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="phone">Phone Number</label>
                        <Input name="phone"
                            type="text"
                            id="phone"
                            value={person.phone || ''}
                            onChange={change} />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center my-2">
                    <div className="w-full lg:w-4/12 flex flex-row items-center px-2 py-2 xl:py-0">
                        <label className="w-8/12 font-medium xl:font-normal text-sm xl:text-base" htmlFor="onLeave">Staff member is on leave</label>
                        <Switch checked={(person.onLeave === "1" || person.onLeave === 1)}
                            id="onLeave"
                            onChange={check} />
                    </div>
                    <div className="w-full lg:w-4/12 flex flex-row items-center px-2 py-2 xl:py-0">
                        <label className="w-8/12 font-medium xl:font-normal text-sm xl:text-base" htmlFor="isCover">Staff member is Maternity Cover</label>
                        <Switch checked={(person.isCover === "1" || person.isCover === 1)}
                            id="isCover"
                            onChange={check} />
                    </div>
                    <div className="w-full lg:w-4/12 flex flex-row items-center px-2 py-2 xl:py-0">
                        <label className="w-8/12 font-medium xl:font-normal text-sm xl:text-base" htmlFor="isSenior">Staff member is Senior</label>
                        <Switch checked={(person.isSenior === "1" || person.isSenior === 1)}
                            id="isSenior"
                            onChange={check} />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default EmploymentDetails;