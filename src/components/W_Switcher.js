import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { ReactComponent as ImgCar } from '../assets/car.svg';
import Switch from '@material-ui/core/Switch';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';

import useColors from '../utils/useColors';
import WidgetEditControls from './WidgetEditControls';

import { highlightSelectedStyle } from '../constants';

const CustomSwitchSmall = withStyles(theme => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.wWhite,
      //theme.palette.wWhite,
      '& + $track': {
        backgroundColor: theme.palette.wOrange,
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      border: `6px solid ${theme.palette.wWhite}`,
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey}`,
    backgroundColor: props => props.customcolor || null,
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const CustomSwitchTiny = withStyles(theme => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
  },
  switchBase: {
    padding: 2,
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.wWhite,
      '& + $track': {
        backgroundColor: theme.palette.wOrange,
        opacity: 1,
        border: 'none',
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
  },
  track: {
    borderRadius: 16 / 2,
    border: `1px solid ${theme.palette.grey}`,
    backgroundColor: props => props.customcolor || null,
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const CustomSwitchHuge = withStyles(theme => ({
  root: {
    width: 120,
    height: 46,
    padding: 0,
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(74px)',
      color: theme.palette.wWhite,
      '& + $track': {
        backgroundColor: theme.palette.wOrange,
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      border: `6px solid ${theme.palette.wWhite}`,
    },
  },
  thumb: {
    width: 44,
    height: 44,
  },
  track: {
    borderRadius: 46 / 2,
    border: `1px solid ${theme.palette.grey}`,
    backgroundColor: props => props.customcolor || null,
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const CustomSwitchBig = withStyles(theme => ({
  root: {
    width: 100,
    height: 36,
    padding: 0,
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(64px)',
      color: theme.palette.wWhite,
      '& + $track': {
        backgroundColor: theme.palette.wOrange,
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      border: `6px solid ${theme.palette.wWhite}`,
    },
  },
  thumb: {
    width: 34,
    height: 34,
  },
  track: {
    borderRadius: 36 / 2,
    border: `1px solid ${theme.palette.grey}`,
    backgroundColor: props => props.customcolor || null,
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const W_Switcher = props => {
  const {
    size,
    //    wide,
    //    mode = 'icon_value',
    //    colors = [],
    id,
    groupId,
    objectProperties,
    selected,
  } = props;

  const getPropValue = prop =>
    objectProperties.find(obj => obj.key === prop)?.value;

  //  const valueInitial = objectProperties.find(obj => obj.key === "valueValue")?.value;
  const mode =
    objectProperties.find(obj => obj.key === 'settingsFormat')?.value ||
    'icon_value';
  const wide = objectProperties.find(obj => obj.key === 'settingsFullLine')
    ?.value;
  //  const simulation = objectProperties.find(obj => obj.key === "settingsSimulation")?.value;
  const colors = [getPropValue('settingsStyle'), null]; // [colorScheme = 'darkOnLight', colorReplace = null]
  const [fgColor, bgColor] = useColors(colors);

  const theme = useTheme();
  //console.log('props',props)

  const isEditMode = useSelector(state => state.settings.isEditMode);

  const [value, setValue] = React.useState(false);

  const handleChange = event => {
    setValue(event.target.checked);
  };

  //  console.log('===',format(new Date(), 'HH:MM EEEE',{locale: enGB}) )
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexBasis: wide ? '100%' : 'auto',
        flexGrow: 1,
        position: 'relative',
        height: size === 'big' ? '192px' : '96px',
        minWidth: size === 'big' ? '192px' : '96px',
        backgroundColor: bgColor,
        //theme.palette.wBlue,
        //        border: '1px dashed yellow',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: isEditMode ? 'none' : 'auto',
        filter: selected ? highlightSelectedStyle : '',
        borderRadius: '2px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        {mode === 'icon' && size === 'small' && (
          <CustomSwitchSmall
            checked={value}
            onChange={handleChange}
            aria-labelledby="switcher"
            customcolor={fgColor}
          />
        )}
        {mode === 'icon' && size === 'big' && (
          <CustomSwitchHuge
            checked={value}
            onChange={handleChange}
            aria-labelledby="switcher"
            customcolor={fgColor}
          />
        )}
        {mode === 'icon_value' && size === 'small' && (
          <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
            <CustomSwitchTiny
              checked={value}
              onChange={handleChange}
              aria-labelledby="switcher"
              customcolor={fgColor}
            />
          </div>
        )}
        {mode === 'icon_value' && size === 'big' && (
          <CustomSwitchBig
            checked={value}
            onChange={handleChange}
            aria-labelledby="switcher"
            customcolor={fgColor}
          />
        )}
      </div>
      {mode !== 'icon' && (
        <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography
            style={{
              fontSize: size === 'big' ? '45px' : '20px',
              color: fgColor,
            }}
          >
            {value ? 'ON' : 'OFF'}
          </Typography>
        </div>
      )}
      <WidgetEditControls {...props} />
    </div>
  );
};

export default W_Switcher;
