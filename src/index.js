const press = require('express')
const app = express()
const bodyParser = require("body-parser");
const fs = require("fs");
const port = 8080
app.use(express.urlencoded());
const studentArray = require('./InitialData')

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// your code goes here
app.get('/api/student', (req, res)=>{
    res.send(studentArray.studentArray);
});

app.get('/api/student/:id', (req, res)=>{
    const idToSend = req.params.id;
    let flag = 0;
    studentArray.studentArray.forEach((student)=>{
        if(student.id === Number(idToSend)){
            flag = 1;
            res.send({
                id: student.id,
                name: student.name,
                currentClass: parseInt(student.currentClass),
                division: student.division
            })
        }
    });
    if(flag === 0){
        res.sendStatus(404);
    }
});

app.post('/api/student', (req, res)=>{

    if(Object.keys(req.body).length < 3){
        res.sendStatus(400);
    }else{
        const currStudent = {
            id: studentArray.studentArray.length+1,
            name: req.body.name,
            currentClass: parseInt(req.body.currentClass),
            division: req.body.division
        }
        studentArray.push2Arr(currStudent);
        res.set('content-type','application/json');
        res.send({id: studentArray.studentArray.length});
    }
});

app.put('/api/student/:id', (req, res)=>{
    const idToChange = req.params.id;
    const obj = req.body;
    let flag = 0;
    studentArray.studentArray.forEach((student)=>{
        if(student.id === Number(idToChange)){
            flag = 1;
            for(key in obj){
                if(key === 'name'){
                    student.name = obj[key];
                }else if (key === 'currentClass'){
                    student.currentClass = parseInt(obj[key]);
                }else if(key === 'division'){
                    student.division = obj[key];
                }
            }
            res.sendStatus(200);
        }
    });
    if(flag === 0){
        res.sendStatus(400);
    }
});

app.delete('/api/student/:id', (req, res)=>{
    studentArray.studentArray.forEach((student, idx)=>{
        if(student.id === Number(req.params.id)){
            studentArray.splice2Arr(idx, 1);
            res.sendStatus(200);
        }
    })
    res.sendStatus(404);
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   