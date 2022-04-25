import datetime
from rest_framework.response import Response
from rest_framework import status
from mongo_auth.utils import productsCol
from bson import ObjectId
from mongo_auth.utils import parse_json
from rest_framework.decorators import permission_classes
from mongo_auth.permissions import AuthenticatedOnly
from rest_framework.views import APIView


@permission_classes([AuthenticatedOnly])
class List_and_Add_Products(APIView):
    def get(self, request):
        """
        List Products View
        """

        try:
            # ++++++++++++++ Find all products in db ++++++++++++++
            products = productsCol.find({})
            return Response({'products': parse_json(list(products))}, status=status.HTTP_200_OK)

        # ++++++++++++++ except conditions for error handling ++++++++++++++
        except Exception as e:
            print('Exception in listing products: ', e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"data": {"error_msg": str(e)}})

    def post(self, request):
        """
        Add Product View
        """
        try:
            # ++++++++++++++ Get data from user ++++++++++++++
            data = request.data

            # ++++++++++++++ Get fields from user to be added in db ++++++++++++++
            productAdd = {
                "name": data['name'],
                "quantity": data['quantity'],
                "price": data['price'],
                "createdAt": datetime.datetime.utcnow(),
                "updatedAt": datetime.datetime.utcnow(),
                "modifiedAt": None
            }

            # ++++++++++++++ Insert product data in db ++++++++++++++
            productsCol.insert_one(productAdd)
            return Response({'message': 'Product Added'}, status=status.HTTP_200_OK)

        # ++++++++++++++ except conditions for error handling ++++++++++++++
        except Exception as e:
            print('Exception in adding product: ', e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"data": {"error_msg": str(e)}})


@permission_classes([AuthenticatedOnly])
class View_Update_Delete_Product(APIView):
    def get(self, request, pk):
        """
        List One Product View
        """

        try:
            # ++++++++++++++ Find all products in db ++++++++++++++
            product = productsCol.find_one({'_id': ObjectId(pk)})

            if product:
                return Response({'product': parse_json(product)}, status=status.HTTP_200_OK)

            else:
                # ++++++++++++++ If product not found ++++++++++++++
                return Response({'message': 'Product not found'}, status=status.HTTP_400_BAD_REQUEST)

        # ++++++++++++++ except conditions for error handling ++++++++++++++
        except Exception as e:
            print('Exception in listing one product: ', e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"data": {"error_msg": str(e)}})

    def put(self, request, pk):
        """
        Update Product View
        """
        try:
            # ++++++++++++++ Get data from user ++++++++++++++
            data = request.data

            # ++++++++++++++ Get data from user to be updated in db ++++++++++++++
            productUpdate = {
                "name": data['name'],
                "quantity": data['quantity'],
                "price": data['price'],
                "updatedAt": datetime.datetime.utcnow()
            }

            # ++++++++++++++ Find product in db ++++++++++++++
            findProduct = productsCol.find_one({'_id': ObjectId(pk)})

            if findProduct:
                # ++++++++++++++ Update product data in db ++++++++++++++
                productsCol.update_one({'_id': ObjectId(pk)}, {
                                       '$set': productUpdate})
                return Response({'message': 'Product Updated'}, status=status.HTTP_200_OK)

            else:
                # ++++++++++++++ If product not found ++++++++++++++
                return Response({'message': 'Product not found'}, status=status.HTTP_400_BAD_REQUEST)

        # ++++++++++++++ except conditions for error handling ++++++++++++++
        except Exception as e:
            print('Exception in updating product: ', e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"data": {"error_msg": str(e)}})

    def delete(self, request, pk):
        """
        Delete Product View
        """

        try:
            # ++++++++++++++ Find product in db ++++++++++++++
            findProduct = productsCol.find_one({'_id': ObjectId(pk)})

            if findProduct:
                # ++++++++++++++ Delete product data in db ++++++++++++++
                productsCol.delete_one({"_id": ObjectId(pk)})
                return Response({'message': 'Product deleted'})

            else:
                # ++++++++++++++ If product not found ++++++++++++++
                return Response({'message': 'Product not found'}, status=status.HTTP_400_BAD_REQUEST)

        # ++++++++++++++ except conditions for error handling ++++++++++++++
        except Exception as e:
            print('Exception in deleting product: ', e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"data": {"error_msg": str(e)}})
