angular.module('GMRSapp').factory('AppService', function ($http) {
    var fac = {};

    //get data for create report modal
    fac.GetCreateReportModalData = function () {
        req = {
            method: 'GET',
            url: '/api/gmrs/reportmodal',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        return $http(req);
    }

    //get list of category descripstions
    fac.GetCategoriesDesc = function (catName) {
        req = {
            method: 'GET',
            url: '/api/gmrs/categories/' + catName,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        return $http(req);
    }

    //get list of value type descripstions
    fac.GetValueTypeDesc = function (valTpeDesc) {
        req = {
            method: 'GET',
            url: '/api/gmrs/valtype/' + valTpeDesc,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        return $http(req);
    }

    //get relevant data for report
    fac.GetRelevantData = function (rep) {
        var report;
        switch (rep.id) {
            case 1:
            case 4:
                report = {
                    category: rep.cCategory.CategoryName,
                    startYear: rep.cStartYear,
                    endYear: rep.cEndYear,
                    reportType: rep.cReportType,
                    catDesc: rep.cCategoryDesc,
                    id: rep.id
                }
                break;
            case 2:
                report = {
                    category: rep.cCategory.CategoryName,
                    Year: rep.cStartYear,
                    reportType: rep.cReportType,
                    typeDesc: rep.cValueTypeDesc,
                    id: rep.id
                }
                break;
            case 3:
                report = {
                    category: rep.cCategory.CategoryName,
                    Year: rep.cStartYear,
                    reportType: rep.cReportType,
                    id: rep.id
                }
                break;

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