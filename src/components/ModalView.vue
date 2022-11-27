<template>
  <div class="modalView">
    <div class="modalMassegeBox">
      <p class="modalMassege">
        {{ message }}
      </p>
      <p class="modalCloseMassege">
        창을 닫으려면<br>아무곳이나 클릭해 주세요.
      </p>
    </div>
    <div class="background" />
  </div>
</template>

<script>
export default {
  data(){
    return {
      message: this.$store.state.modalMessage,
    }
  },
}
</script>

<style scoped>
.modalView{
  position: absolute;
  z-index: 1;
}
.modalMassegeBox{
  font-weight: bold;
  letter-spacing: 0.3rem;
  text-align: center;
  position: absolute;
  background: white;
  border-radius: 20px;
  top: 20%;
  left: 30%;
  height: 10vh;
  width: 37vw;
}
.modalMassege {
  text-decoration: underline;
  margin-top: 2vh;
  color: brown;
  font-size: 1rem;
}
.modalCloseMassege{
  margin-top: 2.5vh;
  color: rgba(0, 0, 0, 0.411);
  font-size: 0.8rem;
}
.background {
  background: rgba(0, 0, 0, 0.514);
  height: 100vh;
  width: 100vw;
}
</style>