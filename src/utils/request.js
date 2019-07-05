import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '../store'
import {getToken} from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: getBaseUrl(), // api的base_url
  timeout: 15000 // 请求超时时间
});

export function getBaseUrl() {
  // return "/api";
  return "/";
}

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) ;// for debug
  Promise.reject(error)
});

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    console.log("相应拦截器获取信息", res);
    if (res.code !== 200) {
      // 401:权限不足;
      if (res.code === 401 || res.code === 403) {
        this.$message.error('权限不足');
      } else if (res.code === 400) {
        this.$message.error('错了哦，' + res);
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' ,  error.response)// for debug
    Message({
      message: error.response.data.message,
      type: 'error',
      duration: 3 * 1000
    });
    return Promise.reject(error)
  }
);

export default service
