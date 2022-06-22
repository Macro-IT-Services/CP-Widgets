import React, { useReducer, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import Grid from '@material-ui/core/Grid';

import { Button } from '@material-ui/core';
import DeleteWidgetModal from './DeleteWidgetModal';
import AddWidgetModal from './AddWidgetModal';
import EditWidgetModal from './EditWidgetModal';

//import { setSettings } from '../actions';

//import { DELETE_OBJECT_MUTATION, ADD_WIDGET_MUTATION } from '../queries';

import { msg } from '../messages';
import groupNames from '../utils/groupNames';

const useStyles = makeStyles(theme => ({
  test: {
    //      ...(!fullScreen ? props.paperStyles : null),
  },
  wrapper: {
    display: 'flex',
    //    border: '2px solid green',
    background: 'rgba(0,0,0,0.4)',
    zIndex: '10',
    position: 'absolute',
    left: '0',
    top: '0',
    right: '0',
    bottom: '0',
    pointerEvents: 'auto',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: '2px',
  },
  iconButton: {
    padding: '0',
    pointerEvents: 'auto',
  },
}));

const WidgetEditControls = props => {
  //console.log('WidgetEdit props', props);
  const {
    modal = true,
    id,
    order,
    groupId,
    handleMove,
    widgetType,
    groupNames,
    handleUpdateWidget,
  } = props;
  //  console.log('WidgetEdit id', id);
  //  console.log('WidgetEdit widgetId', widgetId);
  //  const { setAddWidgetModalState, setDeleteWidgetModalState } = actions;

  const classes = useStyles();
  const theme = useTheme();
  const isEditMode = useSelector(state => state.settings.isEditMode);

  /*
  const [deleteWidgetModalState, setDeleteWidgetModalState] = useState({
    open: false,
    widgetId: null,
  });
  const [addWidgetModalState, setAddWidgetModalState] = useState({
    open: false,
    groupId: null,
  });
*/
  //  const settings = useSelector(state => state.settings);
  //  const dispatch = useDispatch();

  //  const q = order.findIndex(obj => obj === id)
  //console.log('--------WidgetEditControls.js q',q,order.length);

  if (!isEditMode) return false;

  return (
    <div className={classes.wrapper}>
      <Grid container justify="center">
        <Grid item style={{ whiteSpace: 'nowrap' }}>
          <Tooltip title={id}>
            <IconButton
              className={classes.iconButton}
              onMouseDown={e => {
                e.stopPropagation();
              }}
              onClick={e => {
                props.setEditWidgetModalState({
                  open: true,
                  widgetId: id,
                  groupNames: groupNames,
                  groupId: groupId,
                  widgetType: widgetType,
                });
              }}
            >
              <EditIcon
                fontSize="small"
                style={{ color: theme.palette.yellow }}
              />
            </IconButton>
          </Tooltip>

          <Tooltip title={msg.widgetEdit.delete}>
            <IconButton
              className={classes.iconButton}
              onMouseDown={e => {
                e.stopPropagation();
              }}
              onClick={e => {
                props.setDeleteWidgetModalState({
                  open: true,
                  widgetId: id,
                  groupId: groupId,
                });
              }}
            >
              <DeleteIcon
                fontSize="small"
                style={{ color: theme.palette.yellow }}
              />
            </IconButton>
          </Tooltip>

          <Tooltip title={msg.widgetEdit.add}>
            <IconButton
              className={classes.iconButton}
              onMouseDown={e => {
                e.stopPropagation();
              }}
              onClick={e => {
                props.setAddWidgetModalState({
                  open: true,
                  groupId: groupId,
                  widgetIdClicked: id,
                });
              }}
            >
              <AddIcon
                fontSize="small"
                style={{ color: theme.palette.yellow }}
              />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid item style={{ whiteSpace: 'nowrap' }}>
          {order.findIndex(obj => obj === id) > 0 && (
            <Tooltip title={msg.widgetEdit.back}>
              <IconButton
                className={classes.iconButton}
                onMouseDown={e => {
                  e.stopPropagation();
                }}
                onClick={e => {
                  handleMove({
                    dir: 'backward',
                    groupId: groupId,
                    widgetId: id,
                  });
                }}
              >
                <ArrowBackIcon
                  fontSize="small"
                  style={{ color: theme.palette.yellow }}
                />
              </IconButton>
            </Tooltip>
          )}

          {order.findIndex(obj => obj === id) !== order.length - 1 && (
            <Tooltip title={msg.widgetEdit.forward}>
              <IconButton
                className={classes.iconButton}
                onMouseDown={e => {
                  e.stopPropagation();
                }}
                onClick={e => {
                  handleMove({
                    dir: 'forward',
                    groupId: groupId,
                    widgetId: id,
                  });
                }}
              >
                <ArrowForwardIcon
                  fontSize="small"
                  style={{ color: theme.palette.yellow }}
                />
              </IconButton>
            </Tooltip>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default React.memo(WidgetEditControls);
