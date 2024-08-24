from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
from bson import ObjectId

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['Animals']
collection = db['Data']

@app.route('/get_animals', methods=['GET'])
def get_animals():
    animals = list(collection.find({}, {'_id': False}))
    return jsonify(animals)

@app.route('/add_animals', methods=['POST'])
def add_animal():
    data = request.get_json()
    collection.insert_one(data)
    return jsonify({"message": "Animal added successfully!"}), 201

@app.route('/delete_animal/<animal_id>', methods=['DELETE'])
def delete_animal(animal_id):
    result = collection.delete_one({'_id': ObjectId(animal_id)})
    if result.deleted_count == 1:
        return jsonify({"message": "Animal deleted successfully!"}), 200
    else:
        return jsonify({"message": "Animal not found!"}), 404

@app.route('/update_animal/<string:animal_id>', methods=['PATCH'])
def update_animal(animal_id):
    data = request.get_json()
    result = collection.update_one({"_id":ObjectId(animal_id)}, {"$set": data})
    if result.matched_count == 1:
        return jsonify({"message":"Animal updated successfully"}), 200
    else:
        return jsonify({"message":"Animal Not Found....."}), 404
    
if __name__ == '__main__':
    app.run(debug=True)
