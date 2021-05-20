import React from 'react';
import {DepartmentSelect} from '../Selects';

const DepartmentDetails = props => {
    const { person, departments } = props;

    return (
        <div className="bg-white dark:bg-gray-800 py-6 px-6 rounded shadow-xl mt-8">
            <section>
                <p className="text-xl font-semibold mb-6">Department Details</p>
                {
                    Object.keys(person.departments).map(function (d, i) {
                        let department = person.departments[d];
                        return (
                            <div className="flex flex-row py-2 px-2 lg:px-5" key={i}>
                                <span className="block py-2 pr-4">Department</span>
                                <div className="m-1 pt-2">
                                    <a href="#" onClick={e => { e.preventDefault(); departments.remove(i); }} className="text-red-500 inline-block ml-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </div>
                                <div className="flex-1">
                                    <DepartmentSelect departments={departments.list} selected={department} index={i} onChange={departments.change} />
                                </div>
                                <div className="flex flex-row pl-2">
                                    <span className="block py-2 pr-4">Head of Department</span>
                                    <div className="relative inline-block w-10 mr-2 mt-2 align-middle select-none">
                                        <input type="checkbox"
                                            checked={(department['head_id'] == person.id)}
                                            id={`hod-${i}`}
                                            onChange={() => {
                                                departments.toggleHod(department, i)
                                            }}
                                            className="checked:bg-gray-500 outline-none focus:ring-0 focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                        <label htmlFor={`hod-${i}`} className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                <div className="w-full text-center">
                    <a href="#" onClick={departments.add}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 inline-block" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                            Add another Department
                        </a>
                </div>
            </section>
        </div>
    )
}

export default DepartmentDetails;