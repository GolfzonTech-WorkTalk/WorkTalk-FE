<template>
  <div class="createBox">
    <form class="createFrom" enctype="multipart/form-data" @submit.prevent="spaceUpdateCheck">
      <div class="spaceType">
        <span>공간정보수정</span>
        <div class="spaceTypeItems">
          <div v-for="(item, index) in spaceTypeItems" :key="index" class="spaceTypeItem" :class="(spaceTypeSelectData == item.value)?'selectType':'noSelectType'">
            <img class="spaceTypeIcon" :src="require(`@/assets/${item.img}`)" alt="icon">
            <p>{{ item.name }}</p>
          </div>
        </div>
      </div>
      <div class="boxName">
        <p>공간명 : {{ spaceItems.spaceName }}</p>
        <p>공간주소 : ({{ spaceItems.postcode }}){{ spaceItems.address }} {{ spaceItems.detailAddress }}</p>
        <p>사업자번호 : {{ spaceItems.regCode }}</p>
      </div>
      <div class="spaceDetail boxName">
        <span>공간소개</span>
        <span class="textCount" :class="{warning:spaceDetailCount >= 100}">{{ spaceDetailCount }}/100자</span>
        <textarea v-model="spaceItems.spaceDetail" class="inputBox spaceDetailBox" name="" rows="5" :placeholder="spaceItems.spaceDetail" @keyup="spaceDetailCountCheck" />
        <p v-if="spaceDetailCount >= 100" class="warning warningMsg">
          설명은 100자까지 가능합니다.
        </p>
      </div>
      <span class="boxName">업로드된 사진</span>
      <div class="imgBox">
        <div v-for="file in spaceItems.spaceImgList" :key="file" class="filePreview">
          <i class="fa-solid fa-trash-can fa-lg imgDelete" @click="spaceImgDelete(file)" />
          <img class="preViewImg" :src="file.spaceImgUrl">
        </div>
      </div>
      <span class="boxName">추가 업로드</span>
      <div class="imgBox">
        <div v-for="file in spaceImgPreview" :key="file" class="filePreview">
          <i class="fa-solid fa-xmark imgDelete fa-lg" @click="fileDeleteButton(file.num)" />
          <img class="preViewImg" :src="file.url">
        </div>
        <div class="addImgBox">
          <label for="imgBtn" class="addImgBtn">사진추가</label>
          <input id="imgBtn" ref="spaceImg" type="file" multiple accept=".jpg, .png" hidden @change="fileUpload($event)">
        </div>
      </div>
      <button class="submit">
        수 정
      </button>
    </form>
  </div>
</template>

<script>
import { spaceOne } from '@/api/user.js'
import { spaceCreate } from '@/api/host'
export default {
  data(){
    return {
      spaceItems:[],
      spaceImg:[],
      spaceImgPreview:[],
      spaceDetailCount: '0',
      spaceTypeItems: [
        {'name':'오피스', 'img':'office.png', 'value':'1'},
        {'name':'데스크', 'img':'table.png', 'value':'2'},
        {'name':'회의실', 'img':'meeting.png', 'value':'3'},
      ],
      // 공간 타입 선택
      spaceTypeSelectData: this.$route.params.spaceType,
    }
  },
  async created(){
    await this.spaceDataCall()
  },
  methods: {
    async spaceDataCall(){
      const response = await spaceOne(this.$route.params.spaceId)
      console.log(response.data[0])
      this.spaceItems = response.data[0]
    },
    // 사진등록삭제
    fileUpload(event){
      for (let i = 0; i < event.target.files.length; i++){
        this.spaceImg = [
          ...this.spaceImg,
          {'file':event.target.files[i],'num':i},
        ]  
      }
      for (let i = 0; i < event.target.files.length; i++){
        this.spaceImgPreview.push({
          'url':URL.createObjectURL(event.target.files[i]),
          'num':i,
        })
      }
    },
    fileDeleteButton(index){
      for (let i = 0; i < this.spaceImg.length; i++){
        if (this.spaceImg[i].num == index){
          this.spaceImg.splice(i, 1)
        }
      }
      for (let i = 0; i < this.spaceImgPreview.length; i++){
        if (this.spaceImgPreview[i].num == index){
          this.spaceImgPreview.splice(i, 1)
        }
      }
    },
    spaceDetailCountCheck(){
      return this.spaceDetailCount = this.spaceItems.spaceDetail.length
    },
    // 검증
    spaceUpdateCheck(){
      let message = ''
      if (!this.spaceDetail){
        message = '공간설명을 작성해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (this.spaceDetail.length > 100){
        message = '공간명이 100자를 초과하였습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        this.spaceUpdate()
      }
    },
    //공간생성
    // async 
    async spaceUpdate(){
      try {
        let formData = new FormData()
        formData.append('name', this.$store.state.nickName)
        formData.append('spaceType', this.spaceType)
        formData.append('spaceName', this.spaceName)
        formData.append('spaceDetail', this.spaceDetail)
        formData.append('postcode', this.postcode)
        formData.append('address', this.address)
        formData.append('detailAddress', this.detailAddress)
        formData.append('regCode', this.regCode)
        if (this.spaceImg != []){
          for (let i = 0; i < this.spaceImg.length; i++){
            formData.append('multipartFileList', this.spaceImg[i].file)
            console.log(this.spaceImg[i].file)
          }
        }
        // for (let key of formData.keys()){
        //   console.log(`${key}:${formData.get(key)}`)
        // }
        const createDataResponse = await spaceCreate(formData)
        console.log(createDataResponse)
        if (createDataResponse.status == 200){
          alert('공간이 생성되었습니다. 방을 생성해 주세요.')
          this.$router.push('/host')
        }
      } catch (error){
        console.log(error)
      }
    },
  },
}
</script>

<style scoped>
.createBox {
  background: white;
  margin: auto;
  width: 55vw;
  height: 102.5vh;
  padding: 2.5vw;
  font-weight: bold;
  overflow: scroll;
}
.createBox::-webkit-scrollbar{
  display: none;
}
/* 박스 기본틀 */
.inputBox {
  border: 1px solid gray;
  border-radius: 5px;
  margin: 1vh 0 2vh 2vw;
  width: 50vw;
  height: 1vh;
  padding: 1vw;
}
/* 타입 박스 */
.spaceType {
  letter-spacing: 1rem;
  font-size: 1.5rem;
  text-align: center;
}
.spaceTypeItems{
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
}
.spaceTypeItem{
  border: 1px solid gray;
  border-radius: 10px;
  padding: 2vw 3vw;
  margin: 1vw;
}
.spaceTypeIcon{
  width: 5vw;
}
.selectType{
  background: rgba(0, 0, 255, 0.144);
  color: white;
}
/* 공간명 */
.boxName {
  font-size: 1.1rem;
  line-height: 5vh;
}
/* 공간소개 */
.spaceDetailBox {
  height: 8vh;
  resize: none;
}
/* 글자수 카운트 */
.textCount {
  font-size: 0.9rem;
  color: gray;
  float: right;
  margin-right: 1vw;
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
.spaceDetail{
  position: relative;
}
/* 제출 */
.submit {
  margin: 2vh 0 0 10vw;
  border-radius: 10px;
  background: rgb(103, 139, 218);
  color: white;
  font-size: 1.2rem;
  letter-spacing: 1.1rem;
  width: 35vw;
  cursor: pointer;
}
.warning {
  color: red;
}
.warningMsg{
  position: absolute;
  right: 0;
  bottom: -1vh;
  font-size: 1rem;
}
</style>