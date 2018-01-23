<template>
    <div>
        <el-row style="padding: 12px 48px;padding-top: 48px;line-height: 48px;">
            <el-form labelWidth="160px">
                <el-form-item label="题集名称">
                    <el-input v-model="questionSetCreate.name" placeholder="题集名称" style="width: 350px"></el-input>
                </el-form-item>
                <el-form-item label="是否公开">
                    <el-radio-group v-model="questionSetCreate.isPublic">
                        <el-radio :label="true">公开</el-radio>
                        <el-radio :label="false">不公开</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="出题策略">
                    <el-radio-group v-model="questionSetCreate.strategy">
                        <el-radio :label="1">人工出题</el-radio>
                        <!--
                        <el-radio :label="2">随机出题</el-radio>
                        -->
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input type="textarea" v-model="questionSetCreate.descriptions" placeholder="题集说明"
                              style="width: 650px" rows="5"></el-input>
                </el-form-item>
                <el-form-item v-show="questionNum" label="题目">
                    单选题<span style="margin:0 8px;color: blue; font-weight: bold">{{single}}</span>道，
                    多选题<span style="margin:0 8px;color: blue; font-weight: bold">{{multi}}</span>道，
                    判断题<span style="margin:0 8px;color: blue; font-weight: bold">{{judge}}</span>道
                </el-form-item>
            </el-form>
        </el-row>
        <el-row style="margin-left: 48px;margin-right:48px; padding-bottom: 6px; border-bottom: solid 1px #f5f5f5;">
            <el-col :span="2"><span>题目列表</span></el-col>
            <el-button type="primary" size="small"
                       style="float:right;margin-top: 4px;margin-right: 24px;"
                       @click="showQuestionsTable">{{buttonMsg}}</el-button>
        </el-row>
        <div style="padding: 12px 64px; " v-if="questionSetCreate.questions.length != 0">
            <el-table
                    :data="questionSetCreate.questions"
                    border
                    tooltip-effect="dark"
                    style="width: 100%">
                <el-table-column
                        prop="questionIndex"
                        label="序号"
                        width="60"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="statement"
                        label="题目"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="type"
                        width="96"
                        label="类型">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="72">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small"
                                   @click="deletedQuestion(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="padding: 12px 24px; height: 80px;vertical-align: middle;text-align: center;" v-else>
            <span>没有任何题目</span>
        </div>

        <el-dialog title="添加题目" :visible.sync="showTable">
            <el-row style="padding: 4px 12px;">
                <span style="margin-left: 16px;margin-right: 8px;">来源</span>
                <el-select v-model="action" placeholder="请选择" @change="questionSourceType">
                    <el-option
                            v-for="item in actions"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                    </el-option>
                </el-select>
                <span style="margin-left: 16px;margin-right: 8px;">题目类型</span>
                <el-select v-model="questionType" placeholder="请选择" @change="questionSourceType">
                    <el-option
                            v-for="item in questionTypes"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input
                        style="width: 250px;float:right;"
                        placeholder="题目搜索"
                        icon="search"
                        v-model="searchText"
                        :on-icon-click="handleSearch">
                </el-input>
            </el-row>
            <el-row style="padding: 8px 12px;">
                <el-table
                        :data="refQuestions"
                        border
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column
                            prop="statement"
                            label="题目"
                            current-row-key="questionId"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="类型"
                            width="100"
                    >
                    </el-table-column>
                    <!--
                    <el-table-column
                            label="操作"
                            width="100">
                        <template slot-scope="scope">
                            <el-button v-if="refQuestions.length > 1" type="primary" size="small"
                                       @click="addQuestion(scope.$index, scope.row)">添加
                            </el-button>
                        </template>
                    </el-table-column>
                    -->
                </el-table>
            </el-row>

            <el-row>
                <el-col push="12">
                    <el-pagination
                            @size-change="pageSizeChange"
                            @current-change="currPageChange"
                            :current-page.sync="currentPage"
                            :page-sizes="[10, 20, 40, 80]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showTable = false">取 消</el-button>
                <el-button type="primary" @click="batchSelect">确 定</el-button>
            </span>
        </el-dialog>

        <div v-if="saveButton" style="text-align: center;">
            <el-button type="primary" @click="createQuestionSet">{{saveButtonMsg}}</el-button>
        </div>
        <div style="float: right;" v-if="updateButton">
            <el-col :offset='11' :span="2">
                <el-button type="primary" @click="updateQuestionSet" style="float: right">编辑</el-button>
            </el-col>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Config from '../config.js'
    import ElForm from "../../node_modules/element-ui/lib/form";
    import ElFormItem from "../../node_modules/element-ui/lib/form-item";
    import ElRadio from "../../node_modules/element-ui/packages/radio/src/radio.vue";
    import ElRadioGroup from "../../node_modules/element-ui/packages/radio/src/radio-group.vue";
    import ElButton from "../../node_modules/element-ui/lib/button";
    import ElCol from "element-ui/lib/col";
    import ElRow from "../../node_modules/element-ui/lib/row";

    export default {
        components: {
            ElForm,
            ElFormItem,
            ElRadio,
            ElRadioGroup,
            ElButton,
            ElCol,
            ElRow
        },
        data: function () {
            return {
                questionSetCreate: {
                    questionSetId: '',
                    name: null,
                    isPublic: true,
                    type: null,
                    strategy: 1,
                    tags: null,
                    descriptions: null,
                    questions: [],
                },
                showTable: false,
                currentPage: 1,
                pageSize: 10,
                total: 0,
                refQuestions: [
                    {
                        questionId: '',
                        statement: '',
                        type: '',
                    }
                ],
                buttonMsg: '添加题目',

                saveButton: true,

                saveButtonMsg: '创建',
                updateButton: false,
                action: null,
                actions: [
                    {name: "系统题库", value: null},
                    {name: "个人创建", value: 1},
                    {name: "个人收藏", value: 2},
                ],
                questionType: null,
                questionTypes: [
                    {name: "全部", value: null},
                    {name: "单选题", value: 1},
                    {name: "多选题", value: 2},
                    {name: "判断题", value: 3},
                ],
                searchText: null,
                buttonAble: true,
                questionNum: false,
                single: 0,
                multi: 0,
                judge: 0,
                selectQuestions:[],
            }
        },
        created: function () {
            this.questionSetCreate.questionSetId = this.$route.params.questionSetId;
            if (this.questionSetCreate.questionSetId!=null && this.questionSetCreate.questionSetId.length > 0) {
                this.updateQuestionSet();
            }
        },
        methods: {
            createQuestionSet: function () {
                if (this.questionSetCreate.name==null || this.questionSetCreate.name.trim().length < 1){
                    alert("请输入题集名称");
                    return;
                }
                var that = this;
                if (that.questionSetCreate.questionSetId == null) {
                    that.questionSetCreate.questionSetId = 'temp';
                }
                that.questionSetCreate.type = 1;
                axios.post(Config.URL_BASE + '/test_paper', this.questionSetCreate).then(function (response) {

                    if (that.questionSetCreate.questionSetId == 'temp') {
                        alert('创建成功');
                    } else {
                        alert('修改成功');
                    }
                    that.updateButton = true;

                    that.saveButton = false;
                    that.questionSetCreate.questionSetId = response.data.data.questionSetId;
                })
            },
            updateQuestionSet: function () {
                var that = this;

                that.saveButton = true;
                that.updateButton = false;
                that.saveButtonMsg = '确认修改';
                that.questionNum = true;

                axios.get(Config.URL_BASE + '/test_paper/' + that.questionSetCreate.questionSetId).then(function (response) {
                    that.questionSetCreate = response.data.data;
                    for (var i = 0; i < that.questionSetCreate.questions.length; i++) {
                        if (that.questionSetCreate.questions[i].type == 1) {
                            that.questionSetCreate.questions[i].type = '单选题';
                            that.single = that.single + 1;
                        } else if (that.questionSetCreate.questions[i].type == 2) {
                            that.questionSetCreate.questions[i].type = '多选题';
                            that.multi = that.multi + 1;
                        } else if (that.questionSetCreate.questions[i].type == 3) {
                            that.questionSetCreate.questions[i].type = '判断题';
                            that.judge = that.judge + 1;
                        }
                    }
                });
            },
            getQuestionSet: function () {
                var that = this;
                axios.get(Config.URL_BASE + '/test_paper/' + this.questionSetCreate.questionSetId).then(function (response) {
                    that.questionSetCreate = response.data.data;
                    if (that.questionSetCreate.questions.length > 0) {
                        that.questionNum = true;
                        that.saveButtonMsg = '确认修改';
                    }
                    for (var i = 0; i < that.questionSetCreate.questions.length; i++) {
                        if (that.questionSetCreate.questions[i].type == 1) {
                            that.questionSetCreate.questions[i].type = '单选题';
                        } else if (that.questionSetCreate.questions[i].type == 2) {
                            that.questionSetCreate.questions[i].type = '多选题';
                        } else if (that.questionSetCreate.questions[i].type == 3) {
                            that.questionSetCreate.questions[i].type = '判断题';
                        }
                    }
                })
            },
            showQuestionsTable: function () {
                if (this.buttonMsg == '添加题目') {
                    //this.buttonMsg = '完成添加';
                    this.showTable = true;
                    this.getQuestions();
                } //else {
                  //  this.buttonMsg = '添加题目';
                  //  this.showTable = false;
                //}
                this.questionNum = true;
            },
            getQuestions: function () {
                var that = this;
                axios.get(Config.URL_BASE + '/question/user', {
                    params: {
                        'page': this.currentPage - 1, 'size': this.pageSize, 'action': this.action,
                        'type': this.questionType, 'search': this.searchText
                    }
                }).then(function (respose) {
                    that.refQuestions = respose.data.data.items;
                    that.total = respose.data.data.total;
                    for (var i = 0; i < that.refQuestions.length; i++) {
                        if (that.refQuestions[i].type == 1) {
                            that.refQuestions[i].type = '单选题';
                        } else if (that.refQuestions[i].type == 2) {
                            that.refQuestions[i].type = '多选题';
                        } else if (that.refQuestions[i].type == 3) {
                            that.refQuestions[i].type = '判断题';
                        }
                    }
                })
            },
            pageSizeChange: function (val) {
                this.pageSize = val;
                this.getQuestions();
            },
            currPageChange: function () {
                this.getQuestions();
            },
            questionSource: function () {
                this.getQuestions();
            },
            questionSourceType: function () {
                this.getQuestions();
            },
            handleSearch: function () {
                this.getQuestions();
            },
            addQuestion: function (index, row) {
                var questionBo = {};
                questionBo.questionId = row.questionId;
                questionBo.questionIndex = this.questionSetCreate.questions.length + 1;
                questionBo.type = row.type;
                questionBo.statement = row.statement;
                this.questionSetCreate.questions.push(questionBo);
                if (row.type == '单选题') {
                    this.single = this.single + 1;
                } else if (row.type == '多选题') {
                    this.multi = this.multi + 1;
                } else if (row.type == '判断题') {
                    this.judge = this.judge + 1;
                }
            },
            deletedQuestion: function (row) {
                if (row.type == '单选题') {
                    this.single = this.single - 1;
                } else if (row.type == '多选题') {
                    this.multi = this.multi - 1;
                } else if (row.type == '判断题') {
                    this.judge = this.judge - 1;
                }
                for (var i = 0; this.questionSetCreate.questions.length; i++) {
                    if (this.questionSetCreate.questions[i].questionId == row.questionId) {
                        this.questionSetCreate.questions.splice(i, 1);
                    }
                }
            },
            handleSelectionChange: function (val) {
                this.selectQuestions = val;
            },
            batchSelect:function () {
                this.showTable = false;
                for (var i = 0; i < this.selectQuestions.length; i++){
                    this.selectQuestions[i].questionIndex = this.questionSetCreate.questions.length + 1;
                    this.questionSetCreate.questions.push(this.selectQuestions[i]);
                    if (this.selectQuestions[i].type == '单选题') {
                        this.single = this.single + 1;
                    } else if (this.selectQuestions[i].type == '多选题') {
                        this.multi = this.multi + 1;
                    } else if (this.selectQuestions[i].type == '判断题') {
                        this.judge = this.judge + 1;
                    }
                }
            },
        }
    }
</script>

<style>

</style>