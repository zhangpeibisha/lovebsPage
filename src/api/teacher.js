import request from '@/utils/request'

export function findTeacherList() {
  return request({
    url:'/teacher/quire/list',
    method:'get',
    params:params
  })
}
export function findById(id) {
  return request({
    url:'/teacher/findById',
    method:'get',
    params:{
      id
    }
  })
}