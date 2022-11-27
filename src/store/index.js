import { createStore } from 'vuex'
import { getTokenFromCookie, saveTokenToCookie } from '@/utils/cookies'
import jwt_decode from 'jwt-decode'
//import { loginMember } from '@/api/auth'

export default createStore({
  state: {
    // 메뉴탭 관리 변수
    MenuTabView: false,
    token: getTokenFromCookie() || '',
    // 닉네임
    nickName:'',
    // 접속한 사용자의 권한
    role: '',
    roleCheck: '',
    // 모달창 관리 변수
    modalView: false,
    modalMessage: '',
  },
  getters: {
    // 로그인여부 확인
    isLogin(state){
      return state.token !== ''
    },
  },
  mutations: {
    // 메뉴탭 관리
    setMenuTabView(state){
      state.MenuTabView = !state.MenuTabView
    },
    setMenuTabClose(state, close){
      state.MenuTabView = close
    },
    // 로그인 사용자의 토큰
    setToken(state, token){
      state.token = token
    },
    // 로그인 사용자의 닉네임
    setNickName(state, nickName){
      state.nickName = nickName
    },
    // 로그인 사용자의 권한
    setRole(state, role){
      state.role = role
    },
    // 모달창
    setModalView(state, click){
      state.modalView = click
    },
    setModalMessage(state, msg){
      state.modalMessage = msg
    },
    // 로그아웃
    setlogoutUser(state){
      state.token = ''
      state.nickName = ''
      state.role = ''
    },
  },
  actions: {
    // 메뉴탭 관리
    MENUTABVIEW(context){
      context.commit('setMenuTabView')
    },
    MENUTABCLOSE(context, close){
      context.commit('setMenuTabClose', close)
    },
    // 닉네임 새로고침 방지
    NICKNAME(context, nickName){
      context.commit('setNickName', nickName)
    },
    // 주소에 따른 userType 관리
    ROLETYPE(context, role){
      // console.log('pageType : ' + pageType)
      context.commit('setRole', role)
    },
    // 로그인 처리
    // async LOGIN(context, loginData){
    LOGIN(context, loginData){
      console.log(loginData)
      // try {
      //   const { data } = await loginMember(loginData) // api
      //   console.log(data)
      //   const decode = jwt_decode(data.token)
      //   context.commit('setToken', data.token)
      //   context.commit('setNickName', decode.sub)
      //   context.commit('setRole', decode.auth)
      //   saveTokenToCookie(data.token)
      //   return data
      // } catch (error){
      //   console.log(error)
      // }
      // 유저더미
      // const dumydata = {
      //   "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiLsgqzsmqnsnpAiLCJhdXRoIjoiUk9MRV9VU0VSIiwiZXhwIjoxNjY5Mjg5MDc5fQ.6TrAQK1Ts5XFtwrwjTsFTrgdUk4BcwT8WNCt8GUaOrQJTRFzBy01ttkwJC0JbO2IZxr1eKh590bZbgeU151_-Q",
      // }
      // 호스트더미
      const dumydata = {
        "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiLsgqzsmqnsnpAiLCJhdXRoIjoiUk9MRV9IT1NUIiwiZXhwIjoxNjY5Mjg5MDc5fQ.sVyrbk8A9lkSh_RCxWPKfBPtts3wrw6jaDZwyGy6UnPEcinXpPeQtJoDr5qq-0pY1SxDHTQ1EG3VIyNhZjRvEg",
      }
      const decode = jwt_decode(dumydata.token)
      context.commit('setToken', dumydata.token)
      context.commit('setNickName', decode.sub)
      context.commit('setRole', decode.auth)
      saveTokenToCookie(dumydata.token)
      return dumydata
    },
    // 모달찰 끄기
    MODALVIEWCLICK(context, click){
      context.commit('setModalView', click)
    },
    MODALMESSAGE(context, msg){
      // console.log(msg)
      context.commit('setModalMessage', msg)
    },
  },
  modules: {
  },
})
