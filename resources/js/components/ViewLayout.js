import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext, Loader } from 'webapps-react';

import CustomView from './CustomView';

const ViewLayout = props => {
    const [view, setView] = useState({ state: 'loading' });

    const { authenticated } = useContext(AuthContext);

    if (!authenticated) {
        localStorage.setItem('WA_Login', window.location.href);
        window.location.replace("/login");
    }

    useEffect(async () => {
        let publicId = props.match.params.publicId;
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
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error);
            })
    }, []);

    if (view.state === "loading") {
        return <Loader />
    }

    return <div className="StaffDirectory-view embed"><CustomView view={view} /></div>
}

export default ViewLayout;