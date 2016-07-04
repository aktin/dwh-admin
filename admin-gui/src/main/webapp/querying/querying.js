(function() {
    var queryApp = angular.module('aktin.querying', []);

    queryApp.controller('QueryController', ['$http', '$filter', function($http, $filter){
        var queryApp = this;

        var queryApp.openQueries = openDummyQueries;
    }]);

    // parse from https://developer.mozilla.org/en-US/docs/Introduction_to_using_XPath_in_JavaScript directly or parse to json from xml
    // dwh api src test

    openDummyQueries = [ // from xml query files?
    	{
    		timestamp : '1463134191370', // query receive time
    		timeout : '1463136191370', // query valid till (time to send before!)
    		query : {
    			inquirer : {
    				name : 'Max Musterforscher',
    				contact : {
    					address : 'Domplatz 2',
    					city : 'Magdeburg',
    					zip : '21345',
    					tel : '03802817232',
    					mobile : '0127262827',
    					mail : 'Musterforscher@magedeburg.de',
    				}
    				institution : 'Uniklinikum Magdeburg',
    			}
				description : 'Wie viele sind krank',
				sql : 'SELECT COUNT(*) FROM PATIENTS WHERE true;',
    		}
    	},
    ]
})();
