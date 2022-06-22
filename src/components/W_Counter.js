import React, { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { ReactComponent as ImgCar } from '../assets/car.svg';
import { useApolloClient } from '@apollo/client';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { highlightSelectedStyle } from '../constants';

import { GET_DATA_SUBSCRIPTION } from '../queries';

import useColors from '../utils/useColors';
import WidgetEditControls from './WidgetEditControls';

const W_Counter = props => {
  console.log('W_Counter props', props);
  const theme = useTheme();

  const {
    //    size,
    //    wide,
    //    mode = 'icon_value',
    //    value: valueInitial,
    //    colors = [],
    id,
    //    simulation,
    objectProperties,
    selected,
  } = props;

  const client = useApolloClient();

  const getPropValue = prop =>
    objectProperties.find(obj => obj.key === prop)?.value;

  //const valueInitial = objectProperties.find(obj => obj.key === 'valueValue')    ?.value;
  const mode = getPropValue('settingsFormat');
  const size = getPropValue('settingsType'); //settingsSize ?
  const wide = getPropValue('settingsFullLine');
  const valueInitial = getPropValue('valueValue');
  const simulation = getPropValue('settingsSimulation');
  const colors = [getPropValue('settingsStyle'), null]; // [colorScheme = 'darkOnLight', colorReplace = null]
  const [fgColor, bgColor] = useColors(colors);

  const [value, setValue] = useState(valueInitial);

  const simData = useSelector(state => state.settings.simData);

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

  /*
  const { loading_getData, error_getData, data_getData } = useSubscription(
    GET_DATA_SUBSCRIPTION,
    {
      variables: { objId: id },
      // shouldResubscribe: true (default: false)
      onSubscriptionData: data => {
        console.log(
          'W_Counter subscription new data',
          id,
          data.subscriptionData.data.Objects
        );
        setValue(data.subscriptionData.data.Objects.relatedNode?.value);
      },
      //fetchPolicy: 'network-only',
      // fetchPolicy: 'network-only' (default: 'cache-first')
    }
  );
*/
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
            <ImgCar
              style={{
                height: size === 'big' ? '90px' : '45px',
                width: 'auto',
                color: fgColor,
              }}
            />
          )}
          {mode === 'icon' && (
            <ImgCar
              style={{
                height: size === 'big' ? '130px' : '70px',
                width: 'auto',
                color: fgColor,
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
              {simulation ? _.random(10, 99) : value}
            </Typography>
          )}
          {mode === 'value' && (
            <Typography
              style={{
                fontSize: size === 'big' ? '48px' : '24px',
                color: fgColor,
              }}
            >
              {simulation ? _.random(10, 99) : value}
            </Typography>
          )}
        </div>
      )}
      <WidgetEditControls {...props} />
    </div>
  );
};

export default W_Counter;
