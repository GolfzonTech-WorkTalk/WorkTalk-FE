function nowYYmmDDhhMM(){
  let today = new Date()
  let now = today.getFullYear()+'-'+(Number(today.getMonth())+1)+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()
  return now
}

export {
  nowYYmmDDhhMM, 
}