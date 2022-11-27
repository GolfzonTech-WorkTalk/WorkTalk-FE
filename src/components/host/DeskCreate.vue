<template>
  <div class="roomContainer">
    <p>가격기준 : 10000/시간</p>
    <button class="addCreateBtn" @click="addCreateFrom">
      공간추가
    </button>
    <form class="roomItems" @submit.prevent="roomCreateSubmit">
      <div v-for="(item, index) in roomCreate" :key="item" class="roomItem">
        <i class="fa-solid fa-trash-can fa-lg roomDelte" @click="deleteRoomItem(index)" />
        <div>
          <p>방이름</p>
          <p :class="(item.roomName.length >= '20')?'warning':'noWarning'" class="roomNameCount">
            {{ item.roomName.length }} / 20자
          </p>
          <input v-model="item.roomName" class="roomName" type="text" placeholder="방의 이름을 작성해 주세요.">
          <p v-if="item.roomName.length >= '20'" class="warning">
            방이름은 20자를 초과할 수 없습니다.
          </p>
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
          <p>방사진</p>
          <input type="file" multiple accept="image/*" class="files">
        </div>
      </div>
      <button v-if="roomCreate.length >= 1" class="addSubmitBtn">
        저 장
      </button>
    </form>
  </div>
</template>

<script>
import {roomCreate} from '@/api/host'
export default {
  data(){
    return {
      roomCreate: [
        {
          spaceId: this.$route.params.spaceId,
          roomType: 'DESK',
          roomName: '',
          roomImg: '',
          roomPrice: '10000',
          workStart: '시작시간',
          workEnd:'종료시간',
          roomDetail:'',
        },
      ],
      startTimeData: '',
      endTimeData: '',
    }
  },
  created(){
    // console.log(this.$route.params.spaceType)
    let createTime = []
    for (let i = 0; i < 25; i++){
      if (i < 10){
        let data = {'time':'0'+i+':00', 'value':'0'+i, 'disabled':false}
        createTime.push(data)
      } else {
        let data = {'time':i+':00', 'value':i, 'disabled':false}
        createTime.push(data)
      }
    }
    this.startTimeData = createTime
    this.endTimeData = createTime
  },
  methods: {
    // 배열내용추가
    addCreateFrom(){
      console.log('클릭')
      this.roomCreate.push({
          roomType: 'DESK',
          roomName: '',
          roomImg: '',
          roomPrice: '',
          workStart: '시작시간',
          workEnd:'종료시간',
          roomDetail:'',
        })
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
    // 배열내용 삭제
    deleteRoomItem(index){
      console.log('클릭')
      console.log(index)
      console.log(this.roomCreate[index])
      this.roomCreate.splice(index, 1)
    },
    // 사진 내용추가
    fileUpload(e){
      console.log(e.target.files)
      //.roomImg = e.target.files
    },
    // 방생성
    // async 
    async roomCreateSubmit(){
      // 이미지제외한 룸정보 배열생성
      const roomCreateData = this.roomCreate
      // 이미지 배열생성
      let fileInput = document.querySelectorAll('.files')
      console.log(fileInput)
      // 전송할 데이터 생성
      // for await (const item of roomCreateData){

      // 대기!!!!!!
      // for (let i = 0; i < roomCreateData.length; i++){
      //   try {
      //     let formData = new FormData()
      //     formData.append('roomType', roomCreateData[i].roomType)
      //     formData.append('roomName', roomCreateData[i].roomName)
      //     if (!roomCreateData[i].roomImg){
      //       formData.append('roomImg', fileInput[i].files[0])
      //     }
      //     formData.append('roomPrice', roomCreateData[i].roomPrice)
      //     formData.append('workStart', roomCreateData[i].workStart)
      //     formData.append('workEnd', roomCreateData[i].workEnd)
      //     formData.append('roomDetail', roomCreateData[i].roomDetail)
      //     console.log(roomCreateData[i].roomType)
      //     const responce = await roomCreate(formData)
      //     console.log(responce)
      //     // alert('방이 생성되었습니다.')
      //     // this.$router.push('/host')
      //   } catch (error){
      //     console.log(error)
      //   }
      // }
      for (let i = 0; i < roomCreateData.length; i++){
        try {
          const createData = {
            'spaceId': roomCreateData[i].spaceId,
            'roomType': roomCreateData[i].roomType,
            'roomName': roomCreateData[i].roomName,
            'roomImg': roomCreateData[i].roomImg,
            'roomPrice': roomCreateData[i].roomPrice,
            'workStart': roomCreateData[i].workStart,
            'workEnd': roomCreateData[i].workEnd,
            'roomDetail': roomCreateData[i].roomDetail,
          }
          const responce = await roomCreate(createData, 52)
          console.log(responce)
          alert('방이 생성되었습니다.')
        } catch (error){
          console.log(error)
        }
      }
      this.$router.push('/host')
      // for await (const item of roomCreateData){
      //   let formData = new FormData()
      //   formData.append('roomType', item.roomType)
      //   formData.append('roomName', item.roomName)
      //   formData.append('roomImg', fileInput[item.roomImg].files[0])
      //   formData.append('roomPrice', item.roomPrice)
      //   formData.append('workStart', item.workStart)
      //   formData.append('workEnd', item.workEnd)
      //   formData.append('roomDetail', item.roomDetail)
      //   console.log(item.roomType)
      // }
      // if (!this.spaceImg){
      //   formData.append('spaceImg', this.spaceImg)
      // }
      // // const response = await spaceCreate(formData)
      // // console.log(response)
      // // 데이터 확인
      // const createData = {
      //   'spaceType': this.spaceType,
      //   'spaceName': this.spaceName,
      //   'spaceDetail': this.spaceDetail,
      //   'postcode': this.postcode,
      //   'address': this.address,
      //   'detailAddress': this.detailAddress,
      //   'regCode': this.regCode,
      //   'spaceImg': this.spaceImg,
      // }
      // console.log(createData)
      // alert('공간이 생성되었습니다. 방을 생성해 주세요.')
      // this.$router.push('/host/roomCreate')
    },
  },
}
</script>

<style scoped>
.roomContainer{
  position: relative;
  overflow: auto;
  height: 90vh;
}
.roomContainer::-webkit-scrollbar{
  display: none;
}
.addCreateBtn, .addSubmitBtn{
  margin: 2ch 17vw;
  height: 3vh;
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
  font-size: 0.8rem;
}
.roomDelte {
  position: absolute;
  top: 1vh;
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
</style>