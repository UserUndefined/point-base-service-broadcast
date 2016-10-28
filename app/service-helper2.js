function getStartPendingIntent(context) {
    console.log('getStartPendingIntent called');
    var intent = new android.content.Intent(context, com.tns.broadcastreceivers.NotificationEventReceiver.class);
    intent.setAction("ACTION_START_NOTIFICATION_SERVICE");
    return android.app.PendingIntent.getBroadcast(context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
}

function setupAlarm(context) {
    var alarmManager = context.getSystemService(android.content.Context.ALARM_SERVICE);
    var alarmIntent = getStartPendingIntent(context);
    alarmManager.setRepeating(android.app.AlarmManager.RTC_WAKEUP,
        java.lang.System.currentTimeMillis(),
        1000 * 60 * 30,
        alarmIntent);
}

module.exports.setupAlarm = setupAlarm;