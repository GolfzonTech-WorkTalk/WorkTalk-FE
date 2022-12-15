export default [
  {
    path: '/host',  // selectAll
    name: 'hostMain',
    component: () => import('@/views/hostView/HostMainPage.vue'),
    meta: {auth:true},
  },
  {
    path: '/host/spaceOne/:spaceName/:spaceId/:spaceType',
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
    path: '/host/spaceUpdate/:name/:spaceType/:spaceId',
    name: 'hostSpaceUpdate',
    component: () => import('@/views/hostView/SpaceUpdate.vue'),
    meta: {auth:true},
  },
  {
    path: '/host/roomCreate/:name/:spaceType/:spaceId',
    name: 'hostRoomCreate',
    component: () => import('@/views/hostView/RoomCreatePage.vue'),
    meta: {auth:true},
  },
  {
    path: '/host/roomUpdate/:name/:spaceType/:spaceId',
    name: 'hostRoomUpdate',
    component: () => import('@/views/hostView/RoomUpdatePage.vue'),
    meta: {auth:true},
  },
  {
    path: '/host/reservation',
    name: 'hostReservation',
    component: () => import('@/views/ReservationPage.vue'),
    meta: {auth:true},
  },
  {
    path: '/host/QnAReview',
    name: 'hostReview',
    component: () => import('@/views/QnAReview.vue'),
    meta: {auth:true},
  },
  {
    path: '/host/customercenter',
    name: 'hostCustomerCenter',
    component: () => import('@/views/CustomerCenter.vue'),
    meta: {auth:true},
  },
  {
    path: '/host/payment',
    name: 'hostPayment',
    component: () => import('@/views/hostView/PaymentView.vue'),
    meta: {auth:true},
  },
]
