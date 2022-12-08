<template>
  <div>
    <button @click="textFunction">
      textBtn
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    textFunction(){
      const { IMP } = window
      IMP.init('imp82350026')

      const data = {
        merchant_uid: `mid_text`,
        company: '워크토크',
      }

      IMP.certification(data, this.callback)
    },
    callback(response){
      const {
        success,
        error_msg,
      } = response

      if (success){
        alert('본인인증 성공')
      } else {
        alert(`본인인증 실패: ${error_msg}`)
      }
    },
  },
}
</script>

<style>

</style>