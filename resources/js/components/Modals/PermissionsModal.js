import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { APIClient, Switch, withWebApps } from 'webapps-react';

import { ModalsContext } from '../Views';

const PermissionsModal = ({ UI, ...props }) => {
    const {
        permissions,
        closeModal
    } = props;

    const {
        modals
    } = useContext(ModalsContext);

    const [groups, setGroups] = useState([]);

    const APIController = new AbortController();

    useEffect(async () => {
        await APIClient('/api/groups', undefined, { signal: APIController.signal })
            .then(json => {
                setGroups(json.data.groups);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: Handle errors
                    console.log(error);
                }
            });

        return () => {
            APIController.abort();
        }
    }, []);

    const onChange = e => {
        props.onChange(e.target.dataset.permission, e.target.checked);
    }

    const modalClass = classNames(
        'absolute',
        'inset-0',
        'overflow-hidden',
        (modals.permissions) ? 'z-50' : '-z-10'
    )

    const bdClass = classNames(
        'absolute',
        'inset-0',
        'bg-gray-500',
        'bg-opacity-75',
        'transition-opacity',
        'duration-500',
        'ease-in-out',
        (modals.permissions) ? 'opacity-100' : 'opacity-0'
    )

    const panelClass = classNames(
        'relative',
        'w-screen',
        'max-w-2xl',
        'transform',
        'transition',
        'ease-in-out',
        'duration-500',
        'delay-500',
        (modals.permissions) ? 'opacity-100' : 'opacity-0'
    )

    return (
        <div className={modalClass}>
            <div className={bdClass} aria-hidden="true" onClick={closeModal}></div>
            <section className="h-screen w-full fixed left-0 top-0 flex justify-center items-center" aria-labelledby="slide-over-heading">
                <div className={panelClass}>
                    <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl">
                        <div className={`px-4 py-4 bg-${UI.theme}-600 dark:bg-${UI.theme}-500 text-white relative`}>
                            <div className="absolute top-0 right-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                                <button className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                    onClick={closeModal}>
                                    <span className="sr-only">Close panel</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <h2 id="slide-over-heading" className="text-lg font-medium">Who can view this?</h2>
                        </div>
                        <div>
                            <table className="table-fixed w-full">
                                <tbody>
                                    <tr>
                                        <td className="py-2 pl-4 w-60 font-semibold">Everyone <em>(Includes Guests)</em></td>
                                        <td className="px-6">
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <Switch data-permission="guest"
                                                    checked={permissions.guest || false}
                                                    onChange={onChange}
                                                    name="viewPerm_Guest" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-200 dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-600">
                                        <td className="py-2 pl-4 font-semibold">All <strong>Authenticated</strong> Users</td>
                                        <td className="px-6">
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <Switch data-permission="all"
                                                    checked={permissions.all || false}
                                                    onChange={onChange}
                                                    name="viewPerm_All" />
                                            </div>
                                        </td>
                                    </tr>
                                    {
                                        groups.map(function (group, i) {
                                            if (group.name !== "Administrators") {
                                                return (
                                                    <tr key={i} className={(i % 2) ? '' : 'bg-gray-200 dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-600'}>
                                                        <td className="py-2 pl-4">{group.name}</td>

                                                        <td className="px-6">
                                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                                <Switch data-permission={group.name}
                                                                    checked={permissions[group.name] || false}
                                                                    onChange={onChange}
                                                                    name={`viewPerm_${group.name}`} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default withWebApps(PermissionsModal);
