<template>
    <el-row>
        <el-row>
            <el-col :span="18" :offset="1" style="background-color: white;margin-top: 30px;">
                <el-form :model="courseBaseInfo" label-width="100px">
                    <el-form-item label="课程名称">
                        <el-col :span="16">
                            <el-input v-model="courseBaseInfo.courseName"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="是否公开">
                        <el-radio-group v-model="isPublic">
                            <el-radio label="1">公开</el-radio>
                            <el-radio label="2">非公开</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="课程类别">
                        <el-cascader
                                expand-trigger="hover"
                                :options="categoryDict"
                                :props="categoryDictMap"
                                v-model="currCategory">
                        </el-cascader>
                    </el-form-item>

                    <el-form-item label="起止时间">
                        <el-date-picker
                                v-model="courseTime"
                                type="daterange"
                                placeholder="选择日期范围"
                                value-format="yyyy-MM-dd"
                        >
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="讲师">
                        <el-col :span="16">
                            <el-select v-model="courseBaseInfo.teacherId" placeholder="请选择">
                                <el-option
                                        v-for="item in candidates"
                                        :key="item.teacherId"
                                        :label="item.teacherName"
                                        :value="item.teacherId">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="课时">
                        <el-col :span="8">
                            <el-input v-model="courseBaseInfo.classHour"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="课程简介">
                        <el-col :span="23">
                            <el-input type='textarea' :rows="5" placeholder="请输入课程简介" v-model="courseBaseInfo.descriptions"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="课程缩略图">
                        <el-upload
                                class="avatar-uploader"
                                :action="uploadUrl"
                                :show-file-list="false"
                                :on-success="handleThumbnailSuccess"
                                :before-upload="beforeThumbnailUpload">
                            <img v-if="courseBaseInfo.thumbnailId != null && courseBaseInfo.thumbnailId !=  ''"
                                 :src="courseBaseInfo.thumbnailPath" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="课程标签">
                        <el-tag
                                :key="tag"
                                v-for="tag in currTagArray"
                                :closable="true"
                                :close-transition="false"
                                @close="handleTagClose(tag)"
                                style="marginRight:10px;">
                            {{ tag }}
                        </el-tag>
                        <el-input
                                class="input-new-tag"
                                v-if="tagInputVisible"
                                v-model="tagValue"
                                ref="tagInput"
                                size="mini"
                                @keyup.enter.native="handleTagConfirm"
                                @blur="handleTagConfirm">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showTagInput">添加新标签</el-button>
                    </el-form-item>
                    <el-form-item label="附件">
                        <el-upload
                                class="upload-demo"
                                :action="uploadUrl"
                                :show-file-list="false"
                                :on-success="handleAttachmentSuccess"
                                :before-upload="beforeAttachmentSuccess">
                            <el-button size="small" type="primary">上传</el-button> {{attachmentName}}
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="练习">
                        <el-button size="small" type="primary" @click="openDialog">选择练习</el-button>
                        <span v-if="courseQuestionSetTemp2.length < 1">没有绑定任何习题集</span>
                        <el-table v-if="courseQuestionSetTemp2.length != 0"
                                :data="courseQuestionSetTemp2"
                                border
                                tooltip-effect="dark"
                                style="width: 100%">
                            <el-table-column
                                    prop="name"
                                    label="名称"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="totalScore"
                                    width="96"
                                    label="总分">
                            </el-table-column>
                            <el-table-column
                                    prop="questionNum"
                                    width="96"
                                    label="题数">
                            </el-table-column>
                            <el-table-column
                                    prop="creatorName"
                                    width="96"
                                    label="创建人">
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                                    width="72">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="small"
                                               @click="deletedQuestionSet(scope.row)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                    <el-form-item label="组织">
                        <el-button size="small" type="primary" @click="openOrgDialog">绑定组织</el-button>
                        <span v-if="courseBaseInfo.orgId.length<1">未绑定组织</span>
                        <sapn v-if="courseBaseInfo.orgId.length>0">{{courseBaseInfo.orgName}}</sapn>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-dialog title="设置课程所属组织" :visible.sync="showOrgDialog">
            <sapn v-if="courseBaseInfo.orgId.length > 0" style="font-weight: bold;padding-bottom: 5px">
                已选择:<span style="color: blue">{{courseBaseInfo.orgName}}</span>
            </sapn>
            <el-tree
                    :data="orgTree"
                    :props="defaultProps"
                    default-expand-all
                    :expand-on-click-node="true"
                    @node-click="handleNodeClick">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="orgNo">取 消</el-button>
                <el-button type="primary" @click="orgSelect" :disabled=orgOk>确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="添加习题集" :visible.sync="showTable">
            <el-row style="padding: 4px 12px;">
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
                        :data="refQuestionSet"
                        border
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column
                            prop="name"
                            label="名称"
                            current-row-key="questionSetId"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="totalScore"
                            label="总分"
                            width="100"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="questionNum"
                            label="题数"
                            width="100"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="creatorName"
                            label="创建人"
                            width="100"
                    >
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row>
                <el-col>
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
        <el-row style="border-top: solid 10px whitesmoke;padding-top: 20px;">
            <el-col  :offset="1" :span="22" v-if="chapterData.length == 0">
                <div style="border-bottom:  1px solid #d3dce6;padding-bottom: 8px;">
                    <span style="font-size: 24px;">课程章节</span>
                    <i class="el-icon-plus"
                       @click="handleAddChapter"
                       style="float: right; height: 18px;width: 18px;line-height: 18px;margin: 12px 0 9px 10px;border-radius: 3px;text-align: center;font-size: 12px;color: #d3dce6;cursor: pointer;border: 1px solid #d3dce6; color: #d3dce6;"></i>
                </div>
                <div style="min-height: 80px;padding: 16px 32px;">
                    还没有添加任何章节
                </div>
            </el-col>
            <el-col :offset="1" :span="22" v-else>
                <el-tabs v-model="currChapterId"
                         type="card"
                         editable
                         :addable=true
                         @edit="handleChapterTabsEdit"
                         @tab-click="handleClickChapter"
                         @tab-add="handleAddChapter"
                         @tab-remove="handleDelChapter">
                    <el-tab-pane
                            v-for="(chapterItem, index) in chapterData"
                            :label="'第' + chapterItem.chapterIndex + '章'"
                            :name="chapterItem.chapterId"
                            :key="chapterItem.chapterId"
                            :closable=true>
                        <el-form label-width="100px">
                            <el-form-item label="本章标题">
                                <el-col :span="16">
                                    <el-input v-model="chapterItem.name"></el-input>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="本章说明">
                                <el-col :span="20">
                                    <el-input type="textarea" :rows="5" v-model="chapterItem.descriptions"></el-input>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="小节" style="margin-bottom: 8px;">
                                <el-button type="primary" size="small"
                                           style="float:right;margin-top: 4px;margin-right: 24px;"
                                           @click="handleAddSection(chapterItem.chapterId)">添加小节</el-button>

                            </el-form-item>
                        </el-form>
                        <el-row style="margin: 0 64px;">
                            <el-table
                                    :data="chapterItem.children"
                                    border
                                    style="width: 100%"
                                    @current-change="handleSectionEdit">
                                <el-table-column label="序号" width="80">
                                    <template scope="scope">
                                    <span style="margin-left: 10px">
                                        {{ scope.row.chapterIndex }}
                                    </span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="名称" width="240">
                                    <template scope="scope">
                                        <input v-if='scope.row.chapterId==currSectionId' class="hj-table-cell-input"
                                               v-model="scope.row.name">
                                        <span v-else style="margin-left: 10px">
                                            {{ scope.row.name }}
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="说明" width="400">
                                    <template scope="scope">
                                        <input v-if='scope.row.chapterId==currSectionId' class="hj-table-cell-input"
                                               v-model="scope.row.descriptions">
                                        <span v-else style="margin-left: 10px">
                                            {{ scope.row.descriptions }}
                                    </span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="课时(分钟)" width="120">
                                    <template scope="scope">
                                        <input v-if='scope.row.chapterId==currSectionId' class="hj-table-cell-input"
                                               v-model="scope.row.second">
                                        <span v-else style="margin-left: 10px">
                                            {{ scope.row.second }}
                                    </span>
                                    </template>
                                </el-table-column>

                                <el-table-column label="课件" width="80">
                                    <template scope="scope">
                                    <span style="margin-left: 10px">
                                        {{ scope.row.resourceName }}
                                    </span>

                                        <el-upload
                                                class="upload-demo"
                                                :action="uploadUrl"
                                                :show-file-list="false"
                                                :on-success="handleUploadCoursewareSuccess"
                                                :before-upload="beforeUploadCourseware"
                                        >
                                            <el-button size="small" type="primary">点击上传</el-button>
                                        </el-upload>
                                    </template>
                                </el-table-column>

                                <el-table-column label="操作">
                                    <template scope="scope">
                                        <el-button size="small" type="danger"
                                                   @click="handleDeleteSection(scope.$index, scope.row)">删除
                                        </el-button>
                                    </template>
                                </el-table-column>

                            </el-table>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
        <el-row>
            <el-col v-if="courseBaseInfo.approveStatus==3 || courseBaseInfo.approveStatus==5 || courseBaseInfo.approveStatus==2" :span="23">
                <el-input type='textarea' :rows="5" placeholder="不通过理由" v-model="approveInfo.reason"></el-input>
            </el-col>
            <el-col :offset="10">
                <el-button v-if="!courseBaseInfo.approveStatus || courseBaseInfo.approveStatus==1 || courseBaseInfo.approveStatus==5" type="primary" @click="handleSave">保存</el-button>
                <el-button v-if="!courseBaseInfo.approveStatus || courseBaseInfo.approveStatus==1 || courseBaseInfo.approveStatus==5" type="primary" @click="handleSave">保存并提交审核</el-button>
                <el-button v-if="courseBaseInfo.approveStatus==1 || courseBaseInfo.approveStatus==5" type="primary" @click="submitApprove">提交审核</el-button>
                <el-button v-if="courseBaseInfo.approveStatus==3 || courseBaseInfo.approveStatus==2" type="primary" @click="approve('4')">通过</el-button>
                <el-button v-if="courseBaseInfo.approveStatus==3 || courseBaseInfo.approveStatus==2" type="primary" @click="approve('5')">不通过</el-button>
                <el-button v-if="courseBaseInfo.approveStatus==4 && courseBaseInfo.isOnShelves==0" type="primary" @click="shelve">上架</el-button>
                <el-button v-if="courseBaseInfo.approveStatus==4 && courseBaseInfo.isOnShelves==1" type="primary" @click="shelve">下架</el-button>
            </el-col>
        </el-row>
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
    import ElCascader from "element-ui/lib/cascader";
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
            ElCascader,
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
                categoryDictMap: {
                    value: 'courseCategoryId',
                    label: 'name'
                },
                categoryDict: [],
                currCategory: [],
                courseTime: [],

                isPublic: "1",

                currTagArray: [],
                tagValue: "",
                tagInputVisible: false,

                candidates: [{
                    teacherId: "402881de5f002bac015f00303de10002",
                    teacherName: "张三",
                }, {
                    teacherId: "2",
                    teacherName: "李四",
                }, {
                    teacherId: "3",
                    teacherName: "王五",
                }, {
                    teacherId: "4",
                    teacherName: "赵六",
                }],

                courseBaseInfo: {
                    courseId: null,
                    courseName: '',
                    thumbnailId: '',
                    thumbnailPath: "",
                    classHour:null,
                    mainCategoryId: '',
                    subCategoryId: '',
                    detailCategoryId: '',
                    descriptions: '',
                    startTime: null,
                    endTime: null,
                    teacherId: null,
                    teacherName: null,
                    tags: "",
                    isPublic: true,
                    isOnShelves: false,
                    approveStatus: "",
                    accessCount: 0,
                    courseSecond: 0,
                    score: 2,
                    creatorId: '',
                    creatorName: '',
                    modifierId: '',
                    modifyDate: null,
                    isWithRequest: false,
                    //修改chapters 和sections用到
                    deleteIds:[],
                    changeChapterBos:[],
                    courseQuestionSetBo:{
                        questionSetIds:[]
                    },
                    orgId:'',
                },
                approveInfo: {
                    courseId:'',
                    operate:'',//@ApiParam("4 同意，5 不同意 3开始审批")
                    reason:''
                },
                currChapterId: null,
                currSectionId: null,
                tabIndex: 0,
                chapterData: [],

                editorContent: '<h2>I am Example 1</h2>',
                editorOption: {},

                videoSrc: null,
                attachmentName:null,
                attachmentBo:{},
                showTable:false,
                searchText:null,
                refQuestionSet:[],
                pageSize:10,
                currentPage: 1,
                total:0,
                courseQuestionSetTemp1:[],
                courseQuestionSetTemp2:[],
                showOrgDialog:false,
                orgTree: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                orgOk:true,
            }
        },
        created: function () {
            this.loadCategory();
            var courseId = this.$route.params.courseId;
            if (courseId) {
                this.courseBaseInfo.courseId = courseId;
                this.approveInfo.courseId = courseId;
                this.updFormInit(courseId);
            }
            var approveStatus = this.$route.params.approveStatus;
            if (approveStatus==2) {
                this.approveInfo.operate = 3;//4 同意，5 不同意 3开始审批
                this.beginApprove();
            }
        },
        methods: {
            loadCategory: function () {
                var that = this;
                axios.get(Config.URL_BASE + '/course_category/tree')
                    .then(function (response) {
                        console.log(response);
                        if (response.data != null && response.data.data != null) {
                            that.categoryDict = response.data.data;
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            handleThumbnailSuccess: function (response, file, fileList) {
                if (response.retCode == 1) {
                    var fileUrl = this.buildFsPath(response.data.storageGroup, response.data.storagePath);
                    this.courseBaseInfo = Object.assign({}, this.courseBaseInfo, {
                        thumbnailId: response.data.fileId,
                        thumbnailPath: fileUrl
                    });
                }
                console.log('handleThumbnailSuccess!');
            },
            beforeThumbnailUpload: function () {
                console.log('beforeThumbnailUpload!');
            },
            handleUploadCoursewareSuccess: function (response, file, fileList) {
                if (response.retCode == 1) {
                    for (var i = 0; i < this.chapterData.length; i++) {
                        if (this.chapterData[i].chapterId != this.currChapterId) {
                            continue;
                        }

                        var sections = this.chapterData[i].children;

                        for (var j = 0; j < sections.length; j++) {
                            if (sections[j].chapterId != this.currSectionId) {
                                continue;
                            }
                            sections[j].resourceId = response.data.fileId;
                            sections[j].resourcePath = this.buildFsPath(response.data.storageGroup, response.data.storagePath);
                            sections[j].resourceName = response.data.fileName;
                            var suffix =  response.data.suffix;
                            if(suffix == "doc" || suffix == "docx") {
                                sections[j].resourceType = 5;
                            } else if(suffix == "ppt" || suffix == "pptx") {
                                sections[j].resourceType = 6;
                            } else if(suffix == "pdf") {
                                sections[j].resourceType = 4;
                            }

                            this.chapterData = [].concat(this.chapterData);
                            break;
                        }
                        break;
                    }
                }
                console.log('handleUploadCoursewareSuccess!');
            },
            buildFsPath: function (group, path) {
                return Config.FS_SERVER_URL_BASE + "/" + group + "/" + path;
            },
            beforeUploadCourseware: function (file) {
                console.log('beforeUploadCourseware!    chapterId ' + this.currChapterId + "  sectionId " + this.currSectionId);
            },
            handleAttachmentSuccess:function (response) {
                if (response.retCode == 1) {
                    this.attachmentName = response.data.fileName;
                    this.attachmentBo.courseAttachmentId = response.data.fileId;
                }
                console.log('handleAttachmentSuccess!');
            },
            beforeAttachmentSuccess:function () {
                console.log('beforeAttachmentSuccess!');
            },
            addAttachment:function () {
                axios.post(Config.URL_BASE + '/course/attachment', this.attachmentBo).then(function (response) {
                    if (response.data.retCode != 1){
                        alert("附件上传失败");
                    }
                })
            },
            handleTagClose: function (tag) {
                console.log('handleTagClose!');
            },
            handleTagConfirm: function () {
                var tagValue = this.tagValue;
                if (tagValue) {
                    this.currTagArray.push(tagValue);
                }
                this.tagInputVisible = false;
                this.tagValue = '';
                console.log('handleTagConfirm!');
            },
            showTagInput: function () {
                this.tagInputVisible = true;
            },
            handleAddChapter: function () {
                var chapter = this.genChapter();
                chapter.courseId = this.courseBaseInfo.courseId;
                chapter.chapterIndex = this.chapterData.length + 1;
                this.chapterData.push(chapter);

                this.currChapterId = chapter.chapterId;
            },
            handleDelChapter: function (name) {
                for (var i = 0; i < this.chapterData.length; i++) {
                    if (name == this.chapterData[i].chapterId) {

                        var isNeedReindex = (i == this.chapterData.length ? false : true);
                        this.currChapterId = null;
                        this.chapterData.splice(i, 1);
                        if (isNeedReindex) {
                            this.refreshIndex(this.chapterData);
                            this.chapterData = [].concat(this.chapterData);
                        }

                        break;
                    }
                }
              //  this.deletedIds.push(name);
            },
            handleClickChapter: function (tab) {
                console.log("tab");
            },
            handleChapterTabsEdit: function (targetName, action) {
            },
            handleDeleteSection: function (index, row) {
                console.log(index, row);
                var that = this;
                this.chapterData.forEach((chapter, idx) => {
                    if (chapter.chapterId !== row.parentId) {
                        return;
                    }

                    var isNeedReindex = (index == chapter.children.length ? false : true);
                    chapter.children.splice(index, 1);

                    if (isNeedReindex == true) {
                        that.refreshIndex(chapter.children);
                    }

                    that.currSectionId = "";
                    that.chapterData = [].concat(that.chapterData);
                });
                // this.deletedIds.push(row.chapterId);
            },
            handleAddSection: function (chapterId) {
                console.log(chapterId);
                var that = this;

                this.chapterData.forEach((chapter, index) => {
                    if (chapter.chapterId !== chapterId) {
                        return;
                    }

                    var section = that.genChapter();
                    section.chapterIndex = chapter.children.length + 1;
                    section.courseId = chapter.courseId;
                    section.parentId = chapter.chapterId;
                    chapter.children.push(section);
                    that.currSectionId = section.chapterId;

                });
            },
            handleSectionEdit: function (currentRow, oldCurrentRow) {
                if (currentRow == null) {
                    return;
                }

                this.currSectionId = currentRow.chapterId;
                console.log("this section id :"+this.currSectionId);
            },
            handleSave: function () {
                console.log('handleSave!');
                var that = this;

                this.courseBaseInfo.mainCategoryId = this.currCategory[0];
                this.courseBaseInfo.subCategoryId = this.currCategory[1];

                this.courseBaseInfo.tags = this.currTagArray.join("_");

                this.courseBaseInfo.isPublic = this.isPublic == "2" ? false : true;

                var courseBo = Object.assign({}, this.courseBaseInfo);
                courseBo.chapters = this.chapterData;

                if (this.isTemporaryId(courseBo.courseId)) {
                    courseBo.courseId = null;
                }

                courseBo.chapters.forEach((chapter) => {
                    if (that.isTemporaryId(chapter.chapterId)) {
                        chapter.chapterId = null;
                        chapter.courseId = courseBo.courseId;
                    }
                if(chapter.children)
                    chapter.children.forEach((section) => {
                        if (that.isTemporaryId(section.chapterId)) {
                            section.chapterId = null;
                            section.parentId = chapter.chapterId;
                            section.courseId = courseBo.courseId;
                        }
                    });
                });

                courseBo.startTime = formatDate(that.courseTime[0]);
                courseBo.endTime = formatDate(that.courseTime[1]);

                axios.post(Config.URL_BASE + '/course/noRequest', courseBo).then(function (response) {
                        if (response.data != null) {
                            that.displayMessage(response.data.retCode, response.data.message);
                            that.courseBaseInfo.approveStatus = 1;
                            that.courseBaseInfo.courseId = response.data.data.courseId;
                        }
                        console.log(response);
                        if (response.data.retCode == 1){
                            that.attachmentBo.courseId = response.data.data.courseId;
                            that.addAttachment();
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            handleSaveAndSubmitApprove: function () {
                var that = this;

                this.courseBaseInfo.mainCategoryId = this.currCategory[0];
                this.courseBaseInfo.subCategoryId = this.currCategory[1];

                this.courseBaseInfo.tags = this.currTagArray.join("_");

                this.courseBaseInfo.isPublic = this.isPublic == "2" ? false : true;

                var courseBo = Object.assign({}, this.courseBaseInfo);
                courseBo.chapters = this.chapterData;

                if (this.isTemporaryId(courseBo.courseId)) {
                    courseBo.courseId = null;
                }

                courseBo.chapters.forEach((chapter) => {
                    if (that.isTemporaryId(chapter.chapterId)) {
                        chapter.chapterId = null;
                        chapter.courseId = courseBo.courseId;
                    }
                    if(chapter.children)
                        chapter.children.forEach((section) => {
                            if (that.isTemporaryId(section.chapterId)) {
                                section.chapterId = null;
                                section.parentId = chapter.chapterId;
                                section.courseId = courseBo.courseId;
                            }
                        });
                });

                courseBo.startTime = formatDate(that.courseTime[0]);
                courseBo.endTime = formatDate(that.courseTime[1]);

                axios.post(Config.URL_BASE + '/course/isWithRequest', courseBo)
                    .then(function (response) {
                        if (response.data != null) {
                            that.displayMessage(response.data.retCode, response.data.message);
                            that.courseBaseInfo.approveStatus = 2;

                        }
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            genChapter: function () {
                var tmpId = G_ID_PREFIX + (G_ID++);
                return {
                    chapterId: tmpId,
                    courseId: null,
                    name: '',
                    descriptions: '',
                    tags: "",
                    second: 0,
                    chapterIndex: 0,
                    resourceId: "",
                    resourceType:"",
                    resourcePath: "",
                    resourceName: "",
                    parentId: '',
                    children: []
                }
            },
            refreshIndex: function (chapterArray) {
                for (var i = 0; i < chapterArray.length; i++) {
                    chapterArray[i].chapterIndex = i + 1;
                }
            },
            isTemporaryId: function (id) {
                return (id != null && id.indexOf(G_ID_PREFIX) > -1);
            },
            displayMessage: function (retCode, message) {
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
            getCourseQuestionSets:function (courseId) {
                var that = this;
                axios.get(Config.URL_BASE + '/course/questionSet/list', { params: {courseId:courseId} }).then(function (response) {
                    if (response.data.retCode == 1){
                        that.courseQuestionSetTemp1 = response.data.data;
                        that.courseBaseInfo.courseQuestionSetBo={};
                        that.courseBaseInfo.courseQuestionSetBo.questionSetIds = [];
                        for (var i=0;i<that.courseQuestionSetTemp1.length;i++){
                            that.courseBaseInfo.courseQuestionSetBo.questionSetIds.push(that.courseQuestionSetTemp1[i].questionSetId);
                        }
                        that.courseQuestionSetTemp2 = that.courseQuestionSetTemp1;
                    }
                })
            },
            updFormInit: function (courseId) {
                var that=this;
                axios.get(Config.URL_BASE + '/course/detail', { params: {courseId:courseId} })
                    .then(function (response) {
                       // console.log(response);
                        that.courseBaseInfo =  response.data.data;
                       that.currCategory = [that.courseBaseInfo.mainCategoryId, that.courseBaseInfo.subCategoryId]
                        console.log("~~~~~~~~: "+that.currCategory);
                        that.isPublic = that.courseBaseInfo.isPublic == true ? "1" : "2";
                        that.courseTime = [that.courseBaseInfo.startTime.substring(0,10), that.courseBaseInfo.endTime.substring(0.10)]
                        if(that.courseBaseInfo.tags)
                            that.currTagArray=that.courseBaseInfo.tags.split("_");

                        if(that.courseBaseInfo.chapters)
                        that.chapterData=that.courseBaseInfo.chapters;
                        that.attachmentName = response.data.data.courseAttachmentName;
                        that.attachmentBo.courseAttachmentId = response.data.data.courseAttachmentId;
                        that.getCourseQuestionSets(courseId);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
//                that.currCategory[0]="1000001";
//                that.currCategory[1]="1000003";
            },
            submitApprove: function() {//提交审核
                var that = this;
                var courseId = that.courseBaseInfo.courseId;

                axios.get(Config.URL_BASE + '/course/submitApprove', { params: {courseId:courseId} })
                    .then(function (response) {

                        that.courseBaseInfo.approveStatus =  2;
                        if (response.data != null) {
                            that.displayMessage(response.data.retCode, response.data.message);
                        }

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            approve: function (operate) {
                var that = this;
                //this.courseBaseInfo.courseId = courseId;
                this.approveInfo.operate = operate;
                var approveBo = Object.assign({}, this.approveInfo);
                axios.post(Config.URL_BASE + '/course/approve', approveBo)
                    .then(function (response) {
                        if (response.data != null) {
                            that.displayMessage(response.data.retCode, response.data.message);
                        }
                        console.log(response);
                        that.courseBaseInfo.approveStatus = operate;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
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
            },shelve: function () {
                var that = this;
                var courseId =  that.courseBaseInfo.courseId;
                var arr = new Array();
                arr[0] = courseId;
                var courseIds = Object.assign([], arr);
                axios.post(Config.URL_BASE + '/course/shelve', courseIds)
                    .then(function (response) {
                        if (response.data != null) {
                            that.displayMessage(response.data.retCode, response.data.message);
                        }
                        console.log(response);
                        if(that.courseBaseInfo.isOnShelves==1) {
                            that.courseBaseInfo.isOnShelves = 0;
                        } else {
                            that.courseBaseInfo.isOnShelves = 1;
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            openDialog:function () {
                this.showTable = true;
                this.handleSearch();
            },
            handleSearch:function () {
                var  that = this;
                axios.get(Config.URL_BASE + '/test_paper/list',{params:{
                    'isPublic':true,
                    'search':that.searchText,
                    'type':1,
                    'pageIndex':this.currentPage,
                    'pageSize':this.pageSize,
                }}).then(function (response) {
                    that.refQuestionSet = response.data.data.items;
                    that.total = response.data.data.total;
                })
            },
            pageSizeChange:function (val) {
                this.pageSize = val;
                this.getQuestions();
            },
            currPageChange:function () {
                this.handleSearch();
            },
            handleSelectionChange: function (val) {
                this.courseQuestionSetTemp1 = val;
            },
            batchSelect:function () {
                this.showTable = false;
                for (var i=0;i<this.courseQuestionSetTemp1.length;i++){
                    this.courseQuestionSetTemp2.push(this.courseQuestionSetTemp1[i]);
                    this.courseBaseInfo.courseQuestionSetBo.questionSetIds.push(this.courseQuestionSetTemp1[i].questionSetId);
                }
            },
            deletedQuestionSet:function (row) {
                for (var i = 0; i<this.courseQuestionSetTemp2.length; i++) {
                    if (this.courseQuestionSetTemp2[i].questionSetId == row.questionSetId) {
                        this.courseQuestionSetTemp2.splice(i, 1);
                    }
                }
                for (var i = 0; i<this.courseBaseInfo.courseQuestionSetBo.questionSetIds.length; i++) {
                    if (this.courseBaseInfo.courseQuestionSetBo.questionSetIds[i] == row.questionSetId) {
                        this.courseBaseInfo.courseQuestionSetBo.questionSetIds.splice(i, 1);
                    }
                }
            },
            openOrgDialog:function () {
                this.showOrgDialog = true;
                this.getOrgTree();
            },
            getOrgTree: function () {
                var that = this;
                axios.get(Config.URL_BASE + '/org/tree').then(function (response) {
                    that.orgTree = response.data.data;
                })
            },
            handleNodeClick: function (data, checked, indeterminate) {
                this.orgOk = false;
                this.courseBaseInfo.orgId = data.orgId;
                this.courseBaseInfo.orgName = data.name;
            },
            orgSelect:function () {
                this.showOrgDialog = false;
            },
            orgNo:function () {
                this.showOrgDialog = false
                this.courseBaseInfo.orgId = '';
                this.courseBaseInfo.orgName = null;
            }
        },
            computed: {
                editor() {
                    return this.$refs.myTextEditor.quillEditor;
                }
            }
        }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
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