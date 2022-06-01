import React, { useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AppPage, Drawer, DrawerHeader, DrawerItem, DrawerItems, Loader, WebAppsUXContext } from 'webapps-react';

import { AppSettings, AzureSettings, Permissions, RecycleBin, SelectFields } from './Settings/index';

const Settings = () => {
    const { theme } = useContext(WebAppsUXContext);

    if (theme === undefined || theme === null) {
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