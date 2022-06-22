import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { Route, BrowserRouter, Switch, Link } from 'react-router-dom';
import App from './App';
import { SnackbarProvider } from 'notistack';
import {
  enqueueSnackbar as enqueueSnackbarAction,
  closeSnackbar as closeSnackbarAction,
} from './actions';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Login from './components/Login';

import { msg } from './messages';

import { setSettings } from './actions';

/*
Меню 14 medium
Заголовок полной карточки 24 medium
 Заголовок проскролленой карточки 20 medium
Заголовки табов в карточке 14 medium
Название проперти 14 regular
Значение проперти 16 regular
  Стандартный текст 16 regular, подзаголовки в окнах и в карточках - 14 regular,

*/

const subTheme = {
  // names of groups in SideList
  h3: {
    fontSize: '16px',
    fontFamily: 'Roboto-Regular',
  },
  // profile modal name/surname. fixed headers in lists
  h4: {
    fontSize: '24px',
    fontFamily: 'Roboto-Medium',
  },
  // dashboard cards title, "add new dashboard"
  h5: {
    fontSize: '20px',
    fontFamily: 'Roboto-Medium',
  },
  // headline in modals
  h6: {
    fontSize: '20px',
    fontFamily: 'Roboto-Medium',
    lineHeight: '32px',
  },
  // dashboard cards subtitle, default text
  body1: {
    fontSize: '14px',
    fontFamily: 'Roboto-Regular',
  },
  // menu list items
  body2: {
    fontSize: '14px',
    fontFamily: 'Roboto-Regular',
  },
  // buttons in modals
  button: {
    fontSize: '14px',
    fontFamily: 'Roboto-Medium',
    lineHeight: '24px',
  },

  // sub headline in forms
  subtitle1: {
    fontSize: '14px',
    fontFamily: 'Roboto-Medium',
    lineHeight: '20px',
  },
};

const themeLight = createMuiTheme({
  typography: subTheme,
  palette: {
    type: 'light',
    foreground: '#000', // text in forms (in some cases like autofill fix)
    background: {
      default: '#ffffff',
      modals: '#ffffff',
    },
    primary: {
      main: '#2780E3', //same as blue
    },
    black1: '#333333',
    blue: '#2780e3', // light blue. links. modals headlines and subheadlines ("secondary")
    green: '#2E7D32',
    yellow: '#FFD600',
    orange: '#FF7518',
    red: '#D50000', // bells
    white: '#fff',
    black: '#000',
    gray1: '#686868', // subtitles, sidemenu items
    gray2: '#9E9E9E', // form helpers
    inactiveIcon: '#eee',
    label: '#9E9E9E', // same as MuiFormLabel
    search: '#000', // search text in MainToolbar

    //    wWhite: '#fff',
    wWhite: '#F9F9F9',
    //    wWhite: '#E5E5E5',
    wBlack: '#000',
    wTransparent: 'rgba(255, 255, 255, 0)', //0.5

    wRed: '#d50000', // widget color
    wDefault: '#333333',
    wBlue: '#2780e3', // widget color
    wGreen: '#2e7d32', // widget color
    wYellow: '#ffd600', // widget color
    wOrange: '#ff7518', // widget color
  },
  overrides: {
    MuiFormLabel: {
      root: { color: '#9E9E9E', fontSize: '14px', lineHeight: '24px' },
    }, // TextField placeholder and fields label
    MuiListItemIcon: {
      root: {
        minWidth: '40px', //distance between icon and text
        marginLeft: '5px',
      },
    },
    MuiListItemText: {
      inset: { paddingLeft: '46px' },
    },
  },
});

const themeDark = createMuiTheme({
  typography: subTheme,
  palette: {
    type: 'dark',
    foreground: '#fff', // text in forms (in some cases like autofill fix)
    background: {
      default: '#000',
      //      default: '#424242',
      modals: '#424242',
    },
    primary: {
      main: '#2780E3', // same as blue
    },
    black1: '#333333',
    blue: '#2780E3', // light blue. links. modals headlines and subheadlines ("secondary")
    green: '#2E7D32',
    yellow: '#FFD600',
    orange: '#FF7518',
    red: '#D50000', // bells
    white: '#666',
    black: '#ddd',
    gray1: '#ddd', // subtitles, sidemenu items
    gray2: '#ddd', // form helpers
    //    divider: rgba(0, 0, 0, 0.12),
    inactiveIcon: '#444',
    // widget colors (don't depend of theme switching)
    label: '#9E9E9E', // same as MuiFormLabel
    search: '#000', // search text in MainToolbar

    wWhite: '#333333',
    wBlack: '#000',
    wTransparent: 'rgba(255, 255, 255, 0)',

    wRed: '#d50000',
    wDefault: '#333333',
    wBlue: '#2780e3',
    wGreen: '#2e7d32',
    wYellow: '#ffd600',
    wOrange: '#ff7518',
  },
  overrides: {
    MuiFormLabel: { root: { color: '#686868' } }, // TextField placeholder
    MuiListItemIcon: {
      root: {
        minWidth: '40px', //distance between icon and text
        marginLeft: '5px',
      },
    },
    MuiListItemText: {
      inset: { paddingLeft: '46px' },
    },
  },
});

// SnackbarProvider must be child of ThemeProvider (to avoid switching theme on snackbars' appearing)
export default function AppWrapper() {
  const theme = useSelector(state => state.settings.theme);
  const lang = useSelector(state => state.settings.lang);

  const dispatch = useDispatch();
  //const notistackRef = React.createRef();

  //  dispatch(setSettings({ layout: generateLayout() }));
  //  dispatch(setSettings({ layout: dashboard }));

  //action={key => <SnackbarCloseButton key={key} />}
  msg.setLanguage(lang);
  //console.log('process.env', process.env.PUBLIC_URL);

  const handleSnackbarClose = snack_id => {
    dispatch(closeSnackbarAction(snack_id));
  };

  return (
    <ThemeProvider theme={theme === 'dark' ? themeDark : themeLight}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={6}
        dense
        preventDuplicate={false}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        action={snack_id => (
          <IconButton
            size="small"
            onClick={key => {
              handleSnackbarClose(snack_id);
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
