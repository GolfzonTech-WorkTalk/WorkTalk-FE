<template>
  <div>
    <form @submit.prevent="officeRoomSubmit">
      오피스 가격설정 만들기
      <div>
        <p>가격</p>
        <input type="text" placeholder="숫자만 입력해 주세요.">
      </div>
      <div>
        <p>오피스 설명</p>
        <textarea v-model="officeRoom.roomDetail" rows="10" placeholder="오피스의 설명을 작성해 주세요." />
      </div>
      <div>
        <p>오피스 사진</p>
        <input ref="roomImg" type="file" multiple accept="image/*" @change="fileUpload">
      </div>
      <button>저장</button>
    </form>
  </div>
</template>

<script>
import {roomCreate} from '@/api/host'
export default {
  data(){
    return {
      officeRoom: {
        roomType: 'OFFICE',
        roomName: this.$route.params.name,
        roomImg: '',
        roomPrice: '',
        workStart: '',
        workEnd:'',
        roomDetail:'',
      },
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
        let formData = new FormData()
        formData.append('roomType', officeRoom.roomType)
        formData.append('roomName', officeRoom.roomName)
        if (!officeRoom.spaceImg){
          formData.append('roomImg', officeRoom.roomImg)
        }
        formData.append('roomPrice', officeRoom.roomPrice)
        formData.append('workStart', officeRoom.workStart)
        formData.append('workEnd', officeRoom.workEnd)
        formData.append('roomDetail', officeRoom.roomDetail)
        const responce = await roomCreate(formData)
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

</style>