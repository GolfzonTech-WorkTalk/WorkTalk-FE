<template>
  <div v-for="item in spaceItems" :key="item" class="spaceInfo">
    <p class="spaceName">
      {{ item.spaceName }}
    </p>
    <img class="spaceImg" :src="require(`@/assets/${item.spaceImg}`)" alt="공간이미지">
    <div class="navVar">
      <ul>
        <li v-for="nav in navItems" :key="nav" onclick="navMove('{{nav.nav}}')">
          {{ nav.name }}
        </li>
      </ul>
    </div>
    <div class="contentBox">
      <p class="contentTitle">
        공간소개
      </p>
      <p class="contentItem">
        {{ item.spaceDetail }}
      </p>
    </div>
    <div class="contentBox">
      <p class="contentTitle">
        유의사항
      </p>
      <p class="contentItem">
        {{ notice }}
      </p>
    </div>
    <div class="contentBox">
      <p class="contentTitle">
        환불정책
      </p>
      <p class="contentItem">
        {{ refundPolicy }}
      </p>
    </div>
    <div class="contentBox">
      <p class="contentTitle">
        Q&A
      </p>
      <p class="contentItem">
        Q&A
      </p>
    </div>
    <div class="contentBox">
      <p class="contentTitle">
        이용후기
      </p>
      <p class="contentItem">
        이용후기
      </p>
    </div>
  </div>
</template>

<script>
// import { spaceOne } from '@/api/user.js'
import { selectOneSpaceDumy } from '@/utils/dummy.js'
import { refundPolicy, notice } from '@/utils/textFile.js'
export default {
  data(){
    return {
      spaceItems:[],
      navItems: [
        {'name':'공간소개','nav':'spaceItro'},
        {'name':'유의사항','nav':'spaceNote'},
        {'name':'환불정책','nav':'spaceRefund'},
        {'name':'Q&A','nav':'spaceQNA'},
        {'name':'이용후기','nav':'spaceReview'},
      ],
      refundPolicy: refundPolicy,
      notice: notice,
    }
  },
  // 공간정보 출력 async
  created(){
      // const spaceId = this.$route.params.spaceId
      // console.log(spaceId)
      // let spaceResponce = await spaceOne(spaceId)
      // console.log(spaceResponce)
      // this.spaceItems = spaceResponce.data
      // this.memberItems = spaceResponce.data.member
      /* 더미 */
      this.spaceItems = selectOneSpaceDumy
      this.memberItems = selectOneSpaceDumy.member
  },
  methods: {
    // 테스트 대기...
    navMove(x){
      let menuHeight = document.querySelector('#navVar').offsetHeight
      let location = document.querySelector(`#${x}`).offsetTop
      window.scrollTo({top:location - menuHeight, behavior:'smooth'})
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
  font-size: 1.3rem;
  font-weight: bold;
}
.contentItem{
  color: rgb(165, 165, 165);
  font-size: 1rem;
  line-height: 2vh;
  margin-top: 1vh;
  margin-left: 1vw;
  white-space: pre-line;
  font-weight: bold;
}
</style>