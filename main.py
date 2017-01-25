# Copyright 2016 Google Inc. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""This is an test API design.

This code implements several APIs to learn how Google Endpoints works.

"""

import endpoints
import sys
import datetime
from protorpc import message_types
from protorpc import messages
from protorpc import remote
import MySQLdb

class APIMessage(messages.Message):
  """APIMessage that stores a message."""
  message = messages.StringField(1)

# Might use this, waiting to see if we can get a json using APIMessage
class ListAPIMessage(messages.Message):
  """List APIMessage that stores a list of activities"""
  listName = messages.StringField(1)
  listActivities = messages.StringField(2, repeated=True)

class UserAPIMessage(messages.Message):
  """List APIMessage that stores a list of activities"""
  Username = messages.StringField(1)
  FirstName = messages.StringField(2)
  LastName = messages.StringField(3)
  Profile = messages.StringField(4)
  Email = messages.StringField(5)
  Zip = messages.StringField(6)
  Picture = messages.StringField(7)

class ActivityAPIMessage(messages.Message):
  """List APIMessage that stores the contents of an activity"""
  Id = messages.IntegerField(1)
  Name = messages.StringField(2)
  Description = messages.StringField(3)
  Latitude = messages.FloatField(4)
  Longitude = messages.FloatField(5)
  Summary = messages.StringField(6)
  Type = messages.StringField(7)
  TimeToComplete = messages.IntegerField(8)
  MinTime = messages.StringField(9)
  MaxTime = messages.StringField(10)
  Images = messages.StringField(11)
  Created = messages.StringField(12)
  Modified = messages.StringField(13)


CURRENT_USER = {
  "username": ""
}

USER_LOGIN = endpoints.ResourceContainer(
  Username = messages.StringField(1, required=True),
  Password = messages.StringField(2, required=False))

@endpoints.api(name='localLogin', version='v1')
class LocalLoginApi(remote.Service):
  """Implements an API to get the user info from the database"""
  @endpoints.method(
    USER_LOGIN,
    APIMessage,
    path='login',
    http_method='POST',
    name='login')
  def local_login(self, request):
    host = '146.148.61.121'
    user = 'root'
    passwd = 'whelmed'
    database = 'whelmed_db'
    db = MySQLdb.connect(host=host, user=user, passwd=passwd, db=database)
    cursor = db.cursor()

    select_stmt = (
      'SELECT * FROM accountTable WHERE Username = %s AND Password = %s'
    )
    values = [
      request.Username,
      request.Password
    ]

    try:
      a = cursor.execute(select_stmt, values)
      if a > 0:
        CURRENT_USER['username'] = request.Username
        return APIMessage(message=str('OK'))
    except MySQLdb.Error, e:
        return APIMessage(message='User is not in the database')

    raise endpoints.NotFoundException(message='Please signup first')



USER_RESOURCE = endpoints.ResourceContainer(
  Username=messages.StringField(1, required=True),
  Password=messages.StringField(2, required=True),
  FirstName=messages.StringField(3, required=False),
  LastName=messages.StringField(4, required=False),
  Zip=messages.IntegerField(5, variant=messages.Variant.INT32, required=False),
  Profile=messages.StringField(6, required=False),
  Phone=messages.StringField(7, required=False),
  Email=messages.StringField(8, required=False),
  Picture=messages.StringField(9, required=False))

@endpoints.api(name='signup_user', version='v1')
class SignupUserApi(remote.Service):
  """Implements an API to add a user to the database"""
  @endpoints.method(
    USER_RESOURCE,
    APIMessage,
    path='signup_user/signup',
    http_method='POST',
    name='signup_user.signup')
  def signup_user(self, request):
    host = '146.148.61.121'
    user = 'root'
    passwd = 'whelmed'
    database = 'whelmed_db'

    # Connect to db
    db = MySQLdb.connect(host=host, user=user, passwd=passwd, db=database)
    cursor = db.cursor()

    # Insert data into db
    select_stmt = (
      'INSERT INTO accountTable (Username, Password, FirstName, '
      'LastName, Zip, Profile, Phone, Email, Picture) VALUES '
      '(%s, %s, %s, %s, %s, %s, %s, %s, %s)'
    )
    values = [
      request.Username,
      request.Password,
      request.FirstName,
      request.LastName,
      request.Zip,
      request.Profile,
      request.Phone,
      request.Email,
      request.Picture
    ]

    try:
      a = cursor.execute(select_stmt, values)
      # Check to make sure lines have changed and commit changes
      if a > 0 :
        cursor.execute('COMMIT')
        return APIMessage(message='Created User Successfully')
    except MySQLdb.Error, e:
      if e.args[0] == 1062:
        return APIMessage(message='User already in database')


    raise endpoints.NotFoundException(message='User Not Created')



ACTIVITY_RESOURCE = endpoints.ResourceContainer(
  Activity=messages.StringField(1, required=True),
  Description=messages.StringField(2, required=False),
  Summary=messages.StringField(3, required=False),
  Type=messages.StringField(4, required=False),
  TimeToComplete=messages.IntegerField(5, variant=messages.Variant.INT32, required=False),
  Image=messages.StringField(6, required=False),
  Latitude=messages.StringField(7, required=True),
  Longitude=messages.StringField(8, required=True))

ACTIVITY_NAME = endpoints.ResourceContainer(
  Activity=messages.StringField(1, required=True))

@endpoints.api(name='activity', version='v1')
class ActivityApi(remote.Service):
  """Implements an API to add a new activity to the database"""
  @endpoints.method(
    ACTIVITY_RESOURCE,
    APIMessage,
    path='addActivity',
    http_method='POST',
    name='add')
  def addActivity(self, request):
    host = '146.148.61.121'
    user = 'root'
    passwd = 'whelmed'
    database = 'whelmed_db'

    # Connect to db
    db = MySQLdb.connect(host=host, user=user, passwd=passwd, db=database)
    cursor = db.cursor()

    cur_user = CURRENT_USER['username']

    if cur_user == 'undefined':
      raise endpoints.NotFoundException(message='Activity Not Created')

    # Insert data into db
    select_stmt = (
      'INSERT INTO activityTable (ActivityName, Description, Summary, Type,'
      'TimeToComplete, Image, Lat, Lng) VALUES '
      '(%s, %s, %s, %s, %s, %s, %s, %s)'
    )
    values = [
      request.Activity,
      request.Description,
      request.Summary,
      request.Type,
      request.TimeToComplete,
      request.Image,
      request.Latitude,
      request.Longitude
    ]

    a = cursor.execute(select_stmt, values)

    select_stmt = (
      'SELECT * FROM activityTable WHERE ActivityName=%s'
    )
    values = [
      request.Activity
    ]

    c = cursor.execute(select_stmt, values)
    print c
    if c > 0:
      m = cursor.fetchall()[0]
      print m

    # Insert data into user list
    select_stmt = (
      'INSERT INTO activityList (ListName, ActivityName, ActivityId, Completed) '
      'VALUES (%s, %s, %s, %s)'
    )

    table = cur_user + "_all"
    values = [
      table,
      request.Activity,
      m[0],
      'N'
    ]
    b = cursor.execute(select_stmt, values)

    # Check to make sure lines have changed and commit changes
    if a > 0 and b > 0:
      cursor.execute('COMMIT')
      return APIMessage(message='Created Activity Successfully')

    raise endpoints.NotFoundException(message='Activity Not Created')

  @endpoints.method(
    ACTIVITY_NAME,
    ActivityAPIMessage,
    path='getActivity',
    http_method='POST',
    name='get')
  def getActivity(self, request):
    host = '146.148.61.121'
    user = 'root'
    passwd = 'whelmed'
    database = 'whelmed_db'

    # Connect to db
    db = MySQLdb.connect(host=host, user=user, passwd=passwd, db=database)
    cursor = db.cursor()

    select_stmt = (
      'SELECT * FROM activityTable WHERE ActivityName=%s'
    )
    values = [
      request.Activity
    ]

    try:
      a = cursor.execute(select_stmt, values)
      if a > 0:
        m = cursor.fetchall()

        jsonDict = {
          'Id': '',
          'Name': '',
          'Description': '',
          'Latitude': '',
          'Longitude': '',
          'Summary': '',
          'Type': '',
          'TimeToComplete': '',
          'MinTime': '',
          'MaxTime': '',
          'Images': '',
          'Created': '',
          'Modified': ''
        }

        first_result = m[0]

        jsonDict['Id'] = first_result[0]
        jsonDict['Name'] = first_result[1]
        jsonDict['Description'] = first_result[2]
        jsonDict['Latitude'] = first_result[3]
        jsonDict['Longitude'] = first_result[4]
        jsonDict['Summary'] = first_result[5]
        jsonDict['Type'] = first_result[6]
        jsonDict['TimeToComplete'] = first_result[7]
        jsonDict['MinTime'] = first_result[8]
        jsonDict['MaxTime'] = first_result[9]
        jsonDict['Images'] = first_result[10]
        jsonDict['Created'] = first_result[11].isoformat()
        if first_result[12] != None:
          jsonDict['Modified'] = first_result[12].isoformat()
        else:
          jsonDict['Modified'] = None

        return ActivityAPIMessage(**jsonDict)
    except MySQLdb.Error, e:
      raise endpoints.NotFoundException(message=e.arg[0])

  @endpoints.method(
    ACTIVITY_RESOURCE,
    APIMessage,
    path='editActivity',
    http_method='POST',
    name='edit')
  def editActivity(self, request):
    host = '146.148.61.121'
    user = 'root'
    passwd = 'whelmed'
    database = 'whelmed_db'

    # Connect to db
    db = MySQLdb.connect(host=host, user=user, passwd=passwd, db=database)
    cursor = db.cursor()

    select_stmt = (
      'UPDATE activityTable SET '
      'Description=%s, Summary=%s, Type=%s, TimeToComplete=%s, Image=%s, '
      'Lat=%s, Lng=%s '
      'WHERE ActivityName=%s'
    )

    values = [
      request.Description,
      request.Summary,
      request.Type,
      request.TimeToComplete,
      request.Image,
      request.Latitude,
      request.Longitude,
      request.Activity
    ]

    try:
      print values
      a = cursor.execute(select_stmt, values)
      print a

      if a > 0:
        cursor.execute('COMMIT')
        return APIMessage(message='Created Activity Successfully')
    except MySQLdb.Error, e:
      raise endpoints.NotFoundException(message=e.arg[0])

WEB_CLIENT_ID = '778585169505-qgtpq7h4mhsu0mrqi6q91ufmauh3d4ku.apps.googleusercontent.com'
ANDROID_CLIENT_ID = 'replace this with your Android client ID'
IOS_CLIENT_ID = 'replace this with your iOS client ID'
ANDROID_AUDIENCE = WEB_CLIENT_ID
ALLOWED_CLIENT_IDS = [
  WEB_CLIENT_ID, ANDROID_CLIENT_ID, IOS_CLIENT_ID,
  endpoints.API_EXPLORER_CLIENT_ID]
#
#
#@endpoints.api(
#    name='authed_greeting',
#    version='v1',
#    # Only allowed configured Client IDs to access this API.
#    allowed_client_ids=ALLOWED_CLIENT_IDS,
#    # Only allow auth tokens with the given audience to access this API.
#    audiences=[ANDROID_AUDIENCE],
#    # Require auth tokens to have the following scopes to access this API.
#    scopes=[endpoints.EMAIL_SCOPE])
#class AuthedGreetingApi(remote.Service):
#
#    @endpoints.method(
#        message_types.VoidMessage,
#        Greeting,
#        path='greet',
#        http_method='POST',
#        name='greet')
#    def greet(self, request):
#        user = endpoints.get_current_user()
#        user_name = user.email() if user else 'Anonymous'
#        return Greeting(message='Hello, {}'.format(user_name))
#
#
LIST_NAME_RESOURCE = endpoints.ResourceContainer(
  ListName=messages.StringField(1, required=False))

@endpoints.api(
  name='activityList',
  version='v1')
  # Only allowed configured Client IDs to access this API.
  # allowed_client_ids=ALLOWED_CLIENT_IDS,
  # Only allow auth tokens with the given audience to access this API.
  # audiences=[ANDROID_AUDIENCE],
  # Require auth tokens to have the following scopes to access this API.
  # scopes=[endpoints.EMAIL_SCOPE])
class GetListsApi(remote.Service):
  """Implements and authenticated api for getting activity lists"""
  @endpoints.method(
    LIST_NAME_RESOURCE,
    ListAPIMessage,
    path='get',
    http_method='POST',
    name='get')
  def get_lists(self, request):
    host = '146.148.61.121'
    user = 'root'
    passwd = 'whelmed'
    database = 'whelmed_db'
    db = MySQLdb.connect(host=host, user=user, passwd=passwd, db=database)
    cursor = db.cursor()
    # gets the current user (e.g. if mark has used authentication, then
    # it will return mwwolters
    # cur_user = endpoints.get_current_user()
    cur_user = CURRENT_USER['username']
    # select_stmt = (
    #   'SELECT a.ListName, a.ActivityName FROM activityList a '
    #   'INNER JOIN userListAcl u '
    #   'ON a.ListId = u.ListId '
    #   'WHERE u.Username = %s'
    # )

    select_stmt = (
      'SELECT ListName, ActivityName FROM activityList '
      'WHERE ListName = %s'
    )

    a = cursor.execute(select_stmt, (request.ListName,))
    m = cursor.fetchall()
    # currently is grabbing the first result and creating a dict of the form:
    # {'listName': <the list name>, 'listActivities': [<activity>]}
    # we will want it to be paginated and group all of the activities into
    # their lists
    jsonDict = {'listName': '', 'listActivities': []}
    first_result = m[0]
    jsonDict['listName'] = first_result[0]
    for elem in m:
      jsonDict['listActivities'].append(elem[1])
    return ListAPIMessage(**jsonDict)


USER_INFO_RESOURCE = endpoints.ResourceContainer(
  # Username=messages.StringField(1, required=True),
  FirstName=messages.StringField(1, required=False),
  LastName=messages.StringField(2, required=False),
  Profile=messages.StringField(3, required=False),
  # Email=messages.StringField(5, required=False),
  Zip=messages.StringField(4, required=False),
  Picture=messages.StringField(5, required=False))

@endpoints.api(
  name='localUser',
  version='v1',
  # Only allowed configured Client IDs to access this API.
  # allowed_client_ids=WEB_CLIENT_ID,
  # Only allow auth tokens with the given audience to access this API.
  audiences=[endpoints.API_EXPLORER_CLIENT_ID])
  # Require auth tokens to have the following scopes to access this API.
  # scopes=[endpoints.EMAIL_SCOPE])
class GetLocalUserApi(remote.Service):
  """Implements and authenticated api for getting or editting the current user
  info from the local db"""
  @endpoints.method(
    message_types.VoidMessage,
    UserAPIMessage,
    path='get',
    http_method='POST',
    name='get')
  def get_local_user(self, request):
    host = '146.148.61.121'
    user = 'root'
    passwd = 'whelmed'
    database = 'whelmed_db'
    db = MySQLdb.connect(host=host, user=user, passwd=passwd, db=database)
    cursor = db.cursor()

    # gets the current user
    cur_user = CURRENT_USER['username']

    select_stmt = (
      'SELECT * FROM accountTable WHERE Username = %s'
    )

    try:
      a = cursor.execute(select_stmt, (cur_user,))
      if a > 0:
        m = cursor.fetchall()

        jsonDict = {
          'Username': '',
          'FirstName': '',
          'LastName': '',
          'Profile': '',
          'Email': '',
          'Zip': '',
          'Picture': ''
        }

        first_result = m[0]
        jsonDict['Username'] = first_result[0]
        jsonDict['FirstName'] = first_result[2]
        jsonDict['LastName'] = first_result[3]
        jsonDict['Profile'] = first_result[4]
        jsonDict['Email'] = first_result[6]
        jsonDict['Zip'] = first_result[7]
        jsonDict['Picture'] = first_result[8]

        return UserAPIMessage(**jsonDict)
    except MySQLdb.Error, e:
      raise endpoints.NotFoundException(message=e.arg[0])

    raise endpoints.NotFoundException(message='User Not Found')

  @endpoints.method(
    USER_INFO_RESOURCE,
    APIMessage,
    path='edit',
    http_method='POST',
    name='edit')
  def editUser(self, request):
    host = '146.148.61.121'
    user = 'root'
    passwd = 'whelmed'
    database = 'whelmed_db'
    db = MySQLdb.connect(host=host, user=user, passwd=passwd, db=database)
    cursor = db.cursor()

    # gets the current user
    cur_user = CURRENT_USER['username']

    select_stmt = (
      'UPDATE accountTable SET '
      'FirstName = %s, LastName = %s, Profile = %s , Zip = %s, Picture = %s'
      'WHERE Username = %s'
    )

    values = [
      request.FirstName,
      request.LastName,
      request.Profile,
      request.Zip,
      request.Picture,
      cur_user
    ]

    try:
      a = cursor.execute(select_stmt, values)
      if a > 0:
        cursor.execute('COMMIT')
        return APIMessage(message='User successfully updated')
    except MySQLdb.Error, e:
      raise endpoints.NotFoundException(message=e.arg[0])

    raise endpoints.NotFoundException(message='User Not Found')



api = endpoints.api_server([SignupUserApi, GetListsApi, ActivityApi, GetLocalUserApi, LocalLoginApi])
