import React from "react";
import {Route, DefaultRoute} from "react-router";
import Main from "views/Main";
import List from "views/List";
import Others from "views/Others";
import ListDetail from "views/ListDetail";

/**
 * The React Routes for both the server and the client.
 *
 * @class Routes
 */

export default (
  <Route path="/">
    <DefaultRoute name="home" handler={Main} />
    <Route name="list" path="list" handler={List}>
      <Route name="list-detail" path="detail" handler={ListDetail} />
    </Route>
    <Route name="others" path="others" handler={Others} />
  </Route>
);