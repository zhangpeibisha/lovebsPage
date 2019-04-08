import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/student/list',
    method:'post',
    params:params
  })
}
