<template>
  <div class="customercenterBox">
    <div>
      <div class="customerCenterTitle">
        <span>1:1문의</span>
      </div>
      <div>
        <template v-if="type == 'userCustomerCenter'">
          <user-customer-center />
        </template>
        <template v-if="type == 'hostCustomerCenter'">
          <host-customer-center />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import UserCustomerCenter from '@/components/customerCenter/CustomerCenterUser.vue'
import HostCustomerCenter from '@/components/customerCenter/CustomerCenterHost.vue'
export default {
  components: {
    UserCustomerCenter,
    HostCustomerCenter,
  },
  data(){
    return {
      type:'',
    }
  },
  created(){
    console.log(this.$route.name)
    this.type = this.$route.name
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