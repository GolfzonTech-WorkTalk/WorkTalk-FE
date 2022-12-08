<template>
  <div>
    <div class="CCBox">
      <div>
        <span class="CCtypelabel" :class="item.type">{{ typeCheck(item.type) }}</span>
        <span>{{ title }}</span>
        <p class="contentCount" :class="(content.length > 100)?'warning':''">
          {{ content.length }}/100자
        </p>
      </div>
      <template v-if="userType == 'ROLE_MASTER'">
        <textarea v-model="CCcomment" class="CCcontent" placeholder="답변을 작성해주세요." />
        <span class="CCbtn closeBtn" @click="emitClose(false)">닫기</span>
        <span class="CCbtn updateBtn" @click="CCupdate">수정</span>
      </template>
      <template v-else>
        <textarea v-model="content" class="CCcontent" placeholder="문의내용을 작성해주세요." />
        <span class="CCbtn closeBtn" @click="emitClose(false)">닫기</span>
        <span class="CCbtn updateBtn" @click="CCupdate">수정</span>
      </template>
    </div>
  </div>
</template>

<script>
import {CCUpdata} from '@/api/customerCenter.js'
export default {
  props: {
    item: {
      type:Object,
      required: true,
    },
  },
  emits: [ 'CC:close' ],
  data(){
    return {
      typeData: [
        {'name':'계정관련','value':'ACCOUNT'},
        {'name':'예약관련','value':'RESERVATION'},
        {'name':'결제관련','value':'PAYMENT'},
      ],
      // 제출데이터
      cc_id : '',
      type : '',
      title:'',
      content : '',
      CCcomment:'',
      // userType
      userType: '',
    }
  },
  created(){
    // console.log(this.item)
    this.cc_id = this.item.cc_id
    this.type = this.item.type
    this.title = this.item.title
    this.content = this.item.content
    this.CCcomment = this.item.CCcomment
    this.userType = this.$store.state.role
  },
  methods: {
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
    emitClose(value){
      this.$emit('CC:close', value)
    },
    async CCupdate(){
      if (this.contentCount.length == ''){
        let message = '내용이 없습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (this.contentCount.length > 100){
        let message = '내용이 100자를 초과하였습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        const CCUpdataData = {
          'cc_id': this.cc_id,
          'type': this.type,
          'title':this.title,
          'content': this.content,
          'CCcomment':this.CCcomment,
        }
        console.log(CCUpdataData)
        try {
          let response = await CCUpdata(this.cc_id, CCUpdataData)
          console.log(response)
          this.emitClose(false)
        } catch (error){
          console.log(error)
        }
      }
    },
  },
}
</script>

<style scoped>
.CCBox{
  position: absolute;
  border: 1px solid gray;
  border-radius: 10px;
  background: white;
  padding: 2vh 1.5vw;
  width: 30vw;
  height: 26vh;
  top: -10vh;
  right: 7vw;
  z-index: 2;
}
.CCBox div{
  text-align: left;
}
.CCcontent{
  margin: 1vh 0;
  width: 29vw;
  height: 15vh;
  resize: none;
  padding: 1vh 0.5vw;
}
.CCtitle{
  margin: 1vh 0;
  width: 29vw;
  resize: none;
  padding: 1vh 0.5vw;
}
.CCbtn{
  border: 1px solid gray;
  border-radius: 10px;
  padding: 0 0.5vw;
  float: right;
  margin-left: 1vw;
  cursor: pointer;
}
.updateBtn:hover{
  background: rgb(92, 92, 189);
  color: white;
}
.closeBtn:hover{
  background: rgb(165, 165, 165);
  color: white;
}
.contentCount{
  float: right;
  font-size: 0.8rem;
}
.warning{
  color: red;
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
</style>