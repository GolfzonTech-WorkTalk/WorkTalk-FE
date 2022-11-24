import { instance } from "./index"

// 이메일체크
function spaceAll(formData){
  return instance.post('spaceAll', formData)
}

function spaceCreate(formData){
  return instance.post('spaceCreate', formData, {
    headers: {
      'Content-Type':'multipart/from-data',
    },
  })
}

function roomCreate(formData){
  return instance.post('roomCreate', formData, {
    headers: {
      'Content-Type':'multipart/from-data',
    },
  })
}

export {
  spaceAll,
  spaceCreate,
  roomCreate,
}