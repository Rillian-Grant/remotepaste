import express from 'express';

const app = express();

app.get("/healthcheck", (req, res) => {
    res.send("OK");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});