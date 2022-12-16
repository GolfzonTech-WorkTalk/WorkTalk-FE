<template>
  <div class="spaceModuleSpaceItem">
    <div v-if="item.spaceImgList != null" class="spaceModuleSpaceImg">
      <div class="spaceModuleMoveImgBox spaceModuleLeftBox">
        <i class="fa-solid fa-chevron-left fa-2x spaceModuleMoveBtn" @click="movePrev" />
      </div>
      <img :src="item.spaceImgList[spaceImgListNum].spaceImgUrl" alt="공간이미지">
      <div class="spaceModuleMoveImgBox spaceModuleRightBox">
        <i class="fa-solid fa-chevron-right fa-2x spaceModuleMoveBtn" @click="moveNext" />
      </div>
    </div>
    <div v-else class="spaceModuleSpaceImg">
      <img :src="require(`@/assets/noImg.gif`)" alt="공간이미지">
    </div>
    <div class="spaceModuleLinkBox">
      <router-link :to="itemLink(item.spaceName, item.spaceId, item.spaceType)">
        <div class="spaceModuleSpaceTitle">
          <span>{{ item.spaceName }}</span>
        </div>
        <div class="spaceModuleSpaceLocation">
          <i class="fa-solid fa-map-pin" />
          <span>{{ item.address }}</span>
        </div>
        <div class="spaceModuleSpaceGradeReview">
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
.spaceModuleSpaceItem {
  position: relative;
  width: 22vw;
  height: 28vh;
  margin: 15px;
}
.spaceModuleSpaceImg img {
  width: 22vw;
  height: 20vh;
}
.spaceModuleSpaceTitle {
  font-size: 1.1rem;
  font-weight: bold;
}
.spaceModuleLinkBox {
  padding: 10px;
  border-bottom: 1px solid gray;
}
.spaceModuleSpaceGradeReview {
  float: right;
}
.spaceModuleMoveImgBox{
  position: absolute;
  height: 20vh;
  top: 0;
}
.spaceModuleMoveImgBox:hover{
  background: rgba(255, 255, 255, 0.301);
}
.spaceModuleMoveBtn{
  padding-top: 8vh;
  color: rgba(128, 128, 128, 0.712);
}
.spaceModuleLeftBox{
  left: 0;
}
.spaceModuleRightBox{
  right: 0;
}
</style>