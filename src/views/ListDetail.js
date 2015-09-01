import __fetch from "isomorphic-fetch";
import React from "react";
import Router from "react-router";
import InlineCss from "react-inline-css";
import Transmit from "react-transmit";
var { Route, DefaultRoute, RouteHandler, Link } = Router;

class ListDetail extends React.Component {
  /**
   * Runs on server and client.
   */
  componentWillMount () {
    if (__SERVER__) {
      /**
       * This is only run on the server, and will be removed from the client build.
       */
      console.log("Hello server");
    }

    if (__CLIENT__) {
      /**
       * This is only run on the client.
       */
      console.log("Hello client");

    }
  }

  /**
   * Runs on server and client.
   */
  render () {

    /**
     * This is a Transmit prop. See below for its query.
     */

    return (
      <InlineCss stylesheet={ListDetail.css()} namespace="ListDetail">
        <h1>List Detail</h1>
      </InlineCss>
    );
  }
  /**
   * <InlineCss> component allows you to write a CSS stylesheet for your component. Target
   * your component with `&` and its children with `& selectors`. Be specific.
   */
  static css () {
    return (`
		  & {
		    width: 80%;
        font-family: helvetica, arial, sans-serif;
        display: block;
        margin: 0 auto;
        background-color: #efefef;
        padding: 1rem;
		  }
		`);
  }

}

/**
 * Use Transmit to query and return GitHub stargazers as a Promise.
 */
export default Transmit.createContainer(ListDetail, {
  queryParams: {
    prevStargazers: [],
    nextPage:       1,
    pagesToFetch:   10
  },
  queries: {
    /**
     * Return a Promise of the previous stargazers + the newly fetched stargazers.
     */
      allStargazers (queryParams) {
      /**
       * On the server, connect to GitHub directly.
       */
      //let githubApi = "https://api.github.com";
      let githubApi = `http://localhost:8000/api/github`;

      /**
       * On the client, connect to GitHub via the Hapi proxy route.
       */
      if (__CLIENT__) {
        const {hostname, port} = window.location;
        githubApi = `http://${hostname}:${port}/api/github`;
      }

      /**
       * Load a few stargazers using the Fetch API.
       */
      return fetch(
        githubApi + "/repos/RickWong/react-isomorphic-starterkit/stargazers" +
        `?per_page=100&page=${queryParams.nextPage}`
      ).then((response) => response.json()).then((body) => {
          /**
           * Stop fetching if the response body is empty.
           */
          if (!body || !body.length) {
            queryParams.pagesToFetch = 0;

            return queryParams.prevStargazers;
          }

          /**
           * Pick id and username from fetched stargazers.
           */
          const fechedStargazers = body.map(({id, login}) => ({id, login}));

          return queryParams.prevStargazers.concat(fechedStargazers);
        });
    }
  }
});
