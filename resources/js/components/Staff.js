import React, { useEffect, useState } from 'react';
import Moment from 'moment';
// import { Prompt } from 'react-router';
import { APIClient, Button, ConfirmDeleteButton, Loader, Select, useToasts } from 'webapps-react';

import { CustomFieldDetails, DepartmentDetails, EmploymentDetails, PersonalDetails } from './Staff/index';

const Manage = () => {
    const [people, setPeople] = useState(null);
    const [person, setPerson] = useState({ departments: [{}], id: 0, customFields: {} });
    const [departments, setDepartments] = useState([]);
    const [custom, setCustom] = useState([]);
    const [changed, setChanged] = useState(false);
    const [azureMapFields, setAzureMapFields] = useState({});

    const [sections, setSections] = useState({
        personal: {},
        departments: {},
        employment: {},
    });

    const { addToast, updateToast } = useToasts();

    const APIController = new AbortController();

    useEffect(async () => {
        await APIClient('/api/apps/StaffDirectory/azure/mappings', undefined, { signal: APIController.signal })
            .then(json => {
                json.data.map(function (field) {
                    azureMapFields[field.local_field] = field.azure_field
                });
                setAzureMapFields(azureMapFields);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: Handle Errors
                    console.log(error);
                }
            });

        await APIClient('/api/setting', {
            key: JSON.stringify([
                "app.StaffDirectory.section.personal.show",
                "app.StaffDirectory.section.departments.show",
                "app.StaffDirectory.section.employment.show",
                "app.StaffDirectory.fields.personal.hide",
                "app.StaffDirectory.fields.departments.hide",
                "app.StaffDirectory.fields.employment.hide",
            ])
        }, { signal: APIController.signal })
            .then(async json => {
                sections.personal.show = json.data["app.StaffDirectory.section.personal.show"];
                sections.departments.show = json.data["app.StaffDirectory.section.departments.show"];
                sections.employment.show = json.data["app.StaffDirectory.section.employment.show"];
                sections.personal.hide = JSON.parse(json.data["app.StaffDirectory.fields.personal.hide"]);
                sections.departments.hide = JSON.parse(json.data["app.StaffDirectory.fields.departments.hide"]);
                sections.employment.hide = JSON.parse(json.data["app.StaffDirectory.fields.employment.hide"]);
                setSections({ ...sections });

                await getPeople();
                await getData();
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    console.log(error)
                }
            });

        return () => {
            APIController.abort();
        }
    }, []);

    useEffect(() => {
        window.onbeforeunload = (changed) ? () => true : undefined;
    }, [changed]);

    const getPeople = async () => {
        await APIClient('/api/apps/StaffDirectory/peopleList', undefined, { signal: APIController.signal })
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
        if (sections.departments.show === 'true') {
            await APIClient('/api/apps/StaffDirectory/departmentList', undefined, { signal: APIController.signal })
                .then(json => {
                    setDepartments(json.data.list);
                })
                .catch(error => {
                    if (!error.status?.isAbort) {
                        // TODO: handle errors
                        console.log(error);
                    }
                });
        }
        await APIClient('/api/apps/StaffDirectory/customFields', undefined, { signal: APIController.signal })
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

    const unlinkAzure = async e => {
        e.preventDefault();

        await APIClient(`/api/apps/StaffDirectory/person/${person.id}/unlink`, {}, { signal: APIController.signal })
            .then(json => {
                person.azure_id = null;
                setPerson({ ...person });

                addToast(json.data.message, '', { appearance: 'success' });
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    addToast('An error occurred!', error.data.message, { appearance: 'error' });
                }
            })
    }

    const savePerson = async e => {
        e.preventDefault();

        let save = null;
        addToast('Saving changes, please wait...', '', { appearance: 'info', autoDismiss: false }, (id) => save = id);

        await APIClient(`/api/apps/StaffDirectory/person/${person.id}`, { person: JSON.stringify(person) }, { signal: APIController.signal })
            .then(json => {
                updateToast(save, { appearance: 'success', autoDismiss: true, title: json.data.message });
                setPeople(json.data.people);
                setPerson(json.data.person);

                setChanged(false);
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

        await APIClient(`/api/apps/StaffDirectory/person/${person.id}`, {}, { signal: APIController.signal, method: 'DELETE' })
            .then(json => {
                setChanged(false);
                setPerson({ departments: [{}], id: 0, customFields: {} });
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
            await APIClient(`/api/apps/StaffDirectory/person/${e.target.value}`, undefined, { signal: APIController.signal })
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
            setPerson({ departments: [{}], id: 0, customFields: {} });
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

    const isAzureMapped = field => {
        if (person.azure_id && azureMapFields[field] !== 'do_not_sync') {
            return true;
        }
        return false;
    }

    const azureIcon = (
        <svg className="w-5 h-5" viewBox="0 0 161.67 129" xmlns="http://www.w3.org/2000/svg">
            <path d="m88.33 0-47.66 41.33-40.67 73h36.67zm6.34 9.67-20.34 57.33 39 49-75.66 13h124z" fill="#0072c6" />
        </svg>
    );

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

                <PersonalDetails person={person} setPerson={setPerson} change={fieldChange} dateChange={dateChange} hide={sections.personal.hide} isAzureMapped={isAzureMapped} azureIcon={azureIcon} />
                {
                    (sections.departments.show === 'true')
                        ? <DepartmentDetails person={person} departments={department} hide={sections.departments.hide} /> : null
                }
                {
                    (sections.employment.show === 'true')
                        ? <EmploymentDetails person={person} change={fieldChange} check={checkChange} hide={sections.employment.hide} isAzureMapped={isAzureMapped} azureIcon={azureIcon} /> : null
                }
                <CustomFieldDetails person={person} fields={custom} change={customChange} />

                <div className="flex flex-row mt-6">
                    <Button className="mr-auto" color="green" onClick={savePerson}>Save Record</Button>
                    <div className="ml-auto flex flex-row gap-4">
                        {
                            (person.id !== 0 && person.azure_id !== null)
                                ? <Button style="link" color="gray" size="small" onClick={unlinkAzure}>Do not sync this person with Azure again</Button>
                                : null
                        }
                        {
                            (person.id !== 0)
                                ? <ConfirmDeleteButton text="DELETE This Record"
                                    onClick={deletePerson} />
                                : null
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Manage