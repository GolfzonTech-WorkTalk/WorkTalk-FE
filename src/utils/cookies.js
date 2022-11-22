function saveTokenToCookie(value){
  document.cookie = `token=${value}`
}

function saveEmailToCookie(value){
  document.cookie = `email=${value}`
}

function saveUserTypeToCookie(value){
  document.cookie = `userType=${value}`
}

function getTokenFromCookie(){
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
    '$1',
  )
}

function getEmailFromCookie(){
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/,
    '$1',
  )
}

function getUserTypeFromCookie(){
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)userType\s*=\s*([^;]*).*$)|^.*$/,
    '$1',
  )
}

function deleteCookie(value){
  document.cookie = `${value}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

export {
  saveTokenToCookie,
  saveEmailToCookie,
  saveUserTypeToCookie,
  getTokenFromCookie,
  getEmailFromCookie,
  getUserTypeFromCookie,
  deleteCookie,
}