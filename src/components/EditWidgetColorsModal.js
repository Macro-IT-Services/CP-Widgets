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
  stateHeadline: {
    marginTop: '15px',
  },
});

const EditWidgetColorsModal = props => {
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
        //        console.log(' widgetType',widgetType)

        const result = await client.query({
          query: WIDGET_QUERY,
          variables: { objId: modalState.widgetId, groupName: 'Colors' },
          fetchPolicy: 'network-only',
        });

        //        console.log('widgets props result count', result.data.objects.length);

        console.log('widget result', result.data.object); // description, key, hidden, type

        /*
        // default values to fill input fields
        result.data.object.objectProperties.forEach(prop => {
          defaultValues[prop.key] = prop.value;
        });
*/
        const getPropValue = prop =>
          result.data.object.objectProperties.find(obj => obj.key === prop)
            ?.value;

        defaultValues['colorsDefaultColor'] = getPropValue(
          'colorsDefaultColor'
        );
        /*
        defaultValues['colorsColor1'] = getPropValue('colorsColor1');
        defaultValues['colorsColor2'] = getPropValue('colorsColor2');
        defaultValues['colorsColor3'] = getPropValue('colorsColor3');
        */
        defaultValues['colorsColor1Condition_color'] = getPropValue(
          'colorsColor1Condition'
        ).color;
        defaultValues['colorsColor1Condition_operator'] = getPropValue(
          'colorsColor1Condition'
        ).operator;
        defaultValues['colorsColor1Condition_value'] = getPropValue(
          'colorsColor1Condition'
        ).value;

        defaultValues['colorsColor2Condition_color'] = getPropValue(
          'colorsColor2Condition'
        ).color;
        defaultValues['colorsColor2Condition_operator'] = getPropValue(
          'colorsColor2Condition'
        ).operator;
        defaultValues['colorsColor2Condition_value'] = getPropValue(
          'colorsColor2Condition'
        ).value;

        defaultValues['colorsColor3Condition_color'] = getPropValue(
          'colorsColor3Condition'
        ).color;
        defaultValues['colorsColor3Condition_operator'] = getPropValue(
          'colorsColor3Condition'
        ).operator;
        defaultValues['colorsColor3Condition_value'] = getPropValue(
          'colorsColor3Condition'
        ).value;

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

  //console.log('+++', values);
  if (Object.keys(values).length === 0) return false;
  return (
    <>
      <CommonModal
        modalOpen={modalState.open}
        title={msg.editWidgetColorsModal.colorsSettings}
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
                  propertyKey: 'colorsDefaultColor',
                  value: values.colorsDefaultColor,
                },
                {
                  propertyKey: 'colorsColor1Condition',
                  value: {
                    operator: values.colorsColor1Condition_operator,
                    value: values.colorsColor1Condition_value,
                    color: values.colorsColor1Condition_color,
                  },
                },
                {
                  propertyKey: 'colorsColor2Condition',
                  value: {
                    operator: values.colorsColor2Condition_operator,
                    value: values.colorsColor2Condition_value,
                    color: values.colorsColor2Condition_color,
                  },
                },
                {
                  propertyKey: 'colorsColor3Condition',
                  value: {
                    operator: values.colorsColor3Condition_operator,
                    value: values.colorsColor3Condition_value,
                    color: values.colorsColor3Condition_color,
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
          <Grid item>
            <Typography variant="subtitle1" color="primary">
              {msg.editWidgetColorsModal.defaultColor}
            </Typography>
          </Grid>

          <Grid item>
            <CustomSelectColor
              name="colorsDefaultColor"
              label={msg.editWidgetColorsModal.color}
              value={values['colorsDefaultColor'] ?? ''}
              onChange={handleInputChange}
            />
          </Grid>

          {/* state 1 */}

          <Grid item>
            <Typography
              variant="subtitle1"
              color="primary"
              className={classes.stateHeadline}
            >{`${msg.editWidgetColorsModal.state} 1`}</Typography>
          </Grid>

          <Grid item>
            <CustomSelectColor
              name="colorsColor1Condition_color"
              label={msg.editWidgetColorsModal.objectColor}
              value={values['colorsColor1Condition_color'] ?? ''}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item container>
            <Grid item xs={4} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="colorsColor1Condition_operator"
                label={msg.editWidgetColorsModal.option}
                list={[
                  { value: '>', title: '>' },
                  { value: '<', title: '<' },
                  { value: '=', title: '=' },
                  { value: '!=', title: '!=' },
                  {
                    value: 'contains',
                    title: msg.editWidgetColorsModal.contains,
                  },
                ]}
                value={values['colorsColor1Condition_operator'] ?? ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={8}>
              <CustomInput
                name="colorsColor1Condition_value"
                label="&nbsp;"
                clearFieldIcon={false}
                value={values['colorsColor1Condition_value'] ?? ''}
                onChange={handleInputChange}
                type="number"
              />
            </Grid>
          </Grid>

          {/* state 2 */}

          <Grid item>
            <Typography
              variant="subtitle1"
              color="primary"
              className={classes.stateHeadline}
            >{`${msg.editWidgetColorsModal.state} 2`}</Typography>
          </Grid>

          <Grid item>
            <CustomSelectColor
              name="colorsColor2Condition_color"
              label={msg.editWidgetColorsModal.objectColor}
              value={values['colorsColor2Condition_color'] ?? ''}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item container>
            <Grid item xs={4} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="colorsColor2Condition_operator"
                label={msg.editWidgetColorsModal.option}
                list={[
                  { value: '>', title: '>' },
                  { value: '<', title: '<' },
                  { value: '=', title: '=' },
                  { value: '!=', title: '!=' },
                  {
                    value: 'contains',
                    title: msg.editWidgetColorsModal.contains,
                  },
                ]}
                value={values['colorsColor2Condition_operator'] ?? ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={8}>
              <CustomInput
                name="colorsColor2Condition_value"
                label="&nbsp;"
                clearFieldIcon={false}
                value={values['colorsColor2Condition_value'] ?? ''}
                onChange={handleInputChange}
                type="number"
              />
            </Grid>
          </Grid>

          {/* state 3 */}

          <Grid item>
            <Typography
              variant="subtitle1"
              color="primary"
              className={classes.stateHeadline}
            >{`${msg.editWidgetColorsModal.state} 3`}</Typography>
          </Grid>

          <Grid item>
            <CustomSelectColor
              name="colorsColor3Condition_color"
              label={msg.editWidgetColorsModal.objectColor}
              value={values['colorsColor3Condition_color'] ?? ''}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item container>
            <Grid item xs={4} style={{ paddingRight: '10px' }}>
              <CustomSelect
                name="colorsColor3Condition_operator"
                label={msg.editWidgetColorsModal.option}
                list={[
                  { value: '>', title: '>' },
                  { value: '<', title: '<' },
                  { value: '=', title: '=' },
                  { value: '!=', title: '!=' },
                  {
                    value: 'contains',
                    title: msg.editWidgetColorsModal.contains,
                  },
                ]}
                value={values['colorsColor3Condition_operator'] ?? ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={8}>
              <CustomInput
                name="colorsColor3Condition_value"
                label="&nbsp;"
                clearFieldIcon={false}
                value={values['colorsColor3Condition_value'] ?? ''}
                onChange={handleInputChange}
                type="number"
              />
            </Grid>
          </Grid>
        </Grid>
      </CommonModal>
    </>
  );
};

export default React.memo(EditWidgetColorsModal);
