<template>
  <div>
    <input v-model="result.roomId" type="text">
    <input v-model="result.checkInDate" type="text">
    <input v-model="result.checkOutDate" type="text">
    <input v-model="result.checkInTime" type="text">
    <input v-model="result.checkOutTime" type="text">
    <input v-model="result.spaceType" type="text">
    <p class="testBtn" @click="click">
      클릭
    </p>
    <div>
      <span @click="getCurrentPosition()">위치 좌표 확인</span>
      <div>{{ isPositionReady ? 'yes' : 'no' }}</div>
    </div>
  </div>
</template>

<script>
import {test} from '@/api/test.js'
export default {
  data(){
    return {
      result:{
        roomId:'1',
        checkInDate:'2022-12-17',
        checkOutDate:'2022-12-19',
        checkInTime:'12',
        checkOutTime:'17',
        spaceType:'1',
      },
      positionObj: {},
      isPositionReady: false,
    }
  },
  created(){
    this.$store.dispatch('SPINNERVIEW', false)
  },
  methods: {
    async click(){
      console.log(this.result)
      const response = await test(this.result)
      console.log(response)
    },
    getCurrentPosition(){
      if (!navigator.geolocation){
        this.setAlert('위치 정보를 찾을 수 없습니다.1')
      } else {
        navigator.geolocation.getCurrentPosition(this.getPositionValue, this.geolocationError)
      }
    },
    getPositionValue(val){
      this.positionObj.latitude = val.coords.latitude
      this.positionObj.longitude = val.coords.longitude
      this.isPositionReady = true
      this.setAlert('주소 확인 완료')
    },
    geolocationError(){
      this.setAlert('위치 정보를 찾을 수 없습니다.2')
    },
    setAlert(text){
      alert(text)
    },
  },
}
// 로그인 로직
/*
// 카카오 로그인
kakaoLogin(){
  const url = 'https://kauth.kakao.com/oauth/authorize?client_id=' +
      process.env.VUE_APP_KAKAO_JS_KEY +
      '&redirect_uri=' +
      process.env.VUE_APP_KAKAO_REDIRECT_URL +
      '&response_type=code&' +
      'scope=account_email profile_nickname'
  this.getKakaoAccount(url)
},
getKakaoAccount(url){
  const popupHeight = '500'
  const popupWidth = '500'
  let popupOptions = 'height=--popupHeight--,width=--popupWidth--,left=--popupX--,top=--popupY--,scrollbars=yes,resizable=yes'
  popupOptions = popupOptions.replace('--popupHeight--', popupHeight)
  popupOptions = popupOptions.replace('--popupWidth--', popupWidth)
  this.openPopup(url, popupOptions)
  return false
},
openPopup(url, options){
  window.open(
      url,
      '_blank',
      options,
  )
},

kakaoLogin(){
  // console.log(window.Kakao)
  window.Kakao.Auth.login({
    scope: 'profile_nickname, account_email',
    success: this.getKakaoAccount,
  })
},
getKakaoAccount(){
  window.Kakao.API.request({
    url:'/v2/user/me',
    success: res => {
      const kakao_account = res.kakao_account
      const nickname = kakao_account.profile.nickname
      const email = kakao_account. email
      console.log(res)
      console.log('kakao_account',kakao_account)
      console.log('nickname',nickname)
      console.log('email',email)
      let kakaoLogin = {
        'name':nickname+'_'+res.id,
        'pw':res.id,
        'email':email,
        'member':true, // 회원이면 true 아니면 false 넘기기
      }
      let responce = mailFind(email)
      console.log(responce)
      if (responce.data == null || responce.status == 'kakao'){
        console.log(kakaoLogin)
        console.log('카카오회원 카카오 로그인실행')
      } else if (responce.status == 'worktalk'){
        console.log('워크토크회원 이미가입된 메세지 출력')
      }
    },
    fail : error => {
      console.log(error)
    },
  })
},
*/
</script>

<style scoped>
.testBtn{
  cursor: pointer;
}
</style>