import request from '@/utils/request'

// 分页查询所有数据
export function fetchList(currPage,pageSize) {
  return request({
    url:'/admin/resources/list',
    method:'get',
    params:{
      pageSize,
      currPage
    }

  })
}

// 删除指定数据
export function deleteResourceById(rid) {
  return request({
     url:"/admin/resources/"+rid,
     method:"delete"
  })
}
