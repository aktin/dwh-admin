(function() {
    var app = angular.module('aktin.helpers', []);
    app.factory('number2word', function() {
        function isInteger(x) {
            return x % 1 === 0;
        }

        toWords = function (s) {  
            var th = ['','thousand','million', 'billion','trillion'];
            var dg = ['zero','one','two','three','four', 'five','six','seven','eight','nine']; 
            var tn = ['ten','eleven','twelve','thirteen', 'fourteen','fifteen','sixteen', 'seventeen','eighteen','nineteen'];
            var tw = ['twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety']; 

            s = s.toString(); 
            s = s.replace(/[\, ]/g,''); 
            if (s != parseFloat(s)) return 'not a number'; 
            var x = s.indexOf('.'); 
            if (x == -1) x = s.length; 
            if (x > 15) return 'too big'; 
            var n = s.split(''); 
            var str = ''; 
            var sk = 0; 
            for (var i=0; i < x; i++) 
            {
                if ((x-i)%3==2) 
                {
                    if (n[i] == '1') 
                    {
                        str += tn[Number(n[i+1])] + ' '; 
                        i++; 
                        sk=1;
                    }
                    else if (n[i]!=0) 
                    {
                        str += tw[n[i]-2] + ' ';
                        sk=1;
                    }
                }
                else if (n[i]!=0) 
                {
                    str += dg[n[i]] +' '; 
                    if ((x-i)%3==0) str += 'hundred ';
                    sk=1;
                }


                if ((x-i)%3==1)
                {
                    if (sk) str += th[(x-i-1)/3] + ' ';
                    sk=0;
                }
            }
            if (x != s.length)
            {
                var y = s.length; 
                str += 'point '; 
                for (var i=x+1; i<y; i++) str += dg[n[i]] +' ';
            }
            return str.replace(/\s+/g,' ');
        }

        return function(value) {
            if (value && isInteger(value))
                return  toWords(value);
            return value;
        };
    });


    app.factory('storageHelper', ['$window', function($window) {
        return {
            'from' : function (key) {
                return $window.localStorage && $window.localStorage.getItem(key);
            },
            'to' : function (key, value) {
                $window.localStorage && $window.localStorage.setItem(key, value);
            }, 
            'delete' : function (key) {
                $window.localStorage && $window.localStorage.removeItem(key);
            }
        }
    }]);


    var baseUrl = "/aktin/admin/rest";

    setBaseUrl = function (serverurl) {
        baseUrl = serverurl;
    }
    getBaseUrlArray = function () {
        return [
            "/aktin/admin/rest",
        ];
    }
    getBaseUrl = function () {
        return baseUrl
    }

    var endUrlObj = {
        login : "/auth/login",
        adminCheck : "/auth/has/admin",
        userCheck : "/auth/check/",
        userUpdate : "/auth/update",

        prefs : "/prefs",

        reportsList : "/report/archive",
        newMonthlyReport : "/report/monthly/email",
    };


    getUrl = function (partial) {
        var partialUrl = partial;
        if (endUrlObj.hasOwnProperty(partial))
            partialUrl=endUrlObj[partial];
        return baseUrl + partialUrl;
    }

})();