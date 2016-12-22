angular.module('GMRSapp')
	.controller('AppController', ['$scope', 'AppService', 'DTOptionsBuilder', function ($scope, AppService, DTOptionsBuilder) {

	    $scope.chart;
	    $scope.showReport = false;
	    $scope.showReport2 = false;
	    $scope.showReport3 = false;
	    $scopecatDescChoosed = false;
	    $scope.ReportTypeChoosed = false;
	    

	    $scope.reportChart = {
	        type: null,
	        title: null,
	        subtitle: null,
	        legend: null,
            xAxis: null,
	        categories: [],
	        series: [],
	        drilldownSeries: [],
	        categories: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
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
	            var chart = $('#lineChart').highcharts();
	            $('#ReportModal').on('show.bs.modal', function () {
	                $('#lineChart').css('visibility', 'hidden');
	            });
	            $('#ReportModal').on('shown.bs.modal', function () {
	                $('#lineChart').css('visibility', 'initial');
	                chart.reflow();
	            });
	            switch ($scope.report.id) {
	                case 1:
	                    $scope.showReport1 = true;
	                    break;
	                case 2:
	                    $scope.showReport2 = true;
	                    break;
	                case 3:
	                    $scope.showReport3 = true;
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
	                $scope.reportChart.type = 'line';
	                $scope.reportChart.legend = {
	                    layout: 'vertical',
	                    align: 'left',
	                    verticalAlign: 'middle',
	                    borderWidth: 0,
	                    rtl: true,
	                    useHTML: Highcharts.hasBidiBug
	                };
	                $scope.reportChart.tooltip = {
	                    useHTML: true,
	                    headerFormat: '<small>{point.key}</small><table>',
	                    pointFormat: '<tr><td style="color: {series.color}"> {point.y:f} שח &nbsp;</td>' + '<td style="text-align: right"><b>  :{series.name}</b></td></tr>'
	                };
	                $scope.reportChart.xAxis = {
	                    categories: $scope.reportChart.categories,
	                    reversed: true,
	                    title: {
	                        text: 'חודש'
	                    }
	                };
	                $scope.reportChart.title = 'גרף ' + $scope.report.cReportType + ' לפי שנים '
	                $scope.reportChart.subtitle = $scope.report.cCategory.CategoryName + ': ' + $scope.report.cCategoryDesc;
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
	                $scope.reportChart.type = 'column';
	                $scope.reportChart.legend = {
	                    layout: 'vertical',
	                    align: 'left',
	                    verticalAlign: 'middle',
	                    borderWidth: 0,
	                    rtl: true,
	                    useHTML: Highcharts.hasBidiBug
	                };
	                $scope.reportChart.tooltip = {
	                    useHTML: true,
	                    headerFormat: '<small>{point.key}</small><table>',
	                    pointFormat: '<tr><td style="color: {series.color}"> {point.y:f} שח &nbsp;</td>' + '<td style="text-align: right"><b>  :{series.name}</b></td></tr>'
	                };
	                $scope.reportChart.xAxis = {
	                    categories: $scope.reportChart.categories,
	                    reversed: true,
	                    title: {
	                        text: 'חודש'
	                    }
	                };
	                $scope.reportChart.title = 'גרף ' + $scope.report.cReportType + ' ' + $scope.report.cValueTypeDesc + ' לפי ' + $scope.report.cCategory.CategoryName
	                $scope.reportChart.subtitle = 'שנת ' + $scope.report.cStartYear;
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
	            case 3:
	                $scope.reportChart.title = ' גרף ' + $scope.report.cReportType + ' לפי ' + $scope.report.cCategory.CategoryName
	                $scope.reportChart.type = 'column';
	                $scope.reportChart.xAxis = {
	                    reversed: true,
	                    type: 'category'
	                };
	                $scope.reportChart.tooltip = {
	                    useHTML: true,
	                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
	                    pointFormat: '<span style="color:{point.color}">{point.name}:</span> <b>{point.y:f}</b> ש"ח<br/>'
	                };
	                $scope.reportChart.legend = { enabled: false };
	                $scope.reportChart.subtitle = ' שנת ' + $scope.report.cStartYear;
	                for (i = 0; i < $scope.report.categoryDesc.length; i++) {
	                    $scope.reportChart.drilldownSeries.push({
	                        name: $scope.report.categoryDesc[i].CategoryDesc,
	                        id: $scope.report.categoryDesc[i].CategoryDesc,
                            data: []
	                    });
	                }
	                var drilldownSeriesData = [];
	                for (i = 0; i < $scope.report.categoryDesc.length; i++) {
	                    for (j = 0; j < $scope.report.valueTypeDesc.length; j++) {
	                        var val = Enumerable.From($scope.report.data)
                            .Where(function (x) { return x.CategoryDesc == $scope.report.categoryDesc[i].CategoryDesc })
                            .Where(function (x) { return x.ValueTypeDesc == $scope.report.valueTypeDesc[j].ValueTypeDesc })
                            .Select(function (x) { return x.value })
                            .ToArray();
	                        drilldownSeriesData.push([$scope.report.valueTypeDesc[j].ValueTypeDesc, val[0]])
	                    }
	                    $scope.reportChart.drilldownSeries[i].data = drilldownSeriesData;
	                    drilldownSeriesData = [];
	                }
	                var seriesData = [];
	                for (i = 0; i < $scope.report.categoryDesc.length; i++) {
	                    var sum = 0;
	                    for (j = 0; j < $scope.report.valueTypeDesc.length; j++) {
	                        sum = parseInt(sum) + parseInt($scope.reportChart.drilldownSeries[i].data[j][1]);
	                    }
	                    seriesData.push({
	                        name: $scope.report.categoryDesc[i].CategoryDesc,
	                        y: sum,
	                        drilldown: $scope.report.categoryDesc[i].CategoryDesc
	                    });
	                }
	                $scope.reportChart.series[0] = {
	                    name: $scope.report.cCategory.CategoryName,
	                    colorByPoint: true,
	                    data: seriesData
	                }
	                break;
	        }      
	    }

	    //render data for table
	    $scope.renderDataForTable = function()
	    {
	        switch ($scope.report.id) {
	            case 1:
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
	            case 3:
	                $scope.dTable.catDesc = Enumerable.From($scope.report.categoryDesc)
                            .OrderBy(function (x) { return x.CategoryDesc })
                            .Select(function (x) { return x.CategoryDesc })
                            .ToArray();
	                $scope.dTable.valueTypeDesc = Enumerable.From($scope.report.valueTypeDesc)
                            .OrderBy(function (x) { return x.ValueTypeDesc })
                            .Select(function (x) { return x.ValueTypeDesc })
                            .ToArray();

	                for (i = 0; i < $scope.dTable.catDesc.length; i++) {
	                    $scope.dTable.data.push([$scope.dTable.catDesc[i]]);
	                    var valArray = Enumerable.From($scope.report.data)
                            .Where(function (x) { return x.CategoryDesc == $scope.dTable.catDesc[i] })
                            .OrderByDescending(function (x) { return x.CategoryDesc })
                            .Select(function (x) { return x.value })
                            .ToArray();
	                    $scope.dTable.data[i] = $scope.dTable.data[i].concat(valArray);
	                    $scope.dTable.data[i].push(
                            Enumerable.From($scope.reportChart.series[0].data)
                            .Where(function (x) { return x.name == $scope.dTable.catDesc[i] })
                            .Select(function (x) { return x.y })
                            .ToArray()[0]);
	                }
	                break;
	        }        
	    }

	    $scope.dTable = {
	        month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	        years: [],
	        catDesc: [],
            valueTypeDesc: [],
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
	                type: $scope.reportChart.type
	            },
	            title: {
	                text: $scope.reportChart.title,
	                x: -20,
	                useHTML: Highcharts.hasBidiBug
	            },
	            subtitle: {
	                text: $scope.reportChart.subtitle,
	                x: -20
	            },
	            xAxis: $scope.reportChart.xAxis,
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

	            tooltip: $scope.reportChart.tooltip,
	            legend: $scope.reportChart.legend,
	            series: $scope.reportChart.series,
	            drilldown: {
	                series: $scope.reportChart.drilldownSeries
	            }
	        });                        
	    }
	    //$scope.loadChart2 = function () {
	    //    Highcharts.chart('lineChart', {
	    //        credits: {
	    //            text: 'ערן התותח',
	    //            href: 'https://www.facebook.com/Eran.Math.teacher/'
	    //        },
	    //        chart: {
	    //            type: $scope.reportChart.type
	    //        },
	    //        title: {
	    //            text: $scope.reportChart.title,
	    //            x: -20,
	    //            useHTML: Highcharts.hasBidiBug
	    //        },
	    //        subtitle: {
	    //            text: $scope.reportChart.subtitle
	    //        },
	    //        xAxis: {
	    //            reversed: true,
	    //            type: 'category'
	    //        },
	    //        yAxis: {
	    //            title: {
	    //                text: '(ש"ח)',
	    //                useHTML: Highcharts.hasBidiBug
	    //            },
	    //            plotLines: [{
	    //                value: 0,
	    //                width: 1,
	    //                color: '#808080'
	    //            }],
	    //            opposite: true,
	    //        },
	    //        legend: {
	    //            enabled: false
	    //        },
	    //        plotOptions: {
	    //            series: {
	    //                borderWidth: 0,
	    //                dataLabels: {
	    //                    enabled: true,
	    //                }
	    //            }
	    //        },

	    //        tooltip: {
	    //            useHTML: true,
	    //            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
	    //            pointFormat: '<span style="color:{point.color}">{point.name}:</span> <b>{point.y:f}</b> ש"ח<br/>'
	    //        },

	    //        series: $scope.reportChart.series,
	    //        drilldown: {
	    //            series: $scope.reportChart.drilldownSeries
	    //        }
	    //    });
	    //}


	    //alerts
	    $scope.alerts = [];
	    $scope.addAlert = function (ty, ms) {
	        $scope.alerts.push({ type: ty, msg: ms });
	    };
	    $scope.closeAlert = function (index) {
	        $scope.alerts.splice(index, 1);
	    };


	    //data-tables configuration
	    //$scope.dtOptions = DTOptionsBuilder.newOptions()
        //.withDisplayLength(12)
        //.withPaginationType('full_numbers')
        //.withLanguage({
        //    "processing": "מעבד...",
        //    "lengthMenu": "הצג _MENU_ פריטים",
        //    "zeroRecords": "לא נמצאו רשומות מתאימות",
        //    "emptyTable": "לא נמצאו רשומות מתאימות",
        //    "info": "_START_ עד _END_ מתוך _TOTAL_ רשומות",
        //    "infoEmpty": "0 עד 0 מתוך 0 רשומות",
        //    "infoFiltered": "(מסונן מסך _MAX_  רשומות)",
        //    "infoPostFix": "",
        //    "search": "חפש:",
        //    "url": "",
        //    "paginate": {
        //        "first": "ראשון",
        //        "previous": "קודם",
        //        "next": "הבא",
        //        "last": "אחרון"
        //    }
        //})
        //.withOption('bLengthChange', false);

	}]);
