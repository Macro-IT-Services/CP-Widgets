import React, { useState, useRef, useCallback, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Link from '@material-ui/core/Link';

import { ReactComponent as ImgLogo } from '../assets/logo_vert.svg';
import { ReactComponent as ImgLogoDark } from '../assets/logo_vert_dark.svg';

import { msg } from '../messages';

const useStyles = makeStyles(theme => ({}));

const Error404 = React.memo(props => {
  const classes = useStyles();
  //  const theme = useTheme();
  const colorTheme = useSelector(state => state.settings.theme);
  //console.log(colorTheme)
  const lang = useSelector(state => state.settings.lang);

  return (
    <Grid container style={{ minHeight: '100vh' }}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ margin: 'auto' }}
      >
        <Grid item>
          <Link href={`${process.env.PUBLIC_URL}/${lang}`}>
            {colorTheme === 'dark' && <ImgLogoDark className={classes.logo} />}
            {colorTheme === 'light' && <ImgLogo className={classes.logo} />}
          </Link>
        </Grid>
        <Grid item style={{ textAlign: 'center' }}>
          <Typography variant="h4" style={{ marginTop: '20px' }}>
            {msg.error404.pageNotFound}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
});

export default Error404;
