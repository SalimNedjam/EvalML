from django.conf.urls import url
from django.urls import path

from application.Api.GroupApi import CreateGroup, AddUserToGroup, FetchUsersNotInGroup, RemoveUserGroup, \
    ListGroupsChallenge, \
    RetrieveGroupList, RemoveUser, AddUserGroupForStaff

urlpatterns = [

    # GROUP URLs
    # FOR USER : ADD NEW MEMBER TO HIS GROUP
    path('api/group/add_to_group', AddUserToGroup.as_view()),

    path('api/group/create_group', CreateGroup.as_view()),

    # FOR USER : SEARCH NEW MEMBER
    path('api/group/fetch_non_grouped', FetchUsersNotInGroup.as_view()),
    # FOR USER : GET USERS'S GROUP MEMBERS
    path('api/group/user_list_group_challenge', RetrieveGroupList.as_view()),
    # FOR USER TO LEAVE A GROUP
    url(r'api/group/remove_user/(?P<id>\d+)/$', RemoveUser.as_view()),

    # FOR STAFF : GET USERS LIST
    path('api/group/list_groups_challenge', ListGroupsChallenge.as_view()),
    # FOR STAFF : DELETE A USER FROM GROUP
    url(r'api/group/remove_user_group/(?P<id>\d+)/$', RemoveUserGroup.as_view()),
    # FOR STAFF : ADD USER TO A GROUP (FORCE ADD)
    path('api/group/add_to_group_staff', AddUserGroupForStaff.as_view()),

]
