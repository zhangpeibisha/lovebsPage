import request from '@/utils/request'


export function fetchListAll(params) {
  return request({
    url:'/teacherCourse/teachTask',
    method:'get',
    params:params
  })
}

export function findSchoolYearList() {
  return request({
    url:'/teacherCourse/school/year',
    method:'get'
  })
}
