import React, { useEffect } from 'react';
import { APIClient, FlyoutContent, FlyoutHeader, } from 'webapps-react';

const DepartmentMembersFlyout = props => {
    const {
        department,
        setDepartment,
        closeMembers,
        setHead
    } = props;

    const APIController = new AbortController();

    useEffect(() => {
        return () => {
            APIController.abort();
        }
    }, []);

    const setAsHead = async (e, id) => {
        e.preventDefault();

        await APIClient(`/api/apps/StaffDirectory/department/${department.id}/head/${id}`, {}, { signal: APIController.signal, method: 'PUT' })
            .then(json => {
                department.head_id = id;
                setDepartment({ ...department });
                closeMembers();
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: Handle errors
                    console.log(error);
                }
            });
    }

    const remove = async (e, _person) => {
        e.preventDefault();

        await APIClient(`/api/apps/StaffDirectory/person/${_person}/department/${department.id}`, {}, { signal: APIController.signal, method: 'DELETE' })
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
                if (!error.status?.isAbort) {
                    // TODO: Handle errors
                    console.log(error);
                }
            });
    }

    if (department.people === undefined) {
        return null;
    }

    return (
        <>
            <FlyoutHeader closeAction={closeMembers}>Department Members</FlyoutHeader>
            <FlyoutContent>
                {
                    (department.people.length === 0)
                        ? <p className="text-center">This department has no members</p>
                        : Object(department.people).map(function (person, i) {
                            return (
                                <div className="flex flex-row items-center py-2" key={i}>
                                    <img key={i}
                                        className="inline-block h-10 w-10 rounded-full border-2 border-gray-500 white dark:border-gray-50 mr-4"
                                        src={`/apps/StaffDirectory/view/person/${person.id}/photo`}
                                        id={`photo-${person.id}`}
                                        alt={`${person.forename} ${person.surname} - Photo`} />
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
            </FlyoutContent>
        </>
    )
}

export default DepartmentMembersFlyout;
