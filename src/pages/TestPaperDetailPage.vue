<template>
    <div>
        <el-row style="padding: 12px 48px;padding-top: 48px;line-height: 48px;">
            <el-form labelWidth="160px">
                <el-form-item label="试卷名称">
                    <el-input v-model="questionSetCreate.name" placeholder="试卷名称" style="width: 350px;"></el-input>
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
                              style="width: 600px;" :rows="6"></el-input>
                </el-form-item>
            </el-form>

            <el-row style="margin-left: 48px;margin-right:48px; padding-bottom: 6px; border-bottom: solid 1px #f5f5f5;">
                <el-col :span="2"><span>试卷题目</span></el-col>
                <el-button type="primary" size="small"
                           style="float:right;margin-top: 4px;margin-right: 24px;"
                           @click="addSpecies">新增大题</el-button>
            </el-row>
            <el-dialog title="新增大题" :visible.sync="showSpeciesTable">
                <el-form :model="specie" style="margin-left: auto; margin-right: auto;">
                    <el-form-item label="题型" :label-width="formLabelWidth">
                        <el-col :span="8">
                            <el-select v-model="specie.type" placeholder="请选择题型">
                                <el-option label="单选题" value="1"></el-option>
                                <el-option label="多选题" value="2"></el-option>
                                <el-option label="判断题" value="3"></el-option>
                            </el-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="题数" :label-width="formLabelWidth">
                        <el-col :span="8">
                            <el-input v-model="specie.questionNum"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="每小题分值" :label-width="formLabelWidth">
                        <el-col :span="8">
                            <el-input v-model="specie.questionScore"></el-input>
                        </el-col>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addSpeciesCancel">取 消</el-button>
                    <el-button type="primary" @click="addSpeciesOk">确 定</el-button>
                </div>
            </el-dialog>
            <div style="padding: 12px 24px; " v-if="questionSetCreate.species.length != 0">
                <el-card v-for="speciesBo in questionSetCreate.species" class="box-card" style="margin-bottom: 24px;">
                    <div slot="header">
                        <span style="line-height: 36px;">{{convertQuestionType(speciesBo.type)}}</span>
                        <span style="font-size: 12px;color: blue">
                            共<span style="color: red;font-weight: bold;font-size: 15px;"> {{speciesBo.speciesScore}} </span>分;
                            共<span style="color: red;font-weight: bold;font-size: 15px;"> {{speciesBo.questionNum}} </span>题;
                            <span v-if="speciesBo.type == 1">已添加
                                <span style="color: red;font-weight: bold;font-size: 15px;">{{single}}</span>题
                            </span>
                            <span v-if="speciesBo.type == 2">已添加
                                <span style="color: red;font-weight: bold;font-size: 15px;">{{multi}}</span>题
                            </span>
                            <span v-if="speciesBo.type == 3">已添加
                                <span style="color: red;font-weight: bold;font-size: 15px;">{{judge}}</span>题
                            </span>
                        </span>
                        <el-button style="float: right;" type="primary"
                                   @click="deletedSpecies(speciesBo.type)">删除
                        </el-button>
                        <el-button style="float: right;margin: 0 3px 0 3px" type="primary"
                                   @click="showQuestionsTable(speciesBo.type,speciesBo.speciesId)">添加题目
                        </el-button>
                    </div>
                    <div v-if="speciesBo.type == 1">
                        <el-table
                                :data="getQuestionBos(1)"
                                border
                                tooltip-effect="dark"
                                style="width: 100%">
                            <el-table-column
                                    prop="statement"
                                    label="题目"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="type"
                                    width="100"
                                    label="类型">
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                                    width="100">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="small"
                                               @click="deletedQuestion(scope.row)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div v-if="speciesBo.type == 2">
                        <el-table
                                :data="getQuestionBos(2)"
                                border
                                tooltip-effect="dark"
                                style="width: 100%">
                            <el-table-column
                                    prop="statement"
                                    label="题目"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="type"
                                    width="100"
                                    label="类型">
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                                    width="100">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="small"
                                               @click="deletedQuestion(scope.row)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div v-if="speciesBo.type == 3">
                        <el-table
                                :data="getQuestionBos(3)"
                                border
                                tooltip-effect="dark"
                                style="width: 100%">
                            <el-table-column
                                    prop="statement"
                                    label="题目"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="type"
                                    width="100"
                                    label="类型">
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                                    width="100">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="small"
                                               @click="deletedQuestion(scope.row)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </div>
            <div style="padding: 12px 24px; height: 80px;vertical-align: middle;text-align: center;" v-else>
                <span>没有任何题目</span>
            </div>
        </el-row>

        <el-dialog title="添加题目" :visible.sync="showTable">
            <el-row style="line-height: 48px;">
                <span style="vertical-align: middle;">来源</span>
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
                    :data="refQuestions"
                    border
                    tooltip-effect="dark"
                    style="width: 100%">
                <el-table-column
                        prop="statement"
                        label="题目"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="type"
                        width="100"
                        label="类型">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button v-if="refQuestions.length > 1" type="primary" size="small"
                                   @click="addQuestion(scope.$index, scope.row)">添加
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
        <div v-if="saveButton">
            <el-button type="primary" @click="createQuestionSet"
                       style="display: block; margin-right: auto; margin-left: auto;">{{saveButtonMsg}}
            </el-button>
        </div>
        <div v-if="updateButton">
            <el-button type="primary" @click="updateQuestionSet"
                       style="display: block; margin-right: auto; margin-left: auto;">编辑
            </el-button>
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
                    questionNum:0,
                    totalScore:0,
                    tags: null,
                    descriptions: null,
                    species: [],
                    questions: [],
                },
                showTable: false,
                refQuestionType: null,
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
                saveButton: true,
                saveButtonMsg: '创建',
                updateButton: false,
                questionType: null,
                action: 3,
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
                showSpeciesTable: false,
                specie: {},
                formLabelWidth: '120px',
                singleQuestionBos: [],
                multiQuestionBos: [],
                judgeQuestionBos: [],
            }
        },
        created: function () {
            this.questionSetCreate.questionSetId = this.$route.params.questionSetId;
            if (this.questionSetCreate.questionSetId != null && this.questionSetCreate.questionSetId.length > 0) {
                this.updateQuestionSet();
            }
        },
        methods: {
            createQuestionSet: function () {
                if (this.questionSetCreate.name==null || this.questionSetCreate.name.trim().length < 1){
                    alert("请输入试卷名称");
                    return;
                }
                var verifyResult = this.verifyQuestionNum();
                if (verifyResult == false) {
                    return;
                }
                var that = this;
                if (that.questionSetCreate.questionSetId == null) {
                    that.questionSetCreate.questionSetId = 'temp';
                }
                that.questionSetCreate.type = 2;
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
                that.saveButtonMsg = '保存';
                that.single = 0;
                that.multi = 0;
                that.judge = 0;

                axios.get(Config.URL_BASE + '/test_paper/' + that.questionSetCreate.questionSetId).then(function (response) {
                    that.questionSetCreate = null;
                    that.questionSetCreate = response.data.data;

                    for (var i = 0; i < that.questionSetCreate.questions.length; i++) {
                        if (that.questionSetCreate.questions[i].type == 1) {
                            that.questionSetCreate.questions[i].type = '单选题';
                            that.single += 1;
                        } else if (that.questionSetCreate.questions[i].type == 2) {
                            that.questionSetCreate.questions[i].type = '多选题';
                            that.multi += 1;
                        } else if (that.questionSetCreate.questions[i].type == 3) {
                            that.questionSetCreate.questions[i].type = '判断题';
                            that.judge += 1;
                        }
                    }
                    that.speciesTypeQuestionBo(that.questionSetCreate.questions);
                });

            },
            showQuestionsTable: function (type, speciesId) {
                this.showTable = true;
                this.refQuestionType = type;
                this.getQuestions(speciesId);
            },
            getQuestions: function (type, speciesId) {
                var that = this;
                axios.get(Config.URL_BASE + '/question/user', {
                    params: {
                        'page': this.currentPage - 1, 'size': this.pageSize, 'action': this.action,
                        'type': this.refQuestionType, 'search': this.searchText
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
                        that.refQuestions[i].speciesId = speciesId;
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
                for (var i = 0; this.questionSetCreate.species.length; i++) {
                    if (this.convertQuestionType(this.questionSetCreate.species[i].type) == row.type) {
                        questionBo.speciesId = this.questionSetCreate.species[i].speciesId;
                        questionBo.score = this.questionSetCreate.species[i].questionScore;
                        break;
                    }
                }
                this.questionSetCreate.questions.push(questionBo);
                if (row.type == '单选题') {
                    this.single = this.single + 1;
                } else if (row.type == '多选题') {
                    this.multi = this.multi + 1;
                } else if (row.type == '判断题') {
                    this.judge = this.judge + 1;
                }
                this.speciesTypeQuestionBo();
            },
            addSpecies: function () {
                this.showSpeciesTable = true;
            },
            addSpeciesCancel: function () {
                this.showSpeciesTable = false;
            },
            addSpeciesOk: function () {
                if (this.specie.type == undefined || this.specie.questionNum.length == 0){
                    this.specie.type = undefined;
                    alert('大题类型不能为空');
                    return;
                }
                if (this.specie.questionNum == undefined || this.specie.questionNum.length == 0){
                    this.specie.questionNum = undefined;
                    alert('题数不能为空');
                    return;
                }
                if (this.specie.questionScore == undefined || this.specie.questionScore.length == 0){
                    this.specie.questionScore = undefined;
                    alert('小题分数不能为空');
                    return;
                }
                this.showSpeciesTable = false;
                var speciesBo = {};
                speciesBo.questionNum = this.specie.questionNum;
                speciesBo.type = this.specie.type;
                speciesBo.speciesIndex = this.questionSetCreate.species.length + 1;
                speciesBo.speciesId = 'temp' + new Date().getTime().toString();
                speciesBo.speciesScore = this.specie.questionScore * this.specie.questionNum;
                speciesBo.questionScore = this.specie.questionScore;
                this.questionSetCreate.species.push(speciesBo);
                this.questionSetCreate.totalScore += this.specie.questionScore * this.specie.questionNum;
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
                        this.speciesTypeQuestionBo();
                    }
                }
            },
            deletedSpecies: function (type) {
                for (var i = 0; i < this.questionSetCreate.species.length; i++) {
                    if (this.questionSetCreate.species[i].type == type) {
                        this.questionSetCreate.species.splice(i, 1);
                        for (var j = 0; j < this.questionSetCreate.questions.length; j++) {
                            if (this.questionSetCreate.questions[j] == this.convertQuestionType(type)) {
                                this.questionSetCreate.questions.splice(j, 1);
                            }
                        }
                        return;
                    }
                }
            },
            verifyQuestionNum: function () {
                var singleCount = 0;
                var multiCount = 0;
                var judgeCount = 0;
                for (var i = 0; i < this.questionSetCreate.questions.length; i++) {
                    if (this.questionSetCreate.questions[i].type == '单选题') {
                        singleCount = singleCount + 1;
                    }
                    if (this.questionSetCreate.questions[i].type == '多选题') {
                        multiCount = multiCount + 1;
                    }
                    if (this.questionSetCreate.questions[i].type == '判断题') {
                        judgeCount = judgeCount + 1;
                    }
                }
                var single = this.judgeCount('单选题', singleCount);
                var multi = this.judgeCount('多选题', multiCount);
                var judge = this.judgeCount('判断题', judgeCount);
                if (single == false || multi == false || judge == false) {
                    return false;
                }
                this.questionSetCreate.questionNum = singleCount + multiCount + judgeCount;
            },
            judgeCount: function (type, num) {
                for (var i = 0; i < this.questionSetCreate.species.length; i++) {
                    if (this.convertQuestionType(this.questionSetCreate.species[i].type) == type) {
                        if (this.questionSetCreate.species[i].questionNum < num) {
                            alert(this.convertQuestionType(type) + '数量过多,设置题数为 ' + this.questionSetCreate.species[i].questionNum);
                            return false;
                        } else if (this.questionSetCreate.species[i].questionNum > num) {
                            alert(this.convertQuestionType(type) + '数量过少，设置题数为 ' + this.questionSetCreate.species[i].questionNum);
                            return false;
                        }
                    }
                }
            },
            getQuestionBos: function (type) {
                switch (type) {
                    case 1:
                        return this.singleQuestionBos;
                    case 2:
                        return this.multiQuestionBos;
                    case 3:
                        return this.judgeQuestionBos;
                    default:
                        return 0;
                }
            },
            speciesTypeQuestionBo: function (updateQuestions) {
                if (updateQuestions != null) {
                    this.questionSetCreate.questions = updateQuestions;
                }
                this.singleQuestionBos = [];
                this.multiQuestionBos = [];
                this.judgeQuestionBos = [];
                for (var i = 0; i < this.questionSetCreate.questions.length; i++) {
                    if (this.questionSetCreate.questions[i].type == '单选题') {
                        this.singleQuestionBos.push(this.questionSetCreate.questions[i]);
                    } else if (this.questionSetCreate.questions[i].type == '多选题') {
                        this.multiQuestionBos.push(this.questionSetCreate.questions[i]);
                    } else if (this.questionSetCreate.questions[i].type == '判断题') {
                        this.judgeQuestionBos.push(this.questionSetCreate.questions[i]);
                    }
                }
            },
            convertQuestionType(type) {
                switch (type) {
                    case '1':
                        return "单选题";
                    case '2':
                        return "多选题";
                    case '3':
                        return "判断题";
                    case 1:
                        return "单选题";
                    case 2:
                        return "多选题";
                    case 3:
                        return "判断题";
                    case '单选题':
                        return "单选题";
                    case '多选题':
                        return "多选题";
                    case '判断题':
                        return "判断题";
                    default:
                        return "未知题型"
                }
            },
            currentQuestions(type) {
                switch (type) {
                    case '1':
                        return this.single;
                    case '2':
                        return this.multi;
                    case '3':
                        return this.judge;
                    default:
                        return 0
                }
            },
        }
    }
</script>

<style>

</style>