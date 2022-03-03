import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { APIClient, Button, DataSuggest, Input, Switch } from 'webapps-react';
import GroupSearch from '../GroupSearch/GroupSearch';

let _mounted = false;

const AzureSettings = () => {
    const [states, setStates] = useState({});
    const [graph, setGraph] = useState({ tenantId: '', client_id: '', client_secret: '' });
    const [app, setApp] = useState({});
    const [changed, setChanged] = useState({});
    const [syncGroups, setSyncGroups] = useState([]);
    const [depList, setDepList] = useState({});
    const [accessToken, setAccessToken] = useState(null);

    const APIController = new AbortController();

    useEffect(async () => {
        _mounted = true;
        await getAzureDetails();
        await getAppSettings();

        return () => {
            APIController.abort();
            _mounted = false;
        }
    }, []);

    useEffect(async () => {
        if (graph.tenantId) {
            await RequestAccessToken();
        }
    }, [graph]);

    useEffect(async () => {
        if (_mounted) {
            if (changed.create_departments) {
                // Update create_departments
                await APIClient('/api/setting/app.StaffDirectory.azure.create_departments',
                    { value: app.create_departments },
                    { signal: APIController.signal, method: 'PUT' })
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
                        if (!error.status?.isAbort) {
                            // TODO: handle errors
                            console.log(error);

                            states['create_departments'] = 'error';
                            setStates({ ...states });
                            setTimeout(function () {
                                states['create_departments'] = '';
                                setStates({ ...states });
                            }, 2500);
                        }
                    });
            }
            if (changed.technical_contact) {
                // Update technical_contact
                await APIClient('/api/setting/app.StaffDirectory.azure.technical_contact',
                    { value: app.technical_contact },
                    { signal: APIController.signal, method: 'PUT' })
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
                        if (!error.status?.isAbort) {
                            // TODO: handle errors
                            console.log(error);

                            states['technical_contact'] = 'error';
                            setStates({ ...states });
                            setTimeout(function () {
                                states['technical_contact'] = '';
                                setStates({ ...states });
                            }, 2500);
                        }
                    });
            }
        }
    }, [app]);

    const getAzureDetails = async () => {
        await APIClient('/api/setting',
            {
                key: JSON.stringify([
                    "azure.graph.tenant",
                    "azure.graph.client_id",
                    "azure.graph.client_secret",
                ])
            },
            { signal: APIController.signal })
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
        await APIClient('/api/setting',
            {
                key: JSON.stringify([
                    "app.StaffDirectory.azure.sync_groups",
                    "app.StaffDirectory.azure.create_departments",
                    "app.StaffDirectory.azure.technical_contact",
                    "app.StaffDirectory.azure.last_sync",
                ])
            },
            { signal: APIController.signal })
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

    const RequestAccessToken = async () => {
        await APIClient('/api/graph/token', undefined, { signal: APIController.signal })
            .then(json => {
                setAccessToken(json.data.token.access_token);
            });
    }

    const addSyncGroup = async selected => {
        if (syncGroups.indexOf(selected) < 0) {
            setSyncGroups([
                ...syncGroups,
                selected
            ]);
            setDepList({});

            if (_mounted) {
                await APIClient('/api/setting/app.StaffDirectory.azure.sync_groups',
                    { value: JSON.stringify(syncGroups) },
                    { signal: APIController.signal, method: 'PUT' });
            }
        }
    }

    const removeSyncGroup = async index => {
        syncGroups.splice(index, 1);
        setSyncGroups([...syncGroups]);

        if (_mounted) {
            await APIClient('/api/setting/app.StaffDirectory.azure.sync_groups',
                { value: JSON.stringify(syncGroups) },
                { signal: APIController.signal, method: 'PUT' });
        }
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

    const syncNow = async e => {
        e.target.innerText = 'Syncing';
        await APIClient('/api/apps/StaffDirectory/azure/sync', undefined, { signal: APIController.signal });
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
            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="depList">Add Azure Group to Sync</label>
                <GroupSearch id="depList" name="depList" groupData={depList} setData={setDepList} saveChange={addSyncGroup} accessToken={accessToken} />
            </div>
            {/* <DataSuggest id="depList" name="depList" select={addSyncGroup} data={azGroups} labelKey="displayName" label="Add Azure Group to Sync" /> */}
            <div className="mb-6">
                <p className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Currently Syncing Groups</p>
                <div className="w-full bg-gray-50 border-2 border-gray-300 text-gray-900 outline-none text-sm rounded-lg block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
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
            <Switch
                id="create_departments"
                name="create_departments"
                label="Create Departments from User properties"
                helpText="The Department string will be split on a '-' character (with a space either side) to create sub-departments."
                checked={(app.create_departments === 'true')}
                onChange={onChange}
                className="mb-6"
                state={states['create_departments']} />
            <Input
                id="technical_contact"
                name="technical_contact"
                label="Technical Contact Email Address"
                type="text"
                value={app.technical_contact || ''}
                onChange={onType}
                onBlur={onChange}
                state={states['technical_contact']} />
            <Input
                id="app.last_sync"
                name="app.last_sync"
                label="Last Synced"
                type="text"
                value={moment(app.last_sync).calendar()}
                action={
                    <Button style="ghost" color="gray" size="small" square
                        className="uppercase mr-1 w-full sm:w-auto sm:rounded-md"
                        onClick={syncNow}>
                        Sync Now
                    </Button>
                }
                readOnly disabled />
        </>
    );
}

export default AzureSettings;