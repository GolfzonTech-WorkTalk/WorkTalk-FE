<template>
  <div class="userManagementBox">
    <div v-if="userStatusUpdate != '패널티해제박스'" class="Background" />
    <div class="userListSortBox">
      <select v-model="userListSort" @change="userListCall(userListSort)">
        <option value="" hidden>
          전체인원
        </option>
        <option v-for="item in userListSortData" :key="item" :value="item.value">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div class="userListItems">
      <div class="userListTitle">
        <span class="userNameTitle listTitle">회원명</span>
        <span class="userEmailTitle listTitle">이메일</span>
        <span class="userTelTitle listTitle">전화번호</span>
        <span class="userStatusTitle listTitle">상태</span>
        <span class="userManageTitle listTitle">관리</span>
      </div>
      <div v-for="item in userList" :key="item" class="userListItem">
        <span class="userName">{{ item.name }}</span>
        <span class="userEmail">{{ item.email }}</span>
        <span class="userTel">{{ item.tel }}</span>
        <span class="userStatus" :class="(item.activated == 0)?'Panalty':'NoPanalty'" @click="penaltyViewIn(item.penaltyId)">{{ penaltyCheck(item) }}</span>
        <div v-if="(penaltyView == item.penaltyId)" class="penaltyBox">
          <i class="fa-solid fa-xmark fa-lg penaltyBoxClose" @click="penaltyViewOut()" />
          <div>
            <span class="penaltyType">{{ item.penaltyType }}</span>
            <span class="penaltyDate">{{ dateCheck(item.penaltyDate) }}</span>
          </div>
          <p>{{ item.penaltyReason }}</p>
        </div>
        <span class="userManage" :class="(item.activated == 0)?'PanaltyClear':''" @click="penaltyCleanOpen(item.penaltyId)">{{ penaltyControl(item) }}</span>
        <div v-if="(userStatusUpdate == item.penaltyId)" class="penaltyClearBox">
          <p>'{{ item.name }}' 유저의</p>
          <p>
            <strong class="warning">
              패널티
            </strong>를 해제하시겠습니까?
          </p>
          <div class="btnBox">
            <span class="penaltyBtn penaltyClearBtn" @click="penaltyClean(item)">해 제</span>
            <span class="penaltyBtn" @click="penaltyCleanClose">닫 기</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { userDummy } from '@/utils/dummy/memberDummy.js'
import { penaltyUser, penaltyRemove } from '@/api/master.js'
export default {
  components: {
  },
  data(){
    return {
      userList:[],
      userListSortData:[
        {'name':'전체인원','value':''},
        {'name':'패널티유','value':'0'},
        {'name':'패널티무','value':'1'},
      ],
      userListSort:'',
      userStatusUpdate:'패널티해제박스',
      penaltyView:'패널티박스',
    }
  },
  created(){
    this.userListCall(this.userListSort)
  },
  methods:{
    async userListCall(userListSort){
      // const response = await userDummy.data
      try {
        const response = await penaltyUser(userListSort)
        console.log(response.data.data)
        this.userList = response.data.data
      } catch (error){
        console.log(error)
      }
      this.$store.dispatch('SPINNERVIEW', false)
    },
    penaltyCheck(item){
      if (item.activated == 0){
        return '이용정지'
      } else {
        return '이용중'
      }
    },
    penaltyControl(item){
      if (item.activated == 0){
        return '패널티해제'
      } else {
        return
      }
    },
    penaltyViewIn(penaltyId){
      console.log(penaltyId)
      if (penaltyId != ''){
        this.penaltyView = penaltyId
      }
    },
    penaltyViewOut(){
      this.penaltyView = '패널티박스'
    },
    dateCheck(date){
      return date.slice(0,10)+' '+date.slice(14,19)
    },
    penaltyCleanOpen(penaltyId){
      this.penaltyView = '패널티박스'
      this.userStatusUpdate = penaltyId
    },
    penaltyCleanClose(){
      this.userStatusUpdate = '패널티해제박스'
    },
    async penaltyClean(item){
      console.log(item)
      try {
        const response = await penaltyRemove(item.penaltyId)
        console.log(response)
        if (response.status == 200){
          alert('패널티가 해제되었습니다.')
          this.userListCall()
          this.penaltyCleanClose()
        }
      } catch (error){
        console.log(error)
      }
    },
  },
}
</script>

<style scoped>
.Background{
  position: absolute;
  top: 0;
  left: 0;
  width: 54vw;
  height: 95.5vh;
  background: rgba(0, 0, 0, 0.212);
  z-index: 1;
}
.userManagementBox{
  position: relative;
  width: 50vw;
  height: 91.5vh;
  padding: 2vh 2vw;
  background: white;
}
/* 정렬 */
.userListSortBox{
  text-align: right;
}
.userListSortBox select{
  font-size: 1rem;
  width: 9vw;
  margin: 2vh 0;
}
.userListTitle, .userListItem{
  position: relative;
  border-bottom: 1px solid gray;
  display: flex;
  justify-content: user-around;
  text-align: center;
  padding: 1vh 0;
}
.userListItem{
  font-size: 0.8rem;
}
.listTitle{
  font-weight: bold;
}
.userName,.userNameTitle{
  width: 10vw;
}
.userEmail,.userEmailTitle{
  width: 14vw;
}
.userTel,.userTelTitle{
  width: 12vw;
}
.userStatus,.userStatusTitle{
  width: 10vw;
}
.userManage,.userManageTitle{
  width: 8vw;
}
/* 패널티 */
.Panalty{
  color: red;
  cursor: pointer;
}
.penaltyBox{
  position: absolute;
  text-align: left;
  background: white;
  right: 11vw;
  width: 15vw;
  padding: 1vh 1vw;
  border: 1px solid gray;
  z-index: 1;
}
.penaltyBox div{
  display: flex;
  justify-content: space-between;
  margin-top: 1vh;
  margin-bottom: 1vh;
  padding-bottom: 1vh;
  border-bottom: 1px solid gray;
}
.penaltyType{
  font-size: 1rem;
  font-weight: bold;
}
.penaltyDate{
  color: gray;
  font-weight: bold;
  font-size: 0.8rem;
}
.penaltyBoxClose{
  position: absolute;
  top: 1vh;
  right: 0.5vw;
  cursor: pointer;
}
/* 패널티해제 */
.PanaltyClear{
  border: 1px solid blue;
  color: blue;
  font-weight: bold;
  cursor: pointer;
}
.penaltyClearBox{
  position: absolute;
  top: 0;
  right: 15vw;
  background: white;
  z-index: 1;
  width: 20vw;
  height: 10vh;
  padding: 2vh 0;
  border-radius: 10px;
}
.penaltyClearBox p{
  font-size: 1rem;
  font-weight: bold;
}
.warning{
  color: red;
}
.btnBox{
  margin-top: 1vh;
}
.penaltyBtn{
  border: 1px solid gray;
  border-radius: 10px;
  padding: 0 0.5vw;
  margin: 0 0.5vw;
  cursor: pointer;
}
.penaltyClearBtn:hover{
  color: white;
  background: rgb(112, 112, 207);
}
</style>