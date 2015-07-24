latestData = false;
charts = {"signaturesChart" : false,
    "deltaSignaturesChart": false
}
chartOptions = {
        scaleBeginAtZero: true,
        animationSteps: 20,
        scaleShowVerticalLines: false,
        showTooltips: false,
        responsive: true,
        maintainAspectRatio: false,
        bezierCurve : false,
        pointDot : false

    }
function reDrawCharts(){
    if (latestData){
        charts["signaturesChart"].Line(formatForChartJs(latestData,"signatures","signatures"),chartOptions)
        charts["deltaSignaturesChart"].Line(formatForChartJs(latestData,"delta_signatures","Change in signatures"),chartOptions)
    }
}
function getData(){
    $.getJSON("./data.json", 
        function (data){
            handleJson(data);
        }
    )
}
function handleJson(dataIn){
    latestData = convertDates(dataIn);
    latestData.sort(function (a,b){
        a = a["time"]
        b = b["time"]
        return a>b ? -1 : a<b ? 1 : 0;
    })
    reDrawCharts();
}
function convertDates(dataIn){
    $.each(dataIn, function (i,v){
        v["time"] = new Date(v["time"])
    }
    return dataIn
}
function createLablesArray(dataSet, atribute){
    return new Array(dataSet.length).join(".").split(".");
}
function createValuesArray(dataSet,atribute){
    valuesArray = []
    $.each(dataSet, 
        function(i,v){
            valuesArray.push(v[atribute])
        }
    );
    return valuesArray
}
function formatForChartJs(dataIn, dataAtribute,  labelIn){
    formated = {
        labels: createLablesArray(dataIn,dataAtribute),
        datasets:[
            {
                label: labelIn,
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: createValuesArray(dataIn,dataAtribute)
            }
        ]
    }
    return formated
}
function initCharts(){
    sigChartCanvas = $("#signaturesChart").get(0).getContext("2d");
    deltasSigChartCanvas = $("#deltaSignaturesChart").get(0).getContext("2d");
    charts = {"signaturesChart" : new Chart(sigChartCanvas),
        "deltaSignaturesChart": new Chart(deltasSigChartCanvas)
    }
}
$(document).ready(function (){
    initCharts();
    getData();
}
)
/**/
