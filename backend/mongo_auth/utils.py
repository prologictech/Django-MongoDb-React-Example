from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
from bson.json_util import loads
import json

# db information
client = MongoClient('mongodb://admin:JKuighk97!%40klnjgv@192.168.1.190:27017')
db = client['demo']

# Collections used in project
usersCol = db['users']
productsCol = db['products']

def json_handler(x):
    if isinstance(x, ObjectId) or isinstance(x, datetime):
        return str(x)
    else:
        raise TypeError(x)


def parse_json(data):
    return loads(json.dumps(data, default=json_handler))
