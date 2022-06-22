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
//import { Button, Typography, Box } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { setSettings } from '../actions';

import CommonModal from '../components/CommonModal';
import Subtitle from '../components/Subtitle';

import CustomInput from '../components/CustomInput';
import CustomSelect from '../components/CustomSelect';
import CustomSwitch from '../components/CustomSwitch';
import CustomTags from '../components/CustomTags';

import FormField from '../components/FormField';

import { setContext } from '../actions';

//import { UPDATE_WIDGET_MUTATION } from '../queries';
import { WIDGET_QUERY } from '../queries';

import { msg } from '../messages';

import { ReactComponent as ImgUpload } from '../assets/upload.svg';

const styles = theme => ({
  imgUpload: {
    width: '100%',
  },
});

const EditWidgetModal = props => {
  const { modalState, setModalState, handleUpdateWidget } = props;

  //console.log('EditWidgetModal props modalState', modalState);

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
        //        console.log('+++ widgetType',widgetType)

        // groupNames - array of groups to read properties from. Used for editing properties only from required groups
        // (for example only Settings or Settings and Value)
        // format: [{groupName: {equalTo: "Settings"}}, {groupName: {equalTo: "Value"}}]

        const result = await client.query({
          query: WIDGET_QUERY,
          variables: {
            objId: modalState.widgetId,
            groupNames: modalState.groupNames,
          },
          fetchPolicy: 'network-only',
        });

        //        console.log('widgets props result count', result.data.objects.length);

        console.log('widget result', result.data.object); // description, key, hidden, type

        // default values to fill input fields
        result.data.object.objectProperties.forEach(prop => {
          defaultValues[prop.key] = prop.value;
        });

        // fields description and types for components {valueSet, key, description, type.name}
        const fields = result.data.object.objectProperties
          .map(prop => {
            return {
              key: prop.key,
              description: prop.spec.description,
              type: prop.spec.type,
              valueSet: prop.spec.valueSet,
              groupName: prop.groupName,

              valueRange: prop.spec.valueRange,
              hidden: prop.spec.hidden,
            };
          })
          .filter(
            item =>
              groupNames[modalState.widgetType].find(
                groupName => groupName === item.groupName
              ) && !item.hidden
          );

        //     console.log('+++', fields)

        setFields(fields); // description/component types for each field
        setValues(defaultValues); // loaded values for each field
        setSchemaName(result.data.object.schemaName);
        setName(result.data.object.name);
        setDescription(result.data.object.description);
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
    //    console.log('handleInputChange e', e);

    let { name, value, checked } = e.target;
    //       console.log(name, value, checked);

    // for <Switch/>
    if (checked) value = checked;

    setValues({ [name]: value });

    //  console.log('STATE', values);
  };

  //[{"x": "A","y": 20}, {"x": "B","y": 30},{"x": "C","y": null},{"x": "D","y": 10},{"x": "E","y": 10}]
  return (
    <>
      <CommonModal
        modalOpen={modalState.open}
        title={msg.editWidgetModal.editWidget}
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
              //              console.log('fields',fields)
              //              console.log('values',values)
              handleUpdateWidget({
                //                  widgetIdClicked: modalState.widgetIdClicked,
                widgetId: modalState.widgetId,
                values: Object.keys(values).map(key => {
                  return { propertyKey: key, value: values[key] };

                  //                  return { propertyKey: key, value: values[key].toString() };
                }), // convert keyed object to [{"propertyKey":"qqq","value":"111"}]
                name: name,
                description: description,
              });

              //              setModalState({ open: false });
              setModalState({ ...modalState, open: false });
            },
          },
        ]}
      >
        <Grid container direction="column" spacing={2}>
          {/*          
          <Grid item>
            <CustomInput
              name="name"
              label={msg.editWidgetModal.name}
              clearFieldIcon={true}
              value={values.name}
              onChange={handleInputChange}
            />
          </Grid>
*/}

          <Grid item>
            <CustomInput
              name="schemaName"
              label={msg.editWidgetModal.widgetType}
              clearFieldIcon={false}
              value={schemaName}
              disabled
              onChange={e => {
                //setSchemaName(e.target.value);
              }}
            />
          </Grid>

          <Grid item>
            <CustomInput
              name="name"
              label={msg.editWidgetModal.name}
              clearFieldIcon={true}
              value={name}
              onChange={e => {
                setName(e.target.value);
              }}
            />
          </Grid>

          {fields.map(field => (
            <FormField
              key={field.key}
              values={values}
              field={field}
              handleInputChange={handleInputChange}
            />
          ))}

          <Grid item>
            <CustomInput
              name="description"
              label={msg.editWidgetModal.description}
              clearFieldIcon={true}
              value={description}
              multiline={true}
              onChange={e => {
                setDescription(e.target.value);
              }}
            />
          </Grid>
        </Grid>
      </CommonModal>
    </>
  );
};

export default React.memo(EditWidgetModal);
