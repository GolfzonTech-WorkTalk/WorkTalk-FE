<template>
  <div class="spaceAllContainer">
    <div v-for="item in spaceItems" :key="item.spaceName" class="spaceItem">
      <div class="spaceImg">
        <img :src="require(`@/assets/${item.spaceImg}`)" alt="공간이미지">
      </div>
      <div class="linkBox">
        <router-link :to="itemLink(item.spaceName, item.spaceId, item.spaceType)">
          <div class="spaceTitle">
            <span>{{ item.spaceName }}</span>
          </div>
          <div class="spaceLocation">
            <i class="fa-solid fa-map-pin" />
            <span>{{ item.address }}</span>
          </div>
          <div class="spaceGradeReview">
            <i class="fa-regular fa-star" /> {{ item.grade }} <i class="fa-regular fa-comments" /> {{ item.review }}
          </div><br>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// import { spaceAll } from '@/api/user.js'
/* 더미 값 */
import { spaceDumy } from '@/utils/dummy.js'
export default {
  data(){
    return {
      spaceItems: '',
    }
  },
  // async
  created(){
    // const responce = await spaceAll()
    // this.spaceItems = responce.data
    /* 더미 값 */
    const responce = spaceDumy
    for (let i = 1; i < 10; i++){
      responce.push({
        spaceName:`더미 공간 ${i}호`,
        spaceImg : "dummy1.jpg",
        address:"경기도 수원시 장안구",
        spaceId:`${i}`,
        grade:"4",
        review:`${i}`,
        spaceStatus: "roomSetting",
        spaceType:'1',
      })
    }
    this.spaceItems = responce
    console.log(this.spaceItems)
  },
  methods: {
    itemLink(spaceName, spaceId, spaceType){
      return '/spaceOne/'+spaceName+'/'+ spaceId + '/' + spaceType
    },
  },
}
</script>

<style scoped>
/* 데이터 디자인 */
.spaceAllContainer {
  font-size: 0.9rem;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 80vw;
  height: 80vh;
}
.spaceItem {
  position: relative;
  width: 24vw;
  height: 25vh;
  margin: 15px;
}
.spaceImg img {
  width: 24vw;
  height: 17vh;
}
.spaceTitle {
  font-size: 1.1rem;
  font-weight: bold;
}
.linkBox {
  padding: 10px;
  border-bottom: 1px solid gray;
}
.spaceGradeReview {
  float: right;
}
</style>