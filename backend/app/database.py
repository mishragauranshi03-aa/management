import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="NewPassword@123",
        database="dipija_dbb"
    )