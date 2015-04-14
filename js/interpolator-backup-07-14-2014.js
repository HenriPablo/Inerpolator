/**
 * Created by tbrymora on 12/9/13.
 *
 * Created with IntelliJ IDEA.
 * Date: 12/1/13
 * Time: 11:01 PM
 * To change this template use File | Settings | File Templates.
 *
 * ---------------------------------------------------------------
 * GENERAL NOTES
 * ---------------------------------------------------------------
 *
 * is EXACT WEIGHT available?
 *
 * 		yes ->
 * 		no 	->
 *
 * GIVEN:
 * Pressure Altitude: 2,500 ft
 * Temperature: 24 C
 * Weight: 2,400 Lbs
 * Headwind: 25 kts

 * SOLVE:
 * 1.  Find the ground roll for a 25 KTS headwind at 2,200 LBS

 * Nearest and lowest of WEIGHT and HEADWIND
 * A.  Find the ground roll for altitude of 2,500 ft, 15 kts headwind at 2,200 lbs: 245 ft
 * B.  Find the ground roll for 2,500 feet, 30 knot headwind at 2,200 pounds: 120 ft

 * WHAT ALL THAT MEANS:
 * 1. Find nearest-lowest wight,
 * A find nearest lowest and highest headwinds
 *
 */

//if( typeof console === 'undefined'){
if( !window.console){

    console = {};
    console.log =function(){};
    console.clear = function(){};
    console.dir = function(){};
}

var w = screen.width;
var h = screen.height;




$(document).ready( function(){

    var lowWeight = 0;
    var highWeight = 0;
    var stepNo = 1;
    var showStepDelay = 0;
    var consolePanel = $("#consolePanel") ;
    var contentPanel = $("#contentPanel");
    var formWrapper = $("#inputFormWrapper");
    var fieldsWrapper = $("#fieldsWrapper");

    $('.dataTableLink').click( function(){
        formWrapper.hide();
        $('.figure-table').hide();
        contentPanel.removeClass('narrowRight').load("./contents/" +  $(this).attr('data-figure-table') + ".html").show();
       // $("." + $(this).attr('data-figure-table')).show();
    });

    var interpolator = {

        adjustForHeadwindAtTheEnd : false,

        init : function(){

            // mobile debug stuff
            consolePanel.html('width: ' + w + 'px <br />height: ' + h + 'px' + " console: " + console );

            $('.questionData').click( function(){
                $("#questionNo").text( $(this).attr('id'));

                $("#givenTemperature").val( $(this).attr('data-temperature') );
                $("#givenAltitude").val( $(this).attr('data-pressurealtitude'));
                $("#givenWeight").val( $(this).attr( 'data-weight'));
                $("#givenHeadwind").val( $(this).attr('data-headwind'));
                $("#test").val("CALCULATE");

                fieldsWrapper.addClass('fieldsWrapper');

                consolePanel.empty().hide();
                contentPanel.hide().children('div, table').hide();
                formWrapper.removeClass('narrowLeft').show();
            });


        }, /* /init */
        getTempAltitude : function(  w, givenHeadWind, alti ){
            console.log( 'entering getTempAltitude()');
            var t = 0;

            var tempKey = "";
            /* get headwind from take off data figure */
            for( key in takeOffData[ "grossWeightLb" ][w] ){

                if( givenHeadWind === key ){
                    tempKey = key;
                    //break

                    console.log( "headwind: " + key );

                    for( key in takeOffData[ "grossWeightLb" ][ w ][ tempKey ]){
                        var t2 = key;

                        console.log("alt: " + key );
                        if( alti === key ){
                            t = key;// takeOffData[ "grossWeightLb" ][ lowWeight ][ tempKey ][ key ];
                            //break


                            for( key in takeOffData[ "grossWeightLb" ][ w ][ tempKey ][ t2 ] ){



                                //if( lowAltitude === key ){
                                //   t = key;// takeOffData[ "grossWeightLb" ][ lowWeight ][ tempKey ][ key ];
                                t = key;
                                //break
                            }
                        }
                    }

                }// for
            }
            //console.log( key )
            //}
            console.log( "leaving getTempAltitude():   " + t );
            return t;

        }, /* end getTempAltitude */

        getHeadwind : function( weight, headWind, solveForHighOrLowWeight, altitude ){
            var headWindIncrement = 5; // increases or decreases in headwind
            /* find LOW and HIGH WEIGHT */
            var lowAndHighWeight = getLowAndHigh( takeOffData[ 'grossWeightLb' ], weight );

            lowWeight = lowAndHighWeight.low;
            highWeight = lowAndHighWeight.high;


            /* FIND LOW and HIGH HEADWIND for LOW WEIGHT */
            var tempLowWeight = 0;
            if( solveForHighOrLowWeight === 'low'){
                tempLowWeight = takeOffData[ 'grossWeightLb' ][ lowWeight ];
            } else if( solveForHighOrLowWeight === 'high') {

                tempLowWeight = takeOffData[ 'grossWeightLb'][ highWeight ];
            }

            var tempHeadWind = 0;
            var lowAndHighHeadWind = getLowAndHigh( tempLowWeight, headWind );
            lowHeadWind = lowAndHighHeadWind.low;
            highHeadWind = lowAndHighHeadWind.high;

            /* interpolate GROUND ROLL between LOW and HIGH Headwind */
            return lowHeadWind;

//            var lowHeadwind =  0;
//            var highHeadwind = 0;
//            if( solveForHighOrLowWeight === 'low'){
//                lowHeadwind =   takeOffData[ 'grossWeightLb' ][ lowWeight ][ lowHeadWind ]/* [ altitude ][ interpolator.getTempAltitude( lowWeight, lowHeadWind, altitude )][ 'groundRoll' ] */ ;
//                highHeadwind =  takeOffData[ 'grossWeightLb' ][ lowWeight ][ highHeadWind ][ altitude ][ interpolator.getTempAltitude( lowWeight, highHeadWind, altitude )][ 'groundRoll' ];
//            } else if ( solveForHighOrLowWeight === 'high' ){
//                lowHeadwind =   takeOffData[ 'grossWeightLb' ][ highWeight ][ lowHeadWind ] [ altitude ][ interpolator.getTempAltitude( highWeight, lowHeadWind, altitude )][ 'groundRoll' ]  ;
//                highHeadwind =  takeOffData[ 'grossWeightLb' ][ highWeight ][ highHeadWind ][ altitude ][ interpolator.getTempAltitude( highWeight, highHeadWind, altitude )][ 'groundRoll' ];
//
//            }


//            var dif = lowHeadwind - highHeadwind;
//
//            var hwDif = highHeadWind - lowHeadWind;
//
//            var hwSteps = hwDif / headWindIncrement; // how many steps of '5' in difference between high and low headwind
//
//            var rollDiff = 0;
//            if( dif > 0){
//                rollDiff = ( dif / hwSteps ).toFixed( 2 );
//            } else {
//                dif = 1;
//            }

            /* difference in steps from lower headwind to headwind given */
            //var x = lowHeadwind - ( ( (headWind - lowHeadWind) / headWindIncrement ) * rollDiff  );
            //return x;

        },/* getHeadwind() */

        getTakeOffDistance : function( lowWeight, highWeight, givenHeadWind, altitude, temp, calculate, givenTemperature ){
            console.log( "lowWeight in inner fuc: " + lowWeight );
            console.log( "highWeight in inner fuc: " + highWeight );
            console.log( "givenHeadwind in inner fuc: " + givenHeadWind );
            console.log( "altitude in inner fuc: " + altitude );
            console.log( "temp in inner fuc: " + temp );

            var lowWeightTakeOffDistance = 0;
            var highWeightTakeOffDistance = 0;

            if( interpolator.adjustForHeadwindAtTheEnd){
                givenHeadWind = null;
            }

            console.log("low weight: " + lowWeight );
            console.log( takeOffData[ 'grossWeightLb' ][ lowWeight ][ null ] );
            if( !takeOffData[ 'grossWeightLb' ][ lowWeight ][ givenHeadWind ] ){
                var xxx = interpolator.getHeadwind( lowWeight, givenHeadWind, 'low', altitude );
                console.log( "xxx: " + xxx );
            }
            if( interpolator.adjustForHeadwindAtTheEnd ) {
                if (lowWeight != highWeight) {
                    lowWeightTakeOffDistance = takeOffData[ 'grossWeightLb' ][ lowWeight ][ givenHeadWind ][ altitude ][ temp ][ calculate ];
                    highWeightTakeOffDistance = takeOffData[ 'grossWeightLb' ][ highWeight ][ givenHeadWind ][ altitude ][temp ][ calculate ];
                    var takeOffDiff = highWeightTakeOffDistance - lowWeightTakeOffDistance;
                    var weightDiff = highWeight - lowWeight;
                    var y = takeOffDiff / ( weightDiff / 100 );
                    var x = (  ( ( highWeight - givenWeight ) / 100 ) * y );
                    return lowWeightTakeOffDistance + x;
                } else if (lowWeight === highWeight) {
                    return  takeOffData[ 'grossWeightLb' ][ lowWeight ][ givenHeadWind ][ altitude ][ temp  ][ calculate ];
                }
            } else {
                console.log('calculate without headwind first');
                if (lowWeight != highWeight) {
                    lowWeightTakeOffDistance = takeOffData[ 'grossWeightLb' ][ lowWeight ][null][ altitude ][ givenTemperature ][ calculate ];
                    highWeightTakeOffDistance = takeOffData[ 'grossWeightLb' ][ highWeight ][null][ altitude ][givenTemperature ][ calculate ];
                    var takeOffDiff = highWeightTakeOffDistance - lowWeightTakeOffDistance;
                    var weightDiff = highWeight - lowWeight;
                    var y = takeOffDiff / ( weightDiff / 100 );
                    var x = (  ( ( highWeight - givenWeight ) / 100 ) * y );
                    return lowWeightTakeOffDistance + x;
                } else if (lowWeight === highWeight) {
                    return  takeOffData[ 'grossWeightLb' ][ lowWeight ][ null ][ altitude ][ temp  ][ calculate ];
                }
            }
        }, /* end getTakeOffDistance */


        /**
         * adjust for temperature
         * The average change in temperature used by this cart is 2c for each thousand feet
         */
        correctForNoneStandardTemp : function(weight, lowAltitude, givenAltitude, givenTemperature, takeOffDistanceRequired ){

            // TODO: FIND OUT CLOSEST SMALLER TEMPERATURE
            var lowAltitudeTemperature;// =  takeOffData[ 'grossWeightLb'][ lowWeight ][null][ lowAltitude ][0];
            var l = getLowAndHigh( takeOffData[ 'grossWeightLb'][ weight ][null][ lowAltitude ], givenTemperature, 'altitude, ');
            console.log( " l in correctForNoneStandardTemp: "); console.dir(  l  );
            lowAltitudeTemperature = l.low;

            console.log( "lowAltitudeTemperature: " + lowAltitudeTemperature );

            var temperatureIncrease = lowAltitudeTemperature - ( ((givenAltitude - lowAltitude) / 1000 ) * 2 ) ;
            console.log( "temperatureIncrease: " + temperatureIncrease );
            showStep( "Temperature increases 2C per 1000 ft.,  " + temperatureIncrease + "C" );

            var temperatureAdjustment = ( givenTemperature - temperatureIncrease ) / 14;
            console.log( 'temperatureAdjustment: ' + temperatureAdjustment );
            showStep( "Temperature adjustment: " + temperatureAdjustment );


            temperatureAdjustment = temperatureAdjustment * 0.1;
            console.log('temperatureAdjustment: ' + temperatureAdjustment );

            takeOffDistanceRequired = takeOffDistanceRequired + ( takeOffDistanceRequired * temperatureAdjustment );
            console.log( "take off distance adjusted for temp:" + takeOffDistanceRequired );
            showStep( "Adjust takeoff distance by multiplying it by temperature adjustment: " + takeOffDistanceRequired );

            showStep( "Takeoff distance required is <strong>" + takeOffDistanceRequired + " ft.</strong>");

            return takeOffDistanceRequired;

        } /* end correctForNoneStandardTemp */

    };




    function showAll(  ){
        var $target = $('html,body');

        fieldsWrapper.removeClass('fieldsWrapper');
        formWrapper.addClass('narrowLeft');
        contentPanel.children('div, table').hide();
        contentPanel.addClass('narrowRight');

        $('#contentPanel').show();

        $('.step').css('display', 'block')
        //$('.step').each( function( index ){
        //$(this).delay( 900 * index ).show('fast', function(){

        //$(window).scrollTop(document.body.scrollHeight);

        $target.animate({scrollTop: $target.height()}, 1000);
        //alert( document.body.scrollHeight )

        //});

        //});


    }

    function showStep( msg ){
        var stuffToshow = '<div id="step' + stepNo + '" class="step"><div class="stepNumber"><span>' + stepNo + '</span></div><div class="stepBody" >' + msg + '</div><div style="clear:both;"></div></div>';
        $('#contentPanel').append( stuffToshow );
        stepNo++;
    }


    function getLowAndHigh( data, middleValue, getAltitudeOrWeight ){
        //var data = takeOffData;

        console.log( "getLowAndHigh data: ");
        console.log( data  );
        console.log( "getLowAndHigh middleValue: " + middleValue );

        var highAndLow = {
            low  : 0,
            high : 0
        };
        var t = 0;

        //if( getAltitudeOrWeight == "weight") {
            //data = takeOffData[ 'grossWeightLb'];
            for (var key in data) {
                console.log("key: " + key)
                if (key <= middleValue) {
                    //highAndLow.low = key;
                    t = key;
                }
               /*
                if (key == middleValue && key == t) {
                    highAndLow.high = middleValue;
                    highAndLow.low = middleValue;
                    console.log("'" + key + " == " + middleValue + " && " + key + " == " + t + "' is TRUE, nothing in the middle");
                }
                */
                if (key >= middleValue && key >= t) {
                    console.log("'" + key + " >= " + middleValue + " && " + key + " >= " + t + "' is TRUE");
                    highAndLow.high = key;
                    highAndLow.low = t;
                    break;
                }
            }
       // }
       // else if{

       // }

        return highAndLow;
    }

    /**
     * @Param weight
     * @Param altitude
     * @Param headwind
     * @Param solveForHighOrLowWeight - high OR low;
     */
    function solve(altitude, headWind, weight, solveForHighOrLowWeight, givenTemperature ){
        console.log( 'entering solve()');
        var lowWeight = 0;
        var highWeight = 0;

        var lowHeadWind = 0;
        var highHeadWind = 0;

        var headWindIncrement = 5; // increases or decreases in headwind

        /* find LOW and HIGH WEIGHT */
        var lowAndHighWeight = getLowAndHigh( takeOffData[ 'grossWeightLb' ], weight );

        lowWeight = lowAndHighWeight.low;
        highWeight = lowAndHighWeight.high;

        console.log( 'detecting null');
        console.dir( lowWeight );
        console.log("do we have null?");
        console.log( takeOffData[ 'grossWeightLb' ][ lowWeight ].hasOwnProperty('null')  );

        /*
         * do we have null instead of head wind value in look up table?
         * if so we'll adjust the final number for percent value at the end
         * */
        if( takeOffData[ 'grossWeightLb' ][ lowWeight ].hasOwnProperty('null') ){
            interpolator.adjustForHeadwindAtTheEnd = true;
        }

        /* FIND LOW and HIGH HEADWIND for LOW WEIGHT */
        var tempLowWeight = 0;
        if( solveForHighOrLowWeight === 'low'){
            tempLowWeight = takeOffData[ 'grossWeightLb' ][ lowWeight ];
        } else if( solveForHighOrLowWeight === 'high') {

            tempLowWeight = takeOffData[ 'grossWeightLb'][ highWeight ];
        }

        var tempHeadWind = 0;
        var lowAndHighHeadWind = getLowAndHigh( tempLowWeight, headWind );
        lowHeadWind = lowAndHighHeadWind.low;
        highHeadWind = lowAndHighHeadWind.high;

        /* interpolate GROUND ROLL between LOW and HIGH Headwind */

        var lowHeadwind =  0;
        var highHeadwind = 0;

        if( interpolator.adjustForHeadwindAtTheEnd ){
            if( solveForHighOrLowWeight === 'low'){
                lowHeadwind = takeOffData[ 'grossWeightLb' ][ lowWeight ][ null ]  [ altitude ][ interpolator.getTempAltitude( lowWeight, null, altitude )][ 'groundRoll' ]  ;
                highHeadwind = takeOffData[ 'grossWeightLb' ][ lowWeight ][ null ][ altitude ][ interpolator.getTempAltitude( lowWeight, null, altitude )][ 'groundRoll' ];
            } else if ( solveForHighOrLowWeight === 'high' ){
                lowHeadwind = takeOffData[ 'grossWeightLb' ][ highWeight ][ null ]  [ altitude ][ interpolator.getTempAltitude( highWeight, null, altitude )][ 'groundRoll' ]  ;
                highHeadwind = takeOffData[ 'grossWeightLb' ][ highWeight ][ null ][ altitude ][ interpolator.getTempAltitude( highWeight, null, altitude )][ 'groundRoll' ];

            }
        }   else{
            if( solveForHighOrLowWeight === 'low'){
                lowHeadwind = takeOffData[ 'grossWeightLb' ][ lowWeight ][ lowHeadWind ]  [ altitude ][ interpolator.getTempAltitude( lowWeight, lowHeadWind, altitude )][ 'groundRoll' ]  ;
                highHeadwind = takeOffData[ 'grossWeightLb' ][ lowWeight ][ highHeadWind ][ altitude ][ interpolator.getTempAltitude( lowWeight, highHeadWind, altitude )][ 'groundRoll' ];
            } else if ( solveForHighOrLowWeight === 'high' ){
                lowHeadwind = takeOffData[ 'grossWeightLb' ][ highWeight ][ lowHeadWind ]  [ altitude ][ interpolator.getTempAltitude( highWeight, lowHeadWind, altitude )][ 'groundRoll' ]  ;
                highHeadwind = takeOffData[ 'grossWeightLb' ][ highWeight ][ highHeadWind ][ altitude ][ interpolator.getTempAltitude( highWeight, highHeadWind, altitude )][ 'groundRoll' ];

            }
        }

        var dif = lowHeadwind - highHeadwind;

        var hwDif = highHeadWind - lowHeadWind;

        var hwSteps = hwDif / headWindIncrement; // how many steps of '5' in difference between high and low headwind

        var rollDiff = 0;
        if( dif > 0){
            rollDiff = ( dif / hwSteps ).toFixed( 2 );
        } else {
            dif = 1;
        }

        /* difference in steps from lower headwind to headwind given */
        var x = lowHeadwind - ( ( (headWind - lowHeadWind) / headWindIncrement ) * rollDiff  );

        var solveResult = {};
        //var lowWeight = 0;
        // var highWeight = 0;
        solveResult.x = x;
        solveResult.lowWeight = lowWeight;
        solveResult.highWeight = highWeight;
        console.log( 'leaving solve()');
        return solveResult;

    }// solve



    function interpolateForAltitude( givenAltitude, givenHeadWind, givenWeight, givenTemperature, calculate ){
        console.log( 'entering interpolateForAltitude( )');
        /* figure out the altitudes to interpolate between */
        var lowWeight = 0;
        var highWeight = 0;

        var lowAltitude = 0;
        var highAltitude = 0;

        var headWindIncrement = 5; // increases or decreases in headwind


        /* find LOW and HIGH WEIGHT */
        var lowAndHighWeight = getLowAndHigh( takeOffData[ 'grossWeightLb'],  givenWeight, "weight" );
        lowWeight = lowAndHighWeight.low;
        highWeight = lowAndHighWeight.high;
        showStep( "find LOW and HIGH WEIGHT: " + lowAndHighWeight );


        var lowAndHighAltitude = getLowAndHigh( takeOffData[ 'grossWeightLb'][ lowWeight ][null],givenAltitude, "altitude" );
        var highAltitude = getLowAndHigh( takeOffData[ 'grossWeightLb'][ highWeight ][null],givenAltitude, "altitude" );
        lowAltitude = lowAndHighAltitude.low;
        highAltitude = lowAndHighAltitude.high;

        console.log( 'lowAltitude: ' + lowAltitude );
        console.log( 'highAltitude: ' + highAltitude );





        //console.log
        showStep( "Check if we have exact weight of if we need to interpolate between 2 weights:<br />low: " + lowWeight +  " high: " + highWeight )

        var lowAltTemp = 0;
        var highAltTemp = 0;
        var hWind = 0;
        console.log( 'lowAltTemp: ' + lowAltTemp );


        if( interpolator.adjustForHeadwindAtTheEnd ) {
            givenHeadWind = null;
        }

        /* START IF */

        /* get the take off distance for LOW altitude and both low and high weights */
        var takeOffDistanceLowAltitude =  interpolator.getTakeOffDistance( lowWeight, highWeight, givenHeadWind, lowAltitude, interpolator.getTempAltitude( lowWeight, givenHeadWind , lowAltitude ), calculate, givenTemperature );
        //console.log
        showStep( "Look up takeoff distance at low altitude of " + lowAltitude + " ft.: <strong>" + takeOffDistanceLowAltitude + " ft.</strong>");

        /* get the take off distance for HIGH altitude and both low and high weights */
        var takeOffDistanceHighAltitude = interpolator.getTakeOffDistance( lowWeight, highWeight, givenHeadWind, highAltitude, interpolator.getTempAltitude( highWeight, givenHeadWind, highAltitude ), calculate, givenTemperature );
        //console.log( "inner function takeOffDistanceHighAltitude:" + takeOffDistanceHighAltitude );
        showStep( "Look up takeoff distance at high altitude of " + highAltitude + " ft.: <strong>" + takeOffDistanceHighAltitude + " ft.</strong>");

        /* END IF */





        var takeOffDifference = takeOffDistanceHighAltitude -takeOffDistanceLowAltitude;
        showStep( 'Difference between those 2: <strong>' + takeOffDifference + 'ft.</strong>' );

        var takeOffDistanceIncrease = 1;
        var takeOffDistanceRequired = 0;

        if( lowAltitude > 0 ){
            takeOffDistanceIncrease = takeOffDifference / ( (highAltitude - lowAltitude) / 100 ) ;
            takeOffDistanceRequired = takeOffDistanceLowAltitude + ( ( (givenAltitude - lowAltitude) / 100) * takeOffDistanceIncrease );

            showStep( "Low altitude is GREATER than 0<br />Divide takeoff difference by altitude difference divided by 100<br />Takeoff distance incrases by <strong>" + takeOffDistanceIncrease + " ft. per 100 ft. of altitude increase." );
            showStep( "Take difference between given altitude and low altitude divided by 100 and multiply it by takeoff distance increase, then add this to 'low altitude' takeoff difference");

        } else {
            takeOffDistanceRequired = takeOffDistanceLowAltitude + (  (givenAltitude  / 500) * ( takeOffDifference / (( highAltitude - givenAltitude ) / 100) ) );
        }

        console.log( 'takeOffDistanceIncrease: ' + takeOffDistanceIncrease );
        console.log('takeOffDistanceRequired: ' + takeOffDistanceRequired );

        //showStep( "Take of distance increases <strong>" + takeOffDistanceIncrease + " feet per 100 ft.</strong> of latitude.");
        console.log( 'leaving interpolateForAltitude( )');
        return interpolator.correctForNoneStandardTemp( lowWeight, lowAltitude, givenAltitude, givenTemperature, takeOffDistanceRequired );
    }


    /* ----------------------------------------------*
     *
     *  START UI INTERACTION
     *
     *-----------------------------------------------*/
    $('#test').click( function( e ){
        e.preventDefault();
        console.clear();
        stepNo = 1; // reset counter for problems solving step(s) display

        /* clear debug screen dimentions */
        consolePanel.text('').hide();

        var givenAltitude =     $('#givenAltitude').val();    //= 2500; // FT
        var givenTemperature =  $('#givenTemperature').val(); //= 24;   // C
        var givenWeight =       $('#givenWeight').val();      //= 2400; // LBS
        var givenHeadWind =     $('#givenHeadwind').val();    //= 25;   // KTS
        var givenSurface =      $('#surface').val();          // hard like asphalt or concrete or soft like sod
        var calculate =         $('#calculate').val();        // required take off distance or ground roll
        console.log( "var givenAltitude: " + givenAltitude );
        console.log( "var givenTemperature: " + givenTemperature);

        if( 1 == 1 /*altitudesAndTemperatures.hasOwnProperty( givenAltitude ) */ ){

            console.log( '1st if: !altitudesAndTemperatures.hasOwnProperty( givenAltitude )');

            showStep( 'Is given altitude of ' + givenAltitude + ' available in data table?' );

            //$('#test').val( calculate + " required : " + interpolateForAltitude( givenAltitude, givenHeadWind, givenWeight, givenTemperature, calculate ) + " feet" );
            interpolateForAltitude( givenAltitude, givenHeadWind, givenWeight, givenTemperature, calculate );

            showAll();
            console.log( 'leaving 1st if: !altitudesAndTemperatures.hasOwnProperty( givenAltitude )');
            return;
        } else {

//            var z = solve(givenAltitude, givenHeadWind, givenWeight, 'low', givenTemperature);
//            var y = solve(givenAltitude, givenHeadWind, givenWeight, 'high', givenTemperature);
//
//            console.log( z )
//            console.log( y )
//
//            console.log( "z: " + z.x );
//            console.log( "y: " + y.x );
//
//            var zDiff = ( y.x - z.x  ).toFixed( 1 );
//            console.log("ground roll difference: " +  zDiff);
//
//            var grossWtDiff = parseInt(z.highWeight ) - parseInt( z.lowWeight );
//            console.log("grossWtDiff: " + grossWtDiff );
//
//            /* number of '100' unit steps */
//            var wtSteps = grossWtDiff / 100;
//            console.log("wtSteps: " + wtSteps );
//
//            /* ground roll difference per gross wt step */
//            var stepV = zDiff / wtSteps;
//            console.log( "stepV: " + stepV );
//
//            /* FINAL NUMBER */
//            console.log('---- FINAL NUMBER ----');
//            //alert(  ((parseInt(z.highWeight) - givenWeight) / 100) * stepV );
//            var f = ( z.x + ( (( parseInt( z.highWeight ) - givenWeight ) / 100 ) * stepV ));//.toFixed( 1 );
//            console.log( f );
//
//            /* TODO: pass low altitude instead of hard coded 2500 ft */
//            var fx = interpolator.correctForNoneStandardTemp(2500 ,givenAltitude,givenTemperature, f)
//
//            /* move major part of the content section for better readability */
//            //$('#inputFormWrapper').hide('fast');
//            //consolePanel.css('width', '100%');
//
//            showStep( "Takeoff distance required is <strong>" + fx + " ft.</strong>");
//            showAll();
        }
    });

    interpolator.init();



});