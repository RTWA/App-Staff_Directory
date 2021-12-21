import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { WebApps } from 'webapps-react';

import { Settings, Staff, Views } from './components';

ReactDOM.render(
    <WebApps>
        <BrowserRouter basename="/apps/StaffDirectory">
            <Switch>
                <Route exact path="/views" name="Manage Views" component={Views} />
                <Route exact path="/staff" name="Manage Staff" component={Staff} />
                <Route exact path="/settings" name="App Settings" component={Settings} />
            </Switch>
        </BrowserRouter>
    </WebApps>,
    document.getElementById('WebApps_AppContainer')
);
