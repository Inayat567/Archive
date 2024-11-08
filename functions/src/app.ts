const express = require('express');
const cors = require('cors');
const streamProvider = require('./streamProvider')

const app = express();
app.use(express.json());

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get('/', (req: any, res: any)=>{
  res.status(200).send({
    getter: Date.now(),
  });
})

app.post('/token', (req: any, res:any) => {
  try{
    streamProvider.getToken(req.body)
    .then((data: any)=>{ // data.token
      res.send(JSON.stringify(data)); 
    })
    .catch((error: any) => {
      res.status(500).send({
        message: 'Error while generating token',
        error,
      })
    })
  }catch(error: any){
    res.status(500).send({
      message: 'Error while generating token',
      error,
    }); // TODO - set error status
  }
})

app.post('/room', (req: any, res: any)=>{
  const params = req.body;
  try{
    // check if room exists
    streamProvider.getRoom(params)
    .then(async (data: any)=>{
      res.status(200).send(JSON.stringify(data)); 
      // TODO - data.enabled can be false if it was modified from dashbaord and wont work on frontend
      // Question: can/should room be ended after a call? or reused?
    })
    .catch((error: any)=>{
      // create new room when it doesnt exist
      tryCreatingRoom(params, res);
    })
  }catch(error: any){
    res.status(500).send({
      message: 'Failed creating room',
      error,
    }); 
  }
})

function tryCreatingRoom(params: any, res: any){
  streamProvider.createRoom(params)
  .then((data: any)=>{
    res.status(200).send(JSON.stringify(data)); 
  })
  .catch((error: any) => {
      res.status(500).send({
        message: 'Error while creating room',
        error,
      })
  })
}

module.exports = app;
