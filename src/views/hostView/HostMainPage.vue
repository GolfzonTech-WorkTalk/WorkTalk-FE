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
        <router-link :to="{path: '/host/spaceDetail/' + item.title}">
          <div class="spaceTitle">
            <span>{{ item.title }}</span>
          </div>
          <div class="spaceLocation">
            <i class="fa-solid fa-map-pin" />
            <span>{{ item.location }}</span>
          </div>
          <div class="spaceGradeReview">
            <i class="fa-regular fa-star" /> {{ item.grade }} <i class="fa-regular fa-comments" /> {{ item.review }}
          </div>
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
  font-size: 1.5rem;
  line-height: 5vh;
  letter-spacing: 1rem;
  cursor: pointer;
  border-radius: 10px;
}
.linkText {
  color: white;
}
.spaceAllContainer {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  margin: auto;
  width: 80vw;
  height: 80vh;
}
.spaceItem {
 border: 1px solid gray;
 border-radius: 10px;
 width: 15vw;
 height: 18vh;
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
</style>