import { posts } from "./index"

function spaceAll(){
  return posts.get('host/spaceAll')
}

function activatedCheck(){
  return posts.get('hostActivated')
}

function spaceCreate(SpaceInsertDto){
  return posts.post('host/spaceCreate', SpaceInsertDto, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

function spaceUpdate(spaceId, SpaceUpdateDto){
  return posts.post('host/spaceUpdate/'+spaceId, SpaceUpdateDto, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

function spaceImgDelete(spaceImgId){
  return posts.delete('spaceImgDelete',{
    params:{
      spaceImgId,
    },
  })
}

function roomCreate(formData){
  return posts.post('host/roomCreate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

function roomUpdate(roomId, RoomUpdateDto){
  return posts.post('host/roomUpdate/'+roomId, RoomUpdateDto, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

function roomImgDelete(roomImgId){
  return posts.delete('roomImgDelete', {
    params:{
      roomImgId,
    },
  })
}

function spaceDelte(spaceId){
  return posts.delete('host/spaceDelete/'+spaceId)
}

export {
  spaceAll,
  activatedCheck,
  spaceCreate,
  spaceUpdate,
  spaceImgDelete,
  roomCreate,
  roomUpdate,
  roomImgDelete,
  spaceDelte,
}