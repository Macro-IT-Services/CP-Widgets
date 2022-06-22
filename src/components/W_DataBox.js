import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import { Typography } from '@material-ui/core';
//import { ReactComponent as ImgThermo } from '../assets/w_icon_thermo.svg';
import { useApolloClient } from '@apollo/client';
import { GET_DATA_SUBSCRIPTION } from '../queries';
import { useSelector } from 'react-redux';
import _ from 'lodash';
//import classNames from 'classnames';
import clsx from 'clsx';

import { highlightSelectedStyle, mediaServer } from '../constants';

import useColors from '../utils/useColors';
import WidgetEditControls from './WidgetEditControls';

import { msg } from '../messages';

const useStyles = makeStyles(theme => ({
  /*
  wrapper: {
    display: 'contents',

    '&> div': {
      margin:'2px',   
    },


  wrapperBreak: {
    '&::after': {
      border: '1px solid yellow',
      content: '""',
      width: '100%',
    },

  },





  },
*/
}));

const W_DataBox = props => {
  //  console.log('W_DataBox props', props);

  const {
    //size,
    //    wide,
    //    mode = 'icon_value',
    //    value: valueInitial,
    //    colors = [],
    id,
    groupId,
    //    simulation,
    objectProperties,
    selected,
  } = props;

  // returns fg and bg color of widget are based settingsStyle and valueCurrentColor
  //TODO: bug: on 'yellow' returns {fg: '#F9F9F9', bg: '#2780e3'}
  const mapAndSetColors = valueCurrentColorOriginal => {
    //    console.log('W_DataBox mapAndSetColors valueCurrentColorOriginal,style',valueCurrentColorOriginal,style);
    let fgColor, bgColor;
    let colors;
    //  const valueCurrentColor = 'red';
    const colorsMap = {
      red: theme.palette.wRed,
      green: theme.palette.wGreen,
      orange: theme.palette.wOrange,
      yellow: theme.palette.wYellow,
      blue: theme.palette.wBlue,
      black: theme.palette.wBlack,
      white: theme.palette.wWhite,
      transparent: theme.palette.wTransparent,
      default: 'default',
    };

    const [fgStyleColor, bgStyleColor] = styleColors;

    const valueCurrentColor = colorsMap[valueCurrentColorOriginal];
    //console.log('!!!', valueCurrentColor);
    if (valueCurrentColor === 'default' || !valueCurrentColor)
      return { fg: fgStyleColor, bg: bgStyleColor };
    else
      switch (style) {
        case 'darkonlight':
          return { fg: valueCurrentColor, bg: bgStyleColor };
          break;

        case 'lightondark':
          return { fg: fgStyleColor, bg: valueCurrentColor };
          break;

        case 'darkontransparent':
          return { fg: valueCurrentColor, bg: bgStyleColor };
          break;

        case 'lightontransparent':
          return { fg: valueCurrentColor, bg: bgStyleColor };
          break;

        default:
          console.log('W_DataBox mapColors: no such style');
          return { fg: fgStyleColor, bg: bgStyleColor };
          break;
      }
  };

  const theme = useTheme();
  const classes = useStyles();

  const client = useApolloClient();
  const icons = useSelector(state => state.settings.icons);
  const getPropValue = prop =>
    objectProperties.find(obj => obj.key === prop)?.value;

  /*
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
*/
  const mode = getPropValue('settingsFormat');
  const size = getPropValue('settingsSize');
  const wide = getPropValue('settingsFullLine');
  const newLine = getPropValue('settingsNewLine');
  let iconId = getPropValue('settingsIcon');

  let statusAlarmInitial = getPropValue('statusAlarm');

  //console.log('W_DataBox getPropValue("valueValue")',getPropValue('valueValue'));

  const valueInitial = getPropValue('valueValue') ?? msg.misc.na;

  const simulation = getPropValue('settingsSimulation');
  //  const colors = [getPropValue('settingsStyle'), null]; // [colorScheme = 'darkOnLight', colorReplace = null]
  //  const [fgColor, bgColor] = useColors(colors);

  const style = getPropValue('settingsStyle');
  const styleColors = useColors([style, null]);
  //console.log('W_DataBox style, styleColors',style, styleColors)

  const [value, setValue] = useState(valueInitial);
  const [alarm, setAlarm] = useState(statusAlarmInitial);
  //console.log('W_DataBox valueInitial',valueInitial)
  //  const [fgColor, setFgColor] = useState([]);
  //  const [bgColor, setBgColor] = useState([]);
  //const [colors, setColors] = useState({fg:null,bg:null});
  const [colors, setColors] = useState(
    mapAndSetColors(getPropValue('valueCurrentColor'))
  );

  const simData = useSelector(state => state.settings.simData);

  //  [tmpFgColor, tempBgColor] = mapAndSetColors(getPropValue('valueCurrentColor'))

  useEffect(() => {
    const observer = client.subscribe({
      query: GET_DATA_SUBSCRIPTION,
      variables: { objId: id },
      // shouldResubscribe: true (default: false)
    });

    const subscription = observer.subscribe(({ data }) => {
      //      console.log('SUBSCRIBE received', data)
      console.log('W_DataBox subscription new data:', id, data.Objects);
      //      setValue(data.Objects.relatedNode?.value);
      // change number on widget
      if (data.Objects.relatedNode?.key === 'valueValue') {
        setValue(data.Objects.relatedNode?.value);
        console.log('valueValue', data.Objects.relatedNode?.value);
      }
      // change color of widget
      else if (data.Objects.relatedNode?.key === 'valueCurrentColor') {
        //  console.log('W_DataBox subscription: mapAndSetColors', mapAndSetColors(data.Objects.relatedNode?.value) );
        setColors(mapAndSetColors(data.Objects.relatedNode?.value));
        /*
        if (data.Objects.relatedNode?.value==='default') 
          setColor(bgColor)  
        else
          setColor(data.Objects.relatedNode?.value)
          */
        //        console.log('W_DataBox subscription: valueCurrentColor', data.Objects.relatedNode?.value);
      }
      // change triangle corner marker on/off
      else if (data.Objects.relatedNode?.key === 'statusAlarm') {
        setAlarm(data.Objects.relatedNode?.value);
      } else {
        console.log(
          'key is not valueValue. Should we update other properties of widget here?'
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [id]);

  let total_px = 0,
    icon_px = 0,
    font_px = 0;

  if (mode === 'icon_value' || mode === 'icon')
    switch (size) {
      case 'small':
        total_px = '96';
        icon_px = '43'; //22
        font_px = '20';
        break;
      case 'medium':
        total_px = '192';
        icon_px = '95';
        font_px = '26';
        break;
      case 'large':
        total_px = '384';
        icon_px = '90';
        font_px = '36';
        break;
      default:
        console.log('unknown size:', size);
    } //switch

  // shrink widget vertically if there is no icon
  if (mode === 'value')
    switch (size) {
      case 'small':
        total_px = '48';
        icon_px = '45'; //45
        font_px = '20';
        break;
      case 'medium':
        total_px = '96';
        icon_px = '70'; //70
        font_px = '36';
        break;
      case 'large':
        total_px = '192';
        icon_px = '130'; //130
        font_px = '36';
        break;
      default:
        console.log('unknown size:', size);
    } //switch

  const svgUrl = `${mediaServer}/download/${iconId}/${localStorage.getItem(
    'authToken'
  )}`;
  //const svgUrl = 'http://localhost:3000/test.svg';
  //    console.log('newLine', newLine)
  return (
    <>
      <div
        style={{
          margin: '2px',
          //width: newLine ? '100%': 'auto',
          display: 'flex',
          flexDirection: 'column',
          flexBasis: wide ? '100%' : 'auto',
          flexGrow: 1,
          position: 'relative',
          //        height: size === 'big' ? '192px' : '96px',
          //        minWidth: size === 'big' ? '192px' : '96px',
          height: `${total_px}px`,
          //        minWidth: `${total_px}px`,

          backgroundColor: colors.bg,
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          filter: selected ? highlightSelectedStyle : '',
          borderRadius: '2px',

          //background: `linear-gradient(225deg, ${theme.palette.wRed} 15px, ${colors.bg} 15px )`,
          background:
            alarm === 'triggered'
              ? `linear-gradient(225deg, ${theme.palette.wRed} 15px, ${colors.bg} 15px )`
              : `${colors.bg}`,
        }}
      >
        {(mode === 'icon_value' || mode === 'icon') && (
          <div
            style={{
              display: 'flex',
              alignItems: !(mode === 'icon_value') ? 'center' : 'flex-end',
              flexGrow: 1,
            }}
          >
            <div
              style={{
                width: 'auto',
                WebkitMask: `url(${svgUrl}) no-repeat 50% 50%`,
                mask: `url(${svgUrl}) no-repeat 50% 50%`,
                WebkitMaskSize: 'cover',
                maskSize: 'cover',
                backgroundColor: colors.fg,
              }}
            >
              <img
                src={svgUrl}
                style={{ visibility: 'hidden', height: `${icon_px}px` }}
              />
            </div>

            {/*
            <img src={`${mediaServer}/download/${iconId}/${localStorage.getItem('authToken')}`}
            style={{
              height: `${icon_px}px`,
              width: 'auto',
              color: colors.fg,
            }}
            />
          */}
            {/*                      
          <ImgThermo
            style={{
              height: `${icon_px}px`,
              width: 'auto',
              color: colors.fg,
            }}
          />
          
            */}
          </div>
        )}
        {(mode === 'value' || mode === 'icon_value') && (
          <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography
              style={{
                //                fontSize: size === 'big' ? '36px' : '16px',
                fontSize: `${font_px}px`,
                color: colors.fg,
                //                border: '1px solid red'
              }}
            >
              {simulation ? _.random(10, 99) : value ? value.toString() : ' '}
            </Typography>
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

export default W_DataBox;
