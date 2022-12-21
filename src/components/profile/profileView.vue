<template>
  <div class="profileContainer">
    <div v-if="updateTitle != ''" class="updateBackground" />
    <div>
      <div class="profileTextBox">
        <div>
          <span class="textTitle">닉네임</span>
          <span class="textContent">{{ userData.name }}</span>
        </div>
        <div>
          <span class="textTitle">이메일</span>
          <span class="textContent">{{ userData.email }}</span>
        </div>
        <div>
          <span class="textTitle">연락처</span>
          <span class="textContent">{{ userData.tel }}</span>
          <span class="updateBtn" @click="updateProfile('연락처수정')">연락처수정</span>
        </div>
        <div v-if="!userData.kakao">
          <span class="updateBtn" @click="updateProfile('비밀번호수정')">비밀번호수정</span>
        </div>
      </div>
      <template v-if="updateTitle != ''">
        <div class="updateBox">
          <p class="updateTitle">
            {{ updateTitle }}
          </p>
          <template v-if="updateTitle == '연락처수정'">
            <input id="cellPhone" v-model="updateInputData" class="telUpdate" type="text" :placeholder="userData.tel" maxlength="13" @keypress="telKeypress">
          </template>
          <template v-if="updateTitle == '비밀번호수정'">
            <input v-model="updateInputData" class="pwUpdate" type="password" placeholder="변경할 비밀번호"><br>
            <input v-model="pwCheck" class="pwUpdate" type="password" placeholder="비밀번호확인" @keyup="pwMatchCheck" @change="pwMatchCheck">
            <p v-if="pwMatch" class="warning">
              비밀번호가 서로 다릅니다.
            </p>
          </template>
          <div>
            <span class="updateCheckBtn" @click="updateCheck">수 정</span>
            <span class="updateCancelBtn" @click="updateCancel">닫 기</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {userData, profileUpdate} from '@/api/auth.js'
import { autoHypenPhone } from '@/utils/phoneCheck.js'
import { deleteCookie } from '@/utils/cookies'
export default {
  emits:['member-id:call'],
  data(){
    return {
      userData: {},
      // 변경체크데이터
      updateInputData:'',
      nicknameMessage:'',
      pwCheck:'',
      pwMatch:'',
      // 업데이트창
      updateTitle:'',
    }
  },
  created(){
    this.callUserData()
  },
  methods: {
    async callUserData(){
      try {
        const response = await userData()
        this.userData = response.data
        this.$emit('member-id:call', this.userData.id)
      } catch (error){
        console.log(error)
      }
      this.$store.dispatch('SPINNERVIEW', false)
    },
    updateProfile(value){
      this.updateTitle = value
    },
    updateCancel(){
      this.updateTitle = ''
      this.updateInputData = ''
    },
    // 전화번호 '-' 자동 부여
    telKeypress(){
      const result = autoHypenPhone(this.updateInputData)
      this.updateInputData = result
    },
    // 비밀번호 일치여부 확인
    pwMatchCheck(){
      if (this.updateInputData === this.pwCheck){
        this.pwMatch = false
      } else {
        this.pwMatch = true
      }
    },
    // 업데이트체크
    updateCheck(){
      // const title = this.updateTitle
      let message = ''
      if (this.updateInputData == ''){
        message = '수정정보를 입력해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (this.updateTitle == '비밀번호수정'){
        if (this.pwCheck == ''){
          message = '비밀번호 확인을 입력해주세요.'
          this.$store.dispatch('MODALVIEWCLICK', true)
          this.$store.dispatch('MODALMESSAGE', message)
        } else if (this.updateInputData != this.pwCheck){
          message = '수정 비밀번호가 일치하지 않습니다.'
          this.$store.dispatch('MODALVIEWCLICK', true)
          this.$store.dispatch('MODALMESSAGE', message)
        } else {
          this.updateSubmit(this.updateTitle)
        }
      } else {
        this.updateSubmit(this.updateTitle)
      }
    },
    async updateSubmit(title){
      if (title == '연락처수정'){this.userData.tel = this.updateInputData}
      else if (title == '비밀번호수정'){this.userData.pw = this.updateInputData}
      const updateData = {
        id:this.userData.id,
        pw:this.userData.pw,
        tel:this.userData.tel,
      }
      console.log(updateData)
      try {
        const response = await profileUpdate(updateData)
        console.log(response)
        this.updateCancel()
        this.$store.commit('setlogoutUser')
        deleteCookie('token')
        deleteCookie('email')
        deleteCookie('userType')
        if (title == '비밀번호수정'){
          let message = '변경된 비밀번호로 로그인해주세요.'
          this.$store.dispatch('MODALVIEWCLICK', true)
          this.$store.dispatch('MODALMESSAGE', message)
          this.$router.push('/login')
        }
      } catch (error){
        console.log(error)
      }
    },
  },
}
</script>

<style scoped>
.profileContainer{
  position: relative;
  width: 40vw;
  height: 23vh;
  padding: 1vh 2vw;
  background: white;
}
.profileTextBox{
  position: relative;
  height: 23vh;
  padding: 1vh 0vw;
  line-height: 5vh;
}
.profileTextBox div{
  position: relative;
}
.textTitle{
  font-weight: bold;
  margin: 0 1vw;
}
.textContent{
  font-size: 0.9rem;
}
/* 업데이트 버튼 */
.updateBtn{
  position: absolute;
  top: 1vh;
  right: 1vw;
  border: 1px solid gray;
  border-radius: 10px;
  padding: 0 1vw;
  line-height: 3vh;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
}
.updateBtn:hover{
  background: rgba(131, 124, 226, 0.397);
  color: white;
}
/* 업데이트 박스 */
.updateBox{
  background: white;
  position: absolute;
  border-radius: 20px;
  width: 20vw;
  height: 20vh;
  padding: 2vh 1vw;
  top: 0.5vh;
  right: 11vw;
  z-index: 1;
}
.updateTitle{
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1vh;
}
.telUpdate, .pwUpdate{
  font-weight: bold;
  font-size: 1em;
  width: 19vw;
  height: 3vh;
  border: 2px solid gray;
  border-radius: 10px;
  margin-bottom: 1vh;
  padding-left: 5px;
}
/* 업데이트 버튼 */
.updateBox div{
  position: absolute;
  bottom: 2vh;
  right: 1vw;
}
.updateCheckBtn, .updateCancelBtn{
  border: 1px solid gray;
  border-radius: 10px;
  padding: 0 0.5vw;
  font-size: 0.9rem;
  font-weight: bold;
  margin-left: 0.5vw;
}
.updateCheckBtn:hover{
  background: rgb(116, 116, 199);
  color: white;
}
.updateCancelBtn:hover{
  background: rgba(0, 0, 0, 0.24);
  color: white;
}
/* 백그라운드 */
.updateBackground{
  position: absolute;
  top: 0;
  left: 0;
  width: 44vw;
  height: 25vh;
  background: rgba(0, 0, 0, 0.212);
  z-index: 1;
}
.warning{
  font-size: 1em;
  font-weight: bold;
  color: brown;
  margin-bottom: 1vh;
}
.available {
  font-size: 1em;
  font-weight: bold;
  color: rgb(42, 50, 165);
  margin-bottom: 1vh;
}
</style>