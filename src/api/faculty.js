import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/faculty/quire/list',
    method: 'get',
    params: params
  })
}

export function create(params) {
  return request({
    url: '/faculty/add',
    method: 'post',
    params: params
  })
}

export function update(params) {
  console.log("获取更新学院信息的参数为",params);
  return request({
    url: '/faculty/update',
    method: 'put',
    params: params
  })
}

export function findById(id) {
  return request({
    url:'/faculty/findById',
    method:'get',
    params:{
      id
    }
  })
}

export function findUserFaculty() {
  return request({
    url:'/faculty/user/faculty',
    method:'get'
  })
}


export function _delete(ids) {
  console.log("获取到的参数为:", ids);
  var str = '';
  ids.forEach(id => str += id + ",");
  console.log("获取到str", str);
  return request({
    url: '/faculty/deletes',
    method: 'delete',
    params: {
      ids: str
    }
  })
}
