<template>
  <form class="joinForm" @submit.prevent="joinCheck">
    <div class="roleSelectBox">
      <span :class="(role=='0')?'selectRole':'noSelectRole'" @click="roleSelect('0')">이용자</span>
      <span :class="(role=='1')?'selectRole':'noSelectRole'" @click="roleSelect('1')">공급자</span>
    </div>
    <div>
      <input v-model="email" class="emailBox joinFormItem" type="text" placeholder="이메일" @keyup="emailChange">
      @
      <select v-model="emailDomain" class="emailDomainBox joinFormItem" @change="domainCheck">
        <option v-for="(item, index) in emailDomains" :key="index" :value="item.value">
          {{ item.name }}
        </option>
      </select>
      <input type="button" value="메일인증" class="emailVeificaion" @click="emailVeificaionSend">
      <input v-if="ETCview" v-model="emailDomainETC" class="emailDomainETC joinFormItem" type="text" placeholder="기타주소"><br>
      <input v-model="emailVerificationCode" class="emailVerificationCode joinFormItem" type="text" placeholder="인증번호(6자리)" :disabled="emailVeificaion">
      <template v-if="emailVerificationCode">
        <p v-if="emailVerificationCode != emailVerificationCodeCheck" class="warning">
          인증번호가 일치하지 않습니다.
        </p>
        <p v-if="emailVerificationCode == emailVerificationCodeCheck" class="available">
          인증번호가 일치합니다.
        </p>
      </template>
      <template v-if="(emailVerificationCodeCheck == 500)">
        <p class="warning">
          사용중인 이메일입니다.
        </p>
      </template>
      <template v-if="(emailVerificationCodeCheck.length == 6 && emailVerificationCode == '')">
        <p class="available">
          메일로 인증번호가 발송되었습니다.
        </p>
      </template>
    </div>
    <div>
      <input id="pw" v-model="pw" class="pw joinFormItem" type="password" placeholder="비밀번호">
      <input id="pwCheck" v-model="pwCheck" class="pwCheck joinFormItem" type="password" placeholder="비밀번호확인" @keyup="pwMatchCheck" @change="pwMatchCheck">
      <p v-if="pwMatch" class="warning">
        비밀번호가 서로 다릅니다.
      </p>
    </div>
    <div>
      <input id="nickname" v-model="nickname" class="nickname joinFormItem" type="text" placeholder="닉네임" @keyup="nicknameChage">
      <input type="button" value="중복체크" class="nicknameCheck" @click="nicknameCheck">
      <template v-if="nicknameMessage == '200'">
        <p class="available">
          사용가능한 닉네임입니다.
        </p>
      </template>
      <template v-if="nicknameMessage == '500'">
        <p class="warning">
          사용중인 닉네임입니다.
        </p>
      </template>
    </div>
    <div>
      <input id="cellPhone" v-model="tel" class="cellPhone joinFormItem" type="text" placeholder="핸드폰번호 입력('-'제외)" maxlength="13" @keypress="telKeypress">
    </div>
    <div>
      <button id="submit" class="submit joinFormItem">
        회원가입
      </button>
    </div>
  </form>
</template>

<script>
import { mailCheck, nickCheck, registerMember } from '@/api/auth.js'
import { autoHypenPhone } from '@/utils/phoneCheck.js'
// import { registerUser } from '@/api/auth'
export default {
  data(){
    return {
      // 로그인 데이터
      role: '',
      email: '',
      emailDomain:'',
      emailDomains: [
        {name:'이메일주소',value:''},
        {name:'naver.com',value:'naver.com'},
        {name:'daum.net',value:'daum.net'},
        {name:'gmail.com',value:'gmail.com'},
        {name:'kakao.com',value:'kakao.com'},
        {name:'nate.com',value:'nate.com'},
        {name:'기타',value:'기타'},
      ],
      emailDomainETC:'',
      emailVerificationCode:'',
      pw: '',
      pwCheck: '',
      nickname: '',
      tel: '',
      // 화면 구성용 데이터
      ETCview: false,
      pwMatch: false,
      emailVeificaion: true,
      nicknameMessage: '',
      emailVerificationCodeCheck:'',
    }
  },
  methods: {
    // 권한 선택
    roleSelect(role){
      this.role = role
    },
    // 이메일 변경시도
    emailChange(){
      this.emailVeificaion = true
      this.emailVerificationCode = ''
    },
    // 도메인 선택
    domainCheck(){
      // console.log('실행')
      this.emailChange()
      if (this.emailDomain === '기타'){
        this.ETCview = true
      } else {
        this.ETCview = false
      }
    },
    // 이메일 인증
    async emailVeificaionSend(){
      if (this.email == '' || !this.email || !this.emailDomain || this.emailDomain === '기타' && !this.emailDomainETC){
        let message = '이메일을 입력해주세요'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        this.$store.dispatch('SPINNERVIEW')
        this.emailVerificationCode = ''
        let sendEmail = ''
        if (this.emailDomainETC === ''){
          sendEmail = {
            email : this.email +'@'+this.emailDomain,
          }
        } else {
          sendEmail = {
            email : this.email +'@'+this.emailDomainETC,
          }
        }
        try {
          console.log(sendEmail)
          this.$store.dispatch('SPINNERVIEW', true)
          let responce = await mailCheck(sendEmail)
          let message = '이메일로 인증번호가 전송되었습니다.'
          this.$store.dispatch('MODALVIEWCLICK', true)
          this.$store.dispatch('MODALMESSAGE', message)
          console.log(responce)
          this.emailVeificaion = false
          this.emailVerificationCodeCheck = responce.data
          console.log(this.emailVerificationCodeCheck)
          console.log(typeof(responce.data))
        } catch (error){
          console.log(error)
          this.emailVerificationCodeCheck = error.request.status
        }
        this.$store.dispatch('SPINNERVIEW', false)
      }
    },
    // 비밀번호 일치여부 확인
    pwMatchCheck(){
      if (this.pw === this.pwCheck){
        this.pwMatch = false
      } else {
        this.pwMatch = true
      }
    },
    // 닉네임 수정시도
    nicknameChage(){
      this.nicknameMessage = ''
    },
    // 닉네임체크
    async nicknameCheck(){
      if (this.nickname == '' || !this.nickname){
        let message = '닉네임을 입력해주세요'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        console.log(this.nickname)
        let name = {
          name: this.nickname,
        }
        try {
          let responce = await nickCheck(name)
          console.log(responce)
          console.log(responce.status)
          this.nicknameMessage = responce.status
        } catch (error){
          this.nicknameMessage = error.request.status
        }
      }
    },
    // 전화번호 '-' 자동 부여
    telKeypress(){
      const result = autoHypenPhone(this.tel)
      this.tel = result
    },
    // 회원가입 제출
    async joinOk(){
      let email = ''
      if (this.emailDomain === '기타'){
        email = this.email +'@'+ this.emailDomainETC
      } else {
        email = this.email +'@'+ this.emailDomain
      }
      const joinData = {
        'email': email,
        'pw': this.pw,
        'name': this.nickname,
        'tel': this.tel,
        'role': this.role,
      }
      // console.log(joinData)
      try {
        const responce = await registerMember(joinData)
        if (responce.status == 200){
          let message = '워크토크에 가입하신 것을 환영합니다.'
          this.$store.dispatch('MODALVIEWCLICK', true)
          this.$store.dispatch('MODALMESSAGE', message)
          return this.$router.push('/login')
        }
      } catch (error){
        console.log(error)
      }
    },
    // 회원가입 검증
    joinCheck(){
      let message = ''
      if (!this.role){
        message = '가입유형을 선택해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (!this.email || !this.emailDomain || this.emailDomain === '기타' && !this.emailDomainETC){
        message = '이메일을 확인해주세요'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (this.emailVerificationCode != this.emailVerificationCodeCheck){
        message = '이메일 인증을 완료해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (!this.pw || !this.pwCheck || this.pw !== this.pwCheck){
        message = '비밀번호를 확인해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (this.nicknameMessage == '500'){
        message = '사용중인 닉네임입니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (this.nicknameMessage != '200'){
        message = '닉네임 중복체크를 완료해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (!this.tel){
        message = '핸드폰 번호를 입력해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        this.joinOk()
      }
    },
  },
}
</script>

<style scoped>
.joinForm {
  position: relative;
  background: white;
  border-radius: 15px;
  height: 63vh;
  width: 45vw;
  padding: 5vh 2.5vw;
  text-align: left;
}
.roleSelectBox {
  margin-bottom: 2vh;
  cursor: pointer;
}
.roleSelectBox span {
  border: 2px solid gray;
  border-radius: 20px;
  padding: 0.3vw 3vw;
  margin: 0 3.5vw;
  letter-spacing: 1rem;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  width: 20vw;
}
.selectRole{
  color: white;
  background: rgba(42, 75, 165, 0.473);
}
.noSelectRole{
  background: white;
}
.joinFormItem{
  font-weight: bold;
  font-size: 1em;
  width: 38vw;
  height: 5vh;
  border: 2px solid gray;
  border-radius: 10px;
  margin-bottom: 1vh;
  padding-left: 5px;
}
.emailBox {
  width: 20vw;
}
.emailDomainBox {
  width: 16vw;
}
.emailDomainETC {
  width: 15vw;
}
.emailVeificaion, .nicknameCheck {
  font-weight: bold;
  padding: 0.5vh;
  border: 2px solid gray;
  border-radius: 10px;
  margin-left: 1vw;
  cursor: pointer;
  background: white;
}
#submit {
  background: rgb(103, 139, 218);
  color: white;
  letter-spacing: 1rem;
  width: 45vw;
  cursor: pointer;
}
.warning {
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