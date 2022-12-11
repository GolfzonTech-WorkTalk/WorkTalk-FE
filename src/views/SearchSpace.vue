<template>
  <div class="searchContainer">
    <div class="searchTermsContainer">
      <search-box @search-submit="searchSubmit" />
    </div>
    <div class="searchSpaceContainer">
      <search-space ref="searchSpaceAPI" />
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
  methods:{
    async searchSubmit(link){
      await this.$router.push('/searchSpace/'+link)
      this.$refs.searchSpaceAPI.reservationDataCall()
    },
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