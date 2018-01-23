<template>
        <el-row>
            <el-col :span="18" :offset="1" style="background-color: white;margin-top: 30px;">
                <el-form :model="adPromptInfo" label-width="100px">

                    <el-form-item label="图片名称">
                        <el-col :span="16">
                            <el-input v-model="adPromptInfo.name"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="资源类型">
                        <el-select v-model="adPromptInfo.resourceType" placeholder="请选择" @change="resourceTypeChange">
                            <el-option label="课程" :value="1"></el-option>
                            <el-option label="考试通知" :value="2"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="资源">
                        <el-input v-model="resourceName" :disabled="true" size="small"></el-input>
                        <el-button @click="showResourceTable" style="float: inherit;">选择资源</el-button>

                        <el-dialog title="添加资源" :visible.sync="showTable">
                            <el-row style="padding-bottom: 12px;">
                                <el-input
                                        placeholder="搜索"
                                        icon="search"
                                        v-model="searchText"
                                        size="small"
                                        style="float: right;width: 200px;"
                                        :on-icon-click="handleSearch">
                                </el-input>
                            </el-row>
                            <el-table
                                    :data="resourceSets"
                                    border
                                    tooltip-effect="dark"
                                    style="width: 100%">
                                <el-table-column
                                        prop="resourceName"
                                        label="资源"
                                        show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                        label="操作"
                                        width="100">
                                    <template slot-scope="scope">
                                        <el-button v-if="resourceSets.length > 0" type="primary" size="small"
                                                   @click="addResource(scope.$index, scope.row)">添加
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

                    <el-form-item label="排序">
                        <el-col :span="23">
                            <el-input type="number" min v-model="adPromptInfo.adIndex" min="1"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="是否有效">
                        <el-select v-model="adPromptInfo.isValid" placeholder="请选择">
                            <el-option
                                    v-for="item in validTypeList"
                                    :key="item.validType"
                                    :label="item.validTypeName"
                                    :value="item.validType">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="背景色">
                        <el-input type="color" v-model="adPromptInfo.bgColor" value="#ffffff"></el-input>
                    </el-form-item>

                    <el-form-item label="简介">
                        <el-col :span="23">
                            <el-input type='textarea' :rows="5" placeholder="请输入课程简介" v-model="adPromptInfo.descriptions"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="web端轮播图">
                        <el-upload
                                class="avatar-uploader"
                                :action="uploadUrl"
                                :show-file-list="false"
                                :on-success="handleWebAdImgSuccess"
                                :before-upload="beforeWebAdImgUpload">
                            <img v-if="adPromptInfo.webAdImgId != null && adPromptInfo.webAdImgId !=  ''"
                                 :src="adPromptInfo.webAdImgPath" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="手机端轮播图">
                        <el-upload
                                class="avatar-uploader"
                                :action="uploadUrl"
                                :show-file-list="false"
                                :on-success="handleMobilAdImgSuccess"
                                :before-upload="beforeMobilAdImgUpload">
                            <img v-if="adPromptInfo.mobilAdImgId != null && adPromptInfo.mobilAdImgId !=  ''"
                                 :src="adPromptInfo.mobilAdImgPath" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>

                </el-form>
            </el-col>
            <el-col style="text-align: center">
                <el-button type="primary" @click="handleSave">保存</el-button>
            </el-col>
        </el-row>

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
    import ElButton from "element-ui/lib/button";
    import ElTabs from "element-ui/lib/tabs";
    import ElTable from "element-ui/lib/table";
    import ElRow from "element-ui/lib/row";
    import ElTabPane from "element-ui/lib/tab-pane";
    import UserData from "../../userdata"
    import Config from "../../config"

    axios.defaults.headers.common['Authorization'] = UserData.token;


    const G_ID_PREFIX = "temp";
    let G_ID = 2000;

    export default {
        components: {
            ElTabPane,
            ElRow,
            ElTable,
            ElTabs,
            ElButton,
            ElRadio,
            ElRadioGroup,
            ElUpload,
            ElInput,
            ElSelect,
            ElFormItem,
            ElForm,
            ElCol,
        },
        data: function () {
            return {
                uploadUrl: Config.URL_BASE + '/fs/upload',
                validTypeList: [{
                    validType: true,
                    validTypeName: "生效",
                }, {
                    validType: false,
                    validTypeName: "失效",
                }],
                adPromptInfo: {
                    adPromptId:'',
                    name:'',
                    adIndex:'',
                    descriptions:'',
                    resourceId:'',
                    resourceType:'',
                    resourceUrl:'',
                    webAdImgId:'',
                    webAdImgPath:'',
                    mobilAdImgId:'',
                    mobilAdImgPath:'',
                    bgColor:'#fff',
                    isValid:''
                },
                resourceName:'',
                showTable:false,
                resourceSets: [
                    {
                        resourceId: '',
                        resourceName: '',
                        resourceType: ''
                    }
                ],
                currentPage: 1,
                pageSize: 10,
                total: 0,
                searchText:''
            }
        },
        created: function () {
            if(this.$route.params.adPromptId != null){
                this.adPromptInfo.adPromptId = this.$route.params.adPromptId;
                this.updateAdPrompt();
            }
        },
        methods: {
            beginApprove: function () {
                var that = this;
                var approveBo = Object.assign({}, this.approveInfo);
                axios.post(Config.URL_BASE + '/course/approve', approveBo)
                    .then(function (response) {
                        /*if (response.data != null) {
                            that.displayMessage(response.data.retCode, response.data.message);
                        }*/
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            showResourceTable: function () {
                var resourceType = this.adPromptInfo.resourceType
                if(!resourceType) {
                    alert("请先选择资源类型!");
                    return;
                }
                this.showTable = true;
                this.getResourceSet();
            },
            getResourceSet: function () {
                if(this.adPromptInfo.resourceType == 1) {
                    this. getCourses();
                } else {
                    this.getExamNotices();
                }
            },
            handleSearch: function () {
                this.getResourceSet();
            },

            pageSizeChange: function (val) {
                this.pageSize = val;
                this.getResourceSet();
            },
            currPageChange: function () {
                this.getResourceSet();
            },
            getCourses: function () {
                var that = this;

                axios.get(Config.URL_BASE + '/ad/getCourses', {
                    params: {
                        'pageIndex': this.currentPage - 1, 'pageSize': this.pageSize,
                        'isPublic':true, 'search': this.searchText, 'isOnShelves':true
                    }
                }).then(function (respose) {
                    that.resourceSets = respose.data.data.items;
                    that.total = respose.data.data.total;
                })
            },
            getExamNotices: function () {
                var that = this;

                axios.get(Config.URL_BASE + '/ad/getExamNotices', {
                    params: {
                        'pageIndex': this.currentPage - 1, 'pageSize': this.pageSize,
                        'isPublic':true, 'search': this.searchText, 'isPublish':true
                    }
                }).then(function (respose) {
                    that.resourceSets = respose.data.data.items;
                    that.total = respose.data.data.total;
                })
            },
            resourceTypeChange: function () {
                this.currentPage = 1;
            },
            handleSave: function () {
                var that = this;
                var adPromptBo = Object.assign({}, this.adPromptInfo);
                axios.post(Config.URL_BASE + '/ad', adPromptBo)
                    .then(function (response) {
                        that.displayMessage(response.data.retCode, response.data.message);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            addResource: function (index, row) {
                this.resourceName =  row.resourceName;
                this.showTable = false;
                this.adPromptInfo.resourceId = row.resourceId;
                this.adPromptInfo.resourceType = row.resourceType;
            },
            buildFsPath: function (group, path) {
                return Config.FS_SERVER_URL_BASE + "/" + group + "/" + path;
            },
            beforeWebAdImgUpload: function () {
                console.log('beforeThumbnailUpload!');
            },
            handleWebAdImgSuccess: function (response, file, fileList) {
                if (response.retCode == 1) {
                    var fileUrl = this.buildFsPath(response.data.storageGroup, response.data.storagePath);
                    this.adPromptInfo = Object.assign({}, this.adPromptInfo, {
                        webAdImgId: response.data.fileId,
                        webAdImgPath: fileUrl
                    });
                }
                console.log('handleWebAdImgSuccess!');
            },
            beforeMobilAdImgUpload: function () {
                console.log('beforeMobilAdImgUpload!');
            },
            handleMobilAdImgSuccess: function (response, file, fileList) {
                if (response.retCode == 1) {
                    var fileUrl = this.buildFsPath(response.data.storageGroup, response.data.storagePath);
                    this.adPromptInfo = Object.assign({}, this.adPromptInfo, {
                        mobilAdImgId: response.data.fileId,
                        mobilAdImgPath: fileUrl
                    });
                }
                console.log('handleMobilAdImgSuccess!');
            },
            updateAdPrompt: function () {
                var that = this;
                axios.get(Config.URL_BASE + '/ad/getAdPromp/' + that.$route.params.adPromptId).then(function (response) {
                    that.adPromptInfo = response.data.data;
                    that.resourceName = response.data.data.resourceName;
                    //that.currCategory = [that.question.mainCategoryId,that.question.subCategoryId];
                });
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
            }
        },
            computed: {
                editor() {
                    return this.$refs.myTextEditor.quillEditor;
                }
            }
        }

</script>

<style>
    .input-new-tag{width:78px; margin-left:10px; vertical-align:middle;}
    .button-new-tag{margin-left:10px;height:24px;line-height:22px;padding-top:0;padding-bottom:0;}

    .el-table .cell {padding: 0 12px;}

    .hj-table-cell-input {width:100%; height:28px;border-radius: 4px;border-width: 1px;}
    .hj-table-cell-input:hover, .hj-table-cell-input:focus {outline: 0;  border-color:#20a0ff;box-shadow: 0px;border-style:solid;}

     .avatar-uploader .el-upload {
         border: 1px dashed #d9d9d9;
         border-radius: 6px;
         cursor: pointer;
         position: relative;
         overflow: hidden;
     }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }


    .editor-example {
        border: 1px solid #ccc;
    }
    .ql-container .ql-editor {
        min-height: 20em;
        padding-bottom: 1em;
        max-height: 25em;
    }
    .html {
        height: 9em;
        overflow-y: auto;
        border: 1px solid #ccc;
        border-top: none;
        resize: vertical;
    }
</style>