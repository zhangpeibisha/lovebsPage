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
    url: '/teacher/update',
    method: 'put',
    params: params
  })
}

export function createTeacher(params) {

  var data = params[0];
  return request({
    url: '/teacher/create',
    method: 'post',
    params: {
      email: data.email,
      jobNumber: data.jobnumber,
      name: data.name,
      phone: data.phone
    }
  })
}

export function _delete(params) {
  console.log("删除获取到的参数为", params.toString());
  var str = '';
  if (params){
    params.forEach(row =>{
      console.log("444444",row);
      str += row + ","
    })
  }
  return request({
    url: '/teacher/deletes',
    method: 'delete',
    params: {
      ids:str
    }
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
