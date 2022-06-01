import React, { useState, useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import classNames from 'classnames';
import { AppPage, Drawer, DrawerHeader, DrawerItem, DrawerItems, Loader, PageWrapper, WebAppsContext } from 'webapps-react';

import { AppSettings, AzureSettings, Permissions, RecycleBin, SelectFields } from './Settings/index';

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
        <AppPage>
            <Drawer>
                <DrawerHeader>
                    Staff Directory
                </DrawerHeader>
                <DrawerItems>
                    <DrawerItem
                        to="/settings"
                    >
                        App Settings
                    </DrawerItem>
                    <DrawerItem
                        to="/settings/azure"
                    >
                        Microsoft Azure Integration
                    </DrawerItem>
                    <DrawerItem
                        to="/settings/permissions"
                    >
                        App Permissions
                    </DrawerItem>
                    <DrawerItem
                        to="/settings/fields"
                    >
                        Select Fields
                    </DrawerItem>
                    <DrawerItem
                        to="/settings/bin"
                        color="red"
                    >
                        Recycle Bin
                    </DrawerItem>
                </DrawerItems>
            </Drawer>
            <Switch>
                <Route exact path="/settings">
                    <AppSettings />
                </Route>
                <Route exact path="/settings/azure">
                    <AzureSettings />
                </Route>
                <Route exact path="/settings/permissions">
                    <Permissions />
                </Route>
                <Route exact path="/settings/fields">
                    <SelectFields />
                </Route>
                <Route exact path="/settings/bin">
                    <RecycleBin />
                </Route>
            </Switch>
        </AppPage>
    )
}

export default Settings;