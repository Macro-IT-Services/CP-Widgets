import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter, Switch, Link, Redirect } from 'react-router-dom';
import clsx from 'clsx';
import _ from 'lodash';

//import LinearProgress from '@material-ui/core/LinearProgress';

import useMediaQuery from '@material-ui/core/useMediaQuery';

import { useSelector, useDispatch } from 'react-redux';
import {
  enqueueSnackbar as enqueueSnackbarAction,
  closeSnackbar as closeSnackbarAction,
} from '../actions';
import { setSettings } from '../actions';
import { setContext } from '../actions';

import {
  useLocation,
  useParams,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';
import {
  useApolloClient,
  useMutation,
  useQuery,
  useLazyQuery,
} from '@apollo/client';
import { makeStyles, useTheme } from '@material-ui/core/styles';
//import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Hidden from '@material-ui/core/Hidden';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Fab from '@material-ui/core/Fab';
import SvgIcon from '@material-ui/core/SvgIcon';

import Button from '@material-ui/core/Button';

import Popper from '@material-ui/core/Popper';

import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsOverscanIcon from '@material-ui/icons/SettingsOverscan';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ViewListIcon from '@material-ui/icons/ViewList';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import EditIcon from '@material-ui/icons/Edit';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import AppsIcon from '@material-ui/icons/Apps';
//import { useSnackbar } from 'notistack';

import { MenuItem, Typography } from '@material-ui/core';

import { GET_DATA_GLOBAL_SUBSCRIPTION } from '../queries';

import { msg } from '../messages';

export default function Subscription(props) {
  const dispatch = useDispatch();
  const client = useApolloClient();
  const [refreshFlag, setRefreshFlag] = useState(0); // change to reload groups and widgets

  let subscription;
  // global subscription, to update state of app on removing/adding widgets/groups/dashboards in other browsers' windows
  useEffect(() => {
    console.log('SUBSCRIBED ...');
    if (!subscription) {
      console.log('SUBSCRIBED (global)');
      const observer = client.subscribe({
        query: GET_DATA_GLOBAL_SUBSCRIPTION,
        variables: {},
        // shouldResubscribe: true (default: false)
      });

      subscription = observer.subscribe(({ data }) => {
        console.log('GLOBAL subscription new data:', data.Objects);
        //props.queryDashboards();
        if (data.Objects.event !== 'update')
          dispatch(setContext({ refreshFlag: Math.random(5) }));
      });

      return () => subscription.unsubscribe();
    } //if
  }, []);

  // for pages with sidebar, menu and dashboard
  return <></>;
} //export default
