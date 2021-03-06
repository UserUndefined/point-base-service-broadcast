var geolocation = require("nativescript-geolocation");
var dataService = require('../data.service');
var moment = require('moment');

android.app.IntentService.extend("com.tns.notifications.NotificationIntentService", {
    onHandleIntent: function (intent) {
        console.log('NotificationIntentService  onHandleIntent called');
        var action = intent.getAction();
        if ("ACTION_START" == action) {
            processStartSendLocation(function(err, result){
                if (!err){
                    processStartNotification();
                }
            })
        }

        android.support.v4.content.WakefulBroadcastReceiver.completeWakefulIntent(intent);
    }
});

function processStartSendLocation(callback){
    console.log('processStartSendLocation called');
    getLocation(function (err, location) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        location.user = 'Test01';
        location.dateTime = moment().format();
        dataService.postLocation(location, function (err, result) {
            if (result) {
                console.log(JSON.stringify(result));
                return callback(null, result);
            }
            else {
                console.log(JSON.stringify('no result'));
                return callback('no result');
            }
        });
    });
}

function getLocation(callback) {
    console.log('getLocation called');
    var location = geolocation.getCurrentLocation({ timeout: 20000 }).then(function (loc) {
        if (loc && loc.latitude && loc.longitude) {
            console.log(loc.latitude);
            return callback(null, loc);
        }
        else {
            console.log('Location not found. Timed out?');
            return callback('Location not found');
        }
    }, function (e) {
        console.log(JSON.stringify(e));
        return callback(e.message);
        //return callback(null, {latitude: 50.0000, longitude: 1.00000});
    });
}

function processStartNotification() {
    // Do something. For example, fetch fresh data from backend to create a rich notification?

    console.log('processStartNotification called');

    var utils = require("utils/utils");
    var context = utils.ad.getApplicationContext();

    var builder = new android.app.Notification.Builder(context);
    builder.setContentTitle("Location Submitted")
        .setAutoCancel(true)
        //.setColor(android.R.color.holo_purple)//getResources().getColor(R.color.colorAccent))
        .setContentText("This notification has been triggered by PointBase")
        .setVibrate([100, 200, 100])
        .setSmallIcon(android.R.drawable.btn_star_big_on);

        // will open main NativeScript activity when the notification is pressed
    var mainIntent = new android.content.Intent(context, com.tns.NativeScriptActivity.class); 
    var pendingIntent = android.app.PendingIntent.getActivity(context,
        1,
        mainIntent,
        android.app.PendingIntent.FLAG_UPDATE_CURRENT);
    builder.setContentIntent(pendingIntent);
    builder.setDeleteIntent(getDeleteIntent(context));

    var manager = context.getSystemService(android.content.Context.NOTIFICATION_SERVICE);
    manager.notify(1, builder.build());
}

function getDeleteIntent(context) {
        var intent = new android.content.Intent(context, com.tns.broadcastreceivers.NotificationEventReceiver.class);
        intent.setAction("ACTION_DELETE_NOTIFICATION");
        return android.app.PendingIntent.getBroadcast(context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
}