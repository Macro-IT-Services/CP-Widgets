import React, { useReducer, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
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

import FormField from '../components/FormField';

import { setContext } from '../actions';

import {
  ADD_DASHBOARD_MUTATION,
  DASHBOARDS_QUERY,
  DASHBOARDS_PROPS_QUERY,
} from '../queries';

import { msg } from '../messages';

import { ReactComponent as ImgUpload } from '../assets/upload.svg';

const styles = theme => ({
  imgUpload: {
    width: '100%',
  },
});

const AddDashboardModal = props => {
  const { modalState, setModalState, handleAddDashboard } = props;
  const lang = useSelector(state => state.settings.lang);
  const history = useHistory();

  //  console.log('AddDashboardModal props', modalState);
  const theme = useTheme();
  const client = useApolloClient();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const useStyles = makeStyles(theme => styles(theme));
  const classes = useStyles();

  const [name, setName] = useState('');
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
        // get 1) existings objects ids (to count them for default name)  2) list of general object properties (from schema) with its description, types etc.
        const result_props = await client.query({
          query: DASHBOARDS_PROPS_QUERY,
          variables: {},
          fetchPolicy: 'network-only',
        });
        //        console.log('dashboards props result count', result_props.data.objects.length);

        console.log(
          'dashboards props result props',
          result_props.data.schemata[0].schemaProperties
        ); // description, key, hidden, type

        // set components
        setFields(result_props.data.schemata[0].schemaProperties);

        // default values
        // convert array to keyed object
        result_props.data.schemata[0].schemaProperties.forEach(prop => {
          defaultValues[prop.key] = prop.defaultValue;
        });

        setValues(defaultValues);
        setName(`Dashboard #${result_props.data.objects.length + 1}`);
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

  /*
  const handleAddDashboard = async () => {
    try {
      const result_add = await client.mutate({
        mutation: ADD_DASHBOARD_MUTATION,
        variables: {
          name: values['name'],
          enabled: Boolean(values['enabled']),
        },
      });

      const result = await client.query({
        query: DASHBOARDS_QUERY,
        variables: {},
        fetchPolicy: 'network-only',
      });
      //        setDataDashboards(result.data.objects)
      console.log('addDashboard result', result_add, result);
      dispatch(setContext({ dashboards: result.data.objects }));

      //go new dashboard immediately
      history.push(
        `/${lang}/${result_add.data.createObjectWithProperties.uuid}`
      );
    } catch (error) {
      console.log('addDashboard error', error);

      //setErrorCode(graphQLErrors[0].extensions.code)
    } finally {
      setValue(defaultValue);
      setModalState({ open: false });
    }
  };
*/
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
        title={msg.addDashboardModal.addBoard}
        forceTitle={true}
        contentStyles={{
          padding: '14px 16px 16px 14px',
        }}
        setModalOpen={handleClose}
        buttons={[
          { title: msg.addDashboardModal.buttonCancel, cb: handleClose },

          {
            title: msg.addDashboardModal.buttonAdd,
            cb: () => {
              handleAddDashboard({
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
          <Grid item>
            <CustomInput
              name="name"
              label={msg.addDashboardModal.name}
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
              label={msg.addDashboardModal.description}
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

export default React.memo(AddDashboardModal);
