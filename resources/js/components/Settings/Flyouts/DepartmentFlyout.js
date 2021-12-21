import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { FlyoutsContext } from '../AppSettings';
import { Button, ConfirmDeleteButton, Input, withWebApps } from 'webapps-react';
import { AvatarPill, AvatarStack } from '../../Cards';
import DepartmentMembersFlyout from './DepartmentMembersFlyout';

const DepartmentFlyout = ({ UI, ...props }) => {
    const {
        departments,
        department,
        setDepartment,
        saveDepartment,
        deleteDepartment
    } = props;

    const [head, setHead] = useState();
    const [showMembers, setShowMembers] = useState(false);
    const [settingHead, setSettingHead] = useState(false);

    const {
        modals, toggleManage,
    } = useContext(FlyoutsContext);

    useEffect(async () => {
        if (department.head_id !== null && department.head_id !== undefined) {
            await axios.get(`/api/apps/StaffDirectory/person/${department.head_id}`)
                .then(json => {
                    setHead(json.data.person);
                })
                .catch(error => {
                    // TODO: handle errors
                    console.log(error);
                });
        }
    }, [department])

    const toggleModal = () => {
        setShowMembers(false);
        toggleManage();
    }

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

    const flyoutClass = classNames(
        'absolute',
        'inset-0',
        'overflow-hidden',
        (modals.manage) ? 'z-50' : '-z-10'
    )

    const bdClass = classNames(
        'absolute',
        'inset-0',
        'bg-gray-500',
        'bg-opacity-75',
        'transition-opacity',
        'duration-500',
        'ease-in-out',
        (modals.manage) ? 'opacity-100' : 'opacity-0'
    )

    const panelClass = classNames(
        'relative',
        'w-screen',
        'max-w-2xl',
        'transform',
        'transition',
        'ease-in-out',
        'duration-500',
        'delay-500',
        (modals.manage) ? 'translate-x-0' : 'translate-x-full',
        (showMembers) ? 'opacity-20' : ''
    )

    if (department === undefined) {
        return null;
    }

    return (
        <div className={flyoutClass}>
            <div className={bdClass} aria-hidden="true" onClick={toggleModal}></div>
            <section className="absolute inset-y-0 right-0 max-w-full flex" aria-labelledby="slide-over-heading">
                <div className={panelClass}>
                    <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl overflow-y-auto">
                        <div className={`px-4 sm:px-6 py-6 bg-${UI.theme}-600 dark:bg-${UI.theme}-900 text-white dark:text-gray-200 relative`}>
                            <div className="absolute top-0 right-0 -ml-8 pt-6 pr-2 flex sm:-ml-10 sm:pr-4">
                                <button className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                    onClick={toggleModal}>
                                    <span className="sr-only">Close panel</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <h2 id="slide-over-heading" className="text-lg font-medium">{department.name} - Department Properties</h2>
                        </div>
                        <div className="mt-6 relative flex-1 px-4 sm:px-6">
                            <div className="absolute inset-0 px-4 sm:px-6">
                                <div className="h-full" aria-hidden="true">
                                    <div className="flex flex-auto">
                                        <div className="w-full lg:w-3/12">
                                            <label className="block py-2" htmlFor="departmentName">Department Name</label>
                                        </div>
                                        <div className="w-full lg:w-9/12">
                                            <Input name="departmentName"
                                                type="text"
                                                id="name_gf"
                                                value={department.name || ''}
                                                onChange={renameDepartment}
                                                error={department.error || ''}
                                                state={department.state || ''} />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex flex-auto">
                                        <div className="w-full lg:w-3/12">
                                            <label className="block py-2" htmlFor="parentDep">Parent Department</label>
                                        </div>
                                        <div className="w-full lg:w-9/12">
                                            {
                                                (departments.length === 0) ?
                                                    (
                                                        <select id="newDepDepList" value={department.department_id || ''} onChange={onParentChange} className="input-field">
                                                            <option value="">No departments have been created yet</option>
                                                        </select>
                                                    ) :
                                                    (
                                                        <select id="newDepDepList" value={department.department_id || ''} onChange={onParentChange} className="input-field">
                                                            <option value="">No Parent Department</option>
                                                            {
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
                                                            }
                                                        </select>
                                                    )
                                            }
                                        </div>
                                    </div>
                                    <div className="mt-6 flex flex-auto">
                                        {
                                            (department.people !== undefined && department.people.length !== 0) ?
                                                (
                                                    <div className="flex flex-auto">
                                                        <div className="w-full lg:w-3/12">
                                                            <span className="block py-2">Members</span>
                                                        </div>
                                                        <div className="w-full lg:w-9/12">
                                                            <AvatarStack people={department.people} fade={true} fadeTo="white" darkFadeTo="gray-900" />
                                                            <a href="#" onClick={(e) => { e.preventDefault(); setShowMembers(true); }} className="text-sm">View all {department.people_count} members</a>
                                                        </div>
                                                    </div>
                                                )
                                                : null
                                        }
                                    </div>
                                    <div className="mt-6 flex flex-auto">

                                        <div className="flex flex-auto">
                                            <div className="w-full lg:w-3/12">
                                                <span className="block py-2">Department Head</span>
                                            </div>
                                            <div className="w-full lg:w-9/12">
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
                                </div>
                            </div>
                        </div>
                        <div className={`flex bg-gray-100 dark:bg-gray-800 border-t-2 py-3 px-4 border-${UI.theme}-600 dark:border-${UI.theme}-900`}>
                            <Button onClick={saveDepartment} square style="outline">Save Changes</Button>
                            <ConfirmDeleteButton
                                text="Delete Department"
                                confirmText="Are you sure?"
                                style="outline"
                                square
                                className="ml-auto flex"
                                onClick={deleteDepartment} />
                        </div>
                    </div>
                </div>
            </section>
            <DepartmentMembersFlyout
                department={department}
                setDepartment={setDepartment}
                show={showMembers}
                setHead={settingHead}
                closeMembers={() => { setShowMembers(false); setSettingHead(false) }}
            />
        </div>
    )
}

export default withWebApps(DepartmentFlyout);
