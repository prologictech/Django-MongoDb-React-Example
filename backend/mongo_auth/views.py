from mongo_auth.methods import create_unique_object_id, pwd_context
from mongo_auth.db import fields, jwt_life, jwt_secret, secondary_username_field
import jwt
import datetime
from mongo_auth import messages
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.contrib.auth.hashers import make_password
from mongo_auth.utils import usersCol
from mongo_auth.utils import parse_json
from rest_framework.views import APIView


class Register(APIView):
    """
    Register a User
    """

    def post(self, request):

        try:
            # ++++++++++++++ Get data from user ++++++++++++++
            data = request.data if request.data is not None else {}
            signup_data = {"id": create_unique_object_id()}
            all_fields = set(fields + ("email", "password"))
            if secondary_username_field is not None:
                all_fields.add(secondary_username_field)
            for field in set(fields + ("email", "password")):
                if field in data:
                    signup_data[field] = data[field]
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST,
                                    data={"error_msg": field.title() + " does not exist."})

            # ++++++++++++++ Get data from user ++++++++++++++
            signup_data["name"] = data['name']
            signup_data["username"] = data['email']
            signup_data["password"] = make_password(data["password"])
            signup_data["createdAt"] = datetime.datetime.utcnow()

            # ++++++++++++++ If data is not none ++++++++++++++
            if usersCol.find_one({"email": signup_data['email']}) is None:
                if secondary_username_field:
                    if usersCol.find_one({secondary_username_field: signup_data[secondary_username_field]}) is None:
                        usersCol.insert_one(signup_data)
                        res = {k: v for k, v in signup_data.items() if k not in [
                            "_id", "password"]}
                        return Response(status=status.HTTP_200_OK,
                                        data={"data": res})
                    else:
                        # ++++++++++++++ If email already exists in db ++++++++++++++
                        return Response({'detail': 'This email is already registered with us. Try using a different email'}, status=status.HTTP_400_BAD_REQUEST)

                else:
                    # ++++++++++++++ Insert instance in db ++++++++++++++
                    usersCol.insert_one(signup_data)
                    res = {k: v for k, v in signup_data.items() if k not in [
                        "_id", "password"]}
                    # ++++++++++++++ Registration successful ++++++++++++++
                    return Response({'detail': 'You have been registered successfully'}, status=status.HTTP_200_OK)
            else:
                # ++++++++++++++ If email already exists in db ++++++++++++++
                return Response({'detail': 'This email is already registered with us. Try using a different email'}, status=status.HTTP_400_BAD_REQUEST)
        # ++++++++++++++ Validation error ++++++++++++++
        except ValidationError as v_error:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'success': False, 'message': str(v_error)})
        # ++++++++++++++ Exception error ++++++++++++++
        except Exception as e:
            print('Exception in register: ', e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            data={"data": {"error_msg": str(e)}})


class Login(APIView):
    """
    Login a User
    """

    def post(self, request):

        try:
            # ++++++++++++++ Get data from user ++++++++++++++
            data = request.data if request.data is not None else {}
            username = data['username']
            password = data['password']
            if "@" in username:
                user = usersCol.find_one(
                    {"email": username}, {"_id": 0})
            else:
                if secondary_username_field:
                    user = usersCol.find_one(
                        {secondary_username_field: username}, {"_id": 0})
                else:
                    # ++++++++++++++ User not found in db ++++++++++++++
                    return Response({'detail': messages.user_not_found}, status=status.HTTP_403_FORBIDDEN)
            if user is not None:
                # ++++++++++++++ Verify password ++++++++++++++
                if pwd_context.verify(password, user["password"]):
                    # ++++++++++++++ Generate token info ++++++++++++++
                    token = jwt.encode({'id': user['id'],
                                        'exp': datetime.datetime.now() + datetime.timedelta(
                                            days=jwt_life)},
                                       jwt_secret, algorithm='HS256')

                    # ++++++++++++++ Get info from db to be returned ++++++++++++++
                    userInfo = usersCol.find_one({"email": user['email']})

                    data = {"token": token}
                    data.update(userInfo)

                    # ++++++++++++++ Login successful ++++++++++++++
                    return Response(status=status.HTTP_200_OK,
                                    data=parse_json(data))
                else:
                    # ++++++++++++++ Incorrect password ++++++++++++++
                    return Response({'detail': messages.incorrect_password}, status=status.HTTP_403_FORBIDDEN)
            else:
                # ++++++++++++++ User not found ++++++++++++++
                return Response(status=status.HTTP_403_FORBIDDEN,
                                data={"detail": messages.user_not_found})
        # ++++++++++++++ Validation error ++++++++++++++
        except ValidationError as v_error:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'success': False, 'detail': str(v_error)})
        # ++++++++++++++ Exception error ++++++++++++++
        except Exception as e:
            print('Exception in login: ', e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            data={"detail": str(e)})
