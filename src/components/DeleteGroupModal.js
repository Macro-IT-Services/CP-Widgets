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

import { msg } from '../messages';

import { ReactComponent as ImgUpload } from '../assets/upload.svg';

const styles = theme => ({
  imgUpload: {
    width: '100%',
  },
});

const DeleteGroupModal = props => {
  const { modalState, setModalState, handleDeleteGroup } = props;

  //  console.log('DeleteGroupModal props', modalState);

  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const useStyles = makeStyles(theme => styles(theme));
  const classes = useStyles();

  const dispatch = useDispatch();

  //    const groupId = 'xxx'; //TODO: remove

  const handleClose = () => setModalState({ open: false });

  return (
    <>
      <CommonModal
        modalOpen={modalState.open}
        title={msg.deleteGroupModal.deleteGroup}
        forceTitle={true}
        contentStyles={{
          padding: '14px 16px 16px 14px',
        }}
        setModalOpen={handleClose}
        buttons={[
          { title: msg.deleteGroupModal.buttonCancel, cb: handleClose },
          {
            title: msg.deleteGroupModal.buttonDelete,
            cb: () => {
              handleDeleteGroup(modalState.groupId);
              setModalState({ open: false });
            },
          },
        ]}
      >
        <Grid container direction="column" spacing={2}>
          <Grid container item justify="center">
            {msg.deleteGroupModal.text}
          </Grid>
        </Grid>
      </CommonModal>
    </>
  );
};

export default React.memo(DeleteGroupModal);
