<template>
  <div class="paymentBox">
    <div>
      <div class="paymentTitle">
        <span>정산관리</span>
      </div>
      <div>
        <payments-host-vue />
      </div>
    </div>
  </div>
</template>

<script>
import PaymentsHostVue from '@/components/payments/PaymentsHost.vue'
export default {
  components: {
    PaymentsHostVue,
  },
}
</script>

<style scoped>
.paymentBox{
  position: relative;
  justify-content: center;
  background: rgb(230, 230, 230);
  display: flex;
  height: 110vh;
}
.paymentTitle{
  margin: 5vh 0;
  text-align: center;
}
.paymentTitle span{
  border-radius: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1rem;
  padding: 0 3vw;
  margin: 0 2vw;
  background: white;
  border-bottom: 5px solid rgb(0, 0, 0);
}
</style>