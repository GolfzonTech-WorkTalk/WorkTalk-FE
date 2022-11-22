import { createRouter, createWebHistory } from 'vue-router'
import userRouter from './userRouter'
import hostRouter from './hostRouter'
import store from '@/store'

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
  // 페이지 타입 검증
  const pageType = to.name.slice(0,4)
  console.log(pageType)
  // console.log(to.name.slice(0,4))
  store.dispatch('USERTYPE', pageType)
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
  next()
})

export default router
