import { instance } from "./index"

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

export {
    spaceAll,
    spaceOne,
    roomOne,
}