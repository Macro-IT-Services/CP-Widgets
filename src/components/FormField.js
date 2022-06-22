import React, { useState, useEffect } from 'react';
//import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import CustomInput from '../components/CustomInput';
import CustomSelect from '../components/CustomSelect';
import CustomSelectIcon from '../components/CustomSelectIcon';
import CustomSwitch from '../components/CustomSwitch';
import CustomTags from '../components/CustomTags';

//import { Button, Typography, Box } from '@material-ui/core';
//import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { msg } from '../messages';

const FormField = props => {
  const { values, field, handleInputChange } = props;

  const theme = useTheme();

  //const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const useStyles = makeStyles(theme => ({
    obsoleted: {
      background:
        'repeating-linear-gradient(-45deg,#222,#222 10px,#333 10px,#333 20px)',
    },
  }));

  const classes = useStyles();

  // for forms
  //  const [fieldTest, setFieldTest] = useState('dark');
  //const [values, setValue] = useReducer( (prev, updated) => ({...prev, ...updated}), { password1: '', password2: '', password: '', theme: 'light' } );

  //  const settings = useSelector(state => state.settings);
  //  const dispatch = useDispatch();

  //console.log('+field', field)
  //console.log('+component', field.valueSet?.component)
  //  console.log('values', values)
  //new approach, based on json inside valueSet
  if (field.valueSet?.component) {
    switch (field.valueSet.component) {
      case 'select':
        return (
          <Grid item key={field.key}>
            <CustomSelect
              name={field.key}
              label={
                field.description + (!field.description ? `(${field.key})` : '')
              }
              list={field.valueSet.list.map(item => {
                return { title: item.title, value: item.key };
              })}
              value={values[field.key] ?? ''}
              onChange={handleInputChange}
            />
          </Grid>
        );
        break;
      /*
this obsoleted list prop of CustomSelectIcon. Now list of icons (not icons itself!) loaded inside App.js into the state.settings.icons (on web app load)
              list={field.valueSet.list.map(item => {
                return { title: item.title, value: item.key };
              })}
*/

      case 'selecticon':
        return (
          <Grid item key={field.key}>
            <CustomSelectIcon
              name={field.key}
              label={
                field.description + (!field.description ? `(${field.key})` : '')
              }
              value={values[field.key] ?? ''}
              onChange={handleInputChange}
            />
          </Grid>
        );
        break;

      case 'text':
        return (
          <Grid item key={field.key}>
            <CustomInput
              name={field.key}
              label={
                field.description + (!field.description ? `(${field.key})` : '')
              }
              clearFieldIcon={true}
              value={values[field.key] ?? ''}
              onChange={handleInputChange}
            />
          </Grid>
        );
        break;
      case 'number':
        //console.log('+field', field)
        return (
          <Grid item key={field.key}>
            <CustomInput
              name={field.key}
              label={
                field.description + (!field.description ? `(${field.key})` : '')
              }
              clearFieldIcon={true}
              value={values[field.key] ?? ''}
              onChange={handleInputChange}
              type="number"
              min={field.valueRange?.min}
              max={field.valueRange?.max}
            />
          </Grid>
        );
        break;
      case 'textmulti':
        return (
          <Grid item key={field.key}>
            <CustomInput
              name={field.key}
              label={
                field.description + (!field.description ? `(${field.key})` : '')
              }
              clearFieldIcon={true}
              multiline
              rows={4}
              value={values[field.key] ?? ''}
              onChange={handleInputChange}
            />
          </Grid>
        );
        break;
      case 'switch':
        return (
          <Grid
            item
            container
            justify="space-between"
            alignItems="center"
            key={field.key}
          >
            <CustomSwitch
              name={field.key}
              label={
                field.description + (!field.description ? `(${field.key})` : '')
              }
              value={values[field.key] ?? ''}
              onChange={handleInputChange}
            />
          </Grid>
        );
        break;
      default:
        console.log('unknown component type ', field.valueSet.component);
    }
  } // if
  // old approach, based only on type.name (valueSet ignored)
  else {
    if (field.type.name === 'bool')
      return (
        <Grid
          item
          container
          justify="space-between"
          alignItems="center"
          key={field.key}
          className={classes.obsoleted}
        >
          <CustomSwitch
            name={field.key}
            label={
              field.description + (!field.description ? `(${field.key})` : '')
            }
            value={values[field.key] ?? ''}
            onChange={handleInputChange}
          />
        </Grid>
      );
    else if (field.type.name === 'string')
      return (
        <Grid item key={field.key} className={classes.obsoleted}>
          <CustomInput
            name={field.key}
            label={
              field.description + (!field.description ? `(${field.key})` : '')
            }
            clearFieldIcon={true}
            value={values[field.key] ?? ''}
            onChange={handleInputChange}
          />
        </Grid>
      );
    else if (field.type.name === 'number')
      return (
        <Grid item key={field.key} className={classes.obsoleted}>
          <CustomInput
            name={field.key}
            label={
              field.description + (!field.description ? `(${field.key})` : '')
            }
            clearFieldIcon={true}
            value={values[field.key] ?? ''}
            type="number"
            min={field.valueRange?.min}
            max={field.valueRange?.max}
            onChange={handleInputChange}
          />
        </Grid>
      );
    else console.log('unknown component type in type.name ', field.type);
  } // else (old approach)
};

export default React.memo(FormField);
