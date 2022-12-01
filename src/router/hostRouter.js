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
    path: '/host',  // selectAll
    name: 'hostMain',
    component: () => import('@/views/hostView/HostMainPage.vue'),
    meta: {auth:true},
  },
  {
    path: '/host/spaceOne/:spaceName/:spaceId',
    name: 'hostSpaceOne',
    component: () => import('@/views/SpaceDetail.vue'),
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
    path: '/host/spaceUpdate',
    name: 'hostSpaceUpdate',
    component: () => import('@/views/hostView/SpaceCreate.vue'),
    meta: {auth:true},
  },
  {
    path: '/host/roomCreate/:name/:spaceType/:spaceId',
    name: 'hostRoomCreate',
    component: () => import('@/views/hostView/RoomCreatePage.vue'),
    meta: {auth:true},
  },
  {
    path: '/host/reservation',
    name: 'hostReservation',
    component: () => import('@/views/ReservationPage.vue'),
    meta: {auth:true},
  },
]
