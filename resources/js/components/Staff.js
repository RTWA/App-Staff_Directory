import React, { useEffect, useState } from 'react';
import Moment from 'moment';
import { Prompt } from 'react-router';
import { APIClient, Button, ConfirmDeleteButton, Loader, Select, useToasts } from 'webapps-react';

import { CustomFieldDetails, DepartmentDetails, EmploymentDetails, PersonalDetails } from './Staff/index';

const Manage = () => {
    const [people, setPeople] = useState(null);
    const [person, setPerson] = useState({ departments: [{}], id: 0, customFields: [{}] });
    const [departments, setDepartments] = useState([]);
    const [custom, setCustom] = useState([]);
    const [changed, setChanged] = useState(false);

    const { addToast, updateToast } = useToasts();

    const APIControler = new AbortController();

    useEffect(async () => {
        await getPeople();
        await getData();
        
        return () => {
            APIController.abort();
        }
    }, []);

    useEffect(() => {
        window.onbeforeunload = (changed) ? () => true : undefined;
    }, [changed]);

    const getPeople = async () => {
        await APIClient('/api/apps/StaffDirectory/peopleList', undefined, { signal: APIControler.signal })
            .then(json => {
                setPeople(json.data.list);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: handle errors
                    console.log(error);
                }
            });
    }

    const getData = async () => {
        await APIClient('/api/apps/StaffDirectory/departmentList', undefined, { signal: APIControler.signal })
            .then(json => {
                setDepartments(json.data.list);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: handle errors
                    console.log(error);
                }
            });
        await APIClient('/api/apps/StaffDirectory/customFields', undefined, { signal: APIControler.signal })
            .then(json => {
                setCustom(json.data.list);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: handle errors
                    console.log(error);
                }
            });
    }

    const savePerson = async e => {
        e.preventDefault();

        let save = null;
        addToast('Saving changes, please wait...', '', { appearance: 'info', autoDismiss: false }, (id) => save = id);

        await APIClient(`/api/apps/StaffDirectory/person/${person.id}`, { person: JSON.stringify(person) }, { signal: APIControler.signal })
            .then(json => {
                updateToast(save, { appearance: 'success', autoDismiss: true, title: json.data.message });

                setChanged(false);
                getPeople();
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: handle errors
                    console.log(error);
                }
            });
    }

    const deletePerson = async e => {
        if (!confirm("This action cannot be undone. Are you sure you wish to delete this record?")) {
            return;
        }

        await APIClient(`/api/apps/StaffDirectory/person/${person.id}`, {}, { signal: APIControler.signal, method: 'DELETE' })
            .then(json => {
                setChanged(false);
                setPerson({ departments: [{}], id: 0, customFields: [{}] });
                getPeople();
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: handle errors
                    console.log(error);
                }
            });
    }

    const select = async e => {
        if (changed) {
            if (!confirm("You have unsaved changes, are you sure you want to change person?")) {
                return;
            }
        }

        if (e.target.value !== "") {
            await APIClient(`/api/apps/StaffDirectory/person/${e.target.value}`, undefined, { signal: APIControler.signal })
                .then(json => {
                    setChanged(false);
                    setPerson(json.data.person);
                })
                .catch(error => {
                    if (!error.status?.isAbort) {
                        // TODO: handle errors
                        console.log(error);
                    }
                });
        } else {
            setPerson({ departments: [{}], id: 0 });
        }
    }

    const fieldChange = e => {
        person[e.target.id] = e.target.value;
        setPerson({ ...person });
        setChanged(true);
    }

    const checkChange = e => {
        person[e.target.id] = (person[e.target.id] === "0") ? "1" : "0";
        setPerson({ ...person });
    }

    const dateChange = value => {
        person.startDate = Moment(value).format('YYYY-MM-DD');
        setPerson({ ...person });
        setChanged(true);
    }

    const departmentChange = (department, index) => {
        person.departments[index] = department;
        setPerson({ ...person });
        setChanged(true);
    }

    const customChange = (field, value) => {
        person.customFields[field] = value;
        setPerson({ ...person });
        setChanged(true);
    }

    const removeDepartment = index => {
        delete person.departments[index];
        person.departments = person.departments.filter(function () {
            return true;
        });
        setPerson({ ...person });
        setChanged(true);
    }

    const addDepartment = e => {
        e.preventDefault();
        person.departments.push({});
        setPerson({ ...person });
    }

    const toggleHod = (department, index) => {
        if (person.departments[index]['head_id'] === person.id) {
            person.departments[index]['head_id'] = null;
        } else {
            person.departments[index]['head_id'] = person.id;
        }
        setPerson({ ...person });
        setChanged(true);
    }

    const department = {
        'add': addDepartment,
        'change': departmentChange,
        'list': departments,
        'remove': removeDepartment,
        'toggleHod': toggleHod,
        // 'sortEnd': repeaterSortEnd
    };

    if (people === null) {
        return <Loader className="min-h-screen flex items-center" />
    }

    return (
        <>
            {/* <Prompt when={changed} message="You have unsaved changes, are you sure you want to leave?" /> */}

            <div className="w-full py-4">
                <Select
                    id="staffSelect"
                    label="Select person to update from the list below, or complete the form to create a new record."
                    wrapperClassName="mb-16 mt-2"
                    onChange={select}
                    value={person.id} >
                    {
                        people.map(function (list, i) {
                            return (
                                <option key={i} value={list.value}>{list.label}</option>
                            )
                        })
                    }
                </Select>

                <PersonalDetails person={person} setPerson={setPerson} change={fieldChange} dateChange={dateChange} />
                <DepartmentDetails person={person} departments={department} />
                <EmploymentDetails person={person} change={fieldChange} check={checkChange} />
                <CustomFieldDetails person={person} fields={custom} change={customChange} />

                <div className="flex flex-row mt-6">
                    <Button className="mr-auto" color="green" onClick={savePerson}>Save Record</Button>
                    {
                        (person.id !== 0)
                            ? <ConfirmDeleteButton text="DELETE This Record"
                                className="ml-auto"
                                onClick={deletePerson} />
                            : null
                    }
                </div>
            </div>
        </>
    )
}

export default Manage