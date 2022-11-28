<template>
  <div class="calendarBox">
    <div class="yearMonthTable">
      <span><i class="fa-solid fa-chevron-left" @click="getDates(-1)" /></span>
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
          <li v-for="(weekItems, SecondIdx) in weeks" :key="SecondIdx" :class="weekItems.class" @click="clickDate(weekItems.date)">
            {{ weekItems.date }}
          </li>
        </ul>
      </div>
    </div>
    <div>
      데스크 회의실
      {"room_id": 51,"CheckInDate": "2022-11-27",CheckOutDate": "","checkInTime": "20","checkOutTime": "22"}
      <br>
      오피스
      {"room_id": 51,"CheckInDate": "2022-11-25","CheckOutDate": "2022-11-30","checkInTime": "11","checkOutTime": "22"}
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
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
    }
  },
  created(){
     this.year = this.today.getFullYear()
     this.month = this.today.getMonth()
     this.date = this.today.getDate()
     this.getDates() // 달력의 전체 날짜를 출력하는 함수
  },
  methods: {
    // 달력출력
    getDates(value){
      // 달력초기화
      this.dates = []
      this.week = []
      // 달력 이전달, 다음달 이동
      if (value == 1){
        this.month++
        if (this.month === 12){
          this.month = 0
          this.year++
        }
      }
      if (value == -1){
        this.month--
        if (this.month === -1){
          this.month = 11
          this.year--
        }
      }
      // 달력출력
      const [lastMonthLastDate, lastMonthLastDay, todayMonthLastDate, nextMonthFirstDay] = this.getFirstAndLastDate(this.month, this.year)
      // console.log('getDates : ',lastMonthLastDate,lastMonthLastDay, todayMonthLastDate, nextMonthFirstDay)
      this.getPrevMonth(lastMonthLastDate,lastMonthLastDay)
      this.getTodayMonth(todayMonthLastDate)
      this.getNextMonth(nextMonthFirstDay)
      // 달력 이전달, 이후 달
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
    // 7일단위로 바인딩
    checkLength(){
      if (this.week.length == 7){
        this.dates.push(this.week)
        // console.log('weeks : ',this.weeks)
        this.week = []
      }
    },
    // 날짜정보가져오기
    clickDate(date){
      let month = this.month+1
      month = this.dataFormChage(month)
      date = this.dataFormChage(date)
      console.log(this.year+'/'+month+'/'+date)
    },
    //날짜 포멧 (1~9 > 01~09)
    dataFormChage(value){
      if (value < 10){
        return value = `0${value}`
      } else {
        return value
      }
    },
  },
}
</script>

<style scoped>
.calendarBox{
  border: 1px solid gray;
}
.yearMonthTable{
  text-align: center;
  width: 21vw;
  padding: 3vh 0;
}
.todayYearMonth{
  margin: 0vh 2vw;
}
.weekTable ul, .dataTable ul{
  display: flex;
  list-style: none;
  text-align: center;
}
.weekTable li{
  font-weight: bold;
  border-bottom: 1px solid gray;
}
.weekTable li, .dataTable li{
  width: 3vw;
}
.fa-solid, .clickOK{
  cursor: pointer;
}
.clickNone{
  color: rgba(0, 0, 0, 0.514);
}
.preMonth, .nextMonth {
  color: white;
  pointer-events: none;
}
</style>