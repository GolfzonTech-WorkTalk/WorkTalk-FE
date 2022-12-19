<template>
  <div class="roomContainer">
    <form @submit.prevent="officeRoomSubmitCheck">
      <div class="inputBox">
        <p>가격설정</p>
        <input v-model="officeUpdate.roomPrice" class="officeTitle" type="text" :placeholder="officeUpdate.roomPrice">
      </div>
      <div class="inputBox">
        <template v-if="officeUpdate.length != 0">
          <span>오피스 설명</span>
          <p :class="( textCount(officeUpdate.roomDetail) >= '100')?'warning':'noWarning'" class="roomNameCount">
            {{ textCount(officeUpdate.roomDetail) }} / 100자
          </p>
          <textarea v-model="officeUpdate.roomDetail" class="officeDetail" rows="10" placeholder="오피스의 설명을 작성해 주세요." />
          <p v-if="textCount(officeUpdate.roomDetail) >= '100'" class="warning">
            방설명은 100자를 초과할 수 없습니다.
          </p>
        </template>
      </div>
      <div>
        <p>편의시설</p>
        <div class="iconItems">
          <div v-for="option in offeringOptionData" :key="option" class="iconItem" :class="optionCheck(officeUpdate,option.value)" @click="optionAdd(officeUpdate,option.value)">
            <i :class="option.class" />
            <p>{{ option.name }}</p>
          </div>
        </div>
      </div>
      <div class="inputBox">
        <p>오피스 사진등록</p>
        <span class="boxName">업로드된 사진</span>
        <div class="imgBox">
          <div v-for="file in officeUpdate.roomImgDtoList" :key="file" class="filePreview">
            <i class="fa-solid fa-trash-can fa-lg imgDelete" @click="roomImgDelete(file)" />
            <img class="preViewImg" :src="file.roomImgUrl">
          </div>
        </div>
        <span class="boxName">추가사진 등록</span>
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
import {roomOne} from '@/api/user'
import {roomUpdate, roomImgDelete} from '@/api/host'
export default {
  data(){
    return {
      officeUpdate: {
        roomDetail:'더미',
      },
      roomImg:[],
      roomImgPreview:[],
      offeringOptionData: [
        {'name':'주차','class':'fa-solid fa-square-parking fa-2x', 'value':'PARKING'},
        {'name':'인터넷/와이파이','class':'fa-solid fa-wifi fa-2x', 'value':'INTERNET_WIFI'},
        {'name':'화이트보드','class':'fa-solid fa-chalkboard fa-2x', 'value':'WHITEBOARD'},
        {'name':'TV/프로젝터','class':'fa-solid fa-tv fa-2x', 'value':'TV_PROJECTOR'},
        {'name':'음식물반입가능','class':'fa-solid fa-utensils fa-2x', 'value':'FOOD'},
        {'name':'복사/인쇄기','class':'fa-solid fa-print fa-2x', 'value':'PRINTER'},
        {'name':'PC/노트북','class':'fa-solid fa-computer fa-2x', 'value':'PC_LAPTOP'},
        {'name':'의자/테이블','class':'fa-solid fa-chair fa-2x', 'value':'CHAIR_TABLE'},
        {'name':'정수기','class':'fa-solid fa-faucet-drip fa-2x', 'value':'WATER'},
      ],
    }
  },
  async created(){
    await this.roomCall()
  },
  methods: {
    async roomCall(){
      try {
        this.officeUpdate = []
        const response = await roomOne(this.$route.params.spaceId)
        console.log(response.data[0])
        console.log(response.data[0].roomDetail.length)
        this.officeUpdate = response.data[0]
      } catch (error){
        console.log(error)
      }
    },
    // 옵션관리
    optionCheck(item, value){
      if (item.offeringOption == null){
        return 'noSelect'
      }
      // console.log(item.offeringOption, value)
      if (item.offeringOption != null || item.offeringOption != ''){
        if (item.offeringOption.indexOf(value) == -1){
          return 'noSelect'
        } else {
          return 'selected'
        }
      } else {
        return 'selected'
      }

    },
    optionAdd(item,value){
      if (item.offeringOption == null){
        item.offeringOption = value
      } else if (item.offeringOption.indexOf(value) == -1){
        item.offeringOption += value
      } else {
        item.offeringOption = item.offeringOption.replace(value,'')
      }
    },
    fileUpload(event){
      for (let i = 0; i < event.target.files.length; i++){
        this.roomImg = [
          ...this.roomImg,
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
      for (let i = 0; i < this.roomImg.length; i++){
        if (this.roomImg[i].num == index){
          this.roomImg.splice(i, 1)
        }
      }
      for (let i = 0; i < this.roomImgPreview.length; i++){
        if (this.roomImgPreview[i].num == index){
          this.roomImgPreview.splice(i, 1)
        }
      }
    },
    textCount(roomDetail){
      console.log(roomDetail)
      return roomDetail.length
    },
    // 업로드된 사진 삭제
    async roomImgDelete(file){
      console.log(file)
      const response = await roomImgDelete(file.roomImgId)
      console.log(response)
      this.spaceDataCall()
    },
    officeRoomSubmitCheck(){
      const officeUpdate = this.officeUpdate
      let message = ''
      if (!officeUpdate.roomPrice){
        message = '가격을 설정해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (!officeUpdate.roomDetail){
        message = '오피스 설명을 작성해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (officeUpdate.roomDetail > 100){
        message = '오피스 설명이 100자를 초과했습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (officeUpdate.roomImgDtoList.length == 0 && this.roomImg.length == 0){
        message = '오피스의 사진을 추가해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        this.officeRoomSubmit()
      }
    },
    async officeRoomSubmit(){
      try {
        const officeUpdate = this.officeUpdate
        let formData = new FormData()
        formData.append('spaceId', this.$route.params.spaceId)
        formData.append('roomId', officeUpdate.roomId)
        formData.append('roomDetail', officeUpdate.roomDetail)
        formData.append('roomPrice', officeUpdate.roomPrice)
        formData.append('workStart', officeUpdate.workStart)
        formData.append('workEnd', officeUpdate.workEnd)
        formData.append('roomType', officeUpdate.roomImgDtoList)
        formData.append('offeringOption', officeUpdate.room)
        if (officeUpdate.roomImg != null){
          for (let i = 0; i < this.roomImg.length; i++){
            formData.append('multipartFileList', this.roomImg[i].file)
          }
        }
        for (let key of formData.keys()){
          console.log(`${key}:${formData.get(key)}`)
        }
        const responce = await roomUpdate(officeUpdate.roomId, formData)
        console.log(responce)
        if (responce.status == 200){
          alert('방의 정보가 수정되었습니다.')
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
.roomContainer{
  position: relative;
  overflow: auto;
  height: 100vh;
}
.roomContainer::-webkit-scrollbar{
  display: none;
}
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
  height: 8vh;
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
.imgDelete{
  position: absolute;
  top: 1vh;
  right: 0;
}
.boxName{
  margin-left: 1vw;
  font-size: 1rem;
}
/* 아이콘 */
.iconItems {
  display: flex;
}
.iconItems p{
  font-size: 0.4rem;
}
.iconItem {
  width: 6vw;
  height: 8vh;
  padding-top: 2vh;
  border: 1px solid gray;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
}
.noSelect{
  color: rgba(184, 184, 184, 0.685);
}
.selected{
  background: rgba(0, 0, 255, 0.342);
  color: white;
}
</style>