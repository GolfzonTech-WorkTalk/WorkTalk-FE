import { instance, posts } from "./index"

// 전체공간조회
function spaceSearch(pageNum,searchSpaceType,searchSpaceName,searchAddress,searchStartDate,searchEndDate,searchStartTime,searchEndTime){
  return instance.get('main',{
    params:{
      pageNum,
      searchSpaceType,
      searchSpaceName,
      searchAddress,
      searchStartDate,
      searchEndDate,
      searchStartTime,
      searchEndTime,
    },
  })
}

// 공간조회
function spaceOne(spaceId){
    return instance.get('spaceOne/'+spaceId)
}

// 룸조회
function roomOne(spaceId){
    return instance.get('spaceOne/'+spaceId+'/rooms')
}

// 마일리지조회
function mileage(){
  return posts.get('mileage/total')
}

// 마일리지 내역
function mileageList(){
  return posts.get('mileage')
}

export {
  spaceSearch,
  spaceOne,
  roomOne,
  mileage,
  mileageList,
}