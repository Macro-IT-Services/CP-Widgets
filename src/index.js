import React from 'react';
import { render } from 'react-dom';
import { httpServer, wsServer, mediaServer } from './constants';

import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  from,
  split,
  fromPromise,
} from '@apollo/client/core';

import { ACCESS_TOKEN_MUTATION } from './queries';

//import WebSocketLink from './WebSocketLink';
import { RetryLink } from '@apollo/client/link/retry';
//import { getMainDefinition } from '@apollo/client/utilities';
//import { onError } from '@apollo/client/link/error';
//import { cache } from './apollo-cache';
import Login from './components/Login';

//import { split } from '@apollo/client';
//import { from, HttpLink } from '@apollo/client';
//import { ApolloClient } from '@apollo/client';
//import { ApolloLink } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { ApolloCache, InMemoryCache } from '@apollo/client/cache';
import { onError } from '@apollo/client/link/error';

import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

//import { ApolloProvider } from "react-apollo";
import { ApolloProvider } from '@apollo/client';
//import { ApolloProvider } from '@apollo/react-hooks';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import {
  layoutReducer,
  dashboardReducer,
  settingsReducer,
  userReducer,
  contextReducer,
  notificationReducer,
} from './reducers';
//import { addErrorA } from './actions';
import {
  enqueueSnackbar as enqueueSnackbarAction,
  closeSnackbar as closeSnackbarAction,
} from './actions';
import AppWrapper from './AppWrapper.js';

import { version } from './version.js';

console.log('FrontEnd version:', version);

console.log('__pixelConfig', window.__pixelConfig);
//console.log('process.env.NODE_ENV', process.env.NODE_ENV);

let httpEndpoint, wsEndpoint;

window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
  supportsFiber: true,
  inject: function () {},
  onCommitFiberRoot: function () {},
  onCommitFiberUnmount: function () {},
}; // hide react devtools warning

if (process.env.NODE_ENV === 'development') {
  httpEndpoint = httpServer; //'http://platform.pixelcore01.v3.thingularity.online/graphql';
  wsEndpoint = wsServer; //'ws://platform.pixelcore01.v3.thingularity.online/graphql';
} else {
  /*
VUE_APP_API: "http://MacBook-Air-Kirill.local:5000/graphql"
VUE_APP_MEDIA_SERVER: "http://MacBook-Air-Kirill.local:5001"
*/
  httpEndpoint = window.__pixelConfig.APP_API;
  wsEndpoint = window.__pixelConfig.WS_API;
} //else

console.log('httpEndpoint', httpEndpoint);
console.log('wsEndpoint', wsEndpoint);

const store = createStore(
  combineReducers({
    dashboard: dashboardReducer,
    layout: layoutReducer,
    settings: settingsReducer,
    profile: userReducer,
    context: contextReducer,
    notification: notificationReducer,
  }),
  {}, // initial state
  compose(
    applyMiddleware(thunk),
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
);

const getAuthToken = () => {
  //console.log('index.js getAuthToken',localStorage.getItem('authToken'))
  return localStorage.getItem('authToken');
};

export let client;

export const getNewToken = async operation => {
  console.log('index.js getNewToken', operation);
  localStorage.removeItem('authToken');

  operation.setContext(() => ({
    headers: {},
  }));

  const result_access = await client.mutate({
    mutation: ACCESS_TOKEN_MUTATION,
    variables: {
      input: {
        userRefreshToken: localStorage.getItem('refreshToken'),
        accessTokenExpiration: 24 * 60,
        profileTags: ['application', 'monitor', 'user profile'],
      },
    },
    fetchPolicy: 'no-cache',
  });

  console.log('index.js getNewToken result_access.data', result_access.data);

  const authToken = result_access.data.authAccessToken.jwtToken;

  if (authToken) {
    console.log('index.js getNewToken: authToken', authToken);
    localStorage.setItem('authToken', authToken);
    return authToken;
  } else {
    console.log('index.js getNewToken: error getting token');
    return Promise.reject(new Error('error getting token'));
  }
}; //getNewToken

const authMiddleware = new ApolloLink((operation, forward) => {
  const newHeaders = {};

  if (getAuthToken()) {
    newHeaders.authorization = `Bearer ${getAuthToken()}`;
  }

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...newHeaders,
    },
  }));

  return forward(operation);
});

const httpLink = new HttpLink({
  uri: httpEndpoint, //window.__pixelConfig.APP_API
});
/*
const getWebsocketUri = () => {
  const url = new URL(window.__pixelConfig.APP_API);
  return `ws://${url.host + url.pathname}`;
};
*/
/*
export const wsLink = new WebSocketLink({

  uri: wsEndpoint, // https://github.com/graphql/graphql-playground/issues/600
  // keepAlive: 1000,
  lazy: true,
  on: {
    // ping: (received) => {
    //   console.log('ping', received)
    // },
    // pong: (received) => {
    //   console.log('pong', received)
    // },
  },

  
  connectionParams: () => ({
    authorization: `Bearer ${getAuthToken()}`
  })
});
*/

const wsLink = new WebSocketLink({
  uri: wsEndpoint,
  options: {
    reconnect: true,
    //lazy: true,
    // keepAlive: 1000,

    connectionParams: {
      authorization: getAuthToken() ? `Bearer ${getAuthToken()}` : '',
    },

    connectionCallback: error => {
      if (error) {
        console.log('wserror', error);
      }

      //      console.log('ws connectionCallback');
    },
  },
});

const errorHandle = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    console.log('index.js onError', graphQLErrors);
    //    return false
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (operation.operationName === 'getTranslations') return;
        if (
          err.message.includes('jwt expired') ||
          err.message.includes('invalid signature') ||
          err.message.includes('permission denied')
        ) {
          localStorage.removeItem('authToken');
          return fromPromise(
            getNewToken(operation)
              .then(response => {
                operation.setContext({
                  headers: {
                    authorization: `Bearer ${response}`,
                  },
                });
                return forward(operation);
              })
              .catch(err => {
                console.log('index.js/onError catch', err);
                localStorage.setItem(
                  'lastUrlPathname',
                  window.location.pathname
                );
                window.location = '/login';
              })
          )
            .filter(value => Boolean(value))
            .flatMap(accessToken => {
              operation.setContext({
                headers: {
                  authorization: `Bearer ${accessToken}`,
                },
              });
              return forward(operation);
            });
        } else {
          localStorage.setItem('lastUrlPathname', window.location.pathname);
        }
      }
    }
  }
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const retryLink = new RetryLink();

const defaultOptions = {
  watchQuery: {
    errorPolicy: 'all',
  },
  query: {
    errorPolicy: 'all',
  },
  ssrMode: false,
  ssrForceFetchDelay: 0,
  connectToDevTools: process.env.NODE_ENV === 'development',
};

client = new ApolloClient({
  link: from([errorHandle, authMiddleware, retryLink, splitLink]),
  //  cache: cache,
  cache: new InMemoryCache(),
  defaultOptions,
});

const target = document.querySelector('#root');

const defaultLang = 'en';

// TODO: 1) support manual replace of en/ru in url 2) add sending lang in headers
const lang = store.getState().settings.lang || defaultLang;

render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/:lang(en|ru)*" render={() => <AppWrapper />} />
          <Redirect to={{ pathname: `/${lang}` }} from="/" />
        </Switch>
      </BrowserRouter>
    </Provider>
  </ApolloProvider>,
  target
);
