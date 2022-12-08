const userDummy = {
  "count": 2,
  "data": [
      {
        "id": 1,
        "email": "user@naver.com",
        "name": "사용자",
        "tel": "010-1111-1111",
        "memberType": "ROLE_USER",
        "activated": 0,
        "panalty_id":'1',
        "panalty_date":'2022-12-07T15:00:17.075502',
        "panalty_reason":'노쇼입니다.',
        "panalty_type":'Noshow',
      },
      {
        "id": 2,
        "email": "user@naver.com",
        "name": "유저",
        "tel": "010-1111-2222",
        "memberType": "ROLE_USER",
        "activated": 1,
        "panalty_id":'',
        "panalty_date":'',
        "panalty_reason":'',
        "panalty_type":'',
      },
  ],
}

const hostDummy = {
  "count": 2,
  "data": [
      {
        "id": 52,
        "email": "host@naver.com",
        "name": "호스트",
        "tel": "010-1234-2222",
        "memberType": "ROLE_HOST",
        "activated": 1,
      },
      {
        "id": 51,
        "email": "host@naver.com",
        "name": "호스트",
        "tel": "010-2222-2222",
        "memberType": "ROLE_HOST",
        "activated": 0,
      },
  ],
}

export {
  userDummy,
  hostDummy,
}