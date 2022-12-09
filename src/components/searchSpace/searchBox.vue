<template>
  <div class="searchBox">
    <div class="searchItems">
      <div class="searchItem">
        <select v-model="selectCityCode" class="selectTermsBox" :class="{'selectTerms':selectCityCode!='지역'}" @change="selectCityOne">
          <option value="지역" hidden>
            지역
          </option>
          <option v-for="item in cityAddressData" :key="item" :value="item.typeCode">
            {{ item.name }}
          </option>
        </select>
        <select v-model="selectCityDetailName" class="selectTermsBox" :class="{'selectTerms':selectCityDetailName!='세부지역'}" @change="selectCityDetailOne">
          <option value="세부지역" hidden>
            세부지역
          </option>
          <option v-for="item in cityDetailAddressData" :key="item" :value="item.name">
            {{ item.name }}
          </option>
        </select>
        <select v-model="selectSpaceType" class="selectTermsBox" :class="{'selectTerms':selectSpaceType!='공간타입'}" @change="selectCityDetailOne">
          <option value="공간타입" hidden>
            공간타입
          </option>
          <option v-for="item in selectSpaceTypeData" :key="item" :value="item.value">
            {{ item.name }}
          </option>
        </select>
        <input v-model="searchWord" type="text" class="selectTermsTextBox">
        <div class="selectTermsClearBtn">
          <i class="fa-solid fa-rotate-right fa-lg" @click="selectTermsClear" />
          <span>초기화</span>
        </div>
      </div>
      <div class="searchItem searchItemBtns">
        <div class="searchItemBtn">
          <i class="fa-solid fa-magnifying-glass fa-2x" />
        </div>
        <router-link to="/map">
          <div class="searchItemBtn">
            <i class="mapIcon fa-solid fa-map-location-dot fa-2x" />
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { cityAddress, cityAddressDetail } from '@/utils/addressCity.js'
export default {
  data(){
    return {
      selectCityCode:'지역',
      selectCityDetailName:'세부지역',
      selectSpaceType:'공간타입',
      searchWord:'',
      selectSpaceTypeData:[
        {'name':'오피스','value':'1'},
        {'name':'데스크','value':'2'},
        {'name':'회의실','value':'3'},
      ],
      cityAddressData:[],
      cityDetailAddressData:[],
    }
  },
  created(){
    this.cityAddressData = cityAddress
    console.log(this.$route.params)
  },
  methods:{
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
    selectTermsClear(){
      this.selectCityCode = '지역'
      this.selectCityDetailName = '세부지역'
      this.selectSpaceType = '공간타입'
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
  width: 60vw;
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
  margin-top: 1vh;
  margin-right: 1vw;
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