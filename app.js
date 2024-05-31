// Import the Express module
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const pg = require('pg')

// Create an instance of Express
const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = new pg.Client({

    user:"postgres",
    host:"localhost",
    database:"Chitter",
    password:"123456",
    port:"5432"
})

db.connect();



app.get("/",async (req,res)=>{

    try{
        const data = await db.query('Select * from tweet order by id DESC')

       
        res.send(data.rows)
        
    } catch(error){
        console.error(error)
    }



})

app.post('/api/chit-chat',async (req,res)=>{

    const inputData = req.body;
    const {inputText,timestamp}= inputData
   
    try{

        await db.query("INSERT INTO tweet (tweet,timestamp) values ($1,$2)",[inputText,timestamp])
        console.log('Comment saved to the database');

        res.send('Data received successfully!');
        
        


    }catch(error){

        console.error('Error saving data:', error);
        res.status(500).send('Error saving data');
    }
    
})

app.post('/api/chit-chat/comment/:id',async (req,res)=>{

    const inputData = req.body;
    const {comment,timestamp} = inputData;
    const tweet_id = req.params.id;
   
    try{

        await db.query("INSERT INTO comment (comment,timestamp,tweet_id) values ($1,$2,$3)",[comment,timestamp,tweet_id])
        console.log('Comment saved to the database');
        res.send('Data received successfully!');

    }catch(error){

        console.error('Error saving data:', error);
        res.status(500).send('Error saving data');
    }
    
})

app.post('/api/chit-chat/likes/:id',async (req,res)=>{

    console.log(req.params.id);
    const data = req.body
    console.log(data);
    res.send("data received")
})

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
