<template>
  <div class="App">
    <AppHeader />
    <loading-spinner v-if="spinnerViewCheck" />
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
import LoadingSpinner from './components/common/LoadingSpinner.vue'
export default {
  components: {
    AppHeader,
    AppFooter,
    ModalView,
    LoadingSpinner,
  },
  computed: {
    modalViewCheck(){
      return this.$store.state.modalView
    },
    spinnerViewCheck(){
      return this.$store.state.spinnerView
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
