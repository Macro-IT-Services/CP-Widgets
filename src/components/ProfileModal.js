import React, { useEffect, useReducer, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
/*
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
*/
import SettingsIcon from '@material-ui/icons/Settings';
import EditIcon from '@material-ui/icons/Edit';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

//import { Button, Typography, Box } from '@material-ui/core';
import { clearProfile } from '../actions';

import CommonModal from '../components/CommonModal';
import { LOGOUT_MUTATION } from '../queries';
import { useAuth } from '../utils/useAuth';

import { msg } from '../messages';

//import { ReactComponent as ImgUpload } from '../assets/upload.svg';

const ProfileModal = props => {
  //console.log('!!!',props.user)
  const { setModalOpen, desktop, modalOpen } = props;
  const theme = useTheme();

  const useStyles = makeStyles(theme => ({
    listItemIcon: {
      minWidth: '40px',
    },
    info: {
      paddingLeft: '15px',
      paddingRight: '15px',
      paddingTop: '13px',
      paddingBottom: '15px',
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    name: {
      color: theme.palette.black,
    },
    email: {
      color: theme.palette.black,
    },
  }));

  const { loadUser, logout } = useAuth();

  useEffect(() => {
    loadUser();
  }, []);

  //  const useStyles = makeStyles(theme => styles(theme));

  const classes = useStyles();

  //  const classes = useStyles({  });

  // for forms
  //  const [fieldTest, setFieldTest] = useState('dark');
  //const [values, setValue] = useReducer( (prev, updated) => ({...prev, ...updated}), { password1: '', password2: '', password: '', theme: 'light' } );

  const profile = useSelector(state => state.profile);
  const lang = useSelector(state => state.settings.lang);
  const dispatch = useDispatch();

  const history = useHistory();

  const handleClose = () => setModalOpen(false);
  /*
  const handleInputChange = e => {
    const { name, value } = e.target;
    console.log(name, value);

    //        setValue({[name]: value}) //update local state to see changes immediately (or it should be done better on clicking SAVE ? )
    dispatch(setSettings({ [name]: value })); // update global state
  };
*/

  /*
const updateCacheAfterLogout = cache => {
  cache.writeQuery({
    query: GET_PROFILE,
    data: { profile: null },
  });
};
*/

  const handleLogOutClick = () => {
    logout();
    history.push('/login');
    window.location.replace('/login');

    /*
    //logout({      variables: {      },    }    update: updateCacheAfterLogout,)
    Promise.resolve('<h1>Hello!</h1>')
      .then(({ data }) => {
        //       console.log('###res', data);
        localStorage.removeItem('authToken');
        dispatch(clearProfile({}));
        history.push(`${process.env.PUBLIC_URL}/${lang}/login`);
        //        history.push(`${process.env.PUBLIC_URL}/${lang}`);
        //window.location.replace(`${process.env.PUBLIC_URL}/${lang}`);
      })
      .catch(({ graphQLErrors }) => {
        console.log('###err', graphQLErrors);
        //setErrorCode(graphQLErrors[0].extensions.code)
      });
*/
  };

  if (!profile) return false;

  return (
    <>
      <CommonModal
        {...(desktop ? { modal: false } : { modal: true })}
        modalOpen={modalOpen}
        title={msg.profileModal.profile}
        paperStyles={{
          position: 'absolute',
          right: '0px',
          top: '30px',
          width: '412px',
        }}
        contentStyles={{
          paddingTop: '8px !important',
        }}
        setModalOpen={handleClose}
        buttons={[{ title: msg.profileModal.buttonClose, cb: handleClose }]}
      >
        <Grid container className={classes.info}>
          <Grid xs={2} alignItems="center" container item>
            <Fab
              size="small"
              style={{
                fontSize: '18px',
                backgroundColor: 'black',
                color: 'white',
                boxShadow: 'none',
              }}
              aria-label="profile"
            >
              NS
            </Fab>
          </Grid>
          <Grid xs={10} item>
            <Grid xs={12} item container justify="flex-start">
              <Typography variant="h4" className={classes.name}>
                {profile.mName}
              </Typography>
            </Grid>
            <Grid xs={12} item>
              <Typography variant="body1" className={classes.email}>
                {profile.mEmail}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid container direction="column">
          <Grid item>
            <List>
              <ListItem button onClick={() => {}}>
                <ListItemIcon className={classes.listItemIcon}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      {msg.profileModal.editProfile}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem button onClick={() => {}}>
                <ListItemIcon className={classes.listItemIcon}>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      {msg.profileModal.programSettings}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem button onClick={() => {}}>
                <ListItemIcon className={classes.listItemIcon}>
                  <AnnouncementIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      {msg.profileModal.notificationsSettings}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem button onClick={handleLogOutClick}>
                <ListItemIcon className={classes.listItemIcon}>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      {msg.profileModal.logOut}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </CommonModal>
    </>
  );
};

export default ProfileModal;
