<template>
  <div>
    <div class="spaceCreate">
      <router-link to="/host/spaceCreate">
        <span class="linkText">새공간등록</span>
      </router-link>
    </div>
    <div class="spaceAllContainer">
      <div v-for="item in spaceItems" :key="item.title" class="spaceItem">
        <div class="spaceImg">
          <img :src="item.spaceImg" alt="공간이미지">
        </div>
        <router-link :to="itemLink(item.spaceStatus, item.spaceName, item.spaceType, item.spaceName, item.spaceId)" :class="(item.spaceStatus == 'waiting') ? 'waitingBox' : 'approvedBox'">
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
          <template v-if="item.spaceStatus == 'waiting'">
            <div class="spaceStatus waiting">
              <span>검수중</span>
            </div>
          </template>
          <template v-else-if="item.spaceStatus == 'approved'">
            <div class="spaceStatus approved">
              <span>운영중</span>
            </div>
          </template>
          <template v-else>
            <template v-if="item.spaceType == '3'">
              <div class="spaceStatus spaceNoCreate">
                <span>오피스 설정필요</span>
              </div>
            </template>
            <template v-else>
              <div class="spaceStatus spaceNoCreate">
                <span>방 생성필요</span>
              </div>
            </template>
          </template>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { spaceAll } from '@/api/host.js'
// import { spaceDumy } from '@/utils/dummy'
// import jwt_decode from 'jwt-decode'
export default {
  data(){
    return {
      spaceItems: '',
    }
  },
  created(){
    this.spaceAllCall()
  },
  methods: {
    async spaceAllCall(){
      const responce = await spaceAll()
      console.log(responce)
      this.spaceItems = responce.data
    },
    itemLink(spaceStatus, title, spaceType, spaceName, spaceId){
      if (spaceStatus == 'waiting'){
        return '/host/roomCreate/'+title
      } else if (spaceStatus == 'approved'){
        return 'host/spaceOne/'+spaceName+'/'+spaceId+'/'+spaceType
      } else {
        return '/host/roomCreate/'+title+'/'+spaceType+'/'+spaceId
      }
    },
  },
}
</script>

<style scoped>
.spaceCreate {
  margin: auto;
  margin-top: 1vh;
  margin-bottom: 1vh;
  height: 5vh;
  width: 30vw;
  background: rgba(4, 0, 255, 0.377);
  text-align: center;
  font-size: 1.3rem;
  line-height: 5vh;
  letter-spacing: 1rem;
  cursor: pointer;
  border-radius: 10px;
}
.linkText {
  color: white;
}
.spaceAllContainer {
  font-size: 0.9rem;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  margin: auto;
  width: 80vw;
  height: 80vh;
}
.spaceItem {
  position: relative;
  border: 1px solid gray;
  border-radius: 10px;
  width: 15vw;
  height: 23vh;
  padding: 1vw;
  margin: 1vw 1.3vw;
}
.spaceGradeReview {
  float: right;
}
.spaceImg img {
  width: 15vw;
  height: 13vh;
  object-fit: contain;
}
.spaceStatus{
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 0 0 10px 10px;
  text-align: center;
  width: 17vw;
}
.waitingBox {
  pointer-events: none;
}
.waiting{
  background: rgba(255, 0, 0, 0.507);
  color: white;
}
.approved{
  background: rgba(0, 0, 255, 0.479);
  color: white;
}
.spaceNoCreate{
  background: rgba(26, 105, 10, 0.479);
  color: white;
}
</style>