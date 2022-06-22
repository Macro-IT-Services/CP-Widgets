import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import useColors from '../utils/useColors';
import WidgetEditControls from './WidgetEditControls';

import { highlightSelectedStyle } from '../constants';

const W_Title = props => {
  const {
    //    wide = true,
    //size,
    //    title,
    //    colors = [],
    //    id,
    //    groupId,
    objectProperties,
    selected,
  } = props;

  const getPropValue = prop =>
    objectProperties.find(obj => obj.key === prop)?.value;

  //  const valueInitial = objectProperties.find(obj => obj.key === "valueValue")?.value;
  //  const mode = objectProperties.find(obj => obj.key === "settingsFormat")?.value || 'icon_value';
  const size = getPropValue('settingsSize');
  const wide = getPropValue('settingsFullLine');
  const newLine = getPropValue('settingsNewLine');
  const value = getPropValue('valueText');
  //  const simulation = objectProperties.find(obj => obj.key === "settingsSimulation")?.value;
  const colors = [getPropValue('settingsStyle'), null]; // [colorScheme = 'darkOnLight', colorReplace = null]
  const [fgColor, bgColor] = useColors(colors);

  //  const theme = useTheme();
  let total_px = 0,
    font_px = 0;

  switch (size) {
    case 'small':
      total_px = '48';
      font_px = '20';
      break;
    case 'medium':
      total_px = '96';
      font_px = '45';
      break;
    case 'large':
      total_px = '192';
      font_px = '90';
      break;
    default:
      console.log('unknown size:', size);
  } //switch

  return (
    <>
      <div
        style={{
          margin: '2px',
          display: 'flex',
          flexBasis: wide ? '100%' : 'auto',
          flexGrow: 1,
          position: 'relative',
          height: `${total_px}px`,
          //        minWidth: `${total_px}px`,
          backgroundColor: bgColor,
          //        border: '1px dashed yellow',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          filter: selected ? highlightSelectedStyle : '',
          borderRadius: '2px',
        }}
      >
        <Typography
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: `${font_px}px`,
            color: fgColor,
          }}
        >
          {value}
        </Typography>
        <WidgetEditControls {...props} />
      </div>
      {newLine && (
        <div
          style={{
            flexBasis: '100%',
            height: '0px',
          }}
        />
      )}
    </>
  );
};

export default W_Title;
