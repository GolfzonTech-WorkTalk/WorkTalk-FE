import { createStore } from 'vuex'
import { getTokenFromCookie, saveTokenToCookie } from '@/utils/cookies'
import jwt_decode from 'jwt-decode'
import { loginMember } from '@/api/auth'

export default createStore({
  state: {
    // 메뉴탭 관리 변수
    MenuTabView: false,
    token: '' || getTokenFromCookie(),
    // 닉네임
    nickName:'',
    // 접속한 사용자의 권한
    role: '',
    roleCheck: '',
    // 모달창 관리 변수
    modalView: false,
    modalMessage: '',
    // 스피너 관리 변수
    spinnerView: false,
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
    // 스피너
    setSpinnerView(state, status){
      state.spinnerView = status
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
    async LOGIN(context, loginData){
      // console.log(loginData)
      try {
        const { data } = await loginMember(loginData) // api
        // console.log(data)
        const decode = jwt_decode(data.token)
        context.commit('setToken', data.token)
        context.commit('setNickName', decode.sub)
        context.commit('setRole', decode.auth)
        saveTokenToCookie(data.token)
        return data
      } catch (error){
        console.log(error)
      }
    },
    // 로그인 처리
    async KAKAOLOGIN(context, token){
      try {
        const decode = jwt_decode(token)
        context.commit('setToken', token)
        context.commit('setNickName', decode.sub)
        context.commit('setRole', decode.auth)
        saveTokenToCookie(token)
        return token
      } catch (error){
        console.log(error)
      }
    },
    // 모달찰 끄기
    MODALVIEWCLICK(context, click){
      context.commit('setModalView', click)
    },
    MODALMESSAGE(context, msg){
      // console.log(msg)
      context.commit('setModalMessage', msg)
    },
    // 스피너
    SPINNERVIEW(context, status){
      context.commit('setSpinnerView', status)
    },
  },
  modules: {
  },
})
