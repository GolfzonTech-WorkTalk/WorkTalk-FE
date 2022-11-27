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
            <li v-for="(weekItems, SecondIdx) in weeks" :key="SecondIdx" :class="weekItems.class" @click="clickDate(weekItems.date)">
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
export default {
  props: {
    selectDay: {
      type: String,
      required: true,
    },
  },
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
        } else if (this.year == this.today.getFullYear() && this.month == this.today.getMonth() && date == this.today.getDate()){
          this.week.push({'date':date, 'class':'clickOK today'})
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
    //날짜 포멧 (1~9 > 01~09)
    dataFormChage(value){
      if (value < 10){
        return value = `0${value}`
      } else {
        return value
      }
    },
    // 날짜정보가져오기
    clickDate(date){
      let month = this.month+1
      month = this.dataFormChage(month)
      date = this.dataFormChage(date)
      let reserveDay = this.year+'-'+month+'-'+date
      // console.log(reserveDay)
      this.$emit('selectDay',reserveDay)
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
.monthMoveBtn, .clickOK{
  cursor: pointer;
}
.clickNone{
  color: rgba(0, 0, 0, 0.514);
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
  letter-spacing: 0.2vw;
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