import React, { useState } from 'react';
import classNames from 'classnames';
import { AppSettings, CustomFields, Permissions } from './Settings/index';

const Settings = () => {
    const [tab, setTab] = useState(0);

    const toggle = _tab => {
        if (tab !== _tab) {
            setTab(_tab);
        }
    }

    const tabClass = id => classNames(
        'text-gray-600',
        'dark:text-gray-200',
        'py-4',
        'px-6',
        'hover:text-gray-800',
        'dark:hover:text-white',
        'focus:outline-none',
        (tab === id) ? 'border-b-2' : '',
        (tab === id) ? 'font-medium' : '',
        (tab === id) ? 'border-indigo-600' : '',
        (tab === id) ? 'dark:border-indigo:500' : ''
    )

    const paneClass = id => classNames(
        'p-5',
        (tab === id) ? 'block' : 'hidden'
    )

    return (
        <div className="w-full px-4 py-6">
            <div className="flex flex-col min-w-0 break-words w-full mx-auto shadow bg-white dark:bg-gray-800 rounded">
                <nav className="flex flex-col sm:flex-row border-b border-gray-200 dark:border-gray-600">
                    <button className={tabClass(0)} onClick={() => setTab(0)}>
                        App Settings
                    </button>
                    <button className={tabClass(1)} onClick={() => setTab(1)}>
                        App Permissions
                    </button>
                    <button className={tabClass(2)} onClick={() => setTab(2)}>
                        Custom Fields
                    </button>
                </nav>
                <div className={paneClass(0)}>
                    <AppSettings />
                </div>
                <div className={paneClass(1)}>
                    <Permissions />
                </div>
                <div className={paneClass(2)}>
                    <CustomFields />
                </div>
            </div>
        </div>
    )
}

export default Settings;