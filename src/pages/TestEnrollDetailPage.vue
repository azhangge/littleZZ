<template>
    <div>
        <el-row style="padding: 12px 48px;padding-top: 48px;">
             <label>考试名称：</label><span>{{enroll.examName}}</span>
            <label style="margin-left: 48px;">报名总数：</label><span>{{enroll.totalJoinNum}}</span>
        </el-row>
        <el-row  style="padding: 12px 48px;">
            <el-table :data="enroll.examUserEnrollBos" style="width: 100%">
                <el-table-column prop="userName" label="姓名" width="300"></el-table-column>
                <el-table-column prop="enrollTime" label="报名时间"></el-table-column>
            </el-table>
        </el-row>
        <el-row  style="padding: 12px 48px;">
            <el-pagination
                    @size-change="pageSizeChange"
                    @current-change="currPageChange"
                    :current-page.sync="currentPage"
                    :page-sizes="[10, 20, 40, 80]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    style="float: right;">
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
                enroll: {
                    examId:'',
                    examName:'',
                    totalJoinNum:0,
                    examUserEnrollBos:[
                        {
                            userName:'',
                            enrollTime:''
                        }
                    ]
                },
                currentPage: 1,
                pageSize: 10,
                total: 0,
            }
        },
        created: function () {
            this.enroll.examId = this.$route.params.examId;
            this.getEnrollUser();
        },
        methods: {
            getEnrollUser: function () {
                var that = this;
                axios.get(Config.URL_BASE + '/enroll/manage/list', {
                    params: {'examId':this.enroll.examId,'pageIndex':this.currentPage-1, 'pageSize':this.pageSize}
                }).then(function (response) {
                    that.enroll = response.data.data;
                    that.total = response.data.data.total;
                })
            },
            pageSizeChange: function (val) {
                this.pageSize = val;
                this.getEnrollUser();
            },
            currPageChange: function () {
                this.getEnrollUser();
            },
        }
    }
</script>