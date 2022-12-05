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
    <div class="menuTabUserService">
      <ul>
        <router-link to="/user/reservation">
          <li>
            <i class="fa-regular fa-calendar-check fa-2x" />
            <p>예약리스트</p>
          </li>
        </router-link>
        <router-link to="/user/QnAReview">
          <li>
            <i class="fa-regular fa-comments fa-2x" />
            <p>이용후기<br>QnA</p>
          </li>
        </router-link>
        <router-link to="/user/payment">
          <li>
            <i class="fa-solid fa-credit-card fa-2x" />
            <p>결제내역<br>마일리지</p>
          </li>
        </router-link>
      </ul>
    </div>
    <div class="menuTabServicecenter">
      <div>
        <router-link to="/user/customercenter">
          <span>1:1문의</span>
        </router-link>
      </div>
      <div>
        <span>공지사항</span>
      </div>
      <div>
        <span>도움말</span>
      </div>
      <div>
        <span>서비스정보</span>
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
.menuTabUserService {
  height: 15vh;
  width: 100%;
  border-bottom: 1px solid gray;
}
.menuTabUserService ul {
  display: flex;
  list-style: none;
  justify-content: space-around;
  font-size: 1.2rem;
}
.menuTabUserService ul li {
  padding-top: 2vh;
}
.menuTabServicecenter {
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  height: 55vh;
}
.menuTabServicecenter div {
  height: 13vh;
  line-height: 13vh;
}
.menuTabServicecenter div:not(:last-child) {
  border-bottom: 1px solid gray;
}
.menuTabHostpagemove {
  height: 15vh;
  background: rgb(200, 218, 243);
  align-items: center;
  line-height: 17vh;
}
li:hover, span:hover {
  color: rgb(81, 81, 209);
}
</style>