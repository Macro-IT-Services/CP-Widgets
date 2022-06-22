import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
//import { useSelector, useDispatch } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';

import Spinner from '../components/Spinner';
import Tooltip from '@material-ui/core/Tooltip';

import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import EditIcon from '@material-ui/icons/Edit';
import SecurityIcon from '@material-ui/icons/Security';
import BlockIcon from '@material-ui/icons/Block';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import HistoryIcon from '@material-ui/icons/History';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import RoomIcon from '@material-ui/icons/Room';
import CheckIcon from '@material-ui/icons/Check';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import CodeIcon from '@material-ui/icons/Code';
import SpaceBarIcon from '@material-ui/icons/SpaceBar';
import PaletteIcon from '@material-ui/icons/Palette';
import ReplyIcon from '@material-ui/icons/Reply';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
//import CloseIcon from '@material-ui/icons/Close';
import ClearIcon from '@material-ui/icons/Clear';

import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MessageIcon from '@material-ui/icons/Message';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

import ExtensionIcon from '@material-ui/icons/Extension'; // dataset icon
import MemoryIcon from '@material-ui/icons/Memory'; // device icon

import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';

import TopButton from './TopButton';
import useMoreMenu from './useMoreMenu';
import { Fade, Collapse, useScrollTrigger } from '@material-ui/core';
import { parseISO, format } from 'date-fns';

import useLongPress from './useLongPress';

import { ReactComponent as ImgBoard } from '../assets/board.svg';

import { NOTIFICATIONS_QUERY, LINKED_OBJECTS_QUERY } from '../queries';
import { setContext } from '../actions';

import { msg } from '../messages';

import ImgHeaderPic from '../assets/card_header_pic.png';

const useStyles = makeStyles(theme => ({
  /*
  listItemIcon: {
    minWidth: '40px', //distance between icon and text
    marginLeft: '5px',
  },
  */

  headerPic: {
    //height: '240px',
    width: '100%',
  },

  commonHeader: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    marginTop: '15px',
    marginLeft: '17px',
  },

  // applies on certain scrollTop
  fixedHeader: {
    position: 'fixed',
    top: '0px',
    paddingTop: '60px',
    //    width: '395px', //'inherit' better but it overwrites scrollbar on desktop
    width: 'inherit',
    /*
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    */
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 10, //1
    borderBottom: `1px solid ${theme.palette.gray2}`,
  },

  tabButton: {
    minWidth: 'auto',
    flexBasis: 'auto', // get rid of left margin for tab buttons
    paddingBottom: '15px',
    paddingInline: '8px',
  },

  tabs: {
    borderBottom: `1px solid ${theme.palette.blue}`,
    //   display: 'block',
    // minHeight: '0px',
    transition: '1s',
    //    width: '170px',
    padding: 0,
  },

  tabsHidden: {
    //display: 'none' ,
    minHeight: '0px',
    transition: '0.5s',
  },

  tabPanel: {
    marginTop: '0px',
  },

  listSubheader: {
    marginTop: '15px',
    marginBottom: '10px',
  },

  prop: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
  },

  itemToHideOrShow: {
    visibility: 'hidden',
    opacity: 0,
    transition: 'opacity 0.2s linear',
  },
  itemToHover: {
    //    border: "1px solid blue",
    '&:hover $itemToHideOrShow': {
      visibility: 'visible',
      opacity: 1,
      transition: 'opacity 0.2s linear',
    },
  },
}));

const updated = (updatedAt, userByBy) => {
  //  console.log('updatedAt, userByBy',updatedAt, userByBy)
  return (
    format(parseISO(updatedAt), 'MMM d, hh:mm:ss a').toString() +
    (userByBy ? ' by ' + userByBy.login : '')
  );
};

const PropListItem = props => {
  console.log('PropListItem props', props);

  const {
    handleMoreMenuOpenClick,
    obj,
    item,
    type,
    groupId,
    dashboardId,
    widgetId,
    tab,
  } = props;

  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <ListItem
      key={item.key}
      button
      classes={{
        container: classes.itemToHover,
      }}
      onClick={e => {
        // copy property value to clipboard (https only!)
        navigator.clipboard.writeText(
          e.currentTarget.getElementsByClassName('value')[0].innerText
        );
      }}
    >
      {tab !== 'properties' && (
        <ListItemIcon>
          <NotificationsActiveIcon
            style={{ color: theme.palette.wTransparent }}
          />
        </ListItemIcon>
      )}
      <ListItemText
        primary={
          <Tooltip
            title={
              <>
                <Typography color="inherit">{`${item.key}:`}</Typography>
                <Typography color="inherit">
                  {JSON.stringify(item.value)}
                </Typography>
              </>
            }
          >
            <Typography variant="body1" className={classes.prop}>
              {`${item.property}`}:{' '}
              <span className="value">{`${JSON.stringify(item.value)}`}</span>
            </Typography>
          </Tooltip>
        }
        secondary={updated(item.updatedAt, item.userByBy)}
      />

      {((tab === 'general' && item.key === 'valueValue') ||
        tab === 'properties') && (
        <ListItemSecondaryAction className={classes.itemToHideOrShow}>
          <IconButton
            edge="end"
            aria-label="more"
            onClick={e => {
              e.preventDefault();

              handleMoreMenuOpenClick(e, item);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}; //PropListItem

const TabContentGeneral = props => {
  const {
    item,
    type,
    handleMenuActionClick,
    dashboardId,
    groupId,
    widgetId,
  } = props;
  const classes = useStyles();

  const {
    MoreMenu: ValueMenu,
    openMoreMenu: openValueMenu,
    closeMoreMenu: closeValueMenu,
  } = useMoreMenu();

  const handleMenuItemClick = (item, obj, property) => {
    console.log(
      'SideCard js/TabContentGeneral/value context menu click:',
      item,
      obj
    );
    closeValueMenu();
    handleMenuActionClick({
      ...obj,
      action: item,
      widgetId: obj.id,
      propId: obj.propId,
      propKey: obj.propKey,
    });
  };

  // group properties by groupName (array of properties -> array of groupNames)
  const grouping = (arr, key) =>
    (arr || []).reduce(
      (acc, x = {}) => ({ ...acc, [x[key]]: [...(acc[x[key]] || []), x] }),
      {}
    );

  console.log('----------- SideCard.js TabContentGeneral item', item);

  const groups = grouping(item.objectProperties, 'groupName');
  const groupNames = Object.keys(groups);

  return (
    <>
      <List className={classes.root}>
        <ListSubheader color="primary" className={classes.listSubheader}>
          <Typography variant="subtitle1">
            {msg.sideCard.serviceInfo}
          </Typography>
        </ListSubheader>
        <ListItem button onClick={() => {}}>
          <ListItemIcon>
            <AccountTreeIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body1">
                {item.schemaTags.join(' / ')}
              </Typography>
            }
            onClick={e => {
              // copy property value to clipboard (https only!)
              navigator.clipboard.writeText(item.schemaTags.join(' / '));
            }}
          />
        </ListItem>
        <ListItem button onClick={() => {}}>
          <ListItemIcon>
            <CodeIcon />
          </ListItemIcon>
          <ListItemText
            onClick={e => {
              // copy property value to clipboard (https only!)
              navigator.clipboard.writeText(item.id);
            }}
            primary={<Typography variant="body1">{item.id}</Typography>}
          />
        </ListItem>

        {groupNames.map(groupName => {
          if (groupName !== 'Value') return false;

          const headline = (
            <ListSubheader
              color="primary"
              key={groupName}
              className={classes.listSubheader}
            >
              <Typography variant="subtitle1">{groupName}</Typography>
            </ListSubheader>
          );

          return [
            headline,
            groups[groupName].map((item, index) => (
              <PropListItem
                tab="general"
                key={index}
                index={index}
                obj={props.item}
                item={item}
                dashboardId={dashboardId}
                widgetId={widgetId}
                groupId={groupId}
                type={type}
                handleMoreMenuOpenClick={(e, itemId) => {
                  openValueMenu(e, {
                    ...props.item,
                    propKey: item.key,
                    propId: item.id,
                    widgetId: props.item.id,
                  });
                }}
              />
            )),
          ];
        })}

        <ListSubheader color="primary" className={classes.listSubheader}>
          <Typography variant="subtitle1">{msg.sideCard.access}</Typography>
        </ListSubheader>
        <ListItem button onClick={() => {}}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body1">
                {item.userGroupByEditorgroup.groupName}
              </Typography>
            }
          />
        </ListItem>

        <ListItem button onClick={() => {}}>
          <ListItemIcon>
            <PlayCircleOutlineIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body1">
                {item.userGroupByUsergroup.groupName}
              </Typography>
            }
          />
        </ListItem>

        <ListItem button onClick={() => {}}>
          <ListItemIcon>
            <RemoveRedEyeIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body1">
                {item.userGroupByReadergroup.groupName}
              </Typography>
            }
          />
        </ListItem>

        <ListSubheader color="primary" className={classes.listSubheader}>
          <Typography variant="subtitle1">
            {msg.sideCard.description}
          </Typography>
        </ListSubheader>
        <ListItem button onClick={() => {}}>
          <ListItemText
            primary={
              <Typography variant="body1">{item.description}</Typography>
            }
          />
        </ListItem>
      </List>
      <ValueMenu
        items={[
          {
            icon: <EditIcon />,
            title: 'Edit source',
            id: 'edit_source',
          },
          {
            icon: <HistoryIcon />,
            title: 'Show history',
            id: 'show_history',
            disabled: true,
          },
          {
            icon: <NotificationsIcon />,
            title: 'Alarms',
            id: 'edit_alarms',
          },
        ]}
        handleMenuItemClick={handleMenuItemClick}
      />
    </>
  );
};

const TabContentProperties = props => {
  const {
    item,
    type,
    handleMenuActionClick,
    dashboardId,
    groupId,
    widgetId,
  } = props;

  const classes = useStyles();
  const theme = useTheme();

  const {
    MoreMenu: PropMenu,
    openMoreMenu: openPropMenu,
    closeMoreMenu: closePropMenu,
  } = useMoreMenu();

  const handleMenuItemClick = (item, obj) => {
    console.log(
      'SideCard js/TabContentProperties context menu click:',
      item,
      obj
    );
    closePropMenu();
    handleMenuActionClick({ ...obj, action: item, widgetId: obj.id });
  };

  // group properties by groupName (array of properties -> array of groupNames)
  const grouping = (arr, key) =>
    (arr || []).reduce(
      (acc, x = {}) => ({ ...acc, [x[key]]: [...(acc[x[key]] || []), x] }),
      {}
    );

  //  console.log('----------- SideCard.js item', item);

  const groups = grouping(item.objectProperties, 'groupName');
  const groupNames = Object.keys(groups);

  return (
    <>
      <List className={classes.root}>
        {groupNames.map(groupName => {
          if (groupName === 'Value') return false;
          const headline = (
            <ListSubheader
              color="primary"
              key={groupName}
              className={classes.listSubheader}
            >
              <Typography variant="subtitle1">{groupName}</Typography>
            </ListSubheader>
          );

          return [
            headline,
            groups[groupName].map((item, index) => (
              <PropListItem
                tab="properties"
                key={index}
                index={index}
                obj={props.item}
                item={item}
                dashboardId={dashboardId}
                widgetId={widgetId}
                groupId={groupId}
                type={type}
                handleMoreMenuOpenClick={(e, itemId) => {
                  openPropMenu(e, {
                    ...props.item,
                    propKey: item.key,
                    propId: item.id,
                    widgetId: props.item.id,
                  });
                }}
              />
            )),
          ];
        })}
      </List>
      <PropMenu
        items={[
          {
            icon: <EditIcon />,
            title: 'Edit',
            id: 'edit_prop',
            disabled: true,
          },
          {
            icon: <ReplyIcon />,
            title: 'Set default',
            id: 'set_default_prop',
            disabled: true,
          },
          {
            icon: <ClearIcon />,
            title: 'Set null',
            id: 'set_null_prop',
            disabled: true,
          },
          {
            icon: <FilterNoneIcon />,
            title: 'Copy',
            id: 'copy_prop',
          },
          {
            icon: <HistoryIcon />,
            title: 'Show history',
            id: 'show_history_prop',
            disabled: true,
          },
        ]}
        handleMenuItemClick={handleMenuItemClick}
      />
    </>
  );
};

const ObjectListItem = props => {
  const {
    handleMoreMenuOpenClick,
    item,
    type,
    groupId,
    dashboardId,
    widgetId,
  } = props;
  //  const [itemHovered, setItemHovered] = useState(false); // hovered or not

  const classes = useStyles();
  const lang = useSelector(state => state.settings.lang);
  const history = useHistory();
  const dispatch = useDispatch();

  // to highlight current object
  const handleMouseOver = e => {
    dispatch(setContext({ objectHoveredId: e.currentTarget.id }));
  };
  // to highlight current object
  const handleMouseLeave = e => {
    dispatch(setContext({ objectHoveredId: null }));
  };

  return (
    <ListItem
      key={item.id}
      id={item.id}
      button
      alignItems="center"
      classes={{
        container: classes.itemToHover,
      }}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      {type === 'group' && (
        <ListItemAvatar>
          <Avatar>
            <ImgBoard />
          </Avatar>
        </ListItemAvatar>
      )}

      {type === 'widget' && (
        <ListItemIcon>
          {item.schemaType === 'dataset' && <ExtensionIcon />}
          {item.schemaType === 'device' && <MemoryIcon />}
        </ListItemIcon>
      )}

      <ListItemText
        id={item.id}
        onClick={e => {
          if (type === 'widget')
            history.push(
              `${process.env.PUBLIC_URL}/${lang}/${dashboardId}/${groupId}/${widgetId}/${e.currentTarget.id}`
            );
          else if (type == 'group')
            history.push(
              `${process.env.PUBLIC_URL}/${lang}/${dashboardId}/${groupId}/${e.currentTarget.id}`
            );
        }}
        primary={<Typography variant="body1">{item.name}</Typography>}
        secondary={
          item.enabled ? (
            <span>{msg.sideCard.enabled}</span>
          ) : (
            <span>{msg.sideCard.disabled}</span>
          )
        }
      />

      <ListItemSecondaryAction className={classes.itemToHideOrShow}>
        <IconButton
          edge="end"
          aria-label="more"
          onClick={e => {
            console.log('clicked context object menu within list', item);
            e.preventDefault();
            handleMoreMenuOpenClick(e, item);
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}; //ObjectListItem

// show list of linked objects in corresponding tab
const TabContentObjects = props => {
  const {
    dashboardId,
    groupId,
    widgetId,
    objectId,
    type,
    item,
    handleMenuActionClick,
    menuItems,
  } = props;

  console.log('SideCard.js TabContentObjects props', props);

  const dispatch = useDispatch();

  // context menu for each item within list
  // TODO: shouldn't be only widgets menu (extend to devices, etc?)
  const {
    MoreMenu: WidgetMenu,
    openMoreMenu: openMoreMenu,
    closeMoreMenu: closeMoreMenu,
  } = useMoreMenu();

  const handleMenuItemClick = (item, obj) => {
    console.log('SideCard js/TabContentObjects/context menu click:', item, obj);
    closeMoreMenu();
    handleMenuActionClick({ ...obj, action: item, widgetId: obj.id });
  };

  const handleProcessItems = (items, obj) => {
    //    console.log('!!!',items,obj)
    let updatedItems = items;

    if (
      obj?.schemaTags[3] === 'databox'
      // &&       !items.findIndex(item => item.id !== 'edit_colors')
    ) {
      updatedItems = updatedItems.filter(item => item.id !== 'edit_colors'); //remove edit_colors item
      updatedItems.unshift({
        icon: <PaletteIcon />,
        title: msg.sideCard.moreMenu.optionalColors,
        id: 'edit_colors',
      });
    } //if
    //  console.log('!!!++',updatedItems)
    return updatedItems;
  };
  /*
  const onLongPress = useLongPress();
  const handleToggle = value => {
    console.log('handletoggle', value);
  };
*/
// sort array based on array of ids in order array
  const mapOrder = (array, order) => {
    
    array.sort( function (a, b) {
      var A = a.object2.id, B = b.object2.id;
      
      if (order.indexOf(A) > order.indexOf(B)) {
        return 1;
      } else {
        return -1;
      }
      
    });
    
    return array;
  };
  //  if (!item.objectsToObjectsByObject1Id) return <Spinner />; // wait until objects loaded
  
  const generalOrder = item.objectProperties.find(obj => obj.key === 'generalOrder')?.value
  //console.log('!!!', generalOrder);
//  was: {item.objectsToObjectsByObject1Id.map((object, index) => (

  //console.log('===',  mapOrder(item.objectsToObjectsByObject1Id, generalOrder)    )
  return (
    <>
      <List>
        {mapOrder(item.objectsToObjectsByObject1Id, generalOrder).map((object, index) => (
          <ObjectListItem
            key={index}
            index={index}
            item={object.object2}
            dashboardId={dashboardId}
            widgetId={widgetId}
            groupId={groupId}
            type={type}
            handleMoreMenuOpenClick={(e, itemId) => {
              //console.log('handleMoreMenuOpenClick handler',object.object2) !
              openMoreMenu(e, {
                ...object.object2,
                type: object.object2.schemaTags[2],
                widgetType: object.object2.schemaTags[3],
                groupId: groupId,
              });
            }}
          />
        ))}
      </List>
      {item.objectsToObjectsByObject1Id.length > 0 && (
        <WidgetMenu
          items={menuItems}
          handleMenuItemClick={handleMenuItemClick}
          handleProcessItems={handleProcessItems}
        />
      )}
    </>
  );
}; //TabContentObjects

const TabContentNotifications = props => {
  const { dashboardId, groupId, widgetId, objectId, type } = props;

  console.log('SideCard.js TabContentNotifications props', props);

  const classes = useStyles();
  const theme = useTheme();

  const client = useApolloClient();

  const [notifications, setNotifications] = useState();

  //  const createdAt = createdAt => format(parseISO(createdAt), 'MMM d, hh:mm:ss a').toString() + ' by ' + notification.userByBy.login;

  const objId = type === 'group' ? groupId : widgetId;

  useEffect(() => {
    //console.log('app.js/useEffect');
    // load notifications for object objId (group e.g.)
    const query = async () => {
      try {
        const result = await client.query({
          query: NOTIFICATIONS_QUERY,
          variables: { objId: objId },
        });
        console.log('SideCard.js/notifications query res', result);

        setNotifications(result.data.notifications);
      } catch (err) {
        console.log('SideCard.js/notifications query err', err);
      }
      //setLoading(false)
    };
    query();
  }, [objId]);

  if (!notifications) return <Spinner />; // wait until notifications loaded

  console.log('notifications', notifications);

  return (
    <List>
      {notifications.map((notification, index) => (
        <ListItem alignItems="center" button key={notification.id}>
          <ListItemIcon>
            {notification.tags.find(obj => obj === 'alert') && <VolumeUpIcon />}
            {notification.tags.find(obj => obj === 'message') && (
              <MessageIcon />
            )}
            {notification.tags.find(obj => obj === 'notice') && (
              <NotificationsActiveIcon />
            )}
            {notification.tags.find(obj => obj === 'triggered') && (
              <NotificationsActiveIcon style={{ color: theme.palette.red }} />
            )}
          </ListItemIcon>

          <ListItemText
            onClick={() => {}}
            primary={
              <Typography variant="body1">{notification.message}</Typography>
            }
            secondary={
              format(
                parseISO(notification.createdAt),
                'MMM d, hh:mm:ss a'
              ).toString() +
              ' by ' +
              notification.userByBy.login
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
};

const CommonHeader = props => {
  const {
    item,
    dashboardId,
    groupId,
    widgetId,
    objectId,
    type,
    handleMenuActionClick,
    menuItems,
  } = props;
  const classes = useStyles();
  const dashboard = useSelector(state => state.dashboard);

  const { MoreMenu, openMoreMenu, closeMoreMenu } = useMoreMenu();

  const handleMenuItemClick = (item, obj) => {
    console.log('SideCard js/menu click:', item);
    closeMoreMenu();
    //handleMenuActionClick({ action: item, ...props });
    handleMenuActionClick({ ...obj, action: item });
  };

  const handleProcessItems = (items, obj) => {
    //    console.log('@@!!!',items,obj)
    let updatedItems = items;

    if (
      obj?.schemaTags[3] === 'databox'
      // &&       !items.findIndex(item => item.id !== 'edit_colors')
    ) {
      updatedItems = updatedItems.filter(item => item.id !== 'edit_colors'); //remove edit_colors item
      updatedItems.unshift({
        icon: <PaletteIcon />,
        title: msg.sideCard.moreMenu.optionalColors,
        id: 'edit_colors',
      });
    } //if
    else {
      //  updatedItems = updatedItems.filter(item => item.id !== 'edit_colors') //remove edit_colors item
    }
    //    console.log('@@!!!++',updatedItems)
    return updatedItems;
  };

  /*
  // add one "edit colors" menu item for DataBox widgets only
  if (
    item.schemaTags.includes('databox') &&
    !menuItems.findIndex(item => item.id !== 'edit_colors')
  ) {
    //console.log('menuItems before',menuItems)
    menuItems.unshift({
      icon: <PaletteIcon />,
      title: msg.sideCard.moreMenu.optionalColors,
      id: 'edit_colors',
    });
    //console.log('menuItems after',menuItems)
  } //if
*/
  return (
    <>
      <div className={classes.commonHeader}>
        <div>
          <Typography variant="h4">{item.name}</Typography>
        </div>

        <div style={{ flexGrow: 1 }} />

        <IconButton
          onClick={e => {}}
          size="small"
          style={{ marginRight: '12px' }}
        >
          <StarBorderIcon color="primary" />
        </IconButton>

        <IconButton
          onClick={e => {
            console.log('clicked context object menu at corner of card', item);
            openMoreMenu(e, {
              ...item,
              widgetId: item.id,
              type: item.schemaTags[2],
              widgetType: item.schemaTags[3],
              groupId: groupId,
            });
          }}
          size="small"
          style={{ marginRight: '12px' }}
        >
          <MoreVertIcon color="primary" />
        </IconButton>
      </div>
      <div style={{ marginLeft: '17px', marginBottom: '15px' }}>
        <Typography variant="body1">
          {item.enabled ? (
            <span>{msg.sideCard.enabled}</span>
          ) : (
            <span>{msg.sideCard.disabled}</span>
          )}
        </Typography>
      </div>
      <MoreMenu
        items={menuItems}
        handleMenuItemClick={handleMenuItemClick}
        handleProcessItems={handleProcessItems}
      />
    </>
  );
};

const NormalHeader = props => (
  <div>
    <CommonHeader {...props} />
  </div>
);

const FixedHeader = props => {
  const classes = useStyles();

  return (
    <div className={classes.fixedHeader}>
      <CommonHeader {...props} />
    </div>
  );
};

// this component loads necessary object completely, with all linked objects
// and display depending on props.type
const SideCard = props => {
  const {
    dashboardId,
    groupId,
    widgetId,
    objectId,
    type,
    item,
    handleMenuActionClick,
  } = props;
  const client = useApolloClient();
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [tabValue, setTabValue] = useState('general');
  const [linkedObjects, setLinkedObjects] = useState();
  const topRef = useRef(null);

  const [sFixed, setSFixed] = useState(false); // if true (onscroll), fix header
  const [sFixedFade, setSFixedFade] = useState(true); // if false (onscroll), fade in fix header
  const [sShowBack, setSshowBack] = useState(false); // if true (onscroll) , show go top button

  console.log('SideCard props', props);

  let menuItems = [
    { icon: <EditIcon />, title: msg.sideCard.moreMenu.edit, id: 'edit' },
    {
      icon: <SecurityIcon />,
      title: msg.sideCard.moreMenu.changeAccess,
      id: 'change_access',
      disabled: true,
    },
    {
      icon: <BlockIcon />,
      title: msg.sideCard.moreMenu.disable,
      id: 'disable',
      disabled: true,
    },
    {
      icon: <VolumeOffIcon />,
      title: msg.sideCard.moreMenu.mute,
      id: 'mute',
      disabled: true,
    },
    {
      icon: <AddIcon />,
      title: msg.sideCard.moreMenu.createCopy,
      id: 'create_copy',
      disabled: true,
    },
    {
      icon: <SendIcon />,
      title: msg.sideCard.moreMenu.sendNotification,
      id: 'send_notification',
      disabled: true,
    },
    {
      icon: <HistoryIcon />,
      title: msg.sideCard.moreMenu.showHistory,
      id: 'show_history',
      disabled: true,
    },
    {
      icon: <GetAppIcon />,
      title: msg.sideCard.moreMenu.downloadNotifications,
      id: 'download_notifications',
      disabled: true,
    },
    {
      icon: <FilterNoneIcon />,
      title: msg.sideCard.moreMenu.copyUUID,
      id: 'copy_uuid',
    },
    {
      icon: <DeleteIcon />,
      title: msg.sideCard.moreMenu.delete,
      id: 'delete',
    },
  ];

  useEffect(() => {
    setTabValue('general');
  }, [type]);

  //if (!item) return <Spinner />; // wait until dashboard will be filled with required group data

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMoreMenuItemClick = e => {
    console.log('menu item click', e);
  };

  //console.log('menuItems', menuItems)

  return (
    <>
      <div
        style={{
          overflowY: 'scroll',
          width: props.sideBarWidth,
          height: '100%',
        }}
        onScroll={e => {
          // show/hide fixed header
          if (e.target.scrollTop > 180) setSFixed(true);
          else setSFixed(false);

          // fadein fixed header
          if (e.target.scrollTop > 100) setSFixedFade(false);
          else setSFixedFade(true);

          // show/hide "go top" button
          if (e.target.scrollTop > 600) setSshowBack(true);
          else setSshowBack(false);
        }}
      >
        <div ref={topRef} />
        <TopButton in={sShowBack} topRef={topRef} />
        <Fade in={sFixedFade}>
          <img src={ImgHeaderPic} alt="logo" className={classes.headerPic} />
        </Fade>

        {sFixed && <FixedHeader item={item} menuItems={menuItems} {...props} />}
        <NormalHeader item={item} menuItems={menuItems} {...props} />

        <Tabs
          onChange={handleChangeTab}
          value={tabValue}
          aria-label="tabs"
          TabIndicatorProps={{ style: { backgroundColor: theme.palette.blue } }}
          className={classes.tabs}
        >
          <Tab
            value="general"
            label={msg.sideCard.general}
            className={classes.tabButton}
            aria-label="general"
            style={{ marginLeft: '8px' }}
          />

          <Tab
            value="properties"
            label={msg.sideCard.properties}
            className={classes.tabButton}
            aria-label="properties"
          />

          {type === 'group' && (
            <Tab
              value="widgets"
              label={msg.sideCard.widgets}
              className={classes.tabButton}
              aria-label="widgets"
            />
          )}
          {type === 'widget' && (
            <Tab
              value="objects"
              label={msg.sideCard.objects}
              className={classes.tabButton}
              aria-label="objects"
            />
          )}

          <Tab
            value="notifications"
            label={msg.sideCard.notifications}
            className={classes.tabButton}
            aria-label="notifications"
          />
        </Tabs>

        <TabPanel value={tabValue} index="general" className={classes.tabPanel}>
          <TabContentGeneral item={item} {...props} />
        </TabPanel>

        <TabPanel
          value={tabValue}
          index="properties"
          className={classes.tabPanel}
        >
          <TabContentProperties item={item} topRef={topRef} {...props} />
        </TabPanel>

        {type === 'group' && (
          <TabPanel
            value={tabValue}
            index="widgets"
            className={classes.tabPanel}
          >
            <TabContentObjects item={item} menuItems={menuItems} {...props} />
          </TabPanel>
        )}

        {type === 'widget' && (
          <TabPanel
            value={tabValue}
            index="objects"
            className={classes.tabPanel}
          >
            <TabContentObjects item={item} menuItems={menuItems} {...props} />
          </TabPanel>
        )}

        <TabPanel
          value={tabValue}
          index="notifications"
          className={classes.tabPanel}
        >
          <TabContentNotifications {...props} />
        </TabPanel>
      </div>
    </>
  );
};
export default SideCard;
