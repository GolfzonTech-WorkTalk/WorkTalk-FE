export default [
  {
    path: '/spaceOne/:spaceName/:spaceId/:spaceType',
    name: 'spaceOne',
    component: () => import('@/views/SpaceDetail.vue'),
  },
  {
    path: '/user/reservation',
    name: 'userReservation',
    component: () => import('@/views/userView/ReservationPage.vue'),
    meta: {auth:true},
  },
  {
    path: '/user/review',
    name: 'userReview',
    component: () => import('@/views/userView/ReviewPage.vue'),
    meta: {auth:true},
  },
  {
    path: '/user/payment',
    name: 'userPayment',
    component: () => import('@/views/userView/PaymentPage.vue'),
    meta: {auth:true},
  },
]


