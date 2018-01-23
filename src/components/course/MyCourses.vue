<template>
    <div class="hj-my-course-zone">
        <el-tabs  v-model="activeTab" @tab-click="handleClick" style="min-height: 480px;">
            <el-tab-pane label="在学课程" name="learningCourses">
                <div style="min-height: 560px;">
                    <my-course-card v-for="course in learningCourses.courses"
                                    :id="course.id"
                                    :name="course.name"
                                    :teacher-id="course.teacher.id"
                                    :teacher-name="course.teacher.name"
                                    :time-len="course.timeLen" >
                    </my-course-card>
                </div>
                <div>
                    <el-pagination small layout="prev, pager, next" :total="50" style="margin-right: 20px;float:right;">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="收藏课程" name="collectedCourses">
                <div style="min-height: 560px;">
                    <my-course-card v-for="course in collectedCourses.courses"
                                   :id="course.id"
                                    :name="course.name"
                                    :teacher-id="course.teacher.id"
                                    :teacher-name="course.teacher.name"
                                    :time-len="course.timeLen">
                    </my-course-card>
                </div>
                <div>
                    <el-pagination small layout="prev, pager, next" :total="50" style="margin-right: 20px;float:right;">
                    </el-pagination>
                </div>

                <el-pagination small layout="prev, pager, next" :total="50">
                </el-pagination>
            </el-tab-pane>
            <el-tab-pane label="已购课程" name="boughtCourses">
                <div style="">
                    <my-course-card v-for="course in boughtCourses.courses"
                                    :id="course.id"
                                    :name="course.name"
                                    :teacher-id="course.teacher.id"
                                    :teacher-name="course.teacher.name"
                                    :time-len="course.timeLen">
                    </my-course-card>
                </div>
                <div>
                    <el-pagination small layout="prev, pager, next" :total="50" style="margin-right: 20px;float:right;">
                    </el-pagination>
                </div>



            </el-tab-pane>
        </el-tabs>
    </div>

</template>

<script>
    import MyCourseCard from './MyCourseCard.vue'
    import ElCol from "element-ui/lib/col";

export default {
    components:{
        ElCol,
        'my-course-card': MyCourseCard
    },
    data: function () {
        return {
            activeTab:'learningCourses',
            learningCourses: {
                currPageNo:1,
                totalPage:2,
                courses:[
                    {id:"0001", name:"课程1", teacher:{id:"0000", name:'讲师1'}, timeLen:41, },
                    {id:"0002", name:"课程2", teacher:{id:"0001", name:'讲师2'}, timeLen:42, },
                    {id:"0003", name:"课程3", teacher:{id:"00002", name:'讲师3'}, timeLen:43, },
                    {id:"0004", name:"课程4", teacher:{id:"0003", name:'讲师4'}, timeLen:44, },
                ]
            },
            collectedCourses: {
                currPageNo:1,
                totalPage:2,
                courses:[
                    {id:"0005", name:"课程5", teacher:{id:"0000", name:'讲师1'}, timeLen:41, },
                    {id:"0006", name:"课程6", teacher:{id:"0001", name:'讲师2'}, timeLen:42, },
                    {id:"0007", name:"课程7", teacher:{id:"00002", name:'讲师3'}, timeLen:43, },
                    {id:"0008", name:"课程8", teacher:{id:"0003", name:'讲师4'}, timeLen:44, },
                ]
            },
            boughtCourses: {
                currPageNo:1,
                totalPage:2,
                courses:[
                    {id:"0009", name:"课程9", teacher:{id:"0000", name:'讲师1'}, timeLen:41, },
                    {id:"000a", name:"课程a", teacher:{id:"0001", name:'讲师2'}, timeLen:42, },
                    {id:"000b", name:"课程b", teacher:{id:"00002", name:'讲师3'}, timeLen:43, },
                    {id:"000c", name:"课程c", teacher:{id:"0003", name:'讲师4'}, timeLen:44, },
                    {id:"0009", name:"课程9", teacher:{id:"0000", name:'讲师1'}, timeLen:41, },
                    {id:"000a", name:"课程a", teacher:{id:"0001", name:'讲师2'}, timeLen:42, },
                    {id:"000b", name:"课程b", teacher:{id:"00002", name:'讲师3'}, timeLen:43, },
                    {id:"000c", name:"课程c", teacher:{id:"0003", name:'讲师4'}, timeLen:44, },
                    {id:"0009", name:"课程9", teacher:{id:"0000", name:'讲师1'}, timeLen:41, },
                    {id:"000a", name:"课程a", teacher:{id:"0001", name:'讲师2'}, timeLen:42, },
                    {id:"000b", name:"课程b", teacher:{id:"00002", name:'讲师3'}, timeLen:43, },
                    {id:"000c", name:"课程c", teacher:{id:"0003", name:'讲师4'}, timeLen:44, },
                    {id:"0009", name:"课程9", teacher:{id:"0000", name:'讲师1'}, timeLen:41, },
                    {id:"000a", name:"课程a", teacher:{id:"0001", name:'讲师2'}, timeLen:42, },
                    {id:"000b", name:"课程b", teacher:{id:"00002", name:'讲师3'}, timeLen:43, },
                    {id:"000c", name:"课程c", teacher:{id:"0003", name:'讲师4'}, timeLen:44, },

                ]
            }
        };
    },
    methods: {
        handleClick:function (currTab, event) {
            this.activeTab = currTab.name;
        }
    }
}
</script>
<style>
    .hj-my-course-zone {
        padding:20px;
    }

    .hj-courses-list {

    }
</style>