angular.module('GMRSapp')
	.controller('AppController', ['$scope', 'AppService', 'DTOptionsBuilder', function ($scope, AppService, DTOptionsBuilder) {
	    $scope.chart;
	    $scope.showReport1 = false;
	    $scope.showReport2 = false;
	    $scope.showReport3 = false;
	    $scope.showReport4 = false;
	    $scope.showReport5 = false;
	    $scope.catDescChoosed = false;
	    $scope.ReportTypeChoosed = false;

	    $scope.reportSNtoDelete;

	    $scope.reportsArray = [];
	    $scope.reportsArray_Backup = [];

	    $scope.reportToDel = function (sn) {
	        $scope.reportSNtoDelete = sn;
	    }

	    $scope.resetReportArray = function () {
	        $scope.reportsArray = $scope.reportsArray_Backup;
	    }

	    $scope.loadFavoriteReports = function () {
	        $.loader({
	            className: "blue-with-image-2",
	            content: ''
	        });
	        AppService.GetFavoriteReports().then(function (results) {
	            $scope.reportsArray = results.data;
	            $.loader('close');
	        }, function (e) {
	            $.loader('close');
	            alert("loading favorites reports failed!");
	        })
	    }

	    $scope.saveReport = function () {
	        $.loader({
	            className: "blue-with-image-2",
	            content: ''
	        });
	        AppService.AddReport($scope.report).then(function (results) {
	            $.loader('close');
	            $scope.closeReport();
	            $scope.addAlert('success', 'הדו"ח נשמר בהצלחה!');
	        }, function (e) {
	            $.loader('close');
	            alert("save report failed");
	        });
	    }

	    $scope.deleteReport = function () {
	        $.loader({
	            className: "blue-with-image-2",
	            content: ''
	        });
	        AppService.DeleteReport($scope.reportSNtoDelete).then(function (results) {
	            $.loader('close');
	            for (i = 0; i < $scope.reportsArray.length; i++) {
	                if($scope.reportsArray[i].SN == $scope.reportSNtoDelete)
	                    $scope.reportsArray.splice(i, 1);
	            }
	            $scope.addAlert('success', 'הדו"ח נמחק!');
	        }, function (e) {
	            $.loader('close');
	            alert("delete report failed");
	        });
	    }

	    $scope.loadFromFavorites = function (r) {
	        $scope.report.Name = r.Name;
	        $scope.report.id = r.id;
	        $scope.report.cCategory = { CategoryName: r.category},
	        $scope.report.cCategoryDesc = r.catDesc;
	        $scope.report.cReportType = r.reportType;
	        $scope.report.cStartYear = r.startYear;
	        $scope.report.cValueTypeDesc = r.typeDesc;
	        $scope.report.cEndYear = r.endYear;

	        $scope.reportChartID = 'report' + r.id;
	        $scope.reportCategorySelected();
	        $scope.reportTypeSelected();
	        $scope.loadRelevantData();
	        switch ($scope.report.id) {
	            case 1:
	                $scope.showReport1 = true;
	                break;
	            case 2:
	                $scope.showReport2 = true;
	                break;
	            case 3:
	                $scope.showReport3 = true;
	                break;
	            case 4:
	                $scope.showReport4 = true;
	                break;
	            case 5:
	                $scope.showReport5 = true;
	                break;
	        }
	    }

	    $scope.reportChart = {
	        type: null,
	        chart: {
	            type: null
	        },
	        title: null,
	        subtitle: null,
	        legend: {},
	        xAxis: null,
            lables: null,
	        categories: [],
	        series: [],
	        drilldownSeries: [],
	        categories: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
	        plotOptions: {
	            pie: {
	                innerSize: 0,
	                depth: 0
	            }
	        }
	    }
	    $scope.reportChart_Backup = {
	        type: null,
	        chart: {
	            type: null
	        },
	        title: null,
	        subtitle: null,
	        legend: {},
	        xAxis: null,
	        lables: null,
	        categories: [],
	        series: [],
	        drilldownSeries: [],
	        categories: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
	        plotOptions: {
	            pie: {
	                innerSize: 0,
	                depth: 0
	            }
	        }
	    }

	    $scope.reportChartID;

	    $scope.report = {
            Name: '',
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
	    $scope.report_Backup = {
	        Name: '',
	        id: null,
	        reportType: [],
	        valueTypeDesc: [],
	        categories: [],
	        categoryDesc: [],
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

	    $scope.dTable = {
	        month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	        years: [],
	        catDesc: [],
	        valueTypeDesc: [],
	        data: []
	    }
	    $scope.dTable_Backup = {
	        month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	        years: [],
	        catDesc: [],
	        valueTypeDesc: [],
	        data: []
	    }
        
        //refresh report data when closing a report
	    $scope.closeReport = function () {
	        $scope.report = angular.copy($scope.report_Backup);
	        $scope.reportChart = angular.copy($scope.reportChart_Backup);
	        $scope.dTable = angular.copy($scope.dTable_Backup);
	        $scope.showReport1 = false;
	        $scope.showReport2 = false;
	        $scope.showReport3 = false;
	        $scope.showReport4 = false;
	        $scope.showReport5 = false;
	        $scope.catDescChoosed = false;
	        $scope.ReportTypeChoosed = false;
	    }

        //when user picked a category in create roport modal
	    $scope.reportCategorySelected = function () {
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
	    //when user picked a type in create roport modal
	    $scope.reportTypeSelected = function () {
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
	    //when user picked a value type in create roport modal
	    //$scope.$watch('report.cReportType', function (newValue, oldValue) {
	    //    if (newValue !== oldValue && newValue != null) {
	    //        $.loader({
	    //            className: "blue-with-image-2",
	    //            content: ''
	    //        });
	    //        AppService.GetValueTypeDesc($scope.report.cReportType).then(function (results) {
	    //            $scope.report.valueTypeDesc = results.data;
	    //            $.loader('close');
	    //            $scope.$watch(function () {
	    //                $('.selectpicker').selectpicker('refresh');
	    //            });
	    //            $scope.ReportTypeChoosed = true;
	    //        }, function (e) {
	    //            $.loader('close');
	    //            alert("getting categories description list failed");
	    //        });
	    //    }
	    //});

	    //when user picked a StartYear in create roport modalreport
	    $scope.$watch('report.cStartYear', function (newValue, oldValue) {
	        if (newValue !== oldValue && newValue != null) {
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
	        $scope.reportChartID = "report" + id;
	        switch ($scope.report.id) {
	            case 1:
	                $scope.showReport1 = true;
	                break;
	            case 2:
	                $scope.showReport2 = true;
	                break;
	            case 3:
	                $scope.showReport3 = true;
	                break;
	            case 4:
	                $scope.showReport4 = true;
	                break;
	            case 5:
	                $scope.showReport5 = true;
	                break;
	        }
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
	        if ($scope.report.id == 2)
	            $scope.reportCategorySelected();
	        else if ($scope.report.id == 3) {
	            $scope.reportCategorySelected();
	            $scope.reportTypeSelected();
	        }
	        else if ($scope.report.id == 4) {
	            $scope.reportTypeSelected();
	        }
	            
            
	        AppService.GetRelevantData($scope.report).then(function (results) {
	            $scope.report.data = results.data;
	            $scope.renderDataForChart();
	            $scope.renderDataForTable();
	            $scope.loadChart();

	            var id = '#' + $scope.reportChartID;
	            $('#ReportModal').on('show.bs.modal', function () {
	                $(id).css('visibility', 'hidden');
	            });
	            $('#ReportModal').on('shown.bs.modal', function () {
	                $(id).css('visibility', 'initial');
	                var chart = $(id).highcharts();
	                chart.reflow();
	            });
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
	                $scope.reportChart.chart = {
	                    type: 'line'
	                };
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
	                        text: '(חודש)'
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
	                $scope.reportChart.chart = {
	                    type: 'column'
	                };
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
	                        text: '(חודש)'
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
	                $scope.reportChart.chart = {
	                    type: 'column'
	                };
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
	            case 4:
	                $scope.reportChart.title = 'גרף ' + $scope.report.cReportType + ' לפי שנים ';
	                $scope.reportChart.subtitle = $scope.report.cCategory.CategoryName + ': ' + $scope.report.cCategoryDesc;
	                $scope.reportChart.tooltip = {
	                    useHTML: true,
	                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
	                    pointFormat: '<span style="color:{point.color}">{point.name}:</span> <b>{point.y:f}</b> ש"ח<br/>'
	                };
	                
	                for (i = $scope.report.cStartYear; i <= $scope.report.cEndYear; i++) {
	                    $scope.dTable.years.push(i);
	                }
	                
	                var valTypeDesc = Enumerable.From($scope.report.valueTypeDesc)
                            .OrderBy(function (x) { return x.ValueTypeDesc })
                            .Select(function (x) { return x.ValueTypeDesc })
                            .ToArray();
	                $scope.reportChart.xAxis = {
	                    categories: valTypeDesc,
	                    reversed: true,
	                    title: {
	                        text: '(שנים)'
	                    }
	                };
	                for (i = 0; i < $scope.dTable.years.length; i++) {
	                    var valArray = Enumerable.From($scope.report.data)
                            .Where(function (x) { return x.Year == $scope.dTable.years[i] })
                            .OrderBy(function (x) { return x.ValueTypeDesc })
                            .Select(function (x) { return x.value })
                            .ToArray();
	                    var seria = {
                            type: 'column',
                            name: $scope.dTable.years[i],
	                        data: valArray
	                    }
	                    $scope.reportChart.series.push(seria);
	                }
	                //render average array and push it to the chart series
	                var avg = [];
	                for (k = 0; k < valTypeDesc.length; k++) {
	                    var sum = 0;
	                    for (j = 0; j < $scope.reportChart.series.length; j++) {
	                        sum = sum + $scope.reportChart.series[j].data[k];
	                    }
	                    avg.push(sum / $scope.reportChart.series.length);
	                }
	                $scope.reportChart.series.push({
	                    type: 'spline',
	                    name: 'ממוצע',
	                    data: avg,
	                    marker: {
	                        lineWidth: 2,
	                        lineColor: Highcharts.getOptions().colors[3],
	                        fillColor: 'white'
	                    }
	                });
	                //render pie data and push it to the chart series
	                var pieY = [];
	                for (k = 0; k <  $scope.reportChart.series.length - 1; k++) {
	                    var sum = 0;
	                    for (j = 0; j < valTypeDesc.length; j++) {
	                        sum = sum + $scope.reportChart.series[k].data[j];
	                    }
	                    pieY.push(sum);
	                }
	                var pieData = [];
	                for (i = 0; i < $scope.dTable.years.length; i++) {
	                    pieData.push({
	                        name: $scope.dTable.years[i],
	                        y: pieY[i],
	                        color: Highcharts.getOptions().colors[i]
	                    });
	                }
	                $scope.reportChart.series.push({
	                    type: 'pie',
	                    name: 'סה"כ ' + $scope.report.cReportType + ' לפי שנה ',
	                    data: pieData,
	                    center: [30, 2],
	                    size: 75,
	                    showInLegend: false,
	                    dataLabels: {
	                        enabled: false
	                    }
	                });
	                break;
	            case 5:
	                $scope.reportChart.title = ' גרף הוצאות הכנסות ';
	                $scope.reportChart.chart = {
	                    type: 'column'
	                };
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


	                var incomeValTypeDesc = Enumerable.From($scope.report.data)
                            .Where(function (x) { return x.ValueTypeName == 'הכנסה' })
                            .OrderBy(function (x) { return x.ValueTypeDesc})
                            .Select(function (x) { return x.ValueTypeDesc })
                            .ToArray();
	                var outcomeValTypeDesc = Enumerable.From($scope.report.data)
                            .Where(function (x) { return x.ValueTypeName == 'הוצאה' })
                            .OrderBy(function (x) { return x.ValueTypeDesc })
                            .Select(function (x) { return x.ValueTypeDesc })
                            .ToArray();
	                var incomeVal = Enumerable.From($scope.report.data)
                            .Where(function (x) { return x.ValueTypeName == 'הכנסה' })
                            .OrderBy(function (x) { return x.ValueTypeDesc})
                            .Select(function (x) { return x.value })
                            .ToArray();
	                var outcomeVal = Enumerable.From($scope.report.data)
                            .Where(function (x) { return x.ValueTypeName == 'הוצאה' })
                            .OrderBy(function (x) { return x.ValueTypeDesc })
                            .Select(function (x) { return x.value })
                            .ToArray();
	                var in_data = [];
	                for(i=0;i<incomeVal.length;i++){
	                    in_data.push([incomeValTypeDesc[i], incomeVal[i]]);
	                }
	                var out_data = [];
	                for(i=0;i<outcomeVal.length;i++){
	                    out_data.push([outcomeValTypeDesc[i], outcomeVal[i]]);
	                }

	                $scope.reportChart.drilldownSeries[0] = {
	                    name: 'הכנסה',
	                    id: 'הכנסה',
	                    data: in_data
	                };
	                $scope.reportChart.drilldownSeries[1] = {
	                    name: 'הוצאה',
	                    id: 'הוצאה',
	                    data: out_data
	                };
	                var sumIn = 0;
	                var sumOut = 0;
	                for (i = 0; i < incomeVal.length; i++) {
	                    sumIn = sumIn + incomeVal[i];
	                }
	                for (i = 0; i < outcomeVal.length; i++) {
	                    sumOut = sumOut + outcomeVal[i];
	                }
	                $scope.reportChart.series.push({
	                    name: 'סה"כ בשנה',
	                    colorByPoint: true,
	                    data: [{ name: 'הכנסה', y: sumIn, drilldown: 'הכנסה' }, { name: 'הוצאה', y: sumOut, drilldown: 'הוצאה' }]
	                });

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
	            case 4:
	                $scope.dTable.valueTypeDesc = Enumerable.From($scope.report.valueTypeDesc)
                            .OrderBy(function (x) { return x.ValueTypeDesc })
                            .Select(function (x) { return x.ValueTypeDesc })
                            .ToArray();
	                for (i = 0; i < $scope.dTable.valueTypeDesc.length; i++) {
	                    $scope.dTable.data.push([$scope.dTable.valueTypeDesc[i]]);
	                    var valArray = Enumerable.From($scope.report.data)
                            .Where(function (x) { return x.ValueTypeDesc == $scope.dTable.valueTypeDesc[i] })
                            .OrderBy(function (x) { return x.Year })
                            .Select(function (x) { return x.value })
                            .ToArray();
	                    $scope.dTable.data[i] = $scope.dTable.data[i].concat(valArray);
	                }
	                break;
	        }        
	    }

        //charts:

	    $scope.loadChart = function () {
	        $scope.chart = Highcharts.chart($scope.reportChartID, {
	            credits: {
	                text: 'ערן התותח',
	                href: 'https://www.facebook.com/Eran.Math.teacher/'
	            },
	            chart: $scope.reportChart.chart,
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
                legend: $scope.reportChart.legend,
	            tooltip: $scope.reportChart.tooltip,
	            series: $scope.reportChart.series,
	            drilldown: {
	                series: $scope.reportChart.drilldownSeries
	            },
	            plotOptions: $scope.reportChart.plotOptions
	        });                        
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
