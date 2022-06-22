import SvgCurve from './SvgCurve';
import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import useColors from '../utils/useColors';
import WidgetEditControls from './WidgetEditControls';

import { highlightSelectedStyle } from '../constants';

const W_Vibration = props => {
  const {
    size,
    //    wide,
    //    mode,
    //    colors = [],
    id,
    groupId,
    objectProperties,
    selected,
  } = props;

  const getPropValue = prop =>
    objectProperties.find(obj => obj.key === prop)?.value;

  //  const valueInitial = objectProperties.find(obj => obj.key === "valueValue")?.value;
  const mode = objectProperties.find(obj => obj.key === 'settingsFormat')
    ?.value;
  const wide = objectProperties.find(obj => obj.key === 'settingsFullLine')
    ?.value;
  //  const simulation = objectProperties.find(obj => obj.key === "settingsSimulation")?.value;
  const colors = [getPropValue('settingsStyle'), null]; // [colorScheme = 'darkOnLight', colorReplace = null]
  const [fgColor, bgColor] = useColors(colors);

  const theme = useTheme();

  const simData = useSelector(state => state.settings.simData);

  const rndRange = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const rnd = () => rndRange(0, 30);
  /*
  const randomData = () => [
    [0, 0],
    [10, 15],
    [20, 30],
    [30, 5],
    [40, 10],
    [50, 20],
    [60, 30],
    [70, 10],
    [80, 20],
    [90, 30],
  ]
  */

  const randomData = () => [
    [0, rnd()],
    [10, rnd()],
    [20, rnd()],
    [30, rnd()],
    [40, rnd()],
    [50, rnd()],
    [60, rnd()],
    [70, rnd()],
    [80, rnd()],
    [90, rnd()],
  ];

  return (
    <>
      {/* BIG - 192px */}

      {size === 'big' && (
        <div
          style={{
            display: 'flex',
            flexBasis: wide ? '100%' : 'auto',
            flexGrow: 1,
            position: 'relative',
            height: '192px',
            backgroundColor: bgColor,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '192px',
            filter: selected ? highlightSelectedStyle : '',
            borderRadius: '2px',
          }}
        >
          {mode !== 'value' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingTop: '20px',
                flexGrow: 1,
              }}
            >
              <SvgCurve
                smoothing={0.2}
                {...(wide ? { stroke: 6 } : { stroke: 6 })}
                color={fgColor}
                points={randomData()}
                style={{
                  height: '50px',
                  width: '130px',
                  paddingLeft: '5px',
                  paddingRight: '5px',
                }}
              />
            </div>
          )}
          {mode !== 'icon' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center', //flex-end
                paddingBottom: '5px',
                fontSize: '45px',
                fontFamily: 'Roboto-Regular',
                color: fgColor,
                flexGrow: 1,
              }}
            >
              {rndRange(1, 10) / 2}
            </div>
          )}
          <WidgetEditControls widgetId={id} groupId={groupId} />
        </div>
      )}

      {/* SMALL - 96px */}

      {size === 'small' && (
        <div
          style={{
            display: 'flex',
            flexBasis: wide ? '100%' : 'auto',
            flexGrow: 1,
            position: 'relative',
            height: '96px',
            backgroundColor: bgColor,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '96px',
            filter: selected ? highlightSelectedStyle : '',
            borderRadius: '2px',
          }}
        >
          {mode !== 'value' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '10px',
                flexGrow: 1,
                //            border: '1px solid yellow',
              }}
            >
              <SvgCurve
                smoothing={0.2}
                {...(wide ? { stroke: 5 } : { stroke: 5 })}
                color={fgColor}
                points={randomData()}
                style={{
                  height: '40px',
                  width: '110px',
                  paddingLeft: '5px',
                  paddingRight: '5px',
                }}
              />
            </div>
          )}
          {mode !== 'icon' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingBottom: '3px',
                fontSize: '20px',
                fontFamily: 'Roboto-Regular',
                color: fgColor,
                flexGrow: 1,
                //          border: '1px solid yellow',
              }}
            >
              {rndRange(1, 10) / 2}
            </div>
          )}
          <WidgetEditControls widgetId={id} groupId={groupId} />
        </div>
      )}

      {/* TINY - 48px */}

      {size === 'tiny' && (
        <div
          style={{
            display: 'flex',
            flexBasis: wide ? '100%' : 'auto',
            flexGrow: 1,
            position: 'relative',
            height: '48px',
            backgroundColor: bgColor,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '48px',
            filter: selected ? highlightSelectedStyle : '',
            borderRadius: '2px',
          }}
        >
          {mode !== 'value' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '5px',
                flexGrow: 1,
                //            border: '1px solid yellow',
              }}
            >
              <SvgCurve
                smoothing={0.2}
                {...(wide ? { stroke: 5 } : { stroke: 5 })}
                color={fgColor}
                points={randomData()}
                style={{
                  height: '20px',
                  width: '55px',
                  //            border: '1px solid green',
                  paddingLeft: '5px',
                  paddingRight: '5px',
                }}
              />
            </div>
          )}
          {mode !== 'icon' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingBottom: '2px',
                fontSize: '14px',
                fontFamily: 'Roboto-Regular',
                color: { fgColor },
                flexGrow: 1,
                //          border: '1px solid yellow',
              }}
            >
              {rndRange(1, 10) / 2}
            </div>
          )}
          <WidgetEditControls {...props} />
        </div>
      )}
    </>
  );
};

export default W_Vibration;
