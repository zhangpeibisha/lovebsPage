import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/profession/quire/list',
    method:'get',
    params:params
  })
}
export function fetchFacultyList(params) {
  return request({
    url:'/faculty/quire/list',
    method:'get',
    params:params
  })
}
export function fetchTeacherList(params) {
  return request({
    url:'/teacher/quire/list',
    method:'get',
    params:params
  })
}
export function create(params) {
  return request({
    url:'/profession/create',
    method:'post',
    params:params
  })
}
export function update(params) {
  return request({
    url:'/profession/update',
    method:'put',
    params:params
  })
}
export function _delete(params) {
  return request({
    url:'/profession/update',
    method:'delete',
    params:params
  })
}