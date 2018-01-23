<template>
    <div>
        <el-row style="padding: 12px 48px;padding-top: 48px;line-height: 48px;">
            <el-radio-group v-model="questionType" @change="questionByType" style="vertical-align: middle;">
                <el-radio label="">全部</el-radio>
                <el-radio label="1">单选题</el-radio>
                <el-radio label="2">多选题</el-radio>
                <el-radio label="3">判断题</el-radio>
            </el-radio-group>
            <el-button style="float: right;margin-top: 12px;" size="small" type="primary" @click="createQuestion">创建题目</el-button>
        </el-row>
        <el-row style="padding: 12px 48px;">
            <el-table :data="pageData" style="width: 100%">
                <el-table-column prop="statement" label="题干"></el-table-column>
                <el-table-column prop="type" label="题型" width="100"></el-table-column>
                <el-table-column
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <i class="el-icon-edit" style="color: #1f2d3d;" @click="modifyQuestion(scope.row)"></i>
                        <i class="el-icon-delete" @click="deleteQuestion(scope.row)" style="margin-left: 16px;"></i>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row  style="padding: 12px 48px;">
            <el-pagination
                    @size-change="handlePageSizeChange"
                    @current-change="handleCurrPageChange"
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
    import ElButton from "../../node_modules/element-ui/lib/button";

    export default {
        components: {
            ElRadioGroup,
            ElRadio,
            ElCheckbox,
            ElCheckboxGroup,
            ElRow,
            ElButton
        },
        data() {
            return {
                questionType: '',
                pageSize: 10,
                currentPage: 1,
                total: 0,
                pageData: [],

            }
        },
        created: function () {
            this.getQuestions();
        },
        methods: {
            getQuestions: function () {
                var that = this;
                axios.get(Config.URL_BASE + '/question/list', {
                    params: {'type': this.questionType, 'page': this.currentPage - 1, 'size': this.pageSize}
                }).then(function (respose) {

                    that.pageData = respose.data.data.items;
                    that.total = respose.data.data.total;
                    for (var i = 0; i < that.pageData.length; i++) {
                        if (that.pageData[i].type == 1) {
                            that.pageData[i].type = '单选题';
                        } else if (that.pageData[i].type == 2) {
                            that.pageData[i].type = '多选题';
                        } else if (that.pageData[i].type == 3) {
                            that.pageData[i].type = '判断题';
                        }
                    }
                })
            },
            questionByType: function () {
                this.getQuestions(this.questionType);
            },
            handlePageSizeChange(val) {
                this.pageSize = val;
                this.getQuestions();
            },
            handleCurrPageChange() {
                this.getQuestions();
            },
            modifyQuestion(row){
                this.$router.push({name:'gen_question',params:{questionId:row.questionId}});
            },
            createQuestion(){
                this.$router.push({name:'gen_question',params:null});
            },
            displayMessage(retCode, message) {
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
            deleteQuestion(row){
                var that = this;
                axios.delete(Config.URL_BASE + '/question/question/' + row.questionId)
                    .then(function (response) {
                        if (response.data != null) {
                            that.displayMessage(response.data.retCode, response.data.message);
                            that.getQuestions();
                        }
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    }

</script>

<style>
    .link-type,
    .link-type:focus {
        color: #337ab7;
        cursor: pointer;
    }

    link-type:hover {
        color: rgb(32, 160, 255);
    }
</style>