import React from 'react';
import { useTheme } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';

const Subtitle = props => {
  const theme = useTheme();
  return (
    <Typography variant="subtitle1" style={{ color: theme.palette.blue }}>
      {props.children}
    </Typography>
  );
};

export default Subtitle;
