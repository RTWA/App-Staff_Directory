import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Auth, WebApps } from 'webapps-react';

import { ViewLayout } from './components';

ReactDOM.render(
    <Auth>
        <WebApps>
            <BrowserRouter basename="/apps/StaffDirectory/view/">
                <Switch>
                    <Route exact path="/:publicId" name="App - Staff Directory View" component={ViewLayout} />
                </Switch>
            </BrowserRouter>
        </WebApps>
    </Auth>,
    document.getElementById('StaffDirectory')
);
