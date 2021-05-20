import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomView from './CustomView';

const ViewLayout = props => {
    const [view, setView] = useState({ state: 'loading' });

    useEffect(() => {
        let publicId = props.match.params.publicId;
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
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error);
            })
    }, []);

    if (view.state === "loading") {
        return <div>Loading...</div>
    }

    return <div className="StaffDirectory-view embed"><CustomView view={view} /></div>
}

export default ViewLayout;