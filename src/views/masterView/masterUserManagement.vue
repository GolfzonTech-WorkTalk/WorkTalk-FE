<template>
  <div class="masterSpaceContainer">
    <div>
      <div class="masterSpaceTitle">
        <span :class="(pageView)?'NowView':'NoView'" @click="pageViewChange">이용자관리</span>
        <span :class="(pageView)?'NoView':'NowView'" @click="pageViewChange">공급자관리</span>
      </div>
      <div>
        <template v-if="pageView">
          <user-management />
        </template>
        <template v-else>
          <host-management />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import UserManagement from '@/components/master/UserManagement.vue'
import HostManagement from '@/components/master/HostManagement.vue'
export default {
  components: {
    UserManagement,
    HostManagement,
  },
  data(){
    return {
      pageView: true,
    }
  },
  methods: {
    pageViewChange(){
      this.pageView = !this.pageView
    },
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
}
.NowView{
  border-bottom: 5px solid rgb(0, 0, 0);
  pointer-events: none;
}
.NoView{
  color: gray;
  cursor: pointer;
}
</style>