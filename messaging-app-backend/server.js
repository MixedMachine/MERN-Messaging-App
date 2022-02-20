import express from 'express';
import mongoose from 'mongoose';
import Cors from 'cors';
import Messages from './dbMessages.js';
import Pusher from 'pusher';

// App Config
const app = express();
const port = process.env.PORT || 9000;
const mdb_pwd = process.env.MONGO_PWD || "1234abcd";
const connection_url = 'mongodb+srv://admin:' + mdb_pwd + '@mern-cluster.sf9tj.mongodb.net/messagingDB?retryWrites=true&w=majority';
const pusher = new Pusher({
    appId: "1341893",
    key: "5e2d6598accd01a85958",
    secret: "8f89f3aa3230bd9b74a2",
    cluster: "us3",
    useTLS: true
})

// Middleware
app.use(express.json());
app.use(Cors());

//DB Config
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


// API Endpoints
const db = mongoose.connection
db.once("open", () => {
    console.log("DB Connected");
    const msgCollection = db.collection("messagingmessages");
    const changeStream = msgCollection.watch();
    changeStream.on('change', change => {
        console.log(change);
        if(change.operationType === "insert") {
            const messageDetails = change.fullDocument
            pusher.trigger("message", "inserted", {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.recieved
            })
        } else {
            console.log('Error triggering Pusher');
        }
    })
})

app.get("/", (req, res) => {
    res.status(200.).send("Echo:\n"+req.body.message);
})

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {
        if(err)
            res.status(500).send(err);
        else
            res.status(201).send(data);
    })
})
app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
})

// Listener
app.listen(port, () => console.log(`listening on localhost:${port}`))
