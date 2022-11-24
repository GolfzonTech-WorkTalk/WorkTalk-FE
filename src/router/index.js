import { createRouter, createWebHistory } from 'vue-router'
import { deleteCookie } from '@/utils/cookies'
import userRouter from './userRouter'
import hostRouter from './hostRouter'
import store from '@/store'
import jwt_decode from 'jwt-decode'

const routes = [
  ...userRouter,
  ...hostRouter,
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
    console.log('권한 : ', auth)
    console.log('닉네임 : ', sub)
    store.dispatch('NICKNAME', sub)
  }

  // 페이지 타입 검증
  const pageType = to.name.slice(0,4)
  console.log('pageType : ', pageType)
  // console.log(to.name.slice(0,4))
  store.dispatch('PAGETYPE', pageType)
  
  // 페이지 넘어갈시 메뉴탭 닫기
  store.dispatch('MENUTABCLOSE', false)
  
  // 로그인 여부 확인
  if (to.meta.auth && !store.getters.isLogin){
    console.log('로그인이 필요합니다.')
    alert('로그인이 필요합니다.')
    if (pageType === 'user'){
      next('/user/login')
    } else {
      next('/host/login')
    }
    return
  }
  
  // 로그인 검증 후 권한확인
  if (to.meta.auth && store.getters.isLogin){
    let roleCheck
    if (auth == 'ROLE_HOST'){
      roleCheck = 'host'
    } else {
      roleCheck = 'user'
    }
    if (pageType != roleCheck){
      alert('권한이 다름, 토큰 초기화')
      if (roleCheck == 'user'){
        store.dispatch('setlogoutUser')
        deleteCookie('token')
        router.push('/user/login')
      } else {
        store.dispatch('setlogoutUser')
        deleteCookie('token')
        router.push('/host/login')
      }
    }
  }
  next()
})

export default router
