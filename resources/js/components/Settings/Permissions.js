import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Switch } from 'webapps-react';
import UserSuggest from './UserSuggest';

axios.defaults.withCredentials = true;

const Permissions = () => {
    const [groups, setGroups] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [permitted, setPermitted] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('/api/groups')
            .then(response => {
                return response;
            })
            .then(json => {
                setGroups(json.data.groups);
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error);
            });
        axios.get('/api/users')
            .then(response => {
                return response;
            })
            .then(json => {
                setUsers(json.data.users);
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error);
            });


        let formData1 = new FormData();
        formData1.append('permission', 'app.StaffDirectory.%');

        axios.post('/api/permissions/search', formData1)
            .then(response => {
                return response;
            })
            .then(json => {
                setPermissions(json.data.permissions);
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error);
            });

        let formData = new FormData();
        formData.append('isLike', true);
        formData.append('permission', 'app.StaffDirectory.%');

        axios.post('/api/permitted', formData)
            .then(response => {
                return response;
            })
            .then(json => {
                setPermitted(json.data.users);
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error);
            });
    }, []);

    const handleChange = e => {
        let group = e.target.dataset.group;
        let perm = e.target.dataset.perm;
        let user = e.target.dataset.user;

        if (group === undefined && user !== undefined) {
            let formData = new FormData();
            formData.append('user', user);
            formData.append('permission', perm);

            axios.post('/api/permissions/user', formData)
                .then(response => {
                    return response;
                })
                .then(json => {
                    let _permitted = [];
                    permitted.map(function (u,) { _permitted.push(u); });
                    _permitted.map(function (u, i) { if (u.id == user) _permitted[i] = json.data.user });
                    setPermitted(_permitted);
                })
                .catch(error => {
                    // TODO: Handle errors
                    console.log(error);
                });
        } else if (group !== undefined && user === undefined) {
            let formData = new FormData();
            formData.append('group', group);
            formData.append('permission', perm);

            axios.post('/api/permissions/group', formData)
                .then(response => {
                    return response;
                })
                .then(json => {
                    let _groups = [];
                    groups.map(function (g) { _groups.push(g);  });
                    _groups.map(function (g, i) { if (g.id == group) _groups[i] = json.data.group });
                    setGroups(_group);
                })
                .catch(error => {
                    // TODO: Handle errors
                    console.log(error);
                });
        }
    }

    const checkState = (perm, x) => {
        return (x.permissions.some(item => perm.id === item.id));
    }

    const select = user => {
        let _permitted = [];
        permitted.map(function (u, i) {
            _permitted.push(u);
            if (u.id === user.id)
                return;
        });
        
        user.permissions = [];
        delete user.roles;
        _permitted.push(user);
        setPermitted(_permitted);
    }


    // render
    if (permissions.length === 0 && groups.length === 0) {
        return <div>Loading...</div>
    }

    return (
        <table className="table-fixed w-full">
            <thead>
                <tr>
                    <th className="w-32">&nbsp;</th>
                    {
                        permissions.map(function (perm, i) {
                            return (
                                <th key={i} className="min-w-20 px-4 text-left">{perm.title}</th>
                            )
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {
                    groups.map(function (group, ri) {
                        return (
                            <tr key={ri} className={(ri % 2) ? 'bg-gray-100' : ''}>
                                <td className="py-2 pl-4">{group.name}</td>
                                {
                                    permissions.map(function (perm, pi) {
                                        return (
                                            <td key={pi} className="px-6">
                                                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                    <Switch checked={checkState(perm, group)}
                                                        data-group={group.id}
                                                        data-perm={perm.id}
                                                        onChange={handleChange} />
                                                </div>
                                            </td>
                                        )
                                    })
                                }
                            </tr>
                        )
                    })
                }
                <tr className="border-t border-b border-gray-200 bg-gray-100 dark:text-black">
                    <td className="py-2 pl-6" colSpan={permissions.length + 1}>Add extra permissions for specified users...</td>
                </tr>
                {
                    permitted.map(function (user, ri) {
                        return (
                            <tr key={ri} className={(ri % 2) ? 'bg-gray-100' : ''}>
                                <td className="py-2 pl-4">{user.name}</td>
                                {
                                    permissions.map(function (perm, pi) {
                                        return (
                                            <td key={pi} className="px-6">
                                                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                    <Switch checked={checkState(perm, user)}
                                                        data-user={user.id}
                                                        data-perm={perm.id}
                                                        onChange={handleChange} />
                                                </div>
                                            </td>
                                        )
                                    })
                                }
                            </tr>
                        )
                    })
                }
                <tr>
                    <td colSpan={permissions.length + 1}><UserSuggest users={users} select={select} /></td>
                </tr>
            </tbody>
        </table>
    );
}

export default Permissions;