import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="aayu2005",
        database="dipija_dbb"
    )
