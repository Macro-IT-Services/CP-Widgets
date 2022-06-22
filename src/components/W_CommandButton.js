import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
//import { ReactComponent as ImgCommand1 } from '../assets/command1.svg';
//import { ReactComponent as ImgCommand2 } from '../assets/command2.svg';
import Fab from '@material-ui/core/Fab';
import ForwardIcon from '@material-ui/icons/Forward';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';

import { highlightSelectedStyle } from '../constants';

import useColors from '../utils/useColors';
import WidgetEditControls from './WidgetEditControls';

const W_CommandButton = props => {
  const {
    size,
    //    wide,
    //    value = 'VALUE',
    //    mode = 'icon_value',
    //    colors = [],
    id,
    groupId,
    objectProperties,
    selected,
  } = props;

  const theme = useTheme();
  //console.log('props',props)

  const getPropValue = prop =>
    objectProperties.find(obj => obj.key === prop)?.value;

  const value =
    objectProperties.find(obj => obj.key === 'valueValue')?.value || 'VALUE';
  const mode =
    objectProperties.find(obj => obj.key === 'settingsFormat')?.value ||
    'icon_value';
  const wide = objectProperties.find(obj => obj.key === 'settingsFullLine')
    ?.value;
  //  const simulation = objectProperties.find(obj => obj.key === "settingsSimulation")?.value;

  const colors = [getPropValue('settingsStyle'), null]; // [colorScheme = 'darkOnLight', colorReplace = null]
  const [fgColor, bgColor] = useColors(colors);

  const isEditMode = useSelector(state => state.settings.isEditMode);

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
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: isEditMode ? 'none' : 'auto',
        filter: selected ? highlightSelectedStyle : '',
        borderRadius: '2px',
      }}
    >
      {mode !== 'value' && (
        <div
          style={{
            display: 'flex',
            flexGrow: 1,
            alignItems: !(mode === 'icon_value') ? 'center' : 'flex-end',
          }}
        >
          {size === 'small' && (
            <Fab
              size="large"
              aria-label="command"
              style={{
                boxShadow: 'none',
                width: '45px',
                height: '45px',
                backgroundColor: fgColor,
              }}
              onClick={() => {
                console.log('COMMAND CLICK!');
              }}
            >
              <ForwardIcon
                style={{
                  color: bgColor,
                  width: '35px',
                  height: '35px',
                }}
              />
            </Fab>
          )}

          {size === 'big' && (
            <Fab
              size="large"
              aria-label="command"
              style={{
                boxShadow: 'none',
                width: '90px',
                height: '90px',
                backgroundColor: fgColor,
              }}
              onClick={() => {
                console.log('COMMAND CLICK!');
              }}
            >
              <ForwardIcon
                style={{
                  color: bgColor,
                  width: '70px',
                  height: '70px',
                }}
              />
            </Fab>
          )}
        </div>
      )}
      {mode !== 'icon' && (
        <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography
            style={{
              fontSize: size === 'big' ? '45px' : '20px',
              color: fgColor,
            }}
          >
            {value}
          </Typography>
        </div>
      )}
      <WidgetEditControls {...props} />
    </div>
  );
};

export default W_CommandButton;
