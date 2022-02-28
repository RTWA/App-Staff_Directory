import React, { useContext, useEffect, useState } from 'react';
import { APIClient, AuthContext, Loader } from 'webapps-react';

import CustomView from './CustomView';

const ViewLayout = props => {
    const [view, setView] = useState({ state: 'loading' });
    const [allowed, setAllowed] = useState(false);

    const { authenticated, checkGroup } = useContext(AuthContext);

    const APIController = new AbortController();

    useEffect(() => {
        return () => {
            APIController.abort();
        }
    }, []);

    const Authenticate = () => {
        if (!authenticated) {
            localStorage.setItem('WA_Login', window.location.href);
            window.location.replace("/login");
        }
    }

    const checkAccess = async perms => {
        return new Promise(async (resolve, reject) => {
            await checkGroup('Administrators')
                .then(access => {
                    console.log(`Administrators: ${access}`)
                    if (access) {
                        return resolve(true);
                    } else {
                        Object.keys(perms).map(async function (perm) {
                            if (perm !== 'all' && perm !== 'guest' && allowed === false) {
                                await checkGroup(perm)
                                    .then(access => {
                                        console.log(`${perm}: ${access}`)
                                        if (access) {
                                            return resolve(true);
                                        }
                                    })
                                    .catch(error => {
                                        return reject(error);
                                    });
                            }
                        });
                    }
                })
                .catch(error => {
                    return reject(error);
                });
            return resolve(false);
        });
    }

    useEffect(async () => {
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
                    Authenticate();
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
    }, []);

    if (view.state === "loading") {
        return <Loader />
    }

    if (!allowed) {
        return <p>Sorry, you do not have access to view this information.</p>
    }

    return <div className="StaffDirectory-view embed"><CustomView view={view} /></div>
}

export default ViewLayout;