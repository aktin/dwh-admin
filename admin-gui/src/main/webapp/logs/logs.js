(function() {
    var logApp = angular.module('aktin.logs', []);

    logApp.controller('LogsController', ['$http', '$filter', function($http, $filter){
        var logApp = this;

        logApp.selectedLevel = -1;

        logApp.logs = function () {
            if (logApp.selectedLevel < 0) {
                return dummyLogs;
            } else {
                return _.filter(dummyLogs, function (log){
                    return logApp.getLevel(log.level) === logApp.getLevel(logApp.selectedLevel);
                });
            }
        }
        // $http.get('/aktin/admin/log?level=WARNING').then(...)
        logApp.getLevel = function (level) {
            // if (level < logLevels.info) {
            //     return 'all';
            // } 
            if (level < logLevels.debug) {
                return 'info';
            } 
            if (level < logLevels.error) {
                return 'debug';
            }
            return 'error';
        };

        logApp.logLevels = logLevels;

        logApp.colorCode = function (level) {
            colorCodes = {};
            // colorCodes[logLevels.all] = 'blue'; //'#808080';
            colorCodes[logLevels.info] = 'grey'; //'#808080';
            colorCodes[logLevels.debug] = 'orange'; //'#FFA500';
            colorCodes[logLevels.error] = 'red'; //'#800000';

            

            return colorCodes[logLevels[logApp.getLevel(level)]];
        };

        logApp.showTime = function (timestamp) {
            return $filter('date')(new Date(+timestamp), 'EEE dd.MM.yyyy HH:mm:ss,sss') + " @" + timestamp;
        }


        logApp.selectLevel = function (level) {
            logApp.selectedLevel = level;
        }

        // console.log(logApp);
        $('.ui.dropdown').dropdown();
    }]);

    var logLevels = {
        // all : -1, 
    	info : 0,
    	debug : 100,
    	error : 200,
    }

    var dummyLogs = [
    	{
    		timestamp : '1463134191370',
    		source : 'apache2', // ['httpd, i2b2, jboss, ...']
    		level : logLevels.error,
    		text : "[mpm_prefork:notice] [pid 13861] AH00163: Apache/2.4.10 (Debian) configured -- resuming normal operations"
    	},
    	{
    		timestamp : '1463134191370',
    		source : 'apache2', // ['httpd, i2b2, jboss, ...']
    		level : logLevels.error,
    		text : "[core:notice] [pid 13861] AH00094: Command line: '/usr/sbin/apache2'"
    	},
    	{
    		timestamp : '1463134191370',
    		source : 'apache2',
    		level : logLevels.info,
    		text : "10.0.2.2 - - [31/May/2016:09:15:08 +0000] \"GET /webclient/js-ext/yui/build/animation/animation.js HTTP/1.1\" 200 10216 \"http://localhost/webclient/\" \"Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36\"",
    	},
        {
            timestamp : '1463134191370',
            source : 'apache2', // ['httpd, i2b2, jboss, ...']
            level : logLevels.debug,
            text : "[core:notice] [pid 13861] AH00094: Command line: '/usr/sbin/apache2'"
        },
    ];
})();
