import React, { useState, useRef, useCallback, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import gql from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import { TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { useAuth } from '../utils/useAuth';

import {
  enqueueSnackbar as enqueueSnackbarAction,
  closeSnackbar as closeSnackbarAction,
} from '../actions';

import { setContext } from '../actions';

//import { withApollo, compose } from 'react-apollo';
import Button from '@material-ui/core/Button';

import { ReactComponent as ImgLogo } from '../assets/logo_vert.svg';
import { ReactComponent as ImgLogoDark } from '../assets/logo_vert_dark.svg';

import { msg } from '../messages';

const useStyles = makeStyles(theme => ({
  modalPaper: {
    borderRadius: '5px',

    [theme.breakpoints.up('sm')]: {
      width: '288px',
    },
    //    height: '353px',
  },

  logo: {},

  icon: {
    marginRight: '12px',
    marginLeft: '10px',
    color: '#686868',
  },

  modalDialog: {},

  modalContent: {
    paddingLeft: '18px',
    paddingRight: '18px',
    paddingBottom: '18px',
  },

  loginButton: {
    backgroundColor: theme.palette.blue,
    color: theme.palette.white,
    paddingLeft: '14px',
    paddingRight: '20px',
    paddingTop: '10px',
    paddingBottom: '5px',
    boxShadow: 'none',

    maxWidth: '288px',
    fontSize: '14px',
    fontFamily: 'Roboto-Regular',
  },

  modalAppBackDrop: {
    //    backgroundColor: '#333333',
    //    backdropFilter: 'blur(15px)',
  },

  errorMessage: {
    border: `1px solid #D50000`,
    marginTop: '10px',
    marginBottom: '15px',
    padding: '7px',
    color: '#D50000',
    fontSize: '16px',
    fontFamily: 'Roboto-Regular',
  },
}));
/*
const updateCacheAfterLogin = (cache, { data: { login } }) => {
  cache.writeQuery({
    query: GET_PROFILE,
    data: { profile: login.user },
  });
};
*/
const Login = React.memo(props => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const { login } = useAuth();

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));

  const [loginError, setLoginError] = useState(false);

  const [loginText, setLoginText] = useState('');
  const [passwordText, setPasswordText] = useState('');

  const handleClickLogin = async e => {
    console.log('Login.js handleClickLogin');

    try {
      await login({
        userLogin: loginText,
        userPassword: passwordText,
      });

      const last = localStorage.getItem('lastUrlPathname');
      console.log('Login.js last', last);
      localStorage.removeItem('lastUrlPathname');

      if (last) {
        console.log('Login.js handleClickLogin push(last)');
        history.push(last);
        window.location.replace(last);
      } else {
        console.log('Login.js handleClickLogin push(/)');
        history.push('/');
        window.location.replace('/');
      }
    } catch (err) {
      console.log('Login.js handleClickLogin err', err);
      enqueueSnackbar({
        message: err.toString(),
        options: { code: 'UNKNOWN', variant: 'error' },
      });

      setLoginError(true);
    }
  };

  return (
    <>
      <Dialog
        open={true}
        fullScreen={fullScreen}
        onClose={() => {}}
        className={classes.modalDialog}
        BackdropProps={{
          classes: {
            root: classes.modalAppBackDrop,
          },
        }}
        PaperProps={{
          classes: { root: classes.modalPaper },
          style: { pointerEvents: 'auto' },
        }}
        hideBackdrop={false}
        disableEnforceFocus={true}
        style={{ pointerEvents: 'none' }}
      >
        <DialogContent className={classes.modalContent}>
          <Grid
            container
            direction="column"
            justify="space-between"
            style={{ height: '100%' }}
          >
            <Grid container direction="column">
              <Grid item style={{ textAlign: 'center' }}>
                <ImgLogo className={classes.logo} />
              </Grid>

              {true && (
                <>
                  <Grid
                    container
                    alignItems="flex-end"
                    style={{ paddingBottom: '20px', paddingTop: '10px' }}
                  >
                    <Grid item>
                      <PersonIcon className={classes.icon} />
                    </Grid>
                    <Grid xs item>
                      <TextField
                        fullWidth
                        name="login"
                        label="Login"
                        value={loginText}
                        onChange={e => {
                          setLoginText(e.target.value);
                        }}
                        onFocus={e => {
                          setLoginError(false);
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    alignItems="flex-end"
                    style={{ paddingBottom: '30px' }}
                  >
                    <Grid item>
                      <LockIcon className={classes.icon} />
                    </Grid>
                    <Grid xs item>
                      <TextField
                        fullWidth
                        type="password"
                        name="password"
                        label="Password"
                        value={passwordText}
                        onChange={e => {
                          setPasswordText(e.target.value);
                        }}
                        onFocus={e => {
                          setLoginError(false);
                        }}
                      />
                    </Grid>
                  </Grid>
                </>
              )}

              {loginError && (
                <Grid className={classes.errorMessage}>
                  ERROR! Login or password is not correct. Try again or reset
                  password.
                </Grid>
              )}
            </Grid>

            <Grid item style={{ textAlign: 'center' }}>
              <Button
                onClick={handleClickLogin}
                className={classes.loginButton}
                variant="contained"
                color="primary"
                fullWidth
              >
                LOGIN
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
});

export default Login;
