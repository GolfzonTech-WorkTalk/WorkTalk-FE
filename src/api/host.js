import store from "@/store"
import { instance } from "./index"

// 이메일체크
function spaceAll(){
  return instance.get('host/spaceAll/'+store.state.nickName)
}

function spaceCreate(formData){
  return instance.post('host/spaceCreate', formData)
  // {headers: {'Content-Type':'application/json'},}
}

function roomCreate(formData, spaceId){
  return instance.post('host/'+spaceId+'/roomCreate', formData, {
    headers: {
      'Authorization': store.state.token,
      // 'Content-Type':'application/json',
    },
  })
}

export {
  spaceAll,
  spaceCreate,
  roomCreate,
}