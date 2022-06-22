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
import ButtonBase from '@material-ui/core/ButtonBase';
import Link from '@material-ui/core/Link';
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

*/
//import { Button, Typography, Box } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import { mediaServer } from '../constants';

import { ReactComponent as ImgAdmin } from '../assets/icon_admin.svg';
import { ReactComponent as ImgBoard } from '../assets/icon_board.svg';
import { ReactComponent as ImgMonitor } from '../assets/icon_monitor.svg';

import jwt_decode from 'jwt-decode';

import { APPS_QUERY } from '../queries';

import CommonModal from '../components/CommonModal';

import { msg } from '../messages';
import { MessageSharp } from '@material-ui/icons';

const AppsModal = props => {
  //  const { userId } = props;
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

    root: {
      padding: '6px 12px 8px',
      minWidth: 80,
      maxWidth: 168,
      color: theme.palette.text.secondary,
      flex: '1',
      '&$iconOnly': {
        paddingTop: 16,
      },
      '&$selected': {
        paddingTop: 6,
        color: theme.palette.primary.main,
      },
    },

    wrapper: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      flexDirection: 'column',
      '&:hover': {
        opacity: 0.8,
      },
    },
    /* Styles applied to the label's span element. */
    label: {
      fontFamily: 'Roboto-Regular',
      fontSize: '16px',
      opacity: 1,
      color: theme.palette.black,
      marginTop: '6px',
    },
  }));

  const icons = {
    PixelAdmin: <ImgAdmin />,
    PixelBoard: <ImgBoard />,
    PixelMonitor: <ImgMonitor />,
  };

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
  const [buttons, setButtons] = useState();

  const token_decoded = localStorage.getItem('authToken')
    ? jwt_decode(localStorage.getItem('authToken'))
    : null;
  //console.log('decoded token', token_decoded);

  useEffect(() => {
    console.log(
      'AppsModal.js useEffect token_decoded?.user_id',
      token_decoded?.user_id
    );

    const queryApps = async () => {
      try {
        const result = await client.query({
          query: APPS_QUERY,
          variables: { userId: token_decoded?.user_id },
          fetchPolicy: 'network-only',
        });

        //        console.log('dashboards props result count', result.data.objects.length);

        console.log('AppsModal.js APPS_QUERY result', result.data); // description, key, hidden, type
        setButtons(result.data.schemata);
      } catch (err) {
        console.log('apps query error', err);
      } finally {
      }
    }; //queryProps

    queryApps();
  });

  const handleClick = url => {
    //console.log('!', url);
    window.open(
      `${url}/login?token=${localStorage.getItem(
        'refreshToken'
      )}&tokenId=${localStorage.getItem('tokenId')}`,
      '_blank'
    );
  };

  const getImageUrl = mediaId => {
    return mediaId
      ? `${mediaServer}/download/${mediaId}/${localStorage.getItem(
          'authToken'
        )}`
      : '';
  };

  //console.log('!', getImageUrl('bcd4f223-308d-4043-95e1-3e51de2c6bbd'))
  //  if (!notifications) return <Spinner />; // wait until notifications loaded
  if (!buttons) return false;

  return (
    <>
      <CommonModal
        {...(props.desktop ? { modal: false } : { modal: true })}
        modalOpen={props.modalOpen}
        buttons={false}
        paperStyles={{
          position: 'absolute',
          right: '55px',
          top: '30px',
          width: '348px',
          paddingLeft: '10px',
          paddingRight: '10px',
          paddingBottom: '10px',
        }}
        contentStyles={{
          paddingTop: '13px !important',
        }}
        setModalOpen={handleClose}
        title={msg.notificationsModal.notifications}
      >
        {buttons.map(item => {
          return (
            <ButtonBase
              key={item.id}
              className={classes.root}
              focusRipple
              onClick={() => handleClick(item.url)}
            >
              <span className={classes.wrapper}>
                {icons[item.name]}
                <span className={classes.label}>{item.name}</span>
              </span>
            </ButtonBase>
          );
        })}
        {/* <img src={getImageUrl('bcd4f223-308d-4043-95e1-3e51de2c6bbd')}/> */}
      </CommonModal>
    </>
  );
};

export default React.memo(AppsModal);
