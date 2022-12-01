export default [
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
    component: () => import('@/views/userView/QnAReview.vue'),
    meta: {auth:true},
  },
  {
    path: '/user/payment',
    name: 'userPayment',
    component: () => import('@/views/userView/PaymentPage.vue'),
    meta: {auth:true},
  },
]


