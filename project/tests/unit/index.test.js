import { MongoClient } from 'mongodb';
import { describe, it, expect, test, beforeAll } from 'vitest';

var Express = require('express');
var Mongoclient = require('mongodb').MongoClient;
var cors = require('cors');

const multer = require('multer');

var app = Express();
app.use(cors());

var URI = 'mongodb+srv://jack:1234@cluster0.lwomw.mongodb.net/?retryWrites=true&w=majority';
var DATABASEName = 'Teamproject';
var database;

async function connectToDatabase() {
    const client = await MongoClient.connect(URI);
    database = client.db(DATABASEName);
}

async function insertDB() {
    try {
        await database.collection('Asset').insertOne({
            asset_id: 1,
            title: "FileNumberOne",
            link: "www.w3schools.com",
            MetaData: {
                lineNum: 50,
                'programming-language': "Java"
            }
        });
    } catch (error) {
        console.log("Could not query db: ", error);
        throw error;
    }
}
async function initialiseDatabase() {
    await connectToDatabase();
    await insertDB();
}

initialiseDatabase()

async function select(query) {
    try {
        const asset = await database.collection('Asset').findOne(query);
        return asset;
    }  catch (error) {
        console.log("Could not query db: ", error);
        throw error;
    }
}

beforeAll(async () => {
    await connectToDatabase();
    await insertDB();
  });
  
test("SelectAssetID", async () => {
    let query = {asset_id: 1}
    const result = await select(query)
    expect(result.asset_id).toEqual(1);
})

test("SelectAssetTitle", async () => {
    let query = {title: "FileNumberOne"}
    const result = await select(query)
    expect(result.title).toEqual("FileNumberOne");
})
    
test("SelectAssetProgrammingLanguage", async () => {
    let query = {asset_id: 1}
	const result = await select(query)
	expect(result.MetaData['programming-language']).toEqual("Java");
})

test("SelectAssetLineNum", async () => {
    let query = {asset_id: 1}
	const result = await select(query)
	expect(result.MetaData.lineNum).toEqual(50);
})

test("SelectAssetLink", async () => {
    let query = {asset_id: 1}
	const result = await select(query)
	expect(result.link).toEqual("www.w3schools.com");
})