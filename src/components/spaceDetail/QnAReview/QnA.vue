<template>
  <div class="QnAcontainer">
    <div class="QnAcreate">
      <i class="fa-solid fa-pen-to-square" />
      <span>문의작성</span>
    </div>
    <div v-for="item in QnAList" :key="item" class="QnAitem">
      <div>
        <span class="QnAtype" :class="item.type">{{ typeCheck(item.type) }}</span>
        <span class="date">{{ dateCheck(item.lastModifiedDate) }}</span>
        <p class="QnAcontent">
          {{ item.content }}
        </p>
      </div>
      <div v-if="item.qnacomment" class="hostAnswer">
        <span class="answerTitle">호스트의 답글</span>
        <span class="date">{{ dateCheck(item.qclastModifiedDate) }}</span>
        <p class="QnAcontent">
          {{ item.qnacomment }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { QnAdummy } from '@/utils/QnAReviewdummy.js'
export default {
  data(){
    return {
      QnAList: [],
    }
  },
  created(){
    this.QnAList = QnAdummy
  },
  methods: {
    typeCheck(value){
      if (value == 'RESERVE'){
        return '예약'
      } else if (value == 'PAY'){
        return '결제'
      } else if (value == 'USING'){
        return '이용'
      }
    },
    dateCheck(value){
      let date = value.slice(0,10)
      let time = value.slice(11,16)
      return `${date} ${time}`
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
.USING{
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
  margin-left: 0.5vw;
}
.hostAnswer{
  margin-top: 2vh;
}
.answerTitle{
  font-size: 0.9rem;
  font-weight: bold;
  color: rgb(43, 43, 185);
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