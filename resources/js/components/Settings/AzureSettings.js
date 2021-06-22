import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Badge, Button, Input, Switch } from 'webapps-react';

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

    const addSyncGroup = e => {
        if (e.target.value !== "") {
            let azGroup = {
                displayName: e.target.options[e.target.selectedIndex].dataset.name,
                id: e.target.options[e.target.selectedIndex].value
            };

            if (syncGroups.findIndex(elem => elem.id === azGroup.id) < 0) {
                setSyncGroups([
                    ...syncGroups,
                    azGroup
                ]);
            }
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

    if (graph.tenantId === '' || graph.client_id === "" || graph.client_secret === "") {
        return (
            // TODO: Improve the look of this!
            <div>
                You must configure Microsoft Azure Integration in WebApps Settings first!
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                <div className="w-full lg:w-3/12">
                    <label className="block py-2" htmlFor="depList">Add Azure Group to Sync</label>
                </div>
                <div className="w-full lg:w-9/12">
                    {/* TODO: Replace with TypeAhead */}
                    <select id="azGroupsList" onChange={addSyncGroup} className="input-field">
                        <option value="">Select...</option>
                        {
                            Object(azGroups).map(function (azGroup, i) {
                                return <option key={i} data-name={azGroup.displayName} value={azGroup.id}>{azGroup.displayName}</option>
                            })
                        }
                    </select>
                </div>
            </div>
            <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                <div className="w-full lg:w-3/12">
                    <p className="block py-2">Currently Syncing Groups</p>
                </div>
                <div className="w-full lg:w-9/12">
                    <div className="rounded border px-2 py-2">
                        <span className="inline-flex w-0 py-1 text-xs font-bold leading-none">&nbsp;</span>
                        {
                            Object(syncGroups).map(function (group, i) {
                                return (
                                    <Badge key={i} color="blue-200" className="mr-2 flex flex-row">
                                        <div className="flex-grow">{group.displayName}</div>
                                        <div className="flex flex-grow-0 bg-blue-400 ml-1 -mr-2 -my-1 px-1 py-1 cursor-pointer" onClick={() => removeSyncGroup(i)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    </Badge>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                <div className="w-full lg:w-3/12">
                    <label className="block py-2" htmlFor="create_departments">Create Departments from User properties</label>
                </div>
                <div className="w-full lg:w-9/12 flex flex-col">
                    <div className="relative inline-block w-10 mr-2 mt-2 align-middle select-none">
                        <Switch name="create_departments"
                            checked={(app.create_departments === 'true')}
                            onChange={onChange}
                            state={states['create_departments']} />
                    </div>
                    <span className="mt-2 text-xs text-gray-400">
                        The Department string will be split on a '-' character to create sub-departments.
                    </span>
                </div>
            </div>

            <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                <div className="w-full lg:w-3/12">
                    <label className="block py-2" htmlFor="technical_contact">Technical Contact Email Address</label>
                </div>
                <div className="w-full lg:w-9/12">
                    <Input name="technical_contact"
                        type="text"
                        id="technical_contact"
                        value={app.technical_contact || ''}
                        onChange={onType}
                        onBlur={onChange}
                        state={states['technical_contact']} />
                </div>
            </div>

            <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                <div className="w-full lg:w-3/12">
                    <label className="block py-2" htmlFor="app">Last Synced</label>
                </div>
                <div className="w-full lg:w-9/12 relative">
                    <Input name="app.last_sync"
                        id="app.last_sync"
                        type="text"
                        value={moment(app.last_sync).calendar()}
                        readOnly disabled />

                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <Button size="small" style="ghost" onClick={syncNow}>Sync Now</Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AzureSettings;