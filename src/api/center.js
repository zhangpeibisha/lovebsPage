import request from '@/utils/request'

export function findUserInfo() {
  return request({
    url:'/account/user/info',
    method:'get',
  })
}

export function findPublishInfoByids(ids) {
  var str = '';
  ids.forEach(id => str += id + ",");
  return request({
    url:'/publishquestionnaire/list/by/ids',
    method:'get',
    params:{
    	ids:str
    }
  })
}



export function timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y+M+D
    }
