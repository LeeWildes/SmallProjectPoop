from flask import Flask
from flask import request, jsonify, Response
from flask import render_template
import os
import mysql.connector

app = Flask(__name__)
app.secret_key = os.urandom(24)

## Users

@app.route('/api/login', methods=['GET'])
def login():
    return True


@app.route('/api/contacts', methods=['GET'])
def get_contacts(user):
    return True

@app.route('/api/new_user', methods=['PUT'])
def create_user(user):
    return True

@app.route('/api/delete_user', methods=['DELETE'])
def delete_user(user):
    return True

## Contacts

@app.route('/api/update_contact', methods=['POST'])
def update_contact():
    return True

@app.route('/api/create_contact', methods=['PUT'])
def create_contact(userId, name, number, email):
	db =  db_connect()

	try:
		#check if contact already exists

		#need to create a contact ID first.

		cursor.execute("INSERT into contact(contactID, Name, Number, Email, User_UserID)
						VALUES(%s, %s, %s, %s, %s)", (contactID, name, number, email, userId))

		db.commit()
	
	except Exception as e:
		db_close(cursor, db)
		print(e)
		return jsonify({"success": False, "message": e})

	finally:
		db_close(cursor, db)
    	return jsonify({"success": True}) #am i still returning 200 or is this fine?

@app.route('/api/delete_contact', methods=['DELETE'])
def delete_contact(userId, contactId):
	db = db_connect()

	try:
		cursor = db.cursor(buffered = True)
		#check if contact exists

		#select the correct user id for the contact
		#cursor.execute("SELECT User_UserID FROM contact WHERE UserID = %s", (userId))

		#delete from the table
		cursor.execute("DELETE FROM contact WHERE contactID = %s", (contactId))
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
