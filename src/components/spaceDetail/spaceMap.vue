<template>
  <div id="mapContainer">
    <div id="map" />
    <div class="hostInfo">
      <p>{{ memberItems.name }}</p>
      <p>{{ memberItems.tel }}</p>
    </div>
  </div>
</template>

<script>
import { spaceOne } from '@/api/user.js'
// import { selectOneSpaceDumy } from '@/utils/dummy/dummy.js'
export default {
  data(){
    return {
      spaceItems:{},
      memberItems:{},
    }
  },
  // 공간정보 출력
  async created(){
    try {
      const spaceId = this.$route.params.spaceId
      console.log(spaceId)
      let spaceResponce = await spaceOne(spaceId)
      console.log(spaceResponce)
      this.spaceItems = spaceResponce.data
      this.memberItems = spaceResponce.data.member
      /* 더미 */
      // let spaceResponce = selectOneSpaceDumy
      // console.log(spaceResponce)
      // console.log(spaceResponce[0].member)
      // this.spaceItems = spaceResponce
      // this.memberItems = spaceResponce[0].member
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
      script.src =
        'http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=2627ce9d62772f5e16c1c48d472aadbd&libraries=services'
      document.head.appendChild(script)
    }
  },
  methods: {
    initMap(){
      let mapContainer = document.getElementById('map'), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(37.564343, 126.947613), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      }
      //지도 생성 및 객체 리턴
      let map = new kakao.maps.Map(mapContainer, mapOption)

      // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성
      let zoomControl = new kakao.maps.ZoomControl()
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)

      // 주소-좌표 변환 객체생성
      let geocoder = new kakao.maps.services.Geocoder()

      // 주소변환 및 마커 생성
      // console.log(this.spaceItems)
      // console.log(this.spaceItems[0].address)

      let addressData = this.spaceItems.address + this.spaceItems.detailAddress

      geocoder.addressSearch(addressData, function(result, status){
        if (status === kakao.maps.services.Status.OK){
          let coords = new kakao.maps.LatLng(result[0].y, result[0].x)
          let marker = new kakao.maps.Marker({
            map: map,
            position: coords,
          })
          //마커가 지도 위에 표시 되도록 설정
          marker.setMap(map)
          // 중심이동
          map.setCenter(coords)
        }
      })
    },
  },
}
</script>

<style scoped>
#mapContainer {
  background: white;
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 0;
}
#map{
  margin: 6vh 1vw 1vh 1vw;
  width: 18vw;
  height: 25vh;
  border: 0;
}
.hostInfo{
  margin-left: 1vw;
  font-size: 1rem;

}
</style>