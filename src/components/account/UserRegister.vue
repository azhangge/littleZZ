<template>
    <div>
        <el-row style="padding: 12px 48px;padding-top: 48px;line-height: 48px;">
            <el-form labelWidth="160px">
                <el-form-item label="账号">
                    <el-input v-model="userBasicInfo.username" placeholder="账号" style="width: 350px;"></el-input>
                </el-form-item>
            </el-form>
            <el-form labelWidth="160px">
                <el-form-item label="用户姓名">
                    <el-input v-model="userBasicInfo.nickName" placeholder="用户姓名" style="width: 350px;"></el-input>
                </el-form-item>
            </el-form>
            <el-form labelWidth="160px">
                <el-form-item label="密码">
                    <el-input v-model="userBasicInfo.password" placeholder="密码" style="width: 350px;" type="password"></el-input>
                </el-form-item>
            </el-form>
            <el-form labelWidth="160px">
                <el-form-item label="手机号码">
                    <el-input v-model="userBasicInfo.phoneNo" placeholder="手机号码" style="width: 350px;"></el-input>
                </el-form-item>
            </el-form>
            <el-form labelWidth="160px">
                <el-form-item label="性别">
                    <el-radio-group v-model="userBasicInfo.gender" size="mini" style="vertical-align: middle;">
                        <el-radio label="0">保密</el-radio>
                        <el-radio label="1">男</el-radio>
                        <el-radio label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-form labelWidth="160px">
                <el-form-item label="所属组织">
                    <el-input v-model="userBasicInfo.orgName" placeholder="所属组织" style="width: 350px;" readonly></el-input>
                    <el-button @click="showOrgList">选择组织</el-button>
                </el-form-item>
            </el-form>
        </el-row>


        <el-row>
            <el-col :offset="10">
                <el-button type="primary" @click="handleSave">注册</el-button>
            </el-col>
        </el-row>

        <el-dialog title="选择组织(双击选择组织)" :visible.sync="showOrgTable">
            <el-tree
                    :data="orgTree"
                    :props="defaultProps"
                    default-expand-all
                    :expand-on-click-node="false"
                    @node-click="handleNodeClick"
                    :render-content="renderContent">
            </el-tree>
        </el-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import Config from '../../config.js'
    import ElRow from "element-ui/lib/row";
    import ElInput from "element-ui/lib/input";
    import ElForm from "element-ui/lib/form";
    import ElFormItem from "element-ui/lib/form-item";
    import ElButton from "element-ui/lib/button";
    import ElCheckboxGroup from "element-ui/lib/checkbox-group";
    import ElCheckbox from "element-ui/lib/checkbox";

    export default {
        components: {
            ElRow,
            ElButton,
            ElInput,
            ElForm,
            ElFormItem,
            ElCheckboxGroup,
            ElCheckbox
        },
        data: function () {
            return {
                showOrgTable: false,
                userBasicInfo:{
                    username:'',
                    nickName:'',
                    password:'123',
                    phoneNo:'',
                    orgId:'',
                    orgName:'',
                    gender:'',
                    type:'3',//管理端新增账户
                    sysId:'1e1c8e2e-0bea-4781-a2bd-b625fbb39ab5',
                    channel:"2"
                },
                orgTree: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        created: function () {
            this.getOrgTree();
        },
        methods: {
            showOrgList:function () {
                this.showOrgTable = true;
            },
            getOrgTree: function () {
                console.log(this.orgBo);
                var that = this;
                axios.get(Config.URL_BASE + '/org/tree').then(function (response) {
                    that.orgTree = response.data.data;
                })
            },
            handleNodeClick: function (data, checked, indeterminate) {
                console.log(data, checked, indeterminate);
            },
            renderContent: function (h, {node, data, store}) {
                return (
                    <span style="width: 100%;">
                        <span>{node.label}</span>
                        <span style="float: right;margin-right: 20px;">
                            <el-button style="font-size: 12px;" type="text"on-click={() => this.selectOrg(data)}>选择</el-button>
                        </span>
                    </span>

                );
            },
            selectOrg: function (data) {
                this.showOrgTable = false;
                this.userBasicInfo.orgName = data.name;
                this.userBasicInfo.orgId = data.orgId;
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
            handleSave:function () {
                console.log('handleSave!');
                var that = this;
                var regAccountBo = Object.assign({}, this.userBasicInfo);

                axios.post(Config.URL_BASE + '/account/adduser', regAccountBo).then(function (response) {
                    if (response.data != null) {
                        that.displayMessage(response.data.retCode, response.data.message);
                        that.$router.push({name:'user_center_user',params:{}});
                    }
                    console.log(response);
                    if (response.data.retCode == 1){

                    }
                })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    }
</script>