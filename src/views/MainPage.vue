<template>
  <div class="mainPage">
    <router-link to="/map/AllType/AllName/AllRegions">
      <i class="mapIcon fa-solid fa-map-location-dot fa-3x" />
    </router-link>
    <div class="spaceType">
      <div class="spaceTypeItems">
        <div v-for="(item, index) in spaceTypeItems" :key="index" class="spaceTypeItem">
          <router-link :to="searchSpacelink(item.value)">
            <img class="spaceTypeIcon" :src="require(`@/assets/${item.img}`)" alt="icon">
            <p>{{ item.name }}</p>
          </router-link>
        </div>
      </div>
      <p>공간의 종류를 선택해주세요.</p>
    </div>
    <p class="spaceTile">
      {{ thisAddressFind }} 추천
    </p>
    <div class="spaceAll">
      <recommend-space @address:find="addressFind" />
    </div>
    <p class="spaceTile">
      전체공간
    </p>
    <div class="spaceAll">
      <main-space />
    </div>
  </div>
</template>

<script>
import RecommendSpace from '@/components/user/RecommendSpace.vue'
import MainSpace from '@/components/user/MainSpace.vue'
export default {
  components: {
    MainSpace,
    RecommendSpace,
  },
  data(){
    return {
      spaceTypeItems: [
        {'name':'오피스', 'img':'office.png', 'value':'1'},
        {'name':'데스크', 'img':'table.png', 'value':'2'},
        {'name':'회의실', 'img':'meeting.png', 'value':'3'},
      ],
      thisAddressFind:'',
    }
  },
  methods: {
    searchSpacelink(spaceType){
      return '/searchSpace/'+spaceType+'/AllName/AllRegions/noDate/noDate/noTime/noTime'
    },
    addressFind(address){
      this.thisAddressFind =address
    },
  },
}
</script>

<style scoped>
.mainPage{
  position: relative;
  width: 98vw;
  height: 110vh;
  overflow-y: scroll;
}
.mainPage::-webkit-scrollbar {
  display: none;
}
.mapIcon{
  position: absolute;
  top: 2vh;
  right: 2vw;
}
/* 공간타입선택 */
.spaceType {
  margin-top: 3vh;
  text-align: center;
  font-weight: bold;
}
.spaceType p {
  font-size: 1.2rem;
}
.spaceTypeItems{
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
}
.spaceTypeItem{
  border: 1px solid gray;
  border-radius: 10px;
  padding: 1vw 3vw;
  margin: 1vw;
  cursor: pointer;
}
.spaceTypeIcon{
  width: 8vw;
}
/* 공간그룹 제목 */
.spaceTile{
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 1rem;
  margin: 5vh 0 1vh 0;
}
/* 공간출력 */
.spaceAll p {
  text-align: center;
}
.spaceAll{
  display: flex;
  justify-content: center;
}
</style>
