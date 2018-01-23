<template>
    <div>
        <el-row style="padding: 12px 48px;padding-top: 48px;line-height: 48px;">
            <span>状态:</span>
            <el-select v-model="approveStatus" placeholder="请选择" @change="selectChange">
                <el-option
                        v-for="item in candidates"
                        :label="item.realName"
                        :value="item.approveStatus">
                </el-option>
            </el-select>
            <el-input placeholder="姓名" v-model="queryWord" class="input-with-select" size="small"
                      style="width: 200px;float:right;margin-top: 8px;">
                <el-button slot="append" icon="search" @click="wordSearch"></el-button>
            </el-input>
        </el-row>
        <el-row style="padding: 12px 48px;">
            <el-table :data="teacherList" border style="width: 100%">
                <el-table-column prop="realName" label="实名" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="highestEdu" label="最高学历" width="250"></el-table-column>
                <el-table-column prop="highestTitle" label="最高职称" width="250"></el-table-column>
                <el-table-column prop="createDate" label="申请时间" width="200"></el-table-column>
                <el-table-column prop="approveStatus" label="审批状态" width="100">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div v-if="scope.row.approveStatus=='申请中'" style="float: left">
                            <el-button type="success" size="mini" @click="approveEnable(scope.row)">通过</el-button>
                            <el-button type="danger" size="mini" @click="approveReject(scope.row)">拒绝</el-button>
                        </div>
                        <i class="el-icon-edit" style="color: #1f2d3d;" @click="modifyTeacher(scope.row)"></i>
                        <i class="el-icon-delete" @click="deleteTeacher(scope.row)" style="margin-left: 16px;"></i>
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
    import ElCheckboxGroup from "../../node_modules/element-ui/lib/checkbox-group";
    import ElCheckbox from "../../node_modules/element-ui/lib/checkbox";
    import ElRadio from "../../node_modules/element-ui/packages/radio/src/radio.vue";
    import ElRadioGroup from "../../node_modules/element-ui/packages/radio/src/radio-group.vue";

    export default {
        components: {
            ElRadioGroup,
            ElRadio,
            ElCheckbox,
            ElCheckboxGroup,
            ElRow
        },
        data: function () {
            return {
                queryWord: '',
                approveStatus: '',
                currentPage: 1,
                pageSize: 10,
                total: 0,
                teacherList: [],
                candidates: [{
                    approveStatus: null,
                    realName: "全部",
                }, {
                    approveStatus: 0,
                    realName: "申请中",
                }, {
                    approveStatus: 1,
                    realName: "通过",
                }, {
                    approveStatus: 2,
                    realName: "未通过",
                }],
            }
        },
        created: function () {
            this.getTeacherList();
        },
        methods: {
            getTeacherList: function () {
                var that = this;
                axios.get(Config.URL_BASE + '/teacher/manage/list', {
                    params: {
                        'queryWord': this.queryWord,
                        'approveStatus': this.approveStatus,
                        'pageIndex': this.currentPage - 1,
                        'pageSize': this.pageSize,
                    }
                }).then(function (response) {
                    that.teacherList = response.data.data.items;
                    for (var i = 0; i < that.teacherList.length; i++) {
                        if (that.teacherList[i].gender == 0) {
                            that.teacherList[i].gender = '保密';
                        } else if (that.teacherList[i].gender == 1) {
                            that.teacherList[i].gender = '男';
                        } else if (that.teacherList[i].gender == 2) {
                            that.teacherList[i].gender = '女';
                        } else {
                            that.teacherList[i].gender = '未知';
                        }
                        if (that.teacherList[i].approveStatus == 0) {
                            that.teacherList[i].approveStatus = '申请中';
                        } else if (that.teacherList[i].approveStatus == 1) {
                            that.teacherList[i].approveStatus = '通过';
                        } else if (that.teacherList[i].approveStatus == 2) {
                            that.teacherList[i].approveStatus = '未通过';
                        }
                    }
                    that.total = response.data.data.total;
                })
            },
            pageSizeChange: function (val) {
                this.pageSize = val;
                this.getTeacherList();
            },
            currPageChange: function () {
                this.getTeacherList();
            },
            wordSearch: function () {
                this.getTeacherList();
            },
            timeStartChange: function () {
                this.getTeacherList();
            },
            timeEndChange: function () {
                this.getTeacherList();
            },
            selectChange: function () {
                this.getTeacherList();
            },
            approveEnable:function (row) {
                var that = this;
                var teacherApproveBo = {};
                teacherApproveBo.teacherId = row.teacherId;
                teacherApproveBo.approveType = 1;
                axios.post(Config.URL_BASE + '/teacher/manage/approve', teacherApproveBo).then(function (response) {
                    if (response.data.retCode == 1){
                        alert("讲师 "+ row.realName +" 审批通过")
                        that.getTeacherList();
                    }
                })
            },
            approveReject:function (row) {
                var that = this;
                var teacherApproveBo = {};
                teacherApproveBo.teacherId = row.teacherId;
                teacherApproveBo.approveType = 2;
                axios.post(Config.URL_BASE + '/teacher/manage/approve', teacherApproveBo).then(function (response) {
                    if (response.data.retCode == 1){
                        alert("讲师 "+ row.realName +" 审批未能通过")
                        that.getTeacherList();
                    }
                })
            },
            deleteTeacher:function (row) {
                var that = this;
                axios.delete(Config.URL_BASE + '/teacher/manage/approve/' + row.teacherId).then(function (response) {
                    if (response.data.retCode == 1){
                        alert("讲师 "+ row.realName +" 已删除")
                        that.getTeacherList();
                    }
                })
            },
            modifyTeacher:function (row) {
                this.$router.push({name:'user_center_teacher_detail',params:{teacherId:row.teacherId}});
            }
        }
    }
</script>