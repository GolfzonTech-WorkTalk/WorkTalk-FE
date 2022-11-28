<template>
  <div class="loginPage">
    <h1>워크토크 로그인</h1>
    <form-login />
  </div>
</template>

<script>
import FormLogin from '@/components/Form/FormLogin.vue'
export default {
  components: {
    FormLogin,
  },
}
</script>

<style scoped>
.loginPage {
  background: rgb(230, 230, 230);
  width: 100vw;
  height: 110vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
h1 {
  margin: 5vh;
}
</style>