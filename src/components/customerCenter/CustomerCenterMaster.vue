<template>
  <div class="CCContainer">
    <div v-if="deleteCCNum != '답변삭제' || updateCCNum != '답변수정' || createCCNum != '답변작성'" class="backgroundCC" @click="deleteCCCancel" />
    <div class="SortCCBox">
      <select v-model="CCtype" class="SortCCtype" @change="CCDataCall()">
        <option value="문의종류" hidden>
          문의종류
        </option>
        <option v-for="item in CCtypeData" :key="item" :value="item.value">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div v-for="item in CCData" :key="item" class="CCitem">
      <div class="typeLabelBox">
        <span class="CCtypelabel" :class="item.type">{{ typeCheck(item.type) }}</span>
        <p>{{ item.title }}</p>
      </div>
      <div class="updateDeleteBox">
        <p class="CCdate">
          {{ dateCheck(item.cc_date) }}
        </p>
      </div>
      <div class="contentBox">
        <p>{{ item.content }}</p>
      </div>
      <div v-if="item.CCcomment != ''" class="masterAnswer">
        <img src="@/assets/down-right.png" class="answerArrow">
        <span class="answerTitle">마스터의 답글</span>
        <span class="CCdate">{{ dateCheck(item.qclastModifiedDate) }}</span>
        <p class="CCcontent">
          {{ item.CCcomment }}
        </p>
        <i class="fa-solid fa-pen-to-square updateI" @click="updateCC(item)" />
        <i class="fa-solid fa-trash deleteI" @click="deleteCC(item)" />
        <template v-if="deleteCCNum == item.cc_id">
          <div class="deleteBox">
            <p>답변을 삭제하시겠습니까?</p>
            <span class="deleteBtn deleteCCDo" @click="deleteQnASubmit(item)">삭 제</span>
            <span class="deleteBtn deleteCCCancel" @click="deleteCCCancel">취 소</span>
          </div>
        </template>
        <template v-if="(updateCCNum == item.cc_id)">
          <FormCCupdate :item="item" @c-c:close="deleteCCCancel" />
        </template>
      </div>
      <div v-else>
        <span class="CCcommentCreateBtn" @click="createCC(item)">답변작성</span>
        <template v-if="createCCNum == item.cc_id">
          <div class="CCcommentCreateBox">
            <span>답글작성</span>
            <span class="contentCount" :class="(CCcomment.length > 100)?'warning':''">
              {{ CCcomment.length }}/100자
            </span>
            <textarea v-model="CCcomment" class="qnacommentBox" placeholder="답변을 작성해주세요." />
            <span class="createBtn createQnADo" @click="createCCcommentSubmit(item)">작 성</span>
            <span class="createBtn createQnACancel" @click="deleteCCCancel">취 소</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {CCDelete} from '@/api/customerCenter.js'
import {customerCenterDummy} from '@/utils/dummy/customerCenterDummy.js'
import FormCCupdate from '../Form/FormCCupdate.vue'
export default {
  components: {
    FormCCupdate,
  },
  data(){
    return {
      CCtype:'문의종류',
      CCtypeData: [
        {'name':'계정','value':'ACCOUNT'},
        {'name':'예약','value':'RESERVATION'},
        {'name':'결제','value':'PAYMENT'},
      ],
      CCData:[],
      deleteCCNum : '답변삭제',
      updateCCNum : '답변수정',
      createCCNum : '답변작성',
      content:'',
      CCcomment:'',
    }
  },
  created(){
    this.customerCenterCall()
  },
  methods: {
    // API 호출
    async customerCenterCall(){
      this.CCData = customerCenterDummy
    },
    // 출력데이터 수정
    typeCheck(value){
      if (value == 'ACCOUNT'){
        return '계정'
      } else if (value == 'RESERVATION'){
        return '예약'
      } else if (value == 'PAYMENT'){
        return '결제'
      }
    },
    dateCheck(value){
      let date = value.slice(0,10)
      let time = value.slice(11,16)
      return `${date} ${time}`
    },
    // 삭제수정작성
    deleteCC(item){
      this.deleteCCNum = item.cc_id
    },
    updateCC(item){
      this.updateCCNum = item.cc_id
      this.content = item.content
    },
    createCC(item){
      this.createCCNum = item.cc_id
    },
    deleteCCCancel(){
      this.deleteCCNum = '답변삭제'
      this.updateCCNum = '답변수정'
      this.createCCNum = '답변작성'
    },
    async deleteQnASubmit(item){
      try {
        let response = await CCDelete(item.cc_id)
        console.log(response)
        this.deleteCCCancel()
        this.customerCenterCall()
      } catch (error){
        console.log(error)
      }
    },
    async createCCcommentSubmit(item){
      if (this.qnacomment.length == ''){
        let message = '답글 내용이 없습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (this.qnacomment.length > 100){
        let message = '답글이 100자를 초과하였습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        const CCcommentData = {
          cc_id:item.cc_id,
          CCcomment:this.CCcomment,
        }
        try {
          let response = await CCDelete(CCcommentData)
          console.log(response)
          this.deleteCCCancel()
          this.customerCenterCall()
        } catch (error){
          console.log(error)
        }
      }
    },
  },
}
</script>

<style scoped>
.CCContainer{
  position: relative;
  padding: 0.5vh 2vw;
  width: 50vw;
  height: 94.5vh;
  background: white;
  overflow-y: scroll;
}
.CCContainer::-webkit-scrollbar{
  display: none;
}
/* 정렬 */
.SortCCBox{
  width: 50vw;
  font-size: 2rem;
  font-weight: bold;
  text-align: right;
  margin: 2vh 0;
}
.SortCCtype{
  width: 8vw;
  letter-spacing: 0.3rem;
  font-size: 1.1rem;
  font-weight: bold;
}
/* 아이템 박스 틀 */
.CCitem{
  position: relative;
  border: 2px solid gray;
  border-radius: 10px;
  width: 48vw;
  padding: 2vh 1vw;
  margin-bottom: 3vh;
}
.updateDeleteBox{
  text-align: right;
  position:absolute;
  top: 2vh;
  right: 1vw;
}
.contentBox{
  margin-top: 1vh;
  border-top: 2px solid gray;
  padding-top: 1vh;
}
/* 라벨 */
.CCtypelabel{
  border-radius: 10px;
  padding: 0 0.5vw;
  font-size: 0.8rem;
  letter-spacing: 0.1rem;
  color: white;
}
.ACCOUNT{
  background: rgb(223, 191, 172);
}
.RESERVATION{
  background: rgb(131, 183, 226)
}
.PAYMENT{
  background: rgb(199, 135, 224);
}
/* 제목 */
.typeLabelBox p{
  font-size: 1rem;
  font-weight: bold;
}
/* 내용 */
.contentBox{
  font-size: 0.8rem;
}
/* 날짜 */
.CCdate{
  font-size: 0.8rem;
  font-weight: bold;
  color: rgb(97, 97, 97);
}
/* 삭제, 수정, 작성 배경 */
.backgroundCC{
  position: absolute;
  background: rgba(0, 0, 0, 0.212);
  top: 0;
  right: 0;
  width: 54vw;
  height: 95.5vh;
  z-index: 1;
}
/* 삭제박스 */
.deleteBox{
  position: absolute;
  text-align: center;
  top: -5vh;
  right: 13vw;
  background: white;
  width: 20vw;
  border-radius: 10px;
  padding: 1vh 1vw;
  z-index: 2;
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
.deleteCCDo:hover{
  background: rgb(223, 69, 69);
  color: white;
}
.deleteCCCancel{
  margin-left: 0.5vw;
}
.deleteCCCancel:hover{
  background: rgb(165, 165, 165);
  color: white;
}
/* 답변 */
.masterAnswer{
  position: relative;
  margin-top: 2vh;
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
.CCcontent{
  margin-left: 1.5vw;
  font-size: 0.8rem;
}
.masterAnswer i{
  position: absolute;
  top: 0;
}
.updateI{
  right: 1.5vw;
}
.deleteI{
  right: 0vw;
}
/* 답변작성 */
.CCcommentCreateBtn{
  position: absolute;
  bottom: 1vh;
  right: 1vw;
  font-size: 0.8rem;
  border: 1px solid gray;
  border-radius: 10px;
  padding: 0 0.5vw;
  cursor: pointer;
}
.CCcommentCreateBox{
  position: absolute;
  top: 0vh;
  left: 10vw;
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
</style>