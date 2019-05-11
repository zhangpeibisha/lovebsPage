import request from '@/utils/request'

export function findTeacherList() {
  export function fetchList(params) {
    return request({
      url:'/teacher/quire/list',
      method:'get',
      params:params
    })
  }
}
