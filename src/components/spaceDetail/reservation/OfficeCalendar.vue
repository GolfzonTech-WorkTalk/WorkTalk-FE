<template>
  <div>
    <div class="calendarBox">
      <div class="yearMonthTable">
        <span><i class="fa-solid fa-chevron-left monthMoveBtn" @click="getDates(-1)" /></span>
        <span class="todayYearMonth">{{ year }}년 {{ month+1 }}월</span>
        <span><i class="fa-solid fa-chevron-right" @click="getDates(1)" /></span>
      </div>
      <div>
        <div class="weekTable">
          <ul>
            <li v-for="day in days" :key="day">
              {{ day }}
            </li>
          </ul>
        </div>
        <div class="dataTable">
          <ul v-for="(weeks, FirstIdx) in dates" :key="FirstIdx">
            <li v-for="(weekItems, SecondIdx) in weeks" :key="SecondIdx" :class="weekItems.class" @click="clickDate(dates, weekItems)">
              {{ weekItems.date }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="statusExplanation">
      <i class="fa-solid fa-square StatusBoxNone" />
      <span>예약불가</span>
      <i class="fa-solid fa-square StatusBoxToday" />
      <span>오늘</span>
      <i class="fa-solid fa-square StatusBoxSelect" />
      <span>선택</span>
    </div>
  </div>
</template>

<script>
// import { reservationData3 } from '@/utils/dummy/dummy.js'
import { roomOne } from '@/api/user.js'
import { reservationData } from '@/api/reservation.js'
export default {
  emits: ['select-day:date-click'],
  data(){
    return {
      roomItems:'',
      // 요일
      days: ['일','월','화','수','목','금','토'],
      // 오늘 날짜
      today: new Date(),
      date: '',
      month: '',
      year: '',
      // 데이터
      dates: [],
      week: [],
      initDay:'',
      endDay:'',
      // 예약된 정보
      reserveData: [],
    }
  },
  async created(){
    await this.callRoomInfo()
    this.year = this.today.getFullYear()
    this.month = this.today.getMonth()
    this.date = this.today.getDate()
    this.getDates() // 달력의 전체 날짜를 출력하는 함수
  },
  methods: {
    // 룸정보 불러오기
    async callRoomInfo(){
      try {
        const spaceId = this.$route.params.spaceId
        const response = await roomOne(spaceId)
        console.log(response)
        this.roomItems = response.data[0]
      } catch (error){
        console.log(error)
      }
    },
    // 예약데이터 가져오는 API
    async getRoomReservation(){
      let month
      let day = new Date(this.year, (this.month+1), 0)
      if (this.month < 9){
        month = '0'+(this.month+1)
      } else {
        month = (this.month+1)
      }
      const spaceType = this.$route.params.spaceType
      const roomId = this.roomItems.roomId
      const roomType = this.roomItems.roomType
      const initDate = this.year+'-'+month+'-'+'01'
      const endDate = this.year+'-'+month+'-'+day.getDate()
      const initTime = 9
      const endTime = 22
      console.log(spaceType, roomId, roomType, initDate, endDate, initTime, endTime)
      const response = await reservationData(spaceType, roomId, roomType, initDate, endDate, initTime, endTime)
      console.log(response)
      this.reserveData = response.data
      // 예약체크
      this.reservationCheck()
    },
    // 달력출력
    getDates(value){
      // console.log(this.clickDay)
      // 달력초기화
      this.dates = []
      this.week = []
      this.initDay = ''
      this.endDay = ''
      // 달력 이전달, 다음달 이동
      if (value == 1){
        this.month++
        this.clickDay = ''
        if (this.month === 12){
          this.month = 0
          this.year++
        }
      }
      if (value == -1){
        this.month--
        this.clickDay = ''
        if (this.month === -1){
          this.month = 11
          this.year--
        }
      }
      let todayYYmm = this.year+'-'+this.dataFormChage(this.month+1)+'-'
      this.$emit('select-day:date-click', todayYYmm)
      // 달력출력
      const [lastMonthLastDate, lastMonthLastDay, todayMonthLastDate, nextMonthFirstDay] = this.getFirstAndLastDate(this.month, this.year)
      // console.log('getDates : ',lastMonthLastDate,lastMonthLastDay, todayMonthLastDate, nextMonthFirstDay)
      this.getPrevMonth(lastMonthLastDate,lastMonthLastDay)
      this.getTodayMonth(todayMonthLastDate)
      this.getNextMonth(nextMonthFirstDay)
      // 예약가져오기
      this.getRoomReservation()
    },
    // 달력의 필요데이터 생성
    getFirstAndLastDate(month, year){
      // data : 날짜
      const lastMonthLastDate = new Date(year, month, 0).getDate()
      // day : 요일 [ 일요일 : 0 ~ 월요일 : 6]
      const lastMonthLastDay = new Date(year, month, 0).getDay()
      const todayMonthLastDate = new Date(year, month+1, 0).getDate()
      const nextMonthFirstDay = new Date(year,month+1).getDay()
      // console.log('getFirstAndLastDate : ', lastMonthLastDate,lastMonthLastDay, todayMonthLastDate, nextMonthFirstDay)
      return [this.lastMonthLastDate=lastMonthLastDate, this.lastMonthLastDay=lastMonthLastDay, 
      this.todayMonthLastDate=todayMonthLastDate, this.nextMonthFirstDay=nextMonthFirstDay]
    },
    // 지난달 마지막주
    getPrevMonth(prevLastDate, prevLastDay){
      if (prevLastDay!==6){
        for (let date = prevLastDate-prevLastDay; date <= prevLastDate; date++){
          // console.log(this.month > this.today.getMonth())
          // console.log(this.year > this.today.getFullYear())
          if (this.year > this.today.getFullYear() || this.month > this.today.getMonth()){
            this.week.push({'date':date, 'class':'preMonth'})
            this.checkLength()
          } else {
            this.week.push({'date':date, 'class':'preMonth'})
            this.checkLength()
          }
        }
      }
    },
    // 이번달
    getTodayMonth(todayMonthLastDate){
      for (let date = 1; date<=todayMonthLastDate; date++){
        if (this.year > this.today.getFullYear() || this.month > this.today.getMonth()){
          this.week.push({'date':date, 'class':'clickOK'})
          this.checkLength()
        } else if (this.year == this.today.getFullYear() && this.month == this.today.getMonth() && date == this.today.getDate()){
          if (this.initDay == date){
            this.week.push({'date':date, 'class':'clickOK clickDay'})
          } else {
            this.week.push({'date':date, 'class':'clickOK today'})
          }
          this.checkLength()
        } else {
          if (date < this.date){
            this.week.push({'date':date, 'class':'clickNone'})
            this.checkLength()
          } else {
            this.week.push({'date':date, 'class':'clickOK'})
            this.checkLength()
          }
        }
      }
    },
    // 다음달 첫째주
    getNextMonth(nextMonthFirstDay){
      if (nextMonthFirstDay!==0){
        for (let date = 1 ; date <= 7-nextMonthFirstDay; date++){
          this.week.push({'date':date, 'class':'nextMonth'})
          this.checkLength()
        }
      }
    },
    // 예약체크
    reservationCheck(){
      for (let i = 0; i < this.dates.length; i++){
        for (let j = 0; j < this.dates[i].length; j++){
          let date = this.dates[i]
          // console.log(date[j].date, date[j].class)
          if (date[j].class != 'nextMonth' && date[j].class != 'preMonth'){
            for (let k = 0; k < this.reserveData.length; k++){
              // console.log(this.reserveData[k].initDate)
              // console.log(this.reserveData[k].initDate.substring(0,4))
              // 년
              let initYear = this.reserveData[k].initDate.substring(0,4)
              let endYear = this.reserveData[k].endDate.substring(0,4)
              // 월
              let initMonth = this.reserveData[k].initDate.substring(5,7)
              let endMonth = this.reserveData[k].endDate.substring(5,7)
              // 날짜
              let initDate = this.reserveData[k].initDate.substring(8,10)
              let endDate = this.reserveData[k].endDate.substring(8,10)
              if (initYear < this.year){
                if (endYear > this.year){
                  date[j].class = 'reserved'
                } else if (endYear == this.year){
                  if (initMonth < (this.month+1)){
                    if (endMonth == (this.month+1)){
                      if (endDate >= date[j].date){
                        if (date[j].class == 'clickOK today'){
                          date[j].class = 'reserved today'
                        } else {
                          date[j].class = 'reserved'
                        }
                      }
                    } else if (endMonth > (this.month+1)){
                      if (date[j].class == 'clickOK today'){
                        date[j].class = 'reserved today'
                      } else {
                        date[j].class = 'reserved'
                      }
                    }
                  } else if (initMonth == (this.month+1)){
                    if (initDate <= date[j].date){
                      if (endDate >= date[j].date){
                        if (date[j].class == 'clickOK today'){
                          date[j].class = 'reserved today'
                        } else {
                          date[j].class = 'reserved'
                        }
                      }
                    }
                  }
                }
              } else if (initYear == this.year){
                if (initMonth < (this.month+1)){
                  if (endMonth == (this.month+1)){
                    if (endDate >= date[j].date){
                      if (date[j].class == 'clickOK today'){
                        date[j].class = 'reserved today'
                      } else {
                        date[j].class = 'reserved'
                      }
                    }
                  } else if (endMonth > (this.month+1)){
                    if (date[j].class == 'clickOK today'){
                      date[j].class = 'reserved today'
                    } else {
                      date[j].class = 'reserved'
                    }
                  }
                } else if (initMonth == (this.month+1)){
                  if (initDate <= date[j].date){
                    if (endDate >= date[j].date){
                      if (date[j].class == 'clickOK today'){
                        date[j].class = 'reserved today'
                      } else {
                        date[j].class = 'reserved'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    // 7일단위로 바인딩
    checkLength(){
      if (this.week.length == 7){
        this.dates.push(this.week)
        // console.log('weeks : ',this.weeks)
        this.week = []
      }
    },
    //날짜 포멧 (1~9 > 01~09)
    dataFormChage(value){
      if (value < 10){
        return value = `0${value}`
      } else {
        return value
      }
    },
    // 날짜 선택
    clickDate(dates, weekItems){
      if (this.initDay == weekItems.date){
        this.initDay = this.endDay
        this.endDay = ''
        weekItems.class = 'clickOk'
      } else if (this.endDay == weekItems.date){
        this.endDay = ''
        weekItems.class = 'clickOk'
      } else if (this.initDay != '' && this.endDay != ''){
        let message = '날짜를 이미 두개 선택하였습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
        return false
      } else if (!this.initDay){
        this.initDay = weekItems.date
        weekItems.class = 'clickDay'
      } else if (this.initDay < weekItems.date){
        this.endDay = weekItems.date
        this.reserveCheck(dates, 'endDay')
        if (this.endDay != ''){
          weekItems.class = 'clickDay'
        }
      } else if (this.initDay > weekItems.date){
        this.endDay = this.initDay
        this.initDay = weekItems.date
        this.reserveCheck(dates, 'initDay')
        if (this.endDay != ''){
          weekItems.class = 'clickDay'
        }
      }
      let todayYYmm = this.year+'-'+this.dataFormChage(this.month+1)+'-'
      this.$emit('select-day:date-click', todayYYmm, this.initDay, this.endDay)
    },
    reserveCheck(dates, value){
      for (let i = 0; i < dates.length; i++){
        let datesWeeks = dates[i]
        for (let j = 0; j < datesWeeks.length; j++){
          if (this.initDay < datesWeeks[j].date && datesWeeks[j].date < this.endDay && datesWeeks[j].class != 'preMonth' && datesWeeks[j].class != 'nextMonth'){
            if (datesWeeks[j].class == 'reserved'){
              if (value == 'endDay'){
                this.endDay = ''
              } else {
                this.initDay = this.endDay
                this.endDay = ''
              }
              let message = '중간에 예약이 있습니다. 다시 선택해 주세요.'
              this.$store.dispatch('MODALVIEWCLICK', true)
              this.$store.dispatch('MODALMESSAGE', message)
            }
          }
        }
      }
    },
  },
}
</script>

<style scoped>
.calendarBox{
  margin-left: 0.5vw;
  border: 3px solid gray;
  border-left: 0;
  border-right: 0;
  width: 16.8vw;
  font-size: 0.8rem;
}
.yearMonthTable{
  text-align: center;
  width: 16.8vw;
  padding: 1vh 0;
}
.todayYearMonth{
  margin: 0vh 1vw;
}
.weekTable ul, .dataTable ul{
  display: flex;
  list-style: none;
  text-align: center;
  padding: 0.5vh 0;
}
.weekTable li{
  font-weight: bold;
  border-bottom: 1px solid gray;
}
.weekTable li, .dataTable li{
  width: 2.4vw;
}
/* 날짜출력 */
.monthMoveBtn, .clickOK, .clickDay{
  cursor: pointer;
}
.clickNone{
  color: rgba(0, 0, 0, 0.514);
  pointer-events: none;
}
.reserved{
  color: rgba(0, 0, 0, 0.514);
  pointer-events: none;
  text-decoration: underline;
}
.clickDay {
  color:rgb(235, 140, 85);
}
.today{
  color: rgb(79, 79, 235);
  font-weight: bold;
}
/* 설명 */
.statusExplanation{
  width: 16.8vw;
  text-align: right;
  font-weight: bold;
  letter-spacing: 0.1vw;
  font-size: 0.8rem;
}
.statusExplanation span:not(:last-child){
  margin-right: 0.5vw;
}
.StatusBoxToday {
  color: rgb(105, 105, 230);
}
.StatusBoxNone {
  color:rgba(71, 71, 71, 0.514);
}
.StatusBoxSelect {
  color:rgb(235, 140, 85);
}
/* 달력이동버튼 */
.preMonth, .nextMonth {
  color: white;
  pointer-events: none;
}
</style>