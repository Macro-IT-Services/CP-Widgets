/*
Usage:


const {
    MoreMenu: WidgetMenu,
    openMoreMenu: openMoreMenu,
    closeMoreMenu: closeMoreMenu,
  } = useMoreMenu();

  ...

  const handleMenuItemClick = (item, obj) => {
    console.log('SideCard js/TabContentObjects/context menu click:', item, obj);
    closeMoreMenu();
    ..make some call/action...
  };

// optional. Required if you need dynamical items (depending on obj properties)
  const handleProcessItems = (items,obj) =>{

    let updatedItems = items

    if (
      (obj?.schemaTags[3]==='databox') 
      // &&       !items.findIndex(item => item.id !== 'edit_colors')
    ) {
      updatedItems = updatedItems.filter(item => item.id !== 'edit_colors')  //remove edit_colors item
      updatedItems.unshift({
        icon: <PaletteIcon />,
        title: msg.sideCard.moreMenu.optionalColors,
        id: 'edit_colors',
      });
    }//if
    else {
    //  updatedItems = updatedItems.filter(item => item.id !== 'edit_colors') //remove edit_colors item
    }

    return updatedItems
  }



    <IconButton
      edge="end"
      aria-label="more"
      onClick={e => {
        console.log('clicked context object menu',object.object2.schemaTags.join('/'))
            openMoreMenu(e, {
              // passes to handleProcessItems obj
              ...item, 
              widgetId: item.id,
              type: item.schemaTags[2],
              widgetType: item.schemaTags[3],
              groupId: groupId,



            })      
        }}
    >
      <MoreVertIcon />
    </IconButton>



    <WidgetMenu items={menuItems} handleMenuItemClick={handleMenuItemClick} handleProcessItems={handleProcessItems}  />    

    
*/

import React, { useState, useCallback } from 'react';

import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
//import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';

import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  icon: {
    minWidth: '40px', // to maintain distance   icon <---> text
  },
}));

//props.closeOnSelect = true/false

const useMoreMenu = () => {
  //const { handleMenuItemClick } = props;

  const classes = useStyles();

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [obj, setObj] = useState(null);
  //const [items, setItems] = useState([]);
  const handleCloseMoreMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleOpenMoreMenu = (e, obj) => {
    setMenuAnchorEl(e.currentTarget);
    setObj(obj);
  };

  const defaultHandleProcessItems = items => items;

  const MoreMenu = useCallback(
    props => {
      //  console.log('=====',props)
      const {
        items,
        handleProcessItems = defaultHandleProcessItems,
        checkable,
        handleMenuItemClick,
      } = props;

      return (
        <Menu
          id="more_menu"
          anchorEl={menuAnchorEl}
          getContentAnchorEl={null}
          keepMounted
          open={Boolean(menuAnchorEl)}
          onClose={handleCloseMoreMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {handleProcessItems(items, obj).map(item => (
            <MenuItem
              disabled={item.disabled ?? false}
              onClick={() => {
                handleMenuItemClick(item.id, obj); // handler in App.js (call on object context menu)

                // здесь взависимости от type показывать те или иные пункты контекстного меню
              }}
              key={item.id}
              style={{ justifyContent: 'space-between' }}
            >
              <Grid style={{ display: 'inline-flex', alignItems: 'center' }}>
                {item.icon && (
                  <ListItemIcon className={classes.icon}>
                    {item.icon}
                  </ListItemIcon>
                )}
                <Grid>
                  <Typography variant="body2">{item.title}</Typography>
                </Grid>
              </Grid>
              <Grid>
                {checkable && (
                  <ListItemIcon className={classes.icon}>
                    {item.checked ? (
                      <CheckIcon
                        fontSize="small"
                        style={{ marginLeft: '40px' }}
                      />
                    ) : (
                      <span style={{ width: '40px' }} />
                    )}
                  </ListItemIcon>
                )}
              </Grid>
            </MenuItem>
          ))}
        </Menu>
      );
    },
    [menuAnchorEl]
  );

  return {
    MoreMenu,
    openMoreMenu: handleOpenMoreMenu,
    closeMoreMenu: handleCloseMoreMenu,
  };
};

export default useMoreMenu;
