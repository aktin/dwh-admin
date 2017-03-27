(function() {
    var reportApp = angular.module('aktin.reports', []);
// get reports reportsList
// id 
    reportApp.controller('ReportsController', ['$http', '$scope', '$filter', '$timeout', function($http, $scope, $filter, $timeout){
        var reportApp = this;
        reportApp.curRoute = 'overview';

        var reportList = false;
        reportApp.meta = {
            lastReport : 0,
            successCount : 0,
            failCount : 0,
        }

        reportApp.setRoute = function (routeName) {
            reportApp.curRoute = routeName;
        }

        reportApp.isRoute = function (routeName) { 
            return reportApp.curRoute===routeName;
        }

        reportApp.getReports = function () {
            if (!reportList) {
                // reports are not loaded yet. load and then wait
                _.throttle($http.get(getUrl('reportsList')).then(
                    function success (response) {
                        console.log(response);
                        reportList = _.each(response.data, function (elem, ind) {
                            elem.linkAble = (elem.status === "Completed");
                            elem.link = getUrl('reportsList')+'/'+elem.id;
                            if (elem.linkAble) {
                                reportApp.meta.successCount ++;
                            } else {
                                elem.link = elem.status;
                                reportApp.meta.failCount ++;
                            }
                            reportApp.meta.lastReport=elem;
                        });
                        // reportApp.meta.lastReport = reportList.length;
                    }, function error (response) {

                    }
                ), 300);
                reportList = true;
            }
            return reportList;
        }

        reportApp.linkAble = function (report) {
            return report.status === "Completed";
        }

        reportApp.link = function (report) {

        }

    }]);

    var REPORTRIGHTS = [
        'VIEW', // view older reports
        'EDIT', // edit report templates
        'CREATE', // create new reports
    ];

    reportApp.directive('reportView', function () {
        return {
            restrict : 'AEC',
            templateUrl : "reports/reportView.html",
            scope : {
                report : '=',
            },
            link: function(scope, element, attrs){
              console.log('test', scope.report)
            }
        }
    });

})();
