import React, { useState, useRef, useCallback, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({}));

const Spinner = React.memo(props => {
  const classes = useStyles();
  //  const theme = useTheme();

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      style={{ margin: 'auto', minHeight: '100vh' }}
    >
      <CircularProgress size={80} />
    </Grid>
  );
});

export default Spinner;
