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
  {
    path: '/host/spaceCreate',
    name: 'hostSpaceCreate',
    component: () => import('@/views/hostView/SpaceCreate.vue'),
    meta: {auth:true},
  },
  {
    path: '/host/spaceUpdate',
    name: 'hostSpaceUpdate',
    component: () => import('@/views/hostView/SpaceCreate.vue'),
    meta: {auth:true},
  },
  {
    path: '/host/roomCreate/:name/:spaceType',
    name: 'hostRoomCreate',
    component: () => import('@/views/hostView/RoomCreatePage.vue'),
    meta: {auth:true},
  },
  {
    path: '/host/spaceDetail/:name',
    name: 'hostSpaceDetail',
    component: () => import('@/views/SpaceDetail.vue'),
    meta: {auth:true},
  },
]
