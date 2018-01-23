/**
 * Created by fangxing on 2017/6/13.
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import PlaceHolder from '../pages/PlaceHolder.vue'
import QuestionDetailPage from '../pages/QuestionDetailPage.vue'
import QuestionListPage from '../pages/QuestionListPage.vue'
import TestPaperDetailPage from '../pages/TestPaperDetailPage.vue'
import TestPaperListPage from '../pages/TestPaperListPage.vue'
import TestEnrollDetailPage from '../pages/TestEnrollDetailPage.vue'
import TestEnrollListPage from '../pages/TestEnrollListPage.vue'
import TestScoreDetailPage from '../pages/TestScoreDetailPage.vue'
import TestScoreListPage from '../pages/TestScoreListPage.vue'
import TestNoticeDetailPage from '../pages/TestNoticeDetailPage.vue'
import TestNoticeListPage from '../pages/TestNoticeListPage.vue'
import QuestionSetPage from '../pages/QuestionSetPage.vue'
import CourseDetail from '../components/course/CourseDetail.vue'
import CourseListPage from '../pages/CourseListPage.vue'


import MyCourses from '../components/course/MyCourses.vue'
import CourseCategory from '../components/course/CourseCategory.vue'
import UserBasicInfo from '../components/account/UserBasicInfo.vue'
import UserRegister from '../components/account/UserRegister.vue'
import UserFavList from '../pages/UserFavList.vue'
import UserMessageList from '../pages/UserMessageList.vue'
import UserPracticeRecordsList from '../pages/UserPracticeRecordsList.vue'
import UserTestArrange from '../pages/TestArrangePage.vue'
import QuestionCollectListPage from '../pages/QuestionCollectListPage.vue'

import TeacherCourseListPage from '../pages/TeacherCourseListPage.vue'
import AdPromptDetailPage from '../components/advert/AdPromptDetail.vue'
import AdPromptListPage from '../components/advert/AdPromptList.vue'

import StatCourse from '../pages/StatCourse.vue'
import StatChapter from '../pages/StatChapter.vue'

import UserCenterOrgTree from '../pages/UserCenterOrgTreePage.vue'
import UserCenterUser from '../pages/UserCenterUserPage.vue'
import UserCenterTeacher from '../pages/UserCenterTeacherPage.vue'
import UserCenterTeacherDetail from '../pages/UserCenterTeacherDetailPage.vue'



const routes = [
    {
        name: 'gen_course',
        path: '/gen_course',
        component: CourseDetail
    }, {
        name:'course_list',
        path:'/course_list',
        component:CourseListPage
    }, {
        name: 'test_paper_list',
        path: '/test_paper_list',
        component: TestPaperListPage
    }, {
        name:'teacher_course_list',
        path:'/teacher_course_list',
        component:TeacherCourseListPage
    }, {
        name: 'test_paper_detail',
        path: '/test_paper_detail',
        component: TestPaperDetailPage
    }, {
        name: 'question_set',
        path: '/question_set',
        component: QuestionSetPage
    }, {
        name:'test_notice_detail',
        path:'/test_notice_detail',
        component:TestNoticeDetailPage
    }, {
        name:'test_notice_list',
        path:'/test_notice_list',
        component:TestNoticeListPage
    }, {
        name: 'gen_question',
        path: '/gen_question',
        component: QuestionDetailPage
    }, {
        name: 'my_questions',
        path: '/my_questions',
        component: QuestionListPage
    }, {
        name:'collect_question',
        path:'/collect_question',
        component:QuestionCollectListPage
    }, {
        name:'test_detail',
        path:'/test_detail',
        component:PlaceHolder
    }, {
        name:'my_course',
        path:'/my_course',
        component:MyCourses
    }, {
        name:'real_info',
        path:'/real_info',
        component:PlaceHolder
    }, {
        name:'basic_info',
        path:'/basic_info',
        component:PlaceHolder
    }, {
        name:'course_category',
        path:'/course_category',
        component:CourseCategory
    }, {
        name:'question_set',
        path:'/question_set',
        component:QuestionSetPage
    }, {
        name:'user_basic_info',
        path:'/user_basic_info',
        component:UserBasicInfo
    }, {
        name:'user_fav_list',
        path:'/user_fav_list',
        component:UserFavList
    }, {
        name:'user_message_list',
        path:'/user_message_list',
        component:UserMessageList
    }, {
        name:'user_practise_records_list',
        path:'/user_practise_records_list',
        component:UserPracticeRecordsList
    }, {
        name:'test_arrange',
        path:'/test_arrange',
        component:UserTestArrange
    }, {
        name:'test_enroll_list',
        path:'/test_enroll_list',
        component:TestEnrollListPage
    }, {
        name:'test_enroll_detail',
        path:'/test_enroll_detail',
        component:TestEnrollDetailPage
    }
    , {
        name:'test_score_list',
        path:'/test_score_list',
        component:TestScoreListPage
    }, {
        name:'test_score_detail',
        path:'/test_score_detail',
        component:TestScoreDetailPage
    }, {
        name:'ad_prompt_detail',
        path:'/ad_prompt_detail',
        component:AdPromptDetailPage
    }, {
        name:'ad_prompt_list',
        path:'/ad_prompt_list',
        component:AdPromptListPage
    },{
        name:'stat_course',
        path:'/stat_course',
        component:StatCourse
    },{
        name:'stat_chapter',
        path:'/stat_chapter',
        component:StatChapter
    },{
        name:'user_center_org_tree',
        path:'/user_center_org_tree',
        component:UserCenterOrgTree
    },{
        name:'user_center_user',
        path:'/user_center_user',
        component:UserCenterUser
    },{
        name:'user_center_teacher',
        path:'/user_center_teacher',
        component:UserCenterTeacher
    },{
        name:'user_register',
        path:'/user_register',
        component:UserRegister
    },{
        name:'user_center_teacher_detail',
        path:'/user_center_teacher_detail',
        component:UserCenterTeacherDetail
    }
];


export default new VueRouter({
    routes: routes
})
