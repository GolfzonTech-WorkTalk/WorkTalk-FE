export default [
  {
    path: '/master',
    name: 'masterPage',
    component: () => import('@/views/masterView/masterMain.vue'),
    meta: {auth:true},
  },
  {
    path: '/master/space',
    name: 'masterSpacePage',
    component: () => import('@/views/masterView/masterSpace.vue'),
    meta: {auth:true},
  },
  {
    path: '/master/customercneter',
    name: 'masterCustomercneter',
    component: () => import('@/views/masterView/masterCustomerCenter.vue'),
    meta: {auth:true},
  },
  {
    path: '/master/UserManagement',
    name: 'masterUserManagement',
    component: () => import('@/views/masterView/masterUserManagement.vue'),
    meta: {auth:true},
  },
]