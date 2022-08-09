import path from 'path';

export default {
  httpTrigger: {
    enable: true,
    path: path.resolve(__dirname, '../plugin/http-trigger'),
  },

  wsTrigger: {
    enable: true,
    path: path.resolve(__dirname, '../plugin/ws-trigger'),
  }
};
