import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/class/quire/list',
    method:'get',
    params:params
  })
}
export function create(params) {
  return request({
    url:'/class/add',
    method:'post',
    params:params
  })
}
export function update(params) {
  return request({
    url:'/class/update',
    method:'put',
    params:params
  })
}
export function _delete(params) {
  return request({
    url:'/class/delete',
    method:'delete',
    params:params
  })
}
