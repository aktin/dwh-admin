(function() {
    var app = angular.module('aktin', ['aktin.properties', 'aktin.home', 'aktin.routing']);



})();


/*
name
descr
field type
value
right (r,w,)
valueset []


local.name (W) local name for this site/clinic, 
local.contact.name (W)
local.contact.email (W)

i2b2.project (R) i2b2 project id "Demo"
i2b2.crc.ds (R) i2b2 jndi datasource "java:/QueryToolDemoDS"
i2b2.lastimport (R) timestamp of last import

smtp.server (W)
smtp.port (W)
smtp.user (W)
smtp.password (WO)
smtp.auth (W) [plain|ssl|...]

query.notification.email (W) list of email addresses to receive notifications for queries
query.result.dir (R)
exchange.lastcontact (R) timestamp of last contact to broker via direct connection or received email timestamp
exchange.method (W) https|email
exchange.https.interval (W) interval in hours between polling connections to broker
exchange.https.broker (W) server name of the AKTIN broker
exchange.https.pool (W) server name of AKTIN pool
exchange.inbox.address (W) email address to receive queries
exchange.inbox.interval (W) interval in hours between checking for new emails
exchange.inbox.server (W) server configuration to check for query emails
exchange.inbox.port (W)
exchange.inbox.protocol (W) [imap|pop3]
exchange.inbox.user (W)
exchange.inbox.password (WO)

*/