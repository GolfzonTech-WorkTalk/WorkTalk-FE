<template>
  <div class="paymentBox">
    <div>
      <div class="paymentTitle">
        <span :class="(pageView)?'NowView':'NoView'" @click="pageViewChange">결제내역</span>
        <span :class="(pageView)?'NoView':'NowView'" @click="pageViewChange">마일리지</span>
      </div>
      <div>
        <template v-if="pageView">
          <payments-user-vue />
        </template>
        <template v-else>
          <mileage-user-vue />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import PaymentsUserVue from '@/components/payments/PaymentsUser.vue'
import MileageUserVue from '@/components/payments/MileageUser.vue'
export default {
  components: {
    PaymentsUserVue,
    MileageUserVue,
  },
  data(){
    return {
      role: this.$store.state.role,
      pageView: true,
    }
  },
  methods: {
    pageViewChange(){
      this.pageView = !this.pageView
    },
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
}
.NowView{
  border-bottom: 5px solid rgb(0, 0, 0);
  pointer-events: none;
}
.NoView{
  color: gray;
  cursor: pointer;
}
</style>