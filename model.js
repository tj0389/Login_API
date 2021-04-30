const mongoose=require('mongoose');

mongoose.connect('lmongodb://localhost/tj', {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true,useFindAndModify:false}).then(()=>{
    console.log('We are Connected')}).catch((e)=>{
        console.log(e)
    })

const Schema = new mongoose.Schema({
    email: {
        type:String,
        require:true
    },
    password: {
        type:String,
        require:true
    }
});

const user = mongoose.model('logindata', Schema);

module.expors=user;