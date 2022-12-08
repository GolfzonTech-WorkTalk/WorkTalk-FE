<template>
  <div class="hostManagementBox">
    <div v-if="hostStatusUpdate != '사용승인박스'" class="Background" />
    <div class="hostListSortBox">
      <select v-model="hostListSort">
        <option value="" hidden>
          전체인원
        </option>
        <option v-for="item in hostListSortData" :key="item" :value="item.valeu">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div class="hostListItems">
      <div class="hostListTitle">
        <span class="hostNameTitle listTitle">회원명</span>
        <span class="hostEmailTitle listTitle">이메일</span>
        <span class="hostTelTitle listTitle">전화번호</span>
        <span class="hostStatusTitle listTitle">상태</span>
        <span class="hostManageTitle listTitle">관리</span>
      </div>
      <div v-for="item in hostList" :key="item" class="hostListItem">
        <span class="hostName">{{ item.name }}</span>
        <span class="hostEmail">{{ item.email }}</span>
        <span class="hostTel">{{ item.tel }}</span>
        <span class="hostStatus" :class="(item.activated != 0)?'activate':'NoActivate'">{{ panaltyCheck(item) }}</span>
        <span class="hostManage" :class="(item.activated == 0)?'PanaltyClear':''" @click="activateOpen(item.id)">{{ panaltyControl(item) }}</span>
        <div v-if="(hostStatusUpdate == item.id)" class="panaltyClearBox">
          <p>'{{ item.name }}' 호스트의</p>
          <p>
            <strong class="approve">
              사용승인
            </strong>을 하시겠습니까?
          </p>
          <div class="btnBox">
            <span class="panaltyBtn panaltyClearBtn" @click="activateApprove(item.id)">승 인</span>
            <span class="panaltyBtn" @click="activateClose">닫 기</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { hostDummy } from '@/utils/dummy/memberDummy.js'
import { deactivatedHost, memberApprove } from '@/api/master.js'
export default {
  components: {
  },
  data(){
    return {
      hostList:[],
      hostListSortData:[
        {'name':'전체인원','value':''},
        {'name':'승인인원','value':'panalty'},
        {'name':'미승인인원','value':'NoPanalty'},
      ],
      hostListSort:'',
      hostStatusUpdate:'사용승인박스',
    }
  },
  created(){
    this.hostListCall()
  },
  methods:{
    async hostListCall(){
      // const response = await hostDummy.data
      try {
        const response = await deactivatedHost()
        console.log(response.data.data)
        this.hostList = response.data.data
      } catch (error){
        console.log(error)
      }
    },
    panaltyCheck(item){
      if (item.activated == 0){
        return '승인대기'
      } else {
        return '운용중'
      }
    },
    panaltyControl(item){
      if (item.activated == 0){
        return '사용승인'
      } else {
        return
      }
    },
    activateOpen(id){
      this.hostStatusUpdate = id
    },
    activateClose(){
      this.hostStatusUpdate = '사용승인박스'
    },
    async activateApprove(id){
      try {
        const response = await memberApprove(id)
        console.log(response)
        if (response.status == 200){
          alert('사용이 승인되었습니다.')
          this.hostListCall()
          this.activateClose()
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
.hostManagementBox{
  position: relative;
  width: 50vw;
  height: 91.5vh;
  padding: 2vh 2vw;
  background: white;
}
/* 정렬 */
.hostListSortBox{
  text-align: right;
}
.hostListSortBox select{
  font-size: 1rem;
  width: 9vw;
  margin: 2vh 0;
}
.hostListTitle, .hostListItem{
  position: relative;
  border-bottom: 1px solid gray;
  display: flex;
  justify-content: host-around;
  text-align: center;
  padding: 1vh 0;
}
.hostListItem{
  font-size: 0.8rem;
}
.listTitle{
  font-weight: bold;
}
.hostName,.hostNameTitle{
  width: 10vw;
}
.hostEmail,.hostEmailTitle{
  width: 14vw;
}
.hostTel,.hostTelTitle{
  width: 12vw;
}
.hostStatus,.hostStatusTitle{
  width: 10vw;
}
.hostManage,.hostManageTitle{
  width: 8vw;
}
/* 패널티 */
.activate{
  font-weight: bold;
  color: rgb(34, 34, 138);
}
/* 패널티해제 */
.PanaltyClear{
  border: 1px solid blue;
  color: blue;
  font-weight: bold;
  cursor: pointer;
}
.panaltyClearBox{
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
.panaltyClearBox p{
  font-size: 1rem;
  font-weight: bold;
}
.approve{
  color: rgb(101, 101, 209);
}
.btnBox{
  margin-top: 1vh;
}
.panaltyBtn{
  border: 1px solid gray;
  border-radius: 10px;
  padding: 0 0.5vw;
  margin: 0 0.5vw;
  cursor: pointer;
}
.panaltyClearBtn:hover{
  color: white;
  background: rgb(112, 112, 207);
}
</style>