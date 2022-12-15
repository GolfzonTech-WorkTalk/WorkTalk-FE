<template>
  <div class="spaceManagementBox">
    <div v-if="spaceStatusUpdate" class="Background" />
    <div class="spaceListSortBox">
      <select v-model="spaceType" class="sortBox" @change="spaceListCall(pageNowNum)">
        <option value="공간타입" hidden>
          공간타입
        </option>
        <option v-for="item in spaceTypeData" :key="item" :value="item.value">
          {{ item.name }}
        </option>
      </select>
      <select v-model="spaceListSort" class="sortBox" @change="spaceListCall(pageNowNum)">
        <option value="공간상태" hidden>
          공간상태
        </option>
        <option v-for="item in spaceListSortData" :key="item" :value="item.value">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div class="spaceListItems">
      <div class="spaceListTitle">
        <span class="spaceHostTitle listTitle">공급자</span>
        <span class="spaceTypeTitle listTitle">종 류</span>
        <span class="spaceNameTitle listTitle">공 간 명</span>
        <span class="spaceRegCodeTitle listTitle">사업자번호</span>
        <span class="spaceStatusTitle listTitle">공간상태</span>
      </div>
      <div v-for="item in spaceList" :key="item" class="spaceListItem">
        <span class="spaceHost">{{ item.hostName }}</span>
        <span class="spaceType" :class="spaceTypeCheckClass(item.spaceType)">{{ spaceTypeCheck(item.spaceType) }}</span>
        <span class="spaceName">{{ item.spaceName }}</span>
        <span class="spaceRegCode">{{ item.regCode }}</span>
        <span class="spaceStatus" :class="item.spaceStatus" @click="spaceStatus(item)">{{ spaceStatusCheck(item.spaceStatus) }}</span>
      </div>
    </div>
    <space-status-update v-if="spaceStatusUpdate" :space-status-update="spaceStatusUpdate" @update-cancel="updateCancel" @update-status="spaceListCall" />
    <div class="pageNumber">
      <span><i class="fa-solid fa-chevron-left monthMoveBtn" @click="pageMove('pre')" /></span>
      <span v-for="num in pageData" :key="num" :class="num.class" @click="reservationDataCall(num.value)">{{ num.value }}</span>
      <span><i class="fa-solid fa-chevron-right" @click="pageMove('next')" /></span>
    </div>
  </div>
</template>

<script>
// import { spaceDumy } from '@/utils/dummy/dummy'
import { spaceAll } from '@/api/master.js'
import SpaceStatusUpdate from '@/components/master/SpaceStatusUpdate.vue'
export default {
  components: {
    SpaceStatusUpdate,
  },
  data(){
    return {
      spaceList:[],
      spaceListSortData:[
        {'name':'전체','value':'공간상태'},
        {'name':'방등록중','value':'no_setting'},
        {'name':'운용중','value':'approved'},
        {'name':'검수대기','value':'waiting'},
        {'name':'운용정지','value':'rejected'},
      ],
      spaceTypeData:[
        {'name':'전체','value':'공간타입'},
        {'name':'오피스','value':'1'},
        {'name':'데스크','value':'2'},
        {'name':'회의실','value':'3'},
      ],
      spaceListSort:'공간상태',
      spaceType:'공간타입',
      spaceStatusUpdate:'',
      // 페이지 관리데이터
      pageStartNum: 1,
      pageNowNum:1,
      pageData:[],
      pageTotal:'',
    }
  },
  created(){
    this.spaceListCall(this.pageNowNum)
  },
  methods:{
    async spaceListCall(pageNowNum){
      this.spaceList = []
      let spaceListSort = this.spaceListSort
      let spaceType = this.spaceType
      if (this.spaceListSort == '공간상태'){
        spaceListSort = ''
      }
      if (this.spaceType == '공간타입'){
        spaceType = ''
      }
      try {
        console.log(pageNowNum-1, spaceListSort, spaceType)
        const response = await spaceAll(pageNowNum-1, spaceListSort, spaceType)
        console.log(response)
        this.spaceList = response.data.data
        this.pageTotal =  response.data.count
        this.$store.dispatch('SPINNERVIEW', false)
        this.paging(this.pageNowNum)
      } catch (error){
        console.log(error)
      }
    },
    spaceTypeCheck(value){
      if (value == '1'){
        value = '오피스'
      } else if (value == '2'){
        value = '데스크'
      } else if (value == '3'){
        value = '회의실'
      }
      return value
    },
    spaceTypeCheckClass(value){
      if (value == '1'){
        value = 'OFFICE'
      } else if (value == '2'){
        value = 'DESK'
      } else if (value == '3'){
        value = 'MEETING'
      }
      return value
    },
    spaceStatusCheck(value){
      if (value == 'no_setting'){
        value = '방등록중'
      } else if (value == 'approved'){
        value = '운용중'
      } else if (value == 'waiting'){
        value = '검수대기'
      } else if (value == 'rejected'){
        value = '운용정지'
      }
      return value
    },
    spaceStatus(item){
      this.spaceStatusUpdate = item
    },
    updateCancel(){
      this.spaceStatusUpdate = ''
    },
    // 페이징
    paging(pageNowNum){
      this.pageData = []
      this.pageNowNum = pageNowNum
      let total = this.pageTotal
      if (total%10 != 0){
        this.pageTotal = parseInt(total/10)+1
      } else { 
        this.pageTotal = total/10
      }
      let lastPage
      if (this.pageTotal < 6){
        lastPage = this.pageTotal+1
      } else { 
        lastPage = this.pageStartNum+5
        if (lastPage >= this.pageTotal ){
          lastPage = this.pageTotal+1
        }
      }
      for (let i = this.pageStartNum; i < lastPage; i++){
        if (pageNowNum == i){
          this.pageData.push({'value':i,'class':'pageNowNum'})
        } else {
          this.pageData.push({'value':i,'class':''})
        }
      }
    },
    // 페이지 번호 넘기기
    pageMove(value){
      if (value == 'next'){
        if (this.pageStartNum == this.pageTotal-1){
          this.paging(this.pageStartNum)
        } else {
          this.pageStartNum = this.pageStartNum + 5
          this.paging(this.pageStartNum)
        }
      } else {
        if (this.pageStartNum == 1){
          this.paging(this.pageStartNum)
        } else {
          this.pageStartNum = this.pageStartNum - 5
          this.paging(this.pageStartNum)
        }
      }
      this.reservationDataCall(this.pageNowNum)
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
.spaceManagementBox{
  position: relative;
  width: 50vw;
  height: 91.5vh;
  padding: 2vh 2vw;
  background: white;
}
/* 정렬 */
.spaceListSortBox{
  text-align: right;
}
.sortBox{
  width: 8vw;
  letter-spacing: 0.3rem;
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 2vh;
  margin-left: 2vw;
}
.spaceListTitle, .spaceListItem{
  border-bottom: 1px solid gray;
  display: flex;
  justify-content: space-around;
  text-align: center;
  padding: 1vh 0;
}
.spaceListItem{
  font-size: 0.8rem;
}
.listTitle{
  font-weight: bold;
}
.spaceHost,.spaceHostTitle{
  width: 10vw;
}
.spaceType,.spaceTypeTitle{
  width: 5vw;
}
.spaceName,.spaceNameTitle{
  width: 15vw;
}
.spaceRegCode,.spaceRegCodeTitle{
  width: 15vw;
}
.spaceStatus,.spaceStatusTitle{
  width: 5vw;
}
/* 라벨 */
.spaceType{
  border-radius: 10px;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
}
.DESK{
  background: rgba(139, 98, 9, 0.527);
}
.OFFICE{
  background: rgba(4, 90, 4, 0.527);
}
.MEETING{
  background: rgba(9, 44, 139, 0.527);
}
/* 공간상태 */
.NoSetting{
  border: 2px solid gray;
  color: gray;
  pointer-events: none;
}
.approved{
  border: 2px solid rgb(22, 46, 153);
  color: rgb(22, 46, 153);
  cursor: pointer;
}
.waiting{
  border: 2px solid rgb(108, 214, 214);
  color: rgb(108, 214, 214);
  cursor: pointer;
}
.rejected{
  border: 2px solid red;
  color: red;
  cursor: pointer;
}
/* 넘버링 */
.pageNumber{
  text-align: center;
  font-size: 1rem;
}
.pageNumber span{
  margin: 1vw;
  cursor: pointer;
}
.pageNowNum{
  font-weight: bold;
  color: blue;
}
</style>