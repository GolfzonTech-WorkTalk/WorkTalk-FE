<template>
  <div class="spaceAllContainer">
    <div class="moreButton">
      <router-link to="/searchSpace/AllType/AllName/AllRegions/noDate/noDate/noTime/noTime">
        <span>more</span>
      </router-link>
    </div>
    <div class="spaceItems">
      <search-space-one v-for="item in spaceItems" :key="item" :item="item" />
    </div>
  </div>
</template>

<script>
import searchSpaceOne from '@/components/searchSpace/spaceModule.vue'
import { spaceSearch } from '@/api/user.js'
export default {
  components:{
    searchSpaceOne,
  },
  data(){
    return {
      spaceItems: '',
    }
  },
  // async
  created(){
    this.reservationDataCall()
  },
  methods: {
    // 데이터 API로 불러오기
    async reservationDataCall(){
      try {
        const responce = await spaceSearch(0,'','','','','','','')
        this.spaceItems = responce.data.data
      } catch (error){
        console.log(error)
      }
      this.$store.dispatch('SPINNERVIEW', false)
    },
  },
}
</script>

<style scoped>
/* 데이터 디자인 */
.spaceAllContainer {
  position: relative;
  display: flex;
  justify-content: center;
  width: 78vw;
  height: 80vh;
}
.spaceItems {
  font-size: 0.9rem;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 72vw;
  height: 80vh;
}
/* more버튼 */
.moreButton{
  position: absolute;
  right: 5vw;
  top: -3vh;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}
</style>