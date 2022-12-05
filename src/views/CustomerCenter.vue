<template>
  <div class="customercenterBox">
    <div>
      <div class="customerCenterTitle">
        <span>1:1문의</span>
      </div>
      <div>
        <customer-center />
      </div>
    </div>
  </div>
</template>

<script>
import CustomerCenter from '@/components/customerCenter/CustomerCenterUser.vue'
export default {
  components: {
    CustomerCenter,
  },
}
</script>

<style scoped>
.customercenterBox{
  position: relative;
  justify-content: center;
  background: rgb(230, 230, 230);
  display: flex;
  height: 110vh;
}
.customerCenterTitle{
  margin: 5vh 0;
  text-align: center;
}
.customerCenterTitle span{
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