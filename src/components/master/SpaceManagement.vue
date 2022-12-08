<template>
  <div class="spaceManagementBox">
    <div v-if="spaceStatusUpdate" class="Background" />
    <div class="spaceListSortBox">
      <select v-model="spaceListSort">
        <option value="" hidden>
          공간상태
        </option>
        <option v-for="item in spaceListSortData" :key="item" :value="item.valeu">
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
        <span class="spaceHost">{{ item.host }}</span>
        <span class="spaceType" :class="spaceTypeCheckClass(item.spaceType)">{{ spaceTypeCheck(item.spaceType) }}</span>
        <span class="spaceName">{{ item.spaceName }}</span>
        <span class="spaceRegCode">{{ item.regCode }}</span>
        <span class="spaceStatus" :class="item.spaceStatus" @click="spaceStatus(item)">{{ spaceStatusCheck(item.spaceStatus) }}</span>
      </div>
    </div>
    <space-status-update v-if="spaceStatusUpdate" :space-status-update="spaceStatusUpdate" @update-cancel="updateCancel" />
  </div>
</template>

<script>
import { spaceDumy } from '@/utils/dummy/dummy'
import SpaceStatusUpdate from '@/components/master/SpaceStatusUpdate.vue'
export default {
  components: {
    SpaceStatusUpdate,
  },
  data(){
    return {
      spaceList:[],
      spaceListSortData:[
        {'name':'전체','value':''},
        {'name':'방등록중','value':'NoSetting'},
        {'name':'운용중','value':'approved'},
        {'name':'검수대기','value':'waiting'},
        {'name':'운용정지','value':'suspension'},
      ],
      spaceListSort:'',
      spaceStatusUpdate:'',
    }
  },
  created(){
    this.spaceListCall()
  },
  methods:{
    async spaceListCall(){
      const response = await spaceDumy
      this.spaceList = response
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
      if (value == 'NoSetting'){
        value = '방등록중'
      } else if (value == 'approved'){
        value = '운용중'
      } else if (value == 'waiting'){
        value = '검수대기'
      } else if (value == 'suspension'){
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
.spaceListSortBox select{
  font-size: 1rem;
  width: 7vw;
  margin: 2vh 0;
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
.suspension{
  border: 2px solid red;
  color: red;
  cursor: pointer;
}
</style>