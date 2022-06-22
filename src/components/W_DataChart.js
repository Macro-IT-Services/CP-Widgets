import React, { useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { useTheme } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { parseISO, format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import useColors from '../utils/useColors';
import WidgetEditControls from './WidgetEditControls';

import { highlightSelectedStyle } from '../constants';

import { GET_DATA_SUBSCRIPTION } from '../queries';

const useStyles = makeStyles(theme => ({
  table: {
    //    color: theme.palette.white,

    backgroundColor: '#2780E3',
    height: '100%',
    //display: 'block',
    //overflow: 'scroll',
    //tableLayout: 'fixed',
    //    width:'100%',
  },
  tableCell: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    borderBottom: 'none',
    fontSize: '16px',
  },
}));

const W_DataChart = props => {
  const {
    //    wide = true,
    //    height = 300,
    title,
    //    colors = [],
    table = false,
    id,
    groupId,
    //    simulation,
    objectProperties,
    selected,
  } = props;
  //  console.log('W_DataChart props', props);
  const client = useApolloClient();

  const getPropValue = prop =>
    objectProperties.find(obj => obj.key === prop)?.value;

  const mode = getPropValue('settingsMode'); //chart, legend
  const size = getPropValue('settingsSize');
  //  const size="small";

  //  const wide = objectProperties.find(obj => obj.key === 'settingsFullLine')?.value || true;

  const wide = getPropValue('settingsFullLine');
  const newLine = getPropValue('settingsNewLine');
  //const timeInterval = getPropValue('settingsTimeInterval');

  //[{"x": "A","y": 20}, {"x": "B","y": 30},{"x": "C","y": null},{"x": "D","y": 10},{"x": "E","y": 10}]
  const valueInitial = getPropValue('valueChart1').map(value => {    return { x: value.x, y: value.y };  });

  //const valueInitial = [];


  //  console.log('valueInitial',valueInitial)
  const simulation = getPropValue('settingsSimulation');
  //  console.log('simulation',simulation)
  //const simulation = objectProperties.find(    obj => obj.key === 'settingsSimulation'  )?.value;
  const colors = [getPropValue('settingsStyle'), null]; // [colorScheme = 'darkOnLight', colorReplace = null]
  const [fgColor, bgColor] = useColors(colors);

  const theme = useTheme();
  const classes = useStyles();

  const rndRange = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const dataSimulated = () => [
    {
      x: 1633096800000,
      y: rndRange(0, 100),
    },
    {
      x: 1633101400000,
      y: rndRange(0, 100),
    },
    {
      x: 1633103000000,
      y: rndRange(0, 100),
    },
    {
      x: 1633107100000,
      y: rndRange(0, 100),
    },
    {
      x: 1633111200000,
      y: rndRange(0, 100),
    },
    {
      x: 1633113800000,
      y: rndRange(0, 100),
    },
    {
      x: 1633118400000,
      y: rndRange(0, 100),
    },
  ];


  const [value, setValue] = useState(simulation ? dataSimulated() : valueInitial);
//  console.log('value', value);
  const valueMinData = Math.min(...value.map(item => item.x), Infinity);
  //const valueMin = 1637283100000;
  const valueMax = Math.max(...value.map(item => item.x), 0);

  const valueMin = new Date(valueMinData).setMinutes(0, 0, 0);
//  valueMinDt.setHours(valueMinDt.getHours() );
//  valueMinDt.setMinutes(0, 0, 0); // Resets also seconds and milliseconds
//console.log('valueMin', valueMin);
//console.log('valueMax', valueMax);
//console.log('valueMinDt',valueMin);

  const simData = useSelector(state => state.settings.simData);

  useEffect(() => {
    const observer = client.subscribe({
      query: GET_DATA_SUBSCRIPTION,
      variables: { objId: id },
      // shouldResubscribe: true (default: false)
    });

    const subscription = observer.subscribe(({ data }) => {
      //      console.log('SUBSCRIBE received', data)
      console.log('W_Datachart subscription new data:', id, data.Objects);

      if (data.Objects.relatedNode?.key === 'valueChart1') {
        setValue(
          data.Objects.relatedNode?.value.map(value => {
            return { x: value.x, y: value.y };
          })
        );
        console.log('valueChart1', data.Objects.relatedNode?.value);
      } else {
        console.log(
          'key is not valueChart1. Should we update other properties of widget here?'
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [id]);

  let total_px = 0,
    font_px = 0;
  //    console.log('size',size)
  switch (size) {
    case 'small':
      total_px = '96';
      font_px = '20';
      break;
    case 'medium':
      total_px = '192';
      font_px = '26';
      break;
    case 'large':
      total_px = '384';
      font_px = '36';
      break;
    default:
      console.log('unknown size:', size);
  } //switch



  const ticks = () => {
    
    const step = 3600000;
    const total = Math.floor((valueMax - valueMin) / step);
//    console.log('total', total);
    let tmpTicks = [];

    for (let i = 0; i <= total; i++) {
      tmpTicks.push(valueMin + i * step);
    }
//    console.log('tmpTicks', tmpTicks);
    tmpTicks[0] = valueMinData; // first tick have to be real first value, but others rounded to one hour boundary
    return tmpTicks;
  };

  const CustomTooltip = ({ active, payload, label, color }) => {
    //console.log('CustomTooltip', active);
    //console.log('CustomTooltip', payload);
    //console.log('CustomTooltip', label);
    if (active && payload?.[0] && payload.length) {
      let timestamp = format(label, 'MMM dd, y, HH:mm:ss');
      return (
        <div className="custom-tooltip">
          <p
            className="label"
            style={{ color: color }}
          >{`${timestamp} : ${payload?.[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div
        style={{
          margin: '2px',
          display: 'flex',
          flexDirection: 'column',

          justifyContent: 'flex-start',
          alignItems: 'flex-start',

          flexBasis: wide ? '100%' : 'auto',
          flexGrow: 1,
          position: 'relative',
          height: `${total_px}px`,
          backgroundColor: bgColor,
          //paddingRight: '20px',
          overflow: 'hidden',
          filter: selected ? highlightSelectedStyle : '',
          borderRadius: '2px',
        }}
      >
        {title && (
          <div
            style={{
              height: '36px',
              fontSize: '20px',
              backgroundColor: bgColor,
              color: fgColor,
              marginTop: '5px',
              alignSelf: 'center',
            }}
          >
            {title}
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%" minWidth="0">
          <LineChart
            data={value}
            margin={{ top: 20, bottom: 10, right: 20 }}
          >
            <CartesianGrid stroke={'rgba(255, 255, 255, 0.31)'} />

            {(value.length>0) && <XAxis
              type="number"
              dataKey="x"
              unit=""
              ticks={ticks()}
              //           scale="time" - brakes ticks positioning
              domain={['dataMin', 'dataMax']}
              tickFormatter={ut => format(ut, 'HH:mm')}
              stroke={fgColor}
              interval="preserveStartEnd"
            />}
            {(value.length>0) && <YAxis
              domain={['auto', 'auto']}
              type="number"
              dataKey="y"
              unit=""
              stroke={fgColor}
            />}

            <Tooltip content={<CustomTooltip color={fgColor} />} />

            <Line type="monotone" connectNulls dataKey="y" stroke={fgColor} />
          </LineChart>
        </ResponsiveContainer>

        {table && (
          <div style={{ width: '100%' }}>
            <Table
              size="small"
              className={classes.table}
              aria-label="simple table"
              style={{ backgroundColor: 'transparent' }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    className={classes.tableCell}
                    style={{ color: fgColor }}
                  >
                    Label
                  </TableCell>
                  <TableCell
                    align="center"
                    className={classes.tableCell}
                    style={{ color: fgColor }}
                  >
                    Current
                  </TableCell>
                  <TableCell
                    align="center"
                    className={classes.tableCell}
                    style={{ color: fgColor }}
                  >
                    Min
                  </TableCell>
                  <TableCell
                    align="center"
                    className={classes.tableCell}
                    style={{ color: fgColor }}
                  >
                    Max
                  </TableCell>
                  <TableCell
                    align="center"
                    className={classes.tableCell}
                    style={{ color: fgColor }}
                  >
                    Av
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(4).keys()].map(row => (
                  <TableRow
                    key={row}
                    style={
                      row % 2
                        ? { backgroundColor: bgColor }
                        : { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                    }
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      className={classes.tableCell}
                      style={{ color: fgColor }}
                    >
                      Obj {row}
                    </TableCell>
                    <TableCell
                      align="center"
                      className={classes.tableCell}
                      style={{ color: fgColor }}
                    >
                      {rndRange(1, 10) / 2}
                    </TableCell>
                    <TableCell
                      align="center"
                      className={classes.tableCell}
                      style={{ color: fgColor }}
                    >
                      false
                    </TableCell>
                    <TableCell
                      align="center"
                      className={classes.tableCell}
                      style={{ color: fgColor }}
                    >
                      {rndRange(1, 10) / 2}
                    </TableCell>
                    <TableCell
                      align="center"
                      className={classes.tableCell}
                      style={{ color: fgColor }}
                    >
                      {rndRange(1, 10) / 2}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

export default W_DataChart;
