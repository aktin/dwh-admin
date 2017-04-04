(function() {
    var reportApp = angular.module('aktin.reports', []);
// get reports reportsList
// id 
    reportApp.controller('ReportsController', ['$http', '$scope', '$filter', '$timeout', '$sce', function($http, $scope, $filter, $timeout, $sce){
        var reportApp = this;
        reportApp.curRoute = 'overview';

        $scope.reportList = false;
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


        var reportPromise = false;
        // throttled and timed call. everey 1 min
        var getHttpReports = function (once) {
            // console.log('calling reports', (new Date).toLocaleString(), $scope.reportList.length, reportPromise)

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
            if (!reportPromise)
                reportPromise = true;
            // _.throttle(
            $http.get(getUrl('reportsList')).then(
                function success (response) {
                    // console.log(response);
                    $scope.reportList = _.each(response.data, function (elem, ind) {
                        elem.linkAble = (elem.status === "Completed");
                        elem.link = getUrl('reportsList')+'/'+elem.id;
                        elem.statusCss = getReportStatusCss(elem);
                        if (elem.linkAble) {
                            reportApp.meta.successCount ++;
                        } else {
                            elem.link = elem.status;
                            reportApp.meta.failCount ++;
                        }
                        return elem;
                    });
                    // reportApp.meta.lastReport = reportList.length;
                    if ($scope.reportList.length > 0){
                        reportApp.meta.lastReport=$scope.reportList[$scope.reportList.length-1];
                        if (reportApp.meta.lastReport.linkAble)
                            $scope.lastReportPdf = $sce.trustAsResourceUrl(reportApp.meta.lastReport.link);
                    }                    

                    if (!once)
                        reportPromise = $timeout(getHttpReports, 60000);
                }, function error (response) {

                }
            )
        }

        $scope.lastReportPdf = false;

        reportApp.getReports = function () {
            if (!$scope.reportList) {
                // reports are not loaded yet. load and then wait
                getHttpReports(false);
                $scope.reportList = [];
            }
            return $scope.reportList;
        }
        reportApp.getReports();


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
