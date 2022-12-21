<template>
  <div class="CCContainer">
    <div v-if="deleteCCNum != '답변삭제' || updateCCNum != '답변수정' || createCCNum != '답변작성'" class="backgroundCC" @click="deleteCCCancel" />
    <div class="SortCCBox">
      <select v-model="memberType" class="SortCCtype" @change="memberTypeChange(pageNowNum)">
        <option v-for="item in memberTypeData" :key="item" :value="item.value">
          {{ item.name }}
        </option>
      </select>
      <select v-model="CCtype" class="SortCCtype" @change="customerCenterCall(pageNowNum)">
        <template v-if="memberType == 'ROLE_USER'">
          <option v-for="item in userTypeData" :key="item" :value="item.value">
            {{ item.name }}
          </option>
        </template>
        <template v-if="memberType == 'ROLE_HOST'">
          <option v-for="item in hostTypeData" :key="item" :value="item.value">
            {{ item.name }}
          </option>       
        </template>
      </select>
    </div>
    <div v-for="item in CCData" :key="item" class="CCitem">
      <div class="typeLabelBox">
        <span class="CCtypelabel" :class="item.type">{{ typeCheck(item.type) }}</span>
        <p>{{ item.title }}</p>
        <p class="ccwriter">
          {{ item.writer }}
        </p>
      </div>
      <div class="updateDeleteBox">
        <p class="CCdate">
          {{ dateCheck(item.lastModifiedDate) }}
        </p>
      </div>
      <div class="contentBox">
        <p>{{ item.content }}</p>
      </div>
      <div v-if="item.ccContent != null" class="masterAnswer">
        <img src="@/assets/down-right.png" class="answerArrow">
        <span class="answerTitle">마스터의 답글</span>
        <span class="CCdate">{{ dateCheck(item.ccLastModifiedDate) }}</span>
        <p class="CCcontent">
          {{ item.ccContent }}
        </p>
        <i class="fa-solid fa-pen-to-square updateI" @click="updateCC(item)" />
        <i class="fa-solid fa-trash deleteI" @click="deleteCC(item)" />
        <template v-if="deleteCCNum == item.ccId">
          <div class="deleteBox">
            <p>답변을 삭제하시겠습니까?</p>
            <span class="deleteBtn deleteCCDo" @click="deleteCCSubmit(item)">삭 제</span>
            <span class="deleteBtn deleteCCCancel" @click="deleteCCCancel">취 소</span>
          </div>
        </template>
        <template v-if="(updateCCNum == item.ccId)">
          <FormCCupdate :item="item" @c-c:close="deleteCCCancel" @c-cupdate:update="customerCenterCall(pageNowNum)" />
        </template>
      </div>
      <div v-else>
        <span class="ccContentCreateBtn" @click="createCC(item)">답변작성</span>
        <template v-if="createCCNum == item.ccId">
          <div class="ccContentCreateBox">
            <span>답글작성</span>
            <span class="contentCount" :class="(ccContent.length > 100)?'warning':''">
              {{ ccContent.length }}/100자
            </span>
            <textarea v-model="ccContent" class="qnacommentBox" placeholder="답변을 작성해주세요." />
            <span class="createBtn createQnADo" @click="createccContentSubmit(item)">작 성</span>
            <span class="createBtn createQnACancel" @click="deleteCCCancel">취 소</span>
          </div>
        </template>
      </div>
    </div>
    <div class="pageNumber">
      <span><i class="fa-solid fa-chevron-left monthMoveBtn" @click="pageMove('pre')" /></span>
      <span v-for="num in pageData" :key="num" :class="num.class" @click="customerCenterCall(num.value)">{{ num.value }}</span>
      <span><i class="fa-solid fa-chevron-right" @click="pageMove('next')" /></span>
    </div>
  </div>
</template>

<script>
import {cccommentCreate, cccommentDelete, masterCCList} from '@/api/customerCenter.js'
import FormCCupdate from '../Form/FormCCupdate.vue'
export default {
  components: {
    FormCCupdate,
  },
  data(){
    return {
      memberType:'ROLE_USER',
      CCtype:'',
      memberTypeData: [
        {'name':'이용자','value':'ROLE_USER'},
        {'name':'공급자','value':'ROLE_HOST'},
      ],
      userTypeData: [
        {'name':'전체','value':''},
        {'name':'계정','value':'ACCOUNT'},
        {'name':'예약','value':'RESERVATION'},
        {'name':'결제','value':'PAYMENT'},
      ],
      hostTypeData: [
        {'name':'전체','value':''},
        {'name':'계정','value':'ACCOUNT'},
        {'name':'결제','value':'PAYMENT'},
        {'name':'공간','value':'SPACE'},
      ],
      CCData:[],
      deleteCCNum : '답변삭제',
      updateCCNum : '답변수정',
      createCCNum : '답변작성',
      content:'',
      ccContent:'',
      // 페이지 관리데이터
      pageStartNum: 1,
      pageNowNum:1,
      pageData:[],
      pageTotal:'',
    }
  },
  created(){
    this.customerCenterCall(this.pageNowNum)
  },
  methods: {
    // API 호출
    async customerCenterCall(pageNowNum){
      let CCtype = this.CCtype
      if (CCtype == '문의종류'){
        CCtype = ''
      }
      try {
        console.log(pageNowNum-1,this.memberType, this.CCtype)
        const response = await masterCCList(pageNowNum-1,this.memberType, CCtype)
        console.log(response.data)
        this.CCData = response.data.data
        this.pageTotal =  response.data.count
        this.paging(this.pageNowNum)
      } catch (error){
        console.log(error)
      }
      this.$store.dispatch('SPINNERVIEW', false)
    },
    memberTypeChange(pageNowNum){
      this.CCtype = ''
      this.customerCenterCall(pageNowNum)
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
      return value.slice(0,10)+' '+value.slice(11,16)
    },
    // 삭제수정작성
    deleteCC(item){
      this.deleteCCNum = item.ccId
    },
    updateCC(item){
      this.updateCCNum = item.ccId
      this.content = item.content
    },
    createCC(item){
      this.createCCNum = item.ccId
    },
    deleteCCCancel(){
      this.deleteCCNum = '답변삭제'
      this.updateCCNum = '답변수정'
      this.createCCNum = '답변작성'
      this.customerCenterCall(this.pageNowNum)
    },
    async deleteCCSubmit(item){
      try {
        let response = await cccommentDelete(item.ccCommentId)
        console.log(response)
        this.deleteCCCancel()
        this.customerCenterCall(this.pageNowNum)
      } catch (error){
        console.log(error)
      }
    },
    async createccContentSubmit(item){
      if (this.ccContent.length == ''){
        let message = '답글 내용이 없습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (this.ccContent.length > 100){
        let message = '답글이 100자를 초과하였습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        const ccContentData = {
          'ccId':item.ccId,
          'content':this.ccContent,
        }
        console.log(ccContentData)
        try {
          let response = await cccommentCreate(ccContentData)
          console.log(response)
          this.deleteCCCancel()
          this.customerCenterCall(this.pageNowNum)
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
      this.customerCenterCall(this.pageNowNum)
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
  margin-left: 1vw;
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
.ccContentCreateBtn{
  bottom: 1vh;
  right: 1vw;
  font-size: 0.8rem;
  border: 1px solid gray;
  border-radius: 10px;
  padding: 0 0.5vw;
  cursor: pointer;
}
.ccContentCreateBox{
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
.pageNumber{
  width: 50vw;
  text-align: center;
}
.ccwriter{
  position: absolute;
  right: 1vw;
  top: 5vh;
  font-size: 0.5rem;
}
</style>