import React, { useReducer, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import CommonModal from '../components/CommonModal';

import CustomInput from '../components/CustomInput';
import CustomSelect from '../components/CustomSelect';
import CustomSwitch from '../components/CustomSwitch';

import {
  useApolloClient,
  useMutation,
  useQuery,
  useLazyQuery,
} from '@apollo/client';

import { setContext } from '../actions';

import { DELETE_OBJECT_MUTATION } from '../queries';

import { msg } from '../messages';

import { ReactComponent as ImgUpload } from '../assets/upload.svg';

const styles = theme => ({
  imgUpload: {
    width: '100%',
  },
});

const DeleteWidgetModal = props => {
  const { modalState, setModalState, handleDeleteWidget } = props;

  //  console.log('DeleteWidgetModal props', modalState);

  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const useStyles = makeStyles(theme => styles(theme));
  const classes = useStyles();

  const handleClose = () => setModalState({ open: false });

  return (
    <>
      <CommonModal
        modalOpen={modalState.open}
        title={msg.deleteWidgetModal.deleteWidget}
        forceTitle={true}
        contentStyles={{
          padding: '14px 16px 16px 14px',
        }}
        setModalOpen={handleClose}
        buttons={[
          { title: msg.deleteWidgetModal.buttonCancel, cb: handleClose },
          {
            title: msg.deleteWidgetModal.buttonDelete,
            cb: () => {
              handleDeleteWidget({
                widgetId: modalState.widgetId,
                groupId: modalState.groupId,
              });
              setModalState({ open: false });
            },
          },
        ]}
      >
        <Grid container direction="column" spacing={2}>
          <Grid container item justify="center">
            {msg.deleteWidgetModal.text}
          </Grid>
        </Grid>
      </CommonModal>
    </>
  );
};

export default React.memo(DeleteWidgetModal);
