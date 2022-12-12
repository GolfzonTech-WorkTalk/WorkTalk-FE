<template>
  <div class="menuTab">
    <div class="menuTabUserInfo">
      <i class="fa-solid fa-xmark menuTabClose fa-lg" @click="menuTabBtn" />
      <template v-if="loginOK">
        <i class="fa-solid fa-right-from-bracket fa-lg logout" @click="logout" />
        <router-link to="/profile">
          <span>{{ nickName }}</span>
        </router-link>
      </template>
      <template v-else>
        <router-link to="/login">
          <span>로그인/회원가입</span>
        </router-link>
      </template>
    </div>
    <div class="menuTabServicecenter">
      <div>
        <router-link to="/user/reservation">
          <i class="fa-regular fa-calendar-check fa-lg" />
          <span>예약리스트</span>
        </router-link>
      </div>
      <div>
        <router-link to="/user/QnAReview">
          <i class="fa-regular fa-comments fa-lg" />
          <span>이용후기 / QnA</span>
        </router-link>
      </div>
      <div>
        <router-link to="/user/payment">
          <i class="fa-solid fa-credit-card fa-lg" />
          <span>결제내역 / 마일리지</span>
        </router-link>
      </div>
      <div>
        <router-link to="/user/customercenter">
          <i class="fa-solid fa-headset fa-lg" />
          <span>1:1문의</span>
        </router-link>
      </div>
    </div>
    <div class="menuTabHostpagemove">
      <span @click="hostPageMove">
        공급자로 로그인
        <i class="fa-solid fa-arrow-right" />
      </span>
    </div>
  </div>
</template>

<script>
import { deleteCookie } from '@/utils/cookies'
export default {
  emits: {'menu-tab-btn': null},
  data(){
    return {
      nickName: this.$store.state.nickName,
    }
  },
  computed: {
    loginOK(){
      return this.$store.state.token
    },
  },
  methods: {
    // 메뉴탭 관리
    menuTabBtn(){
      this.$emit('menu-tab-btn')
    },
    hostPageMove(){
      this.$store.commit('setlogoutUser')
      deleteCookie('token')
      this.$store.dispatch('MENUTABCLOSE', false)
      this.$router.push('/login')
    },
    logout(){
      this.$store.commit('setlogoutUser')
      deleteCookie('token')
      this.$store.dispatch('MENUTABCLOSE', false)
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
.menuTab {
  background: white;
  width: 30vw;
  position: fixed;
  text-align: center;
  top: 0;
  right: 0;
  font-weight: bold;
  font-size: 1.5rem;
  border-left: 1px solid gray;
  z-index: 3;
}
.menuTabClose {
  position: absolute;
  top: 2%;
  left: 2%;
}
.logout {
  position: absolute;
  top: 2%;
  right: 2%;
}
.menuTabUserInfo {
  background: rgb(138, 138, 226);
  color: white;
  height: 15vh;
  line-height: 15vh;
  border-bottom: 1px solid gray;
}
.menuTabServicecenter {
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  height: 70vh;
  text-align: left;
}
.menuTabServicecenter div {
  height: 17.5vh;
  line-height: 17.5vh;
}
.menuTabServicecenter div:not(:last-child) {
  border-bottom: 1px solid gray;
}
.menuTabServicecenter i {
  margin-left: 3vw;
  margin-right: 1vw;
}
.menuTabHostpagemove {
  height: 15vh;
  background: rgb(200, 218, 243);
  align-items: center;
  line-height: 15vh;
}
span:hover {
  color: rgb(81, 81, 209);
}
</style>