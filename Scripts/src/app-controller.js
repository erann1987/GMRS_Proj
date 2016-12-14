angular.module('GMRSapp')
	.controller('AppController', ['$scope', 'AppService', 'DTOptionsBuilder', function ($scope, AppService, DTOptionsBuilder) {

	    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDisplayLength(10)
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



	    $scope.areaChart = {
	        categories: [],
	        series: []
	    }

	    $scope.renderDataAreaChart = function () {
	        var size = $scope.report.cEndYear - $scope.report.cStartYear + 1;
	        for (i = 0; i < size; i++) {
	            $scope.areaChart.categories.push(parseInt($scope.report.cStartYear) + parseInt(i));
	        }
	        for (j = 0; j < $scope.report.data.length ; j = j + size) {
	            $scope.areaChart.series.push({
	                name: $scope.report.data[j].name,
	                data: []
	            });
	        }
	        for (i = 0; i < $scope.areaChart.series.length; i++)
	            for (j = 0; j < size; j++)
	                $scope.areaChart.series[i].data.push($scope.report.data[i + j].y);
	    }

	    $scope.report = {
	        reportType: [],
	        categories: [],
	        years: ['2012', '2013', '2014', '2015', '2016'],
	        cCategory: null,
	        cReportType: [],
	        cStartYear: null,
	        cEndYear: null,
	        data: []
	    }

	    $scope.alerts = [
            { type: 'danger', msg: 'testing alerts!' },
            { type: 'success', msg: 'testing alerts!' }
	    ];
	    $scope.addAlert = function (ty, ms) {
	        $scope.alerts.push({ type: ty, msg: ms });
	    };
	    $scope.closeAlert = function (index) {
	        $scope.alerts.splice(index, 1);
	    };


	    $scope.dataList = [];
	    $scope.showReport = false;
	    $scope.showDataTable = false;

	    $scope.createReport = function () {
	        $.loader({
	            className: "blue-with-image-2",
	            content: ''
	        });
	        $scope.getAllCategories();
	        $scope.getAllValueType();
	    }

	    $scope.getAllData = function () {
	        AppService.GetAllData().then(function (results) {
	            $scope.dataList = results.data;
	            //$scope.showDataTable = true;
	            //$('#example').DataTable();
	        }, function (e) {
	            alert("getting categories failed");
	        });
	    }

	    $scope.getAllCategories = function () {
	        AppService.GetAllCategories().then(function (results) {
	            $scope.report.categories = results.data;
	            $.loader('close');
	        }, function (e) {
	            $.loader('close');
	            alert("getting categories failed");
	        });
	    }

	    $scope.getAllValueType = function () {
	        AppService.GetAllValueType().then(function (results) {
	            $scope.report.reportType = results.data;
	            $scope.$watch(function () {
	                $('.selectpicker').selectpicker('refresh');
	            });
	            $.loader('close');
	        }, function (e) {
	            $.loader('close');
	            alert("getting categories failed");
	        });
	    }

	    $scope.loadRelevantData = function () {
	        $.loader({
	            className: "blue-with-image-2",
	            content: ''
	        });
	        AppService.GetRelevantData($scope.report).then(function (results) {
	            $scope.report.data = results.data;
	            $scope.renderDataAreaChart();
	            $scope.loadLineChart();
	            $scope.showReport = true;
	            $.loader('close');
	        }, function (e) {
	            $.loader('close');
	            alert("getting categories failed");
	        });
	    }

	    $scope.loadBarChart = function () {
	        $scope.showIncome_outcomeCart = true;

	        var myChart = Highcharts.chart('income_outcomeChart', {
	            chart: {
	                type: 'bar'
	            },
	            title: {
	                text: 'הוצאות הכנסות'
	            },
	            xAxis: {
	                categories: $scope.report.catDesc
	            },
	            yAxis: {
	                title: {
	                    text: 'ש"ח'
	                }
	            },
	            series: [{
	                name: 'הנכסות',
	                data: [514334, 326337, 346553]
	            }, {
	                name: 'הוצאות',
	                data: [513434, 646337, 344653]
	            }]
	        });
	    }

	    $scope.loadLineChart = function () {
	        var chart = Highcharts.chart('lineChart', {
	            credits: {
	                text: 'ערן התותח',
	                href: 'https://www.facebook.com/Eran.Math.teacher/'
	            },
	            title: {
	                text: 'גרף ' + $scope.report.cReportType + ' שנתי ',
	                x: -20, //center
	                useHTML: Highcharts.hasBidiBug
	            },
	            subtitle: {
	                text: 'לפי ' + $scope.report.cCategory.CategoryName,
	                x: -20
	            },
	            xAxis: {
	                categories: $scope.areaChart.categories,
	                reversed: true,
	                title: {
	                    text: 'שנים'
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
	            series: $scope.areaChart.series
	        });
	    }

	    $scope.loadPieChart = function () {
	        Highcharts.chart('pieChart', {
	            credits: {
	                text: 'ערן התותח',
	                href: 'https://www.facebook.com/Eran.Math.teacher/'
	            },
	            chart: {
	                plotBackgroundColor: null,
	                plotBorderWidth: null,
	                plotShadow: false,
	                type: 'pie'
	            },
	            title: {
	                text: ' פילוג הכנסות לפי ' + $scope.report.cCategory.CategoryName + ' שנים: ' + $scope.report.cStartYear + '-' + $scope.report.cEndYear
	            },
	            tooltip: {
	                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	            },
	            plotOptions: {
	                pie: {
	                    allowPointSelect: true,
	                    cursor: 'pointer',
	                    dataLabels: {
	                        enabled: true,
	                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
	                        style: {
	                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                        }
	                    }
	                }
	            },
	            xAxis: {
	                labels: {
	                    align: 'left'
	                }
	            },
	            legend: {
	                rtl: true
	            }, useHTML: true,
	            series: [{
	                name: $scope.report.cCategory.CategoryName,
	                colorByPoint: true,
	                data: $scope.report.valForPieChart
	            }]
	        });
	    }

	}]);
