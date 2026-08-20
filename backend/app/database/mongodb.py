from pymongo import MongoClient
from config import Config


client = MongoClient(
    Config.MONGO_URI,
    serverSelectionTimeoutMS=10000,
    connectTimeoutMS=10000
)

db = client["ludiko"]