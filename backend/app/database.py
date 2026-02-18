import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="172.17.12.163",
        user="root",
        password="NewPassword@123",
        database="dipija_dbb"
    )