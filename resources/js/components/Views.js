import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
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

const Views = () => {
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
                    <a href="#" className="px-4 py-2 ml-auto text-indigo-600 border border-indigo-600 hover:border-indigo-700 hover:bg-indigo-700 hover:text-white rounded shadow-xl"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleModals('preview');
                        }}>
                        Preview
                    </a>
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
                            <input name="name"
                                type="text"
                                id="name"
                                value={view.name || ''}
                                onChange={fieldChange}
                                className="input-field" />
                        </div>
                    </div>
                    <div className="flex flex-auto py-4">
                        <div className="w-full lg:w-4/12 flex flex-auto px-2 lg:px-5">
                            <label className="block py-2 pr-4 ml-auto" htmlFor="leading">Display primary help text?</label>
                            <div className="relative inline-block w-10 mr-auto mt-2 align-middle select-none">
                                <input type="checkbox"
                                    name="leading"
                                    checked={(view.settings.leading === 'true')}
                                    id="leading"
                                    onChange={checkChange}
                                    disabled={(view.display !== "all" && view.display.includes("custom"))}
                                    className="checked:bg-gray-500 outline-none focus:ring-0 focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                <label htmlFor="onLeave" className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" />
                            </div>
                        </div>
                        <div className="w-full lg:w-4/12 flex flex-auto px-2 lg:px-5">
                            <label className="block py-2 pr-4 ml-auto" htmlFor="selectors">Display department selectors and name search?</label>
                            <div className="relative inline-block w-10 mr-auto mt-2 align-middle select-none">
                                <input type="checkbox"
                                    name="selectors"
                                    checked={(view.settings.selectors === 'true')}
                                    id="selectors"
                                    onChange={checkChange}
                                    disabled={(view.display !== "all")}
                                    className="checked:bg-gray-500 outline-none focus:ring-0 focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                <label htmlFor="onLeave" className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" />
                            </div>
                        </div>
                        <div className="w-full lg:w-4/12 flex flex-auto px-2 lg:px-5">
                            <label className="block py-2 pr-4 ml-auto" htmlFor="sorttext">Display sort by text?</label>
                            <div className="relative inline-block w-10 mr-auto mt-2 align-middle select-none">
                                <input type="checkbox"
                                    name="sorttext"
                                    checked={(view.settings.sorttext === 'true')}
                                    id="sorttext"
                                    onChange={checkChange}
                                    disabled={(view.display !== "all" && view.display.includes("custom"))}
                                    className="checked:bg-gray-500 outline-none focus:ring-0 focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                <label htmlFor="onLeave" className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" />
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
                    <a href="#" className="px-4 py-2 mr-4 text-gray-500 border border-gray-500 hover:border-gray-700 hover:bg-gray-700 hover:text-white rounded shadow-xl"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleModals('permissions');
                        }}>
                        Set who can view this
                    </a>
                    {
                        (view.display_type === "table")
                            ? <a href="#" className="px-4 py-2 mr-auto text-gray-500 border border-gray-500 hover:border-gray-700 hover:bg-gray-700 hover:text-white rounded shadow-xl"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleModals('tableFields');
                                }}>
                                Choose table fields
                              </a>
                            : <span className="mr-auto">&nbsp;</span>
                    }
                    {
                        (view.publicId !== "new")
                            ? <a href="#" className="px-4 py-2 ml-auto text-green-500 border border-green-500 hover:border-green-700 hover:bg-green-700 hover:text-white rounded shadow-xl"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleModals('useView');
                                }}>
                                Use This View
                              </a>
                            : <span className="ml-auto">&nbsp;</span>
                    }
                    {
                        (view.publicId !== "all")
                            ? <a href="#" className="px-4 py-2 ml-4 bg-green-500 hover:bg-green-700 hover:text-white rounded shadow-xl" onClick={saveView}>Save View</a>
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

export default Views;