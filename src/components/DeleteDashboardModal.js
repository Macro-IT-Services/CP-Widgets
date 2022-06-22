import React, { useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import CommonModal from '../components/CommonModal';

import { msg } from '../messages';

const DeleteDashboardModal = props => {
  const { modalState, setModalState, handleDeleteDashboard } = props;

  //  console.log('DeleteDashboardModal props', modalState);

  const theme = useTheme();

  const handleClose = () => setModalState({ open: false });

  return (
    <>
      <CommonModal
        modalOpen={modalState.open}
        title={msg.deleteDashboardModal.deleteDashboard}
        forceTitle={true}
        contentStyles={{
          padding: '14px 16px 16px 14px',
        }}
        setModalOpen={handleClose}
        buttons={[
          { title: msg.deleteDashboardModal.buttonCancel, cb: handleClose },
          {
            title: msg.deleteDashboardModal.buttonDelete,
            cb: () => {
              handleDeleteDashboard({
                dashboardId: modalState.dashboardId,
              });

              setModalState({ open: false });
            },
          },
        ]}
      >
        <Grid container direction="column" spacing={2}>
          <Grid container item justify="center">
            {msg.deleteDashboardModal.text}
          </Grid>
        </Grid>
      </CommonModal>
    </>
  );
};

export default React.memo(DeleteDashboardModal);
