var express = require('express');
var mongoose = require('mongoose');
var seed = require("./seed")
var pet = require("./models/pet");
var NodeGeocoder = require('node-geocoder');
var bodyParser = require("body-parser");

var options = {
  provider: 'google',
 
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyDf45GAUkHmge3JDiJETEN_0nlRiAGmQV4', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
 
var geocoder = NodeGeocoder(options);

mongoose.connect("mongodb://Li:7474974a@ds211558.mlab.com:11558/petweather");

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
seed();

var currentId = 3;

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("pet server start");
});

app.get("/",function(req,res){
    pet.find({}, function(err,allpet){
        if(err){
            console.log(err);
        }
        else{
            res.send(allpet);
        }
    });
    //res.send("pet page");
});

app.post("/new",function(req,res){
    //console.log(req);
    var name = req.body.name;
    var breed = req.body.breed;
    var location = req.body.location;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    pet.find({ name: name, breed: breed }, function(err,result){
        if(err){
            console.log(err);
        }
        else{
            if(result.length != 0){
                console.log(result.length);
                res.send("fail, data already exists");
            }
            else{
                geocoder.geocode(location, function(err,result){
                    if(err){
                        console.log(err);
                    }
                    else{
                        //console.log(result);
                        if(result[0].latitude != latitude || result[0].longitude != longitude){
                            //console.log("latitude"+result.latitude+","+"longitude"+result.longitude);
                            res.send("fail, location not match latitute or longitude");
                        }
                        else{
                            var new_pet = {
                                id: currentId,
                                name: name,
                                type: req.body.type,
                                breed: breed,
                                location: location,
                                latitude: latitude,
                                longitude: longitude
                            }
                            pet.create(new_pet,function(err,pet){
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    res.redirect("https://petinterface.herokuapp.com/");
                                }
                            })
                        }
                    }
                })
            }
        }
    })
    
});

app.get("/pets/:id",function(req,res){
    pet.find({ id: req.params.id },function(err,pet){
        if(err){
            console.log(err);
        }
        else{
            res.send(pet);
        }
    })
});


