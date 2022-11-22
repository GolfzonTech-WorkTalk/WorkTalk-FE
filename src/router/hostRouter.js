export default [
  {
    path: '/host/login',
    name: 'hostlogin',
    component: () => import('@/views/LoginPage.vue'),
  },
  {
    path: '/host/join',
    name: 'hostJoin',
    component: () => import('@/views/JoinPage.vue'),
  },
  {
    path: '/host',
    name: 'hostMain',
    component: () => import('@/views/hostView/HostMainPage.vue'),
    meta: {auth:true},
  },
  {
    path: '/host/profile',
    name: 'hostProfile',
    component: () => import('@/views/ProfilePage.vue'),
    meta: {auth:true},
  },
]
