import React, { useReducer, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import CommonModal from '../components/CommonModal';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { version } from '../version.js';

import {
  useApolloClient,
  useMutation,
  useQuery,
  useLazyQuery,
} from '@apollo/client';

import { setContext } from '../actions';

import { GET_VERSION_QUERY } from '../queries';

import { msg } from '../messages';

import { ReactComponent as ImgUpload } from '../assets/upload.svg';

const TableCell = withStyles({
  root: {
    borderBottom: 'none',
  },
})(MuiTableCell);

const AboutModal = props => {
  const { modalOpen, setModalOpen } = props;

  //  console.log('AboutModal props', modalOpen);

  const theme = useTheme();
  const client = useApolloClient();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();

  const handleClose = () => setModalOpen(false);

  const { loading, error, data } = useQuery(GET_VERSION_QUERY, {
    variables: {},
  });

  if (loading) return <div>Loading version...</div>;
  if (error) return <div>Version query error!</div>;

  //  console.log('AboutModal.js/query data', data);
  return (
    <>
      <CommonModal
        modalOpen={modalOpen}
        title={msg.aboutModal.aboutProgram}
        forceTitle={true}
        contentStyles={{
          padding: '14px 16px 16px 14px',
        }}
        setModalOpen={handleClose}
        buttons={[{ title: msg.aboutModal.buttonOK, cb: handleClose }]}
      >
        <Grid container direction="column" spacing={2}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell align="left">
                  <Typography color="primary" variant="subtitle1">
                    {msg.aboutModal.application}
                  </Typography>
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>

              <TableRow>
                <TableCell align="left">
                  {msg.aboutModal.pixelAdminVer}
                </TableCell>
                <TableCell align="right">0.0.0-alpha</TableCell>
              </TableRow>

              <TableRow>
                <TableCell align="left">
                  {msg.aboutModal.pixelCoreVer}
                </TableCell>
                <TableCell align="right">{data.getVersion.short}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell align="left">
                  {msg.aboutModal.pixelFrontVer}
                </TableCell>
                <TableCell align="right">{version}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell align="left">
                  <Typography color="primary" variant="subtitle1">
                    {msg.aboutModal.aboutUs}
                  </Typography>
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>

              <TableRow>
                <TableCell align="left">PIXEL NETWORKS LIMITED</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>

              <TableRow>
                <TableCell align="left">
                  <Link href="https://pixel-networks.com">
                    https://pixel-networks.com
                  </Link>
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Grid container item justify="center"></Grid>
        </Grid>
      </CommonModal>
    </>
  );
};

export default AboutModal;
