<template>
  <div class="spaceItem">
    <div v-if="item.spaceImgList != null" class="spaceImg">
      <div class="moveImgBox leftBox">
        <i class="fa-solid fa-chevron-left fa-2x moveBtn" @click="movePrev" />
      </div>
      <img :src="item.spaceImgList[spaceImgListNum].spaceImgUrl" alt="공간이미지">
      <div class="moveImgBox rightBox">
        <i class="fa-solid fa-chevron-right fa-2x moveBtn" @click="moveNext" />
      </div>
    </div>
    <div v-else class="spaceImg">
      <img :src="require(`@/assets/noImg.gif`)" alt="공간이미지">
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
          <i class="fa-regular fa-star" /> {{ item.gradeAvg }} <i class="fa-regular fa-comments" /> {{ item.count }}
        </div><br>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    item:{
      type:Object,
      required: true,
    },
  },
  data(){
    return {
      spaceImgListNum:'0',
    }
  },
  methods:{
    itemLink(spaceName, spaceId, spaceType){
      return '/spaceOne/'+spaceName+'/'+ spaceId + '/' + spaceType
    },
    movePrev(){
      if (this.spaceImgListNum == '0'){
        this.spaceImgListNum = this.item.spaceImgList.length -1  
      } else {
        this.spaceImgListNum --
      }
    },
    moveNext(){
      if (this.spaceImgListNum == this.item.spaceImgList.length -1 ){
        this.spaceImgListNum = 0
      } else {
        this.spaceImgListNum ++
      }
    },
  },
}
</script>

<style scoped>
.spaceItem {
  position: relative;
  width: 22vw;
  height: 28vh;
  margin: 15px;
}
.spaceImg img {
  width: 22vw;
  height: 20vh;
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
.moveImgBox{
  position: absolute;
  height: 20vh;
  top: 0;
}
.moveImgBox:hover{
  background: rgba(255, 255, 255, 0.301);
}
.moveBtn{
  padding-top: 8vh;
  color: rgba(128, 128, 128, 0.712);
}
.leftBox{
  left: 0;
}
.rightBox{
  right: 0;
}
</style>