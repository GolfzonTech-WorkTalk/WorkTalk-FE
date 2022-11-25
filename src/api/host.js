import { instance } from "./index"

// 이메일체크
function spaceAll(formData){
  return instance.post('spaceAll', formData)
}

function spaceCreate(formData){
  return instance.post('spaceCreate', formData)
}

function roomCreate(formData){
  return instance.post('roomCreate', formData)
}

export {
  spaceAll,
  spaceCreate,
  roomCreate,
}