import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { ReactComponent as ImgCar } from '../assets/car.svg';
import Slider from '@material-ui/core/Slider';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';

import useColors from '../utils/useColors';
import WidgetEditControls from './WidgetEditControls';

import { highlightSelectedStyle } from '../constants';

const CustomSliderThin = withStyles(theme => ({
  root: {
    color: props => props.customcolor || null,
    //theme.palette.wWhite,
    marginLeft: '8px',
    marginRight: '8px',
  },

  thumb: {
    height: 12,
    width: 12,
    backgroundColor: props => props.customcolor || null,
    //theme.palette.wWhite,
    border: '2px solid currentColor',
    marginTop: -4,
    marginLeft: -4,
  },

  track: {
    height: 4,
    borderRadius: 2,
  },
  rail: {
    height: 4,
    borderRadius: 2,
  },
  active: {},
}))(Slider);

//
const CustomSliderThick = withStyles(theme => ({
  root: {
    color: props => props.customcolor || null,
    //    color: theme.palette.wWhite,
    marginLeft: '8px',
    marginRight: '8px',
  },

  thumb: {
    height: 16,
    width: 16,
    backgroundColor: props => props.customcolor || null,
    //    backgroundColor: theme.palette.wWhite,
    border: '2px solid currentColor',
    marginTop: -4,
    marginLeft: -4,
  },

  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
  active: {},
}))(Slider);

const W_Slider = props => {
  const {
    //    size,
    //    wide,
    text = true,
    //    colors = [],
    id,
    groupId,
    objectProperties,
    selected,
  } = props;

  const getPropValue = prop =>
    objectProperties.find(obj => obj.key === prop)?.value;

  const size = getPropValue('settingsSize');

  //  const valueInitial = objectProperties.find(obj => obj.key === "valueValue")?.value;
  //  const mode = objectProperties.find(obj => obj.key === "settingsFormat")?.value || 'icon_value';
  const wide = objectProperties.find(obj => obj.key === 'settingsFullLine')
    ?.value;
  //  const simulation = objectProperties.find(obj => obj.key === "settingsSimulation")?.value;
  const colors = [getPropValue('settingsStyle'), null]; // [colorScheme = 'darkOnLight', colorReplace = null]
  const [fgColor, bgColor] = useColors(colors);

  const minValue = parseInt(getPropValue('settingsMinValue'));
  const maxValue = parseInt(getPropValue('settingsMaxValue'));

  //console.log('props',props)
  const isEditMode = useSelector(state => state.settings.isEditMode);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let total_px = 0,
    font_px = 0;

  switch (size) {
    case 'small':
      total_px = '96';
      font_px = '20';
      break;
    case 'medium':
      total_px = '192';
      font_px = '45';
      break;
    case 'large':
      total_px = '384';
      font_px = '90';
      break;
    default:
      console.log('unknown size:', size);
  } //switch

  //  console.log('===',format(new Date(), 'HH:MM EEEE',{locale: enGB}) )
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexBasis: wide ? '100%' : 'auto',
        flexGrow: 1,
        position: 'relative',
        height: `${total_px}px`, //size === 'big' ? '192px' : '96px',
        //        minWidth: `${total_px}px`, //size === 'big' ? '192px' : '96px',
        backgroundColor: bgColor, //theme.palette.wBlue,
        //        border: '1px dashed yellow',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: isEditMode ? 'none' : 'auto',
        filter: selected ? highlightSelectedStyle : '',
        borderRadius: '2px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexGrow: 1,
          width: '80%',
          paddingLeft: '10px',
          paddingRight: '10px',

          paddingTop: `${Math.floor(total_px / 10)}px`,
          //paddingTop: '5%',
        }}
      >
        {size === 'small' && (
          <CustomSliderThin
            value={value}
            defaultValue={0}
            min={minValue}
            max={maxValue}
            onChange={handleChange}
            aria-labelledby="slider"
            customcolor={fgColor}
          />
        )}
        {size === 'medium' && (
          <CustomSliderThick
            value={value}
            defaultValue={0}
            min={minValue}
            max={maxValue}
            onChange={handleChange}
            aria-labelledby="slider"
            customcolor={fgColor}
          />
        )}
      </div>
      {text && (
        <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography
            style={{
              fontSize: `${font_px}px`, //size === 'big' ? '45px' : '20px',
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

export default W_Slider;
// style={{ height: 'auto', width: '50px' }}
// className={classnames(classes.root,classes.thumb,classes.track,classes.rail,classes.active)}
