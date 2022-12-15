<template>
  <div>
    <form @submit.prevent="officeRoomSubmitCheck">
      <div class="inputBox">
        <p>가격설정</p>
        <input v-model="officeRoom.roomPrice" class="officeTitle" type="text" placeholder="숫자만 입력해 주세요.">
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
        <p>오피스 사진등록</p>
        <div class="imgBox">
          <div v-for="file in roomImgPreview" :key="file" class="filePreview">
            <i class="fa-solid fa-xmark previewImgDelete fa-lg" @click="fileDeleteButton(file.num)" />
            <img class="preViewImg" :src="file.url">
          </div>
          <div class="spaceImg">
            <label for="imgBtn" class="imgBtn">사진추가</label>
            <input id="imgBtn" ref="spaceImg" type="file" multiple accept=".jpg, .png" hidden @change="fileUpload($event)">
          </div>
        </div>
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
        roomImg: [],
        roomPrice: '',
        workStart: '8',
        workEnd:'23',
        roomDetail:'',
      },
      roomImgPreview:[],
      officeDetail: '',
    }
  },
  methods: {
    fileUpload(event){
      for (let i = 0; i < event.target.files.length; i++){
        this.officeRoom.roomImg = [
          ...this.officeRoom.roomImg,
          {'file':event.target.files[i],'num':i},
        ]  
      }
      for (let i = 0; i < event.target.files.length; i++){
        this.roomImgPreview.push({
          'url':URL.createObjectURL(event.target.files[i]),
          'num':i,
        })
      }
    },
    fileDeleteButton(index){
      for (let i = 0; i < this.officeRoom.roomImg.length; i++){
        if (this.officeRoom.roomImg[i].num == index){
          this.officeRoom.roomImg.splice(i, 1)
        }
      }
      for (let i = 0; i < this.roomImgPreview.length; i++){
        if (this.roomImgPreview[i].num == index){
          this.roomImgPreview.splice(i, 1)
        }
      }
    },
    officeRoomSubmitCheck(){
      const officeRoom = this.officeRoom
      let message = ''
      if (!officeRoom.roomPrice){
        message = '가격을 설정해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (!officeRoom.roomDetail){
        message = '오피스 설명을 작성해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (officeRoom.roomDetail > 100){
        message = '오피스 설명이 100자를 초과했습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (!officeRoom.roomImg){
        message = '오피스의 사진을 추가해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        this.officeRoomSubmit()
      }
    },
    async officeRoomSubmit(){
      try {
        const officeRoom = this.officeRoom
        let formData = new FormData()
        formData.append('spaceId', officeRoom.spaceId)
        formData.append('roomType', officeRoom.roomType)
        formData.append('roomName', officeRoom.roomName)
        formData.append('roomDetail', officeRoom.roomDetail)
        formData.append('roomPrice', officeRoom.roomPrice)
        formData.append('workStart', officeRoom.workStart)
        formData.append('workEnd', officeRoom.workEnd)
        if (officeRoom.roomImg != null){
          for (let i = 0; i < officeRoom.roomImg.length; i++){
            formData.append('multipartFileList', officeRoom.roomImg[i].file)
          }
        }
        for (let key of formData.keys()){
          console.log(`${key}:${formData.get(key)}`)
        }
        const responce = await roomCreate(formData)
        console.log(responce)
        if (responce.status == 200){
          alert('방이 생성되었습니다.')
          this.$router.push('/host')
        }
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
  height: 5vh;
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
/* 사진 선택 */
.imgBox{
  position: relative;
  margin-left: 2vw;
  margin-bottom: 1vh;
  width: 50vw;
  height: 15vh;
  border: 1px solid gray;
  padding: 1vh 1vw;
  display: flex;
  flex-wrap: wrap;
  overflow: scroll;
  overflow-x: unset;
}
.spaceImg {
  border: 1px solid gray;
  width: 10vw;
  height: 15vh;
  text-align: center;
  line-height: 15vh;
}
.imgBtn {
  font-size: 1rem;
  margin: 0 1vw;
  background: white;
  cursor: pointer;
}
.filePreview{
  position: relative;
  margin: 0.5vh 0.9vw;
  border: 1px solid gray;
  width: 10vw;
  height: 15vh;
}
.preViewImg{
  width: 10vw;
  height: 15vh;
}
.previewImgDelete{
  position: absolute;
  top: 1vh;
  right: 0;
}
</style>