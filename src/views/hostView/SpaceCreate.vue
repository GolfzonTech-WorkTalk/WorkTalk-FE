<template>
  <div class="backgound">
    <space-create-from />
  </div>
</template>

<script>
import SpaceCreateFrom from '@/components/host/SpaceCreateForm.vue'
export default {
  components: {
    SpaceCreateFrom,
  },
}
</script>

<style scoped>
.backgound {
  position: relative;
  background: rgb(230, 230, 230);
}
</style>