import React, { useReducer, useState, useEffect, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
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
import CloseIcon from '@material-ui/icons/Close';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import { setSettings } from '../actions';

import CommonModal from '../components/CommonModal';
import Subtitle from '../components/Subtitle';

import CustomInput from '../components/CustomInput';
import CustomSelect from '../components/CustomSelect';
import CustomSwitch from '../components/CustomSwitch';
import CustomTags from '../components/CustomTags';

import FormField from '../components/FormField';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import { setContext } from '../actions';

import { DASHBOARD_QUERY } from '../queries';

import { msg } from '../messages';
import { mediaServer } from '../constants';

//import { ReactComponent as ImgUpload } from '../assets/upload.svg';
import imgUpload from '../assets/upload.svg';

const styles = theme => ({


  iconButton: {
    backgroundColor: '#000000',
    opacity: '0.44',
    height: '40px',
    width: '40px',
    color: '#ffffff',
    marginLeft: '16px',
    '&:hover': {
      backgroundColor: '#000000',
      opacity: '0.6',
      },
    },



});

const EditDashboardModal = props => {
  const {
    modalState,
    setModalState,
    handleUpdateDashboard,
    handleDeleteDashboard,
    handleUpdateDashboardProps,
    setDeleteDashboardModalState,
  } = props;

  //  console.log('EditDashboardModal props', modalState);
  const uploadInputRef = useRef(null);
  const [fileIsUploading, setFileIsUploading] = useState(false);


  const theme = useTheme();
  const client = useApolloClient();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const useStyles = makeStyles(theme => styles(theme));
  const classes = useStyles();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [titleStyle, setTitleStyle] = useState('');
  const [compactMode, setCompactMode] = useState(false);
  const [description, setDescription] = useState('');

  const [fields, setFields] = useState([]);

  const [backgroundUID, setBackgroundUID] = useState(null);
  const [fileName, setFileName] = useState(null);

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
        //        console.log('+++ dashboardType',dashboardtType)

        const result = await client.query({
          query: DASHBOARD_QUERY,
          variables: { objId: modalState.dashboardId },
          fetchPolicy: 'network-only',
        });

        //        console.log('dashboards props result count', result.data.objects.length);

        console.log('dashboard result', result.data.object); // description, key, hidden, type

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

        //     console.log('+++', fields)
        //console.log('defaultValues', defaultValues)

        setBackgroundUID(defaultValues["generalBackgroundImageUid"]);

        setFields(fields); // description/component types for each field
        setValues(defaultValues); // loaded values for each field
        setName(result.data.object.name);
        setDescription(result.data.object.description);
      } catch (err) {
        console.log('dashboards props error', err);
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
  /*
  const handleInputChange = e => {
    //    console.log('handleInputChange e', e);

    let { name, value, checked } = e.target;
    console.log(name, value, checked);

    // for <Switch/>
    if (checked) value = checked;

    setValue({ [name]: value });

    //    console.log('STATE', values);
  };
*/

  const handleInputChange = e => {
    //    console.log('handleInputChange e', e);

    let { name, value, checked } = e.target;
    //       console.log(name, value, checked);

    // for <Switch/>
    if (checked) value = checked;

    setValues({ [name]: value });

    //  console.log('STATE', values);
  };


  const handleFileUpload = async e => {
    console.log('handleFileUpload',e.target.files)
    const [file] = e.target.files;

    const extension = file.name.split('.').pop();

    if (file.size > 10000000) {
        enqueueSnackbar({
            message: 'file too large',
            options: { variant: 'error' },
        });
        return false;
    }

    if ((extension !== 'jpg') && (extension !== 'jpeg') && (extension !== 'png')) {
        enqueueSnackbar({
            message: 'wrong file format',
            options: { variant: 'error' },
        });
        return false;
    }

    setFileIsUploading(true);
    try {

        const formData = new FormData();
        formData.append('uploaded_file', file, file.name);

        console.log('fetching...')

        const uploadUID = (backgroundUID) ? backgroundUID : '0';
        
        const response = await fetch(`${mediaServer}/upload/${uploadUID}/${localStorage.getItem('authToken')}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            //'Content-Type': 'multipart/form-data',
            //'Content-Type': 'image/jpeg'
          },
          body: formData
        })        

        const result_uid = await response.text();
        console.log('file upload result', result_uid);
        setBackgroundUID(result_uid);
        setFileName(file.name);
        setValues({ generalBackgroundImageUid: result_uid, generalBackgroundImageName: file.name });

/*
// write background UI to generalBackgroundImage
        handleUpdateDashboard({
          dashboardId: modalState.dashboardId,
          values: [{ "propertyKey": "generalBackgroundImage", "value": result_uid }],
        });
//        name: name,
//        description: description,
*/
        setFileIsUploading(false);



//        setFileUploaded(true);
    } catch (e) {
        console.log('file upload error', e);
        setFileIsUploading(false);
        if (e.response) {
            if (e.response.status === 403) {
                enqueueSnackbar({
                    message: 'file upload error 403',
                    options: { variant: 'error' },
                });
            }
        } else {
            enqueueSnackbar({
                message: 'file upload error',
                options: { variant: 'error' },
            });
        }
    }
  };//handleFileUpload

  const handleDelete = async e => {
    console.log('handleDelete',e.target)

/*
    await handleUpdateDashboardProps({
      dashboardId: modalState.dashboardId,
      values: [{"propertyKey": "generalBackgroundImageName","value":null}, {"propertyKey": "generalBackgroundImageUid", "value":null}],
    });
  */
    setBackgroundUID(null);
    setFileName(null);
    setValues({ generalBackgroundImageUid: null, generalBackgroundImageName: null });

/*
    enqueueSnackbar({
      message: 'Background deleted',
      options: { variant: 'info' },
    });
*/

  };//handleFileDelete



  console.log('backgroundUID',backgroundUID)
  console.log('fileIsUploading',fileIsUploading)
  const backgroundUrl = `${mediaServer}/download/${backgroundUID}/${localStorage.getItem('authToken')}?${fileName}`; 
  const backgroundBlankUrl = imgUpload; // no background defined, show svg
  //const backgroundUrl = `${mediaServer}/download/30f0ca7e-00d8-4e59-b517-8a3d2a9e46af/${localStorage.getItem('authToken')}`; 
  console.log('backgroundUrl',backgroundUrl)
  console.log('fileName',fileName)

  return (
    <>
      <CommonModal
        modalOpen={modalState.open}
        title={msg.editDashboardModal.editDashboard}
        forceTitle={true}
        contentStyles={{
          padding: '14px 16px 16px 14px',
        }}
        setModalOpen={handleClose}
        buttons={[
          { title: msg.editDashboardModal.buttonCancel, cb: handleClose },
          {
            title: msg.editDashboardModal.buttonUpdate,
            cb: () => {
              //console.log('update button clicked')
              handleUpdateDashboard({
                dashboardId: modalState.dashboardId,
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
              label={msg.editDashboardModal.name}
              clearFieldIcon={true}
              value={values.name}
              onChange={handleInputChange}
            />
          </Grid>
*/}

          <Grid item>
            <CustomInput
              name="name"
              label={msg.editDashboardModal.name}
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
            <InputLabel >{msg.editDashboardModal.backgroundImage}</InputLabel>

          </Grid>
          <Grid item container justify="flex-end" alignItems="flex-start" style={{ width:'380px',minHeight:'120px', maxHeight: '360px', padding: 0, backgroundImage: `url(${backgroundUID ? backgroundUrl : backgroundBlankUrl})`, backgroundSize: '100%',  overflow: 'hidden', position: 'relative' }} >

{/* same image, completely transparent, to stretch outer div to maximum defined height */}
            <div style={{position:'relative',}}>
              <img src={`${backgroundUID ? backgroundUrl : backgroundBlankUrl}`} style={{width:'100%', opacity: '0', }}/>
            </div>

{/* buttons upload/copy/delete */}
            <div style={{position:'absolute', right: '16px', top: '8px'}}>
              {backgroundUID && <IconButton  className={classes.iconButton} 
                onClick={e => {
                  // copy media uuid to clipboard (https only!)
                  navigator.clipboard.writeText(backgroundUID);
                  enqueueSnackbar({
                    message: msg.editDashboardModal.copied,
                    options: { code: 'UNKNOWN', variant: 'info' },
                  });

                }}            
              >
                  <FilterNoneIcon  />
                </IconButton>
              }

              {!backgroundUID && <IconButton  className={classes.iconButton} 
              onClick={() => {
                uploadInputRef.current &&
                uploadInputRef.current.click();
              }}
                >
                  <CloudUploadIcon />
                </IconButton>
              }

              {backgroundUID && <IconButton  className={classes.iconButton} onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              }

            </div>
                      
{/* spinner */}
            <div style={{position:'absolute', width: '100%', }}>
              {fileIsUploading && <LinearProgress style={{width: '100%'}} />}
            </div>


              {!fileIsUploading &&
                  (
                      <>
                          <input
                              ref={uploadInputRef}
                              type="file"
                              accept=".jpg,.jpeg,.png"
                              hidden
                              multiple={false}
                              onChange={handleFileUpload}
                          />

                      </>
                  )}

          </Grid>

          <Grid item>
            <CustomInput
              name="description"
              label={msg.editDashboardModal.description}
              clearFieldIcon={true}
              value={description}
              multiline={true}
              onChange={e => {
                setDescription(e.target.value);
              }}
            />
          </Grid>

          <Grid item container>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              disableElevation
              style={{ marginTop: '20px' }}
              onClick={e => {
                // copy dashboard id to clipboard (https only!)
                navigator.clipboard.writeText(modalState.dashboardId);
                enqueueSnackbar({
                  message: msg.editDashboardModal.copied,
                  options: { code: 'UNKNOWN', variant: 'info' },
                });
              }}
            >
              {msg.editDashboardModal.buttonCopy}
            </Button>

            <Button
              variant="contained"
              color="secondary"
              fullWidth
              disableElevation
              style={{ marginTop: '16px' }}
              onClick={e => {
                setDeleteDashboardModalState({
                  open: true,
                  dashboardId: modalState.dashboardId,
                });

                setModalState({ open: false });
              }}
            >
              {msg.editDashboardModal.buttonDelete}
            </Button>
          </Grid>
        </Grid>
      </CommonModal>
    </>
  );
};

export default React.memo(EditDashboardModal);
