const mongoose = require('mongoose');
const express = require("express");
require('dotenv').config()
const uri = `mongodb+srv://admin:${process.env.MONGOPSW}@cluster0.0efpnhn.mongodb.net/?retryWrites=true&w=majority`;

const eventSchema = new mongoose.Schema({
    title: String,
    start: Date,
    _id: Number,
    valid: Boolean,
})
const CalendarEvent = mongoose.model('Event', eventSchema);

const studentSchema = new mongoose.Schema({
    name: String,
    _id: String,
})
const Student = mongoose.model("Student", studentSchema)

connectDB().catch(err => console.log(err));

async function connectDB() {
    await mongoose.connect(uri);
}

const app = express();
app.use(express.static("public"));
app.use(express.json());

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening at ${port}`);
});

app.post("/addEvent", async (req, res) => {
    const stud = await Student.findById(req.body.title);
    if (stud) {
        try {
            const ev = new CalendarEvent({ title: req.body.title, start: new Date(req.body.start), _id: Number(req.body.id), valid: true })
            ev.save((err, r) => {
                if (err){ 
                    console.log(err)
                    res.status(500).json(err);
                }
                else res.status(200).json("OK");
            })
        }catch(error) {
            res.status(500).json(error);
        }
    } else {
        res.status(401).json("Codice non valido");
    }
})

app.get("/getEvents", async (req, res) => {
    const arr = await CalendarEvent.find({});
    res.status(200).json(arr);
})

app.get("/removeEvent", async (req, res) => {
    const arr = await CalendarEvent.updateOne({ _id: req.query.id }, {valid: false});
    res.status(200).json(arr);
})

app.post("/addStudent", async (req, res) => {
    const stud = new Student({ name: req.body.name, _id: req.body.code })
    stud.save((err, r) => {
        if (err) res.status(500).json("Error");
        else res.status(200).json("OK");
    })
})

app.get("/getStudents", async (req, res) => {
    if(req.query.psw != 190909) {
        res.status(403).json("error");
        return 
    }
    const arr = await Student.find({});
    res.status(200).json(arr);
})

app.get("/checkAuth", (req, res) => {
    if(req.query.psw != 190909) res.status(403).json("error");
    else res.status(200).json(ok);
})