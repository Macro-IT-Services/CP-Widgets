import { v4 as uuidv4 } from 'uuid';

// ==================================== SETTINGS ===================================

export const setSettings = data => {
  return {
    type: 'SET_SETTINGS',
    data,
  };
};

export const setContext = data => {
  return {
    type: 'SET_CONTEXT',
    data,
  };
};

export const updateProfile = data => {
  return {
    type: 'UPDATE_PROFILE',
    data,
  };
};
/*
export const login = data => {
  return {
    type: 'LOGIN',
    data,
  };
};
*/
export const clearProfile = data => {
  return {
    type: 'CLEAR_PROFILE',
    data,
  };
};

/*
export const putNotificationA = (data) => {
 
    return {
        type: 'NOTIFY',
        data,
    }
}
*/

// ================================== LAYOUT =======================================
export const updateEntireDashboard = data => {
  return {
    type: 'UPDATE_ENTIRE_DASHBOARD',
    data,
  };
};

export const updateInDashboard = data => {
  return {
    type: 'UPDATE_DASHBOARD',
    data,
  };
};

export const clearDashboard = () => {
  return {
    type: 'CLEAR_DASHBOARD',
  };
};

export const addToDashboard = data => {
  if (!data.id) data.id = uuidv4();

  return {
    type: 'ADD_TO_DASHBOARD',
    data,
  };
};

export const deleteFromDashboard = id => {
  return {
    type: 'DELETE_FROM_DASHBOARD',
    id,
  };
};

// ================================== LAYOUT =======================================

/*
export const updateLayout = (id, data) => {
  return {
    type: 'UPDATE_LAYOUT',
    id,
    data,
  };
};
*/
export const updateEntireLayout = data => {
  return {
    type: 'UPDATE_ENTIRE_LAYOUT',
    data,
  };
};

export const addToLayout = data => {
  //  if (!data.id) data.id = uuidv4();

  return {
    type: 'ADD_TO_LAYOUT',
    data,
  };
};

export const deleteFromLayout = id => {
  //  console.log('TCL: deleteNode -> node_id', id);

  return {
    type: 'DELETE_FROM_LAYOUT',
    id,
  };
};

export const clearLayout = () => {
  return {
    type: 'CLEAR_LAYOUT',
  };
};

// ===================================== SNACKBARS ======================================

export const enqueueSnackbar = notification => {
  const key = notification.options && notification.options.key;

  return {
    type: 'ENQUEUE_SNACKBAR',
    notification: {
      ...notification,
      key: key || new Date().getTime() + Math.random(),
    },
  };
};

export const closeSnackbar = key => ({
  type: 'CLOSE_SNACKBAR',
  dismissAll: !key, // dismiss all if no key has been defined
  key,
});

export const removeSnackbar = key => ({
  type: 'REMOVE_SNACKBAR',
  key,
});

// ====================================================================================
