angular.module('GMRSapp').factory('AppService', function ($http) {
    var fac = {};

    //get all data service
    fac.GetAllData = function () {
        req = {
            method: 'GET',
            url: '/api/gmrs/data',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        return $http(req);
    }

    fac.GetAllCategories = function () {
        req = {
            method: 'GET',
            url: '/api/gmrs/categories',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        return $http(req);
    }

    fac.GetAllValueType = function () {
        req = {
            method: 'GET',
            url: '/api/gmrs/valuetype',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        return $http(req);
    }

    fac.GetRelevantData = function (rep) {
        var report = {
            category: rep.cCategory.CategoryName,
            startYear: rep.cStartYear,
            endYear: rep.cEndYear,
            reportType: rep.cReportType
        }
        req = {
            method: 'POST',
            url: '/api/gmrs/relevantdata',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: JSON.stringify(report)
        }
        return $http(req);
    }


    return fac;
});