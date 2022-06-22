import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

import { highlightSelectedStyle } from '../constants';

import { format } from 'date-fns';
//import { enGB, eo, ru, enUS } from 'date-fns/locale';

import useColors from '../utils/useColors';
import WidgetEditControls from './WidgetEditControls';

const W_DateTime = props => {
  const {
    //    wide = false,
    //    type = 'time_date',
    //    colors = [],
    id,
    groupId,
    objectProperties,
    selected,
  } = props;

  //console.log('W_DateTime props', props)

  const getPropValue = prop =>
    objectProperties.find(obj => obj.key === prop)?.value;

  //  const valueInitial = objectProperties.find(obj => obj.key === "valueValue")?.value;
  //  const mode = objectProperties.find(obj => obj.key === "settingsFormat")?.value || 'icon_text';
  const size = getPropValue('settingsSize');
  const wide = objectProperties.find(obj => obj.key === 'settingsFullLine')
    ?.value;
  const newLine = getPropValue('settingsNewLine');
  const type = getPropValue('settingsFormat');
  //  const simulation = objectProperties.find(obj => obj.key === "settingsSimulation")?.value;
  const colors = [getPropValue('settingsStyle'), null]; // [colorScheme = 'darkOnLight', colorReplace = null]
  const [fgColor, bgColor] = useColors(colors);

  //console.log('props',props)
  const datetime = useSelector(state => state.settings.datetime);

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

  //  console.log('FORMAT,',type,size )
  //  console.log('===',format(datetime, 'HH:mm EEEE') )
  //const type'date'; // time, time_date, date_day, time_date_day, date

  return (
    <>
      <div
        style={{
          margin: '2px',
          display: 'flex',
          flexBasis: wide ? '100%' : 'auto',
          flexGrow: 1,
          position: 'relative',
          height: `${total_px}px`, //size === 'big' ? '96px' : '48px',
          backgroundColor: bgColor,
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          fontFamily: 'Roboto-Regular',
          filter: selected ? highlightSelectedStyle : '',
          borderRadius: '2px',
        }}
      >
        {/* medium */}

        {type === 'time' && size === 'medium' && (
          <div
            style={{
              fontSize: '48px',
              whiteSpace: 'nowrap',
              minWidth: '192px',
              textAlign: 'center',
              color: fgColor,
            }}
          >
            {format(datetime, 'HH:mm')}
          </div>
        )}

        {type === 'date_time' && size === 'medium' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '10px',
              marginBottom: '0px',
              lineHeight: '40px',
              minWidth: '192px',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                color: fgColor,
              }}
            >
              {format(datetime, 'HH:mm')}
            </div>
            <div
              style={{
                fontSize: '20px',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                color: fgColor,
              }}
            >
              {format(datetime, 'dd-MM-yyyy')}
            </div>
          </div>
        )}

        {type === 'date_day' && size === 'medium' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '0px',
              marginBottom: '0px',
              lineHeight: '40px',
              minWidth: '192px',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                color: fgColor,
              }}
            >
              {format(datetime, 'EEEE')}
            </div>
            <div
              style={{
                fontSize: '24px',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                color: fgColor,
              }}
            >
              {format(datetime, 'dd-MM-yyyy')}
            </div>
          </div>
        )}

        {type === 'date_time_day' && size === 'medium' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '3px',
              marginBottom: '5px',
              minWidth: '288px',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                marginRight: '25px',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                color: fgColor,
              }}
            >
              {format(datetime, 'HH:mm')}
            </div>
            <div
              style={{
                fontSize: '20px',
                lineHeight: '23px',
                whiteSpace: 'nowrap',
                color: fgColor,
              }}
            >
              {format(datetime, 'EEEE')}
              <br />
              {format(datetime, 'dd-MM-yyyy')}
            </div>
          </div>
        )}

        {type === 'date' && size === 'medium' && (
          <div
            style={{
              fontSize: '24px',
              whiteSpace: 'nowrap',
              minWidth: '192px',
              textAlign: 'center',
              color: fgColor,
            }}
          >
            {format(datetime, 'dd-MM-yyyy')}
          </div>
        )}

        {/* small */}

        {type === 'time' && size === 'small' && (
          <div
            style={{
              fontSize: '20px',
              whiteSpace: 'nowrap',
              minWidth: '96px',
              textAlign: 'center',
              color: fgColor,
            }}
          >
            {format(datetime, 'HH:mm')}
          </div>
        )}

        {type === 'date_time' && size === 'small' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '0px',
              marginBottom: '0px',
              lineHeight: '20px',
              minWidth: '96px',
            }}
          >
            <div
              style={{
                fontSize: '20px',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                color: fgColor,
              }}
            >
              {format(datetime, 'HH:mm')}
            </div>
            <div
              style={{
                fontSize: '14px',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                color: fgColor,
              }}
            >
              {format(datetime, 'dd-MM-yyyy')}
            </div>
          </div>
        )}

        {type === 'date_day' && size === 'small' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '0px',
              marginBottom: '0px',
              lineHeight: '20px',
              minWidth: '96px',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                color: fgColor,
              }}
            >
              {format(datetime, 'EEEE')}
            </div>
            <div
              style={{
                fontSize: '14px',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                color: fgColor,
              }}
            >
              {format(datetime, 'dd-MM-yyyy')}
            </div>
          </div>
        )}

        {type === 'date_time_day' && size === 'small' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '3px',
              marginBottom: '5px',
              minWidth: '192px',
            }}
          >
            <div
              style={{
                fontSize: '20px',
                whiteSpace: 'nowrap',
                marginRight: '25px',
                textAlign: 'center',
                color: fgColor,
              }}
            >
              {format(datetime, 'HH:mm')}
            </div>
            <div
              style={{
                fontSize: '14px',
                whiteSpace: 'nowrap',
                lineHeight: '20px',
                whiteSpace: 'nowrap',
                color: fgColor,
              }}
            >
              {format(datetime, 'EEEE')}
              <br />
              {format(datetime, 'dd-MM-yyyy')}
            </div>
          </div>
        )}

        {type === 'date' && size === 'small' && (
          <div
            style={{
              fontSize: '20px',
              whiteSpace: 'nowrap',
              minWidth: '192px',
              textAlign: 'center',
              color: fgColor,
            }}
          >
            {format(datetime, 'dd-MM-yyyy')}
          </div>
        )}
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

export default W_DateTime;
