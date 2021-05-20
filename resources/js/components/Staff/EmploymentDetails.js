import React from 'react';

const EmploymentDetails = props => {
    const {
        person,
        change,
        check
    } = props;

    return (
        <div className="bg-white dark:bg-gray-800 py-6 px-6 rounded shadow-xl mt-8">
            <section>
                <p className="text-xl font-semibold mb-6">Employment Details</p>
                <div className="flex flex-auto py-2">
                    <div className="w-full lg:w-6/12 flex flex-auto px-2 lg:px-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="title">Job Title</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <input name="title"
                                type="text"
                                id="title"
                                value={person.title || ''}
                                onChange={change}
                                className="input-field" />
                        </div>
                    </div>
                    <div className="w-full lg:w-6/12 flex flex-auto px-2 lg:px-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="phone">Phone Number</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <input name="phone"
                                type="text"
                                id="phone"
                                value={person.phone || ''}
                                onChange={change}
                                className="input-field" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-auto py-2">
                    <div className="w-full lg:w-4/12 flex flex-auto px-2 lg:px-5">
                        <label className="block py-2 pr-4 ml-auto" htmlFor="onLeave">Staff member is on leave</label>

                        <div className="relative inline-block w-10 mr-auto mt-2 align-middle select-none">
                            <input type="checkbox"
                                checked={(person.onLeave === "1" || person.onLeave === 1)}
                                id="onLeave"
                                onChange={check}
                                className="checked:bg-gray-500 outline-none focus:ring-0 focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                            <label htmlFor="onLeave" className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" />
                        </div>
                    </div>
                    <div className="w-full lg:w-4/12 flex flex-auto px-2 lg:px-5">
                        <label className="block py-2 pr-4 ml-auto" htmlFor="isCover">Staff member is Maternity Cover</label>

                        <div className="relative inline-block w-10 mr-auto mt-2 align-middle select-none">
                            <input type="checkbox"
                                checked={(person.isCover === "1" || person.isCover === 1)}
                                id="isCover"
                                onChange={check}
                                className="checked:bg-gray-500 outline-none focus:ring-0 focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                            <label htmlFor="isCover" className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" />
                        </div>
                    </div>
                    <div className="w-full lg:w-4/12 flex flex-auto px-2 lg:px-5">
                        <label className="block py-2 pr-4 ml-auto" htmlFor="isSenior">Staff member is Senior</label>

                        <div className="relative inline-block w-10 mr-auto mt-2 align-middle select-none">
                            <input type="checkbox"
                                checked={(person.isSenior === "1" || person.isSenior === 1)}
                                id="isSenior"
                                onChange={check}
                                className="checked:bg-gray-500 outline-none focus:ring-0 focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                            <label htmlFor="isSenior" className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default EmploymentDetails;