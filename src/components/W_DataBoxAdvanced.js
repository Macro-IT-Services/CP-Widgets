import React, { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { ReactComponent as ImgThermo } from '../assets/w_icon_thermo.svg';
import SvgCurve from './SvgCurve';

import { useApolloClient } from '@apollo/client';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { highlightSelectedStyle } from '../constants';

import { GET_DATA_SUBSCRIPTION } from '../queries';

import useColors from '../utils/useColors';
import WidgetEditControls from './WidgetEditControls';

const W_DataBoxAdvanced = props => {
  const {
    size,
    //    wide,
    //    mode = 'icon_value_chart',
    //    value: valueInitial,
    title,
    //    colors = [],
    id,
    groupId,
    //    simulation,
    objectProperties,
    selected,
  } = props;
  //console.log('props', props);

  const client = useApolloClient();
  const getPropValue = prop =>
    objectProperties.find(obj => obj.key === prop)?.value;

  const valueInitial = objectProperties.find(obj => obj.key === 'valueValue')
    ?.value;
  const mode =
    objectProperties.find(obj => obj.key === 'settingsFormat')?.value ||
    'icon_value_chart';
  const wide = objectProperties.find(obj => obj.key === 'settingsFullLine')
    ?.value;
  const simulation = objectProperties.find(
    obj => obj.key === 'settingsSimulation'
  )?.value;
  const colors = [getPropValue('settingsStyle'), null]; // [colorScheme = 'darkOnLight', colorReplace = null]
  const [fgColor, bgColor] = useColors(colors);

  const simData = useSelector(state => state.settings.simData);

  const theme = useTheme();
  //console.log('props',props)

  const data = [];

  const randomData = () => [
    [0, _.random(0, 70)],
    [10, _.random(0, 70)],
    [20, _.random(0, 70)],
    [30, _.random(0, 70)],
    [40, _.random(0, 70)],
    [50, _.random(0, 70)],
    [60, _.random(0, 70)],
    [70, _.random(0, 70)],
    [80, _.random(0, 70)],
    [90, _.random(0, 70)],
    /*
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
    */
  ];

  let height, paddingLeft;

  if (mode === 'icon_value_chart' && size === 'small') height = '96px';
  if (mode === 'icon_value_chart' && size === 'big') height = '192px';
  if (mode === 'icon_value' && size === 'small') height = '48px';
  if (mode === 'icon_value' && size === 'big') height = '96px';

  if (wide && size === 'small') paddingLeft = '7px';
  if (wide && size === 'big') paddingLeft = '15px';

  const [value, setValue] = useState(valueInitial);

  useEffect(() => {
    const observer = client.subscribe({
      query: GET_DATA_SUBSCRIPTION,
      variables: { objId: id },
      // shouldResubscribe: true (default: false)
    });

    const subscription = observer.subscribe(({ data }) => {
      //      console.log('SUBSCRIBE received', data)
      console.log('W_Counter subscription new data:', id, data.Objects);
      if (data.Objects.relatedNode?.key === 'valueValue') {
        setValue(data.Objects.relatedNode?.value);
        console.log('valueValue', data.Objects.relatedNode?.value);
      } else {
        console.log(
          'key is not valueValue. Should we update other properties of widget here?'
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [id]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexBasis: wide ? '100%' : 'auto',
        flexGrow: 1,
        position: 'relative',
        height: height,
        minWidth: size === 'big' ? '192px' : '96px',
        backgroundColor: bgColor,
        justifyContent: 'center',
        alignItems: wide ? 'flex-start' : 'center',
        pointerEvents: 'none',
        paddingLeft: paddingLeft,
        paddingTop: '4px',
        paddingBottom: '3px',
        filter: selected ? highlightSelectedStyle : '',
        borderRadius: '2px',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexGrow: 1,
            //border: '1px dashed yellow'
          }}
        >
          <div>
            <ImgThermo
              style={{
                height: size === 'big' ? '72px' : '36px',
                width: 'auto',
                color: fgColor,
              }}
            />
          </div>
          <div style={{ marginLeft: '20px' }}>
            {title && (
              <Typography
                style={{
                  fontSize: size === 'big' ? '20px' : '10px',
                  color: fgColor,
                }}
              >
                {title}
              </Typography>
            )}
            <Typography
              style={{
                fontSize: size === 'big' ? '34px' : '17px',
                color: fgColor,
              }}
            >
              {simulation ? _.random(10, 99) : value} C
            </Typography>
          </div>
        </div>

        {mode === 'icon_value_chart' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              marginTop: '10px',
            }}
          >
            <SvgCurve
              smoothing={0.2}
              {...(wide ? { stroke: 3 } : { stroke: 3 })}
              color={fgColor}
              points={simulation ? randomData() : data}
              style={{
                height: size === 'big' ? '64px' : '32px',
                width: 'auto',
              }}
            />
          </div>
        )}
      </div>
      <WidgetEditControls {...props} />
    </div>
  );
};

export default W_DataBoxAdvanced;
