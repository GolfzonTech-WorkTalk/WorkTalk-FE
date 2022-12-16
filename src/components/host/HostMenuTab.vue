<template>
  <div class="menuTab">
    <div class="menuTabUserInfo">
      <i class="fa-solid fa-xmark menuTabClose fa-lg" @click="menuTabBtn" />
      <i class="fa-solid fa-right-from-bracket fa-lg logout" @click="logout" />
      <router-link to="/profile">
        <span>{{ nickName }}</span>
      </router-link>
    </div>
    <div class="menuTabServicecenter">
      <div>
        <router-link to="/host/reservation">
          <i class="fa-regular fa-calendar-check fa-lg" />
          <span>예약관리</span>
        </router-link>
      </div>
      <div>
        <router-link to="/host/QnAReview">
          <i class="fa-regular fa-comments fa-lg" />
          <span>후기 / QnA 관리</span>
        </router-link>
      </div>
      <div>
        <router-link to="/host/payment">
          <i class="fa-solid fa-credit-card fa-lg" />
          <span>정산관리</span>
        </router-link>
      </div>
      <div>
        <router-link to="/host/customercenter">
          <i class="fa-solid fa-headset fa-lg" />
          <span>1:1문의</span>
        </router-link>
      </div>
    </div>
    <div class="menuTabHostpagemove">
      <span @click="userPageMove">
        공간 관리페이지로 이동
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
  methods: {
    menuTabBtn(){
      this.$emit('menu-tab-btn')
    },
    userPageMove(){
      this.$router.push('/host')
    },
    logout(){
      this.$store.commit('setlogoutUser')
      deleteCookie('token')
      this.$store.dispatch('MENUTABCLOSE', false)
      this.$router.push('/')
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