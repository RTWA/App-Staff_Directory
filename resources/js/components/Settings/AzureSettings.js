import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Button, Input, Switch } from 'webapps-react';

import { TypeAhead } from '../TypeAhead';

axios.defaults.withCredentials = true;

let _mounted = false;

const AzureSettings = () => {
    const [states, setStates] = useState({});
    const [graph, setGraph] = useState({ tenantId: '', client_id: '', client_secret: '' });
    const [app, setApp] = useState({});
    const [changed, setChanged] = useState({});
    const [syncGroups, setSyncGroups] = useState([]);
    const [accessToken, setAccessToken] = useState(null);
    const [azGroups, setAzGroups] = useState([]);

    useEffect(() => {
        _mounted = true;
        getAzureDetails();
        getAppSettings();

        return () => _mounted = false;
    }, []);

    useEffect(async () => {
        if (graph.tenantId) {
            RequestAccessToken();
        }
    }, [graph]);

    useEffect(() => {
        if (accessToken) {
            getAzGroups();
        }
    }, [accessToken]);

    useEffect(() => {
        if (_mounted) {
            let formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('value', JSON.stringify(syncGroups));
            axios.post('/api/setting/app.StaffDirectory.azure.sync_groups', formData);
        }
    }, [syncGroups]);

    useEffect(() => {
        if (_mounted) {
            if (changed.create_departments) {
                // Update create_departments
                let formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('value', app.create_departments);
                axios.post('/api/setting/app.StaffDirectory.azure.create_departments', formData)
                    .then(json => {
                        states['create_departments'] = 'saved';
                        setStates({ ...states });
                        setTimeout(function () {
                            states['create_departments'] = '';
                            setStates({ ...states });
                        }, 2500);

                        changed.create_departments = false;
                        setChanged({ ...changed });
                    })
                    .catch(error => {
                        // TODO: handle errors
                        console.log(error);

                        states['create_departments'] = 'error';
                        setStates({ ...states });
                        setTimeout(function () {
                            states['create_departments'] = '';
                            setStates({ ...states });
                        }, 2500);
                    });
            }
            if (changed.technical_contact) {
                // Update technical_contact
                let formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('value', app.technical_contact);
                axios.post('/api/setting/app.StaffDirectory.azure.technical_contact', formData)
                    .then(json => {
                        states['technical_contact'] = 'saved';
                        setStates({ ...states });
                        setTimeout(function () {
                            states['technical_contact'] = '';
                            setStates({ ...states });
                        }, 2500);

                        changed.technical_contact = false;
                        setChanged({ ...changed });
                    })
                    .catch(error => {
                        // TODO: handle errors
                        console.log(error);

                        states['technical_contact'] = 'error';
                        setStates({ ...states });
                        setTimeout(function () {
                            states['technical_contact'] = '';
                            setStates({ ...states });
                        }, 2500);
                    });
            }
        }
    }, [app]);

    const getAzureDetails = async () => {
        let formData = new FormData();
        formData.append("key", JSON.stringify([
            "azure.graph.tenant",
            "azure.graph.client_id",
            "azure.graph.client_secret",
        ]));

        await axios.post('/api/setting', formData)
            .then(json => {
                if (_mounted) {
                    graph.tenantId = json.data['azure.graph.tenant'];
                    graph.client_id = json.data['azure.graph.client_id'];
                    graph.client_secret = json.data['azure.graph.client_secret'];
                    setGraph({ ...graph });
                }
            });
    }

    const getAppSettings = async () => {
        let formData = new FormData();
        formData.append("key", JSON.stringify([
            "app.StaffDirectory.azure.sync_groups",
            "app.StaffDirectory.azure.create_departments",
            "app.StaffDirectory.azure.technical_contact",
            "app.StaffDirectory.azure.last_sync",
        ]));

        await axios.post('/api/setting', formData)
            .then(json => {
                if (_mounted) {
                    app.create_departments = json.data['app.StaffDirectory.azure.create_departments'];
                    app.technical_contact = json.data['app.StaffDirectory.azure.technical_contact'];
                    app.last_sync = json.data['app.StaffDirectory.azure.last_sync'];
                    setApp({ ...app });
                    if (json.data['app.StaffDirectory.azure.sync_groups'] !== null) {
                        setSyncGroups(JSON.parse(json.data['app.StaffDirectory.azure.sync_groups']));
                    }
                }
            });
    }

    const RequestAccessToken = () => {
        axios.get('/api/graph/token')
            .then(json => {
                setAccessToken(json.data.token.access_token);
            });
    }

    const getAzGroups = () => {
        let headers = new Headers();
        let bearer = `Bearer ${accessToken}`;
        headers.append('Authorization', bearer);
        let options = {
            method: "GET",
            headers: headers,
        };
        let graphEndpoint = 'https://graph.microsoft.com/v1.0/groups?$select=id,displayName';

        fetch(graphEndpoint, options)
            .then(response => response.json())
            .then(data => setAzGroups(data.value));
    }

    const addSyncGroup = selected => {
        if (syncGroups.findIndex(elem => elem.id === selected.id) < 0) {
            setSyncGroups([
                ...syncGroups,
                selected
            ]);
        }
    }

    const removeSyncGroup = index => {
        syncGroups.splice(index, 1);
        setSyncGroups([...syncGroups]);
    }

    const onType = e => {
        app.technical_contact = e.target.value;
        setApp({ ...app });
    }

    const onChange = e => {
        states[e.target.id] = 'saving';
        setStates({ ...states });

        changed[e.target.id] = true;
        setChanged({ ...changed });

        if (e.target.id === "create_departments") {
            app.create_departments = (app.create_departments === 'true') ? 'false' : 'true';
        }
        setApp({ ...app });
    }

    const syncNow = e => {
        e.target.innerText = 'Syncing';
        axios.get('/api/apps/StaffDirectory/azure/sync');
    }

    if (graph.tenantId === '' || graph.client_id === "" || graph.client_secret === "" ||
        graph.tenantId === null || graph.client_id === null || graph.client_secret === null) {
        return (
            // TODO: Improve the look of this!
            <div className="px-4 lg:px-10 py-10 text-center">
                You must configure Microsoft Azure Integration in WebApps Settings first!
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col xl:flex-row py-4">
                <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="depList">Add Azure Group to Sync</label>
                <TypeAhead id="depList" name="depList" select={addSyncGroup} data={azGroups} labelKey="displayName" />
            </div>
            <div className="flex flex-col xl:flex-row py-4">
                <p className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base">Currently Syncing Groups</p>
                <div className="w-full rounded border px-2 pb-2 pt-1.5 mt-1 xl:mt-0">
                    <span className="inline-flex w-0 py-1 text-xs font-bold leading-none">&nbsp;</span>
                    {
                        Object(syncGroups).map(function (group, i) {
                            return (
                                <span key={i} className="inline-flex flex-row items-center justify-center text-xs font-bold leading-none mr-2">
                                    <div className="flex-grow px-2 py-1.5 bg-blue-200 dark:bg-blue-800">{group.displayName}</div>
                                    <div className="flex flex-grow-0 bg-blue-400 dark:bg-blue-900 px-1 py-1.5 cursor-pointer" onClick={() => removeSyncGroup(i)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                </span>
                            )
                        })
                    }
                </div>
            </div>
            <div className="flex flex-col xl:flex-row py-4">
                <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base"
                    htmlFor="create_departments">
                    Create Departments from User properties
                </label>
                <div className="mt-1 xl:mt-0 w-full">
                <Switch name="create_departments"
                            checked={(app.create_departments === 'true')}
                            onChange={onChange}
                            state={states['create_departments']} />
                    <p className="text-xs text-gray-400 dark:text-gray-200">
                    The Department string will be split on a '-' character (with a space either side) to create sub-departments.
                    </p>
                </div>
            </div>
            <div className="flex flex-col xl:flex-row py-4">
                <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base"
                    htmlFor="technical_contact">
                    Technical Contact Email Address
                </label>
                <Input name="technical_contact"
                        type="text"
                        id="technical_contact"
                        value={app.technical_contact || ''}
                        onChange={onType}
                        onBlur={onChange}
                        state={states['technical_contact']} />
            </div>            
            <div className="flex flex-col xl:flex-row py-4">
                <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="app">Last Synced</label>
                <div className="relative w-full">
                <Input name="app.last_sync"
                        id="app.last_sync"
                        type="text"
                        value={moment(app.last_sync).calendar()}
                        readOnly disabled />

                    <div className="w-full sm:w-auto sm:absolute inset-y-0 right-0 sm:flex items-center">
                        <Button style="ghost" color="gray" size="small" square
                            className="uppercase mr-1 w-full sm:w-auto sm:rounded-md"
                            onClick={syncNow}>
                            Sync Now
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AzureSettings;