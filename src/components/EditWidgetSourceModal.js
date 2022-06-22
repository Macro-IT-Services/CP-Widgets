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
import Button from '@material-ui/core/Button';

import FormField from '../components/FormField';

import { setContext } from '../actions';

//import { UPDATE_WIDGET_MUTATION } from '../queries';
import {
  DEVICES_QUERY,
  DEVICE_PROPS_QUERY,
  UPDATE_PROP_MUTATION,
  DEVICE_PROP_LINKED_QUERY,
  WIDGET_PROP_LINKED_ID_QUERY,
} from '../queries';

import { msg } from '../messages';

import { ReactComponent as ImgUpload } from '../assets/upload.svg';

const styles = theme => ({
  stateHeadline: {
    marginTop: '15px',
  },
});

const EditWidgetSourceModal = props => {
  const { modalState, setModalState, handleUpdateWidgetProps } = props;

  //   console.log('EditWidgetSourceModal props modalState', modalState);

  //  const theme = useTheme();
  const client = useApolloClient();

  //  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const useStyles = makeStyles(theme => styles(theme));
  //  const classes = useStyles();

  const [listOfSources, setListOfSources] = useState([]);
  const [listOfProps, setListOfProps] = useState([]);

  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));

  let defaultValues = {};

  // for forms

  const [values, setValues] = useReducer(
    (prev, updated) => ({ ...prev, ...updated }),
    defaultValues
  );

  // get props of device on device selection
  const handleDeviceChange = async e => {
    //    console.log('handleDeviceChange ', e.target.value);

    try {
      const result = await client.query({
        query: DEVICE_PROPS_QUERY,
        variables: { deviceId: e.target.value },
        fetchPolicy: 'network-only',
      });

      //        console.log('devices props result', result.data.objectProperties);

      /*
        // default values to fill input fields
        result.data.object.objectProperties.forEach(prop => {
          defaultValues[prop.key] = prop.value;
        });
*/

      //setListOfProps([{value:null, title:""}, ...result.data.objectProperties.map(item =>{ return  {value: item.id, title: item.property } } ) ])
      setListOfProps(
        result.data.objectProperties.map(item => {
          return { value: item.id, title: item.property };
        })
      );
    } catch (err) {
      console.log('device props error', err);
      enqueueSnackbar({
        message: err.toString(),
        options: { code: 'UNKNOWN', variant: 'error' },
      });
    } finally {
    }
  }; //handleDeviceChange

  useEffect(() => {
    const queryProps = async () => {
      try {
        const result_linkedPropId = await client.query({
          query: WIDGET_PROP_LINKED_ID_QUERY,
          variables: { propId: modalState.propId },
          fetchPolicy: 'network-only',
        });

        //      console.log('WIDGET_PROP_LINKED_ID_QUERY result', result_linkedPropId.data);
        //      console.log('modalState.propId', modalState.propId);

        const result = await client.query({
          query: DEVICES_QUERY,
          variables: {},
          fetchPolicy: 'network-only',
        });

        //    console.log('DEVICES_QUERY result', result.data);

        //        setListOfSources([{value:null, title:""} , ...result.data.objects.map(item =>{ return  {value: item.id, title: item.name } } )  ])

        setListOfSources(
          result.data.objects.map(item => {
            return { value: item.id, title: item.name };
          })
        );

        // if something linked, set default data to display currently linked source/property pair
        if (result_linkedPropId.data.objectProperty.linkedPropertyId) {
          const result_linked = await client.query({
            query: DEVICE_PROP_LINKED_QUERY,
            variables: {
              linkedPropId:
                result_linkedPropId.data.objectProperty.linkedPropertyId,
            },
            fetchPolicy: 'network-only',
          });

          //        console.log('DEVICE_PROP_LINKED_QUERY linked result', result_linked.data);
          //        console.log('!device',result_linked.data.objectProperty.objectId)

          const result_linked_property = await client.query({
            query: DEVICE_PROPS_QUERY,
            variables: { deviceId: result_linked.data.objectProperty.objectId },
            fetchPolicy: 'network-only',
          });

          //        console.log('result_linked_property.data.objectProperties',result_linked_property.data.objectProperties)
          //        console.log('modalState.linkedPropId', modalState.linkedPropId);

          setListOfProps(
            result_linked_property.data.objectProperties.map(item => {
              return { value: item.id, title: item.property };
            })
          );

          defaultValues['source'] = result_linked.data.objectProperty.objectId; //"23ae14c9-9940-4d7f-be70-e483140e88d3"; //park sensor
          defaultValues['property'] =
            result_linkedPropId.data.objectProperty.linkedPropertyId; //"BatteryLevel";
        } //if
        else {
          console.log('reset');
          //setValues({});
          defaultValues['source'] = null;
          defaultValues['property'] = null;
        }

        setValues(defaultValues);
      } catch (err) {
        console.log('devices error', err);
        enqueueSnackbar({
          message: err.toString(),
          options: { code: 'UNKNOWN', variant: 'error' },
        });
      } finally {
      }
    }; //queryProps

    if (modalState.open) queryProps();
  }, [modalState.open, modalState.linkedPropId]);

  const handleUpdate = async () => {
    console.log(
      'modalState.propId, values["property"]',
      modalState.propId,
      values['property']
    );
    //modalState.propId, values["property"] 58012550-59bb-44f4-bfb0-909202a5768f ff2c50af-83d8-4bb4-b0a1-73a39ae244d1

    try {
      const result_update = await client.mutate({
        mutation: UPDATE_PROP_MUTATION,
        variables: {
          propId: modalState.propId,
          linkedPropId: values['property'],
        },
      });

      console.log('handleUpdate updated:', result_update.data);

      enqueueSnackbar({
        message: msg.editWidgetModal.updated,
        options: { code: 'UNKNOWN', variant: 'info' },
      });
    } catch (err) {
      console.log('updateWidgetProps update error:', err);
      enqueueSnackbar({
        message: err.toString(),
        options: { code: 'UNKNOWN', variant: 'error' },
      });
    } //catch

    setModalState({ ...modalState, open: false });
  }; //handleUpdate

  const handleUnlink = async () => {
    console.log(
      'modalState.propId, values["property"]',
      modalState.propId,
      values['property']
    );
    //modalState.propId, values["property"] 58012550-59bb-44f4-bfb0-909202a5768f ff2c50af-83d8-4bb4-b0a1-73a39ae244d1

    try {
      const result_update = await client.mutate({
        mutation: UPDATE_PROP_MUTATION,
        variables: {
          propId: modalState.propId,
          linkedPropId: null,
        },
      });

      console.log('handleUnlink updated:', result_update.data);

      enqueueSnackbar({
        message: msg.editWidgetModal.updated,
        options: { code: 'UNKNOWN', variant: 'info' },
      });
    } catch (err) {
      console.log('updateWidgetProps unlink error:', err);
      enqueueSnackbar({
        message: err.toString(),
        options: { code: 'UNKNOWN', variant: 'error' },
      });
    } //catch

    setModalState({ ...modalState, open: false });
  }; //handleUnlink

  const dispatch = useDispatch();

  const handleClose = () => setModalState({ ...modalState, open: false });

  const handleInputChange = e => {
    console.log('handleInputChange e', e);
    let { name, value, checked } = e.target;
    console.log(name, value, checked);

    if (name === 'source') handleDeviceChange(e);

    // for <Switch/>
    if (checked) value = checked;

    setValues({ [name]: value });

    //  console.log('STATE', values);
  };

  //if (Object.keys(values).length === 0) return false;
  return (
    <>
      <CommonModal
        modalOpen={modalState.open}
        title={msg.editWidgetSourceModal.editSource}
        forceTitle={true}
        contentStyles={{
          padding: '14px 16px 16px 14px',
        }}
        setModalOpen={handleClose}
        buttons={[
          { title: msg.editWidgetSourceModal.buttonCancel, cb: handleClose },
          { title: msg.editWidgetSourceModal.buttonSave, cb: handleUpdate },
        ]}
      >
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <CustomSelect
              name="source"
              label={msg.editWidgetSourceModal.source}
              list={listOfSources}
              value={values['source'] ?? ''}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item>
            <CustomSelect
              name="property"
              label={msg.editWidgetSourceModal.property}
              list={listOfProps}
              value={values['property'] ?? ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item container>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              disableElevation
              style={{ marginTop: '16px' }}
              onClick={handleUnlink}
            >
              {msg.editWidgetSourceModal.clear}
            </Button>
          </Grid>
        </Grid>
      </CommonModal>
    </>
  );
};

export default React.memo(EditWidgetSourceModal);
