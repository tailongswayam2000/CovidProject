const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/donorsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

 // const https = require("https");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname+"/public"));

// https.get("https://api.covid19india.org/data.json",function(response){
//   response.on("data",function(data){
//     const arr=cases_time_series;
//   })
// })



const stateArray = ['Andhra Pradesh','Arunachal Pradesh','Andaman and Nicobar Islands','Assam','Bihar','Chandigarh','Chattisgarh','Dadra and Nagar Haveli','Daman and Diu','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Ladakh','Lakshadweep','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];



const donorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true]
  },
  lastName: {
    type: String,
    required: [true]
  },
  email: {
    type: String,
    required: [true]
  },
  gender: {
    type: String,
    required: [true]
  },
  age: {
    type: Number,
    required: [true],
  },
  covidDate: {
    type: String,
    required: [true]
  },
  mobileNumber: {
    type: Number,
    required: [true]
  },
  bloodGroup: {
    type: String,
    required: [true]
  },
  city: {
    type: String,
    required: [true]
  },
  state: {
    type: String,
    required: [true]
  },

});

const DonorEntry = new mongoose.model("Donor", donorSchema);

app.post("/Donor",function(req,res){


  const stateReqd = req.body.stateRequired;

  DonorEntry.find({state:stateReqd},function(err,entries){
    if(err){
      console.log(err);
    }
    else{
      res.render("Donor",{donorData:entries, stateReqd:stateReqd});
    }
  });
});

 app.post("/plasmaRegistration",function(req,res){
   const person = new DonorEntry({
     firstName: req.body.firstName,
     lastName:req.body.lastName,
     email: req.body.email,
     gender:req.body.gender,
     age: req.body.age,
     covidDate: req.body.covidDate,
     mobileNumber: req.body.mobile,
     bloodGroup:req.body.bloodGroup,
     city:req.body.city,
     state:req.body.state,
   });

   person.save();

   if(res.statusCode>=200 && res.statusCode<=299) {
     res.redirect("/plasmaRegistration/success/"+person._id);
   }
   else{
     res.redirect("/plasmaRegistration/failure/"+person._id);
   }
 })


app.get("/plasmaRegistration/:input1/:input2",function(req,res){
  const keyword=req.params.input1;
  const userID=req.params.input2;
  DonorEntry.find({_id:userID},function(err,entries){
    if(err){
      console.log(err);
    }
    else{
      res.render("output",{screen:keyword,updata:entries});
    }
  });

});

app.get("/update/:input",function(req,res){
  const userID=req.params.input;
  DonorEntry.find({_id:userID},function(err,entries){
    if(err){
      console.log(err);
    }
    else{
      res.render("update",{updata:entries,stateArray:stateArray});
    }
  });

});

app.post("/update/:input", function(req,res){
  const userID = req.params.input;
  DonorEntry.findOneAndUpdate({_id:userID},{
    firstName: req.body.firstName,
    lastName:req.body.lastName,
    email: req.body.email,
    gender:req.body.gender,
    age: req.body.age,
    covidDate: req.body.covidDate,
    mobileNumber: req.body.mobile,
    bloodGroup:req.body.bloodGroup,
    city:req.body.city,
    state:req.body.state,
  },function(err,suides){
    if(!err){
res.redirect("/plasmaRegistration/success/"+userID);
    }
  });
})

// let map=new Map();
// map.set("rajasthan",{count:1});
// for(let i=0;i<stateArray.length; i++){
//   DonorEntry.find({state:stateArray[i]},function(err,entries){
//     if(err){
//       console.log(err);
//     }
//     else{
//       console.log( entries.length );
//       map.set(stateArray[i],{count:entries.length});
//
//     }
//   });
//   console.log(map);ok
// }



app.get("/", function(req, res) {
  res.render("home", {});
});

app.get("/plasma", function(req, res) {
  res.render("plasma", {});
})

app.get("/plasmaRegistration", function(req, res) {
  res.render("plasmaRegistration", {stateArray:stateArray});
});

app.get("/plasmaDataInput", function(req, res) {
  res.render("plasmaDataInput", {stateArray:stateArray});
})

app.get("/contactUs", function(req, res) {
  res.render("contactUs", {});
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
