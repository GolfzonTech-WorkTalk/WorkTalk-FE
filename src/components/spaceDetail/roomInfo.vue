<template>
  <template v-if="spaceType == '1'">
    <div class="roomContainer">
      <div v-for="item in roomItems" :key="item">
        <p style="font-size:1.2rem">
          {{ item.roomName }}
        </p>
        <p>{{ item.roomDetail }} / {{ item.roomPrice }} / {{ item.roomType }} </p>
      </div>
      <template v-if="testVal2 == 'desk'">
        <office-calendar-vue />
      </template>
      오피스
      {"room_id": 51,"CheckInDate": "2022-11-25","CheckOutDate": "2022-11-30","checkInTime": "11","checkOutTime": "22"}
    </div>
  </template>
  <template v-else>
    <div class="roomContainer">
      <p class="roomSpaceTile">
        방정보
      </p>
      <div v-for="item in roomItems" :key="item" class="roomItems">
        <input v-model="roomReservationView" type="radio" :value="item.roomId" @click="reservationReset">
        <span class="roomName">{{ item.roomName }}</span>
        <span class="roomTypePrice">최대인원 {{ useNumber(item.roomType) }} {{ item.roomPrice }} / 시간</span>
        <span />
        <p class="roomDetail">
          {{ item.roomDetail }}
        </p>
        <desk-meeting-calendar-vue :select-day="reservationDay" @select-day:date-click="lookupReservation" />
        <div class="reservationResult">
          {{ reservationDay }}
        </div>
        <!-- <template v-if="roomReservationView == item.roomId">
          <desk-meeting-calendar-vue :select-day="reservationDay" @selectDay="lookupReservation" />
          <template v-if="reservationDay != '예약날짜'">
            <div>
              {{ reservationDay }}
            </div>
          </template>
        </template> -->
      </div>
    </div>
    데스크 회의실
    {"room_id": 51,"CheckInDate": "2022-11-27",CheckOutDate": "","checkInTime": "20","checkOutTime": "22"}
  </template>
</template>

<script>
// import { roomOne } from '@/api/user.js'
import { selectOneRoomDumy } from '@/utils/dummy.js'
import DeskMeetingCalendarVue from './reservation/DeskMeetingCalendar.vue'
import OfficeCalendarVue from './reservation/OfficeCalendar.vue'
export default {
  components: {
    DeskMeetingCalendarVue,
    OfficeCalendarVue,
  },
  data(){
    return {
      // 테스트
      testVal: 'user',
      testVal2:'desk',
      // 룸정보
      roomItems:[],
      // 룸출력관리 변수들
      spaceType: this.$route.params.spaceType,
      roomReservationView: '',
      MEETING4: '4인',
      MEETING6: '6인',
      MEETING8: '8~10인',
      MEETING20: '20인',
      // 예약변수
      reservationDay: '예약날짜',
    }
  },
  // 룸정보 출력
  created(){
      // const spaceId = this.$route.params.spaceId
      // console.log(spaceId)
      // let roomResponce = await roomOne(spaceId)
      // this.roomItems = roomResponce.data
      /* 더미 */
      this.roomItems = selectOneRoomDumy
      /* 달력생성 */
      
    },
  methods: {
    useNumber(value){
      if (value == 'MEETING4'){
        return this.MEETING4
      } else if (value == 'MEETING6'){
        return this.MEETING6
      } else if (value == 'MEETING8'){
        return this.MEETING8
      } else {
        return this.MEETING20
      }
    },
    lookupReservation(reserveDay){
      console.log(reserveDay)
      this.reservationDay = reserveDay
    },
    reservationReset(){
      this.reservationDay = '예약날짜'
    },
  },
}
</script>

<style scoped>
.roomContainer{
  padding: 1vw;
}
.roomSpaceTile{
  font-weight: bold;
  font-size: 1.5rem;
}
.roomName{
  margin-left: 0.5vw;
  font-size: 1.2rem;
}
.roomTypePrice{
  float: right;
  margin-right: 0.5vw;
}
.roomDetail{
  margin-left: 0.5vw;
  margin-bottom: 1vh;
}
</style>