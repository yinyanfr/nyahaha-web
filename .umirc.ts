import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', component: 'index' },
    { path: '/user', component: 'user' },
    { path: '/login', component: 'login' },
  ],
  npmClient: 'yarn',
  title: '喵哈哈',
  plugins: ['@umijs/plugins/dist/antd'],
  antd: {},
  https: {
    cert: '../cert/localhost.pem',
    key: '../cert/localhost-key.pem',
  },
});
