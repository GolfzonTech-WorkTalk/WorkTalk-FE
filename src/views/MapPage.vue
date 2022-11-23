<template>
  <div id="mapContainer">
    <div id="map" />
  </div>
</template>

<script>
export default {
  data(){
    return {
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
        'http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=2627ce9d62772f5e16c1c48d472aadbd'
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

      // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
      var zoomControl = new kakao.maps.ZoomControl()
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)

      var positions = [
        {
          latlng: new kakao.maps.LatLng(37.562632898194835, 126.9454282268269),
        },
        {
          latlng: new kakao.maps.LatLng(37.56195884514403, 126.94922601468826),
        },
      ]
      // 마커 생성
      positions.forEach(function(pos){
        let marker = new kakao.maps.Marker({
          position: pos.latlng,
        })
        //마커가 지도 위에 표시 되도록 설정
        marker.setMap(map)
      })
    },
  },
}
</script>

<style scoped>
#mapContainer {
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.13);
}
#map{
  border: 1px solid gray;
  width: 80vw;
  height: 100vh;
  border: 0;
}
</style>