import axios from "axios"
import { setInterceptors } from "./common/interceptors"

function allUser(){
  return axios.create({
    baseURL: process.env.VUE_APP_API_URL,
  })
}

function loginUser(){
  const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
  })
  // interceptors.js로 넘겨준 것을 리턴
  return setInterceptors(instance)
}

export const instance = allUser()
export const posts = loginUser()