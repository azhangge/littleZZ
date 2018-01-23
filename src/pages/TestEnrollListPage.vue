<template>
    <div>
        <el-row style="padding: 12px 48px;padding-top: 48px;line-height: 48px;">
            <el-radio-group v-model="noticeType" @change="noticeByType" style="vertical-align: middle;">
                <el-radio label="">全部</el-radio>
                <el-radio label="1">集中考试</el-radio>
                <el-radio label="2">普通考试</el-radio>
            </el-radio-group>
            <el-input placeholder="通知名称" v-model="queryKeyword" class="input-with-select" size="small" style="width: 200px;float:right;margin-top: 8px;">
                <el-button slot="append" icon="search" @click="wordSearch"></el-button>
            </el-input>
        </el-row>
        <el-row style="padding: 12px 48px;">
            <el-table :data="notices" style="width: 100%">
                <el-table-column prop="examName" label="考试名称"></el-table-column>
                <el-table-column prop="type" label="类型" width="100"></el-table-column>
                <el-table-column prop="isPublic" label="是否公开" width="100"></el-table-column>
                <el-table-column prop="isPublish" label="是否发布" width="100"></el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <router-link :to="{name:'test_enroll_detail',params:{'examId':scope.row.examId}}" style="text-decoration: none;">
                            <span style="text-decoration: none; color: #1f2d3d">查看</span>
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row style="padding: 12px 48px;">
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
                noticeType: '',
                notices: [],
                currentPage: 1,
                pageSize: 10,
                total: 0,
                queryKeyword: null
            }
        },
        created: function () {
            this.getNotices();
        },
        methods: {
            getNotices: function () {
                var that = this;
                axios.get(Config.URL_BASE + '/notice/exam/manage', {
                    params: {
                        'type': this.noticeType,
                        'pageIndex': this.currentPage - 1,
                        'pageSize': this.pageSize,
                        'name': this.queryKeyword,
                    }
                }).then(function (response) {
                    that.notices = response.data.data.items;
                    that.total = response.data.data.total;
                    for (var i = 0; i < that.notices.length; i++) {
                        if (that.notices[i].type == 1) {
                            that.notices[i].type = '集中考试';
                        } else if (that.notices[i].type == 2) {
                            that.notices[i].type = '普通考试';
                        }
                        if (that.notices[i].isPublic == true) {
                            that.notices[i].isPublic = '已公开';
                        } else if (that.notices[i].isPublic == false) {
                            that.notices[i].isPublic = '未公开';
                        }
                        if (that.notices[i].isPublish == true) {
                            that.notices[i].isPublish = '已发布';
                        } else if (that.notices[i].isPublish == false) {
                            that.notices[i].isPublish = '未发布';
                        }
                    }
                })
            },
            noticeByType: function () {
                this.getNotices();
            },
            pageSizeChange: function (val) {
                this.pageSize = val;
                this.getNotices();
            },
            currPageChange: function () {
                this.getNotices();
            },
            wordSearch: function () {
                this.getNotices();
            }
        }
    }
</script>