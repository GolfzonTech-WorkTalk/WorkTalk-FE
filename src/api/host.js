import { posts } from "./index"

function spaceAll(){
  return posts.get('host/spaceAll')
}

function spaceCreate(SpaceInsertDto){
  return posts.post('host/spaceCreate', SpaceInsertDto, {
    headers: {
      'Content-Type': 'multipart/form-data',
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

export {
  spaceAll,
  spaceCreate,
  roomCreate,
}