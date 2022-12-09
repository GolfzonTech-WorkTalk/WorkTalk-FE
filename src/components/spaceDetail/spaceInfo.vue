<template>
  <div class="spaceInfo">
    <div>
      <p class="spaceName">
        {{ spaceItems.spaceName }}
      </p>
      <template v-if="(spaceItems.spaceImg == null)">
        <img class="spaceImg" :src="require(`@/assets/dummy1.jpg`)" alt="공간이미지">
      </template>
      <template v-else>
        <img class="spaceImg" :src="require(`@/assets/${spaceItems.spaceImg}`)" alt="공간이미지">
      </template>
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
        <qn-a-vue @qna:open="QnAFormOpenClose" />
        <form-qn-a-vue v-if="QnAFormView" @qna:open="QnAFormOpenClose" />
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
      QnAFormView: false,
    }
  },
  // 공간정보 출력
  async created(){
    try {
      const spaceId = this.$route.params.spaceId
      let spaceResponce = await spaceOne(spaceId)
      // console.log(spaceResponce.data)
      this.spaceItems = spaceResponce.data
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
      console.log(value)
      window.location.href = `#${value}`
    },
    QnAFormOpenClose(value){
      this.QnAFormView = value
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
.spaceImg{
  width: 40vw;
  height: 30vh;
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
</style>