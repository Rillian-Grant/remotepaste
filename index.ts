import express from 'express';
import config from './config';
import sqlite3 from "sqlite3";

const app = express();
const db = new sqlite3.Database('test.db');
db.exec(
    `CREATE TABLE IF NOT EXISTS data (
        user_id PRIMARY KEY,
        data BLOB
    );`,
    (err) => {
        if (err) {
            throw err;
        }
    }
);

app.get(["/", "/healthcheck"], (req, res) => {
    res.send("OK");
});

app.get("/api/v1/config", (req, res) => {
    res.send(JSON.stringify(config));
});

app.get("/api/v1/:user_id", async (req, res) => {
    const user_id = req.params.user_id;
    const data = await db.get(user_id);
    if (data === null) {
        console.log(`User ${user_id} not found`);
    } else {
        console.log(`User ${user_id} found. Data: ${data.toString()}`);
    }
    res.send(data);
});

app.put("/api/v1/:user_id", async (req, res) => {
    const user_id = req.params.user_id;
    if (req.headers['content-type'] != "application/octet-stream") {
        res.status(400).send("Bad request");
        return;
    }
    req.setEncoding("binary");
    console.log("Request body: " + req.body);
    db.run(`INSERT OR REPLACE INTO data (user_id, data) VALUES (?, ?)`, [user_id, req.body], (err) => {
        if (err) {
            res.status(500).send("Internal server error");
        } else {
            res.status(200).send("OK");
        }
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});