import * as React from 'react';
import { Zoom, useScrollTrigger } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',

    // desktops
    [theme.breakpoints.up('sm')]: {
      left: '335px',
      bottom: '15px',
    },

    // mobiles
    [theme.breakpoints.down('xs')]: {
      right: '25px',
      bottom: '90px',
    },

    zIndex: theme.zIndex.drawer + 1,
  },
}));

function TopButton(props) {
  const theme = useTheme();
  const classes = useStyles();
  //const trigger = useScrollTrigger({    disableHysteresis: true,    threshold: 100  });
  //const trigger = true;

  const handleClick = event => {
    //    const anchor = (event.target.ownerDocument || document).querySelector('#top');

    //  if (anchor) {
    //anchor.scrollIntoView({ behavior: 'auto', block: 'center' });
    props.topRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });

    //}
  };

  return (
    <Zoom in={props.in}>
      <div className={classes.root}>
        <Fab
          onClick={handleClick}
          style={{ backgroundColor: theme.palette.white }}
          size="small"
          aria-label="scroll back to top"
        >
          <KeyboardArrowUp />
        </Fab>
      </div>
    </Zoom>
  );
}

export default TopButton;
