<template>
  <div class="QnAcontainer">
    <div class="QnAcreate">
      <i class="fa-solid fa-pen-to-square" />
      <span @click="emitOpenCheck">문의작성</span>
    </div>
    <template v-if="QnAList.length == 0">
      <span class="noQnA">등록후기 없음</span>
    </template>
    <template v-else>
      <div v-for="item in QnAList" :key="item" class="QnAitem">
        <div>
          <span class="QnAtype" :class="item.type">{{ typeCheck(item.type) }}</span>
          <span class="date">{{ dateCheck(item.lastModifiedDate) }}</span>
          <p class="QnAcontent">
            {{ item.writer }}
          </p>
          <p class="QnAcontent">
            {{ item.content }}
          </p>
        </div>
        <div v-if="item.qnacomment != null" class="hostAnswer">
          <img src="@/assets/down-right.png" class="answerArrow">
          <span class="answerTitle">호스트의 답글</span>
          <span class="date">{{ dateCheck(item.qclastModifiedDate) }}</span>
          <p class="answerContent">
            {{ item.qnacomment }}
          </p>
        </div>
      </div>
    </template>
    <div class="pageNumber">
      <span><i class="fa-solid fa-chevron-left monthMoveBtn" @click="pageMove('pre')" /></span>
      <span v-for="num in pageData" :key="num" :class="num.class" @click="spaceQnAListCall(num.value)">{{ num.value }}</span>
      <span><i class="fa-solid fa-chevron-right" @click="pageMove('next')" /></span>
    </div>
  </div>
</template>

<script>
// import { QnAdummy } from '@/utils/dummy/QnAReviewdummy.js'
import { spaceQnAList } from '@/api/QnA.js'
export default {
  emits: [ 'qna:open' ],
  data(){
    return {
      QnAList: [],
      // 페이지 관리데이터
      pageStartNum: 1,
      pageNowNum:1,
      pageData:[],
      pageTotal:'',
    }
  },
  created(){
    this.spaceQnAListCall(this.pageNowNum)
  },
  methods: {
    async spaceQnAListCall(pageNowNum){
      if (!pageNowNum){
        pageNowNum = this.pageNowNum
      } else {
        this.pageNowNum = pageNowNum
      }
      const spaceId = this.$route.params.spaceId
      try {
        const response = await spaceQnAList(pageNowNum-1, spaceId)
        this.QnAList = response.data.data
        this.pageTotal =  response.data.count
        this.paging(this.pageNowNum)
      } catch (error){
        console.log(error)
      }
    },
    typeCheck(value){
      if (value == 'RESERVE'){
        return '예약'
      } else if (value == 'PAY'){
        return '결제'
      } else if (value == 'USE'){
        return '이용'
      }
    },
    dateCheck(value){
      const date = value.slice(0,10)
      const time = value.slice(11,16)
      return `${date} ${time}`
    },
    // 페이징
    paging(pageNowNum){
      this.pageData = []
      this.pageNowNum = pageNowNum
      let total = this.pageTotal
      if (total%5 != 0){
        this.pageTotal = parseInt(total/5)+1
      } else { 
        this.pageTotal = total/5
      }
      let lastPage
      if (this.pageTotal < 6){
        lastPage = this.pageTotal+1
      } else { 
        lastPage = this.pageStartNum+5
        if (lastPage >= this.pageTotal ){
          lastPage = this.pageTotal+1
        }
      }
      for (let i = this.pageStartNum; i < lastPage; i++){
        if (pageNowNum == i){
          this.pageData.push({'value':i,'class':'pageNowNum'})
        } else {
          this.pageData.push({'value':i,'class':''})
        }
      }
    },
    // 페이지 번호 넘기기
    pageMove(value){
      if (this.pageTotal == 1){
        return
      } else if (value == 'next'){
        if (this.pageStartNum == this.pageTotal-1){
          this.paging(this.pageStartNum)
        } else {
          this.pageStartNum = this.pageStartNum + 5
          this.paging(this.pageStartNum)
        }
      } else {
        if (this.pageStartNum == 1){
          this.paging(this.pageStartNum)
        } else {
          this.pageStartNum = this.pageStartNum - 5
          this.paging(this.pageStartNum)
        }
      }
      this.reservationDataCall(this.pageNowNum)
    },
    emitOpenCheck(){
      if (!this.$store.state.token){
        let message = '로그인을 해주세요'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
        this.$router.push('/login')
      } else {
        this.emitOpen()
      }
    },
    emitOpen(){
      let value = true
      this.$emit('qna:open', value)
    },
  },
}
</script>

<style scoped>
.QnAcontainer{
  position: relative;
  margin-left: 1vw;
}
/* 문의리스트 출력 */
.QnAitem{
  border-bottom: 2px solid gray;
  width: 33vw;
  padding: 2vh 0.5vw;
}
.QnAtype{
  border-radius: 10px;
  padding: 0 0.5vw;
  font-size: 0.8rem;
  letter-spacing: 0.1rem;
  color: white;
}
.RESERVE{
  background: rgb(172, 223, 172);
}
.PAY{
  background: rgb(131, 131, 226)
}
.USE{
  background: rgb(224, 182, 135);
}
.date{
  float: right;
  font-size: 0.7rem;
  font-weight: bold;
  color: rgb(97, 97, 97);
}
.QnAcontent{
  font-size: 0.8rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.521);
}
/* 답변 */
.hostAnswer{
  margin-top: 2vh;
  margin-left: 0.5vw;
}
.answerTitle{
  font-size: 0.9rem;
  font-weight: bold;
  color: rgb(43, 43, 185);
}
.answerArrow{
  width: 1vw;
  margin-right: 0.5vw;
}
.answerContent{
  margin-left: 1.5vw;
  font-size: 0.8rem;
}
/* 문의작성 */
.QnAcreate{
  position: absolute;
  top: -2vh;
  right: 5vw;
  border: 1px solid gray;
  border-radius: 10px;
  font-size: 0.8rem;
  padding: 0 0.5vw;
  background: rgb(134, 134, 224);
  color: white;
  cursor: pointer;
}
.QnAcreate span {
  margin-left: 0.5vw;
}
.pageNumber{
  width: 34vw;
  text-align: center;
}
.pageNumber span{
  margin: 0.5vw;
  cursor: pointer;
}
.pageNowNum{
  font-weight: bold;
  color: blue;
}
.noQnA{
  margin-left: 13.5vw;
  font-weight: bold;
}
</style>