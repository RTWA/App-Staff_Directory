import React, { useContext, useEffect, useState } from 'react';
import { FlyoutsContext } from '../AppSettings';
import { APIClient, Button, ConfirmDeleteButton, FlyoutContent, FlyoutFooter, FlyoutHeader, Input, Select } from 'webapps-react';
import { AvatarPill, AvatarStack } from '../../Cards';
import DepartmentMembersFlyout from './DepartmentMembersFlyout';

const DepartmentFlyout = props => {
    const {
        departments,
        department,
        setDepartment,
        saveDepartment,
        deleteDepartment
    } = props;

    const [head, setHead] = useState();
    const [error, setError] = useState();
    const [showMembers, setShowMembers] = useState(false);
    const [settingHead, setSettingHead] = useState(false);

    const {
        current, closeFlyouts
    } = useContext(FlyoutsContext);

    const APIController = new AbortController();

    useEffect(() => {
        return () => {
            APIController.abort();
        }
    }, []);

    useEffect(async () => {
        if (department.head_id !== null && department.head_id !== undefined) {
            await APIClient(`/api/apps/StaffDirectory/person/${department.head_id}`, undefined, { signal: APIController.signal })
                .then(json => {
                    setHead(json.data.person);
                })
                .catch(error => {
                    if (!error.status?.isAbort) {
                        setError(error.data?.message);
                    }
                });
        }
    }, [department]);

    const removeHead = e => {
        e.preventDefault();
        department.head_id = null;
        setDepartment({ ...department });
        setHead(undefined);
    }

    const showSetHead = e => {
        e.preventDefault();
        setSettingHead(true);
        setShowMembers(true);
    }

    const renameDepartment = e => {
        department.name = e.target.value;
        setDepartment({ ...department });
    }

    const onParentChange = e => {
        department.department_id = e.target.value;
        setDepartment({ ...department });
    }

    if (current !== 'Department') {
        return null;
    }

    return (
        <>
            <FlyoutHeader closeAction={closeFlyouts}>
                {department.name} - Department Properties
            </FlyoutHeader>
            <FlyoutContent>
                {
                    (error)
                        ? <div className="-m-6 py-2 px-6 mb-4 bg-red-300 dark:bg-red-900 text-red-900 dark:text-red-300 text-sm">
                            <p>Failed to load Head of Department data. <span className="text-xs">{error}</span></p>
                        </div>
                        : null
                }
                <div className="relative h-full">
                    <div>
                        <Input
                            id="name_gf"
                            name="departmentName"
                            label="Department Name"
                            type="text"
                            value={department.name || ''}
                            onChange={renameDepartment}
                            error={department.error || ''}
                            state={department.state || ''} />
                        <Select
                            id="newDepList"
                            name="newDepList"
                            label="Parent Department"
                            value={department.department_id || ''}
                            onChange={onParentChange}>
                            {
                                (departments.length === 0)
                                    ? <option value="">No departments have been created yet</option>
                                    : <option value="">No Parent Department</option>
                            }
                            {
                                (departments.length !== 0)
                                    ? (
                                        Object(departments).map(function (dep, i) {
                                            let _return = [];
                                            if (dep.id !== department.id) {
                                                _return.push(
                                                    <option key={i} value={dep.id}>{dep.name}</option>
                                                );
                                            }

                                            if (dep.childrenCount !== 0) {
                                                dep.children.map(function (sub, si) {
                                                    if (department.id !== sub.id) {
                                                        _return.push(
                                                            <option key={`${i}-${si}`} value={sub.id}>{dep.name} - {sub.name}</option>
                                                        );
                                                    }
                                                });
                                            }
                                            return _return;
                                        })
                                    ) : null
                            }
                        </Select>
                        {
                            (department.people !== undefined && department.people.length !== 0) ?
                                (
                                    <div className="mt-6">
                                        <div className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Members</div>
                                        <div className="w-full">
                                            <AvatarStack people={department.people} fade={true} fadeTo="white" darkFadeTo="gray-900" />
                                            <a href="#" onClick={(e) => { e.preventDefault(); setShowMembers(true); }} className="text-sm">View all {department.people_count} members</a>
                                        </div>
                                    </div>
                                )
                                : null
                        }
                        <div className="mt-6">
                            <div className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Department Head</div>
                            <div className="w-full">
                                {
                                    (department.head_id !== null && department.head_id !== undefined) ?
                                        (
                                            <>
                                                <AvatarPill person={head} />
                                                <div className="flex text-sm">
                                                    <a href="#" onClick={showSetHead} className="mr-2">Change Department Head</a>
                                                    <span>|</span>
                                                    <a href="#" className="ml-2 text-red-500" onClick={removeHead}>Remove Department Head</a>
                                                </div>
                                            </>
                                        )
                                        : (
                                            <div className="flex text-sm">
                                                <a href="#" onClick={showSetHead} className="mt-3 text-orange-500">Set Department Head</a>
                                            </div>
                                        )
                                }
                            </div>
                        </div>
                    </div>
                    <div className={(showMembers) ? 'bg-gray-900 opacity-70 absolute -inset-6' : 'hidden'} />
                    <div className={`${(showMembers) ? 'top-0' : 'h-0'} bg-white absolute left-0 right-0 -bottom-6 rounded-t overflow-hidden`}>
                        <DepartmentMembersFlyout
                            department={department}
                            setDepartment={setDepartment}
                            setHead={settingHead}
                            closeMembers={() => { setShowMembers(false); setSettingHead(false) }}
                        />
                    </div>
                </div>
            </FlyoutContent>
            <FlyoutFooter>
                <Button onClick={saveDepartment} square type="outline">Save Changes</Button>
                <ConfirmDeleteButton
                    text="Delete Department"
                    confirmText="Are you sure?"
                    type="outline"
                    square
                    className="ml-auto flex"
                    onClick={deleteDepartment} />
            </FlyoutFooter>
        </>
    )
}

export default DepartmentFlyout;
