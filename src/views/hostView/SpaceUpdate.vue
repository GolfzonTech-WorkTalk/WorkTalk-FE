<template>
  <div class="backgound">
    <space-update-from />
  </div>
</template>

<script>
import SpaceUpdateFrom from '@/components/host/SpaceUpdateForm.vue'
export default {
  components: {
    SpaceUpdateFrom,
  },
  created(){
    this.$store.dispatch('SPINNERVIEW')
  },
}
</script>

<style scoped>
.backgound {
  position: relative;
  background: rgb(230, 230, 230);
}
</style>