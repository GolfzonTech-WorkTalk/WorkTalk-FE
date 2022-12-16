<template>
  <div class="spaceInfo">
    <div>
      <p class="spaceName">
        {{ spaceItems.spaceName }}
      </p>
      <div class="imgContainer">
        <template v-if="(spaceItems.spaceImgList == null)">
          <img class="spaceImg" :src="require(`@/assets/noImg.gif`)" alt="공간이미지">
        </template>
        <template v-else>
          <div class="moveImgBox leftBox">
            <i class="fa-solid fa-chevron-left fa-2x moveBtn" @click="movePrev" />
          </div>
          <img class="spaceImg" :src="spaceItems.spaceImgList[spaceImgListNum].spaceImgUrl" alt="공간이미지">
          <div class="moveImgBox rightBox">
            <i class="fa-solid fa-chevron-right fa-2x moveBtn" @click="moveNext" />
          </div>
        </template>
      </div>
      <div class="navVar">
        <ul>
          <li v-for="nav in navItems" :key="nav" @click="navMove(nav.nav)">
            {{ nav.name }}
          </li>
        </ul>
      </div>
      <div class="contentBox">
        <p id="spaceItro" class="contentTitle">
          [ 공간소개 ]
        </p>
        <p class="contentItem">
          {{ spaceItems.spaceDetail }}
        </p>
      </div>
      <div class="contentBox">
        <p id="spaceNote" class="contentTitle">
          [ 유의사항 ]
        </p>
        <p class="contentItem">
          {{ notice }}
        </p>
      </div>
      <div class="contentBox">
        <p id="spaceRefund" class="contentTitle">
          [ 환불규정 ]
        </p>
        <p class="contentItem">
          {{ refundPolicy }}
        </p>
      </div>
      <div class="contentBox">
        <p id="spaceQNA" class="contentTitle">
          [ Q & A ]
        </p>
        <qn-a-vue ref="QnAVue" @qna:open="QnAFormOpenClose" />
        <form-qn-a-vue v-if="QnAFormView" @qna:open="QnAFormOpenClose" @qnacreate:create="QnACreate" />
      </div>
      <div class="contentBox">
        <p id="spaceReview" class="contentTitle">
          [ 이용후기 ]
        </p>
        <re-view-vue />
      </div>
    </div>
  </div>
</template>

<script>
import { spaceOne } from '@/api/user.js'
// import { selectOneSpaceDumy } from '@/utils/dummy/dummy.js'
import { refundPolicy, notice } from '@/utils/textFile.js'
import FormQnAVue from '@/components/Form/FormQnAcreate.vue'
import ReViewVue from './QnAReview/ReView.vue'
import QnAVue from './QnAReview/QnA.vue'
export default {
  components: {
    QnAVue,
    FormQnAVue,
    ReViewVue,
  },
  data(){
    return {
      spaceItems:[],
      navItems: [
        {'name':'공간소개','nav':'spaceItro'},
        {'name':'유의사항','nav':'spaceNote'},
        {'name':'환불규정','nav':'spaceRefund'},
        {'name':'Q&A','nav':'spaceQNA'},
        {'name':'이용후기','nav':'spaceReview'},
      ],
      refundPolicy: refundPolicy,
      notice: notice,
      spaceImgListNum:'0',
      QnAFormView: false,
    }
  },
  // 공간정보 출력
  async created(){
    try {
      const spaceId = this.$route.params.spaceId
      // console.log(spaceId)
      let spaceResponce = await spaceOne(spaceId)
      // console.log(spaceResponce.data[0])
      this.spaceItems = spaceResponce.data[0]
      this.memberItems = spaceResponce.data.member
    } catch (error){
      console.log(error)      
    }
    this.$store.dispatch('SPINNERVIEW', false)
    /* 더미 */
    // this.spaceItems = selectOneSpaceDumy
    // this.memberItems = selectOneSpaceDumy.member
  },
  methods: {
    navMove(value){
      document.getElementById(value).scrollIntoView(false)
    },
    QnAFormOpenClose(value){
      this.QnAFormView = value
    },
    movePrev(){
      if (this.spaceImgListNum == '0'){
        this.spaceImgListNum = this.spaceItems.spaceImgList.length -1  
      } else {
        this.spaceImgListNum --
      }
    },
    moveNext(){
      if (this.spaceImgListNum == this.spaceItems.spaceImgList.length -1 ){
        this.spaceImgListNum = 0
      } else {
        this.spaceImgListNum ++
      }
    },
    QnACreate(){
      this.QnAFormOpenClose(false)
      this.$refs.QnAVue.spaceQnAListCall()
    },
  },
}
</script>

<style scoped>
.spaceInfo{
  width: 40vw;
}
.spaceName{
  font-size: 2rem;
  font-weight: bold;
  margin: 1vh;
}
.navVar {
    display: flex;
    justify-content: center;
    width: 40vw;
    height: 3vh;
    background-color: white;
}
.navVar ul {
    display: table;
    list-style: none;
}
.navVar li{
  display: table-cell;
  width: 8vw;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  line-height: 3vh;
  cursor: pointer;
}
.navVar li:nth-child(n+2):nth-child(-n+5) {
  border-left: 2px solid gray;
}
.contentBox{
  width: 40vw;
  padding: 1vw;
}
.contentTitle{
  font-size: 1.2rem;
  font-weight: bold;
}
.contentItem{
  color: rgb(165, 165, 165);
  font-size: 0.8rem;
  line-height: 3vh;
  margin-top: 1vh;
  margin-left: 1vw;
  white-space: pre-line;
  font-weight: bold;
}
/* 이미지 */
.spaceImg{
  width: 40vw;
  height: 30vh;
}
.imgContainer{
  position: relative;
  width: 40vw;
  height: 30vh;
}
.moveImgBox{
  position: absolute;
  height: 30vh;
  top: 0;
}
.moveImgBox:hover{
  background: rgba(255, 255, 255, 0.301);
}
.moveBtn{
  padding-top: 13vh;
  color: rgba(128, 128, 128, 0.712);
}
.leftBox{
  left: 0;
}
.rightBox{
  right: 0;
}
</style>