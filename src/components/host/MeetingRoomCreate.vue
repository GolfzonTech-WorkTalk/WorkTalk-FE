<template>
  <div class="roomContainer">
    <p>가격기준 : 4인(2만원/시간) 6인(3만원/시간) 8인~10인이하(5만원/시간) 20인(10만원/시간)</p>
    <button class="addCreateBtn" @click="addCreateFrom">
      공간추가
    </button>
    <form class="roomItems" @submit.prevent="roomCreateSubmitCheck">
      <div v-for="(item, index) in roomCreate" :key="item" class="roomItem">
        <i class="fa-solid fa-trash-can fa-lg roomDelte" @click="deleteRoomItem(index)" />
        <div>
          <p>방종류</p>
          <select v-model="item.roomType" @change="priceSetting(item)">
            <option hidden>
              방종류 선택
            </option>
            <option v-for="roomTypeItem in roomTypeData" :key="roomTypeItem" :value="roomTypeItem.value">
              {{ roomTypeItem.name }}
            </option>
          </select>
          <p class="roomTypePice">
            {{ item.roomPrice }} / 시간
          </p>
        </div>
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
          <p>편의시설</p>
          <div class="iconItems">
            <div v-for="option in offeringOptionData" :key="option" class="iconItem" :class="(offeringOptionCheck(item,option.value))?'selected':'noSelect'" @click="offeringOptionAdd(item,option.value)">
              <i :class="option.class" />
              <p>{{ option.name }}</p>
            </div>
          </div>
        </div>
        <div>
          <p>회의실 사진등록</p>
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
          roomType: '방종류 선택',
          roomName: '',
          roomPrice: '',
          workStart: '시작시간',
          workEnd:'종료시간',
          roomDetail:'',
          roomImg: [],
          roomImgPreview:[],
          offeringOption:'',
        },
      ],
      startTimeData: '',
      endTimeData: '',
      roomTypeData: [
        {'name':'회의실 4인','price':'20000', 'value':'MEETING4'},
        {'name':'회의실 6인','price':'30000', 'value':'MEETING6'},
        {'name':'회의실 8~10인','price':'50000', 'value':'MEETING8'},
        {'name':'회의실 20인','price':'100000', 'value':'MEETING20'},
      ],
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
  created(){
    // console.log(this.$route.params.spaceType)
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
  methods: {
    // 배열내용추가
    addCreateFrom(){
      console.log('클릭')
      this.roomCreate.push({
        spaceId: this.$route.params.spaceId,
        roomType: '방종류 선택',
        roomName: '',
        roomPrice: '',
        workStart: '시작시간',
        workEnd:'종료시간',
        roomDetail:'',
        roomImg: [],
        roomImgPreview:[],
        offeringOption:'',
      })
    },
    // 가격 출력 및 반영
    priceSetting(item){
      if (item.roomType == 'MEETING4'){
        item.roomPrice = 20000
      } else if (item.roomType == 'MEETING6'){
        item.roomPrice = 30000
      } else if (item.roomType == 'MEETING8'){
        item.roomPrice = 50000
      } else if (item.roomType == 'MEETING20'){
        item.roomPrice = 100000
      }
      // console.log(item.roomType, item.roomPrice)
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
    // 편의시설
    offeringOptionCheck(item,value){
      if (item.offeringOption.indexOf(value) == -1){
        return false
      } else {
        return true
      }
    },
    offeringOptionAdd(item,value){
      if (item.offeringOption.indexOf(value) == -1){
        item.offeringOption += value
      } else {
        item.offeringOption = item.offeringOption.replace(value,'')
      }
    },
    // 사진 내용추가
    fileUpload(event){
      const index = event.path[0].id.slice(3)
      for (let i = 0; i < event.target.files.length; i++){
        this.roomCreate[index].roomImg = [
          ...this.roomCreate[index].roomImg,
          {'file':event.target.files[i],'num':i},
        ]  
        this.roomCreate[index].roomImgPreview.push({
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
    // 검증
    roomCreateSubmitCheck(){
      const roomCreate = this.roomCreate
      let message = ''
      let result = 0
      for (let i = 0; i < roomCreate.length; i++){
        if (!roomCreate[i].roomType == '방종류 선택'){
          message = i+1+'번 방의 종류를 설정해주세요.'
          this.$store.dispatch('MODALVIEWCLICK', true)
          this.$store.dispatch('MODALMESSAGE', message)
        } else if (!roomCreate[i].roomName){
          message = i+1+'번 방의 이름을 작성해주세요.'
          this.$store.dispatch('MODALVIEWCLICK', true)
          this.$store.dispatch('MODALMESSAGE', message)
        } else if (!roomCreate[i].roomName.length > 20){
          message = i+1+'번 방의 이름이 20자를 초과했습니다.'
          this.$store.dispatch('MODALVIEWCLICK', true)
          this.$store.dispatch('MODALMESSAGE', message)
        } else if (!roomCreate[i].roomDetail){
          message = i+1+'번 방의 설명을 작성해주세요.'
          this.$store.dispatch('MODALVIEWCLICK', true)
          this.$store.dispatch('MODALMESSAGE', message)
        } else if (roomCreate[i].roomDetail.length > 100){
          message = i+1+'번 방의 설명이 100자를 초과했습니다.'
          this.$store.dispatch('MODALVIEWCLICK', true)
          this.$store.dispatch('MODALMESSAGE', message)
        } else if (roomCreate[i].workStart == '시작시간' || roomCreate[i].workEnd == '종료시간'){
          message = i+1+'번 방의 시간을 설정해주세요.'
          this.$store.dispatch('MODALVIEWCLICK', true)
          this.$store.dispatch('MODALMESSAGE', message)
        } else if (roomCreate[i].workStart >= roomCreate[i].workEnd){
          message = i+1+'번 방의 운영시작이 운용종료보다 큽니다.'
          this.$store.dispatch('MODALVIEWCLICK', true)
          this.$store.dispatch('MODALMESSAGE', message)
        } else if (roomCreate[i].roomImg.length == 0){
          message = i+1+'번 방의 사진을 추가해주세요.'
          this.$store.dispatch('MODALVIEWCLICK', true)
          this.$store.dispatch('MODALMESSAGE', message)
        } else {
          result ++
        }
      }
      if (result == roomCreate.length){
        this.roomCreateSubmit()
      }
    },
    // 방생성
    async roomCreateSubmit(){
      // 이미지제외한 룸정보 배열생성
      const roomCreateData = this.roomCreate
      // 전송할 데이터 생성
      try {
        for (let i = 0; i < roomCreateData.length; i++){
          let formData = new FormData()
          formData.append('spaceId', roomCreateData[i].spaceId)
          formData.append('roomType', roomCreateData[i].roomType)
          formData.append('roomName', roomCreateData[i].roomName)
          formData.append('roomPrice', roomCreateData[i].roomPrice)
          formData.append('workStart', roomCreateData[i].workStart)
          formData.append('workEnd', roomCreateData[i].workEnd)
          formData.append('roomDetail', roomCreateData[i].roomDetail)
          formData.append('offeringOption', roomCreateData[i].offeringOption)
          if (roomCreateData[i].roomImg != null){
            for (let j = 0; j < roomCreateData[i].roomImg.length; j++){
              formData.append('multipartFileList', roomCreateData[i].roomImg[j].file)
              console.log(roomCreateData[i].roomImg[j].file)
            }
          }
          // for (let key of formData.keys()){
          //   console.log(`${key}:${formData.get(key)}`)
          // }
          const responce = await roomCreate(formData)
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
  height: 90vh;
}
.roomContainer::-webkit-scrollbar{
  display: none;
}
.addCreateBtn, .addSubmitBtn{
  margin: 2ch 17vw;
  height: 5vh;
  font-size: 1.3rem;
  letter-spacing: 1rem;
  right: 0vw;
  width: 20vw;
  border: 0;
  border-radius: 5px;
  background: rgba(9, 44, 139, 0.527);
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
.roomTypePice, .roomNameCount{
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
  height: 15vh;
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
</style>