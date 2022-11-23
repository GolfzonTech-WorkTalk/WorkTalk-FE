<template>
  <form class="loginForm" @submit.prevent="loginOk">
    <div class="loginFromItems">
      <input id="email" v-model="email" type="text" placeholder="이메일">
      <span v-if="!userEmailValid && email" class="warning">이메일 형식이 아닙니다.</span>
    </div>
    <div class="loginFromItems">
      <input id="pw" v-model="pw" type="text" placeholder="비밀번호">
    </div>
    <div class="loginFromItems">
      <button id="submit" :disabled="!userEmailValid || !pw || !email">
        로그인
      </button>
    </div>
    <div>
      <span>워크토크 회원이 아니십니까?</span>
      <template v-if="$store.state.userType === 'user'">
        <router-link to="/user/join">
          <span>회원가입</span>
        </router-link>
      </template>
      <template v-else>
        <router-link to="/host/join">
          <span>회원가입</span>
        </router-link>
      </template>
    </div>
  </form>
</template>

<script>
import {emailCheck} from '@/utils/emailCheck'
import jwt_decode from 'jwt-decode'
export default {
  data(){
    return {
      email: '',
      pw: '',
    }
  },
  computed: {
    userEmailValid(){
      return emailCheck(this.email)
    },
  },
  methods: {
    async loginOk(){
      const loginData = {
        email: this.email,
        pw: this.pw,
      }
      this.pwClear()
      console.log('loginData')
      console.log(loginData)
      const responce = await this.$store.dispatch('LOGIN', loginData)
      const decode = jwt_decode(responce.token)
      console.log(decode)
      if (decode.auth == 'ROLE_HOST'){
        this.$router.push('/host')
      } else {
        this.$router.push('/')
      }
    },
    pwClear(){
      this.pw = ''
    },
  },
}
</script>

<style scoped>
.loginForm {
  background: white;
  border-radius: 15px;
  height: 30vh;
  width: 40vw;
  padding: 3vw;
  text-align: center;
}
.loginFromItems {
  margin-bottom: 4vh;
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
.warning {
  font-weight: bold;
  color: brown;
  float: right;
}
</style>