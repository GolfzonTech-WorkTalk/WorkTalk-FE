const spaceDumy = [
  {
    spaceName:"더미 공간 1호",
    spaceImg : "dummy1.jpg",
    address:"경기도 수원시 장안구",
    spaceId:"1",
    grade:"4",
    review:"100",
    spaceStatus: "roomSetting",
    spaceType:'1',
  },
  {
    spaceName:"더미 공간 2호",
    spaceImg : "dummy2.jpg",
    address:"경기도 수원시 장안구",
    spaceId:"2",
    grade:"3",
    review:"100",
    spaceStatus: "approved",
    spaceType:'2',
  },
  {
    spaceName:"더미 공간 3호",
    spaceImg : "dummy3.jpg",
    address:"경기도 수원시 장안구",
    spaceId:"3",
    grade:"1",
    review:"100",
    spaceStatus: "roomSetting",
    spaceType:'1',
  },
  {
    spaceName:"더미 공간 4호",
    spaceImg : "dummy2.jpg",
    address:"경기도 수원시 장안구",
    spaceId:"4",
    grade:"5",
    review:"100",
    spaceStatus: "approved",
    spaceType:'2',
  },
  {
    spaceName:"더미 공간 5호",
    spaceImg : "dummy3.jpg",
    address:"경기도 수원시 장안구",
    spaceId:"5",
    grade:"2",
    review:"100",
    spaceStatus: "waiting",
    spaceType:'3',
  },
  {
    spaceName:"더미 공간 6호",
    spaceImg : "dummy2.jpg",
    address:"경기도 수원시 장안구",
    spaceId:"6",
    grade:"2",
    review:"100",
    spaceStatus: "waiting",
    spaceType:'3',
  },
  {
    spaceName:"더미 공간 7호",
    spaceImg : "dummy1.jpg",
    address:"경기도 수원시 장안구",
    spaceId:"7",
    grade:"2",
    review:"100",
    spaceStatus: "waiting",
    spaceType:'3',
  },
  {
    spaceName:"더미 공간 8호",
    spaceImg : "dummy2.jpg",
    address:"경기도 수원시 장안구",
    spaceId:"8",
    grade:"2",
    review:"100",
    spaceStatus: "waiting",
    spaceType:'3',
  },
  {
    spaceName:"더미 공간 9호",
    spaceImg : "dummy1.jpg",
    address:"경기도 수원시 장안구",
    spaceId:"9",
    grade:"2",
    review:"100",
    spaceStatus: "waiting",
    spaceType:'3',
  },
]

const recommendSpaceDumy = [
  {
    spaceName:"더미 공간 1호",
    spaceImg : "dummy1.jpg",
    address:"경기도 수원시 장안구",
    spaceId:"1",
    grade:"4",
    review:"100",
    spaceStatus: "roomSetting",
    spaceType:'1',
  },
  {
    spaceName:"더미 공간 2호",
    spaceImg : "dummy2.jpg",
    address:"경기도 수원시 장안구",
    spaceId:"2",
    grade:"3",
    review:"100",
    spaceStatus: "approved",
    spaceType:'2',
  },
  {
    spaceName:"더미 공간 3호",
    spaceImg : "dummy3.jpg",
    address:"경기도 수원시 장안구",
    spaceId:"3",
    grade:"1",
    review:"100",
    spaceStatus: "roomSetting",
    spaceType:'1',
  },
]

const selectOneSpaceDumy = [
  {
    spaceName:"더미 공간 5호",
    spaceImg : "dummy3.jpg",
    address:"서울특별시 강남구 영동대로",
    detailAddress:"735 골프존타워서울",
    spaceDetail: "더미 공간 1호 입니다.",
    spaceId:"5",
    grade:"2",
    review:"100",
    spaceStatus: "waiting",
    spaceType:'3',
    member: {
      name: '홍길동',
      tel: '010-1234-5678',
      email: 'a@a.com',
    },
  },
  {
    spaceName:"더미 공간 5호",
    spaceImg : "dummy3.jpg",
    address:"서울 용산구 한강대로",
    detailAddress:"270",
    spaceDetail: "더미 공간 1호 입니다.",
    spaceId:"5",
    grade:"2",
    review:"100",
    spaceStatus: "waiting",
    spaceType:'3',
    member: {
      name: '홍길동',
      tel: '010-1234-5678',
      email: 'a@a.com',
    },
  },
]

const selectOneRoomDumy = [
  {
    roomId: '1',
    roomType: 'MEETING4',
    roomName: '기린',
    roomImg: '',
    roomPrice: '20000',
    workStart: '08',
    workEnd:'20',
    roomDetail:'기린이 있는 방',
  },
  {
    roomId: '2',
    roomType: 'MEETING6',
    roomName: '코끼리',
    roomImg: '',
    roomPrice: '20000',
    workStart: '10',
    workEnd:'22',
    roomDetail:'코끼리가 있는 방',
  },
  {
    roomId: '3',
    roomType: 'MEETING8',
    roomName: '낙타',
    roomImg: '',
    roomPrice: '20000',
    workStart: '08',
    workEnd:'24',
    roomDetail:'낙타가 있는 방',
  },
]

const selectOneRoomDumy2 = [
  {
    roomId: '1',
    roomType: 'OFFICE',
    roomName: '더미 공간 5호',
    roomImg: '',
    roomPrice: '20000',
    workStart: '',
    workEnd:'',
    roomDetail:'동물들이 있는 오피스 공간입니다.',
  },
]

const reservationData1 = [
  {
      "roomId": 51,
      "roomType": null,
      "initDate": "2022-11-22",
      "endDate": null,
      "initTime": 15,
      "endTime": 17,
  },
  {
    "roomId": 51,
    "roomType": null,
    "initDate": "2022-11-22",
    "endDate": null,
    "initTime": 8,
    "endTime": 10,
  },
]

const reservationData2 = [
  {
      "roomId": 51,
      "roomType": null,
      "initDate": "2022-11-22",
      "endDate": null,
      "initTime": 9,
      "endTime": 10,
  },
  {
    "roomId": 51,
    "roomType": null,
    "initDate": "2022-11-22",
    "endDate": null,
    "initTime": 12,
    "endTime": 15,
  },
]

const reservationData3 = [
  {
      "roomId": 51,
      "roomType": null,
      "initDate": "2022-12-1",
      "endDate": "2022-12-5",
      "initTime": '',
      "endTime": '',
  },
  {
      "roomId": 1,
      "roomType": null,
      "initDate": "2022-12-10",
      "endDate": "2022-12-18",
      "initTime": '',
      "endTime": '',
  },
  {
    "roomId": 1,
    "roomType": null,
    "initDate": "2022-10-28",
    "endDate": "2022-11-15",
    "initTime": '',
    "endTime": '',
},
{
    "roomId": 1,
    "roomType": null,
    "initDate": "2022-11-20",
    "endDate": "2022-11-30",
    "initTime": '',
    "endTime": '',
},
]

const reservationDataDeskMeetingroom = [
  {
      "roomName": "room_desk",
      "paid": 0,
      "reserveId": 1,
      "memberId": 1,
      "rooomId": 51,
      "bookDate": {
          "reserveDate": "2022-11-24T13:30:30",
          "cancelDate": null,
          "checkInDate": "2022-11-22",
          "checkOutDate": null,
          "checkInTime": 20,
          "checkOutTime": 23,
      },
      "name": "사용자",
      "reserveStatus": "NOSHOW",
      "paymentStatus": "PREPAID",
      "roomType": "DESK",
      "reserveAmount": 30000,
  },
  {
      "roomName": "room_desk",
      "paid": 0,
      "reserveId": 51,
      "memberId": 1,
      "rooomId": 51,
      "bookDate": {
          "reserveDate": "2022-11-24T13:30:30",
          "cancelDate": null,
          "checkInDate": "2022-11-23",
          "checkOutDate": null,
          "checkInTime": 20,
          "checkOutTime": 23,
      },
      "name": "사용자",
      "reserveStatus": "CANCELED_BY_USER",
      "paymentStatus": "REFUND",
      "cancelReason":"취소 사유입니다..........asdfsdafasdfasdffasdfsadfasdfasdfasdfasdfasdflkasjdlkfjl;aksdjf취소 사유입니다..........asdfsdafasdfasdffasdfsadfasdfasdfasdfasdfasdflkasjdlkfjl;aksdjf",
      "roomType": "DESK",
      "reserveAmount": 30000,
  },
  {
      "roomName": "room_desk",
      "paid": 0,
      "reserveId": 101,
      "memberId": 1,
      "rooomId": 51,
      "bookDate": {
          "reserveDate": "2022-11-24T13:30:30",
          "cancelDate": null,
          "checkInDate": "2022-11-27",
          "checkOutDate": null,
          "checkInTime": 21,
          "checkOutTime": 23,
      },
      "name": "사용자",
      "reserveStatus": "CANCELED_BY_HOST",
      "paymentStatus": "REFUND",
      "cancelReason":"취소 사유입니다..........222",
      "roomType": "DESK",
      "reserveAmount": 30000,
  },
  {
      "roomName": "room_office",
      "paid": 1,
      "reserveId": 151,
      "memberId": 1,
      "rooomId": 1,
      "bookDate": {
          "reserveDate": "2022-11-24T13:30:30",
          "cancelDate": null,
          "checkInDate": "2022-11-27",
          "checkOutDate": null,
          "checkInTime": 21,
          "checkOutTime": 23,
      },
      "name": "사용자",
      "reserveStatus": "USED",
      "paymentStatus": "PREPAID",
      "roomType": "OFFICE",
      "reserveAmount": 30000,
  },
  {
      "roomName": "room_meetingRoom",
      "paid": 0,
      "reserveId": 201,
      "memberId": 1,
      "rooomId": 51,
      "bookDate": {
          "reserveDate": "2022-11-24T13:30:30",
          "cancelDate": null,
          "checkInDate": "2022-11-30",
          "checkOutDate": null,
          "checkInTime": 9,
          "checkOutTime": 14,
      },
      "name": "사용자",
      "reserveStatus": "BOOKED",
      "paymentStatus": "PREPAID",
      "roomType": "MEETING4",
      "reserveAmount": 50000,
  },
  {
      "roomName": "room_desk",
      "paid": 0,
      "reserveId": 1,
      "memberId": 1,
      "rooomId": 51,
      "bookDate": {
          "reserveDate": "2022-11-24T13:30:30",
          "cancelDate": null,
          "checkInDate": "2022-11-22",
          "checkOutDate": null,
          "checkInTime": 20,
          "checkOutTime": 23,
      },
      "name": "사용자",
      "reserveStatus": "NOSHOW",
      "paymentStatus": "PREPAID",
      "roomType": "DESK",
      "reserveAmount": 30000,
  },
  {
      "roomName": "room_office",
      "paid": 0,
      "reserveId": 251,
      "memberId": 1,
      "rooomId": 1,
      "bookDate": {
          "reserveDate": "2022-11-24T14:40:40",
          "cancelDate": null,
          "checkInDate": "2022-11-30",
          "checkOutDate": "2022-12-30",
          "checkInTime": 9,
          "checkOutTime": 14,
      },
      "name": "사용자",
      "reserveStatus": "BOOKED",
      "paymentStatus": "POSTPAID_BOOKED",
      "roomType": "OFFICE",
      "reserveAmount": 300000,
  },
  {
    "roomName": "room_desk",
    "paid": 0,
    "reserveId": 1,
    "memberId": 1,
    "rooomId": 51,
    "bookDate": {
        "reserveDate": "2022-11-24T13:30:30",
        "cancelDate": null,
        "checkInDate": "2022-11-22",
        "checkOutDate": null,
        "checkInTime": 20,
        "checkOutTime": 23,
    },
    "name": "사용자",
    "reserveStatus": "NOSHOW",
    "paymentStatus": "PREPAID",
    "roomType": "DESK",
    "reserveAmount": 30000,
  },
  {
    "roomName": "room_meetingRoom",
    "paid": 0,
    "reserveId": 201,
    "memberId": 1,
    "rooomId": 51,
    "bookDate": {
        "reserveDate": "2022-11-24T13:30:30",
        "cancelDate": null,
        "checkInDate": "2022-11-30",
        "checkOutDate": null,
        "checkInTime": 9,
        "checkOutTime": 14,
    },
    "name": "사용자",
    "reserveStatus": "BOOKED",
    "paymentStatus": "PREPAID",
    "roomType": "MEETING4",
    "reserveAmount": 50000,
  },
  {
    "roomName": "room_desk",
    "paid": 0,
    "reserveId": 1,
    "memberId": 1,
    "rooomId": 51,
    "bookDate": {
        "reserveDate": "2022-11-24T13:30:30",
        "cancelDate": null,
        "checkInDate": "2022-11-22",
        "checkOutDate": null,
        "checkInTime": 20,
        "checkOutTime": 23,
    },
    "name": "사용자",
    "reserveStatus": "NOSHOW",
    "paymentStatus": "PREPAID",
    "roomType": "DESK",
    "reserveAmount": 30000,
  },
]

export {
  spaceDumy,
  recommendSpaceDumy,
  selectOneSpaceDumy,
  selectOneRoomDumy,
  selectOneRoomDumy2,
  reservationData1,
  reservationData2,
  reservationData3,
  reservationDataDeskMeetingroom,
}