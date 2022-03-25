const mongoose=require('mongoose')
//create schema  here
const ProductSchema=mongoose.Schema({
    site:{
        type:String,
        required:true
    },
    Title:{
        type:String,
        required:true
    },
    FirstPrice:{
        type:String,
        required:false
    },
    OfferPrice:{
        type:String,
        required:true
    },
    Image:{
        type:String,
        required:true
    },
    Rating:{
        type:String,
        required:false
    }

})
//Modal creation For THis Schema
const ProductDetails=mongoose.model('products',ProductSchema);
module.exports={ProductDetails}