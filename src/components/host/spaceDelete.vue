<template>
  <div class="deleteBox">
    <p>해당공간을 정말<br><strong>삭제</strong>하시겠습니까?</p>
    <span class="deleteBtn" @click="deleteOk">삭제</span>
    <span class="deleteCancelBtn" @click="deleteCancel">취소</span>
  </div>
</template>

<script>
export default {
  emits:['space-delte','space-delete-cancel'],
  methods:{
    deleteOk(){
      this.$emit('space-delte')
    },
    deleteCancel(){
      let value = false
      this.$emit('space-delete-cancel', value)
    },
  },
}
</script>

<style scoped>
.deleteBox {
  position: absolute;
  background: rgba(0, 0, 0, 0.452);
  border-radius: 10px;
  top: 0;
  left: 0;
  width: 15vw;
  height: 23vh;
  padding: 1vw;
  font-size: 1.2rem;
  text-align: center;
  color: white;
  z-index: 1;
}
.deleteBox p {
  margin-top: 5vh;
  margin-bottom: 3vh;
}
.deleteBox strong {
  color: red;
}
.deleteBtn, .deleteCancelBtn{
  padding: 1vw;
}
.deleteBtn:hover {
  color: red;
}
.deleteCancelBtn:hover {
  color: black;
}
</style>