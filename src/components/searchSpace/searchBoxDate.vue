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
  async created(){
    await this.makeCalendar()
    this.paramCheck()
  },
  methods:{
    // 주소체크
    paramCheck(){
      const startDate = this.$route.params.startDate
      if (this.$route.params.startDate != 'noDate'){
        this.selectStartYear = startDate.slice(0,4)
        this.selectStartMonth = startDate.slice(5,7)
        this.selectStartDate = startDate.slice(8,10)
        this.seleteSearchDate('startDate')
      }
      const endDate = this.$route.params.endDate
      if (this.$route.params.endDate != 'noDate'){
        this.selectEndYear = endDate.slice(0,4)
        this.selectEndMonth = endDate.slice(5,7)
        this.selectEndDate = endDate.slice(8,10)
        this.seleteSearchDate('endDate')
      }
    },
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
      this.seleteSearchDate('startDate')
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
      this.seleteSearchDate('endDate')
    },
    seleteSearchDate(value){
      let selectDate
      if (value == 'startDate'){
        let month = this.selectStartMonth
        let date = this.selectStartDate
        if (month < 10){
          month = '0'+month
        }
        if (date < 10){
          date = '0'+date
        }
        selectDate = {
          'date':this.selectStartYear+'-'+month+'-'+date,
          'value':value,
        }
      } else {
        let month = this.selectEndMonth
        let date = this.selectEndDate
        if (month < 10){
          month = '0'+month
        }
        if (date < 10){
          date = '0'+date
        }
        selectDate = {
          'date':this.selectEndYear+'-'+month+'-'+date,
          'value':value,
        }
      }
      let message = '시작일 종료일보다 큽니다.'
      if (this.selectStartYear <= this.selectEndYear){
        if (this.selectStartMonth <= this.selectEndMonth){
          if (this.selectStartDate <= this.selectEndDate){
            this.$emit('search-office-date', selectDate)
          } else {
            this.$store.dispatch('MODALVIEWCLICK', true)
            this.$store.dispatch('MODALMESSAGE', message)
            this.selectStartDate = this.selectEndDate
          }
        } else {
          this.$store.dispatch('MODALVIEWCLICK', true)
          this.$store.dispatch('MODALMESSAGE', message)
          this.selectStartMonth = this.selectEndMonth
        }
      } else {
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
        this.selectStartYear = this.selectEndYear
      }
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