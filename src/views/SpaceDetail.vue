<template>
  <div class="spaceDetailBox">
    <div class="space">
      <space-info />
    </div>
    <div class="RoomAndMap">
      <div>
        <space-map />
      </div>
      <div>
        <room-info />  
      </div>
    </div>
  </div>
</template>

<script>
import spaceInfo from '@/components/spaceDetail/spaceInfo.vue'
import roomInfo from '@/components/spaceDetail/roomInfo.vue'
import spaceMap from '@/components/spaceDetail/spaceMap.vue'
export default {
  components: {
    spaceInfo,
    roomInfo,
    spaceMap,
  },
}
</script>

<style scoped>
.spaceDetailBox{
  position: relative;
  justify-content: center;
  background: rgb(230, 230, 230);
  display: flex;
  height: 110vh;
}
.space {
  width: 40vw;
  background: white;
  overflow-y: scroll;
}
.space::-webkit-scrollbar {
  display: none;
}
.RoomAndMap{
  width: 20vw;
  background: white;
}
</style>