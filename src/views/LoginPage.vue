<template>
  <div class="loginPage">
    <template v-if="userTypeVerify">
      <h1>이용자 로그인</h1>
    </template>
    <template v-else>
      <h1>공급자 로그인</h1>
    </template>
    <form-login />
  </div>
</template>

<script>
import FormLogin from '@/components/Form/FormLogin.vue'
export default {
  components: {
    FormLogin,
  },
  computed: {
    userTypeVerify(){
      return this.$store.state.pageType === 'user' ? true : false
    },
  },
}
</script>

<style scoped>
.loginPage {
  background: rgb(230, 230, 230);
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
h1 {
  margin: 5vh;
}
</style>