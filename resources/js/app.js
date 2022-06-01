import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { WebAppsUX } from 'webapps-react';

import { Settings, Staff, Views } from './components';

ReactDOM.render(
    <WebAppsUX>
        <BrowserRouter basename="/apps/StaffDirectory">
            <Switch>
                <Route exact path="/views" name="Manage Views" component={Views} />
                <Route exact path="/staff" name="Manage Staff" component={Staff} />
                <Route path="/settings" name="App Settings" component={Settings} />
            </Switch>
        </BrowserRouter>
    </WebAppsUX>,
    document.getElementById('WebApps_AppContainer')
);
