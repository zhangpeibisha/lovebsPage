import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/faculty/quire/list',
    method:'get',
    params:params
  })
}
export function create(params) {
  return request({
    url:'/faculty/create',
    method:'post',
    params:params
  })
}
export function update(params) {
  return request({
    url:'/faculty/update',
    method:'put',
    params:params
  })
}
export function _delete(params) {
  return request({
    url:'/faculty/update',
    method:'delete',
    params:params
  })
}