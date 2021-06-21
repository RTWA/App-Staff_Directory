import React from 'react';
import ReactUserAvatar from 'react-user-avatar';
import classNames from 'classnames';
import axios from 'axios';
import { withWebApps } from 'webapps-react';

const DepartmentMembersFlyout = ({UI, ...props}) => {
    const {
        department,
        setDepartment,
        closeMembers,
        show,
        setHead
    } = props;

    const panelClass = classNames(
        'absolute',
        'inset-y-0',
        'right-0',
        'max-w-full',
        'flex',
        'transform',
        'transition',
        'ease-in-out',
        'duration-500',
        (show) ? 'translate-x-0' : 'translate-x-full'
    )

    const setAsHead = (e, id) => {
        e.preventDefault();

        let formData = new FormData()
        formData.append('_method', 'PUT');

        axios.post(`/api/apps/StaffDirectory/department/${department.id}/head/${id}`, formData)
            .then(response => {
                return response;
            })
            .then(json => {
                department.head_id = id;
                setDepartment({ ...department });
                closeMembers();
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error);
            });
    }

    const remove = (e, _person) => {
        e.preventDefault();

        let formData = new FormData()
        formData.append('_method', 'DELETE');

        axios.post(`/api/apps/StaffDirectory/person/${_person}/department/${department.id}`, formData)
            .then(response => {
                return response;
            })
            .then(json => {
                department.people.map(function (p, i) {
                    if (p.id === _person) {
                        delete department.people[i];
                        department.people_count = department.people_count - 1;
                    }
                });
                setDepartment({ ...department });
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error);
            });
    }

    if (department.people === undefined) {
        return null;
    }

    return (
        <section className={panelClass} aria-labelledby="slide-over-heading">
            <div className="relative w-screen max-w-sm">
                <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl overflow-y-auto">
                    <div className={`px-4 sm:px-6 py-6 bg-${UI.theme}-600 dark:bg-${UI.theme}-900 text-white dark:text-gray-200 relative`}>
                        <div className="absolute top-0 right-0 -ml-8 pt-6 pr-2 flex sm:-ml-10 sm:pr-4">
                            <button className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={closeMembers}>
                                <span className="sr-only">Close panel</span>
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <h2 id="slide-over-heading" className="text-lg font-medium">Department Members</h2>
                    </div>
                    <div className="my-6 flex-1 px-4 sm:px-6">
                        <div className="h-full" aria-hidden="true">
                            {
                                (department.people.length === 0)
                                    ? <p className="text-center">This department has no members</p>
                                    : Object(department.people).map(function (person, i) {
                                        // TODO: Allow Manual Photos
                                        return (
                                            <div className="flex flex-row py-2" key={i}>
                                                {
                                                    (person.azure_id !== undefined && person.azure_id !== null)
                                                    ? (
                                                        <img key={i}
                                                            className="inline-block h-10 w-10 rounded-full border-2 border-gray-500 white dark:border-gray-50 mr-4"
                                                            src={`/apps/StaffDirectory/view/person/${person.id}/photo`}
                                                            id={`photo-${person.id}`}
                                                            alt={`${person.forename} ${person.surname} - Photo`} />
                                                    )
                                                    : <ReactUserAvatar key={i} size="10" name={`${person.forename} ${person.surname}`} />
                                                }
                                                <div className="flex flex-col justify-evenly">
                                                    <p className="font-semibold">{person.forename} {person.surname}</p>
                                                    {
                                                        (setHead === undefined || setHead === false)
                                                            ? (department.head_id !== person.id)
                                                                ? <a href="#" onClick={(e) => { remove(e, person.id) }} className="text-xs text-red-500">Remove Member</a>
                                                                : <p className="text-xs italic text-gray-400">Department Head</p>
                                                            : (department.head_id !== person.id)
                                                                ? <a href="#" onClick={(e) => { setAsHead(e, person.id) }} className="text-xs text-orange-500">Set as Department Head</a>
                                                                : <p className="text-xs italic text-gray-400">Current Department Head</p>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default withWebApps(DepartmentMembersFlyout);
