<template>
  <div class="spaceItem">
    <div v-if="spaceItem.spaceImgList != null" class="spaceImg">
      <div class="moveImgBox leftBox">
        <i class="fa-solid fa-chevron-left fa-lg moveBtn" @click="movePrev" />
      </div>
      <img :src="spaceItem.spaceImgList[spaceImgListNum].spaceImgUrl" alt="공간이미지">
      <div class="moveImgBox rightBox">
        <i class="fa-solid fa-chevron-right fa-lg moveBtn" @click="moveNext" />
      </div>
    </div>
    <div v-else class="spaceImg">
      <img :src="require(`@/assets/noImg.gif`)" alt="공간이미지">
    </div>
    <router-link :to="itemLink(spaceItem.spaceStatus, spaceItem.spaceName, spaceItem.spaceType, spaceItem.spaceName, spaceItem.spaceId)" :class="(spaceItem.spaceStatus == 'waiting') ? 'waitingBox' : 'approvedBox'">
      <div class="spaceTitle">
        <span>{{ spaceItem.spaceName }}</span>
      </div>
      <div class="spaceLocation">
        <i class="fa-solid fa-map-pin" />
        <span>{{ spaceItem.address }}</span>
      </div>
      <div class="spaceGradeReview">
        <i class="fa-regular fa-star" /> {{ spaceItem.gradeAvg }} <i class="fa-regular fa-comments" /> {{ spaceItem.count }}
      </div><br>
      <template v-if="spaceItem.spaceStatus == 'waiting'">
        <div class="spaceStatus waiting">
          <span>검수중</span>
        </div>
      </template>
      <template v-else-if="spaceItem.spaceStatus == 'approved'">
        <div class="spaceStatus approved">
          <span>운영중</span>
        </div>
      </template>
      <template v-else>
        <template v-if="spaceItem.spaceType == '3'">
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
</template>

<script>
export default {
  props:{
    spaceItem:{
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
    itemLink(spaceStatus, title, spaceType, spaceName, spaceId){
      if (spaceStatus == 'waiting'){
        return '/host/roomCreate/'+title
      } else if (spaceStatus == 'approved'){
        return 'host/spaceOne/'+spaceName+'/'+spaceId+'/'+spaceType
      } else {
        return '/host/roomCreate/'+title+'/'+spaceType+'/'+spaceId
      }
    },
    movePrev(){
      if (this.spaceImgListNum == '0'){
        this.spaceImgListNum = this.spaceItem.spaceImgList.length -1  
      } else {
        this.spaceImgListNum --
      }
    },
    moveNext(){
      if (this.spaceImgListNum == this.spaceItem.spaceImgList.length -1 ){
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
.moveImgBox{
  position: absolute;
  height: 13vh;
  top: 2vh;
}
.moveImgBox:hover{
  background: rgba(0, 0, 0, 0.301);
}
.moveBtn{
  padding-top: 7vh;
  color: rgba(128, 128, 128, 0.712);
}
.leftBox{
  left: 0.5vw;
}
.rightBox{
  right: 0.5vw;
}
</style>