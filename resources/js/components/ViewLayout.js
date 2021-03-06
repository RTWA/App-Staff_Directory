import React, { useContext, useEffect, useState } from 'react';
import { APIClient, AuthContext, Loader } from 'webapps-react';

import CustomView from './CustomView';

const ViewLayout = props => {
    const [view, setView] = useState({ state: 'loading' });
    const [allowed, setAllowed] = useState(false);

    const { authenticated, checkGroup, setUser } = useContext(AuthContext);

    const APIController = new AbortController();

    useEffect(() => {
        Authenticate();

        return () => {
            APIController.abort();
        }
    }, []);

    useEffect(() => {
        if (authenticated === true) {
            loadView();
        }
    }, [authenticated]);

    const Authenticate = async () => {
        if (!authenticated) {
            await APIClient('/api/user', undefined, { signal: APIController.signal })
                .then(json => {
                    delete json.data.preferences;
                    setUser(json.data, true);
                })
                .catch(error => {
                    /* istanbul ignore else */
                    if (!error.status?.isAbort) {
                        if (error.response && error.status.code === 401) {
                            // If 401 returns, the user is not logged in
                            window.location.replace(`/login/windowed?url=${window.location.href}`);
                        }
                    }
                });
        }
    }

    const checkAccess = async perms => {
        return new Promise(async (resolve, reject) => {
            await checkGroup('Administrators')
                .then(access => {
                    if (access) {
                        return resolve(true);
                    } else {
                        let count = 0;
                        Object.keys(perms).map(async function (perm) {
                            if (perm !== 'all' && perm !== 'guest' && allowed === false) {
                                await checkGroup(perm)
                                    .then(access => {
                                        if (access) {
                                            console.log(true)
                                            return resolve(true);
                                        }
                                    })
                                    .catch(error => {
                                        return reject(error);
                                    });
                            }
                            count++;
                        });
                        if (count === Object.keys(perms).length) {
                            return resolve(false);
                        }
                    }
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    const loadView = async () => {
        let publicId = props.match.params.publicId;
        await APIClient(`/api/apps/StaffDirectory/view/${publicId}`, undefined, { signal: APIController.signal })
            .then(async json => {
                let _view = json.data.view;
                _view.settings = JSON.parse(_view.settings);

                if (_view.settings.fields === undefined) {
                    _view.settings.fields = {};
                }
                if (_view.settings.perms === undefined) {
                    _view.settings.perms = {};
                }

                if (!_view.settings.perms.guest) {
                    // await Authenticate();
                    if (!_view.settings.perms.all) {
                        setAllowed(await checkAccess(_view.settings.perms));
                    } else {
                        setAllowed(true);
                    }
                } else {
                    setAllowed(true);
                    if (!authenticated) {
                        _view.settings.leading = "false";
                        _view.settings.selectors = "false";
                        _view.settings.sorttext = "false";
                    }
                }

                setView(_view);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: Handle errors
                    console.log(error);
                }
            })
    }

    if (view.state === "loading") {
        return <Loader />
    }

    if (!allowed) {
        return <p>Sorry, you do not have access to view this information.</p>
    }

    return <div id="StaffDirectory-view" className="overflow-auto"><CustomView view={view} /></div>
}

export default ViewLayout;