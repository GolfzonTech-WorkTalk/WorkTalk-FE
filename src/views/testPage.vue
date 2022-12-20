<template>
  <div>
    <input v-model="result.roomId" type="text">
    <input v-model="result.checkInDate" type="text">
    <input v-model="result.checkOutDate" type="text">
    <input v-model="result.checkInTime" type="text">
    <input v-model="result.checkOutTime" type="text">
    <input v-model="result.spaceType" type="text">
    <p class="testBtn" @click="click">
      클릭
    </p>
    <div>
      <span @click="getCurrentPosition()">위치 좌표 확인</span>
      <div>{{ isPositionReady ? 'yes' : 'no' }}</div>
    </div>
  </div>
</template>

<script>
import {test} from '@/api/test.js'
export default {
  data(){
    return {
      result:{
        roomId:'1',
        checkInDate:'2022-12-17',
        checkOutDate:'2022-12-19',
        checkInTime:'12',
        checkOutTime:'17',
        spaceType:'1',
      },
      positionObj: {},
      isPositionReady: false,
    }
  },
  created(){
    this.$store.dispatch('SPINNERVIEW', false)
  },
  methods: {
    async click(){
      console.log(this.result)
      const response = await test(this.result)
      console.log(response)
    },
    getCurrentPosition(){
      if (!navigator.geolocation){
        this.setAlert('위치 정보를 찾을 수 없습니다.1')
      } else {
        navigator.geolocation.getCurrentPosition(this.getPositionValue, this.geolocationError)
      }
    },
    getPositionValue(val){
      this.positionObj.latitude = val.coords.latitude
      this.positionObj.longitude = val.coords.longitude
      this.isPositionReady = true
      this.setAlert('주소 확인 완료')
    },
    geolocationError(){
      this.setAlert('위치 정보를 찾을 수 없습니다.2')
    },
    setAlert(text){
      alert(text)
    },
  },
}
</script>

<style scoped>
.testBtn{
  cursor: pointer;
}
</style>