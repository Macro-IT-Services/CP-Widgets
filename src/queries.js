import { gql } from '@apollo/client';

// -================================== MUTATIONS =======================================
/*
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($userLogin: String!, $userPassword: String!) {
    authRefreshToken(
      input: { userLogin: $userLogin, userPassword: $userPassword }
    ) {
      clientMutationId
      refreshToken {
        token
        id
      }
    }
  }
`;

export const ACCESS_TOKEN_MUTATION = gql`
  mutation AuthToken($userRefreshToken: String!) {
    authAccessToken(
      input: {
        userRefreshToken: $userRefreshToken
        accessTokenExpiration: 599
        profileTags: ["application", "admin", "user profile"]
      }
    ) {
      clientMutationId
      jwtToken
    }
  }
`;
*/

export const REFRESH_TOKEN_MUTATION = gql`
  mutation authRefreshToken($input: AuthRefreshTokenInput!) {
    authRefreshToken(input: $input) {
      refreshToken {
        token
        id
      }
    }
  }
`;

export const ACCESS_TOKEN_MUTATION = gql`
  mutation authAccessToken($input: AuthAccessTokenInput!) {
    authAccessToken(input: $input) {
      jwtToken
    }
  }
`;

export const USERID_QUERY = gql`
  query getUserId {
    getUserId
  }
`;

export const PROFILEID_QUERY = gql`
  query getUserProfileId {
    getUserProfileId
  }
`;

export const USER_QUERY = gql`
  query loadUser($id: UUID!) {
    user(id: $id) {
      id
      type
      login
      mEmail
      mName
      mPhone
      mExternalId
      mIcon
      mPicture
      mTags
      description
      enabled
      defaultEditorgroup
      defaultReadergroup
      defaultUsergroup
      usersToGroups {
        userGroup {
          id
          groupName
        }
      }
      notificationsByBy {
        subject
        subjectName
        subjectType
        message
        tags
        createdAt
      }
      usersToObjects {
        nodeId
        object {
          id
          name
          schemaType
        }
      }
    }
  }
`;

/*
query userApps($id: UUID!) {
    schemata(filter: {mTags:{contains: ["application", "user profile"]}}, orderBy: NAME_ASC ) {
        id
        name: property(propertyName:"Program/Name")
        icon: property(propertyName:"Program/Icon")
        url: property(propertyName:"Program/URL")
        user: objects(filter: {
            userProfilesConnection: {
                some: {
                    userId: {
                        equalTo:  $id
                    }
                }
                every: {
                    object: {
                        enabled: {
                            equalTo: true
                        }
                    }
                }
            }
        }){
            userProfiles {
                user {
                    login
                    enabled
                }
            }
        }
    }
}

*/

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;
/*
export const USERID_QUERY = gql`
  query GetUserID {
    getUserId
  }
`;

export const USER_QUERY = gql`
  query GetUser($userId: UUID!) {
    user(id: $userId) {
      login
      mName
      mEmail
    }
  }
`;
*/
export const APPS_QUERY = gql`
  query userApps($userId: UUID!) {
    schemata(
      filter: { mTags: { contains: ["application", "user profile"] } }
      orderBy: NAME_ASC
    ) {
      id
      name: property(propertyName: "Program/Name")
      icon: property(propertyName: "Program/Icon")
      url: property(propertyName: "Program/URL")
      user: objects(
        filter: {
          userProfilesConnection: {
            some: { userId: { equalTo: $userId } }
            every: { object: { enabled: { equalTo: true } } }
          }
        }
      ) {
        userProfiles {
          user {
            login
            enabled
          }
        }
      }
    }
  }
`;

// query icons for CustomSelectIcon (DataBox widget)
export const ICONS_QUERY = gql`
  query fetch {
    objects(
      filter: { schemaTags: { contains: ["application", "monitor", "icon"] } }
    ) {
      id
      name
    }
  }
`;

export const DASHBOARDS_QUERY = gql`
  query getDashboards {
    objects(
      filter: {
        schemaTags: { contains: ["application", "board", "dashboard"] }
      }
    ) {
      id
      name

      objectProperties {
        groupName
        property
        value
        key
      }

      objectsToObjectsByObject1Id {
        object2 {
          id
          name
          objectProperties {
            groupName
            property
            value
            key
          }
        }
      }
    }
  }
`;

export const DEVICES_QUERY = gql`
  query listDevices {
    objects(filter: { schemaType: { equalTo: "device" } }, orderBy: NAME_ASC) {
      id
      name
    }
  }
`;

export const DEVICE_PROPS_QUERY = gql`
  query listProperties($deviceId: UUID!) {
    objectProperties(
      filter: { objectId: { equalTo: $deviceId } }
      orderBy: [GROUP_NAME_ASC, PROPERTY_ASC]
    ) {
      id
      groupName
      property
      key
      linkedPropertyId
    }
  }
`;

// get linked device and it's state (e.g. name "Parking Sensor #1", property "Battery Level")
export const DEVICE_PROP_LINKED_QUERY = gql`
  query getProperty($linkedPropId: UUID!) {
    objectProperty(id: $linkedPropId) {
      objectId
      property
      groupName
      object {
        name
      }
    }
  }
`;
export const WIDGET_PROP_LINKED_ID_QUERY = gql`
  query getLProperty($propId: UUID!) {
    objectProperty(id: $propId) {
      linkedPropertyId
    }
  }
`;

export const UPDATE_PROP_MUTATION = gql`
  mutation savePropertyLink($propId: UUID!, $linkedPropId: UUID) {
    updateObjectProperty(
      input: { id: $propId, patch: { linkedPropertyId: $linkedPropId } }
    ) {
      clientMutationId
    }
  }
`;


export const LINK_OBJECT_MUTATION = gql`
  mutation linkObject($widgetId: UUID!, $objectId: UUID! ) {


    createObjectsToObject(
      input: {objectsToObject:{object1Id: $widgetId, object2Id: $objectId}}
      ) {
      objectsToObject {
        id
      }
    }
  }
`;


// get 1) all widgets' ids to count them 2) props of widgets for form fields ($widgetType = "counter", "datetime", etc)
export const WIDGETS_PROPS_QUERY = gql`
  query widgetsProps($widgetType: String!) {
    objects(
      filter: { schemaTags: { contains: ["application", "board", "widget"] } }
    ) {
      id
    }

    schemata(
      filter: {
        mTags: { equalTo: ["application", "board", "widget", $widgetType] }
      }
    ) {
      name
      schemaProperties(orderBy: [GROUP_NAME_DESC, PROPERTY_DESC]) {
        groupName
        defaultValue
        property
        type {
          name
        }
        description
        hidden
        valueSet
        key
      }
    }
  }
`;

// groupNames - array of groups to read properties from. Used for editing properties only from required groups
// (for example only Settings or Settings and Value)
// format: [{groupName: {equalTo: "Settings"}}, {groupName: {equalTo: "Value"}}]

export const WIDGET_QUERY = gql`
  query getWidget($objId: UUID!, $groupNames: [ObjectPropertyFilter!]) {
    object(id: $objId) {
      name
      description
      schemaName
      enabled
      muted
      objectProperties(
        orderBy: [GROUP_NAME_DESC, PROPERTY_DESC]

        filter: { or: $groupNames }
      ) {
        groupName
        property
        spec {
          description
          hidden
          type {
            name
          }
          valueSet
        }
        key
        value
      }
    }
  }
`;

export const DASHBOARD_QUERY = gql`
  query getDashboard($objId: UUID!) {
    object(id: $objId) {
      name
      description
      schemaName
      enabled
      muted
      objectProperties {
        groupName
        property
        spec {
          description
          type {
            name
          }
          valueSet
          hidden
        }
        key
        value
        
      }
    }
  }
`;

// get 1) all groups' ids to count them 2) props of groups for form fields
export const GROUPS_PROPS_QUERY = gql`
  query groupsProps {
    objects(
      filter: { schemaTags: { contains: ["application", "board", "group"] } }
    ) {
      id
    }

    schemata(
      filter: { mTags: { equalTo: ["application", "board", "group"] } }
    ) {
      name
      schemaProperties(orderBy: [GROUP_NAME_DESC, PROPERTY_DESC]) {
        groupName
        defaultValue
        property
        type {
          name
        }
        description
        hidden
        valueRange
        valueSet
        key
      }
    }
  }
`;

// get 1) all dashboards' ids to count them 2) props of dashboards for form fields
export const DASHBOARDS_PROPS_QUERY = gql`
  query dashboardsProps {
    objects(
      filter: {
        schemaTags: { contains: ["application", "board", "dashboard"] }
      }
    ) {
      id
    }

    schemata(
      filter: { mTags: { equalTo: ["application", "board", "dashboard"] } }
    ) {
      name
      schemaProperties {
        groupName
        property
        type {
          name
        }
        description
        hidden
        valueSet
        key
      }
    }
  }
`;

// get notifications about given object id
export const NOTIFICATIONS_QUERY = gql`
  query notifications($objId: UUID!) {
    notifications(
      filter: { subject: { equalTo: $objId } }
      orderBy: CREATED_AT_DESC
    ) {
      id
      createdAt
      subjectName
      message
      tags
      userByBy {
        login
      }
    }
  }
`;

// get widgets for groups, devices and datasets for widget
export const LINKED_OBJECTS_QUERY = gql`
  query getLinkedObjects($objId: UUID!) {
    object(id: $objId) {
      id
      name
      description
      schemaTags
      schemaType
      enabled
      userGroupByEditorgroup {
        groupName
      }
      userGroupByUsergroup {
        groupName
      }
      userGroupByReadergroup {
        groupName
      }

      objectProperties {
        groupName
        property
        value
        key
        id
        linkedPropertyId
        updatedAt
        userByBy {
          login
        }
      }

      objectsToObjectsByObject1Id {
        object2 {
          id
          name
          description
          schemaTags
          schemaType
          enabled
          userGroupByEditorgroup {
            groupName
          }
          userGroupByUsergroup {
            groupName
          }
          userGroupByReadergroup {
            groupName
          }
          objectProperties(orderBy: [GROUP_NAME_DESC, PROPERTY_DESC]) {
            groupName
            property
            linkedPropertyId
            value
            key
            updatedAt
            userByBy {
              login
            }
          }
        }
      }
    }
  }
`;

// get all notifications of given type
export const NOTIFICATIONS_ALL_QUERY = gql`
  query notifications($tags: [String]) {
    notifications(
      filter: { tags: { containedBy: $tags } }
      orderBy: CREATED_AT_DESC
    ) {
      id
      createdAt
      subjectName
      message
      tags
      userByBy {
        login
      }
    }
  }
`;

// get groups and widgets linked to dashboard
export const WIDGETS_QUERY = gql`
  query getWidgets($dashboardId: UUID!) {
    object(id: $dashboardId) {
      objectProperties {
        groupName
        property
        value
        key
      }

      objectsToObjectsByObject1Id {
        object2 {
          id
          name
          description
          schemaTags
          enabled
          userGroupByEditorgroup {
            groupName
          }
          userGroupByUsergroup {
            groupName
          }
          userGroupByReadergroup {
            groupName
          }
          objectProperties {
            groupName
            property
            value
            key
            updatedAt
            userByBy {
              login
            }
          }
          objectsToObjectsByObject1Id {
            object2 {
              id
              name
              description
              schemaTags
              enabled
              userGroupByEditorgroup {
                groupName
              }
              userGroupByUsergroup {
                groupName
              }
              userGroupByReadergroup {
                groupName
              }
              objectProperties {
                groupName
                property
                value
                key
                updatedAt
                userByBy {
                  login
                }
              }
            }
          }
        }
      }
    }
  }
`;
/*
// get group data
export const GROUP_QUERY = gql`
  query getGroup($objId: UUID!) {
    object(id: $objId) {
      name
      schemaName
      enabled
      id
      objectProperties {
        groupName
        property
        value
        key
      }

      objectsToObjectsByObject1Id {
        object2 {
          id
          name
          schemaTags
          enabled
          objectProperties {
            groupName
            property
            value
            key
          }
        }
      }
    }
  }
`;
*/

export const GROUP_QUERY = gql`
  query getGroup($objId: UUID!) {
    object(id: $objId) {
      name
      description
      schemaName
      enabled
      muted
      objectProperties(orderBy: [GROUP_NAME_DESC, PROPERTY_DESC]) {
        groupName
        property
        spec {
          description
          type {
            name
          }
          valueSet
          valueRange
          hidden
        }
        key
        value
      }
    }
  }
`;

// get backend version
export const GET_VERSION_QUERY = gql`
  query getVersion {
    getVersion {
      short
      long
    }
  }
`;
/*
export const ADD_DASHBOARD_MUTATION = gql`
  mutation createDashboard($name: String!, $enabled: Boolean!) {
    createObjectWithProperties(
      input: {
        name: $name
        enabled: $enabled
        description: "desc"
        schemaTags: ["application", "board", "dashboard"]
        parents: []
        childs: []
      }
    ) {
      clientMutationId
      uuid
    }
  }
`;
*/

export const ADD_DASHBOARD_MUTATION = gql`
  mutation createDashboard(
    $name: String!
    $description: String!
    $values: [PropertyByKeyInput]
  ) {
    createObjectWithProperties(
      input: {
        name: $name
        enabled: true
        description: $description
        schemaTags: ["application", "board", "dashboard"]
        keyedProperties: $values
        parents: []
        childs: []
      }
    ) {
      clientMutationId
      uuid
    }
  }
`;

/*
export const ADD_GROUP_MUTATION = gql`
  mutation createGroup(
    $dashboardId: UUID!
    $name: String!
    $columnCount: JSON!
    $enabled: Boolean!
  ) {
    createObjectWithProperties(
      input: {
        name: $name
        enabled: $enabled
        description: "desc"
        schemaTags: ["application", "board", "group"]
        properties: [
          {
            groupName: "General"
            property: "Columns count"
            value: $columnCount
          }
          {
            groupName: "General"
            property: "Layout"
            value: { lg: [], md: [], sm: [], xs: [], xxs: [] }
          }
          { groupName: "General", property: "Order", value: [] }
        ]
        parents: [$dashboardId]
        childs: []
      }
    ) {
      clientMutationId
      uuid
    }
  }
`;
*/

export const ADD_GROUP_MUTATION = gql`
  mutation createWidget(
    $dashboardId: UUID!
    $name: String!
    $description: String!
    $values: [PropertyByKeyInput]
  ) {
    createObjectWithProperties(
      input: {
        name: $name
        enabled: true
        description: $description
        schemaTags: ["application", "board", "group"]
        keyedProperties: $values
        parents: [$dashboardId]
        childs: []
      }
    ) {
      clientMutationId
      uuid
    }
  }
`;

export const DELETE_OBJECT_MUTATION = gql`
  mutation deleteObject($objId: UUID!) {
    deleteObject(input: { id: $objId }) {
      clientMutationId
    }
  }
`;

// propertyByKeyInput {propertyKey: String, value: JSON}
//"values":[{"propertyKey":"qqq","value":"111"}]
export const ADD_WIDGET_MUTATION = gql`
  mutation createWidget(
    $groupId: UUID!
    $widgetType: String!
    $name: String!
    $description: String!
    $values: [PropertyByKeyInput]
  ) {
    createObjectWithProperties(
      input: {
        name: $name
        enabled: true
        description: $description
        schemaTags: ["application", "board", "widget", $widgetType]
        keyedProperties: $values
        parents: [$groupId]
        childs: []
      }
    ) {
      clientMutationId
      uuid
    }
  }
`;

/*
export const ADD_WIDGET_MUTATION = gql`
  mutation createWidget(
    $groupId: UUID!
    $scheme: String!
    $name: String!
    $style: JSON!
    $enabled: Boolean!
    $props: JSON!
  ) {
    createObjectWithProperties(
      input: {
        name: $name
        enabled: $enabled
        description: "desc"
        schemaTags: ["application", "board", "widget", $scheme]
        properties: [
          { groupName: "Value", property: "COUNTER", value: "0" }
          { groupName: "Value", property: "SOURCE", value: "1" }
          { groupName: "Value", property: "VALUE", value: "0" }
          { groupName: "Settings", property: "TYPE", value: $type }
          { groupName: "Settings", property: "FULL_LINE", value: $fullLine }
          { groupName: "Settings", property: "STYLE", value: $style }
          { groupName: "Settings", property: "SIMULATION", value: $simulation }
        ]
        parents: [$groupId]
        childs: []
      }
    ) {
      clientMutationId
      uuid
    }
  }
`;
*/

/*
export const UPDATE_WIDGET_MUTATION = gql`
  mutation UpdateObj(
    $widgetId: UUID!
    $name: String!
    $description: String!
    $values: [PropertyByKeyInput]
  ) {

    updateObjectWithProperties(
      input: {
        objectId: widgetId
        name: $name
        description: $description
        keyedProperties: $values
      }
    ) {
      clientMutationId
    }
  }
`;
*/

export const UPDATE_WIDGET_MUTATION = gql`
  mutation UpdateObj(
    $widgetId: UUID!
    $name: String!
    $description: String!
    $values: [PropertyByKeyInput]
  ) {
    updateObjectWithProperties(
      input: {
        detailedObject: [
          {
            objectId: $widgetId
            name: $name
            description: $description
            keyedProperties: $values
          }
        ]
      }
    ) {
      clientMutationId
    }
  }
`;

// update only properties (no name, description, ..)
export const UPDATE_WIDGET_PROPS_MUTATION = gql`
  mutation UpdateObj($widgetId: UUID!, $values: [PropertyByKeyInput]) {
    updateObjectWithProperties(
      input: {
        detailedObject: [{ objectId: $widgetId, keyedProperties: $values }]
      }
    ) {
      clientMutationId
    }
  }
`;


// update only properties (no name, description, ..)
export const UPDATE_DASHBOARD_PROPS_MUTATION = gql`
  mutation UpdateObj($dashboardId: UUID!, $values: [PropertyByKeyInput]) {
    updateObjectWithProperties(
      input: {
        detailedObject: [{ objectId: $dashboardId, keyedProperties: $values }]
      }
    ) {
      clientMutationId
    }
  }
`;


export const UPDATE_GROUP_MUTATION = gql`
  mutation UpdateObj(
    $groupId: UUID!
    $name: String!
    $description: String!
    $values: [PropertyByKeyInput]
  ) {
    updateObjectWithProperties(
      input: {
        detailedObject: [
          {
            objectId: $groupId
            name: $name
            description: $description
            keyedProperties: $values
          }
        ]
      }
    ) {
      clientMutationId
    }
  }
`;

export const UPDATE_DASHBOARD_MUTATION = gql`
  mutation UpdateObj(
    $dashboardId: UUID!
    $name: String!
    $description: String!
    $values: [PropertyByKeyInput]
  ) {
    updateObjectWithProperties(
      input: {
        detailedObject: [
          {
            objectId: $dashboardId
            name: $name
            description: $description
            keyedProperties: $values
          }
        ]
      }
    ) {
      clientMutationId
    }
  }
`;

/*
export const UPDATE_GROUP_ORDER_MUTATION = gql`

  mutation UpdateObj($groupId: UUID!, $order: String!) {
    updateObjectWithProperties(input:{
      objectId: $groupId, 
      order: $order, 
      namedProperties: [
        { groupName: "General", property: "ORDER", value: $order }
      ]
    }) { 
      clientMutationId
    }
  }

`;
*/

export const UPDATE_GROUP_ORDER_MUTATION = gql`
  mutation UpdateGroup($groupId: UUID!, $order: JSON!) {
    updateObjectWithProperties(
      input: {
        detailedObject: [
          {
            objectId: $groupId
            namedProperties: [
              { groupName: "General", property: "Order", value: $order }
            ]
          }
        ]
      }
    ) {
      clientMutationId
    }
  }
`;

export const UPDATE_DASHBOARD_LAYOUT_MUTATION = gql`
  mutation UpdateObj($dashboardId: UUID!, $layout: JSON!) {
    updateObjectWithProperties(
      input: {
        objectId: $dashboardId
        namedProperties: [
          { groupName: "General", property: "Layout", value: $layout }
        ]
      }
    ) {
      clientMutationId
    }
  }
`;

export const UPDATE_GROUPS_LAYOUTS_MUTATION = gql`
  mutation UpdateGroups($objs: [DetailedObjectInput]) {
    updateObjectWithProperties(input: { detailedObject: $objs }) {
      clientMutationId
    }
  }
`;

export const GET_DATA_SUBSCRIPTION = gql`
  subscription Objects($objId: UUID!) {
    Objects(filterA: { id: [$objId] }) {
      event
      relatedNode {
        ... on Object {
          id
          name
        }
        ... on ObjectProperty {
          id
          groupName
          property
          value
          key
        }
        ... on ObjectsToObject {
          id
          object1Id
          object2Id
        }
      }
      relatedNodeId
    }
  }
`;

export const GET_DATA_GLOBAL_SUBSCRIPTION = gql`
  subscription AllBoardObjects {
    Objects(filterA: { tags: ["application", "board"] }) {
      event
      relatedNode {
        ... on Object {
          id
          name
        }
        ... on ObjectProperty {
          id
          groupName
          property
          value
        }
        ... on ObjectsToObject {
          id
          object1Id
          object2Id
        }
      }
      relatedNodeId
    }
  }
`;

/*
// just a test query
export const GET_TESTQUERY = gql`
  query {
    testquery(a: "_done")
  }
`;

// get SINGLE user data
export const GET_USER = gql`
  query getUser($user_id: String) {
    user(user_id: $user_id) {
      id
      name
      username
      assignees_count
    }
  }
`;

// get user profile info
export const GET_PROFILE = gql`
  query getProfile {
    profile {
      id
      email
      settings
    }
  }
`;

// put user profile info
export const UPDATE_PROFILE = gql`
  mutation updateProfile($data: ProfileInput) {
    updateProfile(data: $data) {
      id
      email
      settings
    }
  }
`;
*/
