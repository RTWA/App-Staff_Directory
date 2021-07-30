import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import { Button, Input, Loader, Switch } from 'webapps-react';

import { CreateDepartmentFlyout, DepartmentFlyout } from './Flyouts';

axios.defaults.withCredentials = true;

export const FlyoutsContext = createContext({});

const AppSettings = () => {
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

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        axios.get('/api/apps/StaffDirectory/departments')
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
        axios.post('/api/setting', formData)
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

    const onChange = e => {
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
        axios.post(`/api/setting/${key}`, formData)
            .then(response => {
                return response;
            })
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

    const saveDepartment = () => {
        department.state = 'saving';
        setDepartment({ ...department });

        let formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', department.name);
        formData.append('department_id', department.department_id);
        formData.append('head_id', department.head_id);

        axios.post(`/api/apps/StaffDirectory/department/${department.id}`, formData)
            .then(response => {
                return response;
            })
            .then(json => {
                addToast('Department Updated Successfully', { appearance: 'success' });
                setDepartments(json.data.departments);
                setDepartment('');
                toggleManage();
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            });
    }

    const deleteDepartment = () => {
        let formData = new FormData();
        formData.append('_method', 'DELETE');
        axios.post(`/api/apps/StaffDirectory/department/${department.id}`, formData)
            .then(response => {
                return response;
            })
            .then(json => {
                addToast('Department Deleted Successfully', { appearance: 'success' });
                setDepartments(json.data.departments);
                setDepartment('');
                toggleManage();
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            });
    }

    const installSampleData = () => {
        axios.get('/api/apps/StaffDirectory/departments/sample');
        axios.get('/api/apps/StaffDirectory/people/sample');
        loadData();
    }

    if (departments === null) {
        return <Loader className="flex items-center h-48" />
    }

    return (
        <>
            <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5 border-b">
                <div className="w-full lg:w-3/12">
                    <label className="block py-2" htmlFor="depList">Manage Departments</label>
                </div>
                <div className="w-full lg:w-9/12">
                    {
                        (departments.length === 0) ?
                            (
                                <select id="depList" value={department.id} onChange={onDepChange} className="input-field">
                                    <option value="">No departments have been created yet</option>
                                </select>
                            ) :
                            (
                                <select id="depList" value={department.id} onChange={onDepChange} className="input-field">
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
                    <a href="#" onClick={toggleNew}>Create a new Department</a>
                </div>
            </div>
            <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                <div className="w-full lg:w-3/12">
                    <label className="block py-2" htmlFor="app.StaffDirectory.newRecord.sendNotification">Send Email when record is created</label>
                </div>
                <div className="w-full lg:w-9/12 flex flex-col">
                    <div className="relative inline-block w-10 mr-2 mt-2 align-middle select-none">
                        <Switch name="app.StaffDirectory.newRecord.sendNotification"
                            checked={(notifications.newRecord === 'true')}
                            onChange={onChange}
                            state={states['app.StaffDirectory.newRecord.sendNotification']} />
                    </div>
                    <span className="mt-2 text-xs text-gray-400">
                        This will not trigger for records created by Microsoft Azure Integration
                    </span>
                </div>
            </div>
            <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                <div className="w-full lg:w-3/12">
                    <label className="block py-2" htmlFor="app.StaffDirectory.newRecord.notifyTo">Send new record notification to</label>
                </div>
                <div className="w-full lg:w-9/12">
                    <Input name="app.StaffDirectory.newRecord.notifyTo"
                        type="text"
                        id="app.StaffDirectory.newRecord.notifyTo"
                        value={notifications.newNotifyTo || ''}
                        onChange={onType}
                        onBlur={onChange}
                        state={states['app.StaffDirectory.newRecord.notifyTo']} />
                </div>
            </div>
            <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                <div className="w-full lg:w-3/12">
                    <label className="block py-2" htmlFor="app.StaffDirectory.deleteRecord.sendNotification">Send Email when record is deleted</label>
                </div>
                <div className="w-full lg:w-9/12 flex flex-col">
                    <div className="relative inline-block w-10 mr-2 mt-2 align-middle select-none">
                        <Switch name="app.StaffDirectory.deleteRecord.sendNotification"
                            checked={(notifications.deleteRecord === 'true')}
                            onChange={onChange}
                            state={states['app.StaffDirectory.deleteRecord.sendNotification']} />
                    </div>
                    <span className="mt-2 text-xs text-gray-400">
                        This will not trigger for records deleted by Microsoft Azure Integration
                    </span>
                </div>
            </div>
            <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                <div className="w-full lg:w-3/12">
                    <label className="block py-2" htmlFor="app.StaffDirectory.deleteRecord.notifyTo">Send deleted record notification to</label>
                </div>
                <div className="w-full lg:w-9/12">
                    <Input name="app.StaffDirectory.deleteRecord.notifyTo"
                        type="text"
                        id="app.StaffDirectory.deleteRecord.notifyTo"
                        value={notifications.deleteNotifyTo || ''}
                        onChange={onType}
                        onBlur={onChange}
                        state={states['app.StaffDirectory.deleteRecord.notifyTo']} />
                </div>
            </div>
            {
                (departments.length === 0)
                    ? (
                        <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5 border-t">
                            <div className="w-full lg:w-3/12">
                                <label className="block py-2">Sample Data</label>
                            </div>
                            <div className="w-full lg:w-9/12">
                                <Button onClick={installSampleData}>Install Sample Data</Button>
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

export default AppSettings;