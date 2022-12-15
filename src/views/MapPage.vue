<template>
  <div id="mapContainer">
    <div class="mapLocationSortBox">
      <select v-model="selectCityCode" class="mapLocationSort" :class="{'selectTerms':selectCityCode!='지역코드'}" @change="selectCityOne">
        <option value="지역코드" hidden>
          지역
        </option>
        <option v-for="item in cityAddressData" :key="item" :value="item.typeCode">
          {{ item.name }}
        </option>
      </select>
      <select v-model="selectCityDetailName" class="mapLocationSort" :class="{'selectTerms':selectCityDetailName!='세부지역'}" @change="selectCityDetailOne">
        <option value="세부지역" hidden>
          세부지역
        </option>
        <option v-for="item in cityDetailAddressData" :key="item" :value="item.name">
          {{ item.name }}
        </option>
      </select>
      <select v-model="selectSpaceType" class="mapLocationSort" :class="{'selectTerms':selectSpaceType!='공간타입'}" @change="spaceInfoSearch">
        <option value="공간타입" hidden>
          공간타입
        </option>
        <option v-for="item in selectSpaceTypeData" :key="item" :value="item.value">
          {{ item.name }}
        </option>
      </select>
      <input v-model="searchWord" :class="{'selectTerms':searchWord!=''}" type="text" placeholder="키워드검색" class="mapLocationSort">
      <div class="selectTermsClearBtn" @click="selectTermsClear">
        <i class="fa-solid fa-rotate-right fa-lg" />
        <span>초기화</span>
      </div>
    </div>
    <div id="map" />
  </div>
</template>

<script>
import { cityAddress, cityAddressDetail } from '@/utils/addressCity.js'
import {spaceSearch} from '@/api/user.js'
export default {
  data(){
    return {
      // 검색데이터
      cityAddressData:[],
      cityDetailAddressData:[],
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
      // 공간정보
      spaceItems:[],
      // 주소-좌표 변환 객체생성
      geocoder: '',
      // 인포화면 관리배열
      markerArray: [],
      infowindow:'',
      infowindowArray: [],
      // 맵
      map:'',
    }
  },
  // 공간정보 출력
  created(){
    this.paramsCheck()
    this.spaceInfoSearch()
    this.$store.dispatch('SPINNERVIEW', false)
  },
  mounted(){
    // 카카오API
    if (window.kakao && window.kakao.maps){
      this.initMap()
    } else {
      const script = document.createElement('script')
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap)
      script.src = 'http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=2627ce9d62772f5e16c1c48d472aadbd&libraries=services'
      document.head.appendChild(script)
    }
  },
  methods: {
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
    // 조건 초기화
    selectTermsClear(){
      this.selectCityCode = '지역코드'
      this.selectCityName='지역'
      this.selectCityDetailName = '세부지역'
      this.selectSpaceType = '공간타입'
      this.searchWord=''
      this.spaceInfoSearch()
    },
    async spaceInfoSearch(){
      try {
        const response = await spaceSearch(this.pageNum,this.spaceType,this.spaceName,this.address)
        this.spaceItems = response.data.data
      } catch (error){
        console.log(error)
      }
    },
    // 지역선택
    async selectCityOne(){
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
      let address = this.selectCityName
      let coordinate = await this.getCoordsByAddress(address)
      // console.log(coordinate.La)
      // console.log(coordinate.Ma)
      this.setCenter(coordinate.Ma, coordinate.La)
      this.zoomOut()
    },
    // 세부지역 선택
    async selectCityDetailOne(){
      let address = this.selectCityName+' '+this.selectCityDetailName
      let coordinate = await this.getCoordsByAddress(address)
      // console.log(coordinate.La)
      // console.log(coordinate.Ma)
      this.setCenter(coordinate.Ma, coordinate.La)
      this.zoomIn()
    },
    // 지도이동
    setCenter(x, y){            
      // 이동할 위도 경도 위치를 생성합니다 
      var moveLatLon = new kakao.maps.LatLng(x, y)
      // 지도 중심을 이동 시킵니다
      this.map.panTo(moveLatLon)
    },
    // 지도레벨조정
    zoomIn(){        
      this.map.setLevel(5)
    },
    zoomOut(){    
      this.map.setLevel(8)
    },
    // 카카오맵만들기
    async initMap(){
      let mapContainer = document.getElementById('map'),
      mapOption = {
        center: new kakao.maps.LatLng(37.564343, 126.947613), // 지도의 중심좌표
        level: 8, // 지도의 확대 레벨
      }
      
      //지도 생성 및 객체 리턴
      this.map = new kakao.maps.Map(mapContainer, mapOption)

      // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성
      let zoomControl = new kakao.maps.ZoomControl()
      this.map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)

      // 주소변환 및 마커 생성
      let infowindowArray = []
      for (let i = 0; i < this.spaceItems.length; i++){
        // 마커를 생성합니다
        let addressData = this.spaceItems[i].address
        // if (this.spaceItems[i].detailAddress != null){
        //   addressData = this.spaceItems[i].address +' '+ this.spaceItems[i].detailAddress
        // }
        let coords = await this.getCoordsByAddress(addressData)
        let marker = new kakao.maps.Marker({
          map: this.map, // 마커를 표시할 지도
          position: coords, // 마커를 표시할 위치
        })

        this.markerArray.push(marker)

        // 마커에 표시할 인포윈도우를 생성합니다
        this.infowindow = new kakao.maps.InfoWindow({
          content: this.getContent(this.spaceItems[i]), // 인포윈도우에 표시할 내용
        })

        infowindowArray.push(this.infowindow)

        // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
        // 이벤트 리스너로는 클로저를 만들어 등록합니다
        // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
        kakao.maps.event.addListener(marker, "click", this.makeOverListener(this.map, marker, this.infowindow, infowindowArray, coords))
        kakao.maps.event.addListener(this.map, "click", this.makeOutListener(this.infowindow))
      }
    },
    // 주소-좌표 변환 함수
    getCoordsByAddress(address){
      console.log(address)
      let geocoder = new kakao.maps.services.Geocoder()
      return new Promise((resolve, reject) => {
        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(address, function(result, status){
          // 정상적으로 검색이 완료됐으면
          if (status === kakao.maps.services.Status.OK){
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x)
            resolve(coords)
            // console.log(coords)
            return
          }
          reject(new Error("getCoordsByAddress Error: not Vaild Address"))
        })
      })
    },

    // 인포윈도우 가공하기
    getContent(spaceItems){
      return `
      <div class="kakaoInfoBox">
        <a href="${this.itemLink(spaceItems.spaceName, spaceItems.spaceId, spaceItems.spaceType)}">
          <p>${spaceItems.spaceName}</p>
        </a>
        <span class="kakaoInfoGrade">평점(${spaceItems.gradeAvg})</span>
        <span class="kakaoInfoReview">리뷰(${spaceItems.count}건)</span>
        <p class="kakaoInfoAddress">${spaceItems.address+spaceItems.detailAddress}</p>
      </div>
      `
    },
    itemLink(spaceName, spaceId, spaceType){
      return '/spaceOne/'+spaceName+'/'+ spaceId + '/' + spaceType
    },

    // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
    // 1. 클릭시 다른 인포윈도우 닫기
    // 2. 클릭한 곳으로 지도 중심 옮기기
    makeOverListener(map, marker, infowindow, infowindowArray, coords){
      return function(){
        // 1. 클릭시 다른 인포윈도우 닫기
        for (let infowindow of infowindowArray){
          infowindow.close()
        }
        infowindow.open(map, marker)
        // 2. 클릭한 곳으로 지도 중심 옮기기
        map.panTo(coords)
      }
    },
    // 인포윈도우를 닫는 클로저를 만드는 함수입니다
    makeOutListener(infowindow){
      return function(){
        infowindow.close()
      }
    },
  },
}
</script>

<style>
#mapContainer {
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.13);
}
#map{
  border: 1px solid gray;
  width: 80vw;
  height: 110vh;
  border: 0;
}
.kakaoInfoBox {
  padding: 1vh 1vw;
}
.kakaoInfoBox a:hover {
  text-decoration: underline;
  color: rgb(82, 82, 194);
}
.kakaoInfoAddress{
  color: gray;
  font-size: 0.5rem;
}
.kakaoInfoGrade, .kakaoInfoReview{
  font-size: 0.8rem
}
.mapLocationSortBox{
  position: absolute;
  width: 70vw;
  padding: 2vh 0vw;
  z-index: 2;
  left: 10vw;
}
.mapLocationSort{
  width: 9vw;
  border: 3px solid rgb(157, 208, 224);
  border-radius: 10px;
  padding: 0.5vh 0.5vw;
  font-size: 1rem;
  font-weight: bold;
  margin-right: 1vw;
  margin-bottom: 1vh;
}
.selectTerms{
  color: rgb(108, 108, 209);
  font-weight: bold;
}
.selectTermsClearBtn{
  display: inline;
  cursor: pointer;
  color: gray;
  font-size: 1rem;
}
</style>