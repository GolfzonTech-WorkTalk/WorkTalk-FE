import { instance } from "./index"

// 이메일체크
function spaceAll(nickName){
  return instance.post('spaceAll', nickName)
}

export {
  spaceAll,
}