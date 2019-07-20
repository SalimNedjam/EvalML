from django.urls import path

from application.Api.CourseApi import CourseFetch, CreateCourse

urlpatterns = [

    path('api/course/course', CourseFetch.as_view()),
    path('api/course/create_course', CreateCourse.as_view()),

]
