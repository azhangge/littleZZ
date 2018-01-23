<template>
    <div>
        <el-menu mode="vertical" default-active="1" class="hj-user-info-menu" @select="handleMenuSelect">
            <el-menu-item-group v-for="(mainMenu, mainIndex) in menuList" v-bind:title="mainMenu.name"
                                v-bind:index="mainMenu.code">
                <router-link class="hj-router-link" v-for="(subMenu, subIndex) in mainMenu.children" :key="subMenu.path"
                             :to="{name:subMenu.path}">
                    <el-menu-item class="hj-user-info-menu-item"
                                  style="padding-left: 40px;font-size: 10px;height: 32px;line-height: 32px;"
                                  v-bind:index="subMenu.code"><span>{{ subMenu.name }}</span></el-menu-item>
                </router-link>
            </el-menu-item-group>
        </el-menu>
    </div>

</template>
<script>
    import ElRow from "../../../node_modules/element-ui/lib/row";
    import ElCol from "../../../node_modules/element-ui/lib/col";
    import ElMenu from "../../../node_modules/element-ui/lib/menu";
    import ElMenuItem from "../../../node_modules/element-ui/lib/menu-item";
    import ElMenuItemGroup from "../../../node_modules/element-ui/lib/menu-item-group";

    export default {
        components: {
            ElRow,
            ElMenuItemGroup,
            ElMenuItem,
            ElMenu,
            ElCol
        },
        data: function () {
            return {
                menuList: [{
                    name: "课程中心",
                    code: '02',
                    children: [{
                        name: '系统课程',
                        code: "0201",
                        path: 'course_list'
                    }, {
                        name: '创建课程',
                        code: "0202",
                        path: 'gen_course'
                    }, {
                        name: '我的课程',
                        code: "0203",
                        path: 'teacher_course_list'
                    }]
                }, {
                    name: '考试中心',
                    code: '03',
                    children: [{
                        name: '系统试卷',
                        code: "0301",
                        path: 'test_paper_list'

                    }, {
                        name: '创建试卷',
                        code: "0302",
                        path: 'test_paper_detail'
                    }, {
                        name: '创建题集',
                        code: "0303",
                        path: 'question_set'
                    }, {
                        name: '考试通知',
                        code: "0304",
                        path: 'test_notice_list'

                    }, {
                        name: '考试通知创建',
                        code: "0305",
                        path: 'test_notice_detail'
                    }, {
                        name: '考试日程',
                        code: "0306",
                        path: 'test_arrange'
                    }, {
                        name: '报名查看',
                        code: "0307",
                        path: 'test_enroll_list'
                    }, {
                        name: '成绩查看',
                        code: "0309",
                        path: 'test_score_list'
                    }]
                }, {
                    name: '题库',
                    code: '04',
                    children: [{
                        name: '我的题库',
                        code: "0402",
                        path: 'my_questions'
                    }, {
                        name: '收藏题库',
                        code: "0403",
                        path: 'collect_question'
                    }]
                }, {
                    name: "课程分类",
                    code: "05",
                    children: [{
                        name: '分类',
                        code: "0501",
                        path: 'course_category'
                    },
                    ]
                },
                    {
                        name: "广告组",
                        code: "06",
                        children: [{
                            name: '新增广告组',
                            code: "0601",
                            path: 'ad_prompt_detail'
                        }, {
                            name: '轮播图列表',
                            code: "0602",
                            path: 'ad_prompt_list'
                        }]
                    }, {
                        name: "学习统计",
                        code: "07",
                        children:[{
                            name:"课程学习统计",
                            code:"0701",
                            path:"stat_course"
                        },{
                            name:"章节学习统计",
                            code:"0702",
                            path:"stat_chapter"
                        }]
                    },{
                        name: "账户中心",
                        code: "08",
                        children:[{
                            name:"用户管理",
                            code:"0801",
                            path:"user_center_user"
                        },{
                            name:"组织管理",
                            code:"0802",
                            path:"user_center_org_tree"
                        },{
                            name:"讲师管理",
                            code:"0803",
                            path:"user_center_teacher"
                        }]
                    }],
                activeCode: "0101",
            };
        },
        methods: {
            handleMenuSelect: function (index, indexPath) {
                this.activeCode = index;
                console.log("menu item " + index);
            }
        }
    }
</script>

<style>
    .el-menu-item-group > .el-menu-item-group__title {
        padding-bottom: 10px;
    }

    .hj-user-info-menu {
        background-color: white;
    }

    .hj-user-info-menu:first-child {
        padding-top: 10px;
    }

    .hj-router-link {
        text-decoration: none;
        vertical-align: middle;
    }
</style>