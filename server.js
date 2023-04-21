const express = require ("express");
const bodyParser = require('body-parser');
const bcrypt = require ('bcrypt-nodejs');
const cors = require ("cors");
const knex = require ('knex')
const register = require ('./Controllers/Register')
const signIn = require ('./Controllers/Signin')
const dataBase = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test',
        database: 'smartbrain'
    }

});


const app =  express();



app.use (bodyParser.json());
app.use (cors())





app.post ('/signin', (req,res)=>{signIn.endpointsignin(req,res,dataBase,bcrypt)})

app.post ('/register',(req,res)=> {register.endpointregister (req,res, dataBase,bcrypt)})



app.get ('/profile/:id', (req,res)=>{
    const {id} = req.params;
    dataBase.select('*').from('users').where('id', '=', id)
    .then(user=>{
        if(user.length) {res.json(user[0])}
            else {
                res.status(400).json('not found')
            }
    })
            .catch(err=>res.status(400).json('not found'))
})
    
    



app.put('/image',(req,res)=>{
    const {id} = req.body
    dataBase('users').where('id', '=', id)
    .increment('entries', 1)
    
    .returning('entries')
    .then(entries=> {res.json(entries[0].entries)})
    
    .catch(err=>res.status(400).json('unable to get entries'))
})

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})



