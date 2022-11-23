<template>
  <div>
    main 구현 1순위...더미로 넣기
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
export default {
  created(){
    let token = this.$store.state.token
    let decode = jwt_decode(token)
    console.log(token)
    console.log(decode)
  },
}
</script>

<style>

</style>
