import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { APIClient, Switch, withWebApps } from 'webapps-react';
import { CustomFields } from './index';

let timers = [null, null];

const SelectFields = props => {
    const [sections, setSections] = useState({
        personal: {},
        departments: {},
        employment: {},
    });
    const [states, setStates] = useState({
        personal: { fields: {} },
        departments: { fields: {} },
        employment: { fields: {} },
    });

    const APIController = new AbortController();

    useEffect(async () => {
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
            .then(json => {
                sections.personal.show = json.data["app.StaffDirectory.section.personal.show"];
                sections.departments.show = json.data["app.StaffDirectory.section.departments.show"];
                sections.employment.show = json.data["app.StaffDirectory.section.employment.show"];
                sections.personal.hide = JSON.parse(json.data["app.StaffDirectory.fields.personal.hide"]);
                sections.departments.hide = JSON.parse(json.data["app.StaffDirectory.fields.departments.hide"]);
                sections.employment.hide = JSON.parse(json.data["app.StaffDirectory.fields.employment.hide"]);
                setSections({ ...sections });
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    console.log(error)
                }
            });

        return () => {
            APIController.abort();
            if (timers[0]) {
                clearTimeout(timers[0]);
            }
            if (timers[1]) {
                clearTimeout(timers[1]);
            }
        }
    }, []);

    const toggleSection = async section => {
        states[section].show = 'saving';
        setStates({...states});

        sections[section].show = (sections[section].show === 'true') ? 'false' : 'true';
        setSections({ ...sections });

        await APIClient(`/api/setting/app.StaffDirectory.section.${section}.show`,
        {
            value: sections[section].show
        },
        {
            signal: APIController.signal,
            method: 'PUT'
        })
        .then(json => {
            states[section].show = 'saved';
            setStates({...states});

            timers[0] = setTimeout(function() {
                states[section].show = '';
                setStates({...states});
            }, 2500);
        })
        .catch(error => {
            if (!error.status?.isAbort) {
                console.log(error)

                states[section].show = 'error';
                setStates({...states});
            }
        });
    }

    const toggleField = async e => {
        let section = e.target.dataset.section;
        let field = e.target.id;
        
        states[section].fields[field] = 'saving';
        setStates({...states});

        let index = sections[section].hide.indexOf(field)

        if (index < 0) {
            sections[section].hide.push(field);
        } else {
            sections[section].hide.splice(index, 1);
        }

        setSections({ ...sections });

        await APIClient(`/api/setting/app.StaffDirectory.fields.${section}.hide`,
        {
            value: JSON.stringify(sections[section].hide)
        },
        {
            signal: APIController.signal,
            method: 'PUT'
        })
        .then(json => {
            states[section].fields[field] = 'saved';
            setStates({...states});

            timers[0] = setTimeout(function() {
                states[section].fields[field] = '';
                setStates({...states});
            }, 2500);
        })
        .catch(error => {
            if (!error.status?.isAbort) {
                console.log(error)

                states[section].fields[field] = 'error';
                setStates({...states});
            }
        });
    }

    const paneClass = section => classNames(
        'p-4',
        'bg-white',
        'dark:bg-gray-800',
        (sections[section].show === 'true') ? 'block' : 'hidden'
    )

    return (
        <>
            <div className="border cursor-pointer rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-700 mb-2">
                <div className="flex flex-row items-center w-full">
                    <p className="flex-1 p-4">Personal Details</p>
                </div>
                <div className={paneClass('personal')}>
                    <Switch
                        id="username"
                        name="username"
                        label="Username"
                        helpText="Toggle to show or hide this field"
                        className="mb-2"
                        checked={!sections.personal.hide?.includes('username')}
                        state={states.personal.fields.username}
                        data-section="personal"
                        onChange={toggleField}
                    />
                    <Switch
                        id="employee_id"
                        name="employee_id"
                        label="Employee ID"
                        helpText="Toggle to show or hide this field"
                        className="mb-2"
                        checked={!sections.personal.hide?.includes('employee_id')}
                        state={states.personal.fields.employee_id}
                        data-section="personal"
                        onChange={toggleField}
                    />
                    <Switch
                        id="email"
                        name="email"
                        label="Email Address"
                        helpText="Toggle to show or hide this field"
                        className="mb-2"
                        checked={!sections.personal.hide?.includes('email')}
                        state={states.personal.fields.email}
                        data-section="personal"
                        onChange={toggleField}
                    />
                    <Switch
                        id="startDate"
                        name="startDate"
                        label="Username"
                        helpText="Start Date"
                        className="mb-2"
                        checked={!sections.personal.hide?.includes('startDate')}
                        state={states.personal.fields.startDate}
                        data-section="personal"
                        onChange={toggleField}
                    />
                </div>
            </div>
            <div className="border cursor-pointer rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-700 mb-2">
                <div className="flex flex-row items-center w-full">
                    <p className="flex-1 p-4">Department Details</p>
                    <div className="ml-auto p-4 border-l dark:border-gray-700 flex items-center" onClick={() => toggleSection('departments')}>
                        {
                            (sections.departments.show === 'true')
                                ? (
                                    <>
                                        Hide this section
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-5 mr-px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    </>
                                )
                                : (
                                    <>
                                        Show this section
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </>
                                )
                        }
                    </div>
                </div>
                <div className={paneClass('departments')}>
                    <Switch
                        id="head"
                        name="head"
                        label="Head of Department"
                        helpText="Toggle to show or hide this field"
                        checked={!sections.departments.hide?.includes('head')}
                        state={states.departments.fields.head}
                        data-section="departments"
                        onChange={toggleField}
                    />
                </div>
            </div>
            <div className="border cursor-pointer rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-700 mb-2">
                <div className="flex flex-row w-full">
                    <p className="flex-1 p-4">Employment Details</p>
                    <div className="ml-auto p-4 border-l dark:border-gray-700 flex items-center" onClick={() => toggleSection('employment')}>
                        {
                            (sections.employment.show === 'true')
                                ? (
                                    <>
                                        Hide this section
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-5 mr-px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    </>
                                )
                                : (
                                    <>
                                        Show this section
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </>
                                )
                        }
                    </div>
                </div>
                <div className={paneClass('employment')}>
                    <Switch
                        id="title"
                        name="title"
                        label="Job Title"
                        helpText="Toggle to show or hide this field"
                        className="mb-2"
                        checked={!sections.employment.hide?.includes('title')}
                        state={states.employment.fields.title}
                        data-section="employment"
                        onChange={toggleField}
                    />
                    <Switch
                        id="phone"
                        name="phone"
                        label="Phone Number"
                        helpText="Toggle to show or hide this field"
                        className="mb-2"
                        checked={!sections.employment.hide?.includes('phone')}
                        state={states.employment.fields.phone}
                        data-section="employment"
                        onChange={toggleField}
                    />
                    <Switch
                        id="onLeave"
                        name="onLeave"
                        label="Staff member is on leave"
                        helpText="Toggle to show or hide this field"
                        className="mb-2"
                        checked={!sections.employment.hide?.includes('onLeave')}
                        state={states.employment.fields.onLeave}
                        data-section="employment"
                        onChange={toggleField}
                    />
                    <Switch
                        id="isCover"
                        name="isCover"
                        label="Staff member is Maternity Cover"
                        helpText="Toggle to show or hide this field"
                        className="mb-2"
                        checked={!sections.employment.hide?.includes('isCover')}
                        state={states.employment.fields.isCover}
                        data-section="employment"
                        onChange={toggleField}
                    />
                    <Switch
                        id="isSenior"
                        name="isSenior"
                        label="Staff member is Senior"
                        helpText="Toggle to show or hide this field"
                        className="mb-2"
                        checked={!sections.employment.hide?.includes('isSenior')}
                        state={states.employment.fields.isSenior}
                        data-section="employment"
                        onChange={toggleField}
                    />
                </div>
            </div>
            <div className="border cursor-pointer rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-700 mb-2">
                <div className="flex flex-row w-full">
                    <p className="flex-1 p-4">Custom Fields</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 block">
                    <CustomFields />
                </div>
            </div>
        </>
    );
}

export default withWebApps(SelectFields);