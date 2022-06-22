// ==================================== SETTINGS ===================================
//console.log('process.env.NODE_ENV',process.env.NODE_ENV)
export const settingsReducer = (
  // theme: 'light' or 'dark', lang: 'en' or 'ru, mode: 'fs' or 'window'
  state = {
    //theme: process.env.NODE_ENV === 'development' ? 'dark' : 'light',
    theme: 'light',
    //    theme: 'dark',
    lang: 'en',
    isFullScreen: false,
    isSideBar: true,
    //isEditMode: process.env.NODE_ENV === 'development' ? true : false, //false
    //isEditMode: process.env.NODE_ENV === 'development' ? true : false,
    isEditMode: false,
    simulation: false,
    appTitle: 'Optional title text',
    checked: [], //debug
    layout: [], //debug
    simData: 0, //debug
    gapContainers: 8, //8   gap between containers, px
    gapWidgets: 3, //3  gap between widgets, px
    datetime: new Date(), // Date(), updated every minute
    icons: [], // set of icons for widgets
  },
  action
) => {
  switch (action.type) {
    case 'SET_SETTINGS':
      return { ...state, ...action.data };
    //        break

    default:
      return state;
  }
}; //settingsReducer

export const contextReducer = (
  state = {
    dashboards: [], // dashboards list (for drawer menu)
    currentObjectName: '', // for search field in MainToolbar
    objectHoveredId: null, // id hovered in lists of objects (SideList, SideCard) to highlight them on dashboard
    //refreshToken: null,
    refreshFlag: 0, // change to reload groups/widgets
    //isLoggedIn: false,
  },
  action
) => {
  switch (action.type) {
    case 'SET_CONTEXT':
      return { ...state, ...action.data };
    //        break

    default:
      return state;
  }
}; //contextReducer

export const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'CLEAR_PROFILE': {
      return {
        ...state,
        id: null,
      };
    }
    case 'UPDATE_PROFILE':
      return { ...state, ...action.data };

    default:
      return state;
  }
}; //userReducer

// ================================== DASHBOARD (array of groups) =======================================

export const dashboardReducer = (state = [], action) => {
  switch (action.type) {
    case 'CLEAR_DASHBOARD':
      return [];

    // rewrite everything
    case 'UPDATE_ENTIRE_DASHBOARD':
      //      console.log('% action', action);
      return action.data;

    // upsert exact group
    case 'UPDATE_DASHBOARD':
      //      console.log('% action', action);
      //      console.log('% state', state);

      const res = [
        ...state.filter(o => o.id !== action.data.id),
        { ...action.data },
      ];

      //      console.log('% res', res);

      return res;

    // add group to dashboard
    case 'ADD_TO_DASHBOARD':
      return [...state, action.data];

    // delete group from dashboard
    case 'DELETE_FROM_DASHBOARD':
      return state.filter(node => node.id !== action.id);

    default:
      return state;
  }
};

// ================================== LAYOUT =======================================

// TODO: keyed objects!
/*
const layoutDefaultState = {
  "lg":[
   {
     x: 5,
     y: 5*48,
     w: 1, // 1 or 2 columns
     h: 2*48, // 2 or 4 row heights
     i: '0',
   },
   {
     x: 5,
     y: 8*48,
     w: 2, // 1 or 2 columns
     h: 4*48, // 2 or 4 row heights
     i: '1',
   },
   {
     x: 5,
     y: 15*48,
     w: 3, // 1 or 2 columns
     h: 8*48, // 2 or 4 row heights
     i: '2',
   },
   {
     x: 5,
     y: 20*48,
     w: 3, // 1 or 2 columns
     h: 4*48, // 2 or 4 row heights
     i: '3',
   },
   {
    x: 5,
    y: 40 * 48,
    w: 3, 
    h: 3 * 48, 
    i: '4',
  },
],
 "xs":[
   {
     x: 5,
     y: 5*48,
     w: 1, // 1 or 2 columns
     h: 2*48, // 2 or 4 row heights
     i: '0',
   },
   {
     x: 5,
     y: 8*48,
     w: 2, // 1 or 2 columns
     h: 4*48, // 2 or 4 row heights
     i: '1',
   },
   {
     x: 5,
     y: 15*48,
     w: 3, // 1 or 2 columns
     h: 4*48, // 2 or 4 row heights
     i: '2',
   },
   {
     x: 5,
     y: 20*48,
     w: 3, // 1 or 2 columns
     h: 4*48, // 2 or 4 row heights
     i: '3',
   },
   {
    x: 5,
    y: 40 * 48,
    w: 3, 
    h: 3 * 48, 
    i: '4',
  },
],
 }
 */
export const layoutReducer = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_ENTIRE_LAYOUT':
      //const nodesExceptUpdated = state.filter(node=> node.id !== action.id) //update node with given action.node_id
      /*
      let newState = state.map(node =>
        node.id === action.id ? { ...node, ...action.data } : node
      );
*/
      //     let newState = [...nodesExceptUpdated, action.data ]
      //      console.log('STORE newState', newState);

      return action.data;

    case 'ADD_TO_LAYOUT':
      //    console.log('%',action.data)
      return [...state, action.data];

    case 'CLEAR_LAYOUT':
      return [];

    case 'DELETE_FROM_LAYOUT':
      //      console.log('%',action.node_id)
      return state.filter(node => node.node_id !== action.node_id);

    default:
      return state;
  }
};

// ===================================== SNACKBARS ======================================

const defaultState = {
  notifications: [],
};

export const notificationReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'ENQUEUE_SNACKBAR':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            key: action.key,
            ...action.notification,
          },
        ],
      };

    case 'CLOSE_SNACKBAR':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          action.dismissAll || notification.key === action.key
            ? { ...notification, dismissed: true }
            : { ...notification }
        ),
      };

    case 'REMOVE_SNACKBAR':
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.key !== action.key
        ),
      };

    default:
      return state;
  }
};
