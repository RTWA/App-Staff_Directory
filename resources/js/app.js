import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { WebApps } from 'webapps-react';

import { Settings, Staff, Views } from './components';

ReactDOM.render(
    <WebApps>
        <ToastProvider autoDismiss="true" autoDismissTimeout="3000">
            <BrowserRouter basename="/apps/StaffDirectory">
                <Switch>
                    <Route exact path="/views" name="Manage Views" component={Views} />
                    <Route exact path="/staff" name="Manage Staff" component={Staff} />
                    <Route exact path="/settings" name="App Settings" component={Settings} />
                </Switch>
            </BrowserRouter>
        </ToastProvider>
    </WebApps>,
    document.getElementById('WebApps_AppContainer')
);
