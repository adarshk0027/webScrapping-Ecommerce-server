const express = require('express')
const mongoose = require('mongoose')
const PORT =process.env.PORT || 5000
const app = express()
const Db_url = 'mongodb+srv://adarshk0027:adarshk0027@cluster0.snbxi.mongodb.net/webScraper'
const { ProductDetails } = require('./dbschema')
const cors=require('cors')
app.use(cors());
app.use(express.json());
const GetProductDataAmazon = require('./webScrap')
//mongoose connection
mongoose.connect(Db_url)
mongoose.connection
  .once('open', () => console.log('Connected Mongoose '))
  .on('error', error => {
    console.log('My Error:::' + error)
  })
//mongodb+srv://adarshk0027:<password>@cluster0.snbxi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
//webScraper
//Route Set Up

app.get('/', async (req, res) => {
  try {
    const DataRetrieve = await ProductDetails.find()
    if (DataRetrieve.length == 0) {
      const DATA_ADDED = await GetProductDataAmazon()
    }
    else{
        var Datas= await ProductDetails.find()
    }
    res.json({
      data: Datas,
      type:typeof Datas
    })
  } catch (error) {
    console.log(error)
    res.send({
      StatusCode: 400,
      message: 'INTERNAL eRROR'
    })
  }
})

app.listen(PORT, () => {
  console.log('Port Is Connected With', PORT)
})
