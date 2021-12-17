import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import { Button, Input, Loader, Switch, withWebApps } from 'webapps-react';

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
    const [people, setPeople] = useState(null);
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

    useEffect(async () => {
        await getData();
    }, []);

    useEffect(() => {
        window.onbeforeunload = (changed) ? () => true : undefined;
    }, [changed]);

    const getData = async () => {
        await axios.get('/api/apps/StaffDirectory/peopleList')
            .then(json => {
                json.data.list.shift();
                setPeople(json.data.list);
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            });
        await axios.get('/api/apps/StaffDirectory/departmentList')
            .then(json => {
                setDepartments(json.data.list);
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            });
        await axios.get('/api/apps/StaffDirectory/customFields')
            .then(json => {
                setCustom(json.data.list);
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            });
        await axios.get('/api/apps/StaffDirectory/views')
            .then(json => {
                setViews(json.data.views);
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            });
    }

    const loadView = async e => {
        e.preventDefault();
        let publicId = e.target.id;

        if (changed) {
            if (!confirm("You have unsaved changes, are you sure you want to load a new view?")) {
                return;
            }
        }

        await axios.get(`/api/apps/StaffDirectory/view/${publicId}`)
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

    const saveView = async e => {
        e.preventDefault();

        let save = null;
        addToast('Saving changes, please wait...', { appearance: 'info', autoDismiss: false }, (id) => save = id);

        let formData = new FormData();
        formData.append('view', JSON.stringify(view));
        await axios.post(`/api/apps/StaffDirectory/view/${view.publicId}`, formData)
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

    if (people === null) {
        return <Loader className="min-h-screen flex items-center" />
    }

    return (
        <div className="flex flex-col 2xl:flex-row">
            <div className="w-full 2xl:w-10/12 2xl:pr-2 py-6">
                <div className="w-full flex flex-row mb-5">
                    <h6 className="text-gray-600 dark:text-gray-400 text-2xl font-bold 2xl:ml-6">Manage Views</h6>
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
                    <div className="w-full flex flex-col xl:flex-row py-4 px-4">
                        <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="name">Name your view</label>
                        <Input name="name"
                            type="text"
                            id="name"
                            value={view.name || ''}
                            onChange={fieldChange} />
                    </div>
                    <div className="flex flex-col lg:flex-row items-center mt-2">
                        <div className="w-full lg:w-4/12 flex flex-row items-center px-4 py-2 xl:py-0">
                            <label className="w-11/12 font-medium xl:font-normal text-sm xl:text-base" htmlFor="leading">Display primary help text?</label>
                            <Switch name="leading"
                                checked={(view.settings.leading === 'true')}
                                id="leading"
                                onChange={checkChange}
                                disabled={(view.display !== "all" && view.display.includes("custom"))} />
                        </div>
                        <div className="w-full lg:w-4/12 flex flex-row items-center py-2 px-4 xl:py-0">
                            <label className="w-11/12 font-medium xl:font-normal text-sm xl:text-base" htmlFor="selectors">Display department selectors and name search?</label>
                            <Switch name="selectors"
                                checked={(view.settings.selectors === 'true')}
                                id="selectors"
                                onChange={checkChange}
                                disabled={(view.display !== "all")} />
                        </div>
                        <div className="w-full lg:w-4/12 flex flex-row items-center px-4 py-2 xl:py-0">
                            <label className="w-11/12 font-medium xl:font-normal text-sm xl:text-base" htmlFor="sorttext">Display sort by text?</label>
                            <Switch name="sorttext"
                                checked={(view.settings.sorttext === 'true')}
                                id="sorttext"
                                onChange={checkChange}
                                disabled={(view.display !== "all" && view.display.includes("custom"))} />
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row items-center my-2">
                        <div className="w-full lg:w-6/12 flex flex-col xl:flex-row py-2 px-4">
                            <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="display">Records to display</label>
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
                        <div className="w-full lg:w-6/12 flex flex-col xl:flex-row py-2 px-4">
                            <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="display_type">Display Type</label>
                            <select className="input-field" id="display_type" value={view.display_type} onChange={fieldChange}>
                                <option value="grid">3D Flip Photo Grid</option>
                                <option value="table">Table</option>
                                <option value="card">Profile Card</option>
                            </select>
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

                <div className="flex flex-col 2xl:flex-row mt-6">
                    <Button className="mb-2 2xl:mb-0 2xl:mr-4" style="outline" color="gray"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleModals('permissions');
                        }}>
                        Set who can view this
                    </Button>
                    {
                        (view.display_type === "table")
                            ? <Button className="mb-2 2xl:mb-0 2xl:mr-auto" style="outline" color="gray"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleModals('tableFields');
                                }}>
                                Choose table fields
                            </Button>
                            : <span className="hidden 2xl:block 2xl:mr-auto">&nbsp;</span>
                    }
                    {
                        (view.publicId !== "new")
                            ? <Button className="mb-2 2xl:mb-0 2xl:ml-auto" style="outline" color="green"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleModals('useView');
                                }}>
                                Use This View
                            </Button>
                            : <span className="hidden 2xl:block 2xl:ml-auto">&nbsp;</span>
                    }
                    {
                        (view.publicId !== "all")
                            ? <Button className="mb-2 2xl:mb-0 2xl:ml-4" color="green" onClick={saveView}>Save View</Button>
                            : null
                    }
                </div>
            </div>
            <div className="w-full 2xl:w-2/12 2xl:pl-2 py-6">
                <div className="flex flex-col sm:flex-row 2xl:flex-col">
                    <div className="flex flex-col w-full sm:w-6/12 2xl:w-full sm:pr-2 2xl:pr-0 mb-4 sm:mb-0">
                        <h6 className="text-gray-600 dark:text-gray-400 text-xl font-semibold 2xl:ml-6 mb-4 2xl:mb-8">Default Views</h6>
                        <ul className="flex flex-col min-w-0 break-words w-full mx-auto shadow bg-white dark:bg-gray-800 rounded divide-y overflow-hidden">
                            <li className="relative block p-4 hover:bg-gray-50 hover:text-indigo-600 dark:hover:bg-gray-700 dark:hover:text-text-indigo-500">
                                <a href="#" id="all" onClick={loadView}>All Staff</a>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col w-full sm:w-6/12 2xl:w-full sm:pl-2 2xl:pl-0">
                        <h6 className="text-gray-600 dark:text-gray-400 text-xl font-semibold 2xl:ml-6 mb-4 2xl:my-8">My Custom Views</h6>
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
                </div>
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