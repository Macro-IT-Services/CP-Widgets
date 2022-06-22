import React, { useState, Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import {
  useApolloClient,
  useMutation,
  useQuery,
  useLazyQuery,
} from '@apollo/client';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import { Link } from 'react-router-dom';

import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';
import HelpIcon from '@material-ui/icons/Help';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AddIcon from '@material-ui/icons/Add';
import WidgetsIcon from '@material-ui/icons/Widgets';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EditIcon from '@material-ui/icons/Edit';

import ListIcon from '@material-ui/icons/List';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';

import { DASHBOARDS_QUERY } from '../queries';

import { ReactComponent as ImgLogo } from '../assets/logo.svg';
import { ReactComponent as ImgLogoDark } from '../assets/logo_dark.svg';

import { setContext } from '../actions';

import { msg } from '../messages';

// Side menu items

/*
id - for list keys
types:
  '' - go url
  'modal' - open modal window
  'divider' - divider

*/

const useStyles = makeStyles(theme => ({
  logo: {
    marginLeft: '16px',
    marginTop: '16px',
    marginBottom: '10px',
  },
  listItemIcon: {
    minWidth: '50px',
    //    color: '#686868',
    color: theme.palette.gray1,
  },
  listItemText: {
    //    color: '#686868',
    color: theme.palette.gray1,
    //    fontSize: '14px',
    //    fontWeight: '500',
    //    fontFamily: 'Roboto-Medium',
  },
}));

const MainSideMenu = props => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [folderState, setFolderState] = useState({ boards: true });
  //const [selectedState, setSelectedState] = useState();

  //  const settings = useSelector(state => state.settings);
  /*
  const {
    loading: loading_GetDashboards,
    data: data_GetDashboards,
    error: error_GetDashboards,
    refetch: refetch_GetDashboards,
  } = useQuery(DASHBOARDS_QUERY);  //TODO make with promise
*/
  const client = useApolloClient();

  //  const [dataDashboards, setDataDashboards] = useState(null)
  const [loading, setLoading] = useState(true);
  const dataDashboards = useSelector(state => state.context.dashboards);

  const handleListItemClick = item => {
    //    console.log(item)
    //setSelectedState(event.currentTarget.id);
    props.handleMenuActionClick(item);
  };

  const handleToggleClick = item => {
    //this.setState(prevState => ({ [item]: !prevState[item] }));
    setFolderState({ [item]: !folderState[item] });
  };
  //return null
  //console.log('!!!',dataDashboards,loading)
  // wait for dashboards data
  //if (loading) return null;

  return (
    <div>
      {theme.palette.type === 'dark' && (
        <ImgLogoDark className={classes.logo} />
      )}
      {theme.palette.type === 'light' && <ImgLogo className={classes.logo} />}
      <Divider />
      <List>
        {props.account && (
          <ListItem
            id="account"
            button
            onClick={event => handleListItemClick({ action: 'account' })}
          >
            <ListItemIcon className={classes.listItemIcon}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary={
                <Typography variant="body2">
                  {msg.mainSideMenu.account}
                </Typography>
              }
            />
          </ListItem>
        )}
        {/*
        <ListItem
          button
          className={classes.listItem}
          onClick={() => handleListItemClick('home')}
        >
          <ListItemIcon className={classes.listItemIcon}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={
              <Typography variant="body2">{msg.mainSideMenu.home}</Typography>
            }
          />
        </ListItem>
          */}
        {/*
        <ListItem
          button
          className={classes.listItem}
          onClick={() => handleListItemClick('widgets')}
        >
          <ListItemIcon className={classes.listItemIcon}>
            <WidgetsIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={
              <Typography variant="body2">
                {msg.mainSideMenu.widgets}
              </Typography>
            }
          />
        </ListItem>
          */}
        <ListItem
          button
          className={classes.listItem}
          onClick={() => handleToggleClick('boards')}
        >
          <ListItemIcon className={classes.listItemIcon}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={
              <Typography variant="body2">{msg.mainSideMenu.boards}</Typography>
            }
          />
          {folderState['boards'] ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={folderState['boards']} timeout="auto" unmountOnExit>
          {dataDashboards.map(item => (
            <ListItem
              key={item.id}
              button
              className={classes.listItem}
              onClick={() =>
                handleListItemClick({ action: 'board', id: item.id })
              }
            >
              <ListItemIcon className={classes.listItemIcon}></ListItemIcon>
              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary={<Typography variant="body2">{item.name}</Typography>}
              />

              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  size="small"
                  aria-label="edit"
                  onClick={() =>
                    handleListItemClick({ action: 'editboard', id: item.id })
                  }
                >
                  <EditIcon style={{ height: '18px' }} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </Collapse>

        <ListItem
          button
          className={classes.listItem}
          onClick={() => handleListItemClick({ action: 'addboard' })}
        >
          <ListItemIcon className={classes.listItemIcon}>
            <AddIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={
              <Typography variant="body2">
                {msg.mainSideMenu.addBoard}
              </Typography>
            }
          />
        </ListItem>

        <Divider />
        {/*
        <ListItem
          button
          className={classes.listItem}
          onClick={() => handleListItemClick({ action: 'users' })}
        >
          <ListItemIcon className={classes.listItemIcon}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={
              <Typography variant="body2">{msg.mainSideMenu.users}</Typography>
            }
          />
        </ListItem>

        <ListItem
          button
          className={classes.listItem}
          onClick={() => handleToggleClick({ action: 'usergroups' })}
        >
          <ListItemIcon className={classes.listItemIcon}>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={
              <Typography variant="body2">
                {msg.mainSideMenu.userGroups}
              </Typography>
            }
          />
          {folderState['usergroups'] ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
          */}
        <Collapse in={folderState['usergroups']} timeout="auto" unmountOnExit>
          {[1, 2, 3, 4, 5, 6, 7].map(item => (
            <ListItem
              key={item}
              button
              className={classes.listItem}
              onClick={() => handleListItemClick({ action: 'usergroup' })}
            >
              <ListItemIcon className={classes.listItemIcon}></ListItemIcon>
              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary={
                  <Typography variant="body2">{`${msg.mainSideMenu.userGroup} #${item}`}</Typography>
                }
              />
            </ListItem>
          ))}
        </Collapse>

        <Divider />

        <ListItem
          button
          className={classes.listItem}
          onClick={() => handleListItemClick({ action: 'settings' })}
        >
          <ListItemIcon className={classes.listItemIcon}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={
              <Typography variant="body2">
                {msg.mainSideMenu.settings}
              </Typography>
            }
          />
        </ListItem>

        <ListItem
          button
          className={classes.listItem}
          onClick={() => handleListItemClick({ action: 'about' })}
        >
          <ListItemIcon className={classes.listItemIcon}>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={
              <Typography variant="body2">{msg.mainSideMenu.about}</Typography>
            }
          />
        </ListItem>

        <ListItem
          button
          className={classes.listItem}
          onClick={() => handleListItemClick({ action: 'help' })}
        >
          <ListItemIcon className={classes.listItemIcon}>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={
              <Typography variant="body2">{msg.mainSideMenu.help}</Typography>
            }
          />
        </ListItem>
        {/*
        <ListItem
          button
          className={classes.listItem}
          onClick={() => handleListItemClick({ action: 'debug_1' })}
        >
          <ListItemIcon className={classes.listItemIcon}>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={<Typography variant="body2">Debug 1 (login)</Typography>}
          />
        </ListItem>

        <ListItem
          button
          className={classes.listItem}
          onClick={() => handleListItemClick({ action: 'debug_2' })}
        >
          <ListItemIcon className={classes.listItemIcon}>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={
              <Typography variant="body2">Debug 2 (notification)</Typography>
            }
          />
        </ListItem>
          */}
      </List>
    </div>
  );
};
export default MainSideMenu;
