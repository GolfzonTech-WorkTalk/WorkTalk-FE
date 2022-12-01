<template>
  <div>
    <div class="QnABox">
      <p>문의작성</p>
      <select id="" name="">
        <option value="">
          문의종류
        </option>
        <option value="" />
      </select>
      <textarea id="" name="" cols="30" rows="10" placeholder="문의내용을 작성해주세요." />
    </div>
    <div class="background" @click="boxClose()" />
  </div>
</template>

<script>
export default {
  data(){
    return {
      typeData: [
        {'name':'예약관련','value':'RESERVE'},
        {'name':'결제관련','value':'PAY'},
        {'name':'이용관련','value':'USING'},
      ],
      // 제출데이터
      spaceId : this.$route.params.spaceId,
      type : '',
      content : '',
    }
  },
  methods: {
    boxClose(){
      this.background = false
    },
  },
}
</script>

<style scoped>
.QnABox{
  position: absolute;
  border: 1px solid gray;
  background: white;
  width: 35vw;
  height: 33vh;
  top: 30%;
  left: 33%;
  z-index: 2;
}
.background{
  position: absolute;
  background: rgba(0, 0, 0, 0.356);
  top: 0;
  left: -10vw;
  width: 110vw;
  height: 110vh;
  z-index: 1;
}
</style>