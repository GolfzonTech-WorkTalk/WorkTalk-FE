<template>
  <div class="spaceItems" @scroll="listScroll">
    <span class="moveTopBtn" @click="moveTop">TOP</span>
    <search-space-one v-for="item in spaceItems" :key="item" :item="item" />
  </div>
</template>

<script>
import searchSpaceOne from '@/components/searchSpace/spaceModule.vue'
// import {spaceSearch} from '@/api/user.js'
import { spaceDumy } from '@/utils/dummy/dummy.js'
export default {
  components:{
    searchSpaceOne,
  },
  data(){
    return {
      spaceItems: [],
      pageNum:'0',
      scroll:'0',
      spaceType:'',
      spaceName:'',
      address:'',
    }
  },
  created(){
    this.reservationDataCall()
  },
  methods: {
    // 데이터 API로 불러오기
    async reservationDataCall(){
      this.routerCheck()
      // console.log(this.pageNum,this.spaceType,this.spaceName,this.address)
      try {
        const response = await spaceDumy
        // const response = await spaceSearch(this.pageNum,this.spaceType,this.spaceName,this.address)
        this.spaceItems = response
      } catch (error){
        console.log(error)
      }
      this.$store.dispatch('SPINNERVIEW', false)
    },
    // 주소검증
    routerCheck(){
      this.spaceType = this.$route.params.spaceType
      this.spaceName = this.$route.params.spaceName
      this.address = this.$route.params.address
      if (this.spaceType == 'AllType'){
        this.spaceType = ''
      }
      if (this.spaceName == 'AllName'){
        this.spaceName = ''
      }
      if (this.address == 'AllRegions'){
        this.address = ''
      }
    },
    // 스크롤체크
    listScroll(e){
      const { scrollHeight, scrollTop, clientHeight } = e.target
      console.log(scrollHeight, scrollTop, clientHeight)
      console.log(scrollHeight <= scrollTop + clientHeight + 50)
      const isBottom = (scrollHeight <= scrollTop + clientHeight + 50)
      // const isAtTheBottom = scrollHeight === scrollTop + clientHeight
      // // 일정 한도 밑으로 내려오면 함수 실행
      if (isBottom){
        this.pageNum ++
        this.$store.dispatch('SPINNERVIEW', true)
        setTimeout(() => this.reservationDataADD(this.pageNum), 1000)
      }
    },
    async reservationDataADD(pageNum){
      console.log(pageNum)
      const responce = await spaceDumy
      for (let i = 0; i < responce.length; i++){
        this.spaceItems.push(responce[i])
      }
      this.pageNum ++
      this.$store.dispatch('SPINNERVIEW', false)
    },
  },
}
</script>

<style scoped>
.spaceItems {
  font-size: 0.9rem;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 100vw;
  padding: 0 13vw;
  height: 93vh;
  overflow-y: scroll;
}
.spaceItems::-webkit-scrollbar {
  display: none;
}
.moveTopBtn{
  position: absolute;
  bottom: 3vh;
  right: 10vw;
}
</style>