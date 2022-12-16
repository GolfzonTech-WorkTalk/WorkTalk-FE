<template>
  <div>
    <router-link to="/host/spaceCreate">
      <div class="spaceCreate">
        <span class="linkText">새공간등록</span>
      </div>
    </router-link>
    <div class="spaceAllContainer">
      <main-page-space-module v-for="spaceItem in spaceItems" :key="spaceItem" :space-item="spaceItem" @space-delete-call="spaceAllCall" />
    </div>
  </div>
</template>

<script>
import MainPageSpaceModule from '@/components/host/MainPageSpaceModule.vue'
import { spaceAll } from '@/api/host.js'
// import { spaceDumy } from '@/utils/dummy'
// import jwt_decode from 'jwt-decode'
export default {
  components:{
    MainPageSpaceModule,
  },
  data(){
    return {
      spaceItems: [],
    }
  },
  created(){
    this.spaceAllCall()
  },
  methods: {
    async spaceAllCall(){
      try {
        let nickName = this.$store.state.nickName
        // console.log(nickName)
        const responce = await spaceAll(nickName)
        // console.log(responce)
        this.spaceItems = responce.data
      } catch (error){
        console.log(error)
      }
      this.$store.dispatch('SPINNERVIEW', false)
    },
  },
}
</script>

<style scoped>
.spaceCreate {
  margin: auto;
  margin-top: 1vh;
  margin-bottom: 1vh;
  height: 5vh;
  width: 30vw;
  background: rgba(4, 0, 255, 0.377);
  text-align: center;
  font-size: 1.3rem;
  line-height: 5vh;
  letter-spacing: 1rem;
  cursor: pointer;
  border-radius: 10px;
}
.linkText {
  color: white;
}
.spaceAllContainer {
  font-size: 0.9rem;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  margin: auto;
  width: 80vw;
  height: 80vh;
}
</style>