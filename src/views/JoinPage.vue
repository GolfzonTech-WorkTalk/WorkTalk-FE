<template>
  <div class="joinPage">
    <modal-view v-if="modalViewCheck" @click="modalViewClick" />
    <template v-if="userTypeVerify">
      <h1>이용자 회원가입</h1>
    </template>
    <template v-else>
      <h1>공급자 회원가입</h1>
    </template>
    <form-join-vue />
  </div>
</template>

<script>
import FormJoinVue from '@/components/Form/FormJoin.vue'
import ModalView from '@/components/ModalView.vue'
export default {
  components: {
    FormJoinVue,
    ModalView,
  },
  computed: {
    userTypeVerify(){
      return this.$store.state.pageType === 'user' ? true : false
    },
    modalViewCheck(){
      return this.$store.state.modalView
    },
  },
  methods: {
    modalViewClick(){
      // console.log('클릭')
      this.$store.dispatch('MODALVIEWCLICK', false)
    },
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
  margin: 5vh;
}
</style>