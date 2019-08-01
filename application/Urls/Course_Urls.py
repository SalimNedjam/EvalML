from django.urls import path

from application.Api.CourseApi import CourseFetch, CreateCourse, SendEmail

urlpatterns = [

    path('api/course/course', CourseFetch.as_view()),
    path('api/course/create_course', CreateCourse.as_view()),
    path('api/course/send_email', SendEmail.as_view()),

]
