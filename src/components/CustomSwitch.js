import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import { msg } from '../messages';

// <CustomSwitch name="compactMode" label={msg.addDashboardModal.compactMode} value={values.compactMode} onChange={handleInputChange} />

const styles = theme => ({});

const useStyles = makeStyles(theme => styles(theme));

const CustomSwitch = props => {
  const classes = useStyles();

  return (
    <>
      <InputLabel htmlFor={`${props.name}-label`} style={{ display: 'inline' }}>
        {props.label}
      </InputLabel>
      <Switch
        name={props.name}
        id={`${props.name}-label`}
        value={props.value === 'true' ? 'on' : ''}
        checked={Boolean(props.value)}
        onChange={props.onChange}
        color="primary"
      />
    </>
  );
};

export default CustomSwitch;
