"use strict";

var http = require("http");

function postLocation(location, callback) {
    http.request({
        url: 'https://generic-receiver-api.herokuapp.com/location',
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify(location),
        timeout: 10000
    }).then(function (response) {
        console.log(response.content.toJSON());
        return callback(null, response);
    }, function (error) {
        console.log(error);
        return callback(error);
    });
};

exports.postLocation = postLocation;