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
            if (routeName==='newReport') {
                // reportApp.curRoute='overview';
                $http.post(getUrl('newMonthlyReport'));
                getHttpReports(true);
            }
        }

        reportApp.isRoute = function (routeName) { 
            return reportApp.curRoute===routeName;
        }

        reportApp.getReports = function () {
            if (!reportList) {
                // reports are not loaded yet. load and then wait
                getHttpReports();
                reportList = [];
            }
            return reportList;
        }

        var reportPromise = false;
        // throttled and timed call. everey 1 min
        var getHttpReports = function (force) {
            console.log('calling reports', (new Date).toLocaleString(), reportPromise)
            if (force && typeof reportPromise === 'object') {
                console.log('cancelling out older promise')
                $timeout.cancel(reportPromise);
                reportPromise = false;
            }

                reportPromise = true;
                // _.throttle(
                $http.get(getUrl('reportsList')).then(
                    function success (response) {
                        // console.log(response);
                        reportList = _.each(response.data, function (elem, ind) {
                            elem.linkAble = (elem.status === "Completed");
                            elem.link = getUrl('reportsList')+'/'+elem.id;
                            elem.statusCss = getReportStatusCss(elem);
                            if (elem.linkAble) {
                                reportApp.meta.successCount ++;
                            } else {
                                elem.link = elem.status;
                                reportApp.meta.failCount ++;
                            }
                            reportApp.meta.lastReport=elem;
                            return elem;
                        });
                        // reportApp.meta.lastReport = reportList.length;
                        reportPromise = $timeout(getHttpReports, 10000);
                    }, function error (response) {

                    }
                )
                // , 300);
            
        }

        var getReportStatusCss = function (report) {
            var cssObj = {
                'font-weight' : 700,
            }
            switch (report.status) {
                case 'Completed' :
                    cssObj.color = '#0fc50f';
                    break;
                case 'Waiting' : 
                    cssObj.color = '#d37f04';
                    break;
                case 'InsufficientData' : 
                    cssObj.color = '#b22222';
                    break;
            }
            return cssObj;
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
        }
    });

})();
