<template>
  <div class="joinPage">
    <template v-if="routerName == 'join'">
      <h1>워크토크 회원가입</h1>
      <form-join-vue />
    </template>
    <template v-else>
      <h1>워크토크 마스터계정 생성</h1>
      <master-create />
    </template>
  </div>
</template>

<script>
import MasterCreate from '@/components/master/MasterCreate.vue'
import FormJoinVue from '@/components/Form/FormJoin.vue'
export default {
  components: {
    FormJoinVue,
    MasterCreate,
  },
  data(){
    return {
      routerName: this.$route.name,
    }
  },
  created(){
    this.$store.dispatch('SPINNERVIEW', false)
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