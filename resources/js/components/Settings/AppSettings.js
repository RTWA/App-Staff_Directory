import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Input, Loader, Switch, useToasts, withWebApps } from 'webapps-react';

import { CreateDepartmentFlyout, DepartmentFlyout } from './Flyouts';

axios.defaults.withCredentials = true;

export const FlyoutsContext = createContext({});

const AppSettings = UI => {
    const [states, setStates] = useState({});
    const [departments, setDepartments] = useState(null);
    const [department, setDepartment] = useState({ children: [] });
    const [modals, setModals] = useState({ manage: false, new: false });
    const [notifications, setNotifications] = useState({
        newRecord: false,
        newNotifyTo: '',
        deleteRecord: false,
        deleteNotifyTo: ''
    });

    const { addToast } = useToasts();

    useEffect(async () => {
        await loadData();
    }, []);

    const loadData = () => {
        await axios.get('/api/apps/StaffDirectory/departments')
            .then(json => {
                setDepartments(json.data.departments);
            })
            .catch(error => {
                // TODO: handle errors!
                console.log(error);
            });

        let formData = new FormData();
        formData.append("key", JSON.stringify([
            "app.StaffDirectory.newRecord.sendNotification",
            "app.StaffDirectory.newRecord.notifyTo",
            "app.StaffDirectory.deleteRecord.sendNotification",
            "app.StaffDirectory.deleteRecord.notifyTo"
        ]));
        await axios.post('/api/setting', formData)
            .then(json => {
                notifications.newRecord = json.data["app.StaffDirectory.newRecord.sendNotification"];
                notifications.newNotifyTo = json.data["app.StaffDirectory.newRecord.notifyTo"];
                notifications.deleteRecord = json.data["app.StaffDirectory.deleteRecord.sendNotification"];
                notifications.deleteNotifyTo = json.data["app.StaffDirectory.deleteRecord.notifyTo"];
                setNotifications({ ...notifications });
            })
            .catch(error => {
                console.log(error)
            });
    }

    const pushDepartment = department => {
        departments.push(department);
        setDepartments({ ...departments });
    }

    const onDepChange = e => {
        departments.map(function (dep) {
            if (dep.id.toString() === e.target.value) {
                setDepartment(dep);
            }
            if (dep.childrenCount !== 0) {
                dep.children.map(function (subdep) {
                    if (subdep.id.toString() === e.target.value) {
                        setDepartment(subdep);
                    }
                });
            }
        });
        if (e.target.value !== '') {
            modals.manage = true;
            setModals({ ...modals });
        }
    }

    const toggleManage = e => {
        if (e !== undefined) {
            e.preventDefault();
        }

        modals.manage = !modals.manage;
        setModals({ ...modals });
    }

    const toggleNew = e => {
        if (e !== undefined) {
            e.preventDefault();
        }

        modals.new = !modals.new;
        setModals({ ...modals });
    }

    const onType = e => {
        let key = e.target.id;
        let value = e.target.value;

        if (key === "app.StaffDirectory.newRecord.notifyTo") {
            notifications.newNotifyTo = value;
        }
        if (key === "app.StaffDirectory.deleteRecord.notifyTo") {
            notifications.deleteNotifyTo = value;
        }
        setNotifications({ ...notifications });
    }

    const onChange = async e => {
        states[key] = 'saving';
        setStates({ ...states });

        let key = e.target.id;
        let value = e.target.value;

        if (key === "app.StaffDirectory.newRecord.sendNotification") {
            value = (notifications.newRecord === 'true') ? 'false' : 'true';
            notifications.newRecord = value;
        }
        if (key === "app.StaffDirectory.deleteRecord.sendNotification") {
            value = (notifications.deleteRecord === 'true') ? 'false' : 'true';
            notifications.deleteRecord = value;
        }

        setNotifications({ ...notifications });

        let formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('value', value);
        await axios.post(`/api/setting/${key}`, formData)
            .then(json => {
                states[key] = 'saved';
                setStates({ ...states });
                setTimeout(function () {
                    states[key] = '';
                    setStates({ ...states });
                }, 2500);
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);

                states[key] = 'error';
                setStates({ ...states });
                setTimeout(function () {
                    states[key] = '';
                    setStates({ ...states });
                }, 2500);
            });
    }

    const saveDepartment = async () => {
        department.state = 'saving';
        setDepartment({ ...department });

        let formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', department.name);
        formData.append('department_id', department.department_id);
        formData.append('head_id', department.head_id);

        await axios.post(`/api/apps/StaffDirectory/department/${department.id}`, formData)
            .then(json => {
                addToast('Department Updated Successfully', '', { appearance: 'success' });
                setDepartments(json.data.departments);
                setDepartment('');
                toggleManage();
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            });
    }

    const deleteDepartment = async () => {
        let formData = new FormData();
        formData.append('_method', 'DELETE');
        await axios.post(`/api/apps/StaffDirectory/department/${department.id}`, formData)
            .then(json => {
                addToast('Department Deleted Successfully', '', { appearance: 'success' });
                setDepartments(json.data.departments);
                setDepartment('');
                toggleManage();
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            });
    }

    const installSampleData = async () => {
        await axios.get('/api/apps/StaffDirectory/departments/sample');
        await axios.get('/api/apps/StaffDirectory/people/sample')
        .then(r => {
            await loadData();
        });
    }

    if (departments === null) {
        return <Loader className="flex items-center h-48" />
    }

    return (
        <>
            <div className="flex flex-col xl:flex-row py-4">
                <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="depList">Manage Departments</label>
                <div className="relative w-full">
                    {
                        (departments.length === 0) ?
                            (
                                <select id="depList" value={department.id} onChange={onDepChange} className={`input-field focus:border-${UI.theme}-600 dark:focus:border-${UI.theme}-500`}>
                                    <option value="">No departments have been created yet</option>
                                </select>
                            ) :
                            (
                                <select id="depList" value={department.id} onChange={onDepChange} className={`input-field focus:border-${UI.theme}-600 dark:focus:border-${UI.theme}-500`}>
                                    <option value="">Select...</option>
                                    {
                                        Object(departments).map(function (department, i) {
                                            let _return = [];
                                            _return.push(
                                                <option key={i} value={department.id}>{department.name}</option>
                                            );

                                            if (department.childrenCount !== 0) {
                                                department.children.map(function (sub, si) {
                                                    _return.push(
                                                        <option key={`${i}-${si}`} value={sub.id}>{department.name} - {sub.name}</option>
                                                    );
                                                });
                                            }
                                            return _return;
                                        })
                                    }
                                </select>
                            )
                    }
                    <div className="w-full sm:w-auto sm:absolute inset-y-0 right-8 sm:flex items-center">
                        <Button style="ghost" color="gray" size="small" square
                            className="uppercase mr-1 w-full sm:w-auto sm:rounded-md"
                            onClick={toggleNew}>
                            Create a new Department
                        </Button>
                    </div>
                </div>
            </div>
            <div className="h-px bg-gray-300 dark:bg-gray-700 my-4" />
            <div className="flex flex-col xl:flex-row py-4">
                <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base"
                    htmlFor="app.StaffDirectory.newRecord.sendNotification">
                    Send Email when record is created
                </label>
                <div className="mt-1 xl:mt-0 w-full">
                    <Switch name="app.StaffDirectory.newRecord.sendNotification"
                        checked={(notifications.newRecord === 'true')}
                        onChange={onChange}
                        state={states['app.StaffDirectory.newRecord.sendNotification']} />
                    <p className="text-xs text-gray-400 dark:text-gray-200">
                        This will not trigger for records created by Microsoft Azure Integration
                    </p>
                </div>
            </div>
            <div className="flex flex-col xl:flex-row py-4">
                <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base"
                    htmlFor="app.StaffDirectory.newRecord.notifyTo">
                    Send new record notification to
                </label>
                <Input name="app.StaffDirectory.newRecord.notifyTo"
                    type="text"
                    id="app.StaffDirectory.newRecord.notifyTo"
                    value={notifications.newNotifyTo || ''}
                    onChange={onType}
                    onBlur={onChange}
                    state={states['app.StaffDirectory.newRecord.notifyTo']} />
            </div>
            <div className="flex flex-col xl:flex-row py-4">
                <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base"
                    htmlFor="app.StaffDirectory.deleteRecord.sendNotification">
                    Send Email when record is deleted
                </label>
                <div className="mt-1 xl:mt-0 w-full">
                    <Switch name="app.StaffDirectory.deleteRecord.sendNotification"
                        checked={(notifications.deleteRecord === 'true')}
                        onChange={onChange}
                        state={states['app.StaffDirectory.deleteRecord.sendNotification']} />
                    <p className="text-xs text-gray-400 dark:text-gray-200">
                        This will not trigger for records deleted by Microsoft Azure Integration
                    </p>
                </div>
            </div>
            <div className="flex flex-col xl:flex-row py-4">
                <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base"
                    htmlFor="app.StaffDirectory.deleteRecord.notifyTo">
                    Send deleted record notification to
                </label>
                <Input name="app.StaffDirectory.deleteRecord.notifyTo"
                    type="text"
                    id="app.StaffDirectory.deleteRecord.notifyTo"
                    value={notifications.deleteNotifyTo || ''}
                    onChange={onType}
                    onBlur={onChange}
                    state={states['app.StaffDirectory.deleteRecord.notifyTo']} />
            </div>
            {
                (departments.length === 0)
                    ? (
                        <div className="flex flex-col xl:flex-row py-4">
                            <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base">
                                Sample Data
                            </label>
                            <div className="w-full">
                                <Button onClick={installSampleData} square className="w-full mt-2 sm:mt-0 sm:w-auto sm:rounded-md">
                                    Install Sample Data
                                </Button>
                            </div>
                        </div>
                    ) : null
            }

            <FlyoutsContext.Provider value={{
                modals,
                toggleManage,
                toggleNew
            }}>
                <CreateDepartmentFlyout pushDepartment={pushDepartment} departments={departments} />
                <DepartmentFlyout departments={departments} department={department} setDepartment={setDepartment} saveDepartment={saveDepartment} deleteDepartment={deleteDepartment} />
            </FlyoutsContext.Provider>
        </>
    );
}

export default withWebApps(AppSettings);