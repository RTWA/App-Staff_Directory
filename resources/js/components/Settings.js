import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import { Loader, WebAppsContext } from 'webapps-react';

import { AppSettings, AzureSettings, CustomFields, Permissions, RecycleBin } from './Settings/index';

const Settings = () => {
    const [tab, setTab] = useState(0);
    const { UI } = useContext(WebAppsContext);

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
        (tab === id) ? `border-${UI.theme}-600` : '',
        (tab === id) ? `dark:border-${UI.theme}.500` : ''
    )

    const paneClass = id => classNames(
        'p-5',
        (tab === id) ? 'block' : 'hidden'
    )

    if (UI.theme === undefined || UI.theme === null) {
        return <Loader className="min-h-screen flex items-center" />
    }

    return (
        <div className="w-full py-4">
            <div className="flex flex-col min-w-0 break-words w-full mx-auto shadow bg-white dark:bg-gray-800 rounded">
                <nav className="flex flex-col md:flex-row border-b border-gray-200 dark:border-gray-600">
                    <button className={tabClass(0)} onClick={() => toggle(0)}>
                        App Settings
                    </button>
                    <button className={tabClass(1)} onClick={() => toggle(1)}>
                        Microsoft Azure Integration
                    </button>
                    <button className={tabClass(2)} onClick={() => toggle(2)}>
                        App Permissions
                    </button>
                    <button className={tabClass(3)} onClick={() => toggle(3)}>
                        Custom Fields
                    </button>
                    <button className={classNames(tabClass(4), 'md:ml-auto text-red-600 dark:text-red-500')} onClick={() => toggle(4)}>
                        Recycle Bin
                    </button>
                </nav>
                <div className={paneClass(0)}>
                    <AppSettings />
                </div>
                <div className={paneClass(1)}>
                    <AzureSettings />
                </div>
                <div className={paneClass(2)}>
                    <Permissions />
                </div>
                <div className={paneClass(3)}>
                    <CustomFields />
                </div>
                <div className={classNames(paneClass(4), 'relative', 'px-4 lg:px-10 py-10 pt-5')}>
                    <RecycleBin />
                </div>
            </div>
        </div>
    )
}

export default Settings;