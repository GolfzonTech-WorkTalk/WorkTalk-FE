<template>
  <div class="QnAContainer">
    <div v-if="deleteQnANum != '문의삭제' || updateQnANum != '문의수정'" class="backgroundQnA" @click="deleteQnACancel" />
    <div class="SortQnAtypeBox">
      <select v-model="QnAtype" class="SortQnAtype" @change="qnaListCall(pageNowNum,QnAtype)">
        <option value="문의종류" hidden>
          문의종류
        </option>
        <option v-for="item in QnAtypeData" :key="item" :value="item.value">
          {{ item.name }}
        </option>
      </select>
    </div>
    <template v-if="QnAList.length != 0">
      <div v-for="item in QnAList" :key="item" class="QnAitem">
        <div>
          <span class="QnAtypelabel" :class="item.type">{{ typeCheck(item.type) }}</span>
          <span class="spaceName">{{ item.spaceName }}</span>
          <p class="QnAcontent">
            {{ item.content }}
          </p>
          <div class="UpdateDeleteBtn">
            <i class="fa-solid fa-pen-to-square" @click="updateQnA(item)" />
            <i class="fa-solid fa-trash" @click="deleteQnA(item)" />
            <template v-if="deleteQnANum == item.qnaId">
              <div class="deleteBox">
                <p>해당 문의를 삭제하시겠습니까?</p>
                <span class="deleteBtn deleteQnADo" @click="deleteQnASubmit(item)">삭 제</span>
                <span class="deleteBtn deleteQnACancel" @click="deleteQnACancel">취 소</span>
              </div>
            </template>
            <template v-if="updateQnANum == item.qnaId">
              <FormQnAupdate :item="item" @qnaupdate:close="deleteQnACancel" @qnaupdate-data:call="qnaListCall(pageNowNum,QnAtype)" />
            </template>
            <p class="date">
              {{ dateCheck(item.lastModifiedDate) }}
            </p>
          </div>
        </div>
        <div v-if="item.qnacomment" class="hostAnswer">
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
      <span v-for="num in pageData" :key="num" :class="num.class" @click="qnaListCall(num.value)">{{ num.value }}</span>
      <span><i class="fa-solid fa-chevron-right" @click="pageMove('next')" /></span>
    </div>
  </div>
</template>

<script>
import {mypageQnAList, qnaDelete} from '@/api/QnA.js'
import FormQnAupdate from '@/components/Form/FormQnAupdate.vue'
// import { QnAdummy } from '@/utils/dummy/QnAReviewdummy.js'
export default {
  components: {
    FormQnAupdate,
  },
  data(){
    return {
      QnAList: [],
      QnAtype:'문의종류',
      QnAtypeData: [
        {'name':'전체','value':'문의종류'},
        {'name':'예약','value':'RESERVE'},
        {'name':'결제','value':'PAY'},
        {'name':'이용','value':'USE'},
      ],
      deleteQnANum:'문의삭제',
      updateQnANum:'문의수정',
      // 페이지 관리데이터
      pageStartNum: 1,
      pageNowNum:1,
      pageData:[],
      pageTotal:'',
    }
  },
  created(){
    this.qnaListCall(this.pageNowNum,this.QnAtype)
  },
  methods: {
    async qnaListCall(pageNowNum,QnAtype){
      if (QnAtype == '문의종류'){
        QnAtype = ''
      }
      // console.log(QnAtype)
      const response = await mypageQnAList(pageNowNum-1,QnAtype)
      this.QnAList = response.data.data
      this.pageTotal =  response.data.count
      this.paging(pageNowNum)
      this.$store.dispatch('SPINNERVIEW', false)
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
    dateCheck(dateData){
      // console.log(dateData)
      return dateData.slice(0,10)+' '+dateData.slice(11,16)
    },
    deleteQnA(item){
      this.deleteQnANum = item.qnaId
    },
    updateQnA(item){
      this.updateQnANum = item.qnaId
    },
    deleteQnACancel(){
      this.deleteQnANum = '문의삭제'
      this.updateQnANum = '문의수정'
    },
    async deleteQnASubmit(item){
      try {
        let response = await qnaDelete(item.qnaId)
        console.log(response)
        this.qnaListCall(this.pageNowNum,this.QnAtype)
        this.deleteQnACancel()
      } catch (error){
        console.log(error)
      }
    },
    // 페이징
    paging(pageNowNum){
      this.pageData = []
      this.pageNowNum = pageNowNum
      let total = this.pageTotal
      if (total%10 != 0){
        this.pageTotal = parseInt(total/10)+1
      } else { 
        this.pageTotal = total/10
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
      if (value == 'next'){
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
      this.qnaListCall(this.pageNowNum,this.QnAtype)
    },
  },
}
</script>

<style scoped>
.QnAContainer{
  position: relative;
  padding: 0.5vh 2vw;
  width: 36vw;
  height: 94.5vh;
  background: white;
  overflow-y: scroll;
}
.QnAContainer::-webkit-scrollbar{
  display: none;
}
/* 정렬 */
.SortQnAtypeBox{
  width: 36vw;
  font-size: 2rem;
  font-weight: bold;
  text-align: right;
  margin: 2vh 0;
}
.SortQnAtype{
  width: 8vw;
  letter-spacing: 0.3rem;
  font-size: 1.1rem;
  font-weight: bold;
}
/* 문의리스트 출력 */
.QnAitem{
  position: relative;
  border: 2px solid gray;
  border-radius: 10px;
  width: 35vw;
  padding: 2vh 0.5vw;
  margin-bottom: 1vh;
}
.QnAtypelabel{
  border-radius: 10px;
  padding: 0 0.5vw;
  font-size: 0.8rem;
  letter-spacing: 0.1rem;
  color: white;
}
.spaceName{
  font-weight: bold;
  margin-left: 0.2vw;
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
  font-size: 0.7rem;
  font-weight: bold;
  color: rgb(97, 97, 97);
}
.QnAcontent{
  font-size: 0.8rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.521);
  margin-left: 0.5vw;
  width: 28vw;
}
/* 답변 */
.hostAnswer{
  margin-top: 2vh;
  margin-left: 0.5vw;
}
.answerTitle{
  font-size: 0.9rem;
  font-weight: bold;
  margin-right: 0.5vw;
  color: rgb(43, 43, 185);
}
.answerArrow{
  width: 1vw;
  margin-right: 0.5vw;
}
.answerContent{
  font-size: 0.8rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.521);
  margin-left: 1.5vw;
}
.UpdateDeleteBtn{
  top: 2vh;
  right: 0.5vw;
  position: absolute;
  text-align: right;
}
.UpdateDeleteBtn i {
  margin-left: 0.5vw;
  margin-bottom: 0.5vh;
}
.fa-pen-to-square:hover{
  color: blue
}
.fa-trash:hover{
  color: red;
}
/* 삭제 창 */
.deleteBox{
  position: absolute;
  text-align: center;
  top: 0;
  left: -22vw;
  background: white;
  width: 20vw;
  border-radius: 10px;
  padding: 1vh 1vw;
  z-index: 2;
}
.backgroundQnA{
  position: absolute;
  background: rgba(0, 0, 0, 0.212);
  top: 0;
  left: 0;
  width: 40vw;
  height: 92.5vh;
  z-index: 1;
}
.deleteBtn{
  border: 1px solid gray;
  border-radius: 10px;
  font-size: 0.8rem;
  padding: 0 0.5vw;
}
.deleteBox p{
  margin-bottom: 1vh;
}
.deleteQnADo:hover{
  background: rgb(223, 69, 69);
  color: white;
}
.deleteQnACancel{
  margin-left: 0.5vw;
}
.deleteQnACancel:hover{
  background: rgb(165, 165, 165);
  color: white;
}
.pageNumber{
  width: 36vw;
  text-align: center;
}
.pageNumber span{
  margin: 1vw;
  cursor: pointer;
}
.pageNowNum{
  font-weight: bold;
  color: blue;
}
</style>