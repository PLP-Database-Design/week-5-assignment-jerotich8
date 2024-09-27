const express = require('express');
app = express();
const mysql = require('mysql2');
const cors = require ('cors');
const dotenv = require('dotenv');

app.use(express.json());
app.use(cors());
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err)=>{
    if (err) return console.log("Error connecting to mysql");

    console.log("Connected to mysql as id:",db.threadId);
});

app.set('view engine', 'ejs');
app.set ('views', __dirname + '/views');

//question 1;
app.get('/data', (req,res) => {
    db.query('SELECT * FROM patients', (err, results) => {
        if(err){
            console.error(err)
            res.status(500).send('Error Retrieving data');
        }else{
            res.render('data',{results:results});
        }
    });
});


//question 2;
app.get('/provider', (req,res) => {
    db.query('SELECT * FROM providers', (err, results) => {
        if(err){
            console.error(err)
            res.status(500).send('Error Retrieving data');
        }else{
            res.render('provider',{results:results});
        }
    });
});

// question 3;
app.get('/patients/first_name/:firstName', (req,res) => {
    const {firstName} = req.params;
    db.query('SELECT * FROM patients WHERE first_name = ?', [firstName], (err, results) => {
        if(err){
            console.error(err)
            res.status(500).send('Error Retrieving data');
        }else{
            res.render('patients_name',{results:results, firstName: firstName});
        }
    });
});

// question 4;
app.get('/providers/provider_specialty/:specialty', (req,res) => {
    const {specialty} = req.params;
    db.query('SELECT * FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {
        if(err){
            console.error(err)
            res.status(500).send('Error Retrieving data');
        }else{
            res.render('provider_specialty',{results:results, specialty: specialty});
        }
    });
});

app.listen(process.env.PORT,()=>{
    console.log(`Server listening on port ${process.env.PORT}`);

    console.log('sending message to browser..');
    app.get('/',(req,res)=>{
        res.send('Server Started Successfully!');
    })
})