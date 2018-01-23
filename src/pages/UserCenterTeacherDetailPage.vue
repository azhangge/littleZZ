<template>
    <div style="margin-top: 30px">
        <el-form labelWidth="160px">
            <el-form-item label="姓名">
                <el-input v-model="teacherBo.realName" :disabled="true" style="width: 350px"></el-input>
            </el-form-item>
            <el-form-item label="最高学历">
                <el-select v-model="teacherBo.highestEdu" placeholder="学历">
                    <el-option
                            v-for="item in optionEdu"
                            :label="item.value"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="最高职称">
                <el-select v-model="teacherBo.highestTitle" placeholder="职称">
                    <el-option
                            v-for="item in optionTitle"
                            :label="item.value"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="讲师风采">
                <el-upload
                        class="avatar-uploader"
                        :action="uploadUrl"
                        :show-file-list="false"
                        :on-success="handleThumbnailSuccess"
                        :before-upload="beforeThumbnailUpload">
                    <img v-if="filePath != null && filePath != ''" :src="filePath" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <span style="float: right">
            <el-button @click="teacherEditNo">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
        </span>
        </el-form>
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
                teacherBo: {
                    teacherId: '',
                },
                uploadUrl: Config.URL_BASE + '/fs/upload',
                filePath: null,
                optionEdu: [{
                    value: '高中'
                }, {
                    value: '大专'
                }, {
                    value: '本科'
                }, {
                    value: '研究生'
                }, {
                    value: '博士'
                }, {
                    value: '蚵仔煎'
                }],
                optionTitle: [{
                    value: '讲师'
                }, {
                    value: '初中级工程师'
                }, {
                    value: '高级工程师'
                }]

            }
        },
        created: function () {
            this.teacherBo.teacherId = this.$route.params.teacherId;
            if (this.teacherBo.teacherId != null) {
                this.getTeacher(this.teacherBo.teacherId);
            }
        },
        methods: {
            getTeacher: function (teacherId) {
                var that = this;
                axios.get(Config.URL_BASE + '/teacher/' + teacherId).then(function (response) {
                    if (response.data.retCode == 1) {
                        that.teacherBo = response.data.data;
                        that.filePath = response.data.data.filePath;
                    }
                })
            },
            save: function () {
                var that = this;
                axios.post(Config.URL_BASE + '/teacher', this.teacherBo).then(function (response) {
                    if (response.data.retCode == 1) {
                        alert("修改讲师成功");
                        that.$router.push({name: 'user_center_teacher'});
                    }
                })
            },
            handleThumbnailSuccess: function (response) {
                if (response.retCode == 1) {
                    this.filePath = this.buildFsPath(response.data.storageGroup, response.data.storagePath);
                    this.teacherBo.introPicId = response.data.fileId;
                }
            },
            beforeThumbnailUpload: function () {

            },
            buildFsPath: function (group, path) {
                return Config.FS_SERVER_URL_BASE + "/" + group + "/" + path;
            },
            teacherEditNo: function () {
                this.$router.push({name: 'user_center_teacher'});
            },
        }
    }
</script>

<style>
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
</style>