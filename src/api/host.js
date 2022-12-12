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

function roomCreate(formData, spaceId){
  return posts.post('host/'+spaceId+'/roomCreate', formData)
}

export {
  spaceAll,
  spaceCreate,
  roomCreate,
}