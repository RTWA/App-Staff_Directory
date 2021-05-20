import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import Moment from 'moment';
import { Prompt } from 'react-router';
import { CustomFieldDetails, DepartmentDetails, EmploymentDetails, PersonalDetails } from './Staff/index';
import ConfirmDeleteButton from './ConfirmDeleteButton';

const Manage = () => {
    const [people, setPeople] = useState([]);
    const [person, setPerson] = useState({ departments: [{}], id: 0, customFields: [{}] });
    const [departments, setDepartments] = useState([]);
    const [custom, setCustom] = useState([]);
    const [changed, setChanged] = useState(false);

    const { addToast, updateToast } = useToasts();

    useEffect(() => {
        getPeople();
        getData();
    }, []);

    useEffect(() => {
        window.onbeforeunload = (changed) ? () => true : undefined;
    }, [changed]);

    const getPeople = () => {
        axios.get('/api/apps/StaffDirectory/peopleList')
            .then(response => {
                return response;
            })
            .then(json => {
                setPeople(json.data.list);
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            });
    }

    const getData = () => {
        axios.get('/api/apps/StaffDirectory/departmentList')
            .then(response => {
                return response;
            })
            .then(json => {
                setDepartments(json.data.list);
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            });
        axios.get('/api/apps/StaffDirectory/customFields')
            .then(response => {
                return response;
            })
            .then(json => {
                setCustom(json.data.list);
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            });
    }

    const savePerson = e => {
        e.preventDefault();

        let save = null;
        addToast('Saving changes, please wait...', { appearance: 'info', autoDismiss: false }, (id) => save = id);

        let formData = new FormData();
        formData.append('person', JSON.stringify(person));
        axios.post(`/api/apps/StaffDirectory/person/${person.id}`, formData)
            .then(response => {
                return response;
            })
            .then(json => {
                updateToast(save, { appearance: 'success', autoDismiss: true, content: json.data.message });

                setChanged(false);
                getPeople();
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            });
    }

    const deletePerson = e => {
        if (!confirm("This action cannot be undone. Are you sure you wish to delete this record?")) {
            return;
        }

        let formData = new FormData();
        formData.append('_method', 'DELETE');
        axios.post(`/api/apps/StaffDirectory/person/${person.id}`, formData)
            .then(response => {
                return response;
            })
            .then(json => {
                setChanged(false);
                setPerson({ departments: [{}], id: 0 });
                getPeople();
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            });
    }

    const select = e => {
        if (changed) {
            if (!confirm("You have unsaved changes, are you sure you want to change person?")) {
                return;
            }
        }

        if (e.target.value !== "") {
            axios.get(`/api/apps/StaffDirectory/person/${e.target.value}`)
                .then(response => {
                    return response;
                })
                .then(json => {
                    setChanged(false);
                    setPerson(json.data.person);
                })
                .catch(error => {
                    // TODO: handle errors
                    console.log(error);
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

    return (
        <>
            <Prompt when={changed} message="You have unsaved changes, are you sure you want to leave?" />

            <div className="w-full px-4 py-6">
                <label htmlFor="staffSelect">Select person to update from the list below, or complete the form to create a new record.</label>
                <select className="input-field mb-16 mt-2" onChange={select} value={person.id} >
                    {
                        people.map(function (list, i) {
                            return (
                                <option key={i} value={list.value}>{list.label}</option>
                            )
                        })
                    }
                </select>

                <PersonalDetails person={person} change={fieldChange} dateChange={dateChange} />
                <DepartmentDetails person={person} departments={department} />
                <EmploymentDetails person={person} change={fieldChange} check={checkChange} />
                <CustomFieldDetails person={person} fields={custom} change={customChange} />

                <div className="flex flex-row mt-6">
                    <a href="#" className="px-4 py-2 mr-auto bg-green-500 hover:bg-green-700 hover:text-white rounded shadow-xl" onClick={savePerson}>Save Record</a>
                    {
                        (person.id !== 0)
                            ? <ConfirmDeleteButton text="DELETE This Record" className="ml-auto px-4 py-2 rounded shadow-xl hover:text-white" initialColor="bg-red-500 hover:bg-red-700" confirmColor="bg-orange-500 hover:bg-orange-700" onClick={deletePerson} />
                            : null
                    }
                </div>
            </div>
        </>
    )
}

export default Manage