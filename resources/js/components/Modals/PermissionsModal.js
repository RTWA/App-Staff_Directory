import React, { useContext, useEffect, useState } from 'react';
import { APIClient, ComponentError, ComponentErrorTrigger, FlyoutContent, FlyoutHeader, Switch } from 'webapps-react';

import { FlyoutContext } from '../Views';

const PermissionsModal = props => {
    const {
        permissions,
        close
    } = props;

    const {
        current
    } = useContext(FlyoutContext);

    const [error, setError] = useState(null);
    const [groups, setGroups] = useState([]);

    const APIController = new AbortController();

    useEffect(async () => {
        await loadGroups();

        return () => {
            APIController.abort();
        }
    }, []);

    const loadGroups = async () => {
        await APIClient('/api/groups', undefined, { signal: APIController.signal })
            .then(json => {
                setGroups(json.data.groups);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    setError(error.data?.message);
                }
            });
    }

    const onChange = e => {
        props.onChange(e.target.dataset.permission, e.target.checked);
    }

    if (current !== 'permissions') {
        return null;
    }

    return (
        <>
            <FlyoutHeader closeAction={close}>Who can view this?</FlyoutHeader>
            <FlyoutContent>
                <Switch
                    data-permission="guest"
                    checked={permissions.guest || false}
                    onChange={onChange}
                    name="viewPerm_Guest"
                    label={<>Everyone <em>(Includes Guests)</em></>}
                    className="my-6"
                />
                <Switch
                    data-permission="all"
                    checked={permissions.all || false}
                    onChange={onChange}
                    name="viewPerm_Guest"
                    label={<>All <strong>Authenticated</strong> Users</>}
                    className="my-6"
                />
                <ComponentError retry={() => { setError(null); loadGroups(); }}>
                    {
                        (error)
                            ? <ComponentErrorTrigger error={error} />
                            : groups.map(function (group, i) {
                                if (group.name !== "Administrators") {
                                    return (
                                        <Switch
                                            key={i}
                                            data-permission={group.name}
                                            checked={permissions[group.name] || false}
                                            onChange={onChange}
                                            name={`viewPerm_${group.name}`}
                                            label={group.name}
                                            className="my-6"
                                        />
                                    );
                                }
                            })
                    }
                </ComponentError>
            </FlyoutContent>
        </>
    )
}

export default PermissionsModal;
