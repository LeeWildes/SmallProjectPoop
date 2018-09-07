from flask import Flask
from flask import request, jsonify, Response
from flask import render_template
import os
from passlib.hash import sha256_crypt
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

## Users

@app.route('/api/login=<name>&<password>', methods=['GET'])
def login(name,password):
    db = db_connect()
    try:

        cursor = db.cursor(buffered=True)

        cursor.execute("SELECT Password FROM user WHERE UserName=%s;",(name,))
        if(cursor.rowcount < 1):
            db_close(cursor,db)
            return jsonify({"success": False, "message":"Invalid Username"})

        e_password = cursor.fetchone()[0]
        isPassword = sha256_crypt.verify(password, e_password)
        if(not isPassword):
            db_close(cursor,db)
            return jsonify({"success": False,"message":"Incorrect Password"})

    except Exception as e:
        db_close(cursor,db)
        print(e)
        return jsonify({"success": False,"message":e})

    finally:
        db_close(cursor,db)

    return jsonify({"success": True})

@app.route('/api/contacts=<user>', methods=['GET'])
def get_contacts(user):
    #dont forget to sanitize inputs
    db = db_connect()
    try:
        cursor = db.cursor()
        print(user)
        input = str(user)
        print(input)
        cmd = "SELECT * FROM contact WHERE User_UserID =(%s)"
        cursor.execute(cmd,(input,))

        rows = cursor.fetchall() 

        resp = jsonify(rows)
        print(request.headers)
        contacts = []
        for row in rows:
            contacts.append({'id':row[0], 'name':row[1], 'number':row[2], 'email':row[3], 'userid':row[4]})
        x = jsonify(contacts)
        print(x)
        return x

    except Exception as e:
        db_close(cursor,db)
        print(e)
        return jsonify({"success": False,"message":e})

    finally:
        db_close(cursor,db)


@app.route('/api/create_user=<name>&<password>', methods=['PUT'])
def create_user(name,password):
    db = db_connect()
    try:

        cursor = db.cursor(buffered=True)

        ## checking if username is already in use
        cursor.execute("SELECT * FROM user WHERE UserName=%s;",(name,))
        rows = cursor.fetchall()
        if(len(rows)>0):
            db_close(cursor,db)
            return jsonify({"success": False,"message":"Name already exists"})

        ## encrypt password
        e_password = sha256_crypt.encrypt(password)

        ## Ghetto way to make sure every ID is unique
        cursor.execute("SELECT MAX(UserID) FROM user;")
        id = cursor.fetchone()[0]
        id = int(id or 0) + 1

        ## Add the user
        cursor.execute("INSERT into user (UserID,UserName,Password) VALUES(%s,%s,%s)",(id,name,e_password))

        ## must commit the changes made to the table
        db.commit()

    except Exception as e:
        db_close(cursor,db)
        print(e)
        return jsonify({"success": False,"message":e})

    finally:
        db_close(cursor,db)

    return jsonify({"success": True})

@app.route('/api/delete_user=<user>', methods=['DELETE'])
def delete_user(user):
    db = db_connect()

    try:

        cursor = db.cursor(buffered=True)
        cursor.execute("SELECT UserID FROM user WHERE UserName=%s",(user,))
        user_id = cursor.fetchone()[0]

        cursor.execute("DELETE FROM contact WHERE User_UserID=%s;",(user_id,))
        ## must commit the changes made to the table
        db.commit()

        cursor.execute("SELECT * FROM contact WHERE User_UserID=%s",(user_id,))
        rows = cursor.fetchall()
        if(len(rows)>0):
            db_close(cursor,db)
            return jsonify({"success": False,"message":"Contacts still remain"})

        cursor.execute("DELETE FROM user WHERE UserID=%s;",(user_id,))
        ## must commit the changes made to the table
        db.commit()

        cursor.execute("SELECT * FROM user WHERE UserID=%s",(user_id,))
        rows = cursor.fetchall()
        if(len(rows)>0):
            db_close(cursor,db)
            return jsonify({"success": False,"message":"User not deleted"})


        print(request.headers)

    except Exception as e:
        db_close(cursor,db)
        print(e)
        return jsonify({"success": False,"message":e})

    finally:
        db_close(cursor,db)

    return jsonify({"success": True})

## Contacts

@app.route('/api/create_contact', methods=['PUT'])
def create_contact():
    db =  db_connect()

    x = request.get_json()
    try:
        #check if contact already exists

        #need to create a contact ID first.
        print(x)
        cursor = db.cursor(buffered=True)
        name = str(x["first"]) + " "+ str(x["last"])
        username = x["userID"]
        print(username)
        cursor.execute("SELECT UserID FROM user WHERE UserName = %s",(str(username),))
        userId = cursor.fetchone()[0]
        cursor.execute("SELECT MAX(contactID) FROM contact;")
        id = cursor.fetchone()[0]
        id = int(id or 0) + 1
        cursor.execute("INSERT into contact(contactID, Name, Number, Email, User_UserID) VALUES(%s, %s, %s, %s, %s)", (id, name, x["number"], x["email"], userId))

        db.commit()

    except Exception as e:
        db_close(cursor, db)
        print(e)
        return jsonify({"success": False, "message": e})

    finally:
        db_close(cursor, db)
        return jsonify({"success": True})

@app.route('/api/delete_contact', methods=['DELETE'])
def delete_contact():
    db = db_connect()

    x = request.get_json()
    try:
        cursor = db.cursor(buffered = True)
        #check if contact exists

        #select the correct user id for the contact
        #cursor.execute("SELECT User_UserID FROM contact WHERE UserID = %s", (userId))

        #delete from the table
        cursor.execute("DELETE FROM contact WHERE name = %s", (x["firstLast"],))
        db.commit()

    #check if contact deleted

    except Exception as e:
        db_close(cursor, db)
        print(e)
        return jsonify({"success": False, "message": "Contact not deleted"})

    finally:
        db_close(cursor, db)

    return jsonify({"success": True})

@app.route('/api/users', methods=['GET'])
def get_all_users():
    db = db_connect()
    try:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM user")

        rows = cursor.fetchall()
        resp = jsonify(rows)
        print(request.headers)

    except Exception as e:
        print(e)

    finally:
        db_close(cursor,db)

    return resp

@app.route('/', methods=['GET'])
def hello():
    return render_template('index.html')


## redundant stuff
def db_connect():
    ## this should be in a config file
    return mysql.connector.connect(host='localhost',database='mydb',user='root',password='root')

def db_close(cursor,db):
    cursor.close()
    db.close()

# def get_session(user):
#     if user in session:
#         return True
#     else:
#         return False
#
# def end_session(user):


if __name__ == "__main__":
    app.run()
