import SvgCurve from './SvgCurve';
import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '@material-ui/core/styles';
import useColors from '../utils/useColors';
import WidgetEditControls from './WidgetEditControls';
import { Typography } from '@material-ui/core';

import ImgCat1 from '../assets/cat1.jpg';
import ImgCat2 from '../assets/cat2.jpg';
import ImgCat3 from '../assets/cat3.jpg';
import ImgCat4 from '../assets/cat4.jpg';
import ImgCat5 from '../assets/cat5.jpg';
import ImgCat6 from '../assets/cat6.jpg';

import { ReactComponent as ImgCar } from '../assets/car.svg';

import { highlightSelectedStyle } from '../constants';

const cats = [ImgCat1, ImgCat2, ImgCat3, ImgCat4, ImgCat5, ImgCat6];

const W_ImageBox = props => {
  const {
    //    format = 'filling',
    //    wide = false,
    //    size = 'small',
    src = 1,
    //    colors = [],
    id,
    groupId,
    objectProperties,
    selected,
  } = props;

  const getPropValue = prop =>
    objectProperties.find(obj => obj.key === prop)?.value;

  //  const valueInitial = objectProperties.find(obj => obj.key === "valueValue")?.value;
  //  const mode = objectProperties.find(obj => obj.key === "settingsFormat")?.value || 'icon_value';
  const wide =
    objectProperties.find(obj => obj.key === 'settingsFullLine')?.value ||
    false;
  //  const simulation = objectProperties.find(obj => obj.key === "settingsSimulation")?.value;
  const colors = [getPropValue('settingsStyle'), null]; // [colorScheme = 'darkOnLight', colorReplace = null]
  //console.log('W_ImageBox.js colors',colors);
  const format = getPropValue('settingsFormat'); // filling, savingscale

  const size = getPropValue('settingsSize'); // 48,96, ..
  const [fgColor, bgColor] = useColors(colors);
  //console.log('W_ImageBox.js fgColor, bgColor',fgColor, bgColor);
  const theme = useTheme();

  //  console.log('props', props);

  let px = 0;
  switch (size) {
    case 'small':
      px = '96';
      break;
    case 'medium':
      px = '192';
      break;
    case 'large':
      px = '384';
      break;
    default:
      console.log('unknown size:', size);
  } //switch

  //  console.log('format, px',format, px)

  return (
    <>
      {format === 'savingscale' && (
        <div
          style={{
            display: 'flex',
            flexBasis: wide ? '100%' : 'auto',
            flexGrow: 1,
            position: 'relative',
            height: `${px}px`,
            minWidth: `${px}px`,
            backgroundColor: bgColor,
            justifyContent: 'center',
            alignContent: 'center',
            filter: selected ? highlightSelectedStyle : '',
            borderRadius: '2px',
          }}
        >
          <div style={{ width: `${px}px`, height: 'auto' }}>
            <img
              src={cats[src]}
              style={{ width: '100%', pointerEvents: 'none' }}
            />
          </div>
          <WidgetEditControls {...props} />
        </div>
      )}

      {format === 'filling' && (
        <div
          style={{
            display: 'flex',
            flexBasis: wide ? '100%' : 'auto',
            flexGrow: 1,
            position: 'relative',
            height: `${px}px`,
            minWidth: `${px}px`,
            backgroundColor: bgColor,
            //        border: '1px dashed yellow',
            justifyContent: 'center',

            background: `url(${cats[src]})`,
            //            backgroundSize: '100%',
            backgroundSize: 'cover',
            filter: selected ? highlightSelectedStyle : '',
            borderRadius: '2px',
          }}
        >
          <div
            style={{
              //            border: '1px dashed yellow',
              display: 'flex',
              alignItems: 'flex-end',
              flexGrow: 1,
              width: `${px / 2}px`,
              //              height: 'auto',
              //width:'48px',
            }}
          ></div>

          {/*
          <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            flexGrow: 1,
          }}
        >
            <ImgCar
              style={{
                height: px,
                width: 'auto',
                color: fgColor,
              }}
            />
        </div>


        <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        
            <Typography
              style={{
                fontSize: size === 'big' ? '36px' : '16px',
                color: fgColor,
              }}
                    >
              0
            </Typography>
        </div>
            */}
          <WidgetEditControls {...props} />
        </div>
      )}
    </>
  );
};

export default W_ImageBox;
