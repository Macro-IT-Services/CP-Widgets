import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme, withTheme } from '@material-ui/core/styles';
import _ from 'lodash';

//import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
//import Link from '@material-ui/core/Link';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

//import AddDashboardModal from '../components/AddDashboardModal';

//import ImgTest2 from '../assets/test2.jpg';
import { ReactComponent as ImgWidgets } from '../assets/test_widgets.svg';

import { msg } from '../messages';

import {
  addToLayout,
  updateEntireLayout,
  deleteFromLayout,
  clearDashboard,
  addToDashboard,
  updateDashboard,
  deleteFromDashboard,
} from '../actions';

import W_Vibration from './W_Vibration';
import W_DataChart from './W_DataChart';
import W_ImageBox from './W_ImageBox';
import W_ObjectTable from './W_ObjectTable';
import W_Title from './W_Title';
import W_DateTime from './W_DateTime';
import W_Counter from './W_Counter';
import W_DataBox from './W_DataBox';
import W_DataBoxAdvanced from './W_DataBoxAdvanced';
import W_Slider from './W_Slider';
import W_Switcher from './W_Switcher';
import W_CommandButton from './W_CommandButton';
import W_Indicator from './W_Indicator';
import W_WeatherBox from './W_WeatherBox';
import W_GroupTable from './W_GroupTable';

import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveGridLayout = WidthProvider(Responsive);

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'relative',
    //    marginTop:'48px',
  },
}));

// for .sort()
const sortByOrder = (a, b) => {
  if (a.order < b.order) {
    return -1;
  }
  if (a.order > b.order) {
    return 1;
  }
  return 0;
};

const Widgets = React.memo(props => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const inputRef = useRef([]);

  const isFullScreen = useSelector(state => state.settings.isFullScreen);
  const isSideBar = useSelector(state => state.settings.isSideBar);
  const isEditMode = useSelector(state => state.settings.isEditMode);
  const gapWidgets = useSelector(state => state.settings.gapWidgets);
  const gapContainers = useSelector(state => state.settings.gapContainers);

  const layoutsCurrent = useSelector(state => state.layout);

  const dashboard = useSelector(state => state.dashboard);

  const [breakpointCurrent, setBreakpointCurrent] = useState('lg'); // changing on resize screen (to choose right layout thereafter)

  const [heights, setHeights] = useState([]);

  window.onload = () => {
    console.log('ONLOAD');
    updateHeights();
    /*
    setTimeout(()=>{
    },3500);    
    */
  };

  const updateHeights = containerWidth => {
    console.log('HEIGHTS UPDATED', inputRef.current);

    let heights = [];

    inputRef.current.map((current, index) => {
      //  console.log('+=+', current);
      if (current) {
        // check if there are any container yet available (there aren't any containers if widgets component hidden/unmounted)
        heights[index] = current.getBoundingClientRect().height + gapContainers;

        //console.log('-', index, current.getBoundingClientRect().height);
      } //if
    });
    //    console.log('--',heights)

    if (heights.length > 0) setHeights(heights);
  };

  // add some widgets to dashboard
  useEffect(() => {
    //    console.log('useEffect');
    // huge 384, big 192, small - 96, tiny - 48
    dispatch(clearDashboard());
    /*
    // containers
    for (let i = 0; i <= 5; i++) {
      let widgets = [];
      // widgets
      for (let j = 0; j <= 6; j++) {
        const widget = _.sample([
          'ImageBox',
          'ObjectTable',
          'GroupTable',
          'Vibration',
          'DataChart',
          'Title',
          'DateTime',
          'Counter',
          'DataBox',
          'DataBoxAdvanced',
          'Slider',
          'Switcher',
          'CommandButton',
          'Indicator',
          'WeatherBox',
        ]);
        switch (widget) {
          case 'ImageBox':
            widgets.push({
              widget: widget,
              src: _.sample([0, 1, 2]),
              size: _.sample(['huge', 'big', 'small', 'tiny']),
              type: _.sample(['fill', 'normal']),
              id: 40,
              order: 10,
              wide: _.sample([true, false]),
              colors: _.sample([
                ['darkOnLight'],
                ['lightOnDark'],
                ['darkOnTransparent'],
                ['lightOnTransparent'],
              ]),
            });
            break;
          case 'ObjectTable':
            widgets.push({
              widget: widget,
              height: 220,
              title: _.sample(['Title', null]),
              id: 40,
              order: 10,
              wide: true,
              colors: _.sample([
                ['darkOnLight'],
                ['lightOnDark'],
                ['darkOnTransparent'],
                ['lightOnTransparent'],
              ]),
            });
            break;
          case 'GroupTable':
            widgets.push({
              widget: widget,
              height: 144,
              title: _.sample(['Title', null]),
              id: 40,
              order: 10,
              wide: true,
              colors: _.sample([
                ['darkOnLight'],
                ['lightOnDark'],
                ['darkOnTransparent'],
                ['lightOnTransparent'],
              ]),
            });
            break;
          case 'Vibration':
            widgets.push({
              widget: widget,
              size: _.sample(['big', 'small', 'tiny']),
              mode: _.sample(['icon_value', 'value', 'icon']),
              id: 40,
              order: 10,
              wide: _.sample([true, false]),
              colors: _.sample([
                ['darkOnLight'],
                ['lightOnDark'],
                ['darkOnTransparent'],
                ['lightOnTransparent'],
              ]),
            });
            break;
          case 'CommandButton':
            widgets.push({
              widget: widget,
              size: _.sample(['big', 'small']),
              mode: _.sample(['icon_value', 'icon']),
              id: 40,
              order: 10,
              wide: _.sample([true, false]),
              colors: _.sample([
                ['darkOnLight'],
                ['lightOnDark'],
                ['darkOnTransparent'],
                ['lightOnTransparent'],
              ]),
            });
            break;
          case 'DataChart':
            widgets.push({
              widget: widget,
              height: _.random(288, 528),
              title: _.sample(['Title', null]),
              table: _.sample([true, false]),
              id: 40,
              order: 10,
              wide: true,
              colors: _.sample([
                ['darkOnLight'],
                ['lightOnDark'],
                ['darkOnTransparent'],
                ['lightOnTransparent'],
              ]),
            });
            break;
          case 'Title':
            widgets.push({
              widget: widget,
              size: _.sample(['big', 'small']),
              id: 40,
              order: 10,
              title: 'Title',
              wide: _.sample([true, false]),
              colors: _.sample([
                ['darkOnLight'],
                ['lightOnDark'],
                ['darkOnTransparent'],
                ['lightOnTransparent'],
              ]),
            });
            break;
          case 'DateTime':
            widgets.push({
              widget: widget,
              type: _.sample([
                'time',
                'time_date',
                'date_day',
                'time_date_day',
                'date',
              ]),
              size: _.sample(['big', 'small']),
              id: 40,
              order: 10,
              wide: _.sample([true, false]),
              colors: _.sample([
                ['darkOnLight'],
                ['lightOnDark'],
                ['darkOnTransparent'],
                ['lightOnTransparent'],
              ]),
            });
            break;
          case 'Counter':
            widgets.push({
              widget: widget,
              size: _.sample(['big', 'small']),
              mode: _.sample(['icon_value', 'value', 'icon']),
              id: 40,
              order: 10,
              wide: _.sample([true, false]),
              colors: _.sample([
                ['darkOnLight'],
                ['lightOnDark'],
                ['darkOnTransparent'],
                ['lightOnTransparent'],
              ]),
            });
            break;
          case 'DataBox':
            widgets.push({
              widget: widget,
              size: _.sample(['big', 'small']),
              mode: _.sample(['icon_value', 'value', 'icon']),
              id: 40,
              order: 10,
              wide: _.sample([true, false]),
              colors: _.sample([
                ['darkOnLight'],
                ['lightOnDark'],
                ['darkOnTransparent'],
                ['lightOnTransparent'],
              ]),
            });
            break;
          case 'DataBoxAdvanced':
            widgets.push({
              widget: widget,
              size: _.sample(['big', 'small']),
              mode: _.sample(['icon_value', 'icon_value_chart']),
              title: 'Title',
              id: 40,
              order: 10,
              wide: _.sample([true, false]),
              colors: _.sample([
                ['darkOnLight'],
                ['lightOnDark'],
                ['darkOnTransparent'],
                ['lightOnTransparent'],
              ]),
            });
            break;
          case 'Slider':
            widgets.push({
              widget: widget,
              size: _.sample(['big', 'small']),
              id: 40,
              order: 10,
              wide: _.sample([true, false]),
              colors: _.sample([
                ['darkOnLight'],
                ['lightOnDark'],
                ['darkOnTransparent'],
                ['lightOnTransparent'],
              ]),
            });
            break;
          case 'Switcher':
            widgets.push({
              widget: widget,
              size: _.sample(['big', 'small']),
              mode: _.sample(['icon_value', 'icon']),
              id: 40,
              order: 10,
              wide: _.sample([true, false]),
              colors: _.sample([
                ['darkOnLight'],
                ['lightOnDark'],
                ['darkOnTransparent'],
                ['lightOnTransparent'],
              ]),
            });
            break;
          case 'Indicator':
            widgets.push({
              widget: widget,
              size: _.sample(['big', 'small']),
              type: _.sample(['thermo', 'tacho']),
              mode: _.sample(['icon_value', 'text', 'icon']),
              id: 40,
              order: 10,
              wide: _.sample([true, false]),
              colors: _.sample([
                ['darkOnLight'],
                ['lightOnDark'],
                ['darkOnTransparent'],
                ['lightOnTransparent'],
              ]),
            });
            break;
          case 'WeatherBox':
            widgets.push({
              widget: widget,
              size: _.sample(['big', 'small']),
              icon: _.sample([
                'bolt_solid',
                'cloud_fog',
                'cloud_hail_mixed_solid',
                'cloud_moon_rain_solid',
                'cloud_moon_solid',
                'cloud_rain_solid',
                'cloud_showers_heavy_solid',
                'cloud_snowflake',
                'cloud_solid',
                'moon_solid',
                'snowflake_solid',
                'sun_cloud',
                'sun_cloud_showers',
                'sun_solid',
              ]),
              mode: _.sample(['icon_value', 'value', 'icon', 'icon_value_title']),
              id: 40,
              order: 10,
              wide: _.sample([true, false]),
              colors: _.sample([
                ['darkOnLight'],
                ['lightOnDark'],
                ['darkOnTransparent'],
                ['lightOnTransparent'],
              ]),
            });
            break;
        }
      } //for

      dispatch(
        addToDashboard({
          width: _.random(1, 4),
          widgets: widgets,
        })
      );
    } //for
*/

    dispatch(
      addToDashboard({
        width: 2,
        widgets: [
          {
            widget: 'Counter',
            size: 'small',
            type: 'tacho',
            mode: 'icon',
            id: 40,
            order: 10,
            wide: false,
            colors: ['darkOnLight', 'red'],
          },
          {
            widget: 'Counter',
            size: 'small',
            type: 'tacho',
            mode: 'text',
            id: 40,
            order: 10,
            wide: false,
            colors: ['darkOnLight'],
          },
          {
            widget: 'Counter',
            size: 'small',
            type: 'tacho',
            mode: 'icon_value',
            id: 40,
            order: 10,
            wide: false,
            colors: ['lightOnDark'],
          },
          {
            widget: 'Counter',
            size: 'big',
            type: 'tacho',
            mode: 'icon',
            id: 40,
            order: 10,
            wide: false,
            colors: ['lightOnDark'],
          },
          {
            widget: 'Counter',
            size: 'big',
            type: 'tacho',
            mode: 'text',
            id: 40,
            order: 10,
            wide: false,
            colors: ['darkOnTransparent'],
          },
          {
            widget: 'Counter',
            size: 'big',
            type: 'tacho',
            mode: 'icon_value',
            id: 40,
            order: 10,
            wide: false,
            colors: ['lightOnTransparent'],
          },
        ],
      })
    );

    dispatch(
      addToDashboard({
        width: 2,
        widgets: [
          {
            widget: 'DataBox',
            size: 'small',
            mode: 'icon',
            id: 40,
            order: 10,
            wide: false,
            colors: ['darkOnLight', 'red'],
          },
          {
            widget: 'DataBox',
            size: 'small',
            mode: 'text',
            id: 40,
            order: 10,
            wide: false,
            colors: ['darkOnLight'],
          },
          {
            widget: 'DataBox',
            size: 'small',
            mode: 'icon_value',
            id: 40,
            order: 10,
            wide: false,
            colors: ['lightOnDark'],
          },
          {
            widget: 'DataBox',
            size: 'big',
            mode: 'icon',
            id: 40,
            order: 10,
            wide: false,
            colors: ['lightOnDark'],
          },
          {
            widget: 'DataBox',
            size: 'big',
            mode: 'text',
            id: 40,
            order: 10,
            wide: false,
            colors: ['darkOnTransparent'],
          },
          {
            widget: 'DataBox',
            size: 'big',
            mode: 'icon_value',
            id: 40,
            order: 10,
            wide: false,
            colors: ['lightOnTransparent'],
          },
        ],
      })
    );

    dispatch(
      addToDashboard({
        width: 4,
        widgets: [
          {
            widget: 'DataBoxAdvanced',
            size: 'small',
            icon: '?',
            title: 'Title',
            mode: 'icon_value_chart',
            id: 40,
            order: 10,
            wide: false,
            colors: ['darkOnLight', 'red'],
          },
          {
            widget: 'DataBoxAdvanced',
            size: 'big',
            icon: '?',
            title: 'Title',
            mode: 'icon_value_chart',
            id: 40,
            order: 10,
            wide: false,
            colors: ['darkOnLight'],
          },
          {
            widget: 'DataBoxAdvanced',
            size: 'small',
            icon: '?',
            title: 'Title',
            mode: 'icon_value',
            id: 40,
            order: 10,
            wide: false,
            colors: ['lightOnDark'],
          },
          {
            widget: 'DataBoxAdvanced',
            size: 'big',
            icon: '?',
            title: 'Title',
            mode: 'icon_value',
            id: 40,
            order: 10,
            wide: false,
            colors: ['lightOnDark'],
          },

          {
            widget: 'DataBoxAdvanced',
            size: 'small',
            icon: '?',
            title: 'Title',
            mode: 'icon_value_chart',
            id: 40,
            order: 10,
            wide: true,
            colors: ['darkOnTransparent'],
          },
          {
            widget: 'DataBoxAdvanced',
            size: 'big',
            icon: '?',
            title: 'Title',
            mode: 'icon_value_chart',
            id: 40,
            order: 10,
            wide: true,
            colors: ['darkOnTransparent'],
          },
          {
            widget: 'DataBoxAdvanced',
            size: 'small',
            icon: '?',
            title: 'Title',
            mode: 'icon_value',
            id: 40,
            order: 10,
            wide: true,
            colors: ['darkOnTransparent'],
          },
          {
            widget: 'DataBoxAdvanced',
            size: 'big',
            icon: '?',
            title: 'Title',
            mode: 'icon_value',
            id: 40,
            order: 10,
            wide: true,
            colors: ['lightOnTransparent'],
          },
        ],
      })
    );

    /*
    dispatch(addToDashboard(
      {
        width: 3,
        widgets: [

          { widget: 'ObjectTable', title: 'Title', height: 250, id: 40, order:10, wide: true, colors: ['darkOnLight', 'red'] },
          { widget: 'ObjectTable', height: 250, id: 40, order:10, wide: true, colors: ['darkOnLight'] },
          { widget: 'ObjectTable', height: 250, id: 40, order:10, wide: true, colors: ['lightOnDark'] },
          { widget: 'ObjectTable', height: 250, id: 40, order:10, wide: true, colors: ['lightOnDark'] },
          { widget: 'ObjectTable', height: 250, id: 40, order:10, wide: true, colors: ['darkOnTransparent'] },
          { widget: 'ObjectTable', height: 250, id: 40, order:10, wide: true, colors: ['lightOnTransparent'] },

        ]
      }
    ));
*/

    /*
    dispatch(addToDashboard(
      {
        width: 3,
        widgets: [

          { widget: 'DataChart', height: 488, title: 'Title',  id: 40, order:10, colors: ['darkOnLight', 'red'] },
          { widget: 'DataChart', height: 488, title: 'Title', table: true, id: 40, order:10, colors: ['darkOnLight'] },
          { widget: 'DataChart', height: 488, title: 'Title', id: 40, order:10, colors: ['lightOnDark'] },
          { widget: 'DataChart', height: 488, title: 'Title', table: true, id: 40, order:10, colors: ['lightOnDark'] },
          { widget: 'DataChart', height: 488, title: 'Title', id: 40, order:10, colors: ['darkOnTransparent'] },
          { widget: 'DataChart', height: 488, title: 'Title', table: true, id: 40, order:10, colors: ['lightOnTransparent'] },

        ]
      }
    ));
*/

    /*
    dispatch(addToDashboard(
      {
        width: 3,
        widgets: [

          { widget: 'GroupTable', title: 'Title',  id: 40, order:10, wide: true, colors: ['darkOnLight', 'red'] },
          { widget: 'GroupTable', title: 'Title', id: 40, order:10, wide: true, colors: ['darkOnLight'] },
          { widget: 'GroupTable', title: 'Title', id: 40, order:10, wide: true, colors: ['lightOnDark'] },
          { widget: 'GroupTable', title: 'Title', id: 40, order:10, wide: true, colors: ['lightOnDark'] },
          { widget: 'GroupTable', title: 'Title', id: 40, order:10, wide: true, colors: ['darkOnTransparent'] },
          { widget: 'GroupTable', title: 'Title', id: 40, order:10, wide: true, colors: ['lightOnTransparent'] },

        ]
      }
    ));
*/

    /*
    dispatch(addToDashboard(
      {
        width: 4,
        widgets: [

          { widget: 'DateTime', size: 'small', type: 'time_date_day', id: 40, order:10, wide: false, colors: ['darkOnLight', 'red'] },
          { widget: 'DateTime', size: 'small', type: 'time_date', id: 40, order:10, wide: false, colors: ['darkOnLight'] },
          { widget: 'DateTime', size: 'small', type: 'time', id: 40, order:10, wide: false, colors: ['lightOnDark'] },
          { widget: 'DateTime', size: 'big', type: 'time_date_day', id: 40, order:10, wide: false, colors: ['lightOnDark'] },
          { widget: 'DateTime', size: 'big', type: 'time_date', id: 40, order:10, wide: false, colors: ['darkOnTransparent'] },
          { widget: 'DateTime', size: 'big', type: 'time', id: 40, order:10, wide: false, colors: ['lightOnTransparent'] },

        ]
      }
    ));
*/
    /*
    dispatch(addToDashboard(
      {
        width: 2,
        widgets: [
          { widget: 'ImageBox', src:'5', size: 'small', id: 40, order:10, wide: false, colors: ['darkOnLight', 'red'] },
          { widget: 'ImageBox', src:'5', size: 'big', id: 40, order:10, wide: false, colors: ['darkOnLight'] },
          { widget: 'ImageBox', src:'5', size: 'huge', id: 40, order:10, wide: false, colors: ['lightOnDark'] },
          { widget: 'ImageBox', src:'5', type: 'fill', size: 'small', id: 40, order:10, wide: false, colors: ['lightOnDark'] },
          { widget: 'ImageBox', src:'5', type: 'fill', size: 'big', id: 40, order:10, wide: false, colors: ['darkOnTransparent'] },
          { widget: 'ImageBox', src:'5', type: 'fill', size: 'huge', id: 40, order:10, wide: false, colors: ['lightOnTransparent'] },
        ],
      },
    ));
*/
    /*
    dispatch(addToDashboard(
      {
        width: 3,
        widgets: [

          { widget: 'ObjectTable', title: 'Title', height: 250, id: 40, order:10, wide: true, colors: ['darkOnLight', 'red'] },
          { widget: 'ObjectTable', height: 250, id: 40, order:10, wide: true, colors: ['darkOnLight'] },
          { widget: 'ObjectTable', height: 250, id: 40, order:10, wide: true, colors: ['lightOnDark'] },
          { widget: 'ObjectTable', height: 250, id: 40, order:10, wide: true, colors: ['lightOnDark'] },
          { widget: 'ObjectTable', height: 250, id: 40, order:10, wide: true, colors: ['darkOnTransparent'] },
          { widget: 'ObjectTable', height: 250, id: 40, order:10, wide: true, colors: ['lightOnTransparent'] },

        ]
      }
    ));
*/

    /*
    dispatch(addToDashboard(
      {
        width: 2,
        widgets: [

          { widget: 'Switcher', size: 'small', mode: 'icon', id: 40, order:10, wide: false, colors: ['darkOnLight', 'red'] },
          { widget: 'Switcher', size: 'small', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['darkOnLight'] },
          { widget: 'Switcher', size: 'small', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['lightOnDark'] },
          { widget: 'Switcher', size: 'big', mode: 'icon', id: 40, order:10, wide: false, colors: ['lightOnDark'] },
          { widget: 'Switcher', size: 'big', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['darkOnTransparent'] },
          { widget: 'Switcher', size: 'big', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['lightOnTransparent'] },

        ]
      }
    ));
*/
    /*
    dispatch(addToDashboard(
      {
        width: 3,
        widgets: [
          { widget: 'Title', title: 'Title 1', id: 40, order:10, wide: false, colors: ['darkOnLight', 'red'] },
          { widget: 'Title', title: 'Title 2', id: 40, order:10, wide: false, colors: ['darkOnLight'] },
          { widget: 'Title', title: 'Title 3', id: 40, order:10, wide: true, colors: ['lightOnDark'] },
          { widget: 'Title', title: 'Title 1', id: 40, order:10, wide: false, colors: ['lightOnDark'] },
          { widget: 'Title', title: 'Title 2', id: 40, order:10, wide: false, colors: ['darkOnTransparent'] },
          { widget: 'Title', title: 'Title 3', id: 40, order:10, wide: true, colors: ['lightOnTransparent'] },
        ],
      },
    ));
*/
    /*
    dispatch(addToDashboard(
      {
        width: 2,
        widgets: [
          { widget: 'Vibration', size: 'small', mode: 'text', id: 40,  order: 10, wide: true, colors: ['darkOnLight', 'red']},
          { widget: 'Vibration', size: 'small', mode: 'icon', id: 40,  order: 10, wide: false, colors: ['darkOnLight']},
          { widget: 'Vibration', size: 'big', mode: 'text', id: 40,  order: 10, wide: false, colors: ['lightOnDark']},
          { widget: 'Vibration', size: 'small', mode: 'icon', id: 40,  order: 10, wide: true, colors: ['lightOnDark']},
          { widget: 'Vibration', size: 'small', mode: 'text', id: 40,  order: 10, wide: false, colors: ['darkOnTransparent']},
          { widget: 'Vibration', size: 'big', mode: 'icon', id: 40,  order: 10, wide: false, colors: ['lightOnTransparent']},
        ],
      },
    ));
*/

    /*
    dispatch(addToDashboard(
      {
        width: 4,
        widgets: [

          { widget: 'WeatherBox', size: 'big', icon: 'bolt_solid', mode: 'icon', id: 40, order:10, wide: false, colors: ['darkOnLight', 'red'] },
          { widget: 'WeatherBox', size: 'big', icon: 'bolt_solid', mode: 'value', id: 40, order:10, wide: false, colors: ['darkOnLight'] },
          { widget: 'WeatherBox', size: 'big', icon: 'cloud_fog', mode: 'icon_value_title', id: 40, order:10, wide: false, colors: ['darkOnLight'] },
          { widget: 'WeatherBox', size: 'big', icon: 'bolt_solid', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['lightOnDark'] },
          { widget: 'WeatherBox', size: 'small', icon: 'bolt_solid', mode: 'icon', id: 40, order:10, wide: false, colors: ['lightOnDark'] },
          { widget: 'WeatherBox', size: 'small', icon: 'bolt_solid', mode: 'value', id: 40, order:10, wide: false, colors: ['darkOnTransparent'] },
          { widget: 'WeatherBox', size: 'small', icon: 'bolt_solid', mode: 'icon_value_title', id: 40, order:10, wide: false, colors: ['darkOnTransparent'] },
          { widget: 'WeatherBox', size: 'small', icon: 'bolt_solid', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['lightOnTransparent'] },
  
        ]
      }
    ));
*/
    /*
    dispatch(addToDashboard(
      {
        width: 2,
        widgets: [

          { widget: 'CommandButton', size: 'small', mode: 'icon', id: 40, order:10, wide: false, colors: ['darkOnLight', 'red']  },
          { widget: 'CommandButton', size: 'small', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['darkOnLight'] },
          { widget: 'CommandButton', size: 'big', mode: 'icon', id: 40, order:10, wide: false, colors: ['lightOnDark'] },
          { widget: 'CommandButton', size: 'big', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['darkOnTransparent'] },

        ]
      }
    ));
*/

    /*
    dispatch(addToDashboard(
      {
        width: 2,
        widgets: [

          { widget: 'Slider', size: 'small', mode: 'icon', id: 40, order:10, wide: false, colors: ['darkOnLight', 'red'] },
          { widget: 'Slider', size: 'small', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['darkOnLight'] },
          { widget: 'Slider', size: 'small', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['lightOnDark'] },
          { widget: 'Slider', size: 'big', mode: 'icon', id: 40, order:10, wide: false, colors: ['lightOnDark'] },
          { widget: 'Slider', size: 'big', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['darkOnTransparent'] },
          { widget: 'Slider', size: 'big', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['lightOnTransparent'] },

        ]
      }
    ));
*/
    /*
    dispatch(addToDashboard(
      {
        width: 2,
        widgets: [

          { widget: 'Switcher', size: 'small', mode: 'icon', id: 40, order:10, wide: false, colors: ['darkOnLight'] },
          { widget: 'Switcher', size: 'small', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['darkOnLight'] },
          { widget: 'Switcher', size: 'small', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['lightOnDark'] },
          { widget: 'Switcher', size: 'big', mode: 'icon', id: 40, order:10, wide: false, colors: ['lightOnDark'] },
          { widget: 'Switcher', size: 'big', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['darkOnTransparent'] },
          { widget: 'Switcher', size: 'big', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['lightOnTransparent'] },

        ]
      }
    ));
*/
    /*
    dispatch(addToDashboard(
      {
        width: 2,
        widgets: [

          { widget: 'Indicator', size: 'small', type: 'tacho', mode: 'icon', id: 40, order:10, wide: false, colors: ['darkOnLight', 'red'] },
          { widget: 'Indicator', size: 'small', type: 'tacho', mode: 'value', id: 40, order:10, wide: false, colors: ['darkOnLight'] },
          { widget: 'Indicator', size: 'small', type: 'tacho', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['lightOnDark'] },
          { widget: 'Indicator', size: 'big', type: 'thermo', mode: 'icon', id: 40, order:10, wide: false, colors: ['lightOnDark'] },
          { widget: 'Indicator', size: 'big', type: 'tacho', mode: 'value', id: 40, order:10, wide: false, colors: ['darkOnTransparent'] },
          { widget: 'Indicator', size: 'big', type: 'tacho', mode: 'icon_value', id: 40, order:10, wide: false, colors: ['lightOnTransparent'] },

        ]
      }
    ));
*/
  }, []);

  // skip render if no containers added yet to dashboard (in useEffect)
  if (Object.keys(dashboard).length === 0) return false;
  /*
// update heights once fresh values will be available
if (inputRef.current.length>0)   {
  inputRef.current.map((current,index)=>{ 
    heights[index] = current.getBoundingClientRect().height
    console.log('-',index,current.getBoundingClientRect().height)
})}
*/
  // make layout based on state.dashboard (with x,y from state.layouts)
  let layouts = { lg: [], md: [], sm: [], xs: [], xxs: [] };
  //  console.log('dashboard', dashboard);
  //  console.log('layoutsCurrent', layoutsCurrent);
  //  console.log('breakpointCurrent', breakpointCurrent);
  //  console.log(    'layoutsCurrent[breakpointCurrent]',    layoutsCurrent[breakpointCurrent]  );

  //if (layoutsCurrent.length>0)

  // for each breakpoint...
  const tmp = ['lg', 'md', 'sm', 'xs', 'xxs'].map(breakpoint => {
    //for each container...
    let i = 0; // to sync state.dashboard with state.layout
    return dashboard.map((container, index) => {
      //     console.log('container, index',container, index)

      //      console.log('h',h)
      //      console.log('heights',heights)
      let h;
      h = heights[index] || 48;

      //h = 96;

      // x,y from updated layout (if there are any for given breakpoint)
      // h - calculated based on widgets heights, w - predefined for given container
      if (layoutsCurrent[breakpoint]) {
        //console.log('index',index)
        //console.log('layoutsCurrent[breakpoint]',layoutsCurrent[breakpoint])
        const x = layoutsCurrent[breakpoint][index].x;
        const y = layoutsCurrent[breakpoint][index].y;
        layouts[breakpoint].push({
          x: x,
          y: y,
          w: container.width,
          h: h,
          minH: h,
          maxH: h,
          i: index.toString(),
        });
      } else {
        layouts[breakpoint].push({
          x: 0, //Math.floor(Math.random() * (500 - 10 + 1)) + 10,
          y: Infinity,
          w: container.width,
          h: h,
          minH: h,
          maxH: h,
          i: index.toString(),
        });
      }
    });
  });

  //  console.log('layouts', layouts);
  //          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
  return (
    <>
      <div
        className={classes.wrapper}
        style={{
          marginLeft: `${gapContainers / 2}px`,
          marginRight: `${gapContainers / 2}px`,
          marginTop:
            (isFullScreen && !isSideBar) || (!isFullScreen && !isSideBar)
              ? '0px'
              : '56px',
        }}
      >
        <ResponsiveGridLayout
          className="layout"
          style={{}}
          layouts={layouts}
          cols={{ lg: 6, md: 6, sm: 6, xs: 4, xxs: 1 }}
          rowHeight={1}
          margin={[0, 0]}
          containerPadding={[0, 0]}
          verticalCompact={true}
          compactType="vertical"
          isDraggable={isEditMode}
          isResizable={false}
          preventCollision={false}
          measureBeforeMount={true}
          onLayoutChange={(layout, layouts) => {
            //console.log('onLayoutChange', layouts);
            //            updateHeights(heights)
            dispatch(updateEntireLayout(layouts));
          }}
          onBreakpointChange={bp => {
            console.log('onBreakpointChange', bp);
            setBreakpointCurrent(bp);
          }}
          onWidthChange={
            _.debounce(containerWidth => updateHeights(heights), 100)

            //
          }
        >
          {layouts[breakpointCurrent].map((container, index) => {
            //            console.log('container in RGL', container)
            //border:'1px dotted white',
            const containerData = dashboard[index];
            //            console.log('dashboard[index] in RGL', dashboard[index])
            return (
              <div key={index}>
                <div
                  ref={el => (inputRef.current[index] = el)}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    //border: '1px dotted #aaa',
                    //boxSizing:'content-box',
                    margin: `${gapContainers / 2}px`,
                    //backgroundColor: 'green',
                    gap: `${gapWidgets}px`,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                  }}
                >
                  {containerData.widgets
                    .sort(sortByOrder)
                    .map((widget, index) => {
                      //                      console.log('widget in RGL', widget);
                      let w;
                      switch (widget.widget) {
                        case 'ImageBox':
                          w = <W_ImageBox key={index} i={index} {...widget} />;
                          break;
                        case 'Vibration':
                          w = <W_Vibration key={index} i={index} {...widget} />;
                          break;
                        case 'DataChart':
                          w = <W_DataChart key={index} i={index} {...widget} />;
                          break;
                        case 'ObjectTable':
                          w = (
                            <W_ObjectTable key={index} i={index} {...widget} />
                          );
                          break;
                        case 'GroupTable':
                          w = (
                            <W_GroupTable key={index} i={index} {...widget} />
                          );
                          break;
                        case 'Title':
                          w = <W_Title key={index} i={index} {...widget} />;
                          break;
                        case 'DateTime':
                          w = <W_DateTime key={index} i={index} {...widget} />;
                          break;
                        case 'Counter':
                          w = <W_Counter key={index} i={index} {...widget} />;
                          break;
                        case 'DataBox':
                          w = <W_DataBox key={index} i={index} {...widget} />;
                          break;
                        case 'DataBoxAdvanced':
                          w = (
                            <W_DataBoxAdvanced
                              key={index}
                              i={index}
                              {...widget}
                            />
                          );
                          break;

                        case 'Slider':
                          w = <W_Slider key={index} i={index} {...widget} />;
                          break;
                        case 'Switcher':
                          w = <W_Switcher key={index} i={index} {...widget} />;
                          break;
                        case 'CommandButton':
                          w = (
                            <W_CommandButton
                              key={index}
                              i={index}
                              {...widget}
                            />
                          );
                          break;
                        case 'Indicator':
                          w = <W_Indicator key={index} i={index} {...widget} />;
                          break;
                        case 'WeatherBox':
                          w = (
                            <W_WeatherBox key={index} i={index} {...widget} />
                          );
                          break;
                        default:
                          console.log('Unknown widget type');
                      }

                      return w;
                    })}
                </div>
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </div>
    </>
  );
});
export default Widgets;
