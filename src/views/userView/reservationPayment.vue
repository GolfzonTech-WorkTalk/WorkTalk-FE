<template>
  <div class="reservationPaymentPage">
    <div>
      <div class="reservationTitle">
        <span>예약하기</span>
      </div>
      <div>
        <payment-confirmed />
      </div>
    </div>
  </div>
</template>

<script>
import PaymentConfirmed from '@/components/reservation/PaymentConfirmed.vue'
export default {
  components:{
    PaymentConfirmed,
  },
  created(){
    this.$store.dispatch('SPINNERVIEW', false)
  },
}
</script>

<style scoped>
.reservationPaymentPage{
  position: relative;
  display: flex;
  justify-content: center;
  background: rgb(230, 230, 230);
  height: 110vh;
}
.reservationTitle{
  margin: 5vh 0;
  text-align: center;
}
.reservationTitle span{
  border-radius: 20px;
  border-bottom: 5px solid rgb(0, 0, 0);
  pointer-events: none;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1rem;
  padding: 0 3vw;
  margin: 0 2vw;
  background: white;
}
</style>