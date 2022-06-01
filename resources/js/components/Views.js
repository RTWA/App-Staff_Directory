import React, { createContext, useContext, useEffect, useState } from 'react';
import { APIClient, AppPage, Banner, Button, ConfirmDeleteButton, Drawer, DrawerHeader, DrawerItem, DrawerItems, Flyout, Input, Loader, PageWrapper, Select, Switch, useToasts, WebAppsUXContext, withWebApps } from 'webapps-react';

import { CustomFilter, DepartmentFilter, PersonFilter } from './Filters';
import { PermissionsModal, PreviewModal, TableFieldsModal, UseModal } from './Modals';

export const FlyoutContext = createContext({});

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
    const [changed, setChanged] = useState(false);
    const [view, setView] = useState(newView);
    const [isUseView, setIsUseView] = useState(false);
    const [current, setCurrent] = useState();
    const [errors, setErrors] = useState({});

    const { addToast, updateToast } = useToasts();
    const { useFlyouts } = useContext(WebAppsUXContext);
    const { closeFlyout, openFlyout } = useFlyouts;

    const APIController = new AbortController();

    useEffect(async () => {
        await getViews();
        await getData();

        return () => {
            APIController.abort();
        }
    }, []);

    useEffect(() => {
        window.onbeforeunload = (changed) ? () => true : undefined;
    }, [changed]);

    const getData = async () => {
        await APIClient('/api/apps/StaffDirectory/peopleList', undefined, { signal: APIController.signal })
            .then(json => {
                json.data.list.shift();
                setPeople(json.data.list);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: handle errors
                    console.log(error);
                }
            });
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

    const getViews = async () => {
        await APIClient('/api/apps/StaffDirectory/views', undefined, { signal: APIController.signal })
            .then(json => {
                setViews(json.data.views);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: handle errors
                    console.log(error);
                }
            });
    }

    const createNew = e => {
        e.preventDefault();

        if (changed) {
            if (!confirm("You have unsaved changes, are you sure you want to load a new view?")) {
                return;
            }
        }

        setView(newView);
        setChanged(false);
    }

    const loadView = async e => {
        e.preventDefault();
        let publicId = e.currentTarget.id;

        if (changed) {
            if (!confirm("You have unsaved changes, are you sure you want to load a new view?")) {
                return;
            }
        }

        await APIClient(`/api/apps/StaffDirectory/view/${publicId}`, undefined, { signal: APIController.signal })
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
                setIsUseView(false);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    addToast('Failed to load view!', error.data?.message, { appearance: 'error' });
                }
            });
    }

    const saveView = async e => {
        e.preventDefault();

        if (view.name === '' || !view.name) {
            errors.name = 'You must name your view.';
            setErrors({ ...errors });
            return;
        }

        let save = null;
        addToast('Saving changes, please wait...', '', { appearance: 'info', autoDismiss: false }, (id) => save = id);

        let formData = new FormData();
        formData.append('view', JSON.stringify(view));
        await APIClient(`/api/apps/StaffDirectory/view/${view.publicId}`, { view: JSON.stringify(view) }, { signal: APIController.signal })
            .then(async json => {
                updateToast(save, { appearance: 'success', autoDismiss: true, title: json.data.message });

                setChanged(false);
                setView(json.data.view);
                await getViews();
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    updateToast(save, { appearance: 'error', autoDismiss: true, title: 'There was a problem saving!', content: json.data.message });
                }
            });
    }

    const deleteView = async () => {
        await APIClient(`/api/apps/StaffDirectory/view/${view.publicId}`, undefined, { method: 'DELETE', signal: APIController.signal })
            .then(async json => {
                addToast(json.data.message, '', { appearance: 'success' });
                setView(newView);
                setChanged(false);
                await getViews();
            })
            .catch(error => {
                addToast('Unable to delete!', error.data?.message, { appearance: 'error' });
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

    const closeAllFlyouts = () => {
        setCurrent();
        closeFlyout();
    }

    const openAFlyout = panel => {
        setCurrent(panel);
        openFlyout();
    }

    if (people === null) {
        return <Loader className="min-h-screen flex items-center" />
    }

    return (
        <AppPage>
            <Drawer>
                <DrawerHeader>Default Views</DrawerHeader>
                <DrawerItems>
                    <DrawerItem
                        href="#"
                        id="all"
                        onClick={loadView}
                        color="blue"
                    >
                        All Staff
                    </DrawerItem>
                </DrawerItems>
                <DrawerHeader>My Views</DrawerHeader>
                <DrawerItems>
                    {
                        (views.length !== 0)
                            ? Object(views).map(function (_view, idx) {
                                return (
                                    <DrawerItem key={idx} href="#" id={_view.publicId} onClick={loadView}>
                                        {_view.name}
                                    </DrawerItem>
                                );
                            }) : null
                    }
                    <DrawerItem
                        href="#"
                        onClick={createNew}
                        color="green"
                    >
                        Create New View
                    </DrawerItem>
                </DrawerItems>
            </Drawer>
            <PageWrapper title={(view.publicId === 'new') ? 'Create a new view' : (view.publicId === 'all') ? 'All Staff View' : 'Custom View'}>
                <div className="shadow rounded overflow-hidden">
                    <div className="flex flex-col xl:flex-row bg-gray-50">
                        <Button
                            type="link"
                            className="ml-auto flex flex-row items-center gap-2 font-normal"
                            onClick={() => {
                                closeAllFlyouts();
                                setCurrent('preview');
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Preview
                        </Button>
                    </div>
                    {
                        (view.publicId === "all")
                            ? <Banner color="blue-300" darkColor="blue-800" className="text-blue-900 dark:text-blue-300">You cannot save changes to the default views!</Banner>
                            : null
                    }
                    <div className="flex flex-col min-w-0 break-words bg-white dark:bg-gray-800 p-4">
                        {
                            (!isUseView)
                                ? (
                                    <>
                                        <Input
                                            id="name"
                                            name="name"
                                            label="Name your view"
                                            type="text"
                                            value={view.name || ''}
                                            onChange={fieldChange}
                                            state={(errors.name) ? 'error' : ''}
                                            error={errors.name}
                                        />
                                        <div className="flex flex-col lg:flex-row items-center mt-2 mb-6">
                                            <Switch
                                                id="leading"
                                                name="leading"
                                                label="Display primary help text?"
                                                checked={(view.settings.leading === 'true')}
                                                onChange={checkChange}
                                                disabled={(view.display !== "all" && view.display.includes("custom"))}
                                                className="w-full lg:w-4/12 flex flex-row items-center px-4 py-2 xl:py-0" />
                                            <Switch
                                                id="selectors"
                                                name="selectors"
                                                label="Display department selectors and name search?"
                                                checked={(view.settings.selectors === 'true')}
                                                onChange={checkChange}
                                                disabled={(view.display !== "all")}
                                                className="w-full lg:w-4/12 flex flex-row items-center px-4 py-2 xl:py-0" />
                                            <Switch
                                                id="sorttext"
                                                name="sorttext"
                                                label="Display sort by text?"
                                                checked={(view.settings.sorttext === 'true')}
                                                onChange={checkChange}
                                                disabled={(view.display !== "all" && view.display.includes("custom"))}
                                                className="w-full lg:w-4/12 flex flex-row items-center px-4 py-2 xl:py-0" />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                            <Select
                                                id="display"
                                                name="display"
                                                label="Records to display"
                                                value={view.display}
                                                onChange={fieldChange}>
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
                                            </Select>
                                            <Select
                                                id="display_type"
                                                name="display_type"
                                                label="Display Type"
                                                value={view.display_type}
                                                onChange={fieldChange}>
                                                <option value="grid">3D Flip Photo Grid</option>
                                                <option value="table">Table</option>
                                                <option value="card">Profile Card</option>
                                                <option value="simple">Simple Card</option>
                                            </Select>
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
                                    </>
                                ) : <UseModal publicId={view.publicId} />
                        }
                    </div>

                    <div className="flex flex-col xl:flex-row gap-x-4 gap-y-2 bg-gray-50">
                        <Button
                            type="link"
                            color="gray"
                            className="flex flex-row items-center gap-2 font-normal"
                            onClick={() => {
                                openAFlyout('permissions');
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Set who can view this
                        </Button>
                        {
                            (view.display_type === "table")
                                ? <Button
                                    type="link"
                                    color="gray"
                                    className="flex flex-row items-center gap-2 font-normal"
                                    onClick={() => {
                                        openAFlyout('tableFields');
                                    }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Choose table fields
                                </Button>
                                : null
                        }
                        {
                            (view.publicId !== "new")
                                ? <ConfirmDeleteButton type="link" onClick={deleteView} text="Delete View" />
                                : null
                        }
                        <div className="hidden xl:block xl:mx-auto" />
                        {
                            (view.publicId !== "new")
                                ? (isUseView)
                                    ? <Button
                                        type="link"
                                        color="green"
                                        className="flex flex-row items-center gap-2 font-normal"
                                        onClick={() => setIsUseView(false)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Edit View
                                    </Button>
                                    : <Button
                                        type="link"
                                        color="green"
                                        className="flex flex-row items-center gap-2 font-normal"
                                        onClick={() => setIsUseView(true)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                        Use This View
                                    </Button>
                                : null
                        }
                        {
                            (view.publicId !== "all")
                                ? <Button
                                    type="link"
                                    color="green"
                                    className="flex flex-row items-center gap-2 font-normal"
                                    onClick={saveView}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save View
                                </Button>
                                : null
                        }
                    </div>
                </div>
            </PageWrapper>
            <FlyoutContext.Provider value={{
                current
            }}>
                <Flyout>
                    <PermissionsModal
                        close={closeAllFlyouts}
                        permissions={view.settings.perms}
                        onChange={permissionChange} />
                    <TableFieldsModal
                        close={closeAllFlyouts}
                        fields={view.settings.fields || {}}
                        customFields={custom}
                        onChange={tableFieldsChange} />
                </Flyout>
                {/* <UseModal
                            closeModal={() => toggleModals('useView')}
                            publicId={view.publicId} /> */}
                <PreviewModal
                    closeModal={closeAllFlyouts}
                    view={view}
                    people={people} />
            </FlyoutContext.Provider>
        </AppPage>
    )
}

export default withWebApps(Views);