<template>
  <div>
    <form @submit.prevent="officeRoomSubmit">
      <div class="inputBox">
        <p>가격설정</p>
        <input class="officeTitle" type="text" placeholder="숫자만 입력해 주세요.">
      </div>
      <div class="inputBox">
        <span>오피스 설명</span>
        <p :class="(officeRoom.roomDetail.length >= '100')?'warning':'noWarning'" class="officeNameCount">
          {{ officeRoom.roomDetail.length }} / 100자
        </p>
        <textarea v-model="officeRoom.roomDetail" class="officeDetail" rows="10" placeholder="오피스의 설명을 작성해 주세요." />
        <p v-if="officeRoom.roomDetail.length >= '100'" class="warning">
          방설명은 100자를 초과할 수 없습니다.
        </p>
      </div>
      <div class="inputBox">
        <p>오피스 사진</p>
        <input ref="roomImg" type="file" multiple accept="image/*" @change="fileUpload">
      </div>
      <button class="submitBtn">
        저장
      </button>
    </form>
  </div>
</template>

<script>
import {roomCreate} from '@/api/host'
export default {
  data(){
    return {
      officeRoom: {
        spaceId: this.$route.params.spaceId,
        roomType: 'OFFICE',
        roomName: this.$route.params.name,
        roomImg: '',
        roomPrice: '',
        workStart: '',
        workEnd:'',
        roomDetail:'',
      },
      officeDetail: '',
    }
  },
  methods: {
    fileUpload(e){
      console.log(e.target.files)
      this.roomImg = e.target.files
    },
    async officeRoomSubmit(){
      try {
        const officeRoom = this.officeRoom
        // let formData = new FormData()
        // formData.append('roomId', officeRoom.spaceId)
        // formData.append('roomType', officeRoom.roomType)
        // formData.append('roomName', officeRoom.roomName)
        // if (!officeRoom.spaceImg){
        //   formData.append('roomImg', officeRoom.roomImg)
        // }
        // formData.append('roomPrice', officeRoom.roomPrice)
        // formData.append('workStart', officeRoom.workStart)
        // formData.append('workEnd', officeRoom.workEnd)
        // formData.append('roomDetail', officeRoom.roomDetail)
        // console.log(officeRoom.spaceId)
        const createData = {
          'spaceId': officeRoom.spaceId,
          'roomType': officeRoom.roomType,
          'roomName': officeRoom.roomName,
          'roomImg': officeRoom.roomImg,
          'roomPrice': officeRoom.roomPrice,
          'workStart': officeRoom.workStart,
          'workEnd': officeRoom.workEnd,
          'roomDetail': officeRoom.roomDetail,
        }
        const responce = await roomCreate(createData, officeRoom.spaceId)
        console.log(responce)
        // alert('방이 생성되었습니다.')
        // this.$router.push('/host')
      } catch (error){
        console.log(error)
      }
    },
  },
}
</script>

<style scpoed>
.inputBox{
  font-size: 1.1rem;
  margin: 2vh 0;
}
.officeNameCount{
  font-size: 1rem;
  float: right;
}
.officeDetail, .officeTitle {
  margin: 0.5vh 0.5vw;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 10px;
}
.officeTitle{
  width: 20vw;
}
.officeDetail{
  width: 53vw;
  resize: none;
}
.warning{
  color: red;
  float: right;
}
.submitBtn{
  margin: 2ch 17vw;
  height: 3vh;
  font-size: 1.3rem;
  letter-spacing: 1rem;
  right: 0vw;
  width: 20vw;
  border: 0;
  border-radius: 5px;
  background: rgba(4, 90, 4, 0.527);
  color: white;
  cursor: pointer;
}
</style>