<template>
  <div class="masterPageContainer">
    <router-link to="master/space">
      <div class="masterPageItem">
        <i class="fa-solid fa-building-circle-check fa-4x" />
        <p>공간관리</p>
      </div>
    </router-link>
    <router-link to="/master/customercneter">
      <div class="masterPageItem">
        <i class="fa-solid fa-headset fa-4x" />
        <p>1:1문의</p>
      </div>
    </router-link>
    <router-link to="/master/memberManagement/user">
      <div class="masterPageItem">
        <i class="fa-regular fa-id-card fa-4x" />
        <p>계정관리</p>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.masterPageContainer{
  position: relative;
  justify-content: center;
  background: rgb(230, 230, 230);
  display: flex;
  height: 110vh;
}
.masterPageItem{
  margin: 20vh 2vw;
  border-radius: 10px;
  text-align: center;
  background: white;
  width: 20vw;
  height: 28vh;
  cursor: pointer;
}
.masterPageItem i{
  margin-top: 6vh;
  margin-bottom: 2vh;
}
.masterPageItem p{
  font-weight: bold;
}
</style>