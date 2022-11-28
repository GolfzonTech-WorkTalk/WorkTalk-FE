<template>
  <div class="joinPage">
    <h1>워크토크 회원가입</h1>
    <form-join-vue />
  </div>
</template>

<script>
import FormJoinVue from '@/components/Form/FormJoin.vue'
export default {
  components: {
    FormJoinVue,
  },
}
</script>

<style scoped>
.joinPage {
  background: rgb(230, 230, 230);
  width: 100vw;
  height: 110vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
h1 {
  margin: 5vh 0;
}
</style>