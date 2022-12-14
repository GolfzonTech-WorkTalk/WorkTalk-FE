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
    <select v-model="selectStartDate" class="selectTermsDateitem" @change="seleteSearchDate('startDate')">
      <option v-for="item in selectStartDateData" :key="item" :value="item.name">
        {{ item.name }}
      </option>
    </select>
    <span> ~</span>
    <select v-model="selectEndYear" class="selectTermsDateitem" @change="makeEndMonth(selectEndYear)">
      <option v-for="item in selectEndYearData" :key="item" :value="item.name">
        {{ item.name }}
      </option>
    </select>
    <select v-model="selectEndMonth" class="selectTermsDateitem" @change="makeEndDate(selectEndYear, selectEndMonth)">
      <option v-for="item in selectEndMonthData" :key="item" :value="item.name">
        {{ item.name }}
      </option>
    </select>
    <select v-model="selectEndDate" class="selectTermsDateitem" @change="seleteSearchDate('endDate')">
      <option v-for="item in selectEndDateData" :key="item" :value="item.name">
        {{ item.name }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  emits: ['search-office-date'],
  data(){
    return {
      // 달력조건 선택
      // 시작일
      selectStartYear:'',
      selectStartMonth:'',
      selectStartDate:'',
      // 종료일
      selectEndYear:'',
      selectEndMonth:'',
      selectEndDate:'',
      // 조건검색달력
      // 시작달력
      selectStartYearData:[],
      selectStartMonthData:[],
      selectStartDateData:[],
      // 종료달력
      selectEndYearData:[],
      selectEndMonthData:[],
      selectEndDateData:[],
    }
  },
  created(){
    this.makeCalendar()
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
      this.makeEndYear(this.selectStartYear)
    },
    makeEndYear(year){
      this.selectEndYearData = []
      this.selectEndYear = year
      const thisYear = new Date().getFullYear()
      for (let i = thisYear+4; i > year-1; i--){
        this.selectEndYearData.push({'name':i})
      }
      this.makeEndMonth(year)
    },
    makeEndMonth(year){
      this.selectEndMonthData = []
      const thisYear = this.selectStartYear
      let month
      if (year == thisYear){
        month = this.selectStartMonth-1
      } else {
        month = 0
      }
      this.selectEndMonth = month+1
      for (let i = 12; i > month; i--){
        this.selectEndMonthData.push({'name':i})
      }
      this.makeEndDate(year, month+1)
    },
    makeEndDate(year, month){
      this.selectEndDateData = []
      const thisYear = this.selectStartYear
      const thisMonth = this.selectStartMonth
      let date
      if (year == thisYear){
        if (month == thisMonth){
          date = this.selectStartDate
        } else {
          date = 1
        }
      } else {
        date = 1
      }
      this.selectEndDate = date
      const lastDate = new Date(year, month, 0).getDate()
      for (let i = lastDate; i > date-1; i--){
        this.selectEndDateData.push({'name':i})
      }
    },
    seleteSearchDate(value){
      let selectDate
      if (value == 'startDate'){
        selectDate = {
          'date':this.selectStartYear+'-'+this.selectStartMonth+'-'+this.selectStartDate,
          'value':value,
        }
      } else {
        selectDate = {
          'date':this.selectEndYear+'-'+this.selectEndMonth+'-'+this.selectEndDate,
          'value':value,
        }
      }
      // console.log(selectDate)
      this.$emit('search-office-date', selectDate)
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