<template>
    <div>
        <el-row style="padding: 12px 48px; padding-top:48px;line-height: 48px;">
            <el-radio-group v-model="type" size="mini" @change="questionSetByType" style="vertical-align: middle;">
                <el-radio label="">全部</el-radio>
                <el-radio label="1">题集</el-radio>
                <el-radio label="2">试卷</el-radio>
            </el-radio-group>
            <el-input placeholder="关键字" size="small" v-model="queryKeyword" style="width: 200px;float:right;margin-top: 8px;" class="input-with-select">
                <el-button slot="append" icon="search" @click="wordSearch"></el-button>
            </el-input>
        </el-row>

        <el-row style="padding: 12px 48px;">
            <el-table :data="questionSets" style="width: 100%">
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="creatorName" label="创建人" width="100"></el-table-column>
                <el-table-column prop="type" label="类型" width="100"></el-table-column>
                <el-table-column prop="isPublic" width="100" label="状态"></el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <router-link :to="{name:getUrl(scope.row),params:{'questionSetId':scope.row.questionSetId}}">
                            <i class="el-icon-edit" style="color: #1f2d3d;"></i>
                        </router-link>
                        <i class="el-icon-delete" @click="deleteQuestionSet(scope.row)" style="margin-left: 16px;"></i>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row style="padding:12px 48px;">
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
                type: '',
                questionSets: [],
                currentPage: 1,
                pageSize: 10,
                total: 0,
                queryKeyword: null
            }
        },
        created: function () {
            this.getQuestionSets();
        },
        methods: {
            getQuestionSets: function () {
                var that = this;
                axios.get(Config.URL_BASE + '/test_paper/list', {
                    params: {
                        'type': this.type,
                        'pageIndex': this.currentPage - 1,
                        'pageSize': this.pageSize,
                        'search': this.queryKeyword,
                    }
                }).then(function (response) {
                    that.questionSets = response.data.data.items;
                    that.total = response.data.data.total;
                    for (var i = 0; i < that.questionSets.length; i++) {
                        if (that.questionSets[i].type == 1) {
                            that.questionSets[i].type = '题集';
                        } else if (that.questionSets[i].type == 2) {
                            that.questionSets[i].type = '试卷';
                        }
                        if (that.questionSets[i].isPublic == true) {
                            that.questionSets[i].isPublic = '已公开';
                        } else if (that.questionSets[i].isPublic == false) {
                            that.questionSets[i].isPublic = '未公开';
                        }
                    }
                })
            },
            getUrl:function (row) {
                if (row.type == '题集'){
                    return 'question_set';
                }else if(row.type == '试卷'){
                    return 'test_paper_detail';
                }
            },
            questionSetByType: function () {
                this.getQuestionSets();
            },
            pageSizeChange: function (val) {
                this.pageSize = val;
                this.getQuestionSets();
            },
            currPageChange: function () {
                this.getQuestionSets();
            },
            wordSearch: function () {
                this.getQuestionSets();
            },
            deleteQuestionSet:function (row) {
                var that = this;
                axios.delete(Config.URL_BASE + '/test_paper/' + row.questionSetId).then(function (response) {
                    if (response.data.retCode == 1) {
                        that.displayMessage(response.data.retCode, response.data.message);
                        that.getQuestionSets();
                    } else {
                        alert(response.data.message);
                    }
                }).catch(function (e) {
                    alert(e);
                })
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
    
        }
    }
</script>