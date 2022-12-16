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
  },
}
</script>

<style scoped>
.testBtn{
  cursor: pointer;
}
</style>