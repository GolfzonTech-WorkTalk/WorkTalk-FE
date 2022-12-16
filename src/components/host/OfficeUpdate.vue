<template>
  <div class="roomContainer">
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
      <div>
        <p>편의시설</p>
        <div class="iconItems">
          <div class="iconItem" :class="!officeRoom.room.park?'noSelect':'selected'" @click="officeRoom.room.park = !officeRoom.room.park">
            <i class="fa-solid fa-square-parking fa-2x" />
            <p>주차</p>
          </div>
          <div class="iconItem" :class="!officeRoom.room.wifi?'noSelect':'selected'" @click="officeRoom.room.wifi = !officeRoom.room.wifi">
            <i class="fa-solid fa-wifi fa-2x" />
            <p>인터넷/와이파이</p>
          </div>
          <div class="iconItem" :class="!officeRoom.room.whiteBoard?'noSelect':'selected'" @click="officeRoom.room.whiteBoard = !officeRoom.room.whiteBoard">
            <i class="fa-solid fa-chalkboard fa-2x" />
            <p>화이트보드</p>
          </div>
          <div class="iconItem" :class="!officeRoom.room.bim?'noSelect':'selected'" @click="officeRoom.room.bim = !officeRoom.room.bim">
            <i class="fa-solid fa-tv fa-2x" />
            <p>TV/프로젝터</p>
          </div>
          <div class="iconItem" :class="!officeRoom.room.food?'noSelect':'selected'" @click="officeRoom.room.food = !officeRoom.room.food">
            <i class="fa-solid fa-utensils fa-2x" />
            <p>음식물반입가능</p>
          </div>
          <div class="iconItem" :class="!officeRoom.room.print?'noSelect':'selected'" @click="officeRoom.room.print = !officeRoom.room.print">
            <i class="fa-solid fa-print fa-2x" />
            <p>복사/인쇄기</p>
          </div>
          <div class="iconItem" :class="!officeRoom.room.pc?'noSelect':'selected'" @click="officeRoom.room.pc = !officeRoom.room.pc">
            <i class="fa-solid fa-computer fa-2x" />
            <p>PC/노트북</p>
          </div>
          <div class="iconItem" :class="!officeRoom.room.chair?'noSelect':'selected'" @click="officeRoom.room.chair = !officeRoom.room.chair">
            <i class="fa-solid fa-chair fa-2x" />
            <p>의자/테이블</p>
          </div>
          <div class="iconItem" :class="!officeRoom.room.water?'noSelect':'selected'" @click="officeRoom.room.water = !officeRoom.room.water">
            <i class="fa-solid fa-faucet-drip fa-2x" />
            <p>정수기</p>
          </div>
        </div>
      </div>
      <div class="inputBox">
        <p>오피스 사진등록</p>
        <span class="boxName">업로드된 사진</span>
        <div class="imgBox">
          <div v-for="file in officeRoom.roomImgDtoList" :key="file" class="filePreview">
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
      officeRoom: {
        roomId:'3',
        roomType: 'OFFICE',
        roomName: '오피스더미',
        roomPrice: '20000',
        workStart: '8',
        workEnd:'23',
        roomDetail:'테스트중입니다.',
        roomImgDtoList: [
          {roomId:3,
          roomImgId:53,
          roomImgUrl:"https://worktalk-img.s3.ap-northeast-2.amazonaws.com/4e8c3420-6fb8-4d13-b716-0cb69b87db4e-dummy1.jpg"},
        ],
        room: {
          park:false,
          wifi:false,
          whiteBoard:false,
          bim:false,
          food:false,
          print:false,
          pc:false,
          chair:false,
          water:false,
        },
      },
      roomImg:[],
      roomImgPreview:[],
      officeDetail: '',
    }
  },
  created(){
    this.roomCall()
  },
  methods: {
    async roomCall(){
      const response = await roomOne(this.$route.params.spaceId)
      for (let i = 0; i < response.data.length; i++){
        response.data[i].roomImg = []
        response.data[i].roomImgPreview = []
      }
      console.log(response)
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
    // 업로드된 사진 삭제
    async roomImgDelete(file){
      console.log(file)
      const response = await roomImgDelete(file.roomImgId)
      console.log(response)
      this.spaceDataCall()
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
        formData.append('spaceId', this.$route.params.spaceId)
        formData.append('roomId', officeRoom.roomId)
        formData.append('roomDetail', officeRoom.roomDetail)
        formData.append('roomPrice', officeRoom.roomPrice)
        formData.append('workStart', officeRoom.workStart)
        formData.append('workEnd', officeRoom.workEnd)
        formData.append('roomType', officeRoom.roomImgDtoList)
        formData.append('room', officeRoom.room)
        if (officeRoom.roomImg != null){
          for (let i = 0; i < this.roomImg.length; i++){
            formData.append('multipartFileList', this.roomImg[i].file)
          }
        }
        for (let key of formData.keys()){
          console.log(`${key}:${formData.get(key)}`)
        }
        const responce = await roomUpdate(officeRoom.roomId, formData)
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