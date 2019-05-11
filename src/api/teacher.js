import request from '@/utils/request'

export function findTeacherList(params) {
  return request({
    url: '/teacher/quire/list',
    method: 'get',
    params: params
  })
}

export function update(params) {
  return request({
    url:'/teacher/update',
    method:'put',
    params:params
  })
}

export function createTeacher(params) {
  console.log("获取到的参数为",params);
  var data = params[0];
  return request({
    url:'/teacher/create',
    method:'post',
    params:{
      email:data.email,
      jobNumber:data.jobnumber,
      name:data.name,
      phone:data.phone
    }
  })
}

export function _delete(params) {
  return request({
    url:'/teacher/update',
    method:'put',
    params:params
  })
}

