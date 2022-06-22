import React, { useReducer, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Switch from '@material-ui/core/Switch';
import InputAdornment from '@material-ui/core/InputAdornment';
//import { Button, Typography, Box } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

import { setSettings } from '../actions';

import CommonModal from '../components/CommonModal';
import Subtitle from '../components/Subtitle';

import CustomInput from '../components/CustomInput';
import CustomSelect from '../components/CustomSelect';
import CustomSwitch from '../components/CustomSwitch';
import CustomRadio from '../components/CustomRadio';

import CustomTags from '../components/CustomTags';

import { msg } from '../messages';

import { ReactComponent as ImgUpload } from '../assets/upload.svg';

const styles = theme => ({
  imgUpload: {
    width: '100%',
  },
});

const TestModal = props => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const useStyles = makeStyles(theme => styles(theme));

  const classes = useStyles();

  // for forms
  //  const [fieldTest, setFieldTest] = useState('dark');
  const [values, setValue] = useReducer(
    (prev, updated) => ({ ...prev, ...updated }),
    {
      testTags: [
        { title: 'Fix Tag 1', value: 'fix_tag_1' },
        { title: 'Fix Tag 2', value: 'fix_tag_2' },
        { title: 'Tag 1', value: 'tag_1' },
      ],
      testRadio: { title: 'Mute all', value: 'mute_all' },
      testText: 'Some text',
      testSelect: 'option_1',
      testSwitch: '',
    }
  );

  const settings = useSelector(state => state.settings);
  const dispatch = useDispatch();

  const handleClose = () => props.setModalOpen(false);

  const handleInputChange = e => {
    //console.log("handleInputChange e", e)

    let { name, value, checked } = e.target;
    //    console.log(name, value, checked);

    // for <Switch/>
    if (checked) value = checked;

    setValue({ [name]: value });

    console.log('Form state', values);
  };

  return (
    <>
      <CommonModal
        modalOpen={props.modalOpen}
        title="Test modal"
        forceTitle={true}
        contentStyles={{
          padding: '14px 16px 16px 14px',
        }}
        setModalOpen={handleClose}
        buttons={[
          { title: 'Cancel', cb: handleClose },
          { title: 'Save', cb: handleClose },
        ]}
      >
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <CustomRadio
              name="testRadio"
              label="CustomRadio"
              list={[
                {
                  icon: <VolumeUpIcon />,
                  title: 'All notifications',
                  value: 'all_not',
                },
                {
                  icon: <StarOutlineIcon />,
                  title: 'Favorites only',
                  value: 'fav_only',
                  disabled: true,
                },
                {
                  icon: <VolumeOffIcon />,
                  title: 'Mute all',
                  value: 'mute_all',
                },
              ]}
              value={values.testRadio}
              onChange={handleInputChange}
            />

            <CustomTags
              name="testTags"
              label="CustomTags"
              freeSolo
              placeholder="..."
              list={[
                { title: 'Tag 1', value: 'tag_1' },
                { title: 'Tag 2', value: 'tag_2' },
                { title: 'Tag 3', value: 'tag_3' },
                { title: 'Fix Tag 1', value: 'fix_tag_1' },
                { title: 'Fix Tag 2', value: 'fix_tag_2' },
              ]}
              listFixed={[
                { title: 'Fix Tag 1', value: 'fix_tag_1' },
                { title: 'Fix Tag 2', value: 'fix_tag_2' },
              ]}
              value={values.testTags}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item>
            <CustomInput
              name="testText"
              label="CustomInput"
              clearFieldIcon={true}
              value={values.testText}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item>
            <CustomSelect
              name="testSelect"
              label="CustomSelect"
              list={[
                { value: 'option_1', title: 'Option 1' },
                { value: 'option_2', title: 'Option 2' },
              ]}
              value={values.testSelect}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item container justify="space-between" alignItems="center">
            <CustomSwitch
              name="testSwitch"
              label="CustomSwitch"
              value={values.testSwitch}
              onChange={handleInputChange}
            />
          </Grid>

          {/*
          <Grid item>
            <Subtitle>{msg.addDashboardModal.backgroundImage}</Subtitle>
          </Grid>
          <Grid item>
            <ImgUpload className={classes.imgUpload} />
          </Grid>
*/}
        </Grid>
      </CommonModal>
    </>
  );
};

export default TestModal;
