var mongoose = require('mongoose');
var pet = require('./models/pet');

var default_pet = [
    {
        id: 0,
        name: "John",
        type: "dog",
        breed: "some",
        location: "Edmonton, AB",
        latitude: 53.544389,
        longitude: -113.490927  
    },
     {
        id: 1,
        name: "tom",
        type: "cat",
        breed: "what",
        location: "Edmonton, AB",
        latitude: 51.048615,
        longitude: -114.070846  
    },
     {
        id: 2,
        name: "jerry",
        type: "mouse",
        breed: "how",
        location: "Toronto, ON",
        latitude: 43.653226,
        longitude: -79.383184 
    }
];

function seedDB(){
    // clear database
    pet.remove({},function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("remove pet");
            // add default pet
            default_pet.forEach(function(seed){
                pet.create(seed,function(err,campground){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("newly created pet");
                    }
                });
            });
        }
    });
}

module.exports = seedDB;