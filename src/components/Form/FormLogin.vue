<template>
  <div>
    <div v-if="findBoxType != ''" class="background" />
    <div v-if="findBoxType == 'email'" class="findBoxEmail">
      <i class="fa-solid fa-xmark findBoxClose fa-lg" @click="findBoxClose" />
      <input v-model="findEmail" class="findEmail" type="text" placeholder="가입한 이메일을 입력해주세요.">
      <input class="findEmailBtn" type="button" value="조회" @click="emailVeificaionSend('email')">
      <template v-if="(emailVerificationCodeCheck == 200)">
        <p class="approve">
          가입된 이메일입니다.
        </p>
      </template>
      <template v-if="(emailVerificationCodeCheck == 500)">
        <p class="warning">
          가입되지 않은 이메일입니다.
        </p>
      </template>
    </div>
    <div v-if="findBoxType == 'pw'" class="findBoxPw">
      <i class="fa-solid fa-xmark findBoxClose fa-lg" @click="findBoxClose" />
      <input v-model="findEmail" class="findEmail" type="text" placeholder="가입한 이메일을 입력해주세요.">
      <input class="findEmailBtn" type="button" value="임시비밀번호발급" @click="emailVeificaionSend('pw')">
      <template v-if="(emailVerificationCodeCheck == 200)">
        <p class="approve">
          임시비밀번호가 발급되었습니다.
        </p>
      </template>
      <template v-if="(emailVerificationCodeCheck == 500)">
        <p class="warning">
          가입되지 않은 이메일입니다.
        </p>
      </template>
    </div>
    <form class="loginForm" @submit.prevent="loginCkeck">
      <div class="loginFromItems">
        <input id="email" v-model="email" type="text" placeholder="이메일">
        <span v-if="!userEmailValid && email" class="warning">이메일 형식이 아닙니다.</span>
      </div>
      <div class="loginFromItems">
        <input id="pw" v-model="pw" type="password" placeholder="비밀번호">
      </div>
      <div class="loginFromItems">
        <button id="submit">
          로그인
        </button>
      </div>
      <div class="helpBox">
        <span @click="findBoxOpen('email')">이메일확인</span>
        <span @click="findBoxOpen('pw')">비밀번호찾기</span>
        <router-link to="/join">
          <span>회원가입</span>
        </router-link>
      </div>
      <div class="kakaoLogin">
        <p>또는</p>
        <a @click="kakaoLogin()">
          <img src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg">
        </a>
      </div>
    </form>
  </div>
</template>

<script>
import { mailFind, pwFind } from '@/api/auth.js'
import {emailCheck} from '@/utils/emailCheck'
import jwt_decode from 'jwt-decode'
export default {
  data(){
    return {
      email: '',
      pw: '',
      findEmail:'',
      emailVerificationCodeCheck:'',
      findBoxType:'',
    }
  },
  computed: {
    userEmailValid(){
      return emailCheck(this.email)
    },
  },
  created(){
    console.log()
    if (this.$route.query.code){
      this.kakaoTokenCall()
    }
  },
  methods: {
    // 로그인검증
    loginCkeck(){
      let message = ''
      if (!this.email){
        message = '이메일을 입력해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (!this.userEmailValid){
        message = '이메일 형식으로 입력해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (!this.pw){
        message = '비밀번호를 입력해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        this.loginOk()
      }
    },
    // 로그인
    async loginOk(){
      const loginData = {
        email: this.email,
        pw: this.pw,
      }
      this.pwClear()
      // console.log('loginData')
      // console.log(loginData)
      try {
        const responce = await this.$store.dispatch('LOGIN', loginData)
        const decode = jwt_decode(responce.token)
        // console.log(decode)
        if (decode.auth == 'ROLE_HOST'){
          this.$router.push('/host')
        } else if (decode.auth == 'ROLE_MASTER'){
          this.$router.push('/master')
        } else {
          this.$router.push('/')
        }
      } catch (error){
        // console.log(error)
        let message = '이메일과 비밀번호를 확인해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      }
    },
    pwClear(){
      this.pw = ''
    },
    // 찾기 박스열기
    findBoxOpen(value){
      this.findBoxType = value
    },
    findBoxClose(){
      this.findBoxType = ''
      this.findEmail = ''
      this.emailVerificationCodeCheck=''
    },
    // 이메일확인
    async emailVeificaionSend(value){
      this.$store.dispatch('SPINNERVIEW', true)
      try {
        let responce
        if (value == 'pw'){
          responce = await pwFind(this.findEmail)
        } else {
          responce = await mailFind(this.findEmail)
        }
        console.log(responce)
        this.emailVerificationCodeCheck = responce.status
      } catch (error){
        console.log(error)
        this.emailVerificationCodeCheck = error.request.status
      }
      this.$store.dispatch('SPINNERVIEW', false)
    },
    // 카카오 로그인
    kakaoLogin(){
      window.Kakao.Auth.authorize({
        // redirectUri:'http://localhost:8081/login',
        // redirectUri:'http://localhost:8100/user/kakao/callback',
        redirectUri:'http://15.165.247.125:8100/user/kakao/callback',
      })
    },
    async kakaoTokenCall(){
      try {
        const code = this.$route.query.code
        await this.$store.dispatch('KAKAOLOGIN', code)
        this.$router.push('/')
      } catch (error){
        console.log(error)
      }
    },
  },
}
</script>

<style scoped>
.background{
  position: absolute;
  background: rgba(0, 0, 0, 0.137);
  border-radius: 15px;
  height: 43.5vh;
  width: 46vw;
}
.loginForm {
  background: white;
  border-radius: 15px;
  height: 35vh;
  width: 40vw;
  padding: 3vw;
  text-align: center;
}
.loginFromItems {
  margin-bottom: 3vh;
}
#email, #pw {
  height: 5vh;
  width: 39vw;
  border-radius: 5px;
  padding-left: 1vw;
}
#submit {
  background: rgb(103, 139, 218);
  color: white;
  font-weight: bold;
  font-size: 1.2em;
  letter-spacing: 1rem;
  height: 5vh;
  width: 40vw;
  border-radius: 5px;
  cursor: pointer;
}
.approve{
  font-weight: bold;
  color: rgb(42, 61, 165);
  float: right;
}
.warning {
  font-weight: bold;
  color: brown;
  float: right;
}
/* 이메일,비밀번호찾기 */
.helpBox span{
  padding: 0 1vw;
  cursor: pointer;
}
.helpBox span:not(:last-child){
  border-right: 2px solid gray;
}
.findBoxEmail, .findBoxPw{
  background: white;
  border-radius: 15px;
  position: absolute;
  top: 30vh;
  padding: 3vh 2vw;
}
.findBoxEmail{
  left: 38vw;
  height: 10vh;
  width: 20vw;
}
.findBoxPw{
  left: 35vw;
  height: 10vh;
  width: 25vw;
}
.findEmail{
  height: 5vh;
  width: 15vw;
  border-radius: 5px;
  padding-left: 1vw;
  margin-right: 0.5vw;
}
.findEmailBtn{
  border-radius: 5px;
  background: white;
  cursor: pointer;
  padding: 1vh 0.5vw;
}
.findEmailBtn:hover{
  color: white;
  background: rgb(153, 153, 218);
}
.findBoxClose{
  position: absolute;
  top: 2vh;
  right: 1vw;
  cursor: pointer;
}
.kakaoLogin{
  margin-top: 1vh;
  font-size: 0.9rem;
}
.kakaoLogin p {
  color: gray;
}
.kakaoLogin img{
  margin-top: 1vh;
  width: 15vw;
  cursor: pointer;
}
</style>