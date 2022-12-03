<template>
  <div class="reservationPage">
    <div>
      <div class="customerCenterTitle">
        <span>예약리스트</span>
      </div>
      <template v-if="role == 'ROLE_USER'">
        <user-reservation-vue />
      </template>
      <template v-else>
        <host-reservation-vue />
      </template>
    </div>
  </div>
</template>

<script>
import userReservationVue from '@/components/reservation/userReservation.vue'
import hostReservationVue from '@/components/reservation/hostReservation.vue'
export default {
  components: {
    userReservationVue,
    hostReservationVue,
  },
  data(){
    return {
      role: this.$store.state.role,
    }
  },
}
</script>

<style scoped>
.reservationPage{
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
.reservationContainer{
  position: relative;
  background: white;
  width: 70vw;
  height: 88vh;
  margin: auto;
  padding: 2vh 2vw;
}
</style>