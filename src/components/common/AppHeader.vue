<template>
  <header>
    <div v-if="MenuTabView" class="background" @click="menuTabBtn" />
    <div class="LogoAndSearch">
      <router-link to="/">
        <img src="@/assets/worktalk.png" alt="logo" class="logo">
      </router-link>
    </div>
    <div>
      <i class="fa-solid fa-bars fa-2x" @click="menuTabBtn" />
      <template v-if="(searchBoxMenuTabValid() == 'host')">
        <HostMenuTab v-if="MenuTabView" @menu-tab-btn="menuTabBtn" />
      </template>
      <template v-else-if="(searchBoxMenuTabValid() == 'master')">
        <master-menu-tab v-if="MenuTabView" @menu-tab-btn="menuTabBtn" />
      </template>
      <template v-else>
        <UserMenuTab v-if="MenuTabView" @menu-tab-btn="menuTabBtn" />
      </template>
    </div>
  </header>
</template>

<script>
import UserMenuTab from '@/components/user/UserMenuTab.vue'
import HostMenuTab from '@/components/host/HostMenuTab.vue'
import MasterMenuTab from '../master/MasterMenuTab.vue'
export default {
  components: {
    UserMenuTab,
    HostMenuTab,
    MasterMenuTab,
  },
  computed: {
    // 메뉴탭 상태변수
    MenuTabView(){
      return this.$store.state.MenuTabView
    },
    // 로고 이동 링크
    logoLink(){
      const userRole = this.$store.state.role
      if (userRole == 'ROLE_HOST'){
        return '/host'
      } else {
        return '/'
      }
    },
  },
  methods: {
    // 메뉴탭 버튼
    menuTabBtn(){
      this.$store.dispatch('MENUTABVIEW')
    },
    searchBoxMenuTabValid(){
      let result
      if (this.$store.state.role == 'ROLE_USER'){
        result = 'user'
      } else if (this.$store.state.role == 'ROLE_HOST'){
        result = 'host'
      } else if (this.$store.state.role == 'ROLE_MASTER'){
        result = 'master'
      }
      // console.log(result)
      return result
    },
  },
}
</script>

<style scoped>
header {
  display: flex;
  background: rgb(138, 138, 226);
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 10vh;
  padding: 0 2vw;
}
.LogoAndSearch{
  display: flex;
  align-items: center;
}
.background {
  position: fixed;
  background: rgba(0, 0, 0, 0.322);
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3;
}
.logo {
  width: 10vw;
}
</style>
