<template>
    <div class="userManage">
        <el-table :data="tableData" border :row-class-name="tableRowClassName" v-loading="loading" style="width: 100%">
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="userName" label="用户名">
                <template slot-scope="scope">
                    <div v-if="editIndex===scope.$index">
                        <el-input class="rounded-3" size="small" v-model="scope.row.userName" placeholder="请输入内容"></el-input>
                    </div>
                    <div v-else>{{ scope.row.userName }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="gameName" label="游戏名">
                <template slot-scope="scope">
                    <div v-if="editIndex===scope.$index">
                        <el-input class="rounded-3" size="small" v-model="scope.row.gameName" placeholder="请输入内容"></el-input>
                    </div>
                    <div v-else>{{ scope.row.gameName }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="admin" label="管理员">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.admin" active-value='1' inactive-value='0' :disabled="editIndex!==scope.$index"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="密码">
                <template slot-scope="scope">
                    <div v-if="editIndex!==scope.$index">
                        *点击编辑修改密码
                    </div>
                    <div v-else>
                        <el-input class="rounded-3" size="small" v-model="password" placeholder="请输入新的密码"></el-input>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="170px">
                <template slot-scope="scope">
                    <div v-if="editIndex!==scope.$index">
                        <el-button class="rounded-3" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button class="rounded-3" size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </div>
                    <div v-else>
                        <el-button class="rounded-3" size="small" @click="confEdit(scope.$index, scope.row)">确认</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import http from '../../js/http'
import pasenc from '../../js/pasenc'
export default({
    data(){
        return{
            loading:true,
            editIndex:null,
            password:'',
            tableData:[]
        }
    },
    mounted(){
        const query={
            userName:this.$store.state.userName
        }
        http.post('/getAllUserInfo',query)
        .then(res=>{
            this.tableData=res.data.data
            this.loading=false
        })
        .catch(err=>{
            console.log(err)
        })
    },
    methods:{
        tableRowClassName({row, rowIndex}) {
            if (row.admin == 1) {
                return 'admin-row'
            }
            return ''
        },
        handleEdit(index,row){
            this.editIndex=index
        },
        handleDelete(index,row){
            // console.log(index,row.id)
            const query={
                id:row.id
            }
            http.post('/delUserAdmin',query)
            .then(res=>{
                // console.log(res)
                this.tableData.splice(index,1)
                this.$message({
                    message: res.data.msg,
                    type: 'success'
                })
            })
        },
        confEdit(index,row){
            const query={
                id:row.id,
                userName:row.userName,
                gameName:row.gameName,
                admin:row.admin,
                password:this.password.length>0?pasenc(this.password):null
            }
            http.post('/editUserInfoAdmin',query)
            .then(res=>{
                // console.log(res)
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
            })
            // console.log(query)
            this.password=''
            this.editIndex=null
            
        }
    },
    computed:{
      isLoggedIn() {
        return this.$store.state.isLoggedIn
      },
      isAdmin() {
        return this.$store.state.isAdmin
      },
      userName() {
        return this.$store.state.userName
      }
    },
})
</script>

<style>
.userManage{
    .el-table .admin-row {
        background: #28abce20;
    }
}
</style>