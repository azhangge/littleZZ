<template>
    <div>
        <el-row style="padding: 12px 48px;padding-top: 48px;line-height: 48px;">
            <el-radio-group v-model="resourceType" @change="adpromptByType"  style="vertical-align: middle;">
                <el-radio label="">全部</el-radio>
                <el-radio label="1">课程</el-radio>
                <el-radio label="2">通知</el-radio>
            </el-radio-group>
            <el-input placeholder="轮播图名称" v-model="queryKeyword" class="input-with-select" size="small" style="width: 200px;float:right;margin-top: 8px;">
                <el-button slot="append" icon="search" @click="wordSearch"></el-button>
            </el-input>
        </el-row>
        <el-row style="padding: 12px 48px;">
            <el-table :data="adprompts" style="width: 100%">
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="type" label="类型" width="100"></el-table-column>
                <el-table-column prop="adIndex" label="顺序" width="100"></el-table-column>
                <el-table-column prop="isValid" label="是否有效" width="100"></el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <router-link :to="{name:'ad_prompt_detail',params:{'adPromptId':scope.row.adPromptId}}">
                            <i class="el-icon-edit" style="color: #1f2d3d;"></i>
                        </router-link>
                        <i class="el-icon-delete" @click="deleteAdprompt(scope.row)" style="margin-left: 16px;"></i>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row style="padding: 12px 48px;">
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
    import axios from "axios";
    import ElCol from "element-ui/lib/col";
    import ElForm from "element-ui/lib/form";
    import ElFormItem from "element-ui/lib/form-item";
    import ElSelect from "element-ui/lib/select";
    import ElInput from "element-ui/lib/input";
    import ElUpload from "element-ui/lib/upload";
    import ElRadioGroup from "element-ui/lib/radio-group";
    import ElRadio from "element-ui/lib/radio";
    import ElCascader from "element-ui/lib/cascader";
    import ElButton from "element-ui/lib/button";
    import ElTabs from "element-ui/lib/tabs";
    import ElTable from "element-ui/lib/table";
    import ElRow from "element-ui/lib/row";
    import ElTabPane from "element-ui/lib/tab-pane";
    import UserData from "../../userdata"
    import Config from "../../config"

    export default {
        components: {
            ElRadioGroup,
            ElRadio,
            ElRow
        },
        data: function () {
            return {
                adprompts: [],
                currentPage: 1,
                pageSize: 10,
                total: 0,
                queryKeyword: null,
                resourceType:''
            }
        },
        created: function () {
            this.getAdprompts();
        },
        methods: {
            getAdprompts: function () {
                var that = this;
                axios.get(Config.URL_BASE + '/ad/getAdPromps', {
                    params: {
                        'resourceType': this.resourceType,
                        'pageIndex': this.currentPage - 1,
                        'pageSize': this.pageSize,
                        'search': this.queryKeyword,
                    }
                }).then(function (response) {
                    that.adprompts = response.data.data.items;
                    that.total = response.data.data.total;
                    for (var i = 0; i < that.adprompts.length; i++) {
                        if (that.adprompts[i].resourceType == 1) {
                            that.adprompts[i].type = '课程';
                        } else if (that.adprompts[i].resourceType == 2) {
                            that.adprompts[i].type = '考试通知';
                        }
                        if (that.adprompts[i].isValid == true) {
                            that.adprompts[i].isValid = '是';
                        } else if (that.adprompts[i].isValid == false) {
                            that.adprompts[i].isValid = '否';
                        }
                    }
                })
            },
            wordSearch: function () {
                this.getAdprompts();
            },
            adpromptByType: function () {
                this.getAdprompts();
            },
            pageSizeChange: function (val) {
                this.pageSize = val;
                this.getAdprompts();
            },
            currPageChange: function () {
                this.getAdprompts();
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
            deleteAdprompt: function (row) {
                var that = this;
                axios.delete(Config.URL_BASE + '/ad/'+row.adPromptId ).then(function (response) {
                    if (response.data.retCode == 1) {
                        that.displayMessage(response.data.retCode, response.data.message);
                        that.getAdprompts();
                    } else {
                        alert(response.data.message);
                    }
                }).catch(function (e) {
                    alert(e);
                })
            }
        }
    }

</script>
