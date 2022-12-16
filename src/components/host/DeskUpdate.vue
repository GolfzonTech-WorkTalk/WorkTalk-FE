<template>
  <div class="roomContainer">
    <p>가격기준 : 10000/시간</p>
    <form class="roomItems" @submit.prevent="roomUpdateSubmit">
      <div v-for="(item, index) in roomUpdate" :key="item" class="roomItem">
        <div>
          <p>방이름 : {{ item.roomName }}</p>
        </div>
        <div>
          <p>방설명</p>
          <p :class="(item.roomDetail.length >= '100')?'warning':'noWarning'" class="roomNameCount">
            {{ item.roomDetail.length }} / 100자
          </p>
          <textarea v-model="item.roomDetail" class="roomDetail" rows="3" placeholder="방의 설명을 작성해 주세요." />
          <p v-if="item.roomDetail.length >= '100'" class="warning">
            방설명은 100자를 초과할 수 없습니다.
          </p>
        </div>
        <div>
          <p>운영시간</p>
          <select v-model="item.workStart" class="workStart" @change="endTimeDataCheck(item.workStart)">
            <option hidden>
              시작시간
            </option>
            <option v-for="startTime in startTimeData" :key="startTime" :value="startTime.value" :disabled="startTime.disabled">
              {{ startTime.time }}
            </option>
          </select>
          <select v-model="item.workEnd" class="workEnd">
            <option hidden>
              종료시간
            </option>
            <option v-for="endTime in endTimeData" :key="endTime" :value="endTime.value" :disabled="endTime.disabled">
              {{ endTime.time }}
            </option>
          </select>
        </div>
        <div>
          <p>편의시설</p>
          <div class="iconItems">
            <div class="iconItem" :class="!item.room.park?'noSelect':'selected'" @click="item.room.park = !item.room.park">
              <i class="fa-solid fa-square-parking fa-2x" />
              <p>주차</p>
            </div>
            <div class="iconItem" :class="!item.room.wifi?'noSelect':'selected'" @click="item.room.wifi = !item.room.wifi">
              <i class="fa-solid fa-wifi fa-2x" />
              <p>인터넷/와이파이</p>
            </div>
            <div class="iconItem" :class="!item.room.whiteBoard?'noSelect':'selected'" @click="item.room.whiteBoard = !item.room.whiteBoard">
              <i class="fa-solid fa-chalkboard fa-2x" />
              <p>화이트보드</p>
            </div>
            <div class="iconItem" :class="!item.room.bim?'noSelect':'selected'" @click="item.room.bim = !item.room.bim">
              <i class="fa-solid fa-tv fa-2x" />
              <p>TV/프로젝터</p>
            </div>
            <div class="iconItem" :class="!item.room.food?'noSelect':'selected'" @click="item.room.food = !item.room.food">
              <i class="fa-solid fa-utensils fa-2x" />
              <p>음식물반입가능</p>
            </div>
            <div class="iconItem" :class="!item.room.print?'noSelect':'selected'" @click="item.room.print = !item.room.print">
              <i class="fa-solid fa-print fa-2x" />
              <p>복사/인쇄기</p>
            </div>
            <div class="iconItem" :class="!item.room.pc?'noSelect':'selected'" @click="item.room.pc = !item.room.pc">
              <i class="fa-solid fa-computer fa-2x" />
              <p>PC/노트북</p>
            </div>
            <div class="iconItem" :class="!item.room.chair?'noSelect':'selected'" @click="item.room.chair = !item.room.chair">
              <i class="fa-solid fa-chair fa-2x" />
              <p>의자/테이블</p>
            </div>
            <div class="iconItem" :class="!item.room.water?'noSelect':'selected'" @click="item.room.water = !item.room.water">
              <i class="fa-solid fa-faucet-drip fa-2x" />
              <p>정수기</p>
            </div>
          </div>
        </div>
        <div>
          <p>데스크 사진등록</p>
          <span class="boxName">업로드된 사진</span>
          <div class="imgBox">
            <div v-for="file in item.roomImgDtoList" :key="file" class="filePreview">
              <i class="fa-solid fa-trash-can fa-lg imgDelete" @click="roomImgDelete(file)" />
              <img class="preViewImg" :src="file.roomImgUrl">
            </div>
          </div>
          <span class="boxName">추가사진 등록</span>
          <div class="imgBox">
            <div v-for="file in item.roomImgPreview" :key="file" class="filePreview">
              <i class="fa-solid fa-xmark previewImgDelete fa-lg" @click="fileDeleteButton(item, file.num)" />
              <img class="preViewImg" :src="file.url">
            </div>
            <div class="spaceImg">
              <label :for="'img'+index" class="imgBtn">사진추가</label>
              <input :id="'img'+index" ref="spaceImg" type="file" multiple accept=".jpg, .png" hidden @change="fileUpload($event)">
            </div>
          </div>
        </div>
      </div>
      <button v-if="roomUpdate.length >= 1" class="addSubmitBtn">
        수 정
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
      roomUpdate: [
        {
          roomId:'3',
          roomType: 'DESK',
          roomName: '데스크룸1',
          roomPrice: '10000',
          workStart: '6',
          workEnd:'20',
          roomDetail:'테스트중입니다.',
          roomImgDtoList: [
            {roomId:3,
            roomImgId:53,
            roomImgUrl:"https://worktalk-img.s3.ap-northeast-2.amazonaws.com/4e8c3420-6fb8-4d13-b716-0cb69b87db4e-dummy1.jpg"},
          ],
          roomImg:[],
          roomImgPreview:[],
          room: {
            park:false,
            wifi:true,
            whiteBoard:false,
            bim:false,
            food:false,
            print:false,
            pc:false,
            chair:false,
            water:false,
          },
        },
      ],
      startTimeData: '',
      endTimeData: '',
    }
  },
  created(){
    this.createTime()
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
    createTime(){
      let createTime = []
      for (let i = 0; i < 25; i++){
        if (i < 10){
          let data = {'time':'0'+i+':00', 'value':i, 'disabled':false}
          createTime.push(data)
        } else {
          let data = {'time':i+':00', 'value':i, 'disabled':false}
          createTime.push(data)
        }
      }
      this.startTimeData = createTime
      this.endTimeData = createTime
    },
    // 날짜 필터
    endTimeDataCheck(startTime){
      // console.log(startTime)
      let createTime = []
      for (let i = 0; i < Number(startTime)+1; i++){
        if (i < 10){
          let data = {'time':'0'+i+':00', 'value':'0'+i, 'disabled':true}
          createTime.push(data)
        } else {
          let data = {'time':i+':00', 'value':i, 'disabled':true}
          createTime.push(data)
        }
      }
      for (let i = Number(startTime)+1; i < 25; i++){
        if (i < 10){
          let data = {'time':'0'+i+':00', 'value':'0'+i, 'disabled':false}
          createTime.push(data)
        } else {
          let data = {'time':i+':00', 'value':i, 'disabled':false}
          createTime.push(data)
        }
      }
      this.endTimeData = createTime
    },
    // 사진 내용추가
    fileUpload(event){
      const index = event.path[0].id.slice(3)
      for (let i = 0; i < event.target.files.length; i++){
        this.roomUpdate[index].roomImg = [
          ...this.roomUpdate[index].roomImg,
          {'file':event.target.files[i],'num':i},
        ]  
        this.roomUpdate[index].roomImgPreview.push({
          'url':URL.createObjectURL(event.target.files[i]),
          'num':i,
        })
      }
    },
    fileDeleteButton(item, num){
      for (let i = 0; i < item.roomImg.length; i++){
        if (item.roomImg[i].num == num){
          item.roomImg.splice(i, 1)
        }
      }
      for (let i = 0; i < item.roomImgPreview.length; i++){
        if (item.roomImgPreview[i].num == num){
          item.roomImgPreview.splice(i, 1)
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
    // 방생성
    // async 
    async roomUpdateSubmit(){
      // 이미지제외한 룸정보 배열생성
      const roomUpdateData = this.roomUpdate
      // 전송할 데이터 생성
      try {
        for (let i = 0; i < roomUpdateData.length; i++){
          let formData = new FormData()
          formData.append('spaceId', this.$route.params.spaceId)
          formData.append('spaceId', roomUpdateData[i].roomId)
          formData.append('roomDetail', roomUpdateData[i].roomDetail)
          formData.append('roomPrice', roomUpdateData[i].roomPrice)
          formData.append('workStart', roomUpdateData[i].workStart)
          formData.append('workEnd', roomUpdateData[i].workEnd)
          formData.append('roomType', roomUpdateData[i].roomImgDtoList)
          formData.append('room', roomUpdateData[i].room)
          if (roomUpdateData[i].roomImg != null){
            for (let j = 0; j < roomUpdateData[i].roomImg.length; j++){
              formData.append('multipartFileList', roomUpdateData[i].roomImg[j].file)
              console.log(roomUpdateData[i].roomImg[j].file)
            }
          }
          const responce = await roomUpdate(roomUpdateData[i].roomId, formData)
          console.log(responce)
        }
        alert('방이 생성되었습니다.')
        this.$router.push('/host')
      } catch (error){
        console.log(error)
      }
    },
  },
}
</script>

<style scoped>
.roomContainer{
  position: relative;
  overflow: auto;
  height: 100vh;
}
.roomContainer::-webkit-scrollbar{
  display: none;
}
.addUpdateBtn, .addSubmitBtn{
  margin: 2ch 17vw;
  height: 5vh;
  font-size: 1.3rem;
  letter-spacing: 1rem;
  right: 0vw;
  width: 20vw;
  border: 0;
  border-radius: 5px;
  background: rgba(139, 98, 9, 0.527);
  color: white;
  cursor: pointer;
}
.roomItem {
  position: relative;
  border: 1px solid gray;
  border-radius: 10px;
  padding: 10px;
  font-size: 0.9rem;
}
.roomDelte {
  position: absolute;
  top: 2vh;
  right: 1vw;
}
.roomItems div {
  margin: 0.5vh 0vh;
}
/* 룸이름 */
.roomName{
  width: 45vw;
  height: 1vh;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 5px;
}
.roomDetail{
  width: 45vw;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 5px;
  resize: none;
}
.workEnd{
  margin-left: 1vw;
}
.roomNameCount{
  float: right;
}
.warning{
  color: red;
}
/* 사진 선택 */
.imgBox{
  position: relative;
  margin-left: 2vw;
  margin-bottom: 1vh;
  width: 50vw;
  height: 17vh;
  border: 1px solid gray;
  padding: 0vh 1vw;
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
/* 아이콘 */
.iconItems {
  display: flex;
}
.iconItems p{
  font-size: 0.4rem;
}
.iconItem {
  width: 5.7vw;
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
/* 업로드된 사진 */
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
.filePreview{
  position: relative;
  margin: 0.5vh 0.9vw;
  border: 1px solid gray;
  width: 10vw;
  height: 15vh;
}
.addImgBox {
  border: 1px solid gray;
  width: 10vw;
  height: 15vh;
  text-align: center;
  line-height: 15vh;
}
.addImgBtn {
  font-size: 1rem;
  margin: 0 1vw;
  background: white;
  cursor: pointer;
}
.preViewImg{
  width: 10vw;
  height: 15vh;
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
</style>