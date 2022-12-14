<template>
  <div class="selectTermsDateBox">
    <span>날짜조건 : </span>
    <select v-model="selectStartYear" class="selectTermsDateitem" @change="makeStartMonth(selectStartYear)">
      <option v-for="item in selectStartYearData" :key="item" :value="item.name">
        {{ item.name }}
      </option>
    </select>
    <select v-model="selectStartMonth" class="selectTermsDateitem" @change="makeStartDate(selectStartMonth)">
      <option v-for="item in selectStartMonthData" :key="item" :value="item.name">
        {{ item.name }}
      </option>
    </select>
    <select v-model="selectStartDate" class="selectTermsDateitem" @change="seleteSearchDate()">
      <option v-for="item in selectStartDateData" :key="item" :value="item.name">
        {{ item.name }}
      </option>
    </select>
    <select v-model="selectStartTime" class="selectTermsDateitem" @change="seleteSearchTime('startTime')">
      <option v-for="item in selectStartTimeData" :key="item" :value="item.name">
        {{ timeNameCheck(item.name) }}
      </option>
    </select>
    <select v-model="selectEndTime" class="selectTermsDateitem" @change="seleteSearchTime('endTime')">
      <option v-for="item in selectEndTimeData" :key="item" :value="item.name">
        {{ timeNameCheck(item.name) }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  emits: ['search-date','search-time'],
  data(){
    return {
      // 달력조건 선택
      // 시작일
      selectStartYear:'',
      selectStartMonth:'',
      selectStartDate:'',
      // 시간
      selectStartTime:'0',
      selectEndTime:'24',
      // 조건검색달력
      // 시작달력
      selectStartYearData:[],
      selectStartMonthData:[],
      selectStartDateData:[],
      // 시간
      selectStartTimeData:[],
      selectEndTimeData:[],
    }
  },
  created(){
    this.makeCalendar()
    this.makeStartTime()
  },
  methods:{
    // 달력생성
    makeCalendar(){
      const today = new Date()
      const year = today.getFullYear()
      const date = today.getDate()
      this.selectStartDate = date
      this.makeStartYear(year)
    },
    makeStartYear(year){
      this.selectStartYear = year
      for (let i = year+4; i > year-1; i--){
        this.selectStartYearData.push({'name':i})
      }
      this.makeStartMonth(year)
    },
    makeStartMonth(year){
      this.selectStartMonthData = []
      const thisYear = new Date().getFullYear()
      let month
      if (year == thisYear){
        month = new Date().getMonth()
      } else {
        month = 0
      }
      this.selectStartMonth = month+1
      for (let i = 12; i > month; i--){
        this.selectStartMonthData.push({'name':i})
      }
      this.makeStartDate(month)
    },
    makeStartDate(month){
      this.selectStartDateData = []
      const thisMonth = new Date().getMonth()
      let date
      if (month == thisMonth){
        date = new Date().getDate()
      } else {
        date = 1
      }
      this.selectStartDate = date
      const lastDate = new Date(this.selectStartYear, this.selectStartMonth, 0).getDate()
      for (let i = lastDate; i > date-1; i--){
        this.selectStartDateData.push({'name':i})
      }
      this.seleteSearchDate()
      this.seleteSearchTime('startTime')
      this.seleteSearchTime('endTime')
    },
    makeStartTime(){
      for (let i = 0; i < 25; i++){
        this.selectStartTimeData.push({'name':i})
        this.selectEndTimeData.push({'name':i})
      }
    },
    timeNameCheck(value){
      if (value < 10){
        return '0'+value+':00'
      } else {
        return value+':00'
      }
    },
    seleteSearchDate(){
      let selectDate = {
        'date':this.selectStartYear+'-'+this.selectStartMonth+'-'+this.selectStartDate,
        'value':'startDate',
      }
      this.selectStartTime = '0'
      this.selectEndTime = '0'
      this.$emit('search-date', selectDate)
    },
    seleteSearchTime(value){
      let selectTime
      if (value == 'startTime'){
        selectTime = {
          'time':this.selectStartTime,
          'value':value,
        }
      } else {
        selectTime = {
          'time':this.selectEndTime,
          'value':value,
        }
      }
      this.$emit('search-time', selectTime)
    },
  },
}
</script>

<style scoped>
.selectTermsDateitem{
  text-align: center;
  width: 4vw;
  border: 0;
  color: gray;
}
</style>