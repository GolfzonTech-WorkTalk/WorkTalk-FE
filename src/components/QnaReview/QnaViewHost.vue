<template>
  <div class="QnAContainer">
    <div v-if="deleteQnANum != '답글삭제' || updateQnANum != '답글수정' || createQnANum != '답글작성'" class="backgroundQnA" @click="deleteQnACancel" />
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
          <div class="dateBox">
            <p class="date">
              {{ dateCheck(item.lastModifiedDate) }}
            </p>
          </div>
        </div>
        <div v-if="item.qnacomment" class="hostAnswer">
          <img src="@/assets/down-right.png" class="answerArrow">
          <span class="answerTitle">호스트의 답글</span>
          <span class="date">{{ dateCheck(item.qclastModifiedDate) }}</span>
          <div class="UpdateDeleteBtn">
            <i class="fa-solid fa-pen-to-square" @click="updateQnA(item)" />
            <i class="fa-solid fa-trash" @click="deleteQnA(item)" />
          </div>
          <template v-if="updateQnANum == item.qnaId">
            <FormQnAupdate :item="item" @qnaupdate:close="deleteQnACancel" @qnaupdate-data:call="qnaListCall" />
          </template>
          <template v-if="deleteQnANum == item.qnaId">
            <div class="deleteBox">
              <p>해당 문의를 삭제하시겠습니까?</p>
              <span class="deleteBtn deleteQnADo" @click="deleteQnASubmit(item)">삭 제</span>
              <span class="deleteBtn deleteQnACancel" @click="deleteQnACancel">취 소</span>
            </div>
          </template>
          <p class="answerContent">
            {{ item.qnacomment }}
          </p>
        </div>
        <div v-else class="hostAnswer">
          <span class="qnacommentCreateBtn" @click="createQnA(item)">답글작성</span>
          <template v-if="createQnANum == item.qnaId">
            <div class="createBox">
              <span>답글작성</span>
              <span class="contentCount" :class="(qnacomment.length > 100)?'warning':''">
                {{ qnacomment.length }}/100자
              </span>
              <textarea v-model="qnacomment" class="qnacommentBox" placeholder="답변을 작성해주세요." />
              <span class="createBtn createQnADo" @click="createQnASubmit(item)">작 성</span>
              <span class="createBtn createQnACancel" @click="deleteQnACancel">취 소</span>
            </div>
          </template>
        </div>
      </div>
    </template>
    <div class="pageNumber">
      <span><i class="fa-solid fa-chevron-left monthMoveBtn" @click="pageMove('pre')" /></span>
      <span v-for="num in pageData" :key="num" :class="num.class" @click="reservationDataCall(num.value)">{{ num.value }}</span>
      <span><i class="fa-solid fa-chevron-right" @click="pageMove('next')" /></span>
    </div>
  </div>
</template>

<script>
import {mypageQnAListHost, qnacommentCreate, qnacommentDelete} from '@/api/QnA.js'
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
        {'name':'전체','value':''},
        {'name':'예약','value':'RESERVE'},
        {'name':'결제','value':'PAY'},
        {'name':'이용','value':'USE'},
      ],
      deleteQnANum:'답글삭제',
      updateQnANum:'답글수정',
      createQnANum:'답글작성',
      qnacomment:'',
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
      try {
        const response = await mypageQnAListHost(pageNowNum-1,QnAtype)
        console.log(response)
        this.QnAList = response.data.data
        this.pageTotal =  response.data.count
        this.paging(pageNowNum)
        this.$store.dispatch('SPINNERVIEW', false)
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
    dateCheck(dateData){
      return dateData.slice(0,10)+' '+dateData.slice(11,16)
    },
    deleteQnA(item){
      this.deleteQnANum = item.qnaId
    },
    updateQnA(item){
      this.updateQnANum = item.qnaId
    },
    createQnA(item){
      this.createQnANum = item.qnaId
    },
    deleteQnACancel(){
      this.deleteQnANum = '답글삭제'
      this.updateQnANum = '답글수정'
      this.createQnANum = '답글작성'
    },
    async deleteQnASubmit(item){
      try {
        let response = await qnacommentDelete(item.qnaCommentId)
        console.log(response)
        this.deleteQnACancel()
      } catch (error){
        console.log(error)
      }
    },
    async createQnASubmit(){
      if (this.qnacomment.length == ''){
        let message = '답글 내용이 없습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (this.qnacomment.length > 100){
        let message = '답글이 100자를 초과하였습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        const qnaCreateData = {
          'qnaId': this.createQnANum,
          'qnacomment': this.qnacomment,
        }
        console.log(qnaCreateData)
        try {
          let response = await qnacommentCreate(qnaCreateData)
          console.log(response)
          this.qnaListCall()
          this.deleteQnACancel()
        } catch (error){
          console.log(error)
        }
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
      this.reservationDataCall(this.pageNowNum)
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
}
/* 답변 */
.hostAnswer{
  position: relative;
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
.dateBox{
  top: 2vh;
  right: 0.5vw;
  position: absolute;
  text-align: right;
}
.fa-pen-to-square:hover{
  color: blue
}
.fa-trash:hover{
  color: red;
}
.UpdateDeleteBtn{
  top: 0vh;
  right: 0.5vw;
  position: absolute;
  text-align: right;
}
.UpdateDeleteBtn i {
  margin-left: 0.5vw;
  margin-bottom: 0.5vh;
}
/* 답변작성 */
.qnacommentCreateBtn{
  font-size: 0.8rem;
  border-radius: 10px;
  padding: 0 0.5vw;
  background: rgba(128, 128, 128, 0.507);
  color: white;
  cursor: pointer;
}
.createBox{
  position: absolute;
  top: -5vh;
  right: 1vw;
  background: white;
  width: 30vw;
  border-radius: 10px;
  padding: 1vh 1vw;
  z-index: 2;
}
.qnacommentBox{
  width: 30vw;
  resize: none;
  height: 10vh;
}
.createBtn{
  border: 1px solid gray;
  border-radius: 10px;
  font-size: 0.8rem;
  padding: 0 0.5vw;
  cursor: pointer;
}
.contentCount{
  font-size: 0.8rem;
  float: right;
}
.warning{
  color: red;
}
/* 삭제 창 */
.deleteBox{
  position: absolute;
  text-align: center;
  bottom: 1vh;
  right: 7vw;
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
  height: 95.5vh;
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