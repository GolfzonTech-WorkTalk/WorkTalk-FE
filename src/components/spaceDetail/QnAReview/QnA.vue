<template>
  <div class="QnAcontainer">
    <div class="QnAcreate">
      <i class="fa-solid fa-pen-to-square" />
      <span @click="emitOpenCheck">문의작성</span>
    </div>
    <div v-for="item in QnAList" :key="item" class="QnAitem">
      <div>
        <span class="QnAtype" :class="item.type">{{ typeCheck(item.type) }}</span>
        <span class="date">{{ dateCheck(item.lastModifiedDate) }}</span>
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
    }
  },
  created(){
    this.spaceQnAListCall()
  },
  methods: {
    async spaceQnAListCall(){
      console.log('1234')
      const spaceId = this.$route.params.spaceId
      console.log(spaceId)
      try {
        const response = await spaceQnAList(spaceId)
        // console.log(response)
        this.QnAList = response.data
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
      let date = value[0]+'-'+value[1]+'-'+value[2]
      let hour = value[3]
      let minute = value[3]
      if (hour < 10){
        hour = '0'+hour
      }
      if (minute < 10){
        minute = '0'+minute
      }
      let time = hour+':'+minute
      return `${date} ${time}`
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
</style>