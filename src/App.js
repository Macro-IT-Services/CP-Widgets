import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter, Switch, Link, Redirect } from 'react-router-dom';
import clsx from 'clsx';
import Widgets from './components/Widgets';
import Dashboard from './components/Dashboard';
import NoDashboards from './components/NoDashboards';
import Login from './components/Login';
import Error404 from './components/Error404';
import MainSideMenu from './components/MainSideMenu';
import _ from 'lodash';
import Spinner from './components/Spinner';
import jwt_decode from 'jwt-decode';

//import LinearProgress from '@material-ui/core/LinearProgress';

//import Sign from './components/Sign';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { useSelector, useDispatch } from 'react-redux';
import {
  enqueueSnackbar as enqueueSnackbarAction,
  closeSnackbar as closeSnackbarAction,
} from './actions';
import { setSettings } from './actions';
import { setContext } from './actions';

import { useAuth } from './utils/useAuth';

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

//import NotificationContext from './components/NotificationContext'
//import ProfileContext from './components/ProfileContext'
import Notifier from './components/Notifier';

import SettingsModal from './components/SettingsModal';
import AboutModal from './components/AboutModal';
import ProfileModal from './components/ProfileModal';
import AppsModal from './components/AppsModal';
import NotificationsModal from './components/NotificationsModal';
import AddDashboardModal from './components/AddDashboardModal';
import EditDashboardModal from './components/EditDashboardModal';
import DeleteDashboardModal from './components/DeleteDashboardModal';
import TestModal from './components/TestModal';

import EditWidgetColorsModal from './components/EditWidgetColorsModal';
import EditWidgetAlarmsModal from './components/EditWidgetAlarmsModal';
import EditWidgetSourceModal from './components/EditWidgetSourceModal';
import EditWidgetPropertyModal from './components/EditWidgetPropertyModal';

import SideList from './components/SideList';
import SideCard from './components/SideCard';
//import LoginModal from './components/LoginModal';
import MainToolbar from './components/MainToolbar';
import Subscription from './components/Subscription';

import { MenuItem, Typography } from '@material-ui/core';

import {
  UPDATE_DASHBOARD_MUTATION,
  ADD_DASHBOARD_MUTATION,
  DELETE_OBJECT_MUTATION,
  UPDATE_WIDGET_PROPS_MUTATION,
  UPDATE_DASHBOARD_PROPS_MUTATION,
  DASHBOARDS_QUERY,
  LINKED_OBJECTS_QUERY,
  ICONS_QUERY,
} from './queries';

import { msg } from './messages';

const drawerWidth = 256;
const sideBarWidth = 412; //412

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100%',
  },

  appBar: {
    //    zIndex: theme.zIndex.drawer  1,
    zIndex: theme.zIndex.drawer + 1,
    background: 'transparent',
    boxShadow: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
  },
  appBarFab: {
    backgroundColor: theme.palette.white,
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },

  sideBarPaper: {
    width: sideBarWidth,
    flexShrink: 0,
    //overflowY: 'scroll', // show vertical scrollbar permanently as divider for sidebar
    overflowX: 'hidden',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    backgroundColor: theme.palette.background.default,
    height: '100%',
  },

  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    // sidebar shouldn't be overwrite page content on desktops
    marginLeft: '0px', //sideBarWidth,
    //    borderLeft: '1px solid #9E9E9E',
    // sidebar will overwrite page content on mobiles
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      border: 'none',
    },
  },
  // to add left margin if sidebar shown (on desktop, using <Drawer/>)
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: sideBarWidth, //500,
  },

  toolbarButtons: {
    marginLeft: 'auto',
  },

  screenModeButton: {
    zIndex: theme.zIndex.drawer + 1,
    margin: 0,
    //    top: 'auto',
    right: 16,
    bottom: 16,
    //    left: 'auto',
    position: 'fixed',
    // backgroundColor: theme.palette.blue,
    color: theme.palette.white,
    //    boxShadow: 'none',
    '&:hover': {
      backgroundColor: theme.palette.gray1,
    },
  },

  iconFullScreen: {
    height: '35px',
    width: 'auto',
  },
}));

export default function App(props) {
  console.log(
    'App.js start. authToken decoded:',
    localStorage.getItem('authToken')
      ? jwt_decode(localStorage.getItem('authToken'))
      : 'no token'
  );
  const { container } = props;
  const classes = useStyles();
  const theme = useTheme();

  const desktop = useMediaQuery(theme.breakpoints.up('sm'));

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { loginFromApp, loadUser, getUserId } = useAuth();

  const lang = useSelector(state => state.settings.lang);

  const isFullScreen = useSelector(state => state.settings.isFullScreen);
  const isSideBar = useSelector(state => state.settings.isSideBar);
  const isEditMode = useSelector(state => state.settings.isEditMode);

  //const profile = useSelector(state => state.profile);

  const [addGroupModalState, setAddGroupModalState] = useState({
    open: false,
    dashboardId: null,
  });

  //if (desktop) dispatch(setSettings({ isSideBar: true }));
  /*
  const token = localStorage.getItem('authToken');
  const token_decoded = token
    ? jwt_decode(localStorage.getItem('authToken'))
    : null;
  console.log('decoded token', token_decoded);
*/

  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));

  const routeMatchLogin = useRouteMatch(
    `${process.env.PUBLIC_URL}/login`
    //    `${process.env.PUBLIC_URL}/${lang}/login`
  );
  const routeMatchError404 = useRouteMatch(
    `${process.env.PUBLIC_URL}/${lang}/404`
  );

  let dashboardId, groupId, widgetId, objectId, type;

  // main page, to display list of groups
  const routeMatchGroups = useRouteMatch({
    path: [
      `${process.env.PUBLIC_URL}/${lang}/:dashboard_id`,
      `${process.env.PUBLIC_URL}/${lang}`,
    ],
    strict: true,
  });
  // group in SideCard
  const routeMatchGroup = useRouteMatch({
    path: `${process.env.PUBLIC_URL}/${lang}/:dashboard_id/:group_id`,
    strict: true,
  });
  // widget in SideCard
  const routeMatchWidget = useRouteMatch({
    path: `${process.env.PUBLIC_URL}/${lang}/:dashboard_id/:group_id/:widget_id`,
    strict: true,
  });
  // object in SideCard
  const routeMatchObject = useRouteMatch({
    path: `${process.env.PUBLIC_URL}/${lang}/:dashboard_id/:group_id/:widget_id/:object_id`,
    strict: true,
  });

  if (routeMatchGroups) {
    dashboardId = routeMatchGroups.params.dashboard_id;
    type = 'dashboard';
    //    type = 'groups';
  }
  if (routeMatchGroup) {
    dashboardId = routeMatchGroup.params.dashboard_id;
    groupId = routeMatchGroup.params.group_id;
    type = 'group';
  }
  if (routeMatchWidget) {
    dashboardId = routeMatchWidget.params.dashboard_id;
    groupId = routeMatchWidget.params.group_id;
    widgetId = routeMatchWidget.params.widget_id;
    type = 'widget';
  }
  if (routeMatchObject) {
    dashboardId = routeMatchObject.params.dashboard_id;
    groupId = routeMatchObject.params.group_id;
    widgetId = routeMatchObject.params.widget_id;
    objectId = routeMatchObject.params.object_id;
    type = 'object';
  }

  console.log(
    '--------------- app.js dashboardId, groupId, widgetId, objectId',
    dashboardId,
    groupId,
    widgetId,
    objectId
  );

  const client = useApolloClient();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleUsernameClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleUsernameMenuClose = () => {
    setAnchorEl(null);
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [item, setItem] = useState();
  const [userId, setUserId] = useState(null);

  //  const [scrollTop, setScrollTop] = useState(0);

  // global modals
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [appsModalOpen, setAppsModalOpen] = useState(false);
  const [addDashboardModalState, setAddDashboardModalState] = useState({
    open: false,
  });

  const [editDashboardModalState, setEditDashboardModalState] = useState({
    open: false,
    dashboardId: null,
  });  
  
/*
  const [editDashboardModalState, setEditDashboardModalState] = useState({
    open: true,
    dashboardId: 'c72c9af4-5857-4a13-8a23-8265a7712b13',
  });  // false, null
*/

  const [editWidgetColorsModalState, setEditWidgetColorsModalState] = useState({
    open: false,
    widgetId: null,
  });

  const [editWidgetAlarmsModalState, setEditWidgetAlarmsModalState] = useState({
    open: false,
    widgetId: null,
  });

  const [editWidgetSourceModalState, setEditWidgetSourceModalState] = useState({
    open: false,
    widgetId: null,
    propId: null,
  });

  const [
    editWidgetPropertyModalState,
    setEditWidgetPropertyModalState,
  ] = useState({
    open: false,
    widgetId: null,
    propId: null,
  });

  /*  
  const [editDashboardModalState, setEditDashboardModalState] = useState({
    open: true,
    dashboardId: '4c7cf9de-ddd9-4262-99b4-6acb2eb2a529',
  });
  */
  const [deleteDashboardModalState, setDeleteDashboardModalState] = useState({
    open: false,
    dashboardId: null,
  });

  // lifted from Dashboard.js
  const [editGroupModalState, setEditGroupModalState] = useState({
    open: false,
    groupId: null,
  });

  const [deleteGroupModalState, setDeleteGroupModalState] = useState({
    open: false,
    groupId: null,
  });

  const [deleteWidgetModalState, setDeleteWidgetModalState] = useState({
    open: false,
    groupId: null,
    widgetId: null,
  });
  const [editWidgetModalState, setEditWidgetModalState] = useState({
    open: false,
    widgetId: null,
    groupNames: null,
  });

  const [testModalOpen, setTestModalOpen] = useState(false);

  const [simulationTimerId, setSimulationTimerId] = useState();
  const simulation = useSelector(state => state.settings.simulation);

  console.log('App.js userId', userId);

  useEffect(() => {
    console.log('App.js/useEffect 1');
    const asyncCall = async () => {
      const params = new URLSearchParams(location.search);

      console.log('App.js/useEffect 1 params.get(token)', params.get('token'));

      // check if there is ?token=... param to login from another app. If not, go standard login form
      if (params.get('token')) {
        console.log('App.js/useEffect .get(token)=true');

        localStorage.setItem('refreshToken', params.get('token'));
        localStorage.setItem('tokenId', params.get('tokenId'));

        try {
          await loginFromApp();
          console.log('history.push(/);');
          history.push('/');
          window.location.replace('/');
        } catch {
          console.log('history.push(/login);');
          history.push('/login');
          window.location.replace('/login');
        }
      } //if

      console.log('App.js routeMatchLogin:', routeMatchLogin);

      //check for auth only if it is not login form
      if (!routeMatchLogin) {
        console.log('App.js routeMatchLogin not matched:', routeMatchLogin);
        // firstly trying to check if logged by getting current user id. If not, will thrown to /login (from onError in index.js)
        try {
          const tmpUserId = await getUserId(); // check for authorization
          console.log('App.js tmpUserId:', tmpUserId);
          setUserId(tmpUserId);
        } catch (err) {
          setUserId(null);
        }
      } //if
    }; //asyncCall

    asyncCall();
  }, []);

  useEffect(() => {
    console.log('useEffect 3');

    if (simulation)
      setSimulationTimerId(
        setInterval(function () {
          dispatch(setSettings({ simData: _.random(0, 9) })); // debug to simulate changing data
        }, 2000)
      );
    // in ms
    else clearInterval(simulationTimerId);
  }, [simulation]);

  setInterval(function () {
    dispatch(setSettings({ datetime: new Date() })); // update date/time for DateTime widget
    // clearInterval(simData);
  }, 15000); // in ms

  const queryDashboards = async () => {
    //setLoading(true)
    try {
      const result = await client.query({
        query: DASHBOARDS_QUERY,
        variables: {},
        fetchPolicy: 'network-only', // skip the cache
      });

      console.log('================ App.js/DASHBOARDS_QUERY result', result);

      //        setDataDashboards(result.data.objects)
      dispatch(setContext({ dashboards: result.data.objects }));

      // if there are any dashboards
      if (result.data.objects.length > 0) {
        // if path = '/', set first dashboard as current
        // if given dashboard id doesn't exist, set first dashboard as current
        if (
          !dashboardId ||
          !result.data.objects.find(obj => obj.id === dashboardId)
        ) {
          dashboardId = result.data.objects[0].id;
          window.location.replace(
            `${process.env.PUBLIC_URL}/${lang}/${dashboardId}`
          );
        }
      } else {
      }
    } catch (err) {
      console.log('App.js/DASHBOARDS_QUERY err', err);
    }
    //setLoading(false)
  }; //queryDashboards

  useEffect(() => {
    console.log('app.js/useEffect 2');

    if (userId) queryDashboards();
  }, [userId]);

  const getIcons = async () => {
    console.log('App.js/ICONS_QUERY');

    try {
      const result = await client.query({
        query: ICONS_QUERY,
        variables: {},
        fetchPolicy: 'network-only', // skip the cache
      });

      console.log('================ App.js/ICONS_QUERY result', result);

      dispatch(setSettings({ icons: result.data.objects }));
    } catch (err) {
      console.log('App.js/ICONS_QUERY err', err);
    }
  }; //getIcons

  useEffect(() => {
    console.log('Apps.js getIcons');

    if (userId) getIcons();
  }, [userId]);

  // load datasets/devices/widgets to fill SideCard
  const queryLinkedObjects = async () => {
    let objId;

    switch (type) {
      case 'dashboard':
        objId = dashboardId; // not used currently, groups list displays in SideList, not SideCard
        break;
      case 'group':
        objId = groupId;
        break;
      case 'widget':
        objId = widgetId;
        break;
      case 'object':
        objId = objectId;
        break;
    }

    try {
      const result = await client.query({
        query: LINKED_OBJECTS_QUERY,
        variables: { objId: objId },
        fetchPolicy: 'no-cache',
      });
      console.log('SideCard.js/objects query res', result);

      setItem(result.data.object);

      dispatch(setContext({ currentObjectName: result.data.object?.name })); // show object name in search toolbar (with go back arrow)
    } catch (err) {
      console.log('SideCard.js/objects query err', err);
    }
    //setLoading(false)
  };

  // get object with linked objects (for SideCard objects tab)
  useEffect(() => {
    if (userId) queryLinkedObjects();
  }, [dashboardId, groupId, widgetId, objectId, type, userId]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSideMenuItemClick = item => {
    console.log('app.js handleSideMenuItemClick', item);

    if (item.action === 'about') setAboutModalOpen(true);
    if (item.action === 'settings') setSettingsModalOpen(true);
    if (item.action === 'account') setProfileModalOpen(true);
    if (item.action === 'addboard') setAddDashboardModalState({ open: true });
    if (item.action === 'editboard')
      setEditDashboardModalState({ open: true, dashboardId: item.id });
    //    if (item.action === 'board') console.log('board',item.id);

    // change current dashboard
    if (item.action === 'board') {
      history.push(`/${lang}/${item.id}`);
    }

    setDrawerOpen(false);
  };

  // item.action (mute, ...) , item.type (widget, group),
  const handleMenuActionClick = item => {
    console.log('App.js handleMenuActionClick', item);

    if (item.action === 'add_new_group')
      setAddGroupModalState({ open: true, dashboardId: dashboardId });

    if (item.action === 'edit_prop') {
      setEditWidgetPropertyModalState({
        open: true,
        widgetId: item.widgetId,
        propId: item.propId,
      });
    }

    if (item.action === 'edit') {
      switch (item.type) {
        case 'group':
          setEditGroupModalState({ open: true, groupId: item.groupId });
          break;
        case 'widget':
          setEditWidgetModalState({
            open: true,
            widgetType: item.widgetType,
            groupId: item.groupId,
            widgetId: item.widgetId,
          }); // groupNames: ?
          break;
        default:
          console.log('Apps.js: unsupported type to edit');
          break;
      } //switch
    } //if

    if (item.action === 'delete') {
      switch (item.type) {
        case 'group':
          setDeleteGroupModalState({ open: true, groupId: item.groupId });
          break;
        case 'widget':
          setDeleteWidgetModalState({
            open: true,
            widgetId: item.widgetId,
            groupId: item.groupId,
          }); // groupNames: ?
          break;
        default:
          console.log('Apps.js: unsupported type to delete');
          break;
      } //switch
    } //if

    if (item.action === 'copy_uuid') {
      navigator.clipboard.writeText(item.id);
      enqueueSnackbar({
        message: msg.editDashboardModal.copied,
        options: { code: 'UNKNOWN', variant: 'info' },
      });
    } //if

    if (item.action === 'edit_colors') {
      setEditWidgetColorsModalState({ open: true, widgetId: item.widgetId });
    } //if

    if (item.action === 'edit_alarms') {
      setEditWidgetAlarmsModalState({ open: true, widgetId: item.widgetId });
    }
    //    console.log('!!!!ITEM', item) //propId, propKey

    if (item.action === 'edit_source') {
      setEditWidgetSourceModalState({
        open: true,
        widgetId: item.widgetId,
        propId: item.propId,
      });
    }
  };

  const handleAddDashboard = async props => {
    const { values, name, description } = props;

    console.log(
      'adding dashboard... values, name, description',
      values,
      name,
      description
    );

    try {
      const result_add = await client.mutate({
        mutation: ADD_DASHBOARD_MUTATION,
        variables: {
          name: name,
          description: description,
          values: values,
        },
      });

      console.log(
        'dashboard added:',
        result_add.data.createObjectWithProperties.uuid
      );

      //reload to show actual list of dashboards
      const result = await client.query({
        query: DASHBOARDS_QUERY,
        variables: {},
        fetchPolicy: 'network-only',
      });
      //        setDataDashboards(result.data.objects)

      dispatch(setContext({ dashboards: result.data.objects }));

      //go new dashboard immediately
      history.push(
        `/${lang}/${result_add.data.createObjectWithProperties.uuid}`
      );

      enqueueSnackbar({
        message: msg.addDashboardModal.added,
        options: { code: 'UNKNOWN', variant: 'info' },
      });

      //TODO: fix to refresh everything from db. Better avoid it and just add dashboard using updateInDashboard
      //queryAndCookDashboards();
    } catch (err) {
      console.log('addDashboard error:', err);
      enqueueSnackbar({
        message: err.toString(),
        options: { code: 'UNKNOWN', variant: 'error' },
      });
    } //catch
  }; //handleAddDashboard

  const handleUpdateDashboard = async props => {
    const { dashboardId, values, name, description } = props;

    console.log(
      'updating dashboard... dashboardId, values, name, description',
      dashboardId,
      values,
      name,
      description
    );
    //return false

    try {
      const result_update = await client.mutate({
        mutation: UPDATE_DASHBOARD_MUTATION,
        variables: {
          dashboardId: dashboardId,
          name: name,
          description: description,
          values: values,
        },
      });

      console.log(
        'updateDashboard updated:',
        result_update.data.updateObjectWithProperties
      );

      //reload list of dashboards
      queryDashboards();

      enqueueSnackbar({
        message: msg.editDashboardModal.updated,
        options: { code: 'UNKNOWN', variant: 'info' },
      });

      //TODO: fix to refresh everything from db. Better avoid it
      //      queryAndCookWidgets();
    } catch (err) {
      console.log('updateDashboard error:', err);
      enqueueSnackbar({
        message: err.toString(),
        options: { code: 'UNKNOWN', variant: 'error' },
      });
    } //catch
  }; //handleUpdateDashboard

  const handleDeleteDashboard = async props => {
    const { dashboardId } = props;
    console.log('deleting dashboard...', dashboardId);

    try {
      const result = await client.mutate({
        mutation: DELETE_OBJECT_MUTATION,
        variables: {
          objId: dashboardId,
        },
      });

      console.log('dashboard deleted');

      //reload list of dashboards
      queryDashboards();

      enqueueSnackbar({
        message: msg.deleteDashboardModal.deleted,
        options: { code: 'UNKNOWN', variant: 'info' },
      });

      //      queryAndCookWidgets();
    } catch (err) {
      console.log('deleteDashboard error', err);
      enqueueSnackbar({
        message: err.toString(),
        options: { code: 'UNKNOWN', variant: 'error' },
      });
    } //catch
  }; //handleDeleteDashboard

  // update widget properties only (without name, description, ..)
  const handleUpdateWidgetProps = async props => {
    const { widgetId, values } = props;

    console.log('updating widget props... widgetId, values', widgetId, values);

    //    return false

    try {
      const result_update = await client.mutate({
        mutation: UPDATE_WIDGET_PROPS_MUTATION,
        variables: {
          widgetId: widgetId,
          values: values,
        },
      });

      console.log(
        'updateWidgetProps updated:',
        result_update.data.updateObjectWithProperties
      );

      enqueueSnackbar({
        message: msg.editWidgetModal.updated,
        options: { code: 'UNKNOWN', variant: 'info' },
      });

      //TODO: fix to refresh everything from db. Better avoid it
      //      queryAndCookWidgets();
    } catch (err) {
      console.log('updateWidgetProps error:', err);
      enqueueSnackbar({
        message: err.toString(),
        options: { code: 'UNKNOWN', variant: 'error' },
      });
    } //catch
  }; //handleUpdateWidgetProps




  // update dashboard properties only (without name, description, ..)
  const handleUpdateDashboardProps = async props => {
    const { dashboardId, values } = props;

    console.log('updating dashboard props... dashboardId, values', dashboardId, values);

    //    return false

    try {
      const result_update = await client.mutate({
        mutation: UPDATE_DASHBOARD_PROPS_MUTATION,
        variables: {
          dashboardId: dashboardId,
          values: values,
        },
      });

      console.log(
        'updateDashboardProps updated:',
        result_update.data.updateObjectWithProperties
      );

      enqueueSnackbar({
        message: msg.editDashboardModal.updated,
        options: { code: 'UNKNOWN', variant: 'info' },
      });

      //TODO: fix to refresh everything from db. Better avoid it
      //      queryAndCookDashboards();
    } catch (err) {
      console.log('updateDashboardProps error:', err);
      enqueueSnackbar({
        message: err.toString(),
        options: { code: 'UNKNOWN', variant: 'error' },
      });
    } //catch
  }; //handleUpdateDashboardProps


  if (routeMatchLogin) return <Login />;
  else if (routeMatchError404) return <Error404 />;

  if (!userId) return false; // not authorized

  // for pages with sidebar, menu and dashboard
  return (
    <>
      <div className={classes.root}>
        {/* <Subscription queryDashboards={queryDashboards}/> */}
        <Notifier />
        <AppBar
          position="fixed"
          className={classes.appBar}
          style={{
            pointerEvents: isFullScreen ? 'none' : 'auto',
          }}
        >
          <Toolbar
            disableGutters
            style={{ marginLeft: '15px', marginRight: '20px' }}
          >
            {!isFullScreen && (
              <MainToolbar
                handleDrawerToggle={handleDrawerToggle}
                setNotificationsModalOpen={setNotificationsModalOpen}
                back={type !== 'dashboard' && type}
              />
            )}

            {!isFullScreen && desktop && (
              <div className={classes.toolbarButtons}>
                <Fab
                  size="small"
                  className={classes.appBarFab}
                  style={{ marginLeft: '20px', marginRight: '2px' }}
                  aria-label="profile"
                  onClick={() => {
                    if (!notificationsModalOpen) {
                      setProfileModalOpen(false);
                      setAppsModalOpen(false);
                    }
                    setNotificationsModalOpen(!notificationsModalOpen);
                  }}
                >
                  <Badge variant="dot" color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </Fab>

                <Fab
                  size="small"
                  className={classes.appBarFab}
                  style={{ marginLeft: '20px', marginRight: '2px' }}
                  aria-label="apps"
                  onClick={() => {
                    if (!appsModalOpen) {
                      setProfileModalOpen(false);
                      setNotificationsModalOpen(false);
                    }
                    setAppsModalOpen(!appsModalOpen);
                  }}
                >
                  <AppsIcon />
                </Fab>

                <Fab
                  size="small"
                  className={classes.appBarFab}
                  style={{
                    fontSize: '18px',
                    backgroundColor: 'red',
                    color: 'white',
                    marginLeft: '20px',
                  }}
                  aria-label="profile"
                  onClick={() => {
                    if (!profileModalOpen) {
                      setNotificationsModalOpen(false);
                      setAppsModalOpen(false);
                    }
                    setProfileModalOpen(!profileModalOpen);
                  }}
                >
                  T
                </Fab>
              </div>
            )}
          </Toolbar>
        </AppBar>

        {/* Drawer for MENU */}
        <Drawer
          container={container}
          variant="temporary"
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <MainSideMenu
            account={!desktop}
            handleMenuActionClick={handleSideMenuItemClick}
            setDrawerOpen={setDrawerOpen}
          />
        </Drawer>

        {/* Main router switch (some pages are inside drawer which used for SIDEBAR) */}
        {/* ------ */}

        {/* If desktop not in FullScreen, show sidebar using <Drawer/> */}
        {routeMatchGroups && (
          <Drawer
            container={container}
            variant="persistent"
            anchor="left"
            open={(desktop && !isFullScreen) || (!desktop && isSideBar)}
            classes={{
              paper: classes.sideBarPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {/* onScroll={e => setScrollTop(e.target.scrollTop)} */}
            <SideList
              handleMenuActionClick={handleMenuActionClick}
              dashboardId={dashboardId}
              sideBarWidth={sideBarWidth}
            />
          </Drawer>
        )}

        {routeMatchGroup && (
          <Drawer
            container={container}
            variant="persistent"
            anchor="left"
            open={(desktop && !isFullScreen) || (!desktop && isSideBar)}
            classes={{
              paper: classes.sideBarPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {/* onScroll={e => setScrollTop(e.target.scrollTop)} */}

            {item && (
              <SideCard
                dashboardId={dashboardId}
                groupId={groupId}
                widgetId={widgetId}
                objectId={objectId}
                type={type}
                sideBarWidth={sideBarWidth}
                handleMenuActionClick={handleMenuActionClick}
                item={item}
              />
            )}
          </Drawer>
        )}

        {/*<Redirect to={`${process.env.PUBLIC_URL}/${lang}/404`} />*/}

        {/* On mobile, show only sidebar header, without Drawer */}
        {!desktop && !isSideBar && !isFullScreen && (
          <SideList
            dashboardId={dashboardId}
            handleMenuActionClick={handleMenuActionClick}
            onlyHeader={true}
            sideBarWidth={sideBarWidth}
          />
        )}

        {/* hide content on mobile if sidebar opened. Show otherwise.
          Add left margin for content on desktop if sidebar shown 
//          {!(!desktop && isSideBar) && (    // this won't work because we have to mount dashboard, otherwise we can't measure height of widgets in containers!

          */}

        <main
          style={{
            userSelect: isEditMode ? 'none' : 'auto',
            WebkitUserSelect: isEditMode ? 'none' : 'auto',
            cursor: isEditMode ? 'move' : 'default',
          }}
          className={clsx(classes.content, {
            [classes.contentShift]: desktop && !isFullScreen,
          })}
        >
          {/* top margin for content */}
          {!desktop && !isFullScreen && <div style={{}} />}

          {dashboardId && (
            <Dashboard
              {...isFullScreen}
              dashboardId={dashboardId}
              groupId={groupId}
              widgetId={widgetId}
              addGroupModalState={addGroupModalState}
              setAddGroupModalState={setAddGroupModalState}
              editGroupModalState={editGroupModalState}
              setEditGroupModalState={setEditGroupModalState}
              deleteGroupModalState={deleteGroupModalState}
              setDeleteGroupModalState={setDeleteGroupModalState}
              editWidgetModalState={editWidgetModalState}
              setEditWidgetModalState={setEditWidgetModalState}
              deleteWidgetModalState={deleteWidgetModalState}
              setDeleteWidgetModalState={setDeleteWidgetModalState}
              refreshSideCard={queryLinkedObjects}
            />
          )}
          {!dashboardId && (
            <NoDashboards
              handleAddDashboardClick={() =>
                setAddDashboardModalState({ open: true })
              }
            />
          )}
        </main>
      </div>

      {desktop && !isEditMode && (
        <Fab
          className={classes.screenModeButton}
          style={{ right: '90px' }}
          color="primary"
          onClick={() => {
            window.getSelection().removeAllRanges(); // deselect everything that was selected occasionally
            dispatch(setSettings({ isEditMode: true }));
          }}
        >
          <EditIcon />
        </Fab>
      )}

      {desktop && isEditMode && (
        <Fab
          className={classes.screenModeButton}
          style={{ right: '90px' }}
          color="primary"
          onClick={() => dispatch(setSettings({ isEditMode: false }))}
        >
          <RemoveRedEyeIcon />
        </Fab>
      )}

      {desktop && !isFullScreen && (
        <Fab
          className={classes.screenModeButton}
          style={{ right: '16px' }}
          color="primary"
          onClick={() => {
            dispatch(setSettings({ isSideBar: false }));
            dispatch(setSettings({ isFullScreen: true }));

            //TODO: replace with another width provider for RGL (like SizeMe)
            setTimeout(() => {
              window.dispatchEvent(new Event('resize'));
            }, 350);
          }}
        >
          <SettingsOverscanIcon />
        </Fab>
      )}

      {desktop && isFullScreen && (
        <Fab
          className={classes.screenModeButton}
          style={{ right: '16px' }}
          color="primary"
          onClick={() => {
            dispatch(setSettings({ isSideBar: true }));
            dispatch(setSettings({ isFullScreen: false }));

            //TODO: replace with another width provider for RGL (like SizeMe)
            setTimeout(() => {
              window.dispatchEvent(new Event('resize'));
            }, 350);
          }}
        >
          <DashboardIcon />
        </Fab>
      )}

      {!desktop && !isFullScreen && isSideBar && (
        <Fab
          className={classes.screenModeButton}
          style={{ right: '16px' }}
          color="primary"
          onClick={() => {
            dispatch(setSettings({ isSideBar: false }));
          }}
        >
          <DashboardIcon />
        </Fab>
      )}

      {!desktop && !isFullScreen && !isSideBar && (
        <>
          <Fab
            className={classes.screenModeButton}
            style={{ right: '16px' }}
            color="primary"
            onClick={() => {
              dispatch(setSettings({ isSideBar: false }));
              dispatch(setSettings({ isFullScreen: true }));
            }}
          >
            <SettingsOverscanIcon />
          </Fab>

          <Fab
            className={classes.screenModeButton}
            style={{ right: '90px' }}
            color="primary"
            onClick={() => {
              dispatch(setSettings({ isSideBar: true }));
            }}
          >
            <ViewListIcon />
          </Fab>
        </>
      )}

      {!desktop && isFullScreen && (
        <Fab
          className={classes.screenModeButton}
          style={{ right: '16px' }}
          color="primary"
          onClick={() => {
            dispatch(setSettings({ isSideBar: false }));
            dispatch(setSettings({ isFullScreen: false }));
          }}
        >
          <VerticalSplitIcon />
        </Fab>
      )}

      <AboutModal setModalOpen={setAboutModalOpen} modalOpen={aboutModalOpen} />
      <SettingsModal
        setModalOpen={setSettingsModalOpen}
        modalOpen={settingsModalOpen}
      />
      <ProfileModal
        setModalOpen={setProfileModalOpen}
        modalOpen={profileModalOpen}
        desktop={desktop}
      />
      <AppsModal
        setModalOpen={setAppsModalOpen}
        modalOpen={appsModalOpen}
        desktop={desktop}
      />
      <NotificationsModal
        setModalOpen={setNotificationsModalOpen}
        modalOpen={notificationsModalOpen}
        desktop={desktop}
      />
      <AddDashboardModal
        setModalState={setAddDashboardModalState}
        modalState={addDashboardModalState}
        handleAddDashboard={handleAddDashboard}
      />
      <EditDashboardModal
        setModalState={setEditDashboardModalState}
        setDeleteDashboardModalState={setDeleteDashboardModalState}
        modalState={editDashboardModalState}
        handleUpdateDashboard={handleUpdateDashboard}
        handleUpdateDashboardProps={handleUpdateDashboardProps}
      />
      <DeleteDashboardModal
        setModalState={setDeleteDashboardModalState}
        setDeleteDashboardModalState={setDeleteDashboardModalState}
        modalState={deleteDashboardModalState}
        handleDeleteDashboard={handleDeleteDashboard}
      />
      <EditWidgetColorsModal
        setModalState={setEditWidgetColorsModalState}
        modalState={editWidgetColorsModalState}
        handleUpdateWidgetProps={handleUpdateWidgetProps}
      />
      <EditWidgetAlarmsModal
        setModalState={setEditWidgetAlarmsModalState}
        modalState={editWidgetAlarmsModalState}
        handleUpdateWidgetProps={handleUpdateWidgetProps}
      />
      <EditWidgetSourceModal
        setModalState={setEditWidgetSourceModalState}
        modalState={editWidgetSourceModalState}
        handleUpdateWidgetProps={handleUpdateWidgetProps}
      />
      <EditWidgetPropertyModal
        setModalState={setEditWidgetPropertyModalState}
        modalState={editWidgetPropertyModalState}
        handleUpdateWidgetProps={handleUpdateWidgetProps}
      />

      {/*      <LoginModal setModalOpen={setLoginModalOpen} modalOpen={loginModalOpen} />    */}

      <TestModal setModalOpen={setTestModalOpen} modalOpen={testModalOpen} />
    </>
  );
} //export  default
