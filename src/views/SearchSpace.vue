<template>
  <div class="searchContainer">
    <div class="searchTermsContainer">
      <search-box />
    </div>
    <div class="searchSpaceContainer">
      <search-space />
    </div>
  </div>
</template>

<script>
import SearchBox from '@/components/searchSpace/searchBox.vue'
import SearchSpace from '@/components/searchSpace/searchSpace.vue'
export default {
  components:{
    SearchBox,
    SearchSpace,
  },
}
</script>

<style scoped>
.searchTermsContainer{
  height: 17vh;
  border-bottom: 1px solid gray;
}
.searchSpaceContainer{
  height: 90vh;
  display: flex;
  justify-content: center;
}
</style>