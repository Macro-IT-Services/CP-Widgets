import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme, withTheme } from '@material-ui/core/styles';
import { useApolloClient, useMutation, useSubscription } from '@apollo/client';
//import sjson from 'secure-json-parse';
import _ from 'lodash';

//import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
//import Link from '@material-ui/core/Link';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';

import {
  WIDGETS_QUERY,
  UPDATE_GROUPS_LAYOUTS_MUTATION,
  ADD_GROUP_MUTATION,
  DELETE_OBJECT_MUTATION,
  ADD_WIDGET_MUTATION,
  UPDATE_WIDGET_MUTATION,
  UPDATE_GROUP_MUTATION,
  UPDATE_GROUP_ORDER_MUTATION,
} from '../queries';

import {
  enqueueSnackbar as enqueueSnackbarAction,
  //    closeSnackbar as closeSnackbarAction,
} from '../actions';

//import AddDashboardModal from '../components/AddDashboardModal';

import AddGroupModal from '../components/AddGroupModal';
import DeleteGroupModal from '../components/DeleteGroupModal';
import DeleteWidgetModal from '../components/DeleteWidgetModal';
import AddWidgetModal from '../components/AddWidgetModal';
import EditWidgetModal from '../components/EditWidgetModal';
import EditGroupModal from '../components/EditGroupModal';

import Spinner from '../components/Spinner';

//import ImgTest2 from '../assets/test2.jpg';
import { ReactComponent as ImgWidgets } from '../assets/test_widgets.svg';

import { msg } from '../messages';
import { setContext } from '../actions';

import {
  addToLayout,
  updateEntireLayout,
  clearLayout,
  deleteFromLayout,
  clearDashboard,
  addToDashboard,
  updateInDashboard,
  updateEntireDashboard,
  deleteFromDashboard,
} from '../actions';

import W_Vibration from './W_Vibration';
import W_DataChart from './W_DataChart';
import W_ImageBox from './W_ImageBox';
import W_ObjectTable from './W_ObjectTable';
import W_Title from './W_Title';
import W_DateTime from './W_DateTime';
import W_Counter from './W_Counter';
import W_DataBox from './W_DataBox';
import W_DataBoxAdvanced from './W_DataBoxAdvanced';
import W_Slider from './W_Slider';
import W_Switcher from './W_Switcher';
import W_CommandButton from './W_CommandButton';
import W_Indicator from './W_Indicator';
import W_WeatherBox from './W_WeatherBox';
import W_GroupTable from './W_GroupTable';

import { Responsive, WidthProvider } from 'react-grid-layout';
import TestModal from './TestModal';

import { mediaServer } from '../constants';

//import { getOperationRootType } from 'graphql';
const ResponsiveGridLayout = WidthProvider(Responsive);

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'relative',
    //    marginTop:'48px',
  },
  addContainerButton: {
    marginTop: '5px',
    marginLeft: '5px',
    marginBottom: '5px',
    padding: 0,
    borderRadius: '20%',
    boxShadow: 'none',
    height: '40px',
    width: '40px',
    color: theme.palette.white,
    '&:hover': {
      backgroundColor: theme.palette.gray1,
    },
  },
}));
/*
// for .sort()
const sortByOrder = (a, b) => {
  if (a.order < b.order) {
    return -1;
  }
  if (a.order > b.order) {
    return 1;
  }
  return 0;
};
*/
const Dashboard = React.memo(props => {
  //console.log('memo props', props)
  const {
    dashboardId,
    addGroupModalState,
    setAddGroupModalState,
    editGroupModalState,
    setEditGroupModalState,
    deleteGroupModalState,
    setDeleteGroupModalState,

    editWidgetModalState,
    setEditWidgetModalState,
    deleteWidgetModalState,
    setDeleteWidgetModalState,
    refreshSideCard,
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const client = useApolloClient();

  const dispatch = useDispatch();
  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));

  const inputRef = useRef([]);

  const isFullScreen = useSelector(state => state.settings.isFullScreen);
  const isSideBar = useSelector(state => state.settings.isSideBar);
  const isEditMode = useSelector(state => state.settings.isEditMode);
  const gapWidgets = useSelector(state => state.settings.gapWidgets);
  const gapContainers = useSelector(state => state.settings.gapContainers);

  const objectHoveredId = useSelector(state => state.context.objectHoveredId); //to highlight objects on hover in lists
  const refreshFlag = useSelector(state => state.context.refreshFlag);

  const dashboards = useSelector(state => state.context.dashboards);
  const dashboardTitle = dashboards
    .find(item => item.id === dashboardId)
    ?.objectProperties.find(prop => prop.key === 'generalTitle').value;
  const dashboardTitleStyle = dashboards
    .find(item => item.id === dashboardId)
    ?.objectProperties.find(prop => prop.key === 'generalTitleStyle').value;

  const dashboardBackgroundImageUID = dashboards
    .find(item => item.id === dashboardId)
    ?.objectProperties.find(prop => prop.key === 'generalBackgroundImageUid').value;

  const dashboardBackgroundImageName = dashboards
    .find(item => item.id === dashboardId)
    ?.objectProperties.find(prop => prop.key === 'generalBackgroundImageName').value;
  /*
  const [addGroupModalState, setAddGroupModalState] = useState({
    open: false,
    dashboardId: null,
  });
*/
  /* 
  //lifted up to App.js

  const [deleteGroupModalState, setDeleteGroupModalState] = useState({
    open: false,
    groupId: null,
  });

  const [editGroupModalState, setEditGroupModalState] = useState({
    open: false,
    groupId: null,
  });


  const [deleteWidgetModalState, setDeleteWidgetModalState] = useState({
    open: false,
    groupId: null,
    widgetId: null,
  });
  const [editWidgetModalState, setEditWidgetModalState] = useState({
    open: false,
    widgetId: null,
    groupNames: null,
  });


*/

  const [addWidgetModalState, setAddWidgetModalState] = useState({
    open: false,
    groupId: null,
    widgetIdClicked: null,
  });

  //const [dataWidgets, setDataWidgets] = useState(null);
  const [loading, setLoading] = useState(true);

  const dashboard = useSelector(state => state.dashboard);

  const [breakpointCurrent, setBreakpointCurrent] = useState('lg'); // changes on screen resize (to choose right layout thereafter)

  const [heights, setHeights] = useState([]);
  const [updatedLayouts, setUpdatedLayouts] = useState({
    lg: [],
    md: [],
    sm: [],
    xs: [],
    xxs: [],
  });
  //  let layouts = { lg: [], md: [], sm: [], xs: [], xxs: [] };
  /*
  const [
    updateGroupsLayouts,
    { data_dashboard_layout, error_dashboard_layout, refetch_dashboard_layout },
  ] = useMutation(UPDATE_GROUPS_LAYOUTS_MUTATION);
  */
  /*
  const saveDashboardLayout = async (dashboardId,layouts) => {
            // store layout for current dashboard (all breakpoints) to server database
            try {
              const result_update = await updateDashboardLayout({
              variables: {
                dashboardId: dashboardId,
                layout: layouts 
              },
            });
            console.log('Dashboard.js saveDashboardLayout result', result_update)
          } catch(err) {
            console.log('Dashboard.js saveDashboardLayout error', err)
          }
  }
*/

  const handleDeleteGroup = async groupId => {
    console.log('deleting group...');

    try {
      const result = await client.mutate({
        mutation: DELETE_OBJECT_MUTATION,
        variables: {
          objId: groupId,
        },
      });

      console.log('deleteGroup deleted');

      // add container to current layout
      let tmpLayouts = { ...updatedLayouts };

      // delete container for each breakpoint
      ['lg', 'md', 'sm', 'xs', 'xxs'].forEach(bp => {
        tmpLayouts[bp] = tmpLayouts[bp].filter(item => item.i !== groupId);
      });

      dispatch(deleteFromDashboard(groupId));
      setUpdatedLayouts(tmpLayouts);
      refreshSideCard();
      enqueueSnackbar({
        message: msg.deleteGroupModal.deleted,
        options: { code: 'UNKNOWN', variant: 'info' },
      });
      //updateHeights(heights);
      //      _.debounce(containerWidth => updateHeights(), 500)

      //TODO: по-хорошему здесь updateHeights не нужен. Проблема в том, что при удалении контейнера из layouts (filter) смещаются индексы. Соответственно, путаются номера контейнеров и их высот
      setTimeout(() => {
        updateHeights();
      }, 200);
    } catch (err) {
      console.log('deleteGroup error', err);
      enqueueSnackbar({
        message: err.toString(),
        options: { code: 'UNKNOWN', variant: 'error' },
      });
    } //catch
  }; //handleDeleteGroup
  /*
  const handleAddGroup = async values => {
    console.log('adding group...', values);
*/
  const handleAddGroup = async props => {
    const { dashboardId, values, name, description } = props;

    console.log(
      'adding group... dashboardId, values, name, description',
      dashboardId,
      values,
      name,
      description
    );

    //return false
    try {
      const result = await client.mutate({
        mutation: ADD_GROUP_MUTATION,
        variables: {
          dashboardId: dashboardId,
          name: name,
          description: description,
          //          columnCount: values['columnCount'],
          //          enabled: Boolean(values['enabled']),
          values: values,
        },
      });

      console.log(
        'addGroup added:',
        result.data.createObjectWithProperties.uuid
      );

      const default_layout = {
        x: 0,
        y: 0,
        //        w: parseInt(values['generalColumnsCount']),
        w: parseInt(
          values.find(obj => obj.propertyKey === 'generalColumnsCount')?.value
        ),
        h: 48,
        minH: 48,
        maxH: 48,
        i: result.data.createObjectWithProperties.uuid,
      };

      let group = {
        id: result.data.createObjectWithProperties.uuid,
        name: name,
        description: description,
        enabled: true,
        //        userGroupByEditorgroup: '...',
        //        userGroupByUsergroup: '...',
        //        userGroupByReadergroup: '...',
        //        columnCount: parseInt(values['columnCount']),
        columnCount: parseInt(
          values.find(obj => obj.propertyKey === 'generalColumnsCount')?.value
        ),
        //        columnCount_updatedAt: '...',
        //        columnCount_userByBy: '...',
        widgets: [],
        order: [],
        layouts: { lg: [], md: [], sm: [], xs: [], xxs: [] },
        //        layouts: { "lg": [default_layout], "md": [default_layout], "sm": [default_layout], "xs": [default_layout], "xxs": [default_layout] },
      };

      console.log('addGroup group:', group);

      // add container to current layout
      let tmpLayouts = { ...updatedLayouts };

      ['lg', 'md', 'sm', 'xs', 'xxs'].forEach(bp => {
        tmpLayouts[bp].push(default_layout);
      });

      setUpdatedLayouts(tmpLayouts);

      dispatch(addToDashboard(group));
      refreshSideCard();

      enqueueSnackbar({
        message: msg.addGroupModal.added,
        options: { code: 'UNKNOWN', variant: 'info' },
      });

      //TODO: temporary fix of incorrect heights
      setTimeout(() => {
        updateHeights();
      }, 200);
    } catch (err) {
      console.log('addGroup error', err);
      enqueueSnackbar({
        message: err.toString(),
        options: { code: 'UNKNOWN', variant: 'error' },
      });
    }
  }; //handleAddGroup

  const handleUpdateGroup = async props => {
    const { groupId, values, name, description } = props;

    console.log(
      'updating group... groupId, values, name, description',
      groupId,
      values,
      name,
      description
    );
    //return false

    try {
      const result_update = await client.mutate({
        mutation: UPDATE_GROUP_MUTATION,
        variables: {
          groupId: groupId,
          name: name,
          description: description,
          values: values,
        },
      });

      console.log(
        'updateGroup updated:',
        result_update.data.updateObjectWithProperties
      );

      enqueueSnackbar({
        message: msg.editGroupModal.updated,
        options: { code: 'UNKNOWN', variant: 'info' },
      });

      //TODO: fix to refresh everything from db. Better avoid it
      queryAndCookWidgets();
      refreshSideCard();
    } catch (err) {
      console.log('updateGroup error:', err);
      enqueueSnackbar({
        message: err.toString(),
        options: { code: 'UNKNOWN', variant: 'error' },
      });
    } //catch
  }; //handleUpdateGroup

  const handleAddWidget = async props => {
    const {
      groupId,
      widgetIdClicked,
      values,
      widgetType,
      name,
      description,
    } = props;

    console.log(
      'adding widget... groupId, widgetIdClicked, values,widgetType, name, description',
      groupId,
      widgetIdClicked,
      values,
      widgetType,
      name,
      description
    );

    //    return false;

    // get current order (loaded from db)
    const order = dashboard.find(obj => obj.id === groupId).order;
    //    console.log('addWidget order:', order);

    try {
      const result_add = await client.mutate({
        mutation: ADD_WIDGET_MUTATION,
        variables: {
          groupId: groupId,
          name: name,
          description: description,
          widgetType: widgetType,
          values: values,
        },
      });
      //after 280
      const index = parseInt(order.findIndex(item => item === widgetIdClicked)); // index of widget where we clicked [+]
      console.log('addWidget index:', index);

      //put widget uid next to the uid where "+" clicked
      order.splice(
        index + 1,
        0,
        result_add.data.createObjectWithProperties.uuid
      );

      console.log('addWidget new order:', order);

      const result_update = await client.mutate({
        mutation: UPDATE_GROUP_ORDER_MUTATION,
        variables: {
          groupId: groupId,
          order: order,
        },
      });

      console.log(
        'addWidget added:',
        result_add.data.createObjectWithProperties.uuid
      );

      enqueueSnackbar({
        message: msg.addWidgetModal.added,
        options: { code: 'UNKNOWN', variant: 'info' },
      });

      //TODO: fix to refresh everything from db. Better avoid it and just add widget using updateInDashboard
      queryAndCookWidgets();
      refreshSideCard();
    } catch (err) {
      console.log('addWidget error:', err);
      enqueueSnackbar({
        message: err.toString(),
        options: { code: 'UNKNOWN', variant: 'error' },
      });
    } //catch
  }; //handleAddWidget

  const handleUpdateWidget = async props => {
    const { widgetId, values, name, description } = props;

    console.log(
      'updating widget... widgetId, values, name, description',
      widgetId,
      values,
      name,
      description
    );
    //return false

    try {
      const result_update = await client.mutate({
        mutation: UPDATE_WIDGET_MUTATION,
        variables: {
          widgetId: widgetId,
          name: name,
          description: description,
          values: values,
        },
      });

      console.log(
        'updateWidget updated:',
        result_update.data.updateObjectWithProperties
      );

      enqueueSnackbar({
        message: msg.editWidgetModal.updated,
        options: { code: 'UNKNOWN', variant: 'info' },
      });

      //TODO: fix to refresh everything from db. Better avoid it
      queryAndCookWidgets();
      refreshSideCard();
    } catch (err) {
      console.log('updateWidget error:', err);
      enqueueSnackbar({
        message: err.toString(),
        options: { code: 'UNKNOWN', variant: 'error' },
      });
    } //catch
  }; //handleUpdateWidget

  const handleDeleteWidget = async props => {
    const { groupId, widgetId } = props;
    console.log('deleting widget...', groupId, widgetId);
    //return false;
    try {
      const result = await client.mutate({
        mutation: DELETE_OBJECT_MUTATION,
        variables: {
          objId: widgetId,
        },
      });

      let order = dashboard.find(obj => obj.id === groupId).order;
      console.log('deleteWidget prev order:', order);

      order = order.filter(item => item !== widgetId); // delete widget from list

      console.log('deleteWidget new order:', order);

      const result_update = await client.mutate({
        mutation: UPDATE_GROUP_ORDER_MUTATION,
        variables: {
          groupId: groupId,
          order: order,
        },
      });

      console.log('deleteWidget deleted');

      enqueueSnackbar({
        message: msg.deleteWidgetModal.deleted,
        options: { code: 'UNKNOWN', variant: 'info' },
      });

      //TODO: It is better to just delete from dashboard.group.widgets, without refetching
      queryAndCookWidgets();

      refreshSideCard();
    } catch (err) {
      console.log('deleteWidget error', err);
      enqueueSnackbar({
        message: err.toString(),
        options: { code: 'UNKNOWN', variant: 'error' },
      });
    } //catch
  }; //handleDeleteWidget

  const handleMove = async props => {
    const { dir, groupId, widgetId } = props;
    console.log('handleMove', props);
    let order = dashboard.find(obj => obj.id === groupId).order;
    console.log('handleMove prev order:', order);

    let sourceIndex = order.findIndex(obj => obj === widgetId);
    let targetIndex;

    // swapping current with previous...
    if (dir === 'backward') targetIndex = sourceIndex - 1;

    // swapping current with next...
    if (dir === 'forward') targetIndex = sourceIndex + 1;

    console.log('handleMove source, target:', sourceIndex, targetIndex);

    // swap widgets within order array
    [order[sourceIndex], order[targetIndex]] = [
      order[targetIndex],
      order[sourceIndex],
    ];

    console.log('handleMove next order:', order);

    try {
      const result_update = await client.mutate({
        mutation: UPDATE_GROUP_ORDER_MUTATION,
        variables: {
          groupId: groupId,
          order: order,
        },
      });

      console.log('Order changed');
    } catch (err) {
      console.log('order change error', err);
    } //catch

    //TODO: better just delete from dashboard.group.widgets, without refetching
    queryAndCookWidgets();
    refreshSideCard();
  }; //handleMove

  const updateHeights = () => {
    console.log('HEIGHTS UPDATED', inputRef.current);

    let heights = [];

    inputRef.current.map((current, index) => {
      if (current) {
        // check if there are any container yet available (there aren't any containers if widgets component hidden/unmounted)
        heights[index] = current.getBoundingClientRect().height + gapContainers;
      } //if
    });
    //    console.log('--',heights)

    if (heights.length > 0) setHeights(heights);
  };

  const queryAndCookWidgets = () => {
    dispatch(clearDashboard());
    //    dispatch(clearLayout());
    //return false
    const query = async () => {
      setLoading(true);
      try {
        const result = await client.query({
          query: WIDGETS_QUERY,
          variables: { dashboardId: dashboardId },
          fetchPolicy: 'no-cache',
        }); // || "04fe1bdc-5429-4c04-addf-9be9077f2a63"
        console.log(
          '================ Dashboard.js/WIDGETS_QUERY result',
          result
        );
        //        return false
        //setDataWidgets(result.data.objects)

        //        cookDashboard(result.data);

        //      layouts = { lg: [], md: [], sm: [], xs: [], xxs: [] };
        //      console.log('layouts',layouts)

        // for all groups - complete layouts

        let tmpLayouts = { lg: [], md: [], sm: [], xs: [], xxs: [] };

        //        let group_index = 0; // index for RGL layouts

        // for each group in loaded dashboard
        result.data.object.objectsToObjectsByObject1Id.map(groupDB => {
          //              console.log('groupDB',groupDB)

          const layoutsDB = groupDB.object2.objectProperties.find(
            obj => obj.key === 'generalLayouts'
          ).value;

          const orderDB = groupDB.object2.objectProperties.find(
            obj => obj.key === 'generalOrder'
          ).value;

          //      const layoutsDB = sjson.parse(groupDB.object2.objectProperties.find(obj => obj.key === 'generalLayouts').value , { protoAction: 'remove', constructorAction: 'remove' });

          //recursiveRemoveKey(layoutsDB, '<prototype>');

          //              console.log('!!! layoutsDB',layoutsDB)
          //              console.log('!!! orderDB',orderDB)
          //      console.log('layoutsDB',layoutsDB, layoutsDB["lg"].length);

          // make layouts for RGL
          // if for given group there empty values [] in db, create default container for RGL layout with x,y,w,.... IF there db have some values, use them for RGL layout,

          // only for one group (to put in group.layouts later). For all breakpoints
          let layoutsGroup = { lg: [], md: [], sm: [], xs: [], xxs: [] };

          ['lg', 'md', 'sm', 'xs', 'xxs'].forEach(bp => {
            //        layoutsGroup[bp] = (layoutsDB[bp].length===0) ? { x: 0, y: 0, w: parseInt(groupDB.object2.objectProperties.find(obj => obj.key === 'generalColumnsCount').value), h: 48, minH: 48, maxH: 48, i: groupDB.object2.id } : layoutsDB[bp]
            if (layoutsDB[bp].length === 0)
              layoutsGroup[bp].push({
                x: 0,
                y: 0,
                w: parseInt(
                  groupDB.object2.objectProperties.find(
                    obj => obj.key === 'generalColumnsCount'
                  ).value
                ),
                h: 48,
                minH: 48,
                maxH: 48,
                i: groupDB.object2.id,
              });
            else layoutsGroup[bp] = { ...layoutsDB[bp] };
            /*
        layoutsGroup[bp].push( 
          (layoutsDB[bp].length===0) ? { x: 0, y: 0, w: parseInt(groupDB.object2.objectProperties.find(obj => obj.key === 'generalColumnsCount').value), h: 48, minH: 48, maxH: 48, i: groupDB.object2.id } : layoutsDB[bp] 
        )
*/
          });

          //console.log('layoutsGroup', layoutsGroup);

          // put one group layouts to complete layouts. For all breakpoints)
          ['lg', 'md', 'sm', 'xs', 'xxs'].forEach(bp => {
            tmpLayouts[bp].push(layoutsGroup[bp][0]);
          });

          //      console.log('layouts',layouts)
          //return false

          const getValue = prop => {
            return groupDB.object2.objectProperties.find(
              obj => obj.key === prop
            )?.value;
          }; // group property value

          const getUpdatedAt = prop => {
            return groupDB.object2.objectProperties.find(
              obj => obj.key === prop
            )?.updatedAt;
          }; // modified date of group property value

          const getUserByBy = prop => {
            return groupDB.object2.objectProperties.find(
              obj => obj.key === prop
            )?.userByBy.login;
          }; // user modified group property value

          //          group_index++;

          let group = {
            id: groupDB.object2.id,
            name: groupDB.object2.name,
            description: groupDB.object2.description,
            enabled: groupDB.object2.enabled,
            schemaTags: groupDB.object2.schemaTags,
            userGroupByEditorgroup: {
              groupName: groupDB.object2.userGroupByEditorgroup.groupName,
            },
            userGroupByUsergroup: {
              groupName: groupDB.object2.userGroupByUsergroup.groupName,
            },
            userGroupByReadergroup: {
              groupName: groupDB.object2.userGroupByReadergroup.groupName,
            },
            columnCount: getValue('generalColumnsCount'), //TODO: сюда ВСЕ свойства!!!
            columnCount_updatedAt: getUpdatedAt('generalColumnsCount'),
            columnCount_userByBy: getUserByBy('generalColumnsCount'),
            //            rowCount: getValue('Row count'),
            //            useHeight: getValue('Use height'),

            widgets: [],

            layouts: layoutsGroup, //JSON.parse(groupDB.object2.objectProperties.find(obj => obj.key === 'generalLayouts').value), // for RGL
            order: orderDB, // for widgets sorting
            //  layouts = { lg: [], md: [], sm: [], xs: [], xxs: [] }, //test
            //{ x: 0, y: 0, w: parseInt(data.columnCount), h: 48, minH: 48, maxH: 48, i: data.groupId,
          };

          //for each widget
          groupDB.object2.objectsToObjectsByObject1Id.map(widgetDB => {
            //        const widget = widgetDB.object2;

            const getValue = prop => {
              return widgetDB.object2.objectProperties.find(
                obj => obj.key === prop
              )?.value;
            }; // widget property value

            const widgetId = widgetDB.object2.id;
            const widgetName = widgetDB.object2.name;
            const widgetSchema = widgetDB.object2.schemaTags;
            const widgetEnabled = widgetDB.object2.enabled;
            const widgetDescription = widgetDB.object2.description;
            const widgetClass = widgetDB.object2.schemaTags.join('/');

            const widgetUserGroupByEditorgroup = {
              groupName: widgetDB.object2.userGroupByEditorgroup.groupName,
            };
            const widgetUserGroupByUsergroup = {
              groupName: widgetDB.object2.userGroupByUsergroup.groupName,
            };
            const widgetUserGroupByReadergroup = {
              groupName: widgetDB.object2.userGroupByReadergroup.groupName,
            };

            let widgetProperties = [];
            widgetDB.object2.objectProperties.map(prop => {
              //                console.log('prop',prop);
              widgetProperties.push({
                key: prop.key,
                value: prop.value,
                updatedAt: prop.updatedAt,
                userByBy: prop.userByBy?.login,
                groupName: prop.groupName,
              });
            });

            // devices, datasets for each widget
            /*
            let widgetObjects = [];
            widgetDB.object2.objectProperties.map(prop => {
//                console.log('prop',prop);
                widgetObjects.push ( { key: prop.key, value: prop.value, updatedAt: prop.updatedAt, userByBy: prop.userByBy?.login } )
            }) 
*/

            /*
          console.log('widgetClass', widgetClass);
          console.log('widgetDB', widgetDB.object2.objectProperties);
          console.log('widgetProperties', widgetProperties);
*/

            switch (widgetClass) {
              case 'application/board/widget/command button':
                group.widgets.push({
                  widget: 'CommandButton',
                  size: 'small',
                  //                  mode: getValue('settingsType'), //icon, text
                  id: widgetId,
                  //                  wide: JSON.parse(getValue('settingsFullLine')),
                  colors: ['lightondark'],
                  name: widgetName,
                  description: widgetDescription,
                  enabled: widgetEnabled,
                  schemaTags: widgetSchema,
                  userGroupByEditorgroup: widgetUserGroupByEditorgroup,
                  userGroupByUsergroup: widgetUserGroupByUsergroup,
                  userGroupByReadergroup: widgetUserGroupByReadergroup,
                  objectProperties: widgetProperties,
                });

              case 'application/board/widget/counter':
                group.widgets.push({
                  widget: 'Counter',
                  size: 'small',
                  //                  mode: getValue('settingsType'), //icon, text
                  id: widgetId,
                  //                  wide: JSON.parse(getValue('settingsFullLine')),
                  colors: ['lightondark'],
                  //                  simulation: JSON.parse(getValue('settingsSimulation')),
                  name: widgetName,
                  description: widgetDescription,
                  enabled: widgetEnabled,
                  schemaTags: widgetSchema,
                  userGroupByEditorgroup: widgetUserGroupByEditorgroup,
                  userGroupByUsergroup: widgetUserGroupByUsergroup,
                  userGroupByReadergroup: widgetUserGroupByReadergroup,
                  objectProperties: widgetProperties,
                  //                  objects: widgetObjects,
                });

                break;

              case 'application/board/widget/databox':
                group.widgets.push({
                  widget: 'DataBox',
                  size: 'small',
                  //                  mode: getValue('settingsType'),
                  id: widgetId,
                  //                  wide: JSON.parse(getValue('settingsFullLine')),
                  //                  simulation: JSON.parse(getValue('settingsSimulation')),
                  colors: ['lightondark'],
                  name: widgetName,
                  description: widgetDescription,
                  enabled: widgetEnabled,
                  schemaTags: widgetSchema,
                  userGroupByEditorgroup: widgetUserGroupByEditorgroup,
                  userGroupByUsergroup: widgetUserGroupByUsergroup,
                  userGroupByReadergroup: widgetUserGroupByReadergroup,
                  objectProperties: widgetProperties,
                });

                break;

              case 'application/board/widget/databox advanced':
                group.widgets.push({
                  widget: 'DataBoxAdvanced',
                  size: 'small',
                  //                  mode: getValue('settingsType'),
                  id: widgetId,
                  //                  wide: JSON.parse(getValue('settingsFullLine')),
                  //                  simulation: JSON.parse(getValue('settingsSimulation')),
                  colors: ['lightondark'],
                  name: widgetName,
                  description: widgetDescription,
                  enabled: widgetEnabled,
                  schemaTags: widgetSchema,
                  userGroupByEditorgroup: widgetUserGroupByEditorgroup,
                  userGroupByUsergroup: widgetUserGroupByUsergroup,
                  userGroupByReadergroup: widgetUserGroupByReadergroup,
                  objectProperties: widgetProperties,
                });

                break;

              case 'application/board/widget/datachart':
                group.widgets.push({
                  widget: 'DataChart',
                  size: 'small',
                  //                  mode: getValue('settingsType'),
                  id: widgetId,
                  //                wide: JSON.parse(getValue('settingsFullLine')),
                  colors: ['lightondark'],
                  //                  simulation: JSON.parse(getValue('settingsSimulation')),
                  name: widgetName,
                  description: widgetDescription,
                  enabled: widgetEnabled,
                  schemaTags: widgetSchema,
                  userGroupByEditorgroup: widgetUserGroupByEditorgroup,
                  userGroupByUsergroup: widgetUserGroupByUsergroup,
                  userGroupByReadergroup: widgetUserGroupByReadergroup,
                  objectProperties: widgetProperties,
                });

                break;

              case 'application/board/widget/datetime':
                group.widgets.push({
                  widget: 'DateTime',
                  size: 'small',
                  //                  mode: getValue('settingsType'),
                  id: widgetId,
                  //                  wide: JSON.parse(getValue('settingsFullLine')),
                  colors: ['lightondark'],
                  name: widgetName,
                  description: widgetDescription,
                  enabled: widgetEnabled,
                  schemaTags: widgetSchema,
                  userGroupByEditorgroup: widgetUserGroupByEditorgroup,
                  userGroupByUsergroup: widgetUserGroupByUsergroup,
                  userGroupByReadergroup: widgetUserGroupByReadergroup,
                  objectProperties: widgetProperties,
                  //                  value_updatedAt: getUpdatedAt('valueValue'),
                  //                  value_userByBy: getUserByBy('valueValue'),
                  /*
                  valueIconName: { value: getValue('valueIconName'), updatedAt: getUpdatedAt('valueIconName'), userByBy: getUserByBy('valueIconName') },
                  sourceFrom: { value: getValue('sourceFrom'), updatedAt: getUpdatedAt('sourceFrom'), userByBy: getUserByBy('sourceFrom') },
                  settingsFullLine: { value: getValue('settingsFullLine'), updatedAt: getUpdatedAt('settingsFullLine'), userByBy: getUserByBy('settingsFullLine') },
                  settingsType: { value: getValue('settingsType'), updatedAt: getUpdatedAt('settingsType'), userByBy: getUserByBy('settingsType') },

                  sourceResultType: { value: getValue('sourceResultType'), updatedAt: getUpdatedAt('sourceResultType'), userByBy: getUserByBy('sourceResultType') },
                  valueValue: { value: getValue('valueValue'), updatedAt: getUpdatedAt('valueValue'), userByBy: getUserByBy('valueValue') },
  
                  settingsFormat: { value: getValue('settingsFormat'), updatedAt: getUpdatedAt('settingsFormat'), userByBy: getUserByBy('settingsFormat') },
                  settingsSimulation: { value: getValue('settingsSimulation'), updatedAt: getUpdatedAt('settingsSimulation'), userByBy: getUserByBy('settingsSimulation') },
                  settingsStyle: { value: getValue('settingsStyle'), updatedAt: getUpdatedAt('settingsStyle'), userByBy: getUserByBy('settingsStyle') },
                  sourceSchemaId: { value: getValue('sourceSchemaId'), updatedAt: getUpdatedAt('sourceSchemaId'), userByBy: getUserByBy('sourceSchemaId') },
                  sourceProperty: { value: getValue('sourceProperty'), updatedAt: getUpdatedAt('sourceProperty'), userByBy: getUserByBy('sourceProperty') },
*/
                });

                break;

              case 'application/board/widget/group table':
                group.widgets.push({
                  widget: 'GroupTable',
                  size: 'small',
                  //                  mode: getValue('settingsType'),
                  id: widgetId,
                  //                wide: JSON.parse(getValue('settingsFullLine')),
                  //                  simulation: JSON.parse(getValue('settingsSimulation')),
                  colors: ['lightondark'],
                  name: widgetName,
                  description: widgetDescription,
                  enabled: widgetEnabled,
                  schemaTags: widgetSchema,
                  userGroupByEditorgroup: widgetUserGroupByEditorgroup,
                  userGroupByUsergroup: widgetUserGroupByUsergroup,
                  userGroupByReadergroup: widgetUserGroupByReadergroup,
                  objectProperties: widgetProperties,
                });

                break;

              case 'application/board/widget/imagebox':
                group.widgets.push({
                  widget: 'ImageBox',
                  size: 'small',
                  //                  mode: getValue('settingsType'),
                  id: widgetId,
                  //                  wide: JSON.parse(getValue('settingsFullLine')),
                  colors: ['lightondark'],
                  name: widgetName,
                  description: widgetDescription,
                  enabled: widgetEnabled,
                  schemaTags: widgetSchema,
                  userGroupByEditorgroup: widgetUserGroupByEditorgroup,
                  userGroupByUsergroup: widgetUserGroupByUsergroup,
                  userGroupByReadergroup: widgetUserGroupByReadergroup,
                  objectProperties: widgetProperties,
                });

                break;

              case 'application/board/widget/indicator':
                group.widgets.push({
                  widget: 'Indicator',
                  size: 'small',
                  //                  mode: getValue('settingsType'),
                  id: widgetId,
                  //                  wide: JSON.parse(getValue('settingsFullLine')),
                  //                  simulation: JSON.parse(getValue('settingsSimulation')),
                  colors: ['lightondark'],
                  name: widgetName,
                  description: widgetDescription,
                  enabled: widgetEnabled,
                  schemaTags: widgetSchema,
                  userGroupByEditorgroup: widgetUserGroupByEditorgroup,
                  userGroupByUsergroup: widgetUserGroupByUsergroup,
                  userGroupByReadergroup: widgetUserGroupByReadergroup,
                  objectProperties: widgetProperties,
                });

                break;

              case 'application/board/widget/object table':
                group.widgets.push({
                  widget: 'ObjectTable',
                  size: 'small',
                  //                  mode: getValue('settingsType'),
                  id: widgetId,
                  //                wide: JSON.parse(getValue('settingsFullLine')),
                  //                  simulation: JSON.parse(getValue('settingsSimulation')),
                  colors: ['lightondark'],
                  name: widgetName,
                  description: widgetDescription,
                  enabled: widgetEnabled,
                  schemaTags: widgetSchema,
                  userGroupByEditorgroup: widgetUserGroupByEditorgroup,
                  userGroupByUsergroup: widgetUserGroupByUsergroup,
                  userGroupByReadergroup: widgetUserGroupByReadergroup,
                  objectProperties: widgetProperties,
                });

                break;

              case 'application/board/widget/slider':
                group.widgets.push({
                  widget: 'Slider',
                  size: 'small',
                  //                  mode: getValue('settingsType'),
                  id: widgetId,
                  //                  wide: JSON.parse(getValue('settingsFullLine')),
                  colors: ['lightondark'],
                  name: widgetName,
                  description: widgetDescription,
                  enabled: widgetEnabled,
                  schemaTags: widgetSchema,
                  userGroupByEditorgroup: widgetUserGroupByEditorgroup,
                  userGroupByUsergroup: widgetUserGroupByUsergroup,
                  userGroupByReadergroup: widgetUserGroupByReadergroup,
                  objectProperties: widgetProperties,
                });

                break;

              case 'application/board/widget/switcher':
                group.widgets.push({
                  widget: 'Switcher',
                  size: 'small',
                  //                  mode: getValue('settingsType'),
                  id: widgetId,
                  //                  wide: JSON.parse(getValue('settingsFullLine')),
                  colors: ['lightondark'],
                  name: widgetName,
                  description: widgetDescription,
                  enabled: widgetEnabled,
                  schemaTags: widgetSchema,
                  userGroupByEditorgroup: widgetUserGroupByEditorgroup,
                  userGroupByUsergroup: widgetUserGroupByUsergroup,
                  userGroupByReadergroup: widgetUserGroupByReadergroup,
                  objectProperties: widgetProperties,
                });

                break;

              case 'application/board/widget/title':
                group.widgets.push({
                  widget: 'Title',
                  id: widgetId,
                  //                  wide: JSON.parse(getValue('settingsFullLine')),
                  colors: ['lightondark'],
                  //                  title: getValue('valueText'),
                  name: widgetName,
                  description: widgetDescription,
                  enabled: widgetEnabled,
                  schemaTags: widgetSchema,
                  userGroupByEditorgroup: widgetUserGroupByEditorgroup,
                  userGroupByUsergroup: widgetUserGroupByUsergroup,
                  userGroupByReadergroup: widgetUserGroupByReadergroup,
                  objectProperties: widgetProperties,
                });

                break;

              case 'application/board/widget/vibration':
                group.widgets.push({
                  widget: 'Vibration',
                  size: 'small',
                  //                  mode: getValue('settingsType'),
                  id: widgetId,
                  //                  wide: JSON.parse(getValue('settingsFullLine')),
                  colors: ['lightondark'],
                  name: widgetName,
                  description: widgetDescription,
                  enabled: widgetEnabled,
                  schemaTags: widgetSchema,
                  userGroupByEditorgroup: widgetUserGroupByEditorgroup,
                  userGroupByUsergroup: widgetUserGroupByUsergroup,
                  userGroupByReadergroup: widgetUserGroupByReadergroup,
                  objectProperties: widgetProperties,
                });

                break;

              case 'application/board/widget/weatherbox':
                group.widgets.push({
                  widget: 'WeatherBox',
                  size: 'small',
                  //                  mode: getValue('settingsType'),
                  id: widgetId,
                  //                  wide: JSON.parse(getValue('settingsFullLine')),
                  colors: ['lightondark'],
                  name: widgetName,
                  description: widgetDescription,
                  enabled: widgetEnabled,
                  schemaTags: widgetSchema,
                  userGroupByEditorgroup: widgetUserGroupByEditorgroup,
                  userGroupByUsergroup: widgetUserGroupByUsergroup,
                  userGroupByReadergroup: widgetUserGroupByReadergroup,
                  objectProperties: widgetProperties,
                });

                break;

              default:
                console.log('Dashboard.js: Unknown class of widget');
            }
          });
          //          console.log('cook/group', group);
          dispatch(addToDashboard(group));
          //          console.log('cook/dashboard', dashboard);

          //      dispatch(deleteFromDashboard(container.id));
          //      dispatch(addToDashboard(container));
          //dispatch(updateDashboard(container));
        }); // map (for each group)

        //        console.log('cook/tmpLayouts', tmpLayouts);
        setUpdatedLayouts(tmpLayouts);
        //setWidgetsOrder(orderDB);

        //    console.log('cook/layouts',layouts)

        //        console.log('=========== END OF COOKING ==========');

        setTimeout(() => {
          //console.log('setTimeout/tmpLayouts',tmpLayouts)
          updateHeights();
        }, 500); //TODO: replace with onload/promiseall for all images

        //        loadedLayouts = JSON.parse(result.data.object.objectProperties.find(obj => obj.key === 'generalLayout')?.value)
      } catch (err) {
        console.log('Dashboard.js/WIDGETS_QUERY err', err);
      } finally {
        setLoading(false);
      }
    };
    query();
  };

  // add some widgets to dashboard
  useEffect(() => {
    // huge 384, big 192, small - 96, tiny - 48

    queryAndCookWidgets();
  }, [dashboardId, refreshFlag]);

  if (loading) return <Spinner />;
  //return <Spinner/>;

  /*
  if (Object.keys(loadedLayouts["lg"]).length > 0) {
    layouts = loadedLayouts
    console.log('using loaded...',Object.keys(loadedLayouts["lg"]).length)
  } 
  */

  // prepare final layouts for RGL - add fresh heights (we got them after updateHeights() filled heights)

  let finalLayouts = { lg: [], md: [], sm: [], xs: [], xxs: [] };

  // for each breakpoint...
  ['lg', 'md', 'sm', 'xs', 'xxs'].map(breakpoint => {
    //for each container...
    let i = 0; // to sync state.dashboard with state.layout

    return dashboard.map((container, index) => {
      // h - calculated based on widgets heights ( in updateHeights() )
      let h = heights[index] || 48;

      //TODO: replace index with uid
      //        console.log('updatedLayouts,index',updatedLayouts,index)
      const x = updatedLayouts[breakpoint][index].x;
      const y = updatedLayouts[breakpoint][index].y;
      finalLayouts[breakpoint].push({
        x: x,
        y: y,
        w: parseInt(container.columnCount),
        h: h,
        minH: h,
        maxH: h,
        i: container.id,
      });
    });
  });

  //  console.log('updated layouts (before render)', updatedLayouts);
  //  console.log('finalLayouts (before render)', finalLayouts);
  //  console.log('heights (before render)',heights)

  //          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}

  /*
  marginLeft: `${gapContainers / 2}px`,
  marginRight: `${gapContainers / 2}px`,

  */
  const backgroundUrl = `${mediaServer}/download/${dashboardBackgroundImageUID}/${localStorage.getItem('authToken')}?${dashboardBackgroundImageName}`; 
  console.log('Dashboard.js backgroundUrl',backgroundUrl);
  return (
    <>
      <div
        className={classes.wrapper}
        style={{
          backgroundImage: dashboardBackgroundImageUID ? `url(${backgroundUrl})` : 'none',

//          backgroundImage: `url(${process.env.PUBLIC_URL}/pixsoda.jpg)`,
          backgroundSize: 'cover',
          backgroundRepeat: 'repeat-y',
          backgroundClip: 'border-box',
          backgroundAttachment: 'scroll',
          //border: '2px dashed yellow',
          //height: '100vh',
          minHeight: '100%',
          //paddingTop: (isFullScreen && !isSideBar) || (!isFullScreen && !isSideBar) ? '0px' : '56px',
        }}
      >
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{ height: '56px' }}
        >
          <Typography
            variant="h5"
            style={{
              color:
                dashboardTitleStyle === 'light'
                  ? theme.palette.white
                  : theme.palette.blue,
            }}
          >
            {dashboardTitle}
          </Typography>
        </Grid>

        {!isEditMode && updatedLayouts['xs'].length === 0 && (
          <Typography
            variant="h5"
            style={{ marginTop: '100px', textAlign: 'center' }}
          >
            {msg.dashboard.noContainers}
          </Typography>
        )}

        <ResponsiveGridLayout
          className="layout"
          style={{}}
          layouts={finalLayouts}
          cols={{ lg: 6, md: 6, sm: 6, xs: 4, xxs: 1 }}
          rowHeight={1}
          margin={[0, 0]}
          containerPadding={[0, 0]}
          verticalCompact={true}
          compactType="vertical"
          isDraggable={isEditMode}
          isResizable={false}
          preventCollision={false}
          measureBeforeMount={false}
          onLayoutChange={async (layout, layouts) => {
            //            console.log('********** onLayoutChange', layouts);
            setUpdatedLayouts(layouts); // to update x,y after drag and drop containers
            //здесь надо а) обновить dashboard.group.layouts данными из layouts (для чего пройтись по всем контейнерам и брейкпоинтам и сформировать group.layout)
            // б) сохранить groups на сервер

            // convert layouts from array of breakpoints to array of containers

            let cLayouts = {};
            // for each breakpoint
            ['lg', 'md', 'sm', 'xs', 'xxs'].forEach(bp => {
              //            console.log('*****',layouts[bp]);
              //for each container
              layouts[bp].forEach(container => {
                //            console.log('**container',container)
                if (!cLayouts[container.i]) cLayouts[container.i] = {};

                cLayouts[container.i][bp] = [];
                cLayouts[container.i][bp].push(container);
              });
            });
            //console.log('*cLayouts', cLayouts); // ass. array of containers with array of breakpoints. ready to put into dashboard.group.layout
            //            updateHeights(heights)

            let objs = []; // for update mutation

            let newDashboard = [];
            dashboard.forEach(group => {
              //                            console.log('----',group);
              group.layouts = cLayouts[group.id];
              newDashboard.push(group);
              objs.push({
                objectId: group.id,
                namedProperties: [
                  {
                    groupName: 'General',
                    property: 'Layouts',
                    value: cLayouts[group.id],
                  },
                ],
              });
            });

            //console.log('*newDashboard', newDashboard);

            dispatch(updateEntireDashboard(newDashboard));

            //console.log('*objs', objs);

            try {
              const result = client.mutate({
                mutation: UPDATE_GROUPS_LAYOUTS_MUTATION,
                variables: { objs: objs },
              });

              console.log('onLayoutChange save', result);
            } catch (err) {
              console.log('onLayoutChange save err', err);
            }
          }}
          onBreakpointChange={bp => {
            console.log('onBreakpointChange', bp);
            setBreakpointCurrent(bp);
          }}
          onWidthChange={
            _.debounce(containerWidth => updateHeights(), 100)

            //
          }
        >
          {finalLayouts[breakpointCurrent].map((container, index) => {
            //            console.log('container.y', container.y)
            //            console.log('finalLayouts[breakpointCurrent]', breakpointCurrent,finalLayouts)
            //border:'1px dotted white',

            //            console.log('container',container)
            //            console.log('dashboard',dashboard)
            // look in state.dashboard for group with id from layouts[breakpointCurrent].i
            const group = dashboard.find(group => group.id === container.i);
            //            console.log('dashboard[index] in RGL', dashboard[index])

            const isGroupSelected =
              group.id === props.groupId || group.id === objectHoveredId; // to highlight group selected at SideBar or hovered in list (in SideList or SideCard)

            //console.log('group', group);
            return (
              <div key={group.id}>
                <div
                  ref={el => (inputRef.current[index] = el)}
                  id={group.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    //border: '2px dotted yellow',
                    //boxSizing:'content-box',
                    //margin: `${gapContainers / 2}px`,
                    //backgroundColor: 'green',
                    //gap: `${gapWidgets}px`,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    //outline: isGroupSelected ? '5px solid #68a6eb' : 'none',
                    filter: isGroupSelected ? 'brightness(60%)' : '',
                    marginRight: '3px',
                    marginLeft: '4px',
                  }}
                >
                  {group.widgets.length === 0 && (
                    <div
                      style={{
                        height: '48px',
                        display: 'flex',
                        flexGrow: 1,
                        border: '4px solid rgb(39,128,227)',
                        borderRadius: '2px',
                        backgroundColor: 'rgb(39,128,227,0.1)',
                        //border: '2px dotted red',
                        //background:
                        //'repeating-linear-gradient(-45deg,rgb(39,128,227,0.7),rgb(39,128,227,0.7) 10px,rgb(39,128,227,0.3) //10px,rgb(39,128,227,0.3) 20px)',
                      }}
                    >
                      {isEditMode && (
                        <>
                          <Tooltip title={msg.dashboard.deleteGroup}>
                            <IconButton
                              onClick={e => {
                                setDeleteGroupModalState({
                                  open: true,
                                  groupId: group.id,
                                });
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={msg.dashboard.editGroup}>
                            <IconButton
                              onClick={e => {
                                setEditGroupModalState({
                                  open: true,
                                  groupId: group.id,
                                });
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={msg.dashboard.addWidget}>
                            <IconButton
                              onClick={e => {
                                setAddWidgetModalState({
                                  open: true,
                                  groupId: group.id,
                                  widgetIdClicked: null,
                                });
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  )}
                  {group.order.map(widgetId => {
                    const widget = group.widgets.find(
                      obj => obj.id === widgetId
                    );
                    //console.log('widget',widget)
                    if (!widget) return false; // prevent error in case of removing widget from group via admin tool

                    //console.log('group.order', group.order);
                    let w;
                    //                    console.log('Dashboard.js switch/case widget', widget);

                    const isWidgetSelected =
                      widget.id === props.widgetId ||
                      widget.id === objectHoveredId; // to highlight widget selected at SideBar or hovered in list (in SideList or SideCard)

                    switch (widget.widget) {
                      case 'ImageBox':
                        w = (
                          <W_ImageBox
                            key={widget.id}
                            widgetType="imagebox"
                            {...widget}
                            groupNames={[
                              { groupName: { equalTo: 'Settings' } },
                            ]}
                            groupId={group.id}
                            order={group.order}
                            setDeleteWidgetModalState={
                              setDeleteWidgetModalState
                            }
                            setAddWidgetModalState={setAddWidgetModalState}
                            setEditWidgetModalState={setEditWidgetModalState}
                            handleMove={handleMove}
                            selected={isWidgetSelected}
                            handleUpdateWidget={handleUpdateWidget}
                          />
                        );
                        break;
                      case 'Vibration':
                        w = (
                          <W_Vibration
                            key={widget.id}
                            widgetType="vibration"
                            {...widget}
                            groupNames={[
                              { groupName: { equalTo: 'Settings' } },
                            ]}
                            groupId={group.id}
                            order={group.order}
                            setDeleteWidgetModalState={
                              setDeleteWidgetModalState
                            }
                            setAddWidgetModalState={setAddWidgetModalState}
                            setEditWidgetModalState={setEditWidgetModalState}
                            handleMove={handleMove}
                            selected={isWidgetSelected}
                            handleUpdateWidget={handleUpdateWidget}
                          />
                        );
                        break;
                      case 'DataChart':
                        w = (
                          <W_DataChart
                            key={widget.id}
                            widgetType="datachart"
                            {...widget}
                            groupNames={[
                              { groupName: { equalTo: 'Settings' } },
                            ]}
                            groupId={group.id}
                            order={group.order}
                            setDeleteWidgetModalState={
                              setDeleteWidgetModalState
                            }
                            setAddWidgetModalState={setAddWidgetModalState}
                            setEditWidgetModalState={setEditWidgetModalState}
                            handleMove={handleMove}
                            selected={isWidgetSelected}
                            handleUpdateWidget={handleUpdateWidget}
                          />
                        );
                        break;
                      case 'ObjectTable':
                        w = (
                          <W_ObjectTable
                            key={widget.id}
                            widgetType="object table"
                            {...widget}
                            groupNames={[
                              { groupName: { equalTo: 'Settings' } },
                            ]}
                            groupId={group.id}
                            order={group.order}
                            setDeleteWidgetModalState={
                              setDeleteWidgetModalState
                            }
                            setAddWidgetModalState={setAddWidgetModalState}
                            setEditWidgetModalState={setEditWidgetModalState}
                            handleMove={handleMove}
                            selected={isWidgetSelected}
                            handleUpdateWidget={handleUpdateWidget}
                          />
                        );
                        break;
                      case 'GroupTable':
                        w = (
                          <W_GroupTable
                            key={widget.id}
                            widgetType="group table"
                            {...widget}
                            groupNames={[
                              { groupName: { equalTo: 'Settings' } },
                            ]}
                            groupId={group.id}
                            order={group.order}
                            setDeleteWidgetModalState={
                              setDeleteWidgetModalState
                            }
                            setAddWidgetModalState={setAddWidgetModalState}
                            setEditWidgetModalState={setEditWidgetModalState}
                            handleMove={handleMove}
                            selected={isWidgetSelected}
                            handleUpdateWidget={handleUpdateWidget}
                          />
                        );
                        break;
                      case 'Title':
                        w = (
                          <W_Title
                            key={widget.id}
                            widgetType="title"
                            {...widget}
                            groupNames={[
                              { groupName: { equalTo: 'Settings' } },
                              { groupName: { equalTo: 'Value' } },
                            ]}
                            groupId={group.id}
                            order={group.order}
                            setDeleteWidgetModalState={
                              setDeleteWidgetModalState
                            }
                            setAddWidgetModalState={setAddWidgetModalState}
                            setEditWidgetModalState={setEditWidgetModalState}
                            handleMove={handleMove}
                            selected={isWidgetSelected}
                            handleUpdateWidget={handleUpdateWidget}
                          />
                        );
                        break;
                      case 'DateTime':
                        w = (
                          <W_DateTime
                            key={widget.id}
                            widgetType="datetime"
                            {...widget}
                            groupNames={[
                              { groupName: { equalTo: 'Settings' } },
                            ]}
                            groupId={group.id}
                            order={group.order}
                            setDeleteWidgetModalState={
                              setDeleteWidgetModalState
                            }
                            setAddWidgetModalState={setAddWidgetModalState}
                            setEditWidgetModalState={setEditWidgetModalState}
                            handleMove={handleMove}
                            selected={isWidgetSelected}
                            handleUpdateWidget={handleUpdateWidget}
                          />
                        );
                        break;
                      case 'Counter':
                        w = (
                          <W_Counter
                            key={widget.id}
                            widgetType="counter"
                            {...widget}
                            groupNames={[
                              { groupName: { equalTo: 'Settings' } },
                            ]}
                            groupId={group.id}
                            order={group.order}
                            setDeleteWidgetModalState={
                              setDeleteWidgetModalState
                            }
                            setAddWidgetModalState={setAddWidgetModalState}
                            setEditWidgetModalState={setEditWidgetModalState}
                            handleMove={handleMove}
                            selected={isWidgetSelected}
                            handleUpdateWidget={handleUpdateWidget}
                          />
                        );
                        break;
                      case 'DataBox':
                        w = (
                          <W_DataBox
                            key={widget.id}
                            widgetType="databox"
                            {...widget}
                            groupNames={[
                              { groupName: { equalTo: 'Settings' } },
                            ]}
                            groupId={group.id}
                            order={group.order}
                            setDeleteWidgetModalState={
                              setDeleteWidgetModalState
                            }
                            setAddWidgetModalState={setAddWidgetModalState}
                            setEditWidgetModalState={setEditWidgetModalState}
                            handleMove={handleMove}
                            selected={isWidgetSelected}
                            handleUpdateWidget={handleUpdateWidget}
                          />
                        );
                        break;
                      case 'DataBoxAdvanced':
                        w = (
                          <W_DataBoxAdvanced
                            key={widget.id}
                            widgetType="databox advanced"
                            {...widget}
                            groupNames={[
                              { groupName: { equalTo: 'Settings' } },
                            ]}
                            groupId={group.id}
                            order={group.order}
                            setDeleteWidgetModalState={
                              setDeleteWidgetModalState
                            }
                            setAddWidgetModalState={setAddWidgetModalState}
                            setEditWidgetModalState={setEditWidgetModalState}
                            handleMove={handleMove}
                            selected={isWidgetSelected}
                            handleUpdateWidget={handleUpdateWidget}
                          />
                        );
                        break;

                      case 'Slider':
                        w = (
                          <W_Slider
                            key={widget.id}
                            widgetType="slider"
                            {...widget}
                            groupNames={[
                              { groupName: { equalTo: 'Settings' } },
                            ]}
                            groupId={group.id}
                            order={group.order}
                            setDeleteWidgetModalState={
                              setDeleteWidgetModalState
                            }
                            setAddWidgetModalState={setAddWidgetModalState}
                            setEditWidgetModalState={setEditWidgetModalState}
                            handleMove={handleMove}
                            selected={isWidgetSelected}
                            handleUpdateWidget={handleUpdateWidget}
                          />
                        );
                        break;
                      case 'Switcher':
                        w = (
                          <W_Switcher
                            key={widget.id}
                            widgetType="switcher"
                            {...widget}
                            groupNames={[
                              { groupName: { equalTo: 'Settings' } },
                            ]}
                            groupId={group.id}
                            order={group.order}
                            setDeleteWidgetModalState={
                              setDeleteWidgetModalState
                            }
                            setAddWidgetModalState={setAddWidgetModalState}
                            setEditWidgetModalState={setEditWidgetModalState}
                            handleMove={handleMove}
                            selected={isWidgetSelected}
                            handleUpdateWidget={handleUpdateWidget}
                          />
                        );
                        break;
                      case 'CommandButton':
                        w = (
                          <W_CommandButton
                            key={widget.id}
                            widgetType="command button"
                            {...widget}
                            groupNames={[
                              { groupName: { equalTo: 'Settings' } },
                            ]}
                            groupId={group.id}
                            order={group.order}
                            setDeleteWidgetModalState={
                              setDeleteWidgetModalState
                            }
                            setAddWidgetModalState={setAddWidgetModalState}
                            setEditWidgetModalState={setEditWidgetModalState}
                            handleMove={handleMove}
                            selected={isWidgetSelected}
                            handleUpdateWidget={handleUpdateWidget}
                          />
                        );
                        break;
                      case 'Indicator':
                        w = (
                          <W_Indicator
                            key={widget.id}
                            widgetType="indicator"
                            {...widget}
                            groupNames={[
                              { groupName: { equalTo: 'Settings' } },
                            ]}
                            groupId={group.id}
                            order={group.order}
                            setDeleteWidgetModalState={
                              setDeleteWidgetModalState
                            }
                            setAddWidgetModalState={setAddWidgetModalState}
                            setEditWidgetModalState={setEditWidgetModalState}
                            handleMove={handleMove}
                            selected={isWidgetSelected}
                            handleUpdateWidget={handleUpdateWidget}
                          />
                        );
                        break;
                      case 'WeatherBox':
                        w = (
                          <W_WeatherBox
                            key={widget.id}
                            widgetType="weatherbox"
                            {...widget}
                            groupNames={[
                              { groupName: { equalTo: 'Settings' } },
                            ]}
                            groupId={group.id}
                            order={group.order}
                            setDeleteWidgetModalState={
                              setDeleteWidgetModalState
                            }
                            setAddWidgetModalState={setAddWidgetModalState}
                            setEditWidgetModalState={setEditWidgetModalState}
                            handleMove={handleMove}
                            selected={isWidgetSelected}
                            handleUpdateWidget={handleUpdateWidget}
                          />
                        );
                        break;
                      default:
                        console.log('Unknown widget type');
                    }

                    return w;
                  })}
                </div>
              </div>
            );
          })}
        </ResponsiveGridLayout>

        {isEditMode && (
          <Tooltip title={msg.dashboard.addGroup}>
            <Fab
              className={classes.addContainerButton}
              color="primary"
              onClick={e => {
                setAddGroupModalState({
                  open: true,
                  dashboardId: dashboardId,
                });
              }}
            >
              <AddIcon fontSize="large" />
            </Fab>
          </Tooltip>
        )}
      </div>
      <AddGroupModal
        setModalState={setAddGroupModalState}
        modalState={addGroupModalState}
        handleAddGroup={handleAddGroup}
      />
      <DeleteGroupModal
        setModalState={setDeleteGroupModalState}
        modalState={deleteGroupModalState}
        handleDeleteGroup={handleDeleteGroup}
      />
      <EditGroupModal
        setModalState={setEditGroupModalState}
        modalState={editGroupModalState}
        handleUpdateGroup={handleUpdateGroup}
      />
      <AddWidgetModal
        setModalState={setAddWidgetModalState}
        modalState={addWidgetModalState}
        handleAddWidget={handleAddWidget}
      />
      <DeleteWidgetModal
        setModalState={setDeleteWidgetModalState}
        modalState={deleteWidgetModalState}
        handleDeleteWidget={handleDeleteWidget}
      />
      <EditWidgetModal
        setModalState={setEditWidgetModalState}
        modalState={editWidgetModalState}
        handleUpdateWidget={handleUpdateWidget}
      />
    </>
  );
});
export default Dashboard;
