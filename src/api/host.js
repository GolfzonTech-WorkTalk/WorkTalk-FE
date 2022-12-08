import store from "@/store"
import { posts } from "./index"

function spaceAll(){
  return posts.get('host/spaceAll/'+store.state.nickName)
}

function spaceCreate(createData){
  return posts.post('host/spaceCreate', createData)
  // {headers: {'Content-Type':'application/json'},}
}

function spaceImg(formData){
  return posts.post('host/spaceImg', formData)
  // {headers: {'Content-Type':'application/json'},}
}

function roomCreate(formData, spaceId){
  return posts.post('host/'+spaceId+'/roomCreate', formData)
}

export {
  spaceAll,
  spaceCreate,
  roomCreate,
  spaceImg,
}