import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '@material-ui/core/styles';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import { ReactComponent as ImgCar } from '../assets/car.svg';

import { useSelector } from 'react-redux';
import _ from 'lodash';

import { highlightSelectedStyle } from '../constants';

import useColors from '../utils/useColors';
import WidgetEditControls from './WidgetEditControls';

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

  tableCellHead: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    borderBottom: 'none',
    fontSize: '16px',
    fontFamily: 'Roboto-Medium',
  },

  tableCell: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    borderBottom: 'none',
    //    borderBottomColor: 'white',
    fontSize: '16px',
    fontFamily: 'Roboto-Regular',
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const W_GroupTable = props => {
  const {
    //    wide,
    //    colors = [],
    title,
    id,
    groupId,
    //    simulation,
    objectProperties,
    selected,
  } = props;

  const getPropValue = prop =>
    objectProperties.find(obj => obj.key === prop)?.value;

  //  const valueInitial = objectProperties.find(obj => obj.key === "valueValue")?.value;
  //  const mode = objectProperties.find(obj => obj.key === "settingsFormat")?.value || 'icon_value';
  const wide = objectProperties.find(obj => obj.key === 'settingsFullLine')
    ?.value;
  const simulation = objectProperties.find(
    obj => obj.key === 'settingsSimulation'
  )?.value;
  const colors = [getPropValue('settingsStyle'), null]; // [colorScheme = 'darkOnLight', colorReplace = null]
  const [fgColor, bgColor] = useColors(colors);

  const [value, setValue] = useState(0);

  const simData = useSelector(state => state.settings.simData);

  const theme = useTheme();

  const classes = useStyles();

  const rndRange = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const rnd = () => rndRange(0, 30);
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
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        //        width: props.wide ? '100%' : '96px',
        //        flexBasis: props.wide ? '100%' : 'auto',
        flexBasis: wide ? '100%' : 'auto',
        flexGrow: 1,
        position: 'relative',
        //  height: height,
        //        minWidth: 0,
        overflow: 'auto',
        //        border: '1px dotted yellow',
        //        backgroundColor: theme.palette.wBlue,
        backgroundColor: bgColor,
        filter: selected ? highlightSelectedStyle : '',
        borderRadius: '2px',
      }}
    >
      {title && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            //          flexBasis: '100%',
            //          flexGrow: 1,
            height: '48px',
            width: '100%',
            //          border: '1px dotted yellow',
          }}
        >
          <Typography
            style={{
              fontSize: '20px',
              fontFamily: 'Roboto-Medium',
              lineHeight: '24px',
              color: fgColor,
            }}
          >
            {title}
          </Typography>
        </div>
      )}

      <div style={{ width: '100%' }}>
        <Table
          size="small"
          className={classes.table}
          aria-label="simple table"
          style={{ backgroundColor: 'transparent' }}
        >
          <TableHead style={{ height: '48px' }}>
            <TableRow>
              <TableCell
                className={classes.tableCellHead}
                style={{ color: fgColor }}
              ></TableCell>
              <TableCell
                align="center"
                className={classes.tableCellHead}
                style={{ color: fgColor }}
              >
                Field 1
              </TableCell>
              <TableCell
                align="center"
                className={classes.tableCellHead}
                style={{ color: fgColor }}
              >
                Field 2
              </TableCell>
              <TableCell
                align="center"
                className={classes.tableCellHead}
                style={{ color: fgColor }}
              >
                Field 3
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              style={{
                height: '48px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <TableCell
                component="th"
                scope="row"
                className={classes.tableCell}
                style={{ color: fgColor }}
              >
                <ImgCar
                  style={{
                    height: '16px',
                    width: 'auto',
                    color: fgColor,
                    marginBottom: '-2px',
                    marginRight: '15px',
                  }}
                />
                Label
              </TableCell>
              <TableCell
                align="center"
                className={classes.tableCell}
                style={{ color: fgColor }}
              >
                {simulation ? rndRange(1, 10) / 2 : value}
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
                {simulation ? rndRange(1, 10) / 2 : value}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <WidgetEditControls {...props} />
    </div>
  );
};

export default W_GroupTable;
