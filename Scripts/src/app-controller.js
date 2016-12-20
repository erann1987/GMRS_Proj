angular.module('GMRSapp')
	.controller('AppController', ['$scope', 'AppService', 'DTOptionsBuilder', function ($scope, AppService, DTOptionsBuilder) {

	    $scope.chart;
	    $scope.showReport = false;
	    $scope.showReport2 = false;
	    $scopecatDescChoosed = false;
	    $scope.ReportTypeChoosed = false;

	    $scope.reportChart = {
	        categories: [],
	        series: []
	    }

	    $scope.report = {
            id: null,
	        reportType: [],
            valueTypeDesc: [],
	        categories: [],
            categoryDesc:[],
            years: [],
            possibleEndYears: [],
	        cCategory: null,
            cCategoryDesc: '',
	        cReportType: null,
	        cStartYear: null,
	        cValueTypeDesc: null,
	        cEndYear: null,
	        data: []
	    }

        
        //when user picked a category in create roport modal
	    $scope.$watch('report.cCategory', function (newValue, oldValue) {
	        if (newValue !== oldValue) {
	            $.loader({
	                className: "blue-with-image-2",
	                content: ''
	            });
	            AppService.GetCategoriesDesc($scope.report.cCategory.CategoryName).then(function (results) {
	                $scope.report.categoryDesc = results.data;
	                $.loader('close');
	                $scope.catDescChoosed = true;
	            }, function (e) {
	                $.loader('close');
	                alert("getting categories description list failed");
	            });
	        }
	    });
        
	    //when user picked a value type in create roport modal
	    $scope.$watch('report.cReportType', function (newValue, oldValue) {
	        if (newValue !== oldValue) {
	            $.loader({
	                className: "blue-with-image-2",
	                content: ''
	            });
	            AppService.GetValueTypeDesc($scope.report.cReportType).then(function (results) {
	                $scope.report.valueTypeDesc = results.data;
	                $.loader('close');
	                $scope.$watch(function () {
	                    $('.selectpicker').selectpicker('refresh');
	                });
	                $scope.ReportTypeChoosed = true;
	            }, function (e) {
	                $.loader('close');
	                alert("getting categories description list failed");
	            });
	        }
	    });
	    //when user picked a StartYear in create roport modalreport
	    $scope.$watch('report.cStartYear', function (newValue, oldValue) {
	        if (newValue !== oldValue) {
	            $scope.report.possibleEndYears = Enumerable.From($scope.report.years)
                    .Where(function (x) { return x>= $scope.report.cStartYear })
                    .OrderBy(function (x) { return x })
                    .ToArray();
                $scope.$watch(function () {
	                $('.selectpicker').selectpicker('refresh');
	            });
	        }
	    });
	    //get data for create report modal
	    $scope.createReportButton = function (id) {
	        $scope.report.id = id;
	        $.loader({
	            className: "blue-with-image-2",
	            content: ''
	        });
	        AppService.GetCreateReportModalData().then(function (results) {
	            $scope.report.reportType = results.data.valueTypes;
	            $scope.report.categories = results.data.categories;
	            $scope.report.years = results.data.years;
	            $scope.report.years.sort();
	            $scope.$watch(function () {
	                $('.selectpicker').selectpicker('refresh');
	            });
	            $.loader('close');
	        }, function (e) {
	            $.loader('close');
	            alert("getting categories failed");
	        });
	    }

        //load relevant data for report
	    $scope.loadRelevantData = function () {
	        $.loader({
	            className: "blue-with-image-2",
	            content: ''
	        });
	        AppService.GetRelevantData($scope.report).then(function (results) {
	            $scope.report.data = results.data;
	            $scope.renderDataForChart();
	            $scope.renderDataForTable();
	            $scope.loadChart();
	            switch ($scope.report.id) {
	                case 1:
	                    $scope.showReport = true;
	                    break;
	                case 2:
	                    $scope.showReport2 = true;
	                    break;
	            }
	            $.loader('close');
	        }, function (e) {
	            $.loader('close');
	            alert("getting categories failed");
	        });	                
	    }

	    //render data for chart
	    $scope.renderDataForChart = function () {
	        switch ($scope.report.id) {
	            case 1:
	                $scope.reportChart.categories = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
	                for (i = $scope.report.cStartYear; i <= $scope.report.cEndYear; i++) {
	                    var valArray = Enumerable.From($scope.report.data)
                            .Where(function (x) { return x.Year == i })
                            .OrderBy(function (x) { return x.Month })
                            .Select(function (x) { return x.value })
                            .ToArray();
	                    var seria = {
	                        name: i,
	                        data: valArray
	                    }
	                    $scope.reportChart.series.push(seria);
	                }
	                break;
	            case 2:
	                $scope.reportChart.categories = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
	                for (i = 0; i < $scope.report.categoryDesc.length; i++) {
	                    var valArray = Enumerable.From($scope.report.data)
                            .Where(function (x) { return x.CategoryDesc == $scope.report.categoryDesc[i].CategoryDesc })
                            .OrderBy(function (x) { return x.Month })
                            .Select(function (x) { return x.value })
                            .ToArray();
	                    var seria = {
	                        name: $scope.report.categoryDesc[i].CategoryDesc,
	                        data: valArray
	                    }
	                    $scope.reportChart.series.push(seria);
	                }
	                break;
	        }      
	    }

	    //render data for table
	    $scope.renderDataForTable = function()
	    {
	        switch ($scope.report.id) {
	            case 1:
	                $scope.dTable.type = 'line';
	                $scope.dTable.title = 'גרף ' + $scope.report.cReportType + ' לפי שנים '
	                $scope.dTable.subtitle = $scope.report.cCategory.CategoryName + ': ' + $scope.report.cCategoryDesc;
	                for (i = 1; i < 13; i++) {
	                    var valArray = Enumerable.From($scope.report.data)
                            .Where(function (x) { return x.Month == i })
                            .OrderBy(function (x) { return x.Year })
                            .Select(function (x) { return x.value })
                            .ToArray();
	                    $scope.dTable.data.push(valArray);
	                }

	                for (i = $scope.report.cStartYear; i <= $scope.report.cEndYear; i++) {
	                    $scope.dTable.years.push(i);
	                }
	                $scope.dTable.catDesc = Enumerable.From($scope.report.categoryDesc)
                            .OrderBy(function (x) { return x.CategoryDesc })
                            .Select(function (x) { return x.CategoryDesc })
                            .ToArray();
	                break;
	            case 2:
	                $scope.dTable.type = 'column';
                    $scope.dTable.title = 'גרף ' + $scope.report.cReportType + ' ' + $scope.report.cValueTypeDesc + ' לפי ' + $scope.report.cCategory.CategoryName
	                $scope.dTable.subtitle = 'שנת ' + $scope.report.cStartYear;
	                for (i = 1; i < 13; i++) {
	                    var valArray = Enumerable.From($scope.report.data)
                            .Where(function (x) { return x.Month == i })
                            .OrderBy(function (x) { return x.CategoryDesc })
                            .Select(function (x) { return x.value })
                            .ToArray();
	                    $scope.dTable.data.push(valArray);
	                }

	                for (i = $scope.report.cStartYear; i <= $scope.report.cEndYear; i++) {
	                    $scope.dTable.years.push(i);
	                }

	                $scope.dTable.catDesc = Enumerable.From($scope.report.categoryDesc)
                            .OrderBy(function (x) { return x.CategoryDesc })
                            .Select(function (x) { return x.CategoryDesc })
                            .ToArray();
	                break;
	        }
	        
	    }

	    $scope.dTable = {
	        type: null,
            title: null,
	        subtitle: null,
	        month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	        years: [],
            catDesc: [],
	        data: []
	    }

        //charts:

	    $scope.loadChart = function () {
	        $scope.chart = Highcharts.chart('lineChart', {
	            credits: {
	                text: 'ערן התותח',
	                href: 'https://www.facebook.com/Eran.Math.teacher/'
	            },
	            chart: {
	                type: $scope.dTable.type
	            },
	            title: {
	                text: $scope.dTable.title,
	                x: -20,
	                useHTML: Highcharts.hasBidiBug
	            },
	            subtitle: {
	                text: $scope.dTable.subtitle,
	                x: -20
	            },
	            xAxis: {
	                categories: $scope.reportChart.categories,
	                reversed: true,
	                title: {
	                    text: 'חודש'
	                }
	            },
	            yAxis: {
	                title: {
	                    text: '(ש"ח)',
	                    useHTML: Highcharts.hasBidiBug
	                },
	                plotLines: [{
	                    value: 0,
	                    width: 1,
	                    color: '#808080'
	                }],
	                opposite: true,
	            },
	            legend: {
	                layout: 'vertical',
	                align: 'left',
	                verticalAlign: 'middle',
	                borderWidth: 0,
	                rtl: true,
	                useHTML: Highcharts.hasBidiBug
	            },
	            tooltip: {
	                useHTML: true,
	                headerFormat: '<small>{point.key}</small><table>',
	                pointFormat: '<tr><td style="color: {series.color}"> {point.y} שח &nbsp;</td>' + '<td style="text-align: right"><b>  :{series.name}</b></td></tr>'
	            },
	            series: $scope.reportChart.series
	        });
	                        
	    }

	    $scope.loadBarChart = function () {

	    }

	    $scope.loadPieChart = function () {

	    }

	    //alerts
	    $scope.alerts = [];
	    $scope.addAlert = function (ty, ms) {
	        $scope.alerts.push({ type: ty, msg: ms });
	    };
	    $scope.closeAlert = function (index) {
	        $scope.alerts.splice(index, 1);
	    };


	    //data-tables configuration
	    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDisplayLength(12)
        .withPaginationType('full_numbers')
        .withLanguage({
            "processing": "מעבד...",
            "lengthMenu": "הצג _MENU_ פריטים",
            "zeroRecords": "לא נמצאו רשומות מתאימות",
            "emptyTable": "לא נמצאו רשומות מתאימות",
            "info": "_START_ עד _END_ מתוך _TOTAL_ רשומות",
            "infoEmpty": "0 עד 0 מתוך 0 רשומות",
            "infoFiltered": "(מסונן מסך _MAX_  רשומות)",
            "infoPostFix": "",
            "search": "חפש:",
            "url": "",
            "paginate": {
                "first": "ראשון",
                "previous": "קודם",
                "next": "הבא",
                "last": "אחרון"
            }
        })
        .withOption('bLengthChange', false);

	}]);
