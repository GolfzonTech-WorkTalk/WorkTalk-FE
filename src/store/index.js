import { createStore } from 'vuex'
import { getEmailFromCookie, getTokenFromCookie, getUserTypeFromCookie, saveTokenToCookie, saveEmailToCookie, saveUserTypeToCookie } from '@/utils/cookies'
// import { loginMember } from '@/api/auth'

export default createStore({
  state: {
    // 메뉴탭 관리 변수
    MenuTabView: false,
    // 접속한 사용자의 유형
    pageType: '',
    // 로그인한 정보 및 검증
    member_id:'',
    email: getEmailFromCookie() || '',
    token: getTokenFromCookie() || '',
    userType: getUserTypeFromCookie() || '',
    // 모달창
    modalView: false,
    modalMessage: '',
  },
  getters: {
    // 로그인여부 확인
    isLogin(state){
      return state.email !== ''
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
    // 주소에 따른 userType 관리
    setPageType(state, pageType){
      state.pageType = pageType
    },
    // 로그인 처리
    setEmail(state, email){
      state.email = email
    },
    setToken(state, token){
      state.token = token
    },
    setUserType(state, userType){
      state.userType = userType
    },
    // 모달창
    setModalView(state, click){
      state.modalView = click
    },
    setModalMessage(state, msg){
      state.modalMessage = msg
    },
    setlogoutUser(state){
      state.email = ''
      state.token = ''
      state.member_id = ''
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
    // 주소에 따른 userType 관리
    USERTYPE(context, pageType){
      // console.log('pageType : ' + pageType)
      context.commit('setPageType', pageType)
    },
    // 로그인 처리
    // async LOGIN(context, loginData){
    LOGIN(context, loginData){
      /*
      const { data } = await loginMember(loginData) // api
      console.log(data.user.username)
      console.log(data.token)
      context.commit('setUser', data.user.username)
      context.commit('setToken', data.token)
      saveAuthToCookie(data.token)
      saveUserToCookie(data.user.username)
      return data
      */
      // 토큰 및 유저타입 탭에서 받기
      // const dumyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlciIsImVtYWlsIjoiYUBhLmNpbSIsInVzZXJUeXBlIjoidXNlciJ9.sye5pUWmTexRwqjghJaiJOBxdN2r8TbrvfawBqqD7b4'
      const dumyToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlciIsImVtYWlsIjoiYUBhLmNpbSIsImVtYWlsMTIzMTQxMjMxMjQxMjMiOiJhIiwidXNlclR5cGUiOiJ1c2VyIn0.cJUvgR93zvNWUjZbjCWlhZzfz3VuI_rtlL2hh-hywRXB83PfVcqWpQ32xtjlGNVLwpj3XqGpcpDPWTtq6srgvw'
      const dumyUserType = 'user'
      context.commit('setEmail', loginData.email)
      context.commit('setToken', dumyToken)
      context.commit('setUserType', dumyUserType)
      saveEmailToCookie(loginData.email)
      saveTokenToCookie(dumyToken)
      saveUserTypeToCookie(dumyUserType)
      const data = {
        email: loginData.email,
        userType: dumyUserType,
      }
      return data
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
