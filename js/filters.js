var Filters = angular.module("Filters", [])

        .filter("promediar", [
            function () {
                return function (array) {
                    var average = 0;
                    var total = 0;
                    var a = 0;
                    angular.forEach(array, function (value, key) {
                        a++;
                        total += value;
                    });
                    average = total / a;
                    if (isNaN(average))
                        average = 0;
                    return average;
                }
            }
        ])
        .filter("contarvalorados", [
            function () {
                return function (array) {
                    var a = 0;
                    angular.forEach(array, function (value, key) {
                        a++;
                    });
                    return a;
                }
            }
        ])
        .filter('firstUpper', function () {
            return function (input, scope) {
                return input ? input.substring(0, 1).toUpperCase() + input.substring(1).toLowerCase() : "";
            }
        });
;