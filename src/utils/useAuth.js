import { useApolloClient } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, setContext } from '../actions';

import {
  REFRESH_TOKEN_MUTATION,
  //  GET_PROFILE,
  ACCESS_TOKEN_MUTATION,
  USERID_QUERY,
  USER_QUERY,
} from '../queries';

export const useAuth = () => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const profile = useSelector(state => state.profile);

  const getUserId = async () => {
    //loading.value = true;
    //    const id = await getUserId();
    console.log('useAuth.js getUserId start');

    const result_userid = await client.query({
      query: USERID_QUERY,
      variables: {},
      fetchPolicy: 'network-only',
    });

    console.log(
      'useAuth.js getUserId USERID_QUERY result',
      result_userid?.data.getUserId
    );

    return result_userid?.data.getUserId;
  };

  const loadUser = async () => {
    console.log('useAuth.js loadUser');

    const id = await getUserId();
    /*
    const result_userid = await client.query({
      query: USERID_QUERY,
      variables: { },
      fetchPolicy: 'network-only',
    });

    console.log('useAuth.js loadUser USERID_QUERY result', result_userid.data); 
*/
    const result_user = await client.query({
      query: USER_QUERY,
      variables: {
        id: id,
      },
      fetchPolicy: 'network-only',
    });

    console.log('useAuth.js loadUser USER_QUERY result', result_user.data);

    //dispatch(setContext({isLoggedIn: result_user.data.user}))

    dispatch(updateProfile(result_user.data.user));
    //    user.value = result_user.data.user;
  }; //loadUser

  const loginFromApp = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('useAuth.js loginFromApp refreshToken', refreshToken);
    try {
      const result_access = await client.mutate({
        mutation: ACCESS_TOKEN_MUTATION,
        variables: {
          input: {
            userRefreshToken: refreshToken,
            accessTokenExpiration: 24 * 60,
            //            profileTags: ['admin']
            profileTags: ['application', 'monitor', 'user profile'],
          },
        },
        fetchPolicy: 'no-cache',
      });

      console.log(
        'useAuth.js loginFromApp ACCESS_TOKEN_MUTATION result',
        result_access.data
      );

      const jwt = result_access.data.authAccessToken.jwtToken;
      console.log('useAuth.js loginFromApp jwt', jwt);

      if (jwt) {
        localStorage.setItem('authToken', jwt);
        await loadUser();
        //        dispatch(updateProfile({ id: 1 }));
        //          token.value = jwt;
        //          user.value = { id: 1 };
      } else {
        console.log('useAuth.js jwt: User does not exist?');
        dispatch(updateProfile(null));
        return Promise.reject(new Error('User does not exist'));
      }
      //loadUser();
    } catch (err) {
      console.log('useAuth.js loginFromApp err', err);
      dispatch(updateProfile(null));
      return Promise.reject(new Error('Authorization failed'));
      /*
        enqueueSnackbar({
          message: err.toString(),
          options: { code: 'UNKNOWN', variant: 'error' },
        });
*/
    } //catch
  }; //loginFromApp

  const logout = async () => {
    //      wsLink.client.dispose();
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenId');

    //dispatch(updateProfile(null));

    //    token.value = null;
    //    user.value = null;
  };

  const login = async input => {
    const result_refresh = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: {
        input: input,
      },
      fetchPolicy: 'no-cache',
    });

    console.log(
      'useAuth.js login REFRESH_TOKEN_MUTATION result',
      result_refresh.data
    );

    const userRefreshToken =
      result_refresh.data.authRefreshToken.refreshToken.token;
    const tokenId = result_refresh.data.authRefreshToken.refreshToken.id;
    console.log('useAuth.js login rtoken:' + userRefreshToken);
    console.log('useAuth.js login tokenId:' + tokenId);
    localStorage.setItem('tokenId', tokenId);
    localStorage.setItem('refreshToken', userRefreshToken);

    const result_access = await client.mutate({
      mutation: ACCESS_TOKEN_MUTATION,
      variables: {
        input: {
          userRefreshToken: userRefreshToken,
          accessTokenExpiration: 24 * 60,
          //            profileTags: ['admin'],
          profileTags: ['application', 'monitor', 'user profile'],
        },
      },
      fetchPolicy: 'no-cache',
    });

    console.log('useAuth.js ACCESS_TOKEN_MUTATION result', result_access.data);

    const jwt = result_access.data.authAccessToken.jwtToken;
    if (jwt) {
      console.log('useAuth.js jwt', jwt);
      localStorage.setItem('authToken', jwt);
      //dispatch(updateProfile({ id: 1 }));

      //        token.value = jwt;
      //        user.value = { id: 1 };
    } else {
      console.log('useAuth.js handleClickLogin: jwt is null');

      return Promise.reject(new Error('User does not exist'));
    }

    await loadUser();
  }; //login

  return { login, logout, loginFromApp, loadUser, getUserId };
};
