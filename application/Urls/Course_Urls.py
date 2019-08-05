from django.conf.urls import url
from django.urls import path

from application.Api.CourseApi import CourseFetch, CreateCourse, SendEmail, DuplicateCourse, RemoveCourse, EditCourse

urlpatterns = [

    path('api/course/course', CourseFetch.as_view()),
    path('api/course/create_course', CreateCourse.as_view()),
    path('api/course/send_email', SendEmail.as_view()),
    path('api/course/duplicate_course', DuplicateCourse.as_view()),
    url(r'api/course/remove_course/(?P<course_id>\d+)/$', RemoveCourse.as_view()),
    path('api/course/edit_course', EditCourse.as_view()),

]
