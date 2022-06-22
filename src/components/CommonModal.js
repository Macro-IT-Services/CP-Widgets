import React, { useReducer, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Grid from '@material-ui/core/Grid';

import { Button } from '@material-ui/core';

import { setSettings } from '../actions';

const CommonModal = props => {
  const { modal = true } = props;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const styles = theme => ({
    modalPaper: {
      borderRadius: '5px',
      width: '412px',
      ...(!fullScreen ? props.paperStyles : null),
    },

    modalTitle: {
      color: theme.palette.blue,
      borderBottom: `1px solid ${theme.palette.divider}`,
      paddingLeft: '14px',
      paddingRight: '10px',
      paddingTop: '15px',
      paddingBottom: '16px',
      //height: '100px',
    },

    formSubtitle: {
      color: theme.palette.blue,
    },

    modalDialog: {},
    modalContent: {
      padding: 0,
      ...props.contentStyles,
    },

    modalActions: {
      borderTop: `1px solid ${theme.palette.divider}`,
    },

    modalActionsButton: {
      color: theme.palette.blue,
      paddingLeft: '14px',
      paddingRight: '20px',
      paddingTop: '14px',
      paddingBottom: '9px',
    },
  });

  const useStyles = makeStyles(theme => styles(theme));

  const classes = useStyles();

  // for forms
  //  const [fieldTest, setFieldTest] = useState('dark');
  //const [values, setValue] = useReducer( (prev, updated) => ({...prev, ...updated}), { password1: '', password2: '', password: '', theme: 'light' } );

  const settings = useSelector(state => state.settings);
  const dispatch = useDispatch();

  const handleClose = () => {
    props.setModalOpen(false);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    //   console.log(name, value);

    //        setValue({[name]: value}) //update local state to see changes immediately (or it should be done better on clicking SAVE ? )
    dispatch(setSettings({ [name]: value })); // update global state
  };

  //console.log(modal)
  return (
    <>
      <Dialog
        open={props.modalOpen}
        fullScreen={fullScreen}
        onClose={handleClose}
        className={classes.modalDialog}
        PaperProps={{
          classes: { root: classes.modalPaper },
          ...(!modal ? { style: { pointerEvents: 'auto' } } : {}),
        }}
        {...(!modal ? { hideBackdrop: true } : {})}
        {...(!modal ? { disableEnforceFocus: true } : {})}
        {...(!modal ? { style: { pointerEvents: 'none' } } : {})}
      >
        {(fullScreen || props.forceTitle) && (
          <DialogTitle onClose={handleClose} className={classes.modalTitle}>
            <Grid container justify="space-between" alignItems="center">
              {props.title}
              {/*
              <IconButton aria-label="close" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
*/}
            </Grid>
          </DialogTitle>
        )}
        <DialogContent className={classes.modalContent}>
          {props.children}
        </DialogContent>

        {props.buttons && (
          <DialogActions className={classes.modalActions}>
            {props.buttons.map((button, index) => (
              <Button
                onClick={button.cb}
                className={classes.modalActionsButton}
                key={index}
              >
                {button.title}
              </Button>
            ))}
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default CommonModal;
