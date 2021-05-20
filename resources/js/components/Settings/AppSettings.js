import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import { CreateDepartmentFlyout, DepartmentFlyout } from './Flyouts';
axios.defaults.withCredentials = true;

export const FlyoutsContext = createContext({});

const AppSettings = () => {
    const [departments, setDepartments] = useState([]);
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
            .then(response => {
                return response;
            })
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
        axios.post('/api/setting')
            .then(response => {
                return response;
            })
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
                document.getElementById(key).classList.add('text-green-500');
                document.getElementById(key).classList.add('border-green-500');
                setTimeout(function () {
                    document.getElementById(key).classList.remove('text-green-500');
                    document.getElementById(key).classList.remove('border-green-500');
                }, 2500);
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);

                document.getElementById(key).classList.add('text-red-500');
                document.getElementById(key).classList.add('border-red-500');
                setTimeout(function () {
                    document.getElementById(key).classList.remove('text-red-500');
                    document.getElementById(key).classList.remove('border-red-500');
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

    //render
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
                    <label className="block py-2" htmlFor="newNotify">Send E-Mail when record is created</label>
                </div>
                <div className="relative inline-block w-10 mr-2 mt-2 align-middle select-none">
                    <input type="checkbox"
                        name="newNotify"
                        checked={(notifications.newRecord === 'true')}
                        id="app.StaffDirectory.newRecord.sendNotification"
                        onChange={onChange}
                        className="checked:bg-gray-500 outline-none focus:ring-0 focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                    <label htmlFor="newNotify" className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" />
                </div>
            </div>
            <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                <div className="w-full lg:w-3/12">
                    <label className="block py-2" htmlFor="newNotifyTo">Send new record notification to</label>
                </div>
                <div className="w-full lg:w-9/12">
                    <input name="newNotifyTo"
                        type="text"
                        id="app.StaffDirectory.newRecord.notifyTo"
                        value={notifications.newNotifyTo || ''}
                        onChange={onType}
                        onBlur={onChange}
                        className="input-field" />
                </div>
            </div>
            <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                <div className="w-full lg:w-3/12">
                    <label className="block py-2" htmlFor="deletedNotify">Send E-Mail when record is deleted</label>
                </div>
                <div className="relative inline-block w-10 mr-2 mt-2 align-middle select-none">
                    <input type="checkbox"
                        name="deletedNotify"
                        checked={(notifications.deleteRecord === 'true')}
                        id="app.StaffDirectory.deleteRecord.sendNotification"
                        onChange={onChange}
                        className="checked:bg-gray-500 outline-none focus:ring-0 focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                    <label htmlFor="deletedNotify" className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" />
                </div>
            </div>
            <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                <div className="w-full lg:w-3/12">
                    <label className="block py-2" htmlFor="deletedNotifyTo">Send deleted record notification to</label>
                </div>
                <div className="w-full lg:w-9/12">
                    <input name="deletedNotifyTo"
                        type="text"
                        id="app.StaffDirectory.deleteRecord.notifyTo"
                        value={notifications.deleteNotifyTo || ''}
                        onChange={onType}
                        onBlur={onChange}
                        className="input-field" />
                </div>
            </div>

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