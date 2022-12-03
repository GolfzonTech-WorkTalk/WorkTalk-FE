<template>
  <div id="mapContainer">
    <div id="map" />
  </div>
</template>

<script>
import { selectOneSpaceDumy } from '@/utils/dummy.js'
export default {
  data(){
    return {
      spaceItems:[],
      // 주소-좌표 변환 객체생성
      geocoder: '',
      // 인포화면 관리배열
      markerArray: [],
      infowindowArray: [],
    }
  },
  // 공간정보 출력 async
  created(){
    try {
      // const spaceId = this.$route.params.spaceId
      // let spaceResponce = await spaceOne(spaceId)
      // this.spaceItems = spaceResponce.data
      // this.memberItems = spaceResponce.data.member
      /* 더미 */
      let spaceResponce = selectOneSpaceDumy
      this.spaceItems = spaceResponce
    } catch (error){
      console.log(error)
    }
  },
  mounted(){
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
    // 카카오맵만들기
    async initMap(){
      let mapContainer = document.getElementById('map'), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(37.564343, 126.947613), // 지도의 중심좌표
        level: 8, // 지도의 확대 레벨
      }
      //지도 생성 및 객체 리턴
      let map = new kakao.maps.Map(mapContainer, mapOption)

      // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성
      let zoomControl = new kakao.maps.ZoomControl()
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)

      // 주소변환 및 마커 생성
      let infowindowArray = []
      for (let i = 0; i < this.spaceItems.length; i++){
        // 마커를 생성합니다
        let addressData = this.spaceItems[i].address + this.spaceItems[i].detailAddress
        let coords = await this.getCoordsByAddress(addressData)
        let marker = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: coords, // 마커를 표시할 위치
        })

        this.markerArray.push(marker)

        // 마커에 표시할 인포윈도우를 생성합니다
        let infowindow = new kakao.maps.InfoWindow({
          content: this.getContent(this.spaceItems[i]), // 인포윈도우에 표시할 내용
        })

        infowindowArray.push(infowindow)

        // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
        // 이벤트 리스너로는 클로저를 만들어 등록합니다
        // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
        kakao.maps.event.addListener(marker, "click", this.makeOverListener(map, marker, infowindow, infowindowArray, coords))
        kakao.maps.event.addListener(map, "click", this.makeOutListener(infowindow))
      }
    },
    // 주소-좌표 변환 함수
    getCoordsByAddress(address){
      let geocoder = new kakao.maps.services.Geocoder()
      return new Promise((resolve, reject) => {
        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(address, function(result, status){
          // 정상적으로 검색이 완료됐으면
          if (status === kakao.maps.services.Status.OK){
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x)
            resolve(coords)
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
        <span class="kakaoInfoGrade">평점(${spaceItems.grade})</span>
        <span class="kakaoInfoReview">리뷰(${spaceItems.review}건)</span>
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
  width: 70vw;
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
</style>