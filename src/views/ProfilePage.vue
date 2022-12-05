<template>
  <div class="profileBox">
    <div>
      <div class="profileTitle">
        <span>프로필 관리</span>
      </div>
      <div>
        <profile-view />
      </div>
      <div class="goodByeBox">
        <span class="goodByeBtn">탈퇴하기</span>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileView from '@/components/profile/profileView.vue'
export default {
  components: {
    ProfileView,
  },
}
</script>

<style scoped>
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
  cursor: pointer;
  color: rgb(143, 39, 39);
  background: white;
}
.goodByeBtn:hover{
  background: rgb(143, 39, 39);
  color: white;
}
</style>