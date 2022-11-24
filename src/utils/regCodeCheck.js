function regCodeCheck(str){
  str = str.replace(/[^0-9]/g, '')
  let tmp = ''
  if (str.length < 4){
      return str
  } else if (str.length < 7){
      tmp += str.substr(0, 3)
      tmp += '-'
      tmp += str.substr(3)
      return tmp
  } else if (str.length < 8){
      tmp += str.substr(0, 3)
      tmp += '-'
      tmp += str.substr(3, 2)
      tmp += '-'
      tmp += str.substr(5)
      return tmp
  } else {              
      tmp += str.substr(0, 3)
      tmp += '-'
      tmp += str.substr(3, 2)
      tmp += '-'
      tmp += str.substr(5)
      return tmp
  }
}

export {regCodeCheck}