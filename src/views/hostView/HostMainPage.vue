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
          <img src="@/assets/dummy1.jpg" alt="">
        </div>
        <router-link :to="{path: '/host/spaceDetail/' + item.title}" :class="(item.spaceStatus == 'waiting') ? 'waitingBox' : 'approvedBox'">
          <div class="spaceTitle">
            <span>{{ item.title }}</span>
          </div>
          <div class="spaceLocation">
            <i class="fa-solid fa-map-pin" />
            <span>{{ item.location }}</span>
          </div>
          <div class="spaceGradeReview">
            <i class="fa-regular fa-star" /> {{ item.grade }} <i class="fa-regular fa-comments" /> {{ item.review }}
          </div><br>
          <template v-if="item.spaceStatus == 'waiting'">
            <div class="spaceStatus waiting">
              <span>검수중</span>
            </div>
          </template>
          <template v-else>
            <div class="spaceStatus approved">
              <span>운영중</span>
            </div>
          </template>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// import { spaceAll } from '@/api/auth.js'
import { dumy } from '@/utils/dummy'
// import jwt_decode from 'jwt-decode'
export default {
  data(){
    return {
      spaceItems: dumy,
    }
  },
  // async
  created(){
    // const responce =  await spaceAll(this.$store.state.nickName)
    // this.spaceItems = jwt_decode(responce)
    const responce = dumy
    console.log(responce)
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
</style>