import React, { useReducer, useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useApolloClient } from '@apollo/client';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import groupNames from '../utils/groupNames';

import {
  enqueueSnackbar as enqueueSnackbarAction,
  //    closeSnackbar as closeSnackbarAction,
} from '../actions';

import CommonModal from '../components/CommonModal';
import Subtitle from '../components/Subtitle';

import CustomInput from '../components/CustomInput';
import CustomSelect from '../components/CustomSelect';
import CustomSelectColor from '../components/CustomSelectColor';
import CustomSwitch from '../components/CustomSwitch';
import CustomTags from '../components/CustomTags';

import FormField from '../components/FormField';

import { WIDGETS_PROPS_QUERY } from '../queries';

import { setContext } from '../actions';

import { msg } from '../messages';

import { ReactComponent as ImgUpload } from '../assets/upload.svg';

const styles = theme => ({});

const AddWidgetModal = props => {
  const { modalState, setModalState, handleAddWidget } = props;

  //    console.log('AddWidgetModal props', modalState);

  const theme = useTheme();
  const client = useApolloClient();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const useStyles = makeStyles(theme => styles(theme));
  const classes = useStyles();

  const [fields, setFields] = useState([]);

  const [widgetType, setWidgetType] = useState('databox');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

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
        // get 1) existings objects ids (to count them for default name)  2) list of general object properties (from schema) with its description, types etc.
        const result_props = await client.query({
          query: WIDGETS_PROPS_QUERY,
          variables: { widgetType: widgetType ?? 'databox' },
          fetchPolicy: 'network-only',
        });
        //setObjectsCount(result_props.objects?.length);
        //        console.log('widgets props result count', result_props.data.objects.length);

        //setValues(result_props.data.schemata[0].schemaProperties.map(prop=>{return {[prop.key]:prop.defaultValue} }))
        console.log(
          'widgets props result props',
          result_props.data.schemata[0].schemaProperties
        ); // description, key, hidden, type

        // set components
        setFields(result_props.data.schemata[0].schemaProperties);

        // default values
        // convert array to keyed object
        result_props.data.schemata[0].schemaProperties.forEach(prop => {
          defaultValues[prop.key] = prop.defaultValue;
          //          defaultValues[prop.key] = prop.defaultValue.toString();
        });
        //console.log('defaultValues',defaultValues)
        setValues(defaultValues);
        setName(`Widget #${result_props.data.objects.length + 1}`);
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
  }, [modalState.open, widgetType]);

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

  //console.log('+++', groupNames[widgetType]);
  //console.log('++++', groupNames[widgetType].find(groupName=>groupName==="Settings") )

  return (
    <>
      <CommonModal
        modalOpen={modalState.open}
        title={msg.addWidgetModal.addWidget}
        forceTitle={true}
        contentStyles={{
          padding: '14px 16px 16px 14px',
        }}
        setModalOpen={handleClose}
        buttons={[
          { title: msg.addWidgetModal.buttonCancel, cb: handleClose },
          {
            title: msg.addWidgetModal.buttonAdd,
            cb: () => {
              handleAddWidget({
                widgetIdClicked: modalState.widgetIdClicked,
                groupId: modalState.groupId,
                values: Object.keys(values).map(key => {
                  return { propertyKey: key, value: values[key] };
                }), // convert keyed object to [{"propertyKey":"qqq","value":"111"}]
                widgetType: widgetType,
                name: name,
                description: description,
              });
              //setValues(defaultValue);
              //              setModalState({ open: false });
              setModalState({ ...modalState, open: false });
            },
          },
        ]}
      >
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <CustomSelect
              name="widgetType"
              label={msg.addWidgetModal.widgetType}
              list={[
                { value: 'command button', title: 'Command Button' },
                { value: 'counter', title: 'Counter' },
                { value: 'databox', title: 'DataBox' },
                { value: 'databox advanced', title: 'DataBox Advanced' },
                { value: 'datachart', title: 'Data Chart' },
                { value: 'datetime', title: 'Date Time' },
                { value: 'group table', title: 'Group Table' },
                { value: 'imagebox', title: 'ImageBox' },
                { value: 'indicator', title: 'Indicator' },
                { value: 'object table', title: 'Object Table' },
                { value: 'slider', title: 'Slider' },
                { value: 'switcher', title: 'Switcher' },
                { value: 'title', title: 'Title' },
                //                { value: 'vibration', title: 'Vibration' },
                { value: 'weatherbox', title: 'WeatherBox' },
              ]}
              value={widgetType ?? 'databox'}
              onChange={e => {
                setWidgetType(e.target.value);
              }}
            />
          </Grid>

          <Grid item>
            <CustomInput
              name="name"
              label={msg.addWidgetModal.name}
              clearFieldIcon={true}
              value={name ?? ''}
              onChange={e => {
                setName(e.target.value);
              }}
            />
          </Grid>

          {fields
            .filter(
              item =>
                groupNames[widgetType].find(
                  groupName => groupName === item.groupName
                ) && !item.hidden
            )
            .map(field => (
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
              label={msg.addWidgetModal.description}
              clearFieldIcon={true}
              value={description ?? ''}
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

export default React.memo(AddWidgetModal);
