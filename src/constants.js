export const httpServer =
  'http://platform.pixelcore01.v3.thingularity.online/graphql';
export const wsServer =
  'ws://platform.pixelcore01.v3.thingularity.online/graphql';

export let mediaServer;
if (process.env.NODE_ENV === 'development')
  mediaServer = 'http://media.pixelcore01.v3.thingularity.online';
else mediaServer = window.__pixelConfig.APP_MEDIA_SERVER;

export const innerBorderStyle = 'inset 0px 0px 0px 5px #68a6eb'; // inner border for selected widget
export const highlightSelectedStyle = 'brightness(80%)'; // darkening selected widget
