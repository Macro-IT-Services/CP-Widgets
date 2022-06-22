import React, { useState, useEffect } from 'react';
//import { useSelector, useDispatch } from 'react-redux';
import { useApolloClient } from '@apollo/client';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
//import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '@material-ui/lab/TabPanel';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import MessageIcon from '@material-ui/icons/Message';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

import Spinner from '../components/Spinner';
/*
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import SettingsIcon from '@material-ui/icons/Settings';
import EditIcon from '@material-ui/icons/Edit';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
*/
//import { Button, Typography, Box } from '@material-ui/core';

//import { setSettings } from '../actions';
import { parseISO, format } from 'date-fns';

import { NOTIFICATIONS_ALL_QUERY } from '../queries';

import CommonModal from '../components/CommonModal';

import { msg } from '../messages';
import { MessageSharp } from '@material-ui/icons';

const NotificationsModal = props => {
  const theme = useTheme();

  const useStyles = makeStyles(theme => ({
    listItemIcon: {
      minWidth: '40px',
    },
    name: {
      color: theme.palette.black,
    },
    email: {
      color: theme.palette.black,
    },
    tabButton: {
      //     minWidth: '103px',
      //      width: '103px',

      minWidth: '40px',
      width: '40px',

      paddingBottom: '15px',
      borderBottom: `2px solid ${theme.palette.gray2}`,
    },
    tabPanel: {},
  }));

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  //  const useStyles = makeStyles(theme => styles(theme));

  const classes = useStyles();

  //  const classes = useStyles({  });

  // for forms
  //  const [fieldTest, setFieldTest] = useState('dark');
  //const [values, setValue] = useReducer( (prev, updated) => ({...prev, ...updated}), { password1: '', password2: '', password: '', theme: 'light' } );

  //  const settings = useSelector(state => state.settings);
  //  const dispatch = useDispatch();

  const handleClose = () => props.setModalOpen(false);

  const [tabIndex, setTabIndex] = React.useState(0);
  const client = useApolloClient();

  const [notifications, setNotifications] = useState();
  //  const [tags, setTags] = useState(["notice","alert","message"]);
  const [value, setValue] = useState('all');

  useEffect(() => {
    //console.log('app.js/useEffect');
    // load notifications for object objId (group e.g.)

    let tags;
    switch (value) {
      case 'all':
        tags = ['notice', 'alert', 'message', 'triggered'];
        break;
      case 'notice':
        tags = ['notice'];
        break;
      case 'alert':
        tags = ['alert'];
        break;
      case 'triggered':
        tags = ['triggered'];
        break;
      case 'message':
        tags = ['message'];
        break;
      default:
        tags = ['notice', 'alert', 'message', 'triggered'];
    }

    const query = async () => {
      try {
        const result = await client.query({
          query: NOTIFICATIONS_ALL_QUERY,
          variables: { tags: tags },
        });

        setNotifications(result.data.notifications);
      } catch (err) {
        console.log('NotificationsModal.js/notifications query err', err);
      }
      //setLoading(false)
    };
    query();
  }, [value]);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  if (!notifications) return <Spinner />; // wait until notifications loaded

  const Notifications = () => (
    <List>
      {notifications.map(notification => (
        <ListItem
          key={notification.id}
          alignItems="flex-start"
          button
          onClick={() => {}}
        >
          <ListItemIcon className={classes.listItemIcon}>
            {notification.tags.find(obj => obj === 'alert') && <VolumeUpIcon />}
            {notification.tags.find(obj => obj === 'message') && (
              <MessageIcon />
            )}
            {notification.tags.find(obj => obj === 'notice') && (
              <NotificationsActiveIcon />
            )}
            {notification.tags.find(obj => obj === 'triggered') && (
              <NotificationsActiveIcon style={{ color: theme.palette.red }} />
            )}
          </ListItemIcon>

          <ListItemText
            primary={
              <Typography variant="body1">{notification.message}</Typography>
            }
            secondary={
              <span>
                {msg.notificationsModal.onObject} {notification.subjectName}
                <br />
                {format(
                  parseISO(notification.createdAt),
                  'MMM d, hh:mm:ss a'
                ).toString() +
                  ' by ' +
                  notification.userByBy.login}
              </span>
            }
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <CommonModal
        {...(props.desktop ? { modal: false } : { modal: true })}
        modalOpen={props.modalOpen}
        buttons={[
          { title: msg.notificationsModal.buttonClose, cb: handleClose },
        ]}
        paperStyles={{
          position: 'absolute',
          right: '55px',
          top: '30px',
          width: '412px',
        }}
        contentStyles={{
          paddingTop: '13px !important',
        }}
        setModalOpen={handleClose}
        title={msg.notificationsModal.notifications}
      >
        <TabContext value={value}>
          <TabList
            onChange={handleChangeTab}
            aria-label="tabs"
            variant="fullWidth"
            TabIndicatorProps={{ style: { background: theme.palette.blue } }}
          >
            <Tab
              label={msg.notificationsModal.all}
              className={classes.tabButton}
              aria-label="all tab"
              value="all"
            />
            <Tab
              icon={<NotificationsActiveIcon />}
              className={classes.tabButton}
              aria-label="alert tab"
              value="alert"
            />
            <Tab
              icon={<VolumeUpIcon />}
              className={classes.tabButton}
              aria-label="notice tab"
              value="notice"
            />
            <Tab
              icon={<MessageIcon />}
              className={classes.tabButton}
              aria-label="message tab"
              value="message"
            />
          </TabList>

          <TabPanel value="all" className={classes.tabPanel}>
            <Notifications />
          </TabPanel>
          <TabPanel value="alert" className={classes.tabPanel}>
            <Notifications />
          </TabPanel>
          <TabPanel value="notice" className={classes.tabPanel}>
            <Notifications />
          </TabPanel>
          <TabPanel value="message" className={classes.tabPanel}>
            <Notifications />
          </TabPanel>
        </TabContext>
      </CommonModal>
    </>
  );
};

export default NotificationsModal;
