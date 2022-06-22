import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import SvgIndicator from './SvgIndicator';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

import { highlightSelectedStyle } from '../constants';

import useColors from '../utils/useColors';
import WidgetEditControls from './WidgetEditControls';

const W_Counter = props => {
  const {
    size,
    //    wide,
    type,
    //    mode = 'icon_value',
    //    value: valueInitial,
    //    colors = [],
    id,
    groupId,
    //    simulation,
    objectProperties,
    selected,
  } = props;

  const theme = useTheme();
  //  console.log('props',props)

  const getPropValue = prop =>
    objectProperties.find(obj => obj.key === prop)?.value;

  const valueInitial = objectProperties.find(obj => obj.key === 'valueValue')
    ?.value;
  const mode =
    objectProperties.find(obj => obj.key === 'settingsFormat')?.value ||
    'icon_value';
  const wide = objectProperties.find(obj => obj.key === 'settingsFullLine')
    ?.value;
  const simulation = objectProperties.find(
    obj => obj.key === 'settingsSimulation'
  )?.value;
  const colors = [getPropValue('settingsStyle'), null]; // [colorScheme = 'darkOnLight', colorReplace = null]
  const [fgColor, bgColor] = useColors(colors);

  const [value, setValue] = useState(valueInitial);

  const simData = useSelector(state => state.settings.simData);

  //const value = _.random(0, 100);

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
        //        border: '1px dashed yellow',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        filter: selected ? highlightSelectedStyle : '',
        borderRadius: '2px',
      }}
    >
      {mode !== 'value' && (
        <div
          style={{
            display: 'flex',
            alignItems: !(mode === 'icon_value') ? 'center' : 'flex-end',
            flexGrow: 1,
          }}
        >
          {mode === 'icon_value' && (
            <SvgIndicator
              value={simulation ? _.random(0, 100) : value}
              type={type}
              color={fgColor}
              style={{
                height: size === 'big' ? '90px' : '45px',
                width: 'auto',
              }}
            />
          )}
          {mode === 'icon' && (
            <SvgIndicator
              value={simulation ? _.random(0, 100) : value}
              type={type}
              color={fgColor}
              style={{
                height: size === 'big' ? '130px' : '70px',
                width: 'auto',
              }}
            />
          )}
        </div>
      )}
      {mode !== 'icon' && (
        <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {mode === 'icon_value' && (
            <Typography
              style={{
                fontSize: size === 'big' ? '36px' : '16px',
                color: fgColor,
              }}
            >
              {simulation ? _.random(0, 100) : value}
            </Typography>
          )}
          {mode === 'value' && (
            <Typography
              style={{
                fontSize: size === 'big' ? '48px' : '24px',
                color: fgColor,
              }}
            >
              {simulation ? _.random(0, 100) : value}
            </Typography>
          )}
        </div>
      )}
      <WidgetEditControls {...props} />
    </div>
  );
};

export default W_Counter;
