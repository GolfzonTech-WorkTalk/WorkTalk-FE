<template>
  <div class="createBox">
    <form class="createFrom" @submit.prevent="spaceCreate">
      <div class="spaceType">
        <span>공간생성</span>
        <div class="spaceTypeItems">
          <div v-for="(item, index) in spaceTypeItems" :key="index" class="spaceTypeItem" :class="(spaceTypeSelectData == item.name)?'selectType':'noSelectType'" @click="spaceTypeSelect(item)">
            <img class="spaceTypeIcon" :src="require(`@/assets/${item.img}`)" alt="icon">
            <p>{{ item.name }}</p>
          </div>
        </div>
      </div>
      <div class="spaceName boxName">
        공간명
        <span class="textCount" :class="{warning:spaceName.length >= 20}">{{ spaceNameCount }}/20자</span><br>
        <input v-model="spaceName" class="inputBox" type="text" placeholder="공간의 이름을 작성해주세요." @keyup="spaceNameCountCheck">
        <p v-if="spaceName.length >= 20" class="warning">
          제목은 20자까지 가능합니다.
        </p>
      </div>
      <div class="spaceDetail boxName">
        <span>공간소개</span>
        <span class="textCount" :class="{warning:spaceDetail.length >= 100}">{{ spaceDetailCount }}/100자</span><br>
        <textarea v-model="spaceDetail" class="inputBox spaceDetailBox" name="" rows="5" placeholder="공간을 소개해 주세요." @keypress="spaceDetailCountCheck" />
        <p v-if="spaceDetail.length >= 100" class="warning">
          설명은 100자까지 가능합니다.
        </p>
      </div>
      <div class="spaceAddress boxName">
        <span>공간주소</span><br>
        <input v-model="postcode" class="inputBox postCodeBox" type="text" placeholder="우편번호">
        <input class="postCodeBtn" type="button" value="우편번호 찾기" @click="execDaumPostcode"><br>
        <input v-model="address" class="inputBox addressBox" type="text" name="address" placeholder="주소">
        <input v-model="detailAddress" class="inputBox detailAddressBox" type="text" placeholder="상세주소">
      </div>
      <div class="regCode boxName">
        <span>사업자번호</span><br>
        <input v-model="regCode" class="inputBox" maxlength="12" type="text" placeholder="사업자번호" @keypress="regCodeKeypress">
      </div>
      <div class="spaceImg boxName">
        <span>공간대표사진</span>
        <label for="imgBtn" class="imgBtn">사진등록</label>
        <input id="imgBtn" ref="spaceImg" type="file" multiple accept="image/*" hidden @change="fileUpload">
      </div>
      <button class="submit">
        공간생성
      </button>
    </form>
  </div>
</template>

<script>
import { regCodeCheck } from '@/utils/regCodeCheck'
import { spaceCreate } from '@/api/host'
export default {
  data(){
    return {
      spaceType:'',
      spaceName:'',
      spaceDetail:'',
      postcode:'',
      address:'',
      detailAddress:'',
      regCode:'',
      spaceImg:null,
      // 텍스트 관리
      spaceNameCount: '0',
      spaceDetailCount: '0',
      // 공간 타입
      spaceTypeItems: [
        {'name':'오피스', 'img':'office.png', 'value':'1'},
        {'name':'데스크', 'img':'table.png', 'value':'2'},
        {'name':'회의실', 'img':'meeting.png', 'value':'3'},
      ],
      // 공간 타입 선택
      spaceTypeSelectData: '',
    }
  },
  computed: {
  },
  methods: {
    fileUpload(e){
      // console.log(e.target.files)
      // console.log(this.$refs.spaceImg.files)
      this.spaceImg = e.target.files
    },
    //타입 선택
    spaceTypeSelect(item){
      // console.log(item.value)
      const itemValue = item.value
      this.spaceType = item.value
      if (itemValue == '1'){
        this.spaceTypeSelectData = '오피스'  
      } else if (itemValue == '2'){
        this.spaceTypeSelectData = '데스크'
      } else {
        this.spaceTypeSelectData = '회의실'
      }
    },
    // 제목, 설명 글자수 관리
    spaceNameCountCheck(){
      // console.log(this.spaceName.length)
      return this.spaceNameCount = this.spaceName.length
    },
    spaceDetailCountCheck(){
      return this.spaceDetailCount = this.spaceDetail.length
    },
    // 사업자번호 '-' 자동
    regCodeKeypress(){
      const result = regCodeCheck(this.regCode)
      this.regCode = result
    },
    // 우편번호
    execDaumPostcode(){
      new window.daum.Postcode({
        oncomplete: (data) => {
          if (this.spaceDetail !== ""){
            this.spaceDetail = ""
          }
          if (data.userSelectedType === "R"){
            // 사용자가 도로명 주소를 선택했을 경우
            this.address = data.roadAddress
          } else {
            // 사용자가 지번 주소를 선택했을 경우(J)
            this.address = data.jibunAddress
          }

          // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
          if (data.userSelectedType === "R"){
            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)){
              this.detailAddress += data.bname
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if (data.buildingName !== "" && data.apartment === "Y"){
              this.detailAddress +=
                this.detailAddress !== ""
                  ? `, ${data.buildingName}`
                  : data.buildingName
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if (this.detailAddress !== ""){
              this.detailAddress = `(${this.detailAddress})`
            }
          } else {
            this.detailAddress = ""
          }
          // 우편번호를 입력한다.
          this.postcode = data.zonecode
        },
      }).open()
    },
    // 검증

    //공간생성
    // async 
    async spaceCreate(){
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
        if (this.spaceImg != null){
          formData.append('spaceImg', this.spaceImg)
        }
        // 데이터 확인
        // const createData = {
        //   'name': this.$store.state.nickName,
        //   'spaceType': this.spaceType,
        //   'spaceName': this.spaceName,
        //   'spaceDetail': this.spaceDetail,
        //   'postcode': this.postcode,
        //   'address': this.address,
        //   'detailAddress': this.detailAddress,
        //   'regCode': this.regCode,
        //   'spaceImg': this.spaceImg,
        // }
        console.log(formData)
        // console.log(createData)
        const response = await spaceCreate(formData)
        console.log(response)
        // this.$router.push('/host')
        // alert('공간이 생성되었습니다. 방을 생성해 주세요.')
        // this.$router.push(`/host/roomCreate/${this.spaceName}/${this.spaceType}`)  
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
  cursor: pointer;
}
.spaceTypeIcon{
  width: 5vw;
}
.selectType{
  background: rgba(0, 0, 255, 0.144);
  color: white;
}
/* 공간명 */
.spaceName {
  margin-top: 1vh;
}
.boxName {
  font-size: 1.1rem;
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
/* 주소 */
.postCodeBox, .addressBox {
  margin: 1vh 0 0.5vh 2vw;
}
.postCodeBox {
  width: 20vw;
  margin-right: 2vw;
}
.postCodeBtn {
  border: 1px solid gray;
  border-radius: 5px;
  background: white;
  height: 3vh;
  width: 10vw;
  cursor: pointer;
}
.addressBox, .detailAddressBox {
  width: 20vw;
}
/* 사진 선택 */
.spaceImg {
  margin-bottom: 1vh;
}
.imgBtn {
  margin: 1vh 0 2vh 2vw;
  font-size: 1rem;
  font-weight: none;
  border: 1px solid gray;
  border-radius: 5px;
  background: white;
  width: 10vw;
  cursor: pointer;
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
</style>