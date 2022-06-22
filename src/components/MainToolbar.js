import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Divider from '@material-ui/core/Divider';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';

import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
/*
import {
  useApolloClient,
} from '@apollo/client';

import {
  APPS_QUERY,
} from '../queries';
*/
import { msg } from '../messages';

const useStyles = makeStyles(theme => ({
  searchBar: {
    display: 'flex',
    flex: 1,
    padding: '0',
    alignItems: 'center',
    marginTop: '8px',
    [theme.breakpoints.up('sm')]: {
      maxWidth: '380px',
    },
  },

  // to remove outline from Autocomplete
  atfOutlinedInput: {
    '&:not(hover):not($disabled):not($atfFocused):not($error) $atfNotchedOutline': {
      borderColor: 'transparent', //default
    },
    '&:hover:not($disabled):not($atfFocused):not($error) $atfNotchedOutline': {
      borderColor: 'transparent', //hovered
    },
    '&$atfFocused $atfNotchedOutline': {
      border: 'transparent', //focused
    },
  },
  atfNotchedOutline: {},
  atfFocused: {},

  // text when not typing (placeholder) ?
  /*
  input: {
    '&::placeholder': {
      fontSize: '26px',
      fontFamily: 'Roboto-Regular',
      color: '#000',
  
    },
  },
  */
  inputRoot: {
    fontSize: '16px',
    fontFamily: 'Roboto-Regular',
    color: '#000',
  },
  // text while typing
  /*
  input: {

    fontSize: '26px',
    fontFamily: 'Roboto-Regular',
    color: theme.palette.search,

  } 
  */
}));

// if back = false, show menu icon. if not, show back arrow and use back content as text
const MainToolbar = props => {
  const { handleDrawerToggle, setNotificationsModalOpen, back } = props;

  const classes = useStyles();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('sm'));
  const history = useHistory();
  //  const client = useApolloClient();

  const currentObjectName = useSelector(
    state => state.context.currentObjectName
  );

  const [searchField, setSearchField] = useState('');
  const [clearSearchButton, setClearSearchButton] = useState(false);

  const handleSearchField = value => {
    setSearchField(value);
    if (value !== '') setClearSearchButton(true);
    else setClearSearchButton(false);
  };

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <Paper component="form" className={classes.searchBar} elevation={5}>
      <Autocomplete
        value={searchField}
        onInputChange={(event, value) => handleSearchField(value)}
        fullWidth
        disableClearable
        clearOnEscape
        freeSolo
        classes={{ inputRoot: classes.inputRoot }}
        options={['Cat', 'Dog', 'Horse'].map(option => option)}
        renderInput={params => (
          <TextField
            {...params}
            InputLabelProps={{
              classes: {
                root: classes.label,
              },
            }}
            InputProps={{
              ...params.InputProps,
              style: { paddingTop: '3px', paddingBottom: '3px' },
              startAdornment: (
                <InputAdornment position="start">
                  {!back && (
                    <IconButton onClick={handleDrawerToggle} size="small">
                      <MenuIcon />
                    </IconButton>
                  )}
                  {back && (
                    <Tooltip title={msg.mainToolbar.goBack}>
                      <IconButton onClick={handleGoBack} size="small">
                        <ArrowBackIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {clearSearchButton && (
                    <>
                      <IconButton
                        aria-label="clear field"
                        onClick={() => setSearchField(null)}
                        size="small"
                      >
                        <ClearIcon />
                      </IconButton>

                      <Divider
                        orientation="vertical"
                        style={{
                          backgroundColor: '#686868',
                          marginLeft: '10px',
                          marginRight: '10px',
                          height: '32px',
                        }}
                      />
                    </>
                  )}

                  <IconButton
                    aria-label="clear field"
                    onClick={() => {
                      console.log('search');
                    }}
                    size="small"
                  >
                    <SearchIcon />
                  </IconButton>

                  {!desktop && (
                    <>
                      <Divider
                        orientation="vertical"
                        style={{
                          backgroundColor: '#686868',
                          marginLeft: '10px',
                          marginRight: '10px',
                          height: '32px',
                        }}
                      />
                      <IconButton
                        aria-label="notifications"
                        onClick={() => setNotificationsModalOpen(true)}
                        size="small"
                      >
                        <Badge variant="dot" color="secondary">
                          <NotificationsIcon />
                        </Badge>
                      </IconButton>
                    </>
                  )}
                </InputAdornment>
              ),
              classes: {
                root: classes.atfOutlinedInput,
                focused: classes.atfFocused,
                notchedOutline: classes.atfNotchedOutline,
              },
            }}
            placeholder={back ? currentObjectName : msg.appBar.search}
            variant="outlined"
          />
        )}
        renderOption={option => (
          <>
            <NotificationsIcon style={{ marginRight: '10px' }} />
            {option}
          </>
        )}
      />
    </Paper>
  );
};

export default MainToolbar;
