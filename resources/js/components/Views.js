import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import { Button, Input, Switch, withWebApps } from 'webapps-react';

import { CustomFilter, DepartmentFilter, PersonFilter } from './Filters';
import { PermissionsModal, PreviewModal, TableFieldsModal, UseModal } from './Modals';

export const ModalsContext = createContext({});

const newView = {
    publicId: "new",
    settings: {
        perms: {
            all: true
        },
        fields: {}
    },
    display: 'all',
    display_type: 'grid'
};

const Views = ({ UI }) => {
    const [people, setPeople] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [custom, setCustom] = useState([]);
    const [views, setViews] = useState([]);
    const [selected, setSelected] = useState('');
    const [changed, setChanged] = useState(false);
    const [view, setView] = useState(newView);
    const [modals, setModals] = useState({
        permissions: false,
        tablefields: false,
        preview: false,
        useView: false
    });

    const { addToast, updateToast } = useToasts();

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        window.onbeforeunload = (changed) ? () => true : undefined;
    }, [changed]);

    const getData = () => {
        axios.get('/api/apps/StaffDirectory/peopleList')
            .then(response => {
                return response;
            })
            .then(json => {
                json.data.list.shift();
                setPeople(json.data.list);
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            });
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
        axios.get('/api/apps/StaffDirectory/views')
            .then(response => {
                return response;
            })
            .then(json => {
                setViews(json.data.views);
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            });
    }

    const loadView = e => {
        e.preventDefault();
        let publicId = e.target.id;

        if (changed) {
            if (!confirm("You have unsaved changes, are you sure you want to load a new view?")) {
                return;
            }
        }

        axios.get(`/api/apps/StaffDirectory/view/${publicId}`)
            .then(response => {
                return response;
            })
            .then(json => {
                let _view = json.data.view;
                _view.settings = JSON.parse(_view.settings);

                if (_view.settings.fields === undefined) {
                    _view.settings.fields = {};
                }
                if (_view.settings.perms === undefined) {
                    _view.settings.perms = {};
                }

                setView(_view);
                setChanged(false);
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            });
    }

    const saveView = e => {
        e.preventDefault();

        let save = null;
        addToast('Saving changes, please wait...', { appearance: 'info', autoDismiss: false }, (id) => save = id);

        let formData = new FormData();
        formData.append('view', JSON.stringify(view));
        axios.post(`/api/apps/StaffDirectory/view/${view.publicId}`, formData)
            .then(response => {
                return response;
            })
            .then(json => {
                updateToast(save, { appearance: 'success', autoDismiss: true, content: json.data.message });

                setChanged(false);
                getData();
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            });
    }

    const fieldChange = e => {
        view[e.target.id] = e.target.value;
        setView({ ...view });
        setChanged(true);
    }

    const checkChange = e => {
        view.settings[e.target.id] = (view.settings[e.target.id] === "true") ? "false" : "true";
        setView({ ...view });
        setChanged(true);
    }

    const departmentChange = department => {
        view.settings.department = department;
        setView({ ...view });
        setChanged(true);
    }

    const personChange = person => {
        view.settings.person = person.value;
        setView({ ...view });
        setChanged(true);
    }

    const customChange = e => {
        view.settings[view.display] = e.value;
        setView({ ...view });
        setChanged(true);
    }

    const permissionChange = (permission, value) => {
        view.settings.perms[permission] = value;
        setView({ ...view });
        setChanged(true);
    }

    const tableFieldsChange = (field, value) => {
        view.settings.fields[field] = value;
        setView({ ...view });
        setChanged(true);
    }

    const toggleModals = modal => {
        modals[modal] = !modals[modal];
        setModals({ ...modals });
    }

    return (
        <div className="flex flex-auto">
            <div className="w-10/12 px-4 py-6">
                <div className="w-full flex flex-row mb-5">
                    <h6 className="text-gray-600 dark:text-gray-400 text-2xl font-bold ml-6">Manage Views</h6>
                    <Button style="outline" className="ml-auto" onClick={(e) => {
                        e.preventDefault();
                        toggleModals('preview');
                    }}>
                        Preview
                    </Button>
                </div>
                {
                    (view.publicId === "all")
                        ? <div className="w-full bg-blue-300 dark:bg-blue-800 text-blue-800 dark:text-blue-300 border border-blue-800 dark:border-blue-300 px-4 py-2 mb-2 rounded">You cannot save changes to the default views!</div>
                        : null
                }
                <div className="flex flex-col min-w-0 break-words w-full mx-auto shadow bg-white dark:bg-gray-800 rounded">
                    <div className="flex flex-auto px-4 lg:px-10 py-4">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="name">Name your view</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <Input name="name"
                                type="text"
                                id="name"
                                value={view.name || ''}
                                onChange={fieldChange} />
                        </div>
                    </div>
                    <div className="flex flex-auto py-4">
                        <div className="w-full lg:w-4/12 flex flex-auto px-2 lg:px-5">
                            <label className="block py-2 pr-4 ml-auto" htmlFor="leading">Display primary help text?</label>
                            <div className="relative inline-block w-10 mr-auto mt-2 align-middle select-none">
                                <Switch name="leading"
                                    checked={(view.settings.leading === 'true')}
                                    id="leading"
                                    onChange={checkChange}
                                    disabled={(view.display !== "all" && view.display.includes("custom"))} />
                            </div>
                        </div>
                        <div className="w-full lg:w-4/12 flex flex-auto px-2 lg:px-5">
                            <label className="block py-2 pr-4 ml-auto" htmlFor="selectors">Display department selectors and name search?</label>
                            <div className="relative inline-block w-10 mr-auto mt-2 align-middle select-none">
                                <Switch name="selectors"
                                    checked={(view.settings.selectors === 'true')}
                                    id="selectors"
                                    onChange={checkChange}
                                    disabled={(view.display !== "all")} />
                            </div>
                        </div>
                        <div className="w-full lg:w-4/12 flex flex-auto px-2 lg:px-5">
                            <label className="block py-2 pr-4 ml-auto" htmlFor="sorttext">Display sort by text?</label>
                            <div className="relative inline-block w-10 mr-auto mt-2 align-middle select-none">
                                <Switch name="sorttext"
                                    checked={(view.settings.sorttext === 'true')}
                                    id="sorttext"
                                    onChange={checkChange}
                                    disabled={(view.display !== "all" && view.display.includes("custom"))} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-auto px-4 lg:px-10 py-4">
                        <div className="flex flex-auto w-full lg:w-6/12 pr-4">
                            <div className="w-full lg:w-3/12">
                                <label className="block py-2" htmlFor="display">Records to display</label>
                            </div>
                            <div className="w-full lg:w-9/12">
                                <select className="input-field" id="display" value={view.display} onChange={fieldChange}>
                                    <option value="all">Everyone</option>
                                    <option value="department">A Department</option>
                                    <option value="person">A Single Person</option>
                                    {
                                        Object(custom).map(function (field, i) {
                                            if (field.type === "select") {
                                                return <option value={field.field} key={i}>Based on {field.label}</option>
                                            }
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-auto w-full lg:w-6/12">
                            <div className="w-full lg:w-3/12">
                                <label className="block py-2" htmlFor="display_type">Display Type</label>
                            </div>
                            <div className="w-full lg:w-9/12">
                                <select className="input-field" id="display_type" value={view.display_type} onChange={fieldChange}>
                                    <option value="grid">3D Flip Photo Grid</option>
                                    <option value="table">Table</option>
                                    <option value="card">Profile Card</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <DepartmentFilter
                        display={(view.display === 'department')}
                        departments={departments}
                        onChange={departmentChange}
                        value={view.settings.department || null} />
                    <PersonFilter
                        display={(view.display === 'person')}
                        people={people}
                        onChange={personChange}
                        value={view.settings.person || null} />
                    <CustomFilter
                        display={(view.display.includes('custom'))}
                        custom={custom}
                        field={view.display}
                        value={view.settings[view.display] || null}
                        onChange={customChange} />
                </div>

                <div className="flex flex-row mt-6">
                    <Button className="mr-4" style="outline" color="gray"
                    onClick={(e) => {
                            e.preventDefault();
                            toggleModals('permissions');
                        }}>
                        Set who can view this
                    </Button>
                    {
                        (view.display_type === "table")
                            ? <Button className="mr-auto" style="outline" color="gray"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleModals('tableFields');
                                }}>
                                Choose table fields
                              </Button>
                            : <span className="mr-auto">&nbsp;</span>
                    }
                    {
                        (view.publicId !== "new")
                            ? <Button className="ml-auto" style="outline" color="green"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleModals('useView');
                                }}>
                                Use This View
                              </Button>
                            : <span className="ml-auto">&nbsp;</span>
                    }
                    {
                        (view.publicId !== "all")
                            ? <Button className="ml-4" color="green" onClick={saveView}>Save View</Button>
                            : null
                    }
                </div>
            </div>
            <div className="w-2/12 px-4 py-6">
                <h6 className="text-gray-600 dark:text-gray-400 text-xl font-semibold ml-6 mb-8">Default Views</h6>
                <ul className="flex flex-col min-w-0 break-words w-full mx-auto shadow bg-white dark:bg-gray-800 rounded divide-y overflow-hidden">
                    <li className="relative block p-4 hover:bg-gray-50 hover:text-indigo-600 dark:hover:bg-gray-700 dark:hover:text-text-indigo-500">
                        <a href="#" id="all" onClick={loadView}>All Staff</a>
                    </li>
                </ul>

                <h6 className="text-gray-600 dark:text-gray-400 text-xl font-semibold ml-6 my-8">My Custom Views</h6>
                <ul className="flex flex-col min-w-0 break-words w-full mx-auto shadow bg-white dark:bg-gray-800 rounded divide-y overflow-hidden">
                    {
                        (views.length !== 0)
                            ? Object(views).map(function (_view, idx) {
                                return (
                                    <li className="relative block p-4 hover:bg-gray-50 hover:text-indigo-600 dark:hover:bg-gray-700 dark:hover:text-text-indigo-500" key={idx}>
                                        <a href="#" id={_view.publicId} onClick={loadView}>{_view.name}</a>
                                    </li>
                                );
                            })
                            : (
                                <li className="relative block p-4">
                                    You have no custom views
                                </li>
                            )
                    }
                </ul>
            </div>

            <ModalsContext.Provider value={{
                modals
            }}>
                <PermissionsModal
                    closeModal={() => toggleModals('permissions')}
                    permissions={view.settings.perms}
                    onChange={permissionChange} />
                <TableFieldsModal
                    closeModal={() => toggleModals('tableFields')}
                    fields={view.settings.fields || {}}
                    customFields={custom}
                    onChange={tableFieldsChange} />
                <UseModal
                    closeModal={() => toggleModals('useView')}
                    publicId={view.publicId} />
                <PreviewModal
                    closeModal={() => toggleModals('preview')}
                    view={view}
                    people={people} />
            </ModalsContext.Provider>
        </div>
    )
}

export default withWebApps(Views);