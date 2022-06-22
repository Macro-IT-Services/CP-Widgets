import React, { useReducer, useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import { useApolloClient } from '@apollo/client';

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

import { GROUP_QUERY } from '../queries';

import { msg } from '../messages';

import { ReactComponent as ImgUpload } from '../assets/upload.svg';

const styles = theme => ({
  imgUpload: {
    width: '100%',
  },
});

const EditGroupModal = props => {
  const { modalState, setModalState, handleUpdateGroup } = props;

  //  console.log('EditGroupModal props', modalState);

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
        //        console.log('+++ groupType',groupType)

        const result = await client.query({
          query: GROUP_QUERY,
          variables: { objId: modalState.groupId },
          fetchPolicy: 'network-only',
        });

        //        console.log('groups props result count', result.data.objects.length);

        console.log('group result', result.data.object);

        // set components
        //setFields(result.data.schemata[0].schemaProperties);

        // default values
        // convert array to keyed object
        //result.data.schemata[0].schemaProperties.forEach(prop=>{defaultValues[prop.key] = prop.defaultValue });
        /*
        const propsTmp = result.data.object.objectProperties;

        propsTmp.map(prop=>{
          console.log('+',prop)
          return {name:}
        })
*/

        // default values to fill input fields
        result.data.object.objectProperties.forEach(prop => {
          defaultValues[prop.key] = prop.value;
        });

        // fields description and types for components {valueSet, key, description, type.name}
        const fields = result.data.object.objectProperties.map(prop => {
          return {
            key: prop.key,
            description: prop.spec.description,
            type: prop.spec.type,
            valueSet: prop.spec.valueSet,
            groupName: prop.groupName,

            valueRange: prop.spec.valueRange,
            hidden: prop.spec.hidden,
          };
        });

        //console.log('+++', fields)

        setFields(fields); // description/component types for each field
        setValues(defaultValues); // loaded values for each field
        setSchemaName(result.data.object.schemaName);
        setName(result.data.object.name);
        setDescription(result.data.object.description);
      } catch (err) {
        console.log('groups props error', err);
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

  const handleClose = () => setModalState({ open: false });

  const handleInputChange = e => {
    //    console.log('handleInputChange e', e);

    let { name, value, checked } = e.target;
    //       console.log(name, value, checked);

    // for <Switch/>
    if (checked) value = checked;

    setValues({ [name]: value });

    //  console.log('STATE', values);
  };

  return (
    <>
      <CommonModal
        modalOpen={modalState.open}
        title={msg.editGroupModal.editGroup}
        forceTitle={true}
        contentStyles={{
          padding: '14px 16px 16px 14px',
        }}
        setModalOpen={handleClose}
        buttons={[
          { title: msg.editGroupModal.buttonCancel, cb: handleClose },
          {
            title: msg.editGroupModal.buttonUpdate,
            cb: () => {
              //console.log('update button clicked')
              handleUpdateGroup({
                groupId: modalState.groupId,
                values: Object.keys(values).map(key => {
                  return { propertyKey: key, value: values[key] };
                }), // convert keyed object to [{"propertyKey":"qqq","value":"111"}]
                name: name,
                description: description,
              });

              //setValues(defaultValue);
              setModalState({ open: false });
            },
          },
        ]}
      >
        <Grid container direction="column" spacing={2}>
          {/*          
          <Grid item>
            <CustomInput
              name="name"
              label={msg.editGroupModal.name}
              clearFieldIcon={true}
              value={values.name}
              onChange={handleInputChange}
            />
          </Grid>
*/}

          <Grid item>
            <CustomInput
              name="name"
              label={msg.editGroupModal.name}
              clearFieldIcon={true}
              value={name}
              onChange={e => {
                setName(e.target.value);
              }}
            />
          </Grid>

          {fields
            .filter(item => item.groupName === 'General' && !item.hidden)
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
              label={msg.editGroupModal.description}
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

export default React.memo(EditGroupModal);
