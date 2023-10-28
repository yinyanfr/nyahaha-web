import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', component: 'index' },
    { path: '/user', component: 'user' },
    { path: '/login', component: 'login' },
    { path: '/songs', component: 'songs' },
  ],
  npmClient: 'yarn',
  title: '喵哈哈',
  plugins: [
    '@umijs/plugins/dist/antd',
    '@umijs/plugins/dist/initial-state',
    '@umijs/plugins/dist/model',
  ],
  antd: {},
  // https: {
  //   cert: '../cert/localhost.pem',
  //   key: '../cert/localhost-key.pem',
  // },
  initialState: {},
  model: {},
});
