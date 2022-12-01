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
        <template v-if="spaceType == 1">
          <office-info />
        </template>
        <template v-else>
          <deskmeeting-room />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import spaceInfo from '@/components/spaceDetail/spaceInfo.vue'
import deskmeetingRoom from '@/components/spaceDetail/deskmeetingRoom.vue'
import officeInfo from '@/components/spaceDetail/officeInfo.vue'
import spaceMap from '@/components/spaceDetail/spaceMap.vue'
export default {
  components: {
    spaceInfo,
    deskmeetingRoom,
    officeInfo,
    spaceMap,
  },
  data(){
    return {
      spaceType: this.$route.params.spaceType,
    }
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
  overflow-y: scroll;
}
.RoomAndMap::-webkit-scrollbar {
  display: none;
}
</style>