<template>
  <div class="App">
    <AppHeader />
    <modal-view v-if="modalViewCheck" @click="modalViewClick" />
    <div class="AppContent">
      <router-view />
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import ModalView from '@/components/ModalView.vue'
export default {
  components: {
    AppHeader,
    AppFooter,
    ModalView,
  },
  computed: {
    modalViewCheck(){
      return this.$store.state.modalView
    },
  },
  methods: {
    modalViewClick(){
      this.$store.dispatch('MODALVIEWCLICK', false)
    },
  },
}
</script>

<style>
@import './css/common.css';
.AppContent {
  position: relative;
  height: 110vh;
}
.modalView {
  position: fixed;
  top: 0;
}
</style>
