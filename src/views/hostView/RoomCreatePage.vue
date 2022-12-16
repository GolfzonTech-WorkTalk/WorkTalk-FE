<template>
  <div class="backgound">
    <div class="createBox">
      <div class="spaceName">
        <span :class="spaceTypeClass">{{ spaceType }}</span>
        <span>공간명 : {{ name }}</span>
      </div>
      <template v-if="spaceType == '데스크'">
        <desk-create />
      </template>
      <template v-else-if="spaceType == '회의실'">
        <meeting-room-create />
      </template>
      <template v-else>
        <office-create />
      </template>
    </div>
  </div>
</template>

<script>
import DeskCreate from '@/components/host/DeskCreate.vue'
import OfficeCreate from '@/components/host/OfficeCreate.vue'
import MeetingRoomCreate from '@/components/host/MeetingRoomCreate.vue'
export default {
  components: { DeskCreate, OfficeCreate, MeetingRoomCreate },
  data(){
    return {
      name: this.$route.params.name,
      spaceType: '',
      spaceTypeClass:'',
    }
  },
  computed: {
  },
  created(){
    // console.log(this.$route.params.name)
    // console.log(this.$route.params.spaceType)
    const spaceType = this.$route.params.spaceType
    if (spaceType == '2'){
      this.spaceType = '데스크'
      this.spaceTypeClass = 'deskLabel LabelDesign'
    } else if (spaceType == '3'){
      this.spaceType = '회의실'
      this.spaceTypeClass = 'meetingRoomLabel LabelDesign'
    } else {
      this.spaceType = '오피스'
      this.spaceTypeClass = 'officeLabel LabelDesign'
    }
    this.$store.dispatch('SPINNERVIEW')
  },
  methods: {
  },
}
</script>

<style scoped>
.backgound {
  background: rgb(230, 230, 230);
}
.createBox {
  background: white;
  margin: auto;
  width: 55vw;
  height: 100vh;
  padding: 2.5vw;
  font-weight: bold;
}
.spaceName {
  margin: 1vh 0;
  font-size: 1.2rem;
}
.LabelDesign {
  border-radius: 5px;
  padding: 3px 10px;
  margin-right: 10px;
  font-size: 0.9rem;
  font-weight: bold;
  letter-spacing: 0.3rem;
  color: white;
}
.deskLabel{
  background: rgba(139, 98, 9, 0.527);
}
.meetingRoomLabel{
  background: rgba(9, 44, 139, 0.527);
}
.officeLabel{
  background: rgba(4, 90, 4, 0.527);
}
</style>