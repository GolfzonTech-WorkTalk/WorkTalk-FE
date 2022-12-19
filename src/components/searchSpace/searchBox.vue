<template>
  <div class="searchBox">
    <div class="searchItems">
      <div class="searchItem">
        <select v-model="selectCityCode" class="selectTermsBox" :class="{'selectTerms':selectCityCode!='지역코드'}" @change="selectCityOne">
          <option value="지역코드" hidden>
            지역
          </option>
          <option v-for="item in cityAddressData" :key="item" :value="item.typeCode">
            {{ item.name }}
          </option>
        </select>
        <select v-model="selectCityDetailName" class="selectTermsBox" :class="{'selectTerms':selectCityDetailName!='세부지역'}">
          <option value="세부지역" hidden>
            세부지역
          </option>
          <option v-for="item in cityDetailAddressData" :key="item" :value="item.name">
            {{ item.name }}
          </option>
        </select>
        <input v-model="searchWord" type="text" class="selectTermsTextBox" :class="{'selectTerms':searchWord!=''}" placeholder="키워드검색" @keyup.enter="searchSubmit">
        <select v-model="selectSpaceType" class="selectTermsBox" :class="{'selectTerms':selectSpaceType!='공간타입'}">
          <option value="공간타입" hidden>
            공간타입
          </option>
          <option v-for="item in selectSpaceTypeData" :key="item" :value="item.value">
            {{ item.name }}
          </option>
        </select>
        <searchBoxDate v-if="selectSpaceType == '1'" :select-space-type="selectSpaceType" @search-office-date="searchDate" />
        <searchBoxDateTime v-if="selectSpaceType == '2' || selectSpaceType == '3'" :select-space-type="selectSpaceType" @search-date="searchDate" @search-time="searchTime" />
        <div class="selectTermsClearBtn" @click="selectTermsClear">
          <i class="fa-solid fa-rotate-right fa-lg" />
          <span>초기화</span>
        </div>
      </div>
      <div class="searchItem searchItemBtns">
        <div class="searchItemBtn">
          <i class="fa-solid fa-magnifying-glass fa-2x" @click="searchSubmit" />
        </div>
        <div class="searchItemBtn">
          <i class="mapIcon fa-solid fa-map-location-dot fa-2x" @click="mapLink" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import searchBoxDate from '@/components/searchSpace/searchBoxDate.vue'
import searchBoxDateTime from '@/components/searchSpace/searchBoxDateTime.vue'
import { cityAddress, cityAddressDetail } from '@/utils/addressCity.js'
export default {
  components:{
    searchBoxDate,
    searchBoxDateTime,
  },
  emits: ['searchSubmit'],
  data(){
    return {
      selectCityCode:'지역코드',
      selectCityName:'지역',
      selectCityDetailName:'세부지역',
      selectSpaceType:'공간타입',
      searchWord:'',
      selectSpaceTypeData:[
        {'name':'전체','value':'공간타입'},
        {'name':'오피스','value':'1'},
        {'name':'데스크','value':'2'},
        {'name':'회의실','value':'3'},
      ],
      cityAddressData:[],
      cityDetailAddressData:[],
      // 날짜 시간변수
      startDate:'',
      endDate:'',
      startTime:'',
      endTime:'',
    }
  },
  created(){
    this.paramsCheck()
  },
  methods:{
    // param으로 조건 가져요기
    paramsCheck(){
      this.cityAddressData = cityAddress
      this.selectSpaceType = this.$route.params.spaceType
      if (this.$route.params.spaceType == 'AllType'){
        this.selectSpaceType = '공간타입'
      }
      this.searchWord = this.$route.params.spaceName
      if (this.$route.params.spaceName == 'AllName'){
        this.searchWord = ''
      }
      this.selectCityName = this.$route.params.address
      if (this.$route.params.address == 'AllRegions'){
        this.selectCityName = '지역'
      }
      this.startDate = this.$route.params.startDate
      if (this.$route.params.startDate == 'noDate'){
        this.startDate = ''
      }
      this.endDate = this.$route.params.endDate
      if (this.$route.params.endDate == 'noDate'){
        this.endDate = ''
      }
      this.startTime = this.$route.params.startTime
      if (this.$route.params.startTime == 'noTime'){
        this.startTime = ''
      }
      this.endTime = this.$route.params.endTime
      if (this.$route.params.endTime == 'noTime'){
        this.endTime = ''
      }
      // 주소로 지역코드, 세부지역 선택
      for (let i = 0; i < this.cityAddressData.length; i++){
        if (this.selectCityName.indexOf(this.cityAddressData[i].name) != '-1'){
          this.selectCityCode = this.cityAddressData[i].typeCode
        }
      }
      for (let i = 0; i < cityAddressDetail.length; i++){
        if (cityAddressDetail[i].typeCode == this.selectCityCode){
          this.cityDetailAddressData.push(cityAddressDetail[i])
        }
      }
      for (let i = 0; i < this.cityDetailAddressData.length; i++){
        if (this.selectCityName.indexOf(this.cityDetailAddressData[i].name) != '-1'){
          this.selectCityDetailName = this.cityDetailAddressData[i].name
        }
      }
      for (let i = 0; i < this.cityAddressData.length; i++){
        if (this.selectCityCode == this.cityAddressData[i].typeCode){
          this.selectCityName = this.cityAddressData[i].name
        }
      }
    },
    // 지역선택
    selectCityOne(){
      let typeCode = this.selectCityCode
      this.cityDetailAddressData = []
      this.selectCityDetailName='세부지역'
      // console.log(typeCode)
      for (let i = 0; i < cityAddressDetail.length; i++){
        if (cityAddressDetail[i].typeCode == typeCode){
          this.cityDetailAddressData.push(cityAddressDetail[i])
        }
      }
      for (let i = 0; i < this.cityAddressData.length; i++){
        if (this.selectCityCode == this.cityAddressData[i].typeCode){
          this.selectCityName = this.cityAddressData[i].name
        }
      }
    },
    // 조건 초기화
    selectTermsClear(){
      this.selectCityCode = '지역코드'
      this.selectCityName='지역'
      this.selectCityDetailName = '세부지역'
      this.selectSpaceType = '공간타입'
      this.searchWord=''
      this.startDate = 'noDate'
      this.endDate = 'noDate'
      this.startTime = 'noTime'
      this.endTime = 'noTime'
      this.searchSubmit()
    },
    // 조건 검색
    searchSubmit(){
      const link = this.linkCheck('search')
      this.$emit('searchSubmit',link)
    },
    mapLink(){
      const link = this.linkCheck('map')
      this.$router.push('/map/'+link)
    },
    // 링크체크
    linkCheck(val){
      let address = this.selectCityName
      let spaceName = this.searchWord
      let spaceType = this.selectSpaceType
      let startDate = this.startDate
      let endDate = this.endDate
      let startTime = this.startTime
      let endTime = this.endTime
      if (this.selectSpaceType == '공간타입'){
        spaceType = 'AllType'
      }
      if (this.searchWord == ''){
        spaceName = 'AllName'
      }
      if (this.selectCityName == '지역'){
        address = 'AllRegions'
      }
      if (this.selectCityDetailName != '세부지역'){
        address = address +' '+ this.selectCityDetailName
        // console.log(address)
      }
      if (this.selectSpaceType == '공간타입'){
        startDate = 'noDate'
        endDate = 'noDate'
        startTime = 'noTime'
        endTime = 'noTime'
      } else if (this.selectSpaceType == 1){
        startTime = 'noTime'
        endTime = 'noTime'
      } else if (this.selectSpaceType == 2 || this.selectSpaceType == 3){
        endDate = 'noDate'
      }
      if (val == 'search'){
        return spaceType+'/'+spaceName+'/'+address+'/'+startDate+'/'+endDate+'/'+startTime+'/'+endTime
      } else {
        return spaceType+'/'+spaceName+'/'+address
      }
    },
    // 시간 날짜 선택
    searchDate(selectDate){
      // console.log(selectDate)
      if (selectDate.value == 'startDate'){
        this.startDate = selectDate.date
      } else {
        this.endDate = selectDate.date
      }
    },
    searchTime(selectTime){
      // console.log(selectTime)
      if (selectTime.value == 'startTime'){
        this.startTime = selectTime.time
      } else {
        this.endTime = selectTime.time
      }
      // console.log(this.startTime, this.endTime)
    },
  },
}
</script>

<style scoped>
.searchBox{
  display: flex;
  justify-content: center;
}
.searchItems{
  display: flex;
  width: 70vw;
  padding: 3vh;
  justify-content: space-between;
}
.selectTermsBox{
  width: 15vw;
  height: 5vh;
  padding: 5px;
  margin-right: 0.5vw;
  color: gray;
  font-size: 1rem;
  border: 1px solid gray;
  border-radius: 10px;
}
.selectTermsTextBox{
  width: 17vw;
  height: 5vh;
  padding: 0 5px;
  margin-right: 1vw;
  color: gray;
  font-size: 1rem;
  border: 1px solid gray;
  border-radius: 10px;
}
.selectTermsDateBox{
  display: inline;
  padding: 5px;
  margin-right: 0.5vw;
  color: gray;
  font-size: 1rem;
  border: 1px solid gray;
  border-radius: 10px;
}
.selectTerms{
  color: rgb(108, 108, 209);
  font-weight: bold;
}
/* 버튼 */
.selectTermsClearBtn{
  display: inline;
  cursor: pointer;
  color: gray;
  font-size: 0.8rem;
}
.selectTermsClearBtn i{
  margin-right: 0.5vw;
}
.searchItemBtns{
  display: flex;
}
.searchItemBtn{
  margin: 0 0.5vw;
  cursor: pointer;
}
</style>