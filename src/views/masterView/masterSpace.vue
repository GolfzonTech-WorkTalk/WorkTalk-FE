<template>
  <div class="masterSpaceContainer">
    <div>
      <div class="masterSpaceTitle">
        <span>공간관리</span>
      </div>
      <div>
        <space-management />
      </div>
    </div>
  </div>
</template>

<script>
import SpaceManagement from '@/components/master/SpaceManagement.vue'
export default {
  components: {
    SpaceManagement,
  },
}
</script>

<style scopd>
.masterSpaceContainer{
  position: relative;
  justify-content: center;
  background: rgb(230, 230, 230);
  display: flex;
  height: 110vh;
}
.masterSpaceTitle{
  margin: 5vh 0;
  text-align: center;
}
.masterSpaceTitle span {
  border-radius: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1rem;
  padding: 0 3vw;
  margin: 0 2vw;
  background: white;
  border-bottom: 5px solid rgb(0, 0, 0);
}
</style>