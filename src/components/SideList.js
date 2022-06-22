import React, { useState, useRef } from 'react';

import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

//import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useSelector, useDispatch } from 'react-redux';
import { setSettings } from '../actions';

import EditIcon from '@material-ui/icons/Edit';
import SecurityIcon from '@material-ui/icons/Security';
import BlockIcon from '@material-ui/icons/Block';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import HistoryIcon from '@material-ui/icons/History';
import GetAppIcon from '@material-ui/icons/GetApp';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import RoomIcon from '@material-ui/icons/Room';
import CheckIcon from '@material-ui/icons/Check';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import TuneIcon from '@material-ui/icons/Tune';
import SortIcon from '@material-ui/icons/Sort';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
//import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';

import Button from '@material-ui/core/Button';

import useMoreMenu from './useMoreMenu';
import useLongPress from './useLongPress';
import { setContext } from '../actions';

import TopButton from './TopButton';

import { msg } from '../messages';

import { ReactComponent as ImgBoard } from '../assets/board.svg';

const useStyles = makeStyles(theme => ({
  icon: {
    minWidth: '40px', // to maintain distance   icon <---> text
  },

  listLink: {
    color: theme.palette.black,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.black,
    },
  },

  fixedHeader: {
    position: 'fixed',
    flex: 1,
    display: 'flex',
    zIndex: theme.zIndex.drawer - 1,
    alignItems: 'center',
    marginTop: '0px',
    paddingTop: '70px',
    paddingBottom: '8px',
    paddingLeft: '18px',
    paddingRight: '8px',
    borderBottom: `1px solid ${theme.palette.gray2}`,
    borderRight: `1px solid ${theme.palette.gray2}`,
    backgroundColor: theme.palette.background.default,
    width: 'inherit', // to fit fixedHeader into <Drawer/> (on desktops)
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },

  listWrapper: {
    marginTop: '60px',
  },

  //avatar
  item1ToHideOrShow: {
    //visibility: "inherit"
    display: 'block',
  },

  item1ToHide: {
    display: 'none',
  },

  // favorite + moremenu
  item2ToHideOrShow: {
    visibility: 'hidden',
    opacity: 0,
    transition: 'opacity 0.2s linear',
  },

  //checkbox
  item3ToHideOrShow: {
    //visibility: 'hidden'
    display: 'none',
  },

  item3ToShow: {
    display: 'block',
  },

  itemToHover: {
    //border: '1px solid blue',

    '&:hover $item1ToHideOrShow': {
      visibility: 'hidden',
      display: 'none',
    },

    '&:hover $item2ToHideOrShow': {
      visibility: 'visible',
      opacity: 1,
      transition: 'opacity 0.2s linear',
    },

    '&:hover $item3ToHideOrShow': {
      visibility: 'visible',
      display: 'block',
    },
  },
}));

const CustomListItem = props => {
  const { index, handleMoreMenuOpenClick, item, dashboardId } = props;

  const classes = useStyles();
  const history = useHistory();

  //  const [itemHovered, setItemHovered] = useState(false); // hovered or not

  const dispatch = useDispatch();
  const checked = useSelector(state => state.settings.checked);
  const lang = useSelector(state => state.settings.lang);

  const handleToggle = value => {
    console.log('handletoggle', value);
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    dispatch(setSettings({ checked: newChecked }));
  };

  const handleLongClick = e => {
    handleToggle(index);
    console.log('Long pressed!', index);
    //      e.stopPropagation();
    //e.preventDefault()
  };

  // to highlight current object
  const handleMouseOver = e => {
    dispatch(setContext({ objectHoveredId: e.currentTarget.id }));
  };
  // to highlight current object
  const handleMouseLeave = e => {
    dispatch(setContext({ objectHoveredId: null }));
  };

  const onLongPress = useLongPress();

  /*
  const bind = useLongPress(handleLongClick, {
    onStart: event => console.log('Press started'),
    onFinish: event => console.log('Press finished'),
    onCancel: event => history.push(`${process.env.PUBLIC_URL}/${lang}/card`),
    threshold: 500,
    captureEvent: true,
    detect: 'both',
});
 */

  //e.stopPropagation(); e.preventDefault();
  return (
    <ListItem
      key={item.key}
      id={item.id}
      button
      classes={{
        root: classes.itemToHover,
      }}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onContextMenu={event => event.preventDefault()}
    >
      <ListItemIcon
        className={
          checked.indexOf(index) === -1
            ? classes.item3ToHideOrShow
            : classes.item3ToShow
        }
      >
        <Checkbox
          onClick={e => {
            e.preventDefault();

            handleToggle(index);
          }}
          checked={checked.indexOf(index) !== -1}
          edge="start"
          tabIndex={-1}
          disableRipple
          style={{
            marginLeft: '-5px',
            marginRight: '9px',
            paddingRight: '14px',
          }}
          color="primary"
        />
      </ListItemIcon>

      <ListItemAvatar
        className={
          checked.indexOf(index) === -1
            ? classes.item1ToHideOrShow
            : classes.item1ToHide
        }
      >
        <Avatar>
          <ImgBoard />
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        onClick={() =>
          history.push(
            `${process.env.PUBLIC_URL}/${lang}/${dashboardId}/${item.id}`
          )
        }
        {...onLongPress(() => handleToggle(index))}
        primary={<Typography variant="h3">{item.name}</Typography>}
        secondary={item.enabled ? <span>enabled</span> : <span>disabled</span>}
      />
      {checked.indexOf(index) === -1 && (
        <>
          <ListItemSecondaryAction className={classes.item2ToHideOrShow}>
            <IconButton edge="end" aria-label="favorite">
              <StarBorderIcon />
            </IconButton>
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
        </>
      )}
    </ListItem>
  );
}; //CustomListItem

const FixedHeader = props => {
  const { handleMoreMenuOpenClick, dashboardId } = props;
  const classes = useStyles();

  const theme = useTheme();

  // main header menu

  const {
    MoreMenu: HeaderMenu,
    openMoreMenu: openHeaderMenu,
    closeMoreMenu: closeHeaderMenu,
  } = useMoreMenu();
  const {
    MoreMenu: FilterMenu,
    openMoreMenu: openFilterMenu,
    closeMoreMenu: closeFilterMenu,
  } = useMoreMenu();
  const {
    MoreMenu: SortMenu,
    openMoreMenu: openSortMenu,
    closeMoreMenu: closeSortMenu,
  } = useMoreMenu();

  const handleHeaderMenuItemClick = item => {
    console.log('sidebar menu item click:', item);
    props.handleMenuActionClick({
      action: item.action,
      dashboardId: dashboardId,
    });
    closeHeaderMenu();
  };

  // header filter menu

  const handleFilterMenuItemClick = item => {
    console.log('filter menu item click:', item);
    closeFilterMenu();
  };

  // header sort menu

  const handleSortMenuItemClick = item => {
    console.log('sort menu item click:', item);
    closeSortMenu();
  };

  const dispatch = useDispatch();
  const checked = useSelector(state => state.settings.checked);

  const dashboards = useSelector(state => state.context.dashboards);

  const dashboardName = dashboards.find(item => item.id === dashboardId)?.name;

  return (
    <>
      {dashboards.length === 0 && (
        <div className={classes.fixedHeader}>
          <Button
            color="primary"
            style={{ textTransform: 'none' }}
            endIcon={<ArrowDropDownIcon color="primary" />}
            onClick={openHeaderMenu}
          >
            <Typography variant="h4">No dashboards</Typography>
          </Button>
        </div>
      )}

      {checked.length === 0 && dashboards.length > 0 && (
        <div className={classes.fixedHeader}>
          <Button
            color="primary"
            style={{ textTransform: 'none' }}
            endIcon={<ArrowDropDownIcon color="primary" />}
            onClick={openHeaderMenu}
          >
            <Typography variant="h4" style={{}}>
              {dashboardName}
            </Typography>
          </Button>
          <div style={{ flexGrow: 1 }} />
          <IconButton onClick={openFilterMenu}>
            <TuneIcon color="primary" />
          </IconButton>
          <IconButton onClick={openSortMenu}>
            <SortIcon color="primary" />
          </IconButton>
        </div>
      )}

      {checked.length > 0 && (
        <div className={classes.fixedHeader}>
          <Button
            color="primary"
            style={{ textTransform: 'none' }}
            startIcon={<ArrowBackIosIcon color="primary" />}
            onClick={() => {
              dispatch(setSettings({ checked: [] }));
            }}
          >
            <Typography variant="h4" style={{}}>
              Selected: {checked.length}
            </Typography>
          </Button>
          <div style={{ flexGrow: 1 }} />
          <IconButton>
            <StarBorderIcon color="primary" />
          </IconButton>
          <IconButton onClick={openHeaderMenu}>
            <MoreVertIcon color="primary" />
          </IconButton>
          <IconButton onClick={openSortMenu}>
            <SortIcon color="primary" />
          </IconButton>
        </div>
      )}

      <HeaderMenu
        items={[
          {
            icon: <AddIcon />,
            title: 'Add new container',
            id: 'add_new_group',
          },
          {
            icon: <RoomIcon />,
            title: 'Add new minimap',
            id: 'add_new_minimap',
            disabled: true,
          },
        ]}
        handleMenuItemClick={() =>
          handleHeaderMenuItemClick({ action: 'add_new_group' })
        }
      />

      <FilterMenu
        checkable={true}
        items={[
          { title: 'No filter', id: 'no_filter', disabled: true },
          { title: 'Disable', id: 'disable', disabled: true },
        ]}
        handleMenuItemClick={handleFilterMenuItemClick}
      />

      <SortMenu
        checkable={true}
        items={[
          { title: 'Default', id: 'default', disabled: true },
          { title: 'Name', id: 'name', disabled: true },
          { title: 'Status', id: 'status', checked: true, disabled: true },
          { title: 'Type', id: 'type', disabled: true },
          { title: 'Position', id: 'position', disabled: true },
        ]}
        handleMenuItemClick={handleSortMenuItemClick}
      />
    </>
  );
};

const SideList = props => {
  const { onlyHeader, dashboardId } = props;
  const classes = useStyles();
  const dashboard = useSelector(state => state.dashboard);
  const topRef = useRef(null);

  const { MoreMenu, openMoreMenu, closeMoreMenu } = useMoreMenu();
  const [sShowBack, setSshowBack] = useState(false); // if true (onscroll) , show go top button

  const handleMoreMenuItemClick = (item, obj) => {
    console.log('more menu item click:', item, obj);
    props.handleMenuActionClick({
      ...obj,
      action: item,
      type: 'group',
      groupId: obj.id,
    });
    closeMoreMenu();
  };
  //[...Array(30).keys()]

  //dashboard.map((item, index) => { console.log('--',item)})
  return (
    <>
      <div
        style={{
          overflowY: 'scroll',
          width: props.sideBarWidth,
          height: '100%',
        }}
        onScroll={e => {
          // show/hide "go top" button
          if (e.target.scrollTop > 600) setSshowBack(true);
          else setSshowBack(false);
        }}
      >
        <div ref={topRef} />

        <TopButton in={sShowBack} topRef={topRef} />

        <FixedHeader {...props} />

        {!onlyHeader && (
          <List className={classes.listWrapper} style={{ marginTop: '150px' }}>
            {dashboard.map((item, index) => (
              <CustomListItem
                key={index}
                index={index}
                item={item}
                handleMoreMenuOpenClick={(e, itemId) => {
                  openMoreMenu(e, itemId);
                }}
                {...props}
              />
            ))}
          </List>
        )}
      </div>

      <MoreMenu
        items={[
          { icon: <EditIcon />, title: 'Edit', id: 'edit' },
          {
            icon: <SecurityIcon />,
            title: 'Change access',
            id: 'change_access',
            disabled: true,
          },
          {
            icon: <BlockIcon />,
            title: 'Disable',
            id: 'disable',
            disabled: true,
          },
          {
            icon: <VolumeOffIcon />,
            title: 'Mute',
            id: 'mute',
            disabled: true,
          },
          {
            icon: <AddIcon />,
            title: 'Create copy',
            id: 'create_copy',
            disabled: true,
          },
          {
            icon: <SendIcon />,
            title: 'Send notification',
            id: 'send_notification',
            disabled: true,
          },
          {
            icon: <HistoryIcon />,
            title: 'Show history',
            id: 'show_history',
            disabled: true,
          },
          {
            icon: <GetAppIcon />,
            title: 'Download notifications',
            id: 'download_notifications',
            disabled: true,
          },
          { icon: <FilterNoneIcon />, title: 'Copy UUID', id: 'copy_uuid' },
          { icon: <DeleteIcon />, title: 'Delete', id: 'delete' },
        ]}
        handleMenuItemClick={handleMoreMenuItemClick}
      />
    </>
  );
};
export default SideList;
