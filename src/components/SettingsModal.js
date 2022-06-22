import React, { useReducer, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';

//import { Button, Typography, Box } from '@material-ui/core';

import { setSettings } from '../actions';

import CommonModal from '../components/CommonModal';
import Subtitle from '../components/Subtitle';
import CustomSwitch from '../components/CustomSwitch';

import { msg } from '../messages';

import { ReactComponent as ImgUpload } from '../assets/upload.svg';

const styles = theme => ({
  imgUpload: {
    width: '100%',
  },
});

const SettingsModal = props => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const useStyles = makeStyles(theme => styles(theme));

  const classes = useStyles();

  // for forms
  //  const [fieldTest, setFieldTest] = useState('dark');
  //const [values, setValue] = useReducer( (prev, updated) => ({...prev, ...updated}), { password1: '', password2: '', password: '', theme: 'light' } );

  const settings = useSelector(state => state.settings);
  const lang = useSelector(state => state.settings.lang);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleClose = () => props.setModalOpen(false);

  const handleInputChange = e => {
    let { name, value, checked } = e.target;
    //    console.log('name,value, checked', name, value, checked);

    // for <Switch/>
    //    if (checked) value = checked;
    if (typeof checked !== 'undefined') value = checked;

    //TODO: better make all state changes ONLY after press of "Save" button
    dispatch(setSettings({ [name]: value })); // update global state

    if (name === 'lang')
      history.replace(history.location.pathname.replace(lang, value));
  };

  //TODO: replace Input to CustomInput ?
  return (
    <>
      <CommonModal
        modalOpen={props.modalOpen}
        title={msg.settingsModal.settings}
        forceTitle={true}
        contentStyles={{
          padding: '14px 16px 16px 14px',
        }}
        setModalOpen={handleClose}
        buttons={[
          { title: msg.settingsModal.buttonCancel, cb: handleClose },
          { title: msg.settingsModal.buttonSave, cb: handleClose },
        ]}
      >
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Subtitle>{msg.settingsModal.general}</Subtitle>
          </Grid>
          {/*
          <Grid item>
            <InputLabel htmlFor="settings-theme-label">
              {msg.settingsModal.defaultTheme}
            </InputLabel>
            <Select
              name="theme"
              id="settings-theme-label"
              value={settings.theme}
              labelId="settings-theme-label"
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value="dark">{msg.settingsModal.themeDark}</MenuItem>
              <MenuItem value="light">{msg.settingsModal.themeLight}</MenuItem>
            </Select>
          </Grid>
*/}
          <Grid item>
            <InputLabel htmlFor="settings-lang-label">
              {msg.settingsModal.defaultLang}
            </InputLabel>
            <Select
              name="lang"
              id="settings-lang-label"
              value={settings.lang}
              labelId="settings-lang-label"
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value="en">{msg.settingsModal.langEnglish}</MenuItem>
              <MenuItem value="ru">{msg.settingsModal.langRussian}</MenuItem>
            </Select>
          </Grid>

          <Grid item>
            <InputLabel htmlFor="app-title">
              {msg.settingsModal.appTitle}
            </InputLabel>
            <Input
              name="appTitle"
              id="app-title"
              value={settings.appTitle}
              onChange={handleInputChange}
              fullWidth
              inputProps={{
                style: {
                  WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.modals} inset`,
                  WebkitTextFillColor: theme.palette.foreground,
                },
              }}
            />
          </Grid>

          <Grid item container justify="space-between" alignItems="center">
            <InputLabel
              htmlFor="settings-simulation-label"
              style={{ display: 'inline' }}
            >
              {msg.settingsModal.simulation}
            </InputLabel>

            <Switch
              name="simulation"
              id="settings-simulation-label"
              value={settings.simulation === 'true' ? 'on' : ''}
              checked={Boolean(settings.simulation)}
              onChange={handleInputChange}
              color="primary"
            />
          </Grid>

          <Grid item>
            <Subtitle>{msg.settingsModal.companyLogo}</Subtitle>
          </Grid>
          <Grid item>
            <ImgUpload className={classes.imgUpload} />
          </Grid>
          <Grid item>
            <Subtitle>{msg.settingsModal.appLogo}</Subtitle>
          </Grid>
          <Grid item>
            <ImgUpload className={classes.imgUpload} />
          </Grid>
        </Grid>
      </CommonModal>
    </>
  );
};

export default SettingsModal;
