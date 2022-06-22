import React, { useReducer, useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useApolloClient } from '@apollo/client';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import {
  enqueueSnackbar as enqueueSnackbarAction,
  //    closeSnackbar as closeSnackbarAction,
} from '../actions';

import CommonModal from '../components/CommonModal';
import Subtitle from '../components/Subtitle';

import CustomInput from '../components/CustomInput';
import CustomSelect from '../components/CustomSelect';
import CustomSwitch from '../components/CustomSwitch';
import CustomTags from '../components/CustomTags';

import FormField from '../components/FormField';

import { GROUPS_PROPS_QUERY } from '../queries';

import { setContext } from '../actions';

import { msg } from '../messages';

import { ReactComponent as ImgUpload } from '../assets/upload.svg';

const styles = theme => ({
  imgUpload: {
    width: '100%',
  },
  obsoleted: {
    background:
      'repeating-linear-gradient(-45deg,#222,#222 10px,#333 10px,#333 20px)',
  },
});

const AddGroupModal = props => {
  const { modalState, setModalState, handleAddGroup } = props;

  //console.log('AddGroupModal props', modalState);

  const theme = useTheme();
  const client = useApolloClient();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const useStyles = makeStyles(theme => styles(theme));
  const classes = useStyles();

  const [fields, setFields] = useState([]);

  //const [groupType, setGroupType] = useState('');
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
        //        console.log('+++ groupType',groupType)
        // get 1) existings objects ids (to count them for default name)  2) list of general object properties (from schema) with its description, types etc.
        const result_props = await client.query({
          query: GROUPS_PROPS_QUERY,
          variables: {},
          //          variables: { groupType: groupType || 'databox' },
          fetchPolicy: 'network-only',
        });
        //setObjectsCount(result_props.objects?.length);
        //        console.log('groups props result count', result_props.data.objects.length);

        //setValues(result_props.data.schemata[0].schemaProperties.map(prop=>{return {[prop.key]:prop.defaultValue} }))
        console.log(
          'groups props result props',
          result_props.data.schemata[0].schemaProperties
        ); // description, key, hidden, type

        // set components
        setFields(result_props.data.schemata[0].schemaProperties);

        // default values
        // convert array to keyed object
        result_props.data.schemata[0].schemaProperties.forEach(prop => {
          //          console.log('def:',prop.defaultValue)
          defaultValues[prop.key] = prop.defaultValue;
        });

        setValues(defaultValues);
        setName(`Group #${result_props.data.objects.length + 1}`);
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
  //}, [modalState.open, groupType]);

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
        title={msg.addGroupModal.addGroup}
        forceTitle={true}
        contentStyles={{
          padding: '14px 16px 16px 14px',
        }}
        setModalOpen={handleClose}
        buttons={[
          { title: msg.addGroupModal.buttonCancel, cb: handleClose },
          {
            title: msg.addGroupModal.buttonAdd,
            cb: () => {
              handleAddGroup({
                //              groupIdClicked: modalState.groupIdClicked,
                dashboardId: modalState.dashboardId,
                name: name,
                description: description,
                values: Object.keys(values).map(key => {
                  return { propertyKey: key, value: values[key] };
                }), // convert keyed object to [{"propertyKey":"qqq","value":"111"}]
                //                groupType: groupType,
              });
              //setValues(defaultValue);
              setModalState({ open: false });
            },
          },
        ]}
      >
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <CustomInput
              name="name"
              label={msg.addGroupModal.name}
              clearFieldIcon={true}
              value={name ?? ''}
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
              label={msg.addGroupModal.description}
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

export default React.memo(AddGroupModal);
