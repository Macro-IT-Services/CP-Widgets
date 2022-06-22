import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import useColors from '../utils/useColors';
import WidgetEditControls from './WidgetEditControls';

import { highlightSelectedStyle } from '../constants';

import { ReactComponent as ImgBoltSolid } from '../assets/wea_bolt_solid.svg';
import { ReactComponent as ImgCloudFog } from '../assets/wea_cloud_fog.svg';
import { ReactComponent as ImgCloudHailMixedSolid } from '../assets/wea_cloud_hail_mixed_solid.svg';
import { ReactComponent as ImgCloudMoonRainSolid } from '../assets/wea_cloud_moon_rain_solid.svg';
import { ReactComponent as ImgCloudMoonSolid } from '../assets/wea_cloud_moon_solid.svg';
import { ReactComponent as ImgCloudRainSolid } from '../assets/wea_cloud_rain_solid.svg';
import { ReactComponent as ImgCloudShowersHeavySolid } from '../assets/wea_cloud_showers_heavy_solid.svg';
import { ReactComponent as ImgCloudSnowflake } from '../assets/wea_cloud_snowflake.svg';
import { ReactComponent as ImgCloudSolid } from '../assets/wea_cloud_solid.svg';
import { ReactComponent as ImgMoonSolid } from '../assets/wea_moon_solid.svg';
import { ReactComponent as ImgSnowflakeSolid } from '../assets/wea_snowflake_solid.svg';
import { ReactComponent as ImgSunCloud } from '../assets/wea_sun_cloud.svg';
import { ReactComponent as ImgSunCloudShowers } from '../assets/wea_sun_cloud_showers.svg';
import { ReactComponent as ImgSunSolid } from '../assets/wea_sun_solid.svg';

const WeatherIcon = props => {
  const { icon } = props;

  switch (icon) {
    case 'bolt_solid':
      return <ImgBoltSolid {...props} />;
    case 'cloud_fog':
      return <ImgCloudFog {...props} />;
    case 'cloud_hail_mixed_solid':
      return <ImgCloudHailMixedSolid {...props} />;
    case 'cloud_moon_rain_solid':
      return <ImgCloudMoonRainSolid {...props} />;
    case 'cloud_moon_solid':
      return <ImgCloudMoonSolid {...props} />;
    case 'cloud_rain_solid':
      return <ImgCloudRainSolid {...props} />;
    case 'cloud_showers_heavy_solid':
      return <ImgCloudShowersHeavySolid {...props} />;
    case 'cloud_snowflake':
      return <ImgCloudSnowflake {...props} />;
    case 'cloud_solid':
      return <ImgCloudSolid {...props} />;
    case 'moon_solid':
      return <ImgMoonSolid {...props} />;
    case 'snowflake_solid':
      return <ImgSnowflakeSolid {...props} />;
    case 'sun_cloud':
      return <ImgSunCloud {...props} />;
    case 'sun_cloud_showers':
      return <ImgSunCloudShowers {...props} />;
    case 'sun_solid':
      return <ImgSunSolid {...props} />;

    default:
      console.log('Unknown icon in WeatherIcon');
      return null;
  } //switch
};

const W_WeatherBox = props => {
  const {
    size,
    //    wide,
    //    mode = 'icon_value',
    icon = 'sun_solid',
    //    colors = [],
    id,
    groupId,
    objectProperties,
    selected,
  } = props;

  const getPropValue = prop =>
    objectProperties.find(obj => obj.key === prop)?.value;

  //  const valueInitial = objectProperties.find(obj => obj.key === "valueValue")?.value;
  const mode =
    objectProperties.find(obj => obj.key === 'settingsFormat')?.value ||
    'icon_value';
  const wide = objectProperties.find(obj => obj.key === 'settingsFullLine')
    ?.value;
  //  const simulation = objectProperties.find(obj => obj.key === "settingsSimulation")?.value;
  const colors = [getPropValue('settingsStyle'), null]; // [colorScheme = 'darkOnLight', colorReplace = null]
  const [fgColor, bgColor] = useColors(colors);

  const theme = useTheme();
  //console.log('props',props)

  return (
    <>
      {mode !== 'icon_value_title' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexBasis: wide ? '100%' : 'auto',
            flexGrow: 1,
            position: 'relative',
            height: size === 'big' ? '192px' : '96px',
            minWidth: size === 'big' ? '192px' : '96px',
            backgroundColor: bgColor, //theme.palette.wWhite,
            //        border: '1px dashed yellow',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
            fontFamily: 'Roboto-Regular',
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
                <WeatherIcon
                  icon={icon}
                  style={{
                    height: size === 'big' ? '96px' : '48px',
                    width: 'auto',
                    color: fgColor,
                  }}
                />
              )}
              {mode === 'icon' && (
                <WeatherIcon
                  icon={icon}
                  style={{
                    height: size === 'big' ? '144px' : '54px',
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
                    fontSize: size === 'big' ? '45px' : '20px',
                    color: fgColor, //theme.palette.wBlue,
                  }}
                >
                  0 C
                </Typography>
              )}
              {mode === 'value' && (
                <Typography
                  style={{
                    fontSize: size === 'big' ? '56px' : '34px',
                    color: fgColor, //theme.palette.wBlue,
                  }}
                >
                  0 C
                </Typography>
              )}
            </div>
          )}
          <WidgetEditControls widgetId={id} groupId={groupId} />
        </div>
      )}

      {mode === 'icon_value_title' && (
        <div
          style={{
            display: 'flex',
            flexBasis: wide ? '100%' : 'auto',
            flexGrow: 1,
            position: 'relative',
            height: size === 'big' ? '192px' : '96px',
            minWidth: size === 'big' ? '384px' : '192px',
            backgroundColor: bgColor, // theme.palette.wWhite,
            //border: '1px dashed red',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
            fontFamily: 'Roboto-Regular',
            filter: selected ? highlightSelectedStyle : '',
            borderRadius: '2px',
          }}
        >
          <div
            style={{
              //border: '1px dashed red',
              marginRight: size === 'big' ? '25px' : '15px',
            }}
          >
            <WeatherIcon
              icon={icon}
              style={{
                height: size === 'big' ? '144px' : '54px',
                width: 'auto',
                color: fgColor,
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              lineHeight: '23px',
              whiteSpace: 'nowrap',
            }}
          >
            <Typography
              style={{
                fontSize: size === 'big' ? '24px' : '20px',
                marginBottom: size === 'big' ? '30px' : '0px',
                lineHeight: '24px',
                color: fgColor, //theme.palette.wBlue,
              }}
            >
              St.Petersburg
            </Typography>

            <Typography
              style={{
                fontSize: size === 'big' ? '56px' : '32px',
                marginTop: size === 'big' ? '30px' : '0px',
                lineHeight: '32px',
                color: fgColor, //theme.palette.wBlue,
              }}
            >
              30 C
            </Typography>
          </div>
          <WidgetEditControls {...props} />
        </div>
      )}
    </>
  );
};

export default W_WeatherBox;
