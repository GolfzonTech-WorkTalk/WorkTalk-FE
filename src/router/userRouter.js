export default [
  {
    path: '/',
    name: 'userMain',
    component: () => import('@/views/MainPage.vue'),
  },
  {
    path: '/user/login',
    name: 'userLogin',
    component: () => import('@/views/LoginPage.vue'),
  },
  {
    path: '/user/join',
    name: 'userJoin',
    component: () => import('@/views/JoinPage.vue'),
  },
  {
    path: '/user/profile',
    name: 'userProfile',
    component: () => import('@/views/ProfilePage.vue'),
    meta: {auth:true},
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


