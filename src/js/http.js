import axios from 'axios'

const http = axios.create({
  baseURL: 'https://mcax.cn:10808',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer yourToken'
  }
})

http.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

http.interceptors.response.use(response => {
  return response
}, error => {
    if (error.response) {
        switch (error.response.status) {
            case 400:
                this.$message.error('请求错误')
            break
            case 401:
                this.$message.error('用户验证错误')
            break
            case 403:
                this.$message.error('禁止访问')
            break
            case 404:
                this.$message.error('未找到')
            break
            case 500:
                this.$message.error('服务器内部错误')
            break
            default:
                this.$message.error('发生了一些错误')
        }
    }
  return Promise.reject(error)
});

export default http
