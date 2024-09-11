var hasSet = false;
var allMoney = 0;
var invertmentget = 0;
$(document).ready(function(){
    $('#total').blur(function(){
        allMoney = $(this).val();
        $('.alltotal').text(allMoney);
        $("#totalMoney").fadeIn();
        $( ".totalslider" ).slider({
            'max':allMoney,
            'step':1,
            slide: function(event, ui) {
                $(this).siblings('.values').find('.value').text(ui.value);
            }
        });
        if(hasSet){
            var sliders = $("#sliders .slider");
            sliders.each(function(){
                $(this).empty().slider( "instance" );
            })
        }
        $( ".totalslider" ).on( "slidechange", function( event, ui ) {
            var sliders = $("#sliders .slider");
            $('#test').val(ui.value);

            slidersRange(sliders);
            hasSet = true;
            $('#sliders').fadeIn();
            $('.assetstotal').text(ui.value);

            $('.investmenttotal').text(allMoney-ui.value);
            invertmentget = ((allMoney-ui.value)*(parseFloat($('.investmentper').text()/100))).toFixed(2);
            $('.investmentget').text(invertmentget);
        });
    })
});

var slidersRange = function(sliders){
    if(hasSet) sliders.each(function(){
        $(this).empty().slider( "instance" );
    })

    sliders.each(function() {
        availableTotal =  $('#test').val();
        var value = parseInt($(this).text(), 10), availableTotal;
        $(this).empty().slider({
            value: 0,
            min: 0,
            max: availableTotal,
            range: "max",
            step: 1,
            animate: 100,
            slide: function(event, ui) {
                $(this).siblings('.values').find('.value').text(ui.value);

                var total = 0;

                sliders.not(this).each(function() {
                    total += $(this).slider("option", "value");
                });

                total += ui.value;

                var max = availableTotal - total;

                sliders.not(this).each(function() {
                    var t = $(this),
                    value = t.slider("option", "value");

                    t.slider("option", "max", max + value).siblings('.values').find('.value').text(value + '/' + (max + value));
                    t.slider('value', value);
                });
            }
        });
    });
    $('#result').fadeIn();
    $('.tableforcurrent').fadeIn();
    changeVal('cash');
    changeVal('time');
    changeVal('current');
    changeVal('market');
}

var changeVal = function(name){
    $( "."+name+"slider" ).on("slidechange", function( event, ui ) {
        $("."+name+"total").text(ui.value);
        getCurrentPer();
    });
}


var getCurrentPer = function(){
    var curper  = $('.markettotal').text()*$('.market').text() + $('.timetotal').text()*$('.time').text()+$('.currenttotal').text()*$('.current').text()*10;
    var curperresult = (curper/10).toFixed(2);
    $('.cashper').text(curperresult);
    var cashget = ((parseFloat($('.assetstotal').text())*curperresult)/100).toFixed(2);
    $('.cashget').text(cashget);
    var allget  = (parseFloat($('.investmentget').text())+parseFloat($('.cashget').text())).toFixed(2);
    $('.allget').text(allget);
    var allper  = (allget/$('.alltotal').text()*100).toFixed(2);
    $('.allper').text(allper);

    var chart = new CanvasJS.Chart("pie",
	{
		theme: "theme2",
		title:{
			text: "金融资产组合"
		},
		data: [
		{
			type: "pie",
			showInLegend: true,
			legendText: "{indexLabel}%",
			dataPoints: [
                {  y: ($('.investmenttotal').text()/$('.alltotal').text()).toFixed(2)*100, indexLabel: "投资性资产" },
                {  y: ($('.assetstotal').text()/$('.alltotal').text()).toFixed(2)*100, indexLabel: "流动性资产" }
			
			]
		}
		]
	});
    
    chart.render();

    if($('.allper').text()!=''){
        var chartc = new CanvasJS.Chart("colunm", {
            title: {
                text: "金融资产组合收益率"
            },
            axisY:{
                maximum: 20
            },
            data: [{
                type: "column",
                dataPoints: [
                    { y: parseFloat($('.allper').text()), label: "金融资产组合收益率" }
                 
            ]
        }]
        });
        chartc.render();
    }
}
