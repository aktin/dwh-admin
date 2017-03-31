(function() {
    var app = angular.module('aktin.test', [
    ]);

    app.controller('TestController', ['$http', '$scope',
    	function($http, $scope){
	        var app = this;

	        $scope.tests={
	        	'Test Broker' : {
		        	method : 'GET',
		        	url : '/test/broker/status',
		        	status : 'untested',
		        },
		        'Test Email' : {
		        	method : 'POST',
		        	url : '/test/email/send',
		        	status : 'untested',
		        },
		        'Test R' : {
		        	method : 'POST',
		        	url : '/test/r/run',
		        	status : 'untested',
		        },
		        'Monatsbericht erzeugen und senden' : {
		        	method : 'POST',
		        	url : '/test/r/run',
		        	status : 'untested',
		        	final : 'other',
		        	alert : 'Bitte nun auf E-Mail warten.\nBerichtserzeugung dauert einige Minuten.\nFehlermeldungen werden nur im Wildfly-Logfile angezeigt.',
		        }
	        }

	        app.test = function (testObj) {
	        	testObj.status='testing';

	        	$http({
	        		url: getUrl(testObj.url),
	        		method: testObj.method,
	        		transformResponse: [function (data) {
					  	return data;
					}]
				}).then(
	        		function success (response) {
	        			if (testObj.final) {
	        				testObj.status = testObj.final;
							testObj.message = testObj.alert + '\n\n' + response.data;
	        			} else {
	        				testObj.status = 'success';
							testObj.message = response.data;
	        			}
						app.setColor(testObj);
	        		}, function error (response) {
	        			testObj.status='failure';
						testObj.message = response.data;
						app.setColor(testObj);
	        		}
	        	)
	        }

	        app.setColor = function (testObj) {
	        	switch (testObj.status) {
	        		case 'success' :
	        			testObj.segmentStyle = 'green';
	        			testObj.buttonStyle = 'green basic';
	        			break;
	        		case 'failure' : 
	        			testObj.segmentStyle = 'tertiary red inverted';
	        			testObj.buttonStyle = 'red';
	        			break;
	        		case 'other' : 
	        			testObj.segmentStyle = 'yellow';
	        			testObj.buttonStyle = 'yellow';
	        			break;
	        		default :
	        			testObj.segmentStyle = 'violet';
	        			testObj.buttonStyle = 'violet';
	        	}
	        }
    	}
    ]);

})();
