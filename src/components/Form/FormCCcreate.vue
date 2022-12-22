<template>
  <div>
    <div class="CCBox">
      <select v-model="type" class="CCtype">
        <option value="문의종류" hidden>
          문의종류
        </option>
        <option v-for="item in typeData" id="" :key="item" :value="item.value">
          {{ item.name }}
        </option>
      </select>
      <p class="contentCount" :class="(title.length > 20)?'warning':''">
        {{ title.length }}/20자
      </p>
      <input v-model="title" class="CCtitle" type="text" placeholder="문의제목을 작성해주세요.">
      <p class="contentCount" :class="(content.length > 100)?'warning':''">
        {{ content.length }}/100자
      </p>
      <textarea v-model="content" class="CCcontent" placeholder="문의내용을 작성해주세요." />
      <span class="CCbtn" @click="emitClose(false)">닫기</span>
      <span class="CCbtn" @click="ccCreateCheck">작성</span>
    </div>
  </div>
</template>

<script>
import {ccCreate} from '@/api/customerCenter.js'
export default {
  emits: [ 'CC:close', 'CCcreate:create' ],
  data(){
    return {
      typeData: [
        {'name':'계정관련','value':'ACCOUNT'},
        {'name':'예약관련','value':'RESERVATION'},
        {'name':'결제관련','value':'PAYMENT'},
      ],
      // 제출데이터
      type : '문의종류',
      title:'',
      content : '',
    }
  },
  methods: {
    emitClose(value){
      this.$emit('CC:close', value)
    },
    ccCreateCheck(){
      let message
      if (this.type == '문의종류'){
        message = '문의종류를 선택해 주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (this.title.length == ''){
        message = '문의제목이 없습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (this.title.length > 20){
        message = '문의제목이 20자를 초과하였습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (this.content.length == ''){
        message = '문의내용이 없습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (this.content.length > 100){
        message = '문의내용이 100자를 초과하였습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        console.log('실행')
        this.ccCreate()
      }
    },
    async ccCreate(){
      const CCData = {
        'type': this.type,
        'title':this.title,
        'content': this.content,
      }
      console.log(CCData)
      try {
        let response = await ccCreate(CCData)
        console.log(response)
        if (response.status == 200){
          this.$emit('CCcreate:create')
        }
      } catch (error){
        console.log(error)
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
  height: 35vh;
  top: 10%;
  left: 20%;
  z-index: 2;
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
.CCbtn:hover{
  background: rgb(92, 92, 189);
  color: white;
}
.contentCount{
  float: right;
  font-size: 0.8rem;
}
.warning{
  color: red;
}
</style>