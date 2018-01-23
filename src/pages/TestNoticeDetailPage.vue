<template>
    <div>
        <el-form labelWidth="160px" style="margin-top: 48px;">
            <el-form-item label="通知名称">
                <el-input size="small" v-model="noticeCreateBo.noticeName"></el-input>
            </el-form-item>
            <el-form-item label="考试名称">
                <el-input size="small" v-model="noticeCreateBo.examName"></el-input>
            </el-form-item>
            <el-form-item label="是否公开">
                <el-radio-group size="small" v-model="noticeCreateBo.isPublic">
                    <el-radio :label="true">公开</el-radio>
                    <el-radio :label="false">不公开</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否需要报名">
                <el-radio-group size="small" v-model="noticeCreateBo.isNeedEnroll">
                    <el-radio :label="1">需要</el-radio>
                    <el-radio :label="0">不需要</el-radio>
                </el-radio-group>
            </el-form-item>
            <div v-if="noticeCreateBo.isNeedEnroll">
                <el-form-item label="报名开始时间">
                    <el-date-picker
                            size="small"
                            v-model="noticeCreateBo.enrollBeginTime"
                            type="datetime"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="报名结束时间">
                    <el-date-picker
                            size="small"
                            v-model="noticeCreateBo.enrollEndTime"
                            type="datetime"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
            </div>
            <el-form-item label="考试开始时间">
                <el-date-picker
                        size="small"
                        v-model="noticeCreateBo.beginTime"
                        type="datetime"
                        placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="考试结束时间">
                <el-date-picker
                        size="small"
                        v-model="noticeCreateBo.endTime"
                        type="datetime"
                        placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="试卷">
                <el-input size="small" v-model="noticeCreateBo.paperName" :disabled="true"></el-input>
                <el-button @click="showQuestionsTable" style="float: inherit;">选择试卷</el-button>

                <el-dialog title="添加试卷" :visible.sync="showTable">
                    <el-row style="padding-bottom: 12px;">
                        <span style="margin-left: 16px;margin-right: 8px;">来源</span>
                        <el-radio-group v-model="action" @change="questionSource" style="vertical-align: middle;">
                            <el-radio class="radio" :label="3">系统题库</el-radio>
                            <el-radio class="radio" :label="1">个人创建</el-radio>
                            <el-radio class="radio" :label="2">个人收藏</el-radio>
                        </el-radio-group>
                        <el-input
                                placeholder="题目搜索"
                                icon="search"
                                v-model="searchText"
                                size="small"
                                style="float: right;width: 200px;"
                                :on-icon-click="handleSearch">
                        </el-input>
                    </el-row>
                    <el-table
                            :data="questionSets"
                            border
                            tooltip-effect="dark"
                            style="width: 100%">
                        <el-table-column
                                prop="name"
                                label="试卷"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                width="100">
                            <template slot-scope="scope">
                                <el-button v-if="questionSets.length > 0" type="primary" size="small"
                                           @click="addPaper(scope.$index, scope.row)">添加
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row>
                        <el-col>
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
                        </el-col>
                    </el-row>
                </el-dialog>

            </el-form-item>
            <el-form-item label="考试时长">
                <el-input size="small" v-model="noticeCreateBo.duration"></el-input>
            </el-form-item>
            <el-form-item label="考试地点">
                <el-input size="small" v-model="noticeCreateBo.position"></el-input>
            </el-form-item>
            <el-form-item label="是否社会考试">
                <el-radio-group size="small" v-model="noticeCreateBo.type">
                    <el-radio label="1">社会考试</el-radio>
                    <el-radio label="2">企业考试</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="通知内容">
                <el-input type="textarea" :rows="5" style="width: 650px;" size="small"
                          v-model="noticeCreateBo.content"></el-input>
            </el-form-item>
            <el-form-item label="考试须知">
                <el-input type="textarea" :rows="5" style="width: 650px;" size="small"
                          v-model="noticeCreateBo.instructions"></el-input>
            </el-form-item>
            <el-form-item label="组织方">
                <el-input size="small" v-model="noticeCreateBo.orgName"></el-input>
            </el-form-item>
        </el-form>
        <el-row style="text-align: center;">
            <el-button @click="updateNotice" :disabled="updateButton">编辑</el-button>
            <el-button @click="createNotice" :disabled="createButton">保存</el-button>
            <el-button @click="createAndPublish" :disabled="createButton">保存并发布</el-button>
            <el-button @click="publish" :disabled="publishButton">发布</el-button>
        </el-row>
    </div>
</template>

<script>
    import axios from "axios";
    import Config from "../config";
    import ElRadioGroup from "../../node_modules/element-ui/lib/radio-group";
    import ElButton from "../../node_modules/element-ui/lib/button";
    import ElInput from "../../node_modules/element-ui/lib/input";
    import ElRadio from "../../node_modules/element-ui/lib/radio";
    import ElForm from "../../node_modules/element-ui/lib/form";
    import ElFormItem from "../../node_modules/element-ui/lib/form-item";

    export default {
        components: {
            ElFormItem,
            ElForm,
            ElButton,
            ElRadioGroup,
            ElInput,
            ElRadio
        },
        data() {
            return {
                noticeCreateBo: {
                    examId: null,
                    noticeName: null,
                    examName: null,
                    isPublic: true,
                    position: null,
                    type: '1',
                    content: null,
                    isPublish: false,
                    instructions: null,
                    orgName: null,
                    isNeedEnroll: 0,
                    beginTime: null,
                    endTime: null,
                    enrollBeginTime: null,
                    enrollEndTime: null,
                    duration: null,
                    paperName: '',
                    questionSetId: ''
                },
                createButton: false,
                updateButton: true,
                publishButton: true,
                showTable: false,
                examId: '',
                currentPage: 1,
                pageSize: 10,
                total: 0,
                action: 3,
                searchText: '',
                questionSets: [
                    {
                        questionSetId: '',
                        name: '',
                        type: '',
                    }
                ],
            }
        },
        created: function () {
            this.noticeCreateBo.examId = this.$route.params.examId;
            if (this.noticeCreateBo.examId) {
                this.getNotice();
            }
        },
        methods: {
            createNotice: function () {
                if(this.verify() == false){
                    return;
                }
                var that = this;
                axios.post(Config.URL_BASE + '/notice/exam', this.noticeCreateBo).then(function (response) {
                    alert('创建成功');
                    that.createButton = true;
                    that.updateButton = false;
                    that.publishButton = false;
                    that.noticeCreateBo.examId = response.data.data.examId;

                })
            },
            createAndPublish: function () {
                var that = this;
                axios.post(Config.URL_BASE + '/notice/exam', this.noticeCreateBo).then(function (response) {
                    that.noticeCreateBo.examId = response.data.data.examId;
                    axios.put(Config.URL_BASE + '/notice/exam/push?examId=' + response.data.data.examId)
                    that.createButton = true;
                    that.updateButton = false;
                });
            },
            publish: function () {
                var that = this;
                axios.put(Config.URL_BASE + '/notice/exam/push?examId=' + that.noticeCreateBo.examId).then(function (response) {
                    that.publishButton = true;
                    that.createButton = true;
                    that.updateButton = false;
                });
            },
            updateNotice: function () {
                this.getNotice();
                this.createButton = false;
                this.updateButton = true;
            },
            getNotice: function () {
                var that = this;
                axios.get(Config.URL_BASE + '/notice/exam/' + this.noticeCreateBo.examId).then(function (response) {
                    that.noticeCreateBo = response.data.data;
                    that.publishButton = false;
                })
            },
            showQuestionsTable: function () {
                this.showTable = true;
                this.getQuestionSet();
            },
            getQuestionSet: function () {
                var that = this;
                axios.get(Config.URL_BASE + '/test_paper/searchQuestionSet', {
                    params: {
                        'pageIndex': this.currentPage - 1, 'pageSize': this.pageSize,
                        'type': 2, 'search': this.searchText, 'source': this.action
                    }
                }).then(function (respose) {
                    that.questionSets = respose.data.data.items;
                    that.total = respose.data.data.total;
                })
            },
            pageSizeChange: function (val) {
                this.pageSize = val;
                this.getQuestionSet();
            },
            currPageChange: function () {
                this.getQuestionSet();
            },
            questionSource: function () {
                this.getQuestionSet();
            },
            handleSearch: function () {
                this.getQuestionSet();
            },
            addPaper: function (index, row) {
                var that = this;
                that.noticeCreateBo.paperName = row.name;
                that.showTable = false;
                that.noticeCreateBo.questionSetId = row.questionSetId;
            },
            verify: function () {
                if (this.noticeCreateBo.noticeName == null || this.noticeCreateBo.noticeName.trim().length < 1) {
                    alert("请输入通知名称");
                    return false;
                }
                if (this.noticeCreateBo.examName == null || this.noticeCreateBo.examName.trim().length < 1) {
                    alert("请输入考试名称");
                    return false;
                }
                if (this.noticeCreateBo.beginTime == null) {
                    alert("请选择考试开始时间");
                    return false;
                }
                if (this.noticeCreateBo.endTime == null) {
                    alert("请选择考试结束时间");
                    return false;
                }
                if (this.noticeCreateBo.duration == null || !(/(^[1-9]\d*$)/.test(this.noticeCreateBo.duration))) {
                    alert("请输入一个正整数做为您的考试时长");
                    return false;
                }
                if (this.noticeCreateBo.isNeedEnroll == 1) {
                    if (this.noticeCreateBo.enrollBeginTime == null || this.noticeCreateBo.enrollEndTime == null) {
                        alert("报名起止时间必填");
                        return false;
                    }
                }
            }
        }
    }
</script>
<style>
    .el-input {
        width: 300px;
    }
</style>