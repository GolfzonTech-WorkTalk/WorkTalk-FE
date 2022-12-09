export default [
  {
    path: '/searchSpace/:spaceType/:address/:date/:time',
    name: 'searchSpace',
    component: () => import('@/views/SearchSpace.vue'),
  },
  {
    path: '/spaceOne/:spaceName/:spaceId/:spaceType',
    name: 'spaceOne',
    component: () => import('@/views/SpaceDetail.vue'),
  },
  {
    path: '/user/reservation',
    name: 'userReservation',
    component: () => import('@/views/ReservationPage.vue'),
    meta: {auth:true},
  },
  {
    path: '/user/QnAReview',
    name: 'userReview',
    component: () => import('@/views/QnAReview.vue'),
    meta: {auth:true},
  },
  {
    path: '/user/payment',
    name: 'userPayment',
    component: () => import('@/views/userView/PaymentMileage.vue'),
    meta: {auth:true},
  },
  {
    path: '/user/customercenter',
    name: 'userCustomerCenter',
    component: () => import('@/views/CustomerCenter.vue'),
    meta: {auth:true},
  },
]