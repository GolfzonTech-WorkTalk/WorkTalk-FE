import { createRouter, createWebHistory } from 'vue-router'
import userRouter from './userRouter'
import hostRouter from './hostRouter'
import masterRouter from './masterRouter'
import store from '@/store'
import jwt_decode from 'jwt-decode'

const routes = [
  ...userRouter,
  ...hostRouter,
  ...masterRouter,
  {
    path: '/testPage',
    name: 'testPage',
    component: () => import('@/views/testPage.vue'),
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/MainPage.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginPage.vue'),
  },
  {
    path: '/join',
    name: 'join',
    component: () => import('@/views/JoinPage.vue'),
  },
  {
    path: '/map',
    name: 'userMAP',
    component: () => import('@/views/MapPage.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfilePage.vue'),
    meta: {auth:true},
  },
  {
    path: "/:catchAll(.*)",
    name: "404Name",
    component: () => import("@/views/NotFoundPage.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  // 스피너 동작
  store.dispatch('SPINNERVIEW')
  // 토큰이 있을 경우
  let auth
  let sub
  if (store.state.token){
    const token = store.state.token
    const decode = jwt_decode(token)
    auth = decode.auth
    sub = decode.sub
    // console.log(token)
    // console.log(decode)
    // console.log('권한 : ', auth)
    // console.log('닉네임 : ', sub)
    store.dispatch('NICKNAME', sub)
    store.dispatch('ROLETYPE', auth)
  }
  
  // 페이지 넘어갈시 메뉴탭 닫기
  store.dispatch('MENUTABCLOSE', false)
  
  // 로그인 여부 확인
  if (to.meta.auth && !store.getters.isLogin){
    // console.log('로그인이 필요합니다.')
    alert('로그인이 필요합니다.')
    return next('/login')
  }
  
  // 로그인 검증 후 권한확인
  const pageRole = to.path.slice(1,5)
  console.log(pageRole)
  if (pageRole == 'host'){
    if (auth == 'ROLE_USER'){
      alert('권한이 없습니다.')
      store.dispatch('SPINNERVIEW')
      return next('/')
    }
  }
  if (pageRole == 'mast'){
    if ((auth != 'ROLE_MASTER')){
      alert('권한이 없습니다.')
      store.dispatch('SPINNERVIEW')
      return next('/')
    }
  }
  store.dispatch('SPINNERVIEW')
  next()
})

export default router
