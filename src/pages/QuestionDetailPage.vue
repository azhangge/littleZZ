<template>
    <div style="background-color: white; margin-top: 20px;">
        <el-row style="margin-bottom: 20px;padding-top: 48px;">
            <el-col :span="4" :offset='2'>
                <span style="font-size: 24px;">创建题目</span>
            </el-col>
            <el-col :span="2" :offset='16' v-if="opType == 1">
                <el-button type="primary" size="small" @click="changeOp">编辑</el-button>
            </el-col>
            <el-col  :span="2" :offset='16' v-else>
                <el-button type="primary" size="small" @click="changeOp">查看</el-button>
            </el-col>
        </el-row>
        <el-form label-width="160px">
            <el-form-item label="题型">
                <el-select placeholder="请选择题型" v-model="question.type" @change="changeType" :disabled="isDisableTypeChange">
                    <el-option label="单选题" :value="1"></el-option>
                    <el-option label="多选题" :value="2"></el-option>
                    <el-option label="判断题" :value="3"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="是否公开">
                <el-radio-group v-model="question.isPublic" >
                    <el-radio :label="1" >公开</el-radio>
                    <el-radio :label="2" >不公开</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="类别">
                <el-cascader
                        expand-trigger="hover"
                        :options="categoryDict"
                        :props="categoryDictMap"
                        v-model="currCategory">
                </el-cascader>
            </el-form-item>

            <el-form-item label="标签">
                <el-tag v-for="value in tags" :closable="true" :close-transition="false" @close="handleDelTag(value)">{{ value }}</el-tag>
                <el-input v-if="isAddingTag" v-model="newTag" ref="addTagInput" size="mini"
                          @keyup.enter.native="handleAddTag" @blur="handleAddTag"></el-input>
                <el-button v-else  size="small" @click="showTagInput">+ 添加新标签</el-button>
            </el-form-item>
        </el-form>

        <component :is="qdetailview" ref="qdetailview" :qcontent="question" :op-type="opType"></component>

        <el-col :offset='11' :span="2">
            <el-button type="primary" v-if="opType == 2" @click="save">保存</el-button>
        </el-col>
    </div>
</template>

<script>
    import axios from "axios";
    import QuestionSingleChoice from '../components/question/QuestionSingleChoice.vue';
    import QuestionMultiChoice from '../components/question/QuestionMultiChoice.vue';
    import QuestionJudge from '../components/question/QuestionJudge.vue';
    import ElCol from "element-ui/lib/col";
    import ElButton from "../../node_modules/element-ui/lib/button";
    import UserData from "../userdata";
    import Config from "../config";

    axios.defaults.headers.common['Authorization'] = UserData.token;

    export default {
        props :['id'],
        components : {
            ElButton,
            ElCol,
            QuestionSingleChoice,
            QuestionMultiChoice,
            QuestionJudge
        },
        data : function(){
            return {
                question: {},
                tags:[],
                newTag : '',

                categoryDictMap:{
                    value:'courseCategoryId',
                    label:'name'
                },
                categoryDict:[],
                currCategory:[],

                qdetailview : null,
                opType : 1, //1 查看，2 编辑，3 答题

                isAddingTag : false,
                isAddQuestion : this.id == null ? true : false,
            }
        },
        created : function () {
            this.loadData();
            if(this.$route.params.questionId == null){
                this.addNewQuestion();
            }else{
                this.updateQuestion();
            }
        },
        methods : {
            loadData:function () {
                var that = this;
                axios.get(Config.URL_BASE + '/course_category/tree')
                    .then(function (response) {
                        console.log(response);
                        if (response.data != null && response.data.data != null) {
                            that.categoryDict = response.data.data;
                            //todo 将category转换成element ui需要的格式
                            console.log(that.categoryDict);
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            },
            handleAddTag() {
                let newTag = this.newTag;
                if (newTag) {
                    this.tags.push(this.newTag);
                }
                this.isAddingTag = false;
                this.newTag = '';
            },
            handleDelTag(value, event){
                this.tags.splice(this.tags.indexOf(value), 1);
            },
            showTagInput() {
                this.isAddingTag = true;
                this.$nextTick(() => {this.$refs.addTagInput.$refs.input.focus();});
            },
            changeType(type){
                var view = this.buildContentView(type);
                this.qdetailview = view;
            },
            changeOp() {
                if (this.opType == 1){
                    this.opType = 2;
                } else {
                    this.opType = 1;
                }
            },
            save() {
                if (this.$refs.qdetailview){
                    var that = this;
                    var q = this.$refs.qdetailview.getQ();
                    this.question = Object.assign({}, this.question, q);
                    if (this.currCategory != null) {
                        if (null != this.currCategory[0]) {
                            this.question.mainCategoryId = this.currCategory[0];
                        }
                        if (null != this.currCategory[1]) {
                            this.question.subCategoryId = this.currCategory[1];
                        }
                    }
                    if(this.verify() == false){
                        return;
                    }
                    this.question.tags = this.tags.join("_");

                    this.opType = 1;

                    axios.post(Config.URL_BASE + '/question/' ,this.question)
                        .then(function (response) {
                            if (response.data != null) {
                                that.displayMessage(response.data.retCode, response.data.message);
                            }
                            console.log(response);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            },
            buildContentView(type) {
                switch (type) {
                    case 1:
                        return QuestionSingleChoice;
                    case 2:
                        return QuestionMultiChoice;
                    case 3:
                        return QuestionJudge;
                    default:
                        return null;
                }
            },
            addNewQuestion(){
                this.isAddQuestion = true;
                this.opType = '2';
                this.question = this.buildQuestion();
                this.qdetailview = null;
                this.tags = [];
            },
            buildQuestion(){
                return {
                    questionId: null,
                    type: null,
                    mainCategoryId: null,
                    subCategoryId: null,
                    isPublic: 1,
                    tags: "",
                    parentId: null,
                    subIndex: null,
                    statement: null,
                    answer: null,
                    analysis: '无',
                    contextA: null,
                    contextB: null,
                    contextC: null,
                    contextD: null,
                };
            },
            updateQuestion: function () {
                var that = this;
                that.opType = 2;

                axios.get(Config.URL_BASE + '/question/' + that.$route.params.questionId).then(function (response) {
                    that.question = response.data.data;
                    that.currCategory = [that.question.mainCategoryId,that.question.subCategoryId];
                });
            },
            initTags(tagStr){
                if (tagStr == null || tagStr == '') {
                    this.tags = [];
                    return;
                }

                this.tags = tagStr.split('_');
            },
            displayMessage:function (retCode, message) {
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
            verify: function () {
                if (this.question.type == null) {
                    alert("请选择题型");
                    return false;
                }
                if (this.currCategory == null) {
                    alert("请选择分类");
                    return false;
                }
                if (this.question.statement == null || this.question.statement.trim().length < 1) {
                    alert("请输入题干");
                    return false;
                }
                if (this.question.contextA == null && this.question.contextB == null && this.question.contextC == null && this.question.contextD == null) {
                    alert("选择不能同时为空");
                    return false;
                }
                if (this.question.answer == null) {
                    alert("请设置正确答案");
                    return false;
                }
            }
        },

        computed : {
            isDisableTypeChange:function () {
                return !this.isAddQuestion;
            }
        },
    }
</script>

<style>

</style>