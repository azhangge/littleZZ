<template>
    <div>
        <el-row style="padding: 24px 24px 0 24px;">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="类别">
                    <el-cascader
                            expand-trigger="hover"
                            size="mini"
                            :options="categoryDict"
                            :props="categoryDictMap"
                            v-model="currCategory"
                            @change="categoryChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="时间排序">
                    <el-radio-group v-model="order" size="mini" @change="changeOrder">
                        <el-radio-button label="1">降序</el-radio-button>
                        <el-radio-button label="0">升序</el-radio-button>
                    </el-radio-group>
                </el-form-item>

                <el-form-item style="float: right;">
                    <el-input placeholder="课程关键字" size="small" v-model="queryKeyword" class="input-with-select">
                        <el-button slot="append" icon="search" @click="wordSearch"></el-button>
                    </el-input>
                </el-form-item>
            </el-form>
        </el-row>


        <el-row v-if="total>0" style="padding-left: 24px; padding-right: 24px;" :gutter="8">
            <el-col :span="6" v-for="course in courses">
                <router-link :to="{ name:'gen_course',params:{courseId:course.courseId,approveStatus:course.approveStatus}}" replace>
                <el-card class="hj-grid-item" :body-style="{ padding: '0px'}">
                    <img v-if="course.thumbnailPath && course.thumbnailPath.length" :src="course.thumbnailPath"
                         class="image"/>
                    <img v-if="!course.thumbnailPath || !course.thumbnailPath.length" src="../assets/u3d.png"
                         class="image"/>
                    <div style="padding: 14px;font-size: 8px;">
                        <span >{{course.courseName}}</span>
                        <span style="float: right;">{{course.teacherName}}</span>
                        <div class="bottom" >
                            <el-button v-if="course.approveStatus==1" type="text" class="button" style="font-size: 8px;">提交审批</el-button>
                            <el-button v-if="course.approveStatus==2" type="text" class="button" style="font-size: 8px;">审批</el-button>
                            <el-button v-if="course.approveStatus==3" type="text" class="button" style="font-size: 8px;">待审批</el-button>
                            <el-button v-if="course.approveStatus==4&&course.isOnShelves==0" type="text" class="button" style="font-size: 8px;">上架</el-button>
                            <el-button v-if="course.approveStatus==4&&course.isOnShelves==1" type="text" class="button" style="font-size: 8px;">下架</el-button>
                        </div>
                    </div>
                </el-card>
                </router-link>
            </el-col>
        </el-row>
        <el-row style="padding-left: 24px; padding-right: 24px;" >
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
    import axios from "axios";
    import ElCol from "element-ui/lib/col";
    import ElForm from "element-ui/lib/form";
    import ElFormItem from "element-ui/lib/form-item";
    import ElButton from "element-ui/lib/button";
    import ElRow from "element-ui/lib/row";
    import Config from "../config"
    import ElRadioGroup from "element-ui/lib/radio-group";
    import ElRadio from "element-ui/lib/radio";
    import ElBreadcrumb from "element-ui/lib/breadcrumb";
    import ElBreadcrumbItem from "element-ui/lib/breadcrumb-item";
    export default {
        components: {
            ElBreadcrumbItem,
            ElBreadcrumb,
            ElRow,
            ElButton,
            ElFormItem,
            ElForm,
            ElCol,
            ElRadioGroup,
            ElRadio,
        },
        data() {
            return {
                categoryDictMap:{
                    value:'courseCategoryId',
                    label:'name'
                },
                categoryDict: [],
                currCategory:[],

                courses: [
                    {
                        thumbnailPath: '',
                        courseName: '',
                        teacherName: '',
                    }
                ],
                pageSize: 10,
                currentPage: 1,
                total: 0,
                radio: '',

                mainCategoryId: null,
                subCategoryId: null,
                queryKeyword: null,
                orderKey: "0",
                order: 1
            }
        },
        created: function () {
            this.getCategoryTree();
            this.getCourse();
        },
        methods: {
            getCategoryTree: function () {
                var that = this;
                axios.get(Config.URL_BASE + '/course_category/tree')
                    .then(function (response) {
                        if (response.data != null && response.data.data != null) {
                            that.categoryDict = response.data.data;
                        }
                    })
            },
            getCourse: function () {
                var that = this;
                axios.get(Config.URL_BASE + "/course/all_course", {
                    params: {
                        'mainCategoryId': this.mainCategoryId,
                        'subCategoryId': this.subCategoryId,
                        'pageIndex': this.currentPage - 1,
                        'pageSize': this.pageSize,
                        'queryKeyword': this.queryKeyword,
                        'orderKey':this.orderKey,
                        'order':this.order
                    }
                }).then(function (respose) {
                    that.courses = respose.data.data.items;
                    that.total = respose.data.data.total;
                })
            },
            handlePageSizeChange: function (val) {
                this.pageSize = val;
                this.getCourse();
            },
            handleCurrPageChange: function () {
                this.getCourse();
            },
            categoryChange: function (val) {
                this.mainCategoryId = this.currCategory[0];
                this.subCategoryId = this.currCategory[1];

                this.getCourse();
            },
            wordSearch: function () {
                this.getCourse();
            },
            changeOrder:function (val) {
                this.order = val;
                this.getCourse();
            }
        }
    }
</script>

<style>
    .hj-grid-item {
        height: 220px;
        background-color: white;
        position: relative;
        margin: 0 20px 20px 0;
        display: inline-block;
        border-style: none;
        padding: 0px;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        height: 150px;
        display: block;
    }
</style>