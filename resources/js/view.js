import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Auth, WebApps, WebAppsUX } from 'webapps-react';

import { ViewLayout } from './components';

ReactDOM.render(
    <Auth>
        <WebAppsUX>
            <WebApps>
                <BrowserRouter basename="/apps/StaffDirectory/view/">
                    <Switch>
                        <Route exact path="/:publicId" name="App - Staff Directory View" component={ViewLayout} />
                    </Switch>
                </BrowserRouter>
            </WebApps>
        </WebAppsUX>
    </Auth>,
    document.getElementById('StaffDirectory')
);
