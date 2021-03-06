import React, { createContext, useContext, useEffect, useState } from 'react';
import { APIClient, Button, Flyout, Input, Loader, PageWrapper, Select, Switch, useToasts, WebAppsUXContext } from 'webapps-react';

import { CreateDepartmentFlyout, DepartmentFlyout } from './Flyouts';

export const FlyoutsContext = createContext({});

const AppSettings = () => {
    const [states, setStates] = useState({});
    const [departments, setDepartments] = useState(null);
    const [department, setDepartment] = useState({ children: [] });
    const [current, setCurrent] = useState('');
    const [notifications, setNotifications] = useState({
        newRecord: false,
        newNotifyTo: '',
        deleteRecord: false,
        deleteNotifyTo: ''
    });

    const { addToast } = useToasts();
    const { useFlyouts } = useContext(WebAppsUXContext);
    const { openFlyout, closeFlyout } = useFlyouts;

    const APIController = new AbortController();

    useEffect(async () => {
        await loadData();

        return () => {
            APIController.abort();
        }
    }, []);

    const loadData = async () => {
        await APIClient('/api/apps/StaffDirectory/departments', undefined, { signal: APIController.signal })
            .then(json => {
                setDepartments(json.data.departments);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: handle errors!
                    console.log(error);
                }
            });

        await APIClient('/api/setting', {
            key: JSON.stringify([
                "app.StaffDirectory.newRecord.sendNotification",
                "app.StaffDirectory.newRecord.notifyTo",
                "app.StaffDirectory.deleteRecord.sendNotification",
                "app.StaffDirectory.deleteRecord.notifyTo"
            ])
        }, { signal: APIController.signal })
            .then(json => {
                notifications.newRecord = json.data["app.StaffDirectory.newRecord.sendNotification"];
                notifications.newNotifyTo = json.data["app.StaffDirectory.newRecord.notifyTo"];
                notifications.deleteRecord = json.data["app.StaffDirectory.deleteRecord.sendNotification"];
                notifications.deleteNotifyTo = json.data["app.StaffDirectory.deleteRecord.notifyTo"];
                setNotifications({ ...notifications });
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    console.log(error)
                }
            });
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
            openAFlyout('Department');
        }
    }

    const closeFlyouts = () => {
        setCurrent('');
        closeFlyout();
    }

    const openAFlyout = panel => {
        setCurrent(panel);
        openFlyout();
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

        await APIClient(`/api/setting/${key}`, { value: value }, { signal: APIController.signal, method: 'PUT' })
            .then(json => {
                states[key] = 'saved';
                setStates({ ...states });
                setTimeout(function () {
                    states[key] = '';
                    setStates({ ...states });
                }, 2500);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: handle errors
                    console.log(error);

                    states[key] = 'error';
                    setStates({ ...states });
                    setTimeout(function () {
                        states[key] = '';
                        setStates({ ...states });
                    }, 2500);
                }
            });
    }

    const saveDepartment = async () => {
        department.state = 'saving';
        setDepartment({ ...department });

        await APIClient(`/api/apps/StaffDirectory/department/${department.id}`, {
            name: department.name,
            department_id: department.department_id,
            head_id: department.head_id
        }, { signal: APIController.signal, method: 'PUT' })
            .then(json => {
                addToast('Department Updated Successfully', '', { appearance: 'success' });
                setDepartments(json.data.departments);
                setDepartment({ children: [] });
                closeFlyouts();
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: handle errors
                    console.log(error);
                }
            });
    }

    const deleteDepartment = async () => {
        await APIClient(`/api/apps/StaffDirectory/department/${department.id}`, {}, { signal: APIController.signal, method: 'DELETE' })
            .then(json => {
                addToast('Department Deleted Successfully', '', { appearance: 'success' });
                setDepartments(json.data.departments);
                setDepartment({ children: [] });
                closeFlyouts();
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: handle errors
                    console.log(error);
                }
            });
    }

    const installSampleData = async () => {
        await APIClient('/api/apps/StaffDirectory/departments/sample', undefined, { signal: APIController.signal });
        await APIClient('/api/apps/StaffDirectory/people/sample', undefined, { signal: APIController.signal })
            .then(async r => {
                await loadData();
            });
    }

    const newDepButton = (
        <Button
            type="ghost"
            color="gray"
            size="small"
            square
            className="uppercase mr-1 w-full sm:w-auto sm:rounded-md"
            onClick={() => openAFlyout('CreateDepartment')}
        >
            Create a new Department
        </Button>
    )

    if (departments === null) {
        return <Loader className="flex items-center h-48" />
    }

    return (
        <>
            <PageWrapper title="App Settings">
                <Select
                    id="depList"
                    value={department.id}
                    onChange={onDepChange}
                    label="Manage Departments"
                    action={newDepButton}
                >
                    {
                        (department.length === 0)
                            ? <option value="">No departments have been created yet</option>
                            : <option value="">Select...</option>
                    }
                    {
                        (department.length !== 0)
                            ? (
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
                            ) : null
                    }
                </Select>
                <div className="h-px bg-gray-300 dark:bg-gray-700 my-4" />
                <Switch
                    id="app.StaffDirectory.newRecord.sendNotification"
                    name="app.StaffDirectory.newRecord.sendNotification"
                    label="Send Email when record is created"
                    helpText="This will not trigger for records created by Microsoft Azure Integration"
                    className="mb-6"
                    checked={(notifications.newRecord === 'true')}
                    onChange={onChange}
                    state={states['app.StaffDirectory.newRecord.sendNotification']} />
                <Input
                    id="app.StaffDirectory.newRecord.notifyTo"
                    name="app.StaffDirectory.newRecord.notifyTo"
                    label="Send new record notification to"
                    type="text"
                    value={notifications.newNotifyTo || ''}
                    onChange={onType}
                    onBlur={onChange}
                    state={states['app.StaffDirectory.newRecord.notifyTo']} />
                <Switch
                    id="app.StaffDirectory.deleteRecord.sendNotification"
                    name="app.StaffDirectory.deleteRecord.sendNotification"
                    label="Send Email when record is deleted"
                    helpText="This will not trigger for records deleted by Microsoft Azure Integration"
                    className="mb-6"
                    checked={(notifications.deleteRecord === 'true')}
                    onChange={onChange}
                    state={states['app.StaffDirectory.deleteRecord.sendNotification']} />
                <Input
                    id="app.StaffDirectory.deleteRecord.notifyTo"
                    name="app.StaffDirectory.deleteRecord.notifyTo"
                    label="Send deleted record notification to"
                    type="text"
                    value={notifications.deleteNotifyTo || ''}
                    onChange={onType}
                    onBlur={onChange}
                    state={states['app.StaffDirectory.deleteRecord.notifyTo']} />
                {
                    (departments.length === 0)
                        ? (
                            <Button onClick={installSampleData} type="link" padding={false} color="gray">
                                Install Sample Data
                            </Button>
                        ) : null
                }
            </PageWrapper>

            <FlyoutsContext.Provider value={{
                current,
                closeFlyouts
            }}>
                <Flyout>
                    <CreateDepartmentFlyout setDepartments={setDepartments} departments={departments} />
                    <DepartmentFlyout departments={departments} department={department} setDepartment={setDepartment} saveDepartment={saveDepartment} deleteDepartment={deleteDepartment} />
                </Flyout>
            </FlyoutsContext.Provider>
        </>
    );
}

export default AppSettings;