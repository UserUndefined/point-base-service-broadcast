android.content.BroadcastReceiver.BroadcastReceiver.extend("com.tns.broadcastreceivers.NotificationServiceStarterReceiver", {
    onReceive: function() {
        var helper = require("../service-helper2");
        var utils = require("utils/utils");
        helper.setupAlarm(utils.ad.getApplicationContext());
    }
});