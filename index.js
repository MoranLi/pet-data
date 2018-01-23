var express = require('express');
var mongoose = require('mongoose');
var seed = require("./seed")
var pet = require("./models/pet");
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
 
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
 
var geocoder = NodeGeocoder(options);

mongoose.connect("mongodb://localhost/pets");

var app = express();
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

app.post("/new/:name/:type/:breed/:location/:latitude/:longitude",function(req,res){
    var name = req.params.name;
    var breed = req.params.breed;
    var location = req.params.location;
    var latitude = req.params.latitude;
    var longitude = req.params.longitude;
    pet.find({ name: name, breed: breed }, function(err,result){
        if(err){
            console.log(err);
        }
        else{
            if(result != []){
                res.send("fail, data already exists");
            }
            else{
                geocoder.geocode(location, function(err,result){
                    if(err){
                        console.log(err);
                    }
                    else{
                        if(result.latitude != latitude || result.longitude != longitude){
                            res.send("fail, location not match latitute or longitude");
                        }
                        else{
                            var new_pet = {
                                id: currentId,
                                name: name,
                                type: req.params.type,
                                breed: breed,
                                location: location,
                                latitude: latitude,
                                longitude: longitude
                            }
                            pet.create(new_pet,function(err,pet){
                                if(err){
                                    console.log(err);
                                }
                            })
                        }
                    }
                })
            }
        }
    })
    
});

app.get("/:id",function(req,res){
    pet.find({ id: req.params.id },function(err,pet){
        if(err){
            console.log(err);
        }
        else{
            res.send(pet);
        }
    })
});


