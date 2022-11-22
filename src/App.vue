<template>
  <div class="App">
    <AppHeader />
    <div class="AppContent">
      <router-view />
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
export default {
  components: {
    AppHeader,
    AppFooter,
  },
}
</script>

<style>
@import './css/common.css';
.AppContent {
  height: 100vh;
}
</style>
