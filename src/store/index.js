import { createStore } from 'vuex'
import { getTokenFromCookie, saveTokenToCookie } from '@/utils/cookies'
import jwt_decode from 'jwt-decode'
// import { loginMember } from '@/api/auth'

export default createStore({
  state: {
    // 메뉴탭 관리 변수
    MenuTabView: false,
    // 접속한 사용자의 유형
    pageType: '',
    // 닉네임
    nickName:'',
    token: getTokenFromCookie() || '',
    // email: getEmailFromCookie() || '',
    // userType: getUserTypeFromCookie() || '',
    // 모달창
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
    // 주소에 따른 userType 관리
    setPageType(state, pageType){
      state.pageType = pageType
    },
    // 로그인 처리
    setToken(state, token){
      state.token = token
    },
    setNickName(state, nickName){
      state.nickName = nickName
    },
    // setEmail(state, email){
    //   state.email = email
    // },
    // setUserType(state, userType){
    //   state.userType = userType
    // },
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
      state.nickName = ''
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
    PAGETYPE(context, pageType){
      // console.log('pageType : ' + pageType)
      context.commit('setPageType', pageType)
    },
    // 로그인 처리
    // async LOGIN(context, loginData){
    LOGIN(context, loginData){
      console.log(loginData)
      // const { data } = await loginMember(loginData) // api
      // console.log(data)
      // context.commit('setToken', data.token)
      // saveTokenToCookie(data.token)
      // return data
      
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
