<template>
  <div class="profileBox">
    <div v-if="goodByeView" class="leaveClubBackground" />
    <div>
      <div class="profileTitle">
        <span>프로필 관리</span>
      </div>
      <div>
        <profile-view @member-id:call="memberIdCall" />
      </div>
      <div class="goodByeBox">
        <span class="goodByeBtn" @click="goodByeWorkTalk">탈퇴하기</span>
      </div>
    </div>
    <template v-if="goodByeView">
      <div class="goodBye">
        <p class="goodByeTitle">
          정말 탈퇴하시겠습니까?
        </p>
        <p class="goodByeExplain">
          탈퇴하실 경우 기존에 이용한 모든 데이터는 삭제됩니다
        </p>
        <p class="goodByeCancel" @click="goodByeWorkTalkCancel">
          아니요
        </p>
        <p class="goodByeDone" @click="goodByeWorkTalkDone">
          예,탈퇴하겠습니다
        </p>
      </div>
    </template>
  </div>
</template>

<script>
import { deleteCookie } from '@/utils/cookies'
import {memberLeave} from '@/api/auth.js'
import ProfileView from '@/components/profile/profileView.vue'
export default {
  components: {
    ProfileView,
  },
  data(){
    return {
      goodByeView:false,
      memberId:'',
    }
  },
  methods: {
    memberIdCall(memberId){
      this.memberId = memberId
    },
    goodByeWorkTalk(){
      this.goodByeView = true
    },
    goodByeWorkTalkCancel(){
      this.goodByeView = false
    },
    async goodByeWorkTalkDone(){
      try {
        const response = await memberLeave(this.memberId)
        // console.log(response)
        if (response.status == 200){
          this.$store.commit('setlogoutUser')
          deleteCookie('token')
          deleteCookie('email')
          deleteCookie('userType')
          let message = '회원 탈퇴처리가 완료되었습니다.'
          this.$store.dispatch('MODALVIEWCLICK', true)
          this.$store.dispatch('MODALMESSAGE', message)
          this.$router.push('/')
        }
      } catch (error){
        console.log(error)
      }
    },
  },
}
</script>

<style scoped>
.leaveClubBackground{
  background: rgba(0, 0, 0, 0.123);
  position: absolute;
  top: -10vh;
  width: 100vw;
  height: 140vh;
  z-index: 1;
}
.profileBox{
  position: relative;
  justify-content: center;
  background: rgb(230, 230, 230);
  display: flex;
  height: 110vh;
}
.profileTitle{
  margin: 5vh 0;
  text-align: center;
}
.profileTitle span {
  border-radius: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1rem;
  padding: 0 3vw;
  margin: 0 2vw;
  background: white;
  border-bottom: 5px solid rgb(0, 0, 0);
}
.goodByeBox {
  text-align: center;
  margin-top: 2vh;
}
.goodByeBtn{
  border: 1px solid gray;
  border-radius: 10px;
  padding: 0 1vw;
  font-size: 0.8rem;
  font-weight: bold;
  color: rgb(143, 39, 39);
  background: white;
  cursor: pointer;
}
.goodByeBtn:hover{
  background: rgb(143, 39, 39);
  color: white;
}
.goodBye{
  background: white;
  border-radius: 15px;
  position: absolute;
  top: 20%;
  width: 17vw;
  height: 21vh;
  padding: 2vh 2vw;
  z-index: 2;
}
.goodByeTitle{
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1vh;
}
.goodByeExplain{
  color: gray;
  margin-bottom: 1vh;
}
.goodByeCancel, .goodByeDone{
  background: rgba(212, 212, 212, 0.445);
  border-radius: 10px;
  text-align: center;
  padding: 0.5vh;
  cursor: pointer;
}
.goodByeCancel {
  margin-bottom: 1vh;
}
.goodByeDone:hover{
  background: rgb(116, 116, 206);
  color: white;
}
</style>