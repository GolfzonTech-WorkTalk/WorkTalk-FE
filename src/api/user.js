import { instance, posts } from "./index"

// 전체공간조회
function spaceAll(){
    return instance.get('user/spaceAll')
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
    spaceAll,
    spaceOne,
    roomOne,
    mileage,
    mileageList,
}