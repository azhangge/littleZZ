<template>
    <div>
        <el-row style="padding: 12px 48px;padding-top: 48px;line-height: 48px;">
            <el-input placeholder="姓名/身份证/手机号" v-model="queryWord" class="input-with-select" size="small"
                      style="width: 200px;float:right;margin-top: 8px;">
                <el-button slot="append" icon="search" @click="wordSearch"></el-button>
            </el-input>
            <span>注册时间:</span>
            <el-date-picker
                    v-model="timeStart"
                    type="datetime"
                    @change="timeStartChange"
                    placeholder="选择日期时间">
            </el-date-picker>
            <span class="demonstration">至</span>
            <el-date-picker
                    v-model="timeEnd"
                    type="datetime"
                    @change="timeEndChange"
                    placeholder="选择日期时间">
            </el-date-picker>

        </el-row>
        <el-row style="padding: 12px 48px;padding-top: 5px;line-height: 48px;">
                <span>认证状态:</span>
                <el-select v-model="approveStatus" placeholder="请选择" @change="selectChange">
                    <el-option
                            v-for="item in candidates"
                            :label="item.name"
                            :value="item.approveStatus">
                    </el-option>
                </el-select>

            <router-link :to="{name:'user_register',params:{}}">
                <el-button style="float:right;margin-top: 8px;">新增用户</el-button>
            </router-link>

        </el-row>
        <el-row style="padding: 12px 48px;">
            <el-table :data="userList" border style="width: 100%">
                <el-table-column prop="nickName" label="姓名" width="160" show-overflow-tooltip></el-table-column>
                <el-table-column prop="gender" label="性别" width="80"></el-table-column>
                <el-table-column prop="phoneNo" label="手机号" width="130"></el-table-column>
                <el-table-column prop="idNo" label="身份证" width="180"></el-table-column>
                <el-table-column prop="orgName" label="所属组织" width="150"></el-table-column>
                <el-table-column prop="createDate" label="注册时间" width="180"></el-table-column>
                <el-table-column prop="approveStatus" label="实名认证" width="100"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="userList.length > 1" type="primary" size="small"
                                   @click="modifyUser(scope.row)">修改
                        </el-button>
                        <el-button v-if="userList.length > 1" type="primary" size="small"
                                   @click="deleteUser(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row style="padding: 12px 24px;">
            <el-pagination
                    style="float: right;"
                    @size-change="pageSizeChange"
                    @current-change="currPageChange"
                    :current-page.sync="currentPage"
                    :page-sizes="[10, 20, 40, 80]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-row>
    </div>
</template>


<script>
    import axios from 'axios'
    import Config from '../config.js'
    import ElRow from "../../node_modules/element-ui/lib/row";
    import ElCol from "element-ui/lib/col";
    import ElCheckboxGroup from "../../node_modules/element-ui/lib/checkbox-group";
    import ElCheckbox from "../../node_modules/element-ui/lib/checkbox";
    import ElRadio from "../../node_modules/element-ui/packages/radio/src/radio.vue";
    import ElRadioGroup from "../../node_modules/element-ui/packages/radio/src/radio-group.vue";
    import ElButton from "../../node_modules/element-ui/lib/button";

    export default {
        components: {
            ElRadioGroup,
            ElRadio,
            ElCheckbox,
            ElCheckboxGroup,
            ElRow,
            ElCol,
            ElButton
        },
        data: function () {
            return {
                queryWord: '',
                timeStart: null,
                timeEnd: null,
                approveStatus:'',
                orderBy: 0,
                currentPage: 1,
                pageSize: 10,
                total: 0,
                userList: [],
                candidates: [{
                    approveStatus: null,
                    name: "全部",
                },{
                    approveStatus: 0,
                    name: "申请中",
                }, {
                    approveStatus: 1,
                    name: "通过",
                }, {
                    approveStatus: 2,
                    name: "未通过",
                }],
            }
        },
        created: function () {
            this.getUserList();
        },
        methods: {
            getUserList: function () {
                var that = this;
                axios.get(Config.URL_BASE + '/account/user_info/manage/list', {
                    params: {
                        'queryWord': this.queryWord,
                        'timeStart': this.timeStart,
                        'timeEnd': this.timeEnd,
                        'approveStatus':this.approveStatus,
                        'orderBy': this.orderBy,
                        'pageIndex': this.currentPage - 1,
                        'pageSize': this.pageSize,
                    }
                }).then(function (response) {
                    that.userList = response.data.data.items;
                    for (var i=0;i<that.userList.length;i++){
                        if (that.userList[i].gender == 0){
                            that.userList[i].gender = '保密';
                        }else if (that.userList[i].gender == 1){
                            that.userList[i].gender = '男';
                        }else if (that.userList[i].gender == 2){
                            that.userList[i].gender = '女';
                        }else {
                            that.userList[i].gender = '未知';
                        }

                        if (that.userList[i].approveStatus == 0){
                            that.userList[i].approveStatus = '申请中';
                        }else if (that.userList[i].approveStatus == 1){
                            that.userList[i].approveStatus = '通过';
                        }else if (that.userList[i].approveStatus == 2){
                            that.userList[i].approveStatus = '未通过';
                        }else if (that.userList[i].approveStatus == null){
                            that.userList[i].approveStatus = '未申请';
                        }

                        if (that.userList[i].idNo == null){
                            that.userList[i].idNo = '无';
                        }

                    }
                    that.total = response.data.data.total;
                })
            },
            pageSizeChange: function (val) {
                this.pageSize = val;
                this.getUserList();
            },
            currPageChange: function () {
                this.getUserList();
            },
            wordSearch: function () {
                this.getUserList();
            },
            timeStartChange: function () {
                this.timeStart = this.formatDate(this.timeStart);
                this.getUserList();
            },
            timeEndChange: function () {
                this.timeEnd = this.formatDate(this.timeEnd);
                this.getUserList();
            },
            selectChange:function () {
                this.getUserList();
            },
            timeConvert: function (time) {
                var result = "";
                if (parseInt(time / 3600) > 0) {
                    result = parseInt(time / 3600) + "小时";
                    time = time % 3600;
                }
                if (parseInt(time / 60) > 0) {
                    result = result + parseInt(time / 60) + "分钟"
                    time = time % 60;
                } else if (result.length > 0 && parseInt(time / 60) == 0) {
                    result = result + "0分钟";
                }
                result = result + time % 60 + "秒";
                return result;
            },
            formatDate: function (date) {
                var d = new Date(date);
                var ss = d.getSeconds();
                var mm = d.getMinutes();
                var HH = d.getHours();
                var month = '' + (d.getMonth() + 1);
                var day = '' + d.getDate();
                var year = d.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return [year, month, day].join('-') + " " + [HH, mm, ss].join(":");
            },
            modifyUser: function (row) {
                this.$router.push({name:'user_basic_info',params:{userId:row.id}});
            },
            displayMessage: function (retCode, message) {
                var type = null;
                if (retCode == 1) {
                    type = "success";
                } else {
                    type = "error";
                }

                this.$notify({
                    title: '',
                    message: message,
                    type: type
                });
            },
            deleteUser:function (row) {
                var that = this;
                axios.delete(Config.URL_BASE + '/account/deleteuser/'+row.id).then(function (response) {
                    that.displayMessage(response.data.retCode, response.data.message);
                    that.getUserList();
                })
            }
        }
    }
</script>