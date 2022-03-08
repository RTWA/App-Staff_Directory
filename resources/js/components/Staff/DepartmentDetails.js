import React from 'react';
import { Switch } from 'webapps-react';
import { DepartmentSelect } from '../Selects';

const DepartmentDetails = props => {
    const { person, departments, hide } = props;

    console.log(hide);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-xl mt-8">
            <section>
                <p className="text-xl font-semibold mb-2 sm:mb-6">Department Details</p>
                {
                    Object.keys(person.departments).map(function (d, i) {
                        let department = person.departments[d];
                        return (
                            <div className="w-full flex flex-col items-center xl:flex-row my-2 p-2.5 sm:py-0 bg-gray-50 dark:bg-gray-700 border-2 sm:border-0 border-gray-200 dark:border-gray-600 rounded-lg dark:text-white" key={i}>
                                <div className={`flex flex-col sm:flex-row w-full ${(hide.includes('head')) ? 'xl:w-12/12' : 'xl:w-10/12'}`}>
                                    <div className="flex flex-row items-center w-full w-full sm:w-auto">
                                        <span className="font-medium xl:font-normal text-sm xl:text-base">Department</span>
                                        <div className="flex items-center ml-auto sm:ml-2 mr-1 sm:mr-0">
                                            <a href="#" onClick={e => { e.preventDefault(); departments.remove(i); }} className="text-red-500 inline-block ml-auto">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex-1 xl:px-4">
                                        <DepartmentSelect departments={departments.list} selected={department} index={i} onChange={departments.change} boxed={false} />
                                    </div>
                                </div>
                                {
                                    (hide.includes('head'))
                                        ? null
                                        : (
                                            <Switch checked={(department['head_id'] == person.id)}
                                                id={`hod-${i}`}
                                                name={`hod-${i}`}
                                                label="Head of Department"
                                                className="flex flex-row items-center pt-2 xl:pt-0 xl:w-2/12"
                                                onChange={() => {
                                                    departments.toggleHod(department, i)
                                                }} />
                                        )
                                }
                            </div>
                        )
                    })
                }
                <div className="flex justify-center">
                    <a href="#" className="flex items-center" onClick={departments.add}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-500 inline-block" viewBox="0 0 20 20" fill="currentColor">
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