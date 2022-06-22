import React, { useReducer, useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import { useApolloClient } from '@apollo/client';

import groupNames from '../utils/groupNames';

import {
  enqueueSnackbar as enqueueSnackbarAction,
  //    closeSnackbar as closeSnackbarAction,
} from '../actions';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Switch from '@material-ui/core/Switch';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { setSettings } from '../actions';

import CommonModal from '../components/CommonModal';
import Subtitle from '../components/Subtitle';

import CustomInput from '../components/CustomInput';
import CustomSelect from '../components/CustomSelect';
import CustomSelectColor from '../components/CustomSelectColor';
import CustomSwitch from '../components/CustomSwitch';
import CustomTags from '../components/CustomTags';

import FormField from '../components/FormField';

import { setContext } from '../actions';

//import { UPDATE_WIDGET_MUTATION } from '../queries';
import { WIDGET_QUERY } from '../queries';

import { msg } from '../messages';

import { ReactComponent as ImgUpload } from '../assets/upload.svg';

const styles = theme => ({
  alertHeadline: {
    //    marginTop: '15px',
  },
  alertLabel: {
    //marginTop: '15px',
    color: theme.palette.label,
  },
});

const EditWidgetAlarmsModal = props => {
  const { modalState, setModalState, handleUpdateWidgetProps } = props;

  //  console.log('EditWidgetModal props modalState', modalState);

  const theme = useTheme();
  const client = useApolloClient();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const useStyles = makeStyles(theme => styles(theme));
  const classes = useStyles();

  const [name, setName] = useState('');
  const [schemaName, setSchemaName] = useState('');
  const [description, setDescription] = useState('');

  const [fields, setFields] = useState([]);

  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));

  let defaultValues = {};

  // for forms
  //  const [fieldTest, setFieldTest] = useState('dark');
  const [values, setValues] = useReducer(
    (prev, updated) => ({ ...prev, ...updated }),
    defaultValues
  );

  useEffect(() => {
    const queryProps = async () => {
      try {
        console.log('EditWidgetAlarmsModal widgetId', modalState.widgetId);

        const result = await client.query({
          query: WIDGET_QUERY,
          variables: { objId: modalState.widgetId, groupName: 'Alarms' },
          fetchPolicy: 'network-only',
        });

        //        console.log('widgets props result count', result.data.objects.length);

        console.log('widget result', result.data.object); // description, key, hidden, type

        const getPropValue = prop =>
          result.data.object.objectProperties.find(obj => obj.key === prop)
            ?.value;

        //console.log('EditWidgetAlarmsModal alarmsAlert1',getPropValue('alarmsAlert1').condition)
        // Alert 1
        defaultValues['alarmsAlert1_condition_value'] = getPropValue(
          'alarmsAlert1'
        ).condition.value;
        defaultValues['alarmsAlert1_condition_operator'] = getPropValue(
          'alarmsAlert1'
        ).condition.operator;
        defaultValues['alarmsAlert1_timeout_units'] = getPropValue(
          'alarmsAlert1'
        ).timeout.units;
        defaultValues['alarmsAlert1_timeout_value'] = getPropValue(
          'alarmsAlert1'
        ).timeout.value;

        defaultValues['alarmsAlert1_timeIntervalInMinutes_from_h'] = Math.floor(
          getPropValue('alarmsAlert1').timeIntervalInMinutes.from / 60
        );
        defaultValues['alarmsAlert1_timeIntervalInMinutes_from_m'] =
          getPropValue('alarmsAlert1').timeIntervalInMinutes.from % 60;

        defaultValues['alarmsAlert1_timeIntervalInMinutes_to_h'] = Math.floor(
          getPropValue('alarmsAlert1').timeIntervalInMinutes.to / 60
        );
        defaultValues['alarmsAlert1_timeIntervalInMinutes_to_m'] =
          getPropValue('alarmsAlert1').timeIntervalInMinutes.to % 60;

        // Alert 2
        defaultValues['alarmsAlert2_condition_value'] = getPropValue(
          'alarmsAlert2'
        ).condition.value;
        defaultValues['alarmsAlert2_condition_operator'] = getPropValue(
          'alarmsAlert2'
        ).condition.operator;
        defaultValues['alarmsAlert2_timeout_units'] = getPropValue(
          'alarmsAlert2'
        ).timeout.units;
        defaultValues['alarmsAlert2_timeout_value'] = getPropValue(
          'alarmsAlert2'
        ).timeout.value;

        defaultValues['alarmsAlert2_timeIntervalInMinutes_from_h'] = Math.floor(
          getPropValue('alarmsAlert2').timeIntervalInMinutes.from / 60
        );
        defaultValues['alarmsAlert2_timeIntervalInMinutes_from_m'] =
          getPropValue('alarmsAlert2').timeIntervalInMinutes.from % 60;

        defaultValues['alarmsAlert2_timeIntervalInMinutes_to_h'] = Math.floor(
          getPropValue('alarmsAlert2').timeIntervalInMinutes.to / 60
        );
        defaultValues['alarmsAlert2_timeIntervalInMinutes_to_m'] =
          getPropValue('alarmsAlert2').timeIntervalInMinutes.to % 60;

        // Alert 3
        defaultValues['alarmsAlert3_condition_value'] = getPropValue(
          'alarmsAlert3'
        ).condition.value;
        defaultValues['alarmsAlert3_condition_operator'] = getPropValue(
          'alarmsAlert3'
        ).condition.operator;
        defaultValues['alarmsAlert3_timeout_units'] = getPropValue(
          'alarmsAlert3'
        ).timeout.units;
        defaultValues['alarmsAlert3_timeout_value'] = getPropValue(
          'alarmsAlert3'
        ).timeout.value;

        defaultValues['alarmsAlert3_timeIntervalInMinutes_from_h'] = Math.floor(
          getPropValue('alarmsAlert3').timeIntervalInMinutes.from / 60
        );
        defaultValues['alarmsAlert3_timeIntervalInMinutes_from_m'] =
          getPropValue('alarmsAlert3').timeIntervalInMinutes.from % 60;

        defaultValues['alarmsAlert3_timeIntervalInMinutes_to_h'] = Math.floor(
          getPropValue('alarmsAlert3').timeIntervalInMinutes.to / 60
        );
        defaultValues['alarmsAlert3_timeIntervalInMinutes_to_m'] =
          getPropValue('alarmsAlert3').timeIntervalInMinutes.to % 60;

        console.log('widget defaultValues', defaultValues);

        setValues(defaultValues); // loaded values for each field
      } catch (err) {
        console.log('widgets props error', err);
        enqueueSnackbar({
          message: err.toString(),
          options: { code: 'UNKNOWN', variant: 'error' },
        });
      } finally {
      }
    }; //queryProps

    if (modalState.open) queryProps();
  }, [modalState.open]);

  const dispatch = useDispatch();

  const handleClose = () => setModalState({ ...modalState, open: false });

  const handleInputChange = e => {
    console.log('handleInputChange e', e);

    let { name, value, checked } = e.target;
    //       console.log(name, value, checked);

    // for <Switch/>
    if (checked) value = checked;

    setValues({ [name]: value });

    //  console.log('STATE', values);
  };

  if (Object.keys(values).length === 0) return false; //to prevent react warning ("uncontrolled components...")
  return (
    <>
      <CommonModal
        modalOpen={modalState.open}
        title={msg.editWidgetAlarmsModal.alarms}
        forceTitle={true}
        contentStyles={{
          padding: '14px 16px 16px 14px',
        }}
        setModalOpen={handleClose}
        buttons={[
          { title: msg.editWidgetModal.buttonCancel, cb: handleClose },
          {
            title: msg.editWidgetModal.buttonUpdate,
            cb: () => {
              console.log('values', values);

              // merge some values together into one json property
              const valuesReady = [
                {
                  propertyKey: 'alarmsAlert1',
                  value: {
                    condition: {
                      operator: values.alarmsAlert1_condition_operator,
                      value: values.alarmsAlert1_condition_value,
                    },
                    timeout: {
                      units: values.alarmsAlert1_timeout_units,
                      value: values.alarmsAlert1_timeout_value,
                    },
                    timeIntervalInMinutes: {
                      from:
                        values.alarmsAlert1_timeIntervalInMinutes_from_h * 60 +
                        values.alarmsAlert1_timeIntervalInMinutes_from_m,
                      to:
                        values.alarmsAlert1_timeIntervalInMinutes_to_h * 60 +
                        values.alarmsAlert1_timeIntervalInMinutes_to_m,
                    },
                  },
                },

                {
                  propertyKey: 'alarmsAlert2',
                  value: {
                    condition: {
                      operator: values.alarmsAlert2_condition_operator,
                      value: values.alarmsAlert2_condition_value,
                    },
                    timeout: {
                      units: values.alarmsAlert2_timeout_units,
                      value: values.alarmsAlert2_timeout_value,
                    },
                    timeIntervalInMinutes: {
                      from:
                        values.alarmsAlert2_timeIntervalInMinutes_from_h * 60 +
                        values.alarmsAlert2_timeIntervalInMinutes_from_m,
                      to:
                        values.alarmsAlert2_timeIntervalInMinutes_to_h * 60 +
                        values.alarmsAlert2_timeIntervalInMinutes_to_m,
                    },
                  },
                },

                {
                  propertyKey: 'alarmsAlert3',
                  value: {
                    condition: {
                      operator: values.alarmsAlert3_condition_operator,
                      value: values.alarmsAlert3_condition_value,
                    },
                    timeout: {
                      units: values.alarmsAlert3_timeout_units,
                      value: values.alarmsAlert3_timeout_value,
                    },
                    timeIntervalInMinutes: {
                      from:
                        values.alarmsAlert3_timeIntervalInMinutes_from_h * 60 +
                        values.alarmsAlert3_timeIntervalInMinutes_from_m,
                      to:
                        values.alarmsAlert3_timeIntervalInMinutes_to_h * 60 +
                        values.alarmsAlert3_timeIntervalInMinutes_to_m,
                    },
                  },
                },
              ];

              console.log('valuesReady', valuesReady);

              handleUpdateWidgetProps({
                widgetId: modalState.widgetId,
                values: valuesReady,
              });

              //              setModalState({ open: false });
              setModalState({ ...modalState, open: false });
            },
          },
        ]}
      >
        <Grid container direction="column" spacing={2}>
          {/* alert 1 */}

          <Grid item>
            <Typography
              variant="subtitle1"
              color="primary"
              className={classes.alertHeadline}
            >{`${msg.editWidgetAlarmsModal.alert} 1`}</Typography>
          </Grid>

          <Grid item container>
            <Grid item xs={6} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="alarmsAlert1_condition_operator"
                label={msg.editWidgetAlarmsModal.alarmCondition}
                list={[
                  { value: '>', title: '>' },
                  { value: '<', title: '<' },
                  { value: '=', title: '=' },
                  { value: '!=', title: '!=' },
                  {
                    value: 'contains',
                    title: msg.editWidgetAlarmsModal.contains,
                  },
                ]}
                value={values['alarmsAlert1_condition_operator']}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomInput
                name="alarmsAlert1_condition_value"
                label="&nbsp;"
                clearFieldIcon={false}
                value={values['alarmsAlert1_condition_value']}
                onChange={handleInputChange}
                type="text"
              />
            </Grid>
          </Grid>

          <Grid item>
            <Typography
              variant="body1"
              color="primary"
              className={classes.alertLabel}
            >
              {msg.editWidgetAlarmsModal.allowedTime}
            </Typography>
          </Grid>

          <Grid item container>
            <Grid item xs={6} style={{ paddingRight: '10px' }}>
              <CustomInput
                name="alarmsAlert1_timeout_units"
                label=""
                clearFieldIcon={false}
                value={values['alarmsAlert1_timeout_units']}
                onChange={handleInputChange}
                type="number"
              />
            </Grid>

            <Grid item xs={6}>
              <CustomSelect
                name="alarmsAlert1_timeout_value"
                label=""
                list={[
                  {
                    value: 'minutes',
                    title: msg.editWidgetAlarmsModal.minutes,
                  },
                  {
                    value: 'seconds',
                    title: msg.editWidgetAlarmsModal.seconds,
                  },
                ]}
                value={values['alarmsAlert1_timeout_value']}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          <Grid item>
            <Typography variant="body1" className={classes.alertLabel}>
              {msg.editWidgetAlarmsModal.alarmTimeInterval}
            </Typography>
          </Grid>

          {/* from h,m */}

          <Grid item container>
            <Grid item container xs={2} alignItems="flex-end">
              <Typography variant="body1" className={classes.alertLabel}>
                {msg.editWidgetAlarmsModal.from}
              </Typography>
            </Grid>

            <Grid item xs={5} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="alarmsAlert1_timeIntervalInMinutes_from_h"
                label=""
                list={[
                  { value: 0, title: '00 h' },
                  { value: 1, title: '01 h' },
                  { value: 2, title: '02 h' },
                  { value: 3, title: '03 h' },
                  { value: 4, title: '04 h' },
                  { value: 5, title: '05 h' },
                  { value: 6, title: '06 h' },
                  { value: 7, title: '07 h' },
                  { value: 8, title: '08 h' },
                  { value: 9, title: '09 h' },
                  { value: 10, title: '10 h' },
                  { value: 11, title: '11 h' },
                  { value: 12, title: '12 h' },
                  { value: 13, title: '13 h' },
                  { value: 14, title: '14 h' },
                  { value: 15, title: '15 h' },
                  { value: 16, title: '16 h' },
                  { value: 17, title: '17 h' },
                  { value: 18, title: '18 h' },
                  { value: 19, title: '19 h' },
                  { value: 20, title: '20 h' },
                  { value: 21, title: '21 h' },
                  { value: 22, title: '22 h' },
                  { value: 23, title: '23 h' },
                ]}
                value={values['alarmsAlert1_timeIntervalInMinutes_from_h']}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={5} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="alarmsAlert1_timeIntervalInMinutes_from_m"
                label=""
                list={[
                  { value: 0, title: '00 m' },
                  { value: 1, title: '01 m' },
                  { value: 2, title: '02 m' },
                  { value: 3, title: '03 m' },
                  { value: 4, title: '04 m' },
                  { value: 5, title: '05 m' },
                  { value: 6, title: '06 m' },
                  { value: 7, title: '07 m' },
                  { value: 8, title: '08 m' },
                  { value: 9, title: '09 m' },
                  { value: 10, title: '10 m' },
                  { value: 11, title: '11 m' },
                  { value: 12, title: '12 m' },
                  { value: 13, title: '13 m' },
                  { value: 14, title: '14 m' },
                  { value: 15, title: '15 m' },
                  { value: 16, title: '16 m' },
                  { value: 17, title: '17 m' },
                  { value: 18, title: '18 m' },
                  { value: 19, title: '19 m' },
                  { value: 20, title: '20 m' },
                  { value: 21, title: '21 m' },
                  { value: 22, title: '22 m' },
                  { value: 23, title: '23 m' },
                  { value: 24, title: '24 m' },
                  { value: 25, title: '25 m' },
                  { value: 26, title: '26 m' },
                  { value: 27, title: '27 m' },
                  { value: 28, title: '28 m' },
                  { value: 29, title: '29 m' },

                  { value: 30, title: '30 m' },
                  { value: 31, title: '31 m' },
                  { value: 32, title: '32 m' },
                  { value: 33, title: '33 m' },
                  { value: 34, title: '34 m' },
                  { value: 35, title: '35 m' },
                  { value: 36, title: '36 m' },
                  { value: 37, title: '37 m' },
                  { value: 38, title: '38 m' },
                  { value: 39, title: '39 m' },

                  { value: 40, title: '40 m' },
                  { value: 41, title: '41 m' },
                  { value: 42, title: '42 m' },
                  { value: 43, title: '43 m' },
                  { value: 44, title: '44 m' },
                  { value: 45, title: '45 m' },
                  { value: 46, title: '46 m' },
                  { value: 47, title: '47 m' },
                  { value: 48, title: '48 m' },
                  { value: 49, title: '49 m' },

                  { value: 50, title: '50 m' },
                  { value: 51, title: '51 m' },
                  { value: 52, title: '52 m' },
                  { value: 53, title: '53 m' },
                  { value: 54, title: '54 m' },
                  { value: 55, title: '55 m' },
                  { value: 56, title: '56 m' },
                  { value: 57, title: '57 m' },
                  { value: 58, title: '58 m' },
                  { value: 59, title: '59 m' },
                ]}
                value={values['alarmsAlert1_timeIntervalInMinutes_from_m']}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {/* to h,m */}

          <Grid item container>
            <Grid item container xs={2} alignItems="flex-end">
              <Typography variant="body1" className={classes.alertLabel}>
                {msg.editWidgetAlarmsModal.to}
              </Typography>
            </Grid>

            <Grid item xs={5} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="alarmsAlert1_timeIntervalInMinutes_to_h"
                label=""
                list={[
                  { value: 0, title: '00 h' },
                  { value: 1, title: '01 h' },
                  { value: 2, title: '02 h' },
                  { value: 3, title: '03 h' },
                  { value: 4, title: '04 h' },
                  { value: 5, title: '05 h' },
                  { value: 6, title: '06 h' },
                  { value: 7, title: '07 h' },
                  { value: 8, title: '08 h' },
                  { value: 9, title: '09 h' },
                  { value: 10, title: '10 h' },
                  { value: 11, title: '11 h' },
                  { value: 12, title: '12 h' },
                  { value: 13, title: '13 h' },
                  { value: 14, title: '14 h' },
                  { value: 15, title: '15 h' },
                  { value: 16, title: '16 h' },
                  { value: 17, title: '17 h' },
                  { value: 18, title: '18 h' },
                  { value: 19, title: '19 h' },
                  { value: 20, title: '20 h' },
                  { value: 21, title: '21 h' },
                  { value: 22, title: '22 h' },
                  { value: 23, title: '23 h' },
                ]}
                value={values['alarmsAlert1_timeIntervalInMinutes_to_h']}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={5} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="alarmsAlert1_timeIntervalInMinutes_to_m"
                label=""
                list={[
                  { value: 0, title: '00 m' },
                  { value: 1, title: '01 m' },
                  { value: 2, title: '02 m' },
                  { value: 3, title: '03 m' },
                  { value: 4, title: '04 m' },
                  { value: 5, title: '05 m' },
                  { value: 6, title: '06 m' },
                  { value: 7, title: '07 m' },
                  { value: 8, title: '08 m' },
                  { value: 9, title: '09 m' },
                  { value: 10, title: '10 m' },
                  { value: 11, title: '11 m' },
                  { value: 12, title: '12 m' },
                  { value: 13, title: '13 m' },
                  { value: 14, title: '14 m' },
                  { value: 15, title: '15 m' },
                  { value: 16, title: '16 m' },
                  { value: 17, title: '17 m' },
                  { value: 18, title: '18 m' },
                  { value: 19, title: '19 m' },
                  { value: 20, title: '20 m' },
                  { value: 21, title: '21 m' },
                  { value: 22, title: '22 m' },
                  { value: 23, title: '23 m' },
                  { value: 24, title: '24 m' },
                  { value: 25, title: '25 m' },
                  { value: 26, title: '26 m' },
                  { value: 27, title: '27 m' },
                  { value: 28, title: '28 m' },
                  { value: 29, title: '29 m' },

                  { value: 30, title: '30 m' },
                  { value: 31, title: '31 m' },
                  { value: 32, title: '32 m' },
                  { value: 33, title: '33 m' },
                  { value: 34, title: '34 m' },
                  { value: 35, title: '35 m' },
                  { value: 36, title: '36 m' },
                  { value: 37, title: '37 m' },
                  { value: 38, title: '38 m' },
                  { value: 39, title: '39 m' },

                  { value: 40, title: '40 m' },
                  { value: 41, title: '41 m' },
                  { value: 42, title: '42 m' },
                  { value: 43, title: '43 m' },
                  { value: 44, title: '44 m' },
                  { value: 45, title: '45 m' },
                  { value: 46, title: '46 m' },
                  { value: 47, title: '47 m' },
                  { value: 48, title: '48 m' },
                  { value: 49, title: '49 m' },

                  { value: 50, title: '50 m' },
                  { value: 51, title: '51 m' },
                  { value: 52, title: '52 m' },
                  { value: 53, title: '53 m' },
                  { value: 54, title: '54 m' },
                  { value: 55, title: '55 m' },
                  { value: 56, title: '56 m' },
                  { value: 57, title: '57 m' },
                  { value: 58, title: '58 m' },
                  { value: 59, title: '59 m' },
                ]}
                value={values['alarmsAlert1_timeIntervalInMinutes_to_m']}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {/* alert 2 */}

          <Grid item>
            <Typography
              variant="subtitle1"
              color="primary"
              className={classes.alertHeadline}
            >{`${msg.editWidgetAlarmsModal.alert} 2`}</Typography>
          </Grid>

          <Grid item container>
            <Grid item xs={6} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="alarmsAlert2_condition_operator"
                label={msg.editWidgetAlarmsModal.alarmCondition}
                list={[
                  { value: '>', title: '>' },
                  { value: '<', title: '<' },
                  { value: '=', title: '=' },
                  { value: '!=', title: '!=' },
                  {
                    value: 'contains',
                    title: msg.editWidgetAlarmsModal.contains,
                  },
                ]}
                value={values['alarmsAlert2_condition_operator']}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomInput
                name="alarmsAlert2_condition_value"
                label="&nbsp;"
                clearFieldIcon={false}
                value={values['alarmsAlert2_condition_value']}
                onChange={handleInputChange}
                type="text"
              />
            </Grid>
          </Grid>

          <Grid item>
            <Typography
              variant="body1"
              color="primary"
              className={classes.alertLabel}
            >
              {msg.editWidgetAlarmsModal.allowedTime}
            </Typography>
          </Grid>

          <Grid item container>
            <Grid item xs={6} style={{ paddingRight: '10px' }}>
              <CustomInput
                name="alarmsAlert2_timeout_units"
                label=""
                clearFieldIcon={false}
                value={values['alarmsAlert2_timeout_units']}
                onChange={handleInputChange}
                type="number"
              />
            </Grid>

            <Grid item xs={6}>
              <CustomSelect
                name="alarmsAlert2_timeout_value"
                label=""
                list={[
                  {
                    value: 'minutes',
                    title: msg.editWidgetAlarmsModal.minutes,
                  },
                  {
                    value: 'seconds',
                    title: msg.editWidgetAlarmsModal.seconds,
                  },
                ]}
                value={values['alarmsAlert2_timeout_value']}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          <Grid item>
            <Typography variant="body1" className={classes.alertLabel}>
              {msg.editWidgetAlarmsModal.alarmTimeInterval}
            </Typography>
          </Grid>

          {/* from h,m */}

          <Grid item container>
            <Grid item container xs={2} alignItems="flex-end">
              <Typography variant="body1" className={classes.alertLabel}>
                {msg.editWidgetAlarmsModal.from}
              </Typography>
            </Grid>

            <Grid item xs={5} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="alarmsAlert2_timeIntervalInMinutes_from_h"
                label=""
                list={[
                  { value: 0, title: '00 h' },
                  { value: 1, title: '01 h' },
                  { value: 2, title: '02 h' },
                  { value: 3, title: '03 h' },
                  { value: 4, title: '04 h' },
                  { value: 5, title: '05 h' },
                  { value: 6, title: '06 h' },
                  { value: 7, title: '07 h' },
                  { value: 8, title: '08 h' },
                  { value: 9, title: '09 h' },
                  { value: 10, title: '10 h' },
                  { value: 11, title: '11 h' },
                  { value: 12, title: '12 h' },
                  { value: 13, title: '13 h' },
                  { value: 14, title: '14 h' },
                  { value: 15, title: '15 h' },
                  { value: 16, title: '16 h' },
                  { value: 17, title: '17 h' },
                  { value: 18, title: '18 h' },
                  { value: 19, title: '19 h' },
                  { value: 20, title: '20 h' },
                  { value: 21, title: '21 h' },
                  { value: 22, title: '22 h' },
                  { value: 23, title: '23 h' },
                ]}
                value={values['alarmsAlert2_timeIntervalInMinutes_from_h']}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={5} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="alarmsAlert2_timeIntervalInMinutes_from_m"
                label=""
                list={[
                  { value: 0, title: '00 m' },
                  { value: 1, title: '01 m' },
                  { value: 2, title: '02 m' },
                  { value: 3, title: '03 m' },
                  { value: 4, title: '04 m' },
                  { value: 5, title: '05 m' },
                  { value: 6, title: '06 m' },
                  { value: 7, title: '07 m' },
                  { value: 8, title: '08 m' },
                  { value: 9, title: '09 m' },
                  { value: 10, title: '10 m' },
                  { value: 11, title: '11 m' },
                  { value: 12, title: '12 m' },
                  { value: 13, title: '13 m' },
                  { value: 14, title: '14 m' },
                  { value: 15, title: '15 m' },
                  { value: 16, title: '16 m' },
                  { value: 17, title: '17 m' },
                  { value: 18, title: '18 m' },
                  { value: 19, title: '19 m' },
                  { value: 20, title: '20 m' },
                  { value: 21, title: '21 m' },
                  { value: 22, title: '22 m' },
                  { value: 23, title: '23 m' },
                  { value: 24, title: '24 m' },
                  { value: 25, title: '25 m' },
                  { value: 26, title: '26 m' },
                  { value: 27, title: '27 m' },
                  { value: 28, title: '28 m' },
                  { value: 29, title: '29 m' },

                  { value: 30, title: '30 m' },
                  { value: 31, title: '31 m' },
                  { value: 32, title: '32 m' },
                  { value: 33, title: '33 m' },
                  { value: 34, title: '34 m' },
                  { value: 35, title: '35 m' },
                  { value: 36, title: '36 m' },
                  { value: 37, title: '37 m' },
                  { value: 38, title: '38 m' },
                  { value: 39, title: '39 m' },

                  { value: 40, title: '40 m' },
                  { value: 41, title: '41 m' },
                  { value: 42, title: '42 m' },
                  { value: 43, title: '43 m' },
                  { value: 44, title: '44 m' },
                  { value: 45, title: '45 m' },
                  { value: 46, title: '46 m' },
                  { value: 47, title: '47 m' },
                  { value: 48, title: '48 m' },
                  { value: 49, title: '49 m' },

                  { value: 50, title: '50 m' },
                  { value: 51, title: '51 m' },
                  { value: 52, title: '52 m' },
                  { value: 53, title: '53 m' },
                  { value: 54, title: '54 m' },
                  { value: 55, title: '55 m' },
                  { value: 56, title: '56 m' },
                  { value: 57, title: '57 m' },
                  { value: 58, title: '58 m' },
                  { value: 59, title: '59 m' },
                ]}
                value={values['alarmsAlert2_timeIntervalInMinutes_from_m']}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {/* to h,m */}

          <Grid item container>
            <Grid item container xs={2} alignItems="flex-end">
              <Typography variant="body1" className={classes.alertLabel}>
                {msg.editWidgetAlarmsModal.to}
              </Typography>
            </Grid>

            <Grid item xs={5} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="alarmsAlert2_timeIntervalInMinutes_to_h"
                label=""
                list={[
                  { value: 0, title: '00 h' },
                  { value: 1, title: '01 h' },
                  { value: 2, title: '02 h' },
                  { value: 3, title: '03 h' },
                  { value: 4, title: '04 h' },
                  { value: 5, title: '05 h' },
                  { value: 6, title: '06 h' },
                  { value: 7, title: '07 h' },
                  { value: 8, title: '08 h' },
                  { value: 9, title: '09 h' },
                  { value: 10, title: '10 h' },
                  { value: 11, title: '11 h' },
                  { value: 12, title: '12 h' },
                  { value: 13, title: '13 h' },
                  { value: 14, title: '14 h' },
                  { value: 15, title: '15 h' },
                  { value: 16, title: '16 h' },
                  { value: 17, title: '17 h' },
                  { value: 18, title: '18 h' },
                  { value: 19, title: '19 h' },
                  { value: 20, title: '20 h' },
                  { value: 21, title: '21 h' },
                  { value: 22, title: '22 h' },
                  { value: 23, title: '23 h' },
                ]}
                value={values['alarmsAlert2_timeIntervalInMinutes_to_h']}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={5} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="alarmsAlert2_timeIntervalInMinutes_to_m"
                label=""
                list={[
                  { value: 0, title: '00 m' },
                  { value: 1, title: '01 m' },
                  { value: 2, title: '02 m' },
                  { value: 3, title: '03 m' },
                  { value: 4, title: '04 m' },
                  { value: 5, title: '05 m' },
                  { value: 6, title: '06 m' },
                  { value: 7, title: '07 m' },
                  { value: 8, title: '08 m' },
                  { value: 9, title: '09 m' },
                  { value: 10, title: '10 m' },
                  { value: 11, title: '11 m' },
                  { value: 12, title: '12 m' },
                  { value: 13, title: '13 m' },
                  { value: 14, title: '14 m' },
                  { value: 15, title: '15 m' },
                  { value: 16, title: '16 m' },
                  { value: 17, title: '17 m' },
                  { value: 18, title: '18 m' },
                  { value: 19, title: '19 m' },
                  { value: 20, title: '20 m' },
                  { value: 21, title: '21 m' },
                  { value: 22, title: '22 m' },
                  { value: 23, title: '23 m' },
                  { value: 24, title: '24 m' },
                  { value: 25, title: '25 m' },
                  { value: 26, title: '26 m' },
                  { value: 27, title: '27 m' },
                  { value: 28, title: '28 m' },
                  { value: 29, title: '29 m' },

                  { value: 30, title: '30 m' },
                  { value: 31, title: '31 m' },
                  { value: 32, title: '32 m' },
                  { value: 33, title: '33 m' },
                  { value: 34, title: '34 m' },
                  { value: 35, title: '35 m' },
                  { value: 36, title: '36 m' },
                  { value: 37, title: '37 m' },
                  { value: 38, title: '38 m' },
                  { value: 39, title: '39 m' },

                  { value: 40, title: '40 m' },
                  { value: 41, title: '41 m' },
                  { value: 42, title: '42 m' },
                  { value: 43, title: '43 m' },
                  { value: 44, title: '44 m' },
                  { value: 45, title: '45 m' },
                  { value: 46, title: '46 m' },
                  { value: 47, title: '47 m' },
                  { value: 48, title: '48 m' },
                  { value: 49, title: '49 m' },

                  { value: 50, title: '50 m' },
                  { value: 51, title: '51 m' },
                  { value: 52, title: '52 m' },
                  { value: 53, title: '53 m' },
                  { value: 54, title: '54 m' },
                  { value: 55, title: '55 m' },
                  { value: 56, title: '56 m' },
                  { value: 57, title: '57 m' },
                  { value: 58, title: '58 m' },
                  { value: 59, title: '59 m' },
                ]}
                value={values['alarmsAlert2_timeIntervalInMinutes_to_m']}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {/* alert 3 */}

          <Grid item>
            <Typography
              variant="subtitle1"
              color="primary"
              className={classes.alertHeadline}
            >{`${msg.editWidgetAlarmsModal.alert} 3`}</Typography>
          </Grid>

          <Grid item container>
            <Grid item xs={6} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="alarmsAlert3_condition_operator"
                label={msg.editWidgetAlarmsModal.alarmCondition}
                list={[
                  { value: '>', title: '>' },
                  { value: '<', title: '<' },
                  { value: '=', title: '=' },
                  { value: '!=', title: '!=' },
                  {
                    value: 'contains',
                    title: msg.editWidgetAlarmsModal.contains,
                  },
                ]}
                value={values['alarmsAlert3_condition_operator']}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomInput
                name="alarmsAlert3_condition_value"
                label="&nbsp;"
                clearFieldIcon={false}
                value={values['alarmsAlert3_condition_value']}
                onChange={handleInputChange}
                type="text"
              />
            </Grid>
          </Grid>

          <Grid item>
            <Typography
              variant="body1"
              color="primary"
              className={classes.alertLabel}
            >
              {msg.editWidgetAlarmsModal.allowedTime}
            </Typography>
          </Grid>

          <Grid item container>
            <Grid item xs={6} style={{ paddingRight: '10px' }}>
              <CustomInput
                name="alarmsAlert3_timeout_units"
                label=""
                clearFieldIcon={false}
                value={values['alarmsAlert3_timeout_units']}
                onChange={handleInputChange}
                type="number"
              />
            </Grid>

            <Grid item xs={6}>
              <CustomSelect
                name="alarmsAlert3_timeout_value"
                label=""
                list={[
                  {
                    value: 'minutes',
                    title: msg.editWidgetAlarmsModal.minutes,
                  },
                  {
                    value: 'seconds',
                    title: msg.editWidgetAlarmsModal.seconds,
                  },
                ]}
                value={values['alarmsAlert3_timeout_value']}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          <Grid item>
            <Typography variant="body1" className={classes.alertLabel}>
              {msg.editWidgetAlarmsModal.alarmTimeInterval}
            </Typography>
          </Grid>

          {/* from h,m */}

          <Grid item container>
            <Grid item container xs={2} alignItems="flex-end">
              <Typography variant="body1" className={classes.alertLabel}>
                {msg.editWidgetAlarmsModal.from}
              </Typography>
            </Grid>

            <Grid item xs={5} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="alarmsAlert3_timeIntervalInMinutes_from_h"
                label=""
                list={[
                  { value: 0, title: '00 h' },
                  { value: 1, title: '01 h' },
                  { value: 2, title: '02 h' },
                  { value: 3, title: '03 h' },
                  { value: 4, title: '04 h' },
                  { value: 5, title: '05 h' },
                  { value: 6, title: '06 h' },
                  { value: 7, title: '07 h' },
                  { value: 8, title: '08 h' },
                  { value: 9, title: '09 h' },
                  { value: 10, title: '10 h' },
                  { value: 11, title: '11 h' },
                  { value: 12, title: '12 h' },
                  { value: 13, title: '13 h' },
                  { value: 14, title: '14 h' },
                  { value: 15, title: '15 h' },
                  { value: 16, title: '16 h' },
                  { value: 17, title: '17 h' },
                  { value: 18, title: '18 h' },
                  { value: 19, title: '19 h' },
                  { value: 20, title: '20 h' },
                  { value: 21, title: '21 h' },
                  { value: 22, title: '22 h' },
                  { value: 23, title: '23 h' },
                ]}
                value={values['alarmsAlert3_timeIntervalInMinutes_from_h']}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={5} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="alarmsAlert3_timeIntervalInMinutes_from_m"
                label=""
                list={[
                  { value: 0, title: '00 m' },
                  { value: 1, title: '01 m' },
                  { value: 2, title: '02 m' },
                  { value: 3, title: '03 m' },
                  { value: 4, title: '04 m' },
                  { value: 5, title: '05 m' },
                  { value: 6, title: '06 m' },
                  { value: 7, title: '07 m' },
                  { value: 8, title: '08 m' },
                  { value: 9, title: '09 m' },
                  { value: 10, title: '10 m' },
                  { value: 11, title: '11 m' },
                  { value: 12, title: '12 m' },
                  { value: 13, title: '13 m' },
                  { value: 14, title: '14 m' },
                  { value: 15, title: '15 m' },
                  { value: 16, title: '16 m' },
                  { value: 17, title: '17 m' },
                  { value: 18, title: '18 m' },
                  { value: 19, title: '19 m' },
                  { value: 20, title: '20 m' },
                  { value: 21, title: '21 m' },
                  { value: 22, title: '22 m' },
                  { value: 23, title: '23 m' },
                  { value: 24, title: '24 m' },
                  { value: 25, title: '25 m' },
                  { value: 26, title: '26 m' },
                  { value: 27, title: '27 m' },
                  { value: 28, title: '28 m' },
                  { value: 29, title: '29 m' },

                  { value: 30, title: '30 m' },
                  { value: 31, title: '31 m' },
                  { value: 32, title: '32 m' },
                  { value: 33, title: '33 m' },
                  { value: 34, title: '34 m' },
                  { value: 35, title: '35 m' },
                  { value: 36, title: '36 m' },
                  { value: 37, title: '37 m' },
                  { value: 38, title: '38 m' },
                  { value: 39, title: '39 m' },

                  { value: 40, title: '40 m' },
                  { value: 41, title: '41 m' },
                  { value: 42, title: '42 m' },
                  { value: 43, title: '43 m' },
                  { value: 44, title: '44 m' },
                  { value: 45, title: '45 m' },
                  { value: 46, title: '46 m' },
                  { value: 47, title: '47 m' },
                  { value: 48, title: '48 m' },
                  { value: 49, title: '49 m' },

                  { value: 50, title: '50 m' },
                  { value: 51, title: '51 m' },
                  { value: 52, title: '52 m' },
                  { value: 53, title: '53 m' },
                  { value: 54, title: '54 m' },
                  { value: 55, title: '55 m' },
                  { value: 56, title: '56 m' },
                  { value: 57, title: '57 m' },
                  { value: 58, title: '58 m' },
                  { value: 59, title: '59 m' },
                ]}
                value={values['alarmsAlert3_timeIntervalInMinutes_from_m']}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {/* to h,m */}

          <Grid item container>
            <Grid item container xs={2} alignItems="flex-end">
              <Typography variant="body1" className={classes.alertLabel}>
                {msg.editWidgetAlarmsModal.to}
              </Typography>
            </Grid>

            <Grid item xs={5} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="alarmsAlert3_timeIntervalInMinutes_to_h"
                label=""
                list={[
                  { value: 0, title: '00 h' },
                  { value: 1, title: '01 h' },
                  { value: 2, title: '02 h' },
                  { value: 3, title: '03 h' },
                  { value: 4, title: '04 h' },
                  { value: 5, title: '05 h' },
                  { value: 6, title: '06 h' },
                  { value: 7, title: '07 h' },
                  { value: 8, title: '08 h' },
                  { value: 9, title: '09 h' },
                  { value: 10, title: '10 h' },
                  { value: 11, title: '11 h' },
                  { value: 12, title: '12 h' },
                  { value: 13, title: '13 h' },
                  { value: 14, title: '14 h' },
                  { value: 15, title: '15 h' },
                  { value: 16, title: '16 h' },
                  { value: 17, title: '17 h' },
                  { value: 18, title: '18 h' },
                  { value: 19, title: '19 h' },
                  { value: 20, title: '20 h' },
                  { value: 21, title: '21 h' },
                  { value: 22, title: '22 h' },
                  { value: 23, title: '23 h' },
                ]}
                value={values['alarmsAlert3_timeIntervalInMinutes_to_h']}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={5} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="alarmsAlert3_timeIntervalInMinutes_to_m"
                label=""
                list={[
                  { value: 0, title: '00 m' },
                  { value: 1, title: '01 m' },
                  { value: 2, title: '02 m' },
                  { value: 3, title: '03 m' },
                  { value: 4, title: '04 m' },
                  { value: 5, title: '05 m' },
                  { value: 6, title: '06 m' },
                  { value: 7, title: '07 m' },
                  { value: 8, title: '08 m' },
                  { value: 9, title: '09 m' },
                  { value: 10, title: '10 m' },
                  { value: 11, title: '11 m' },
                  { value: 12, title: '12 m' },
                  { value: 13, title: '13 m' },
                  { value: 14, title: '14 m' },
                  { value: 15, title: '15 m' },
                  { value: 16, title: '16 m' },
                  { value: 17, title: '17 m' },
                  { value: 18, title: '18 m' },
                  { value: 19, title: '19 m' },
                  { value: 20, title: '20 m' },
                  { value: 21, title: '21 m' },
                  { value: 22, title: '22 m' },
                  { value: 23, title: '23 m' },
                  { value: 24, title: '24 m' },
                  { value: 25, title: '25 m' },
                  { value: 26, title: '26 m' },
                  { value: 27, title: '27 m' },
                  { value: 28, title: '28 m' },
                  { value: 29, title: '29 m' },

                  { value: 30, title: '30 m' },
                  { value: 31, title: '31 m' },
                  { value: 32, title: '32 m' },
                  { value: 33, title: '33 m' },
                  { value: 34, title: '34 m' },
                  { value: 35, title: '35 m' },
                  { value: 36, title: '36 m' },
                  { value: 37, title: '37 m' },
                  { value: 38, title: '38 m' },
                  { value: 39, title: '39 m' },

                  { value: 40, title: '40 m' },
                  { value: 41, title: '41 m' },
                  { value: 42, title: '42 m' },
                  { value: 43, title: '43 m' },
                  { value: 44, title: '44 m' },
                  { value: 45, title: '45 m' },
                  { value: 46, title: '46 m' },
                  { value: 47, title: '47 m' },
                  { value: 48, title: '48 m' },
                  { value: 49, title: '49 m' },

                  { value: 50, title: '50 m' },
                  { value: 51, title: '51 m' },
                  { value: 52, title: '52 m' },
                  { value: 53, title: '53 m' },
                  { value: 54, title: '54 m' },
                  { value: 55, title: '55 m' },
                  { value: 56, title: '56 m' },
                  { value: 57, title: '57 m' },
                  { value: 58, title: '58 m' },
                  { value: 59, title: '59 m' },
                ]}
                value={values['alarmsAlert3_timeIntervalInMinutes_to_m']}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Grid>
      </CommonModal>
    </>
  );
};

export default React.memo(EditWidgetAlarmsModal);
