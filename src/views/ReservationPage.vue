<template>
  <div class="reservationPage">
    <template v-if="role == 'ROLE_USER'">
      <user-reservation-vue />
    </template>
    <template v-else>
      <host-reservation-vue />
    </template>
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
  background: rgb(230, 230, 230);
  height: 110vh;
}
.reservationContainer{
  position: relative;
  background: white;
  width: 70vw;
  height: 106vh;
  margin: auto;
  padding: 2vh 2vw;
}
</style>