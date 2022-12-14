<template>
  <div class="spaceStatusUpdateBox">
    <div class="updateTitleBox">
      <p class="updateTitleSpaceName">
        '{{ spaceStatusUpdate.spaceName }}'
      </p>
      <template v-if="spaceStatusUpdate.spaceStatus == 'approved'">
        <p>운용정지 하시겠습니까?</p>
      </template>
      <template v-if="spaceStatusUpdate.spaceStatus == 'waiting'">
        <p>검수승인 하시겠습니까?</p>
      </template>
      <template v-if="spaceStatusUpdate.spaceStatus == 'rejected'">
        <p>운용정지를 해제하시겠습니까?</p>
      </template>
    </div>
    <div class="updateBtnBox">
      <template v-if="spaceStatusUpdate.spaceStatus == 'approved'">
        <span class="updateBtn suspension" @click="updateSpace(spaceStatusUpdate, 'rejected')">정지</span>
      </template>
      <template v-if="spaceStatusUpdate.spaceStatus == 'waiting'">
        <span class="updateBtn approved" @click="updateSpace(spaceStatusUpdate, 'approved')">승인</span>
      </template>
      <template v-if="spaceStatusUpdate.spaceStatus == 'rejected'">
        <span class="updateBtn remove" @click="updateSpace(spaceStatusUpdate, 'approved')">해제</span>
      </template>
      <span class="updateBtn" @click="updateCancel">닫기</span>
    </div>
  </div>
</template>

<script>
import {spaceApprove, spaceRejected} from '@/api/master.js'
export default {
  props: {
    spaceStatusUpdate: {
      type:Object,
      required: true,
    },
  },
  emits:['updateCancel','update-status'],
  methods: {
    async updateSpace(spaceStatusUpdate, Status){
      // console.log(spaceStatusUpdate)
      let response
      if (Status == 'approved'){
        response = await spaceApprove(spaceStatusUpdate.spaceId)
      } else {
        response = await spaceRejected(spaceStatusUpdate.spaceId)
      }
      console.log(response)
      this.updateCancel()
      this.$emit('update-status')
    },
    updateCancel(){
      this.$emit('updateCancel')
    },
  },

}
</script>

<style scoped>
.spaceStatusUpdateBox{
  text-align: center;
  position: absolute;
  top: 20%;
  left: 27%;
  background: white;
  width: 25vw;
  height: 13vh;
  border-radius: 10px;
  z-index: 1;
}
.updateTitleBox{
  margin: 1vh 0;
}
.updateTitleSpaceName{
  font-weight: bold;
}
/* 버튼 */
.updateBtn{
  border: 1px solid gray;
  border-radius: 10px;
  padding: 0 0.5vw;
  margin: 0 0.5vw;
  cursor: pointer;
}
.suspension:hover{
  background: rgb(163, 47, 47);
  color: white;
}
.approved:hover,.remove:hover{
  background: rgb(129, 129, 223);
  color: white;
}
</style>