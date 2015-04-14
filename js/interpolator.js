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

if( (typeof console === 'undefined') || (  !window.console )){
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
    });

    var interpol = {

        STANDARD_TEMP : 15, // standard temperature at sea level 15 degrees Celsius
        WEIGHT_INCREMENT_UNIT : 100,
        ALTITUDE_INCREMENT_UNIT : 500,

        questionId : 0,
        givenTemperature : 0,
        termperatueAdjustement : "",
        givenAltitude : 0,
        givenWeight : 0,
        givenHeadWind : 0,
        headwindCorrection : 0,
        tailwind : 0,
        surface : 0,
        calculate : "",
        adjustForHeadwindAtTheEnd : true,

	    compAnswer : 0,

        init : function(){
            consolePanel.html('width: ' + w + 'px <br />height: ' + h + 'px' + " console: " + console );

            $('.questionData').click( function(){

                var qId = parseInt( $(this).attr('id'), 10);
                interpol.questionId = qId;

                $("#questionNo").text( qId );

                interpol.givenTemperature = questionsData[ qId ][ "temperature"];
                $("#givenTemperature").val( interpol.givenTemperature );

                interpol.temperatureAdjustment = questionsData[ qId ][ "temperatureAdjustment" ];

                interpol.givenAltitude  = questionsData[ qId ][ "pressurealtitude"];// $(this).attr('data-pressurealtitude');
                $("#givenAltitude").val( interpol.givenAltitude );

                interpol.givenWeight = questionsData[ qId ]["weight"];// $(this).attr( 'data-weight');
                $("#givenWeight").val( interpol.givenWeight );

                interpol.givenHeadWind  = questionsData[ qId ]["headwind"];// $(this).attr('data-headwind');
                $("#givenHeadwind").val( interpol.givenHeadWind );

                interpol.headwindCorrection = questionsData[ qId ][ "headwindCorrection" ];

                interpol.surface = questionsData[ qId ]["surface"];// $(this).attr('data-surface');
                $('#surface').val( interpol.surface );

                interpol.calculate = questionsData[ qId ]["calculate"];// $( this).attr( 'data-calculate');
                $('#calculate').val( interpol.calculate );

                $("#test").val("CALCULATE");

                interpol.adjustForHeadwindAtTheEnd = questionsData[ qId ]["adjustForHeadwindAtTheEnd"];

                fieldsWrapper.addClass('fieldsWrapper');

                consolePanel.empty().hide();
                contentPanel.hide().children('div, table').hide();
                formWrapper.removeClass('narrowLeft').show();


	        /* BUILD MY TREE */


	        /*
	         in case of no exact matches for
	         WEIGHT, HEADWIND, TEMPERTURE OR ALTITUDE
	         we have an easy access tree of nearest LOW and HIGH values
	         */
	        nearest = {
		        lowWeight : 0,
			        highWeight : 0,

			        lowHeadWind : 0,
			        highHeadwind :0,

			        lowTemperature : 0,
			        highTemperature : 0,

			        lowAltitude : 0,
			        highAltitude : 0
	        };



	        /* now loop over weights and build the tree */
			interpol.buildTree();

	        })/* END ON CLICK */

            }, /* END init */


	    buildTree  : function(){
		    var tree = {}

		    var tempWeight =[{}];

		    for( var grossWeightLb in takeOffData ){

			    var weight = "";

			    if( takeOffData.hasOwnProperty( grossWeightLb ) ) {

				    weight =  takeOffData[ grossWeightLb ];

				    var headwinds = "";

				    /*
				     * START init loop of WEIGHTS
				     *
				     */
				    for( var key in weight ) {
					    if (weight.hasOwnProperty(key)) {

						    if( parseInt( key ) == parseInt( interpol.givenWeight) ){
							    tempWeight = [];
							    tempWeight.push( parseInt( key )  );
							    break;
						    } else {
							    //var xx =
							    tempWeight.push( { key  : key   } );
						    }
					    }
				    }/* end init loop of WEIGHTS */
				    /* go over the list and use get LOW and HIGH values */
				    for( var v in tempWeight ){
					    console.log( "v in temp weight: " + tempWeight[v] );
				    }
				    var x = interpol.getLowAndHigh(tempWeight, interpol.givenWeight )
			    }
		    }
		    var tempStop  = 0;
	    },

        getHeadwind : function( weight, headWind, solveForHighOrLowWeight, altitude ){
            var headWindIncrement = 5; // increases or decreases in headwind
            /* find LOW and HIGH WEIGHT */
            var lowAndHighWeight = interpol.getLowAndHigh( takeOffData[ 'grossWeightLb' ], weight );

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
            var lowAndHighHeadWind = interpol.getLowAndHigh( tempLowWeight, headWind );
            lowHeadWind = lowAndHighHeadWind.low;
            highHeadWind = lowAndHighHeadWind.high;

            /* interpolate GROUND ROLL between LOW and HIGH Headwind */
            return lowHeadWind;



        },/* getHeadwind() */

        getTakeOffDistance : function( lowWeight, highWeight, givenHeadWind, altitude, temp, calculate, givenTemperature ){
            var lowWeightTakeOffDistance = 0;
            var highWeightTakeOffDistance = 0;

            if( interpol.adjustForHeadwindAtTheEnd){
                givenHeadWind = "headwindNotProvided";
            }

            if( !takeOffData[ 'grossWeightLb' ][ lowWeight ][ givenHeadWind ] ){
                var xxx = interpol.getHeadwind( lowWeight, givenHeadWind, 'low', altitude );
                givenHeadWind = xxx;
            }

            if( interpol.adjustForHeadwindAtTheEnd ) {
                if (lowWeight != highWeight) {
                    lowWeightTakeOffDistance = takeOffData[ 'grossWeightLb' ][ lowWeight ][ givenHeadWind ][ altitude ][ givenTemperature ][ calculate ];

                    highWeightTakeOffDistance = takeOffData[ 'grossWeightLb' ][ highWeight ][ givenHeadWind ][ altitude ][givenTemperature ][ calculate ];

                    var takeOffDiff = highWeightTakeOffDistance - lowWeightTakeOffDistance;
                    var weightDiff = 1;

                    if(  (highWeight - lowWeight) > 0 ){
                        weightDiff =  highWeight - lowWeight;
                    }
                    var y = takeOffDiff / ( weightDiff / 100 );
                    var x = (  ( ( highWeight - lowWeight ) / 100 ) * y );
                    return lowWeightTakeOffDistance + x;
                } else if (lowWeight === highWeight) {
                    var h224 = givenHeadWind;
                    if( interpol.adjustForHeadwindAtTheEnd){
                        h224 = "headwindNotProvided";
                    }
                    var dataTemperature = interpol.getNearestLow( takeOffData[ 'grossWeightLb' ][ lowWeight ][ h224 ][ altitude ], givenTemperature); // = interpol.getNearest( takeOffData[ 'grossWeightLb' ][ lowWeight ][ h224 ][ altitude ], givenTemperature);
                    return  takeOffData[ 'grossWeightLb' ][ lowWeight ][ h224 ][ altitude ][ dataTemperature  ][ calculate ];
                }
            }
            /* we have a headwind to contend with in data table */
            else {
                if (lowWeight != highWeight) {
                    var gh = interpol.getNearestHigh( takeOffData[ 'grossWeightLb' ][ lowWeight ], givenHeadWind );
                    var hlTemp =  interpol.getNearestLow( takeOffData[ 'grossWeightLb' ][ lowWeight ][ gh ][ altitude ], givenTemperature );
                    var lowHeadwind  = interpol.getNearestLow( takeOffData[ 'grossWeightLb' ][ lowWeight ], givenHeadWind );
                    var lowTemp = interpol.getNearestLow( takeOffData[ 'grossWeightLb' ][ lowWeight ][ lowHeadwind ][ altitude ], givenTemperature );

                    lowWeightTakeOffDistance = takeOffData[ 'grossWeightLb' ][ lowWeight ][ lowHeadwind ][ altitude ][ lowTemp ][ calculate ];

                    var highHeadwind  = interpol.getNearestHigh( takeOffData[ 'grossWeightLb' ][ highWeight ], givenHeadWind );
                    var highTemp = interpol.getNearestHigh( takeOffData[ 'grossWeightLb' ][ lowWeight ][ highHeadwind ][ altitude ], givenTemperature );

                    highWeightTakeOffDistance = takeOffData[ 'grossWeightLb' ][ highWeight ][highHeadwind][ altitude ][highTemp ][ calculate ];

                    var takeOffDiff = highWeightTakeOffDistance - lowWeightTakeOffDistance;
                    var weightDiff = highWeight - lowWeight;

                    var y = takeOffDiff / ( weightDiff / 100 );

                    var x = (  ( ( highWeight - $('#givenWeight').val() ) / 100 ) * y );

                    return lowWeightTakeOffDistance + x;
                } else if (lowWeight === highWeight) {
                    if( xxx == undefined ){
                        xxx = interpol.givenHeadWind
                    }
                    var t = interpol.getNearestHigh( takeOffData[ 'grossWeightLb' ][ lowWeight ][ xxx ][ altitude ], interpol.givenTemperature );
                    return  takeOffData[ 'grossWeightLb' ][ lowWeight ][ xxx ][ altitude ][ t  ][ interpol.calculate ];
                }
            }
        }, /* end getTakeOffDistance */

	    temperatureCorrectByPercent : function( distance, givenTemperature, temperatureAtAltitude ){
			var t = (givenTemperature - temperatureAtAltitude);
		    var cnt = 0.0;
		    for(var i = 0; i < t; i = i + 1 ){
			    t = t / 14;
			    cnt = cnt + 0.1;
		    }
		    return distance * ( 1 + cnt);
	    },

	    /*
	        if given altitude and temperature values don't exist in lookup table
	        derive temperature at given altitude
	     */
	    getTermperatureAtDerivedAltitude : function( weight, headwind ){
		    var derivedTemperature = 0;
		    if( [ givenAltitude ] == undefined ){
				var baseAltitude = interpol.getNearestLow( takeOffData[ 'grossWeightLb' ][ weight ][ headwind ], interpol.givenAltitude);
			    var baseTemperature = interpol.getNearestLow( takeOffData[ 'grossWeightLb' ][ weight ][ headwind ][ baseAltitude ], interpol.givenTemperature );
			    var temperatureDifference = givenTemperature - baseTemperature;
                return temperatureDifference;
		    }
	    },

        /**
         * adjust for temperature
         * The average change in temperature used by this cart is 2c for each thousand feet
         */
        correctForNoneStandardTemp : function(weight, lowAltitude, givenAltitude, givenTemperature, takeOffDistanceRequired ){
            var lowAltitudeTemperature;// =  takeOffData[ 'grossWeightLb'][ lowWeight ]["headwindLookUpValueNotAvailable"][ lowAltitude ][0];
            var hd = $('#givenHeadwind').val();
            if( interpol.adjustForHeadwindAtTheEnd ){
                hd = "headwindNotProvided";
            }
            var h = interpol.getNearestHigh( takeOffData[ 'grossWeightLb'][ weight ], hd );
            if( interpol.adjustForHeadwindAtTheEnd){
                h = hd;
            }
            var l = interpol.getLowAndHigh( takeOffData[ 'grossWeightLb'][ weight ][h][ lowAltitude ], givenTemperature, 'altitude, ');

            lowAltitudeTemperature = l.low;

            if( interpol.temperatureAdjustment == "degreesAboveStandard"){
                var temperatureIncrease = lowAltitudeTemperature - ( ((givenAltitude - lowAltitude) / 1000 ) * 2 ) ;
                showStep( "Temperature increases 2C per 1000 ft.,  " + temperatureIncrease + "C" );

                var temperatureAdjustment = 1;
                if( ( givenTemperature - temperatureIncrease ) > 0 ){
                   temperatureAdjustment = ( givenTemperature - temperatureIncrease ) / 14;
                    showStep( "Temperature adjustment: " + temperatureAdjustment );
                }

                temperatureAdjustment = temperatureAdjustment * 0.1;
                if( (takeOffDistanceRequired > 0) && (temperatureAdjustment > 0) ) {
                    takeOffDistanceRequired = takeOffDistanceRequired + ( takeOffDistanceRequired * temperatureAdjustment );
                }
            }

            if( interpol.temperatureAdjustment == "feetPerDegree"){
                var temperatureIncrease = givenTemperature -  lowAltitudeTemperature;
                temperatureIncrease = temperatureIncrease * 16;

                takeOffDistanceRequired = takeOffDistanceRequired + temperatureIncrease;
            }

            showStep( "take off distance adjusted for temp: " + takeOffDistanceRequired );
            showStep( "Adjust takeoff distance by multiplying it by temperature adjustment: " + takeOffDistanceRequired );

            showStep( "Takeoff distance required is <strong>" + Math.round( takeOffDistanceRequired ) + " ft.</strong>");

            return takeOffDistanceRequired;

        }, /* end correctForNoneStandardTemp */

        correctForSurface : function( takeOffDistance, surfaceType ){
            var correctedForSurface = takeOffDistance;

            if( surfaceType == "sod"){
                correctedForSurface = Math.round( (takeOffDistance * 1.08 ) );
            }
            showStep("Takeoff distance of " + takeOffDistance + "ft. corrected for " + surfaceType + " surfce: <strong>" + correctedForSurface + "ft.</strong>");
            return correctedForSurface;

        },

        correctForHeadwind : function ( takeOffDistance, headOrTailWind, percentCorrection, headwindIncrement  ) {
            var correctedForHeadwind = 0;
            var totalPercentToCorrectBy = ( headOrTailWind / headwindIncrement ) * percentCorrection;

            correctedForHeadwind = Math.round( takeOffDistance - ( takeOffDistance * totalPercentToCorrectBy  ) );
            showStep( "Takeoff distance of " + takeOffDistance + "ft. corrected to headwind of " + headOrTailWind + "kts.: <strong>" + correctedForHeadwind + "ft.</strong>");
            return correctedForHeadwind;

        },

        /*
         * Return the nearest LOW value OR the same value if exact match is found
         * @data: object to iterate over
         * @toBeFound: value to compare to when iterating over set
         *
         * */

        getNearestLow : function( data, toBeFound ){
                var x = interpol.getLowAndHigh( data, toBeFound);
                return x.low;
        },
        getNearestHigh : function( data, toBeFound ){
            var x = interpol.getLowAndHigh( data, toBeFound);
            return x.high;
        },


        /* example:
         *
         */
        getDifferenceUnit : function(lowAndHighValues, incrementUnit ){

            var dif = function( lowAndHighValues ){
                if( lowAndHighValues.low > lowAndHighValues.high ){
                     return lowAndHighValues.low -lowAndHighValues.high
                } else if( lowAndHighValues.low < lowAndHighValues.high ){
                    return lowAndHighValues.high - lowAndHighValues.low;
                } else if( lowAndHighValues.low == lowAndHighValues.high ){
                    return lowAndHighValues.low;
                }
            };

            return dif( lowAndHighValues ) / incrementUnit;

        },
        getFactors : function(number) {
            var i = 2;
            var f = [];
            for (i; i<= number; i++  ) {
                if (number % i == 0) {
                   // number /= i;
                    if( !(f.indexOf(i) > -1) ){
                        f.push( i )
                    }
                }
            }
            return f;
        },
	    getDistanceForGivenWeight : function( lowOrHighWeight ) {
		    interpolateWeight = true;

		    var lowAndHighWeight = interpol.getLowAndHigh(takeOffData[ 'grossWeightLb'], interpol.givenWeight);

		    var weightType = lowAndHighWeight.low;
		    if (lowOrHighWeight === "highWeight") {
			    weightType = lowAndHighWeight.high;
		    }
		    var lowHeadwind = 0;
		    var highHeadwind = 0;
		    /* no headwind match */
		    if (takeOffData[ 'grossWeightLb'][weightType][interpol.givenHeadWind] == undefined) {
			    interpolateHeadwind = true;
			    lowHeadwind = interpol.getNearestLow(takeOffData[ 'grossWeightLb'][ weightType ], interpol.givenHeadWind);
			    highHeadwind = interpol.getNearestHigh(takeOffData[ 'grossWeightLb'][ weightType ], interpol.givenHeadWind);

		    }
		    /* exact headwind match */
		    lowHeadwind = interpol.getNearestLow(takeOffData[ 'grossWeightLb'][ weightType ], interpol.givenHeadWind);
		    highHeadwind = interpol.getNearestHigh(takeOffData[ 'grossWeightLb'][ weightType ], interpol.givenHeadWind);
		    var x = 0;


		    var altitude = 0;
		    if( takeOffData[ 'grossWeightLb'][weightType][lowHeadwind ][ interpol.givenAltitude] == undefined ){
			    altitude = interpol.getNearestLow( takeOffData[ 'grossWeightLb'][weightType][lowHeadwind ], interpol.givenAltitude );
		    } else {
			    altitude = takeOffData[ 'grossWeightLb'][weightType][lowHeadwind ][ interpol.givenAltitude];
		    }

		    var nearestLowTemperature1 = interpol.getNearestLow(
			    takeOffData[ 'grossWeightLb' ]
				    [ weightType ]
				    [ lowHeadwind ]
				    [ altitude], interpol.givenTemperature);

		    var grounRollLowWeight1 = takeOffData[ 'grossWeightLb'][weightType][lowHeadwind ][ altitude][ nearestLowTemperature1][interpol.calculate];

		    var nearestLowTemperature2 = interpol.getNearestLow(takeOffData[ 'grossWeightLb'][ weightType ][highHeadwind ][ altitude ], interpol.givenTemperature);
		    var grounRollLowWeight2 = takeOffData[ 'grossWeightLb'][ weightType ][highHeadwind ][ altitude ][ nearestLowTemperature2 ][interpol.calculate];
		    var groundRolls = {
			    low: grounRollLowWeight1,
			    high: grounRollLowWeight2
		    };

		    var factors = 0;
            if( ( highHeadwind ) != lowHeadwind ){
                factors = interpol.getFactors(highHeadwind - lowHeadwind);
            } else {
               factors = interpol.getFactors( lowHeadwind );
            }
		    var givenHeadwindFactors = 0;
		    if (interpol.givenHeadWind == lowHeadwind) {

		    givenHeadwindFactors = interpol.getFactors(interpol.givenHeadWind )
	        } else {
			    givenHeadwindFactors = interpol.getFactors( interpol.givenHeadWind - lowHeadwind );
		    }


		    var differenceUnit = interpol.getDifferenceUnit( groundRolls, factors[0] );

		    return grounRollLowWeight1 - ( givenHeadwindFactors[0] * differenceUnit );
	    },

        /* example:
         *
         */
        incrementUp : function( lowValue, upToValue, differenceUnit, incrementUnit ){

            var x = (upToValue - lowValue) / incrementUnit;
            return x * differenceUnit;
        },


        incrementDown : function(){

        },


        getLowAndHigh : function( data, middleValue ){

            var l = 0;
            for( var key in data ){
                l = l + 1;
            }
            var inLoop = 0;
            var highAndLow = {
                low  : 0,
                high : 0
            };
            var mv = parseInt( middleValue );
            var t = 0;

            for (var key in data) {
                inLoop = inLoop + 1;

                var k = parseInt( key );
                if (k <= mv ) {
                    t = k;
                }

                if( l == inLoop && k == t ){
                    highAndLow.high = k;
                    highAndLow.low = k;
                    break;
                }

                if (k >= mv && k >= t) {
                    highAndLow.high = k;
                    highAndLow.low = t;
                    break;
                }
            }

            return highAndLow;
        }
    };


    function showAll(  ){
        var $target = $('html,body');

        fieldsWrapper.removeClass('fieldsWrapper');
        formWrapper.addClass('narrowLeft');
        contentPanel.children('div, table').hide();
        contentPanel.addClass('narrowRight');

        //$('#contentPanel').empty();
        $('#contentPanel').append( '<div style="background-color: #53ed2e; color: #001610; padding: 10px; border-radius: 4px;"> <span style="font-weight: bold">EXPECTED ANSWER:</span> ' + questionsData[ interpol.questionId  ][ "expectedAnswer" ]  + '</div>' )
        $('#contentPanel').show();

        $('.step').css('display', 'block');

        $target.animate({scrollTop: $target.height()}, 1000);

    }

    function showStep( msg ){
        var stuffToshow = '<div id="step' + stepNo + '" class="step"><div class="stepNumber"><span>' + stepNo + '</span></div><div class="stepBody" >' + msg + '</div><div style="clear:both;"></div></div>';
        $('#contentPanel').append( stuffToshow );
        stepNo++;
    }





    function interpolateForAltitude( givenAltitude, givenHeadWind, givenWeight, givenTemperature, calculate ) {
	    /* figure out the altitudes to interpolate between */
	    var lowWeight = 0;
	    var highWeight = 0;
	    var lowAltitude = 0;
	    var highAltitude = 0;
	    var headWindIncrement = 5; // increases or decreases in headwind

	    /* TODO: Figure out what needs to be interpolated */

	    // weight: true - false
	    var interpolateWeight = false;

	    // headwind: true - false
	    var interpolateHeadwind = false;

	    // temperature: true - false
	    var interpolateTemperature = false;

	    /* we need to check for headwind interpolation if there are any */
	    if (!interpol.adjustForHeadwindAtTheEnd) {
		    /* NO exact match on weight */
		    if (takeOffData[ 'grossWeightLb'][ interpol.givenWeight] == undefined) {

			    var distanceForLowWeight = interpol.getDistanceForGivenWeight("lowWeight");

			    var distanceForHightWeight = interpol.getDistanceForGivenWeight("highWeight");
			    var weightDifference = distanceForHightWeight - distanceForLowWeight;
			    var f = ( (interpol.getNearestHigh(takeOffData[ 'grossWeightLb'], interpol.givenWeight) - (interpol.getNearestLow(takeOffData[ 'grossWeightLb'], interpol.givenWeight) ) )) / 100;
			    var x = weightDifference / f;
			    var xx = interpol.givenWeight - (interpol.getNearestLow(takeOffData[ 'grossWeightLb'], interpol.givenWeight));
			    var z = ( xx / 100 ) * x;
			    var zz = z + distanceForLowWeight;
			    var lowW = interpol.getNearestLow(takeOffData[ 'grossWeightLb'], interpol.givenWeight);
			    var lowH = interpol.getNearestLow(takeOffData[ 'grossWeightLb'][ lowW ], interpol.givenAltitude);
                //var c = interpol.getTermperatureAtDerivedAltitude( f, lowH );
			    var temperatureAtAltitude = interpol.getNearestLow(takeOffData[ 'grossWeightLb'] [lowW] [ lowH ] [ interpol.givenAltitude ], interpol.givenTemperature);
			    return  interpol.temperatureCorrectByPercent(zz, interpol.givenTemperature, temperatureAtAltitude);
			    var x = 0;
		    }
		    /* we have EXACT MATCH on weight */
            else
            {
                var w = interpol.getNearestLow( takeOffData[ 'grossWeightLb'], interpol.givenWeight );
                var h = interpol.getNearestLow( takeOffData[ 'grossWeightLb'][ w ], interpol.givenHeadWind );

                /* is our altitude defined? */
                var hh = interpol.getNearestLow( takeOffData[ 'grossWeightLb'][ w ][h], interpol.givenAltitude );
                var altitudeMatch = true;

                if( hh != interpol.givenAltitude ){
                    var t1 = interpol.getNearestLow( takeOffData[ 'grossWeightLb'][ w ][h][hh], interpol.givenTemperature );
                    var distance1 =  takeOffData[ 'grossWeightLb'][ w ][h][hh][ t1 ][ interpol.calculate ];

                    var hh2 = interpol.getNearestHigh( takeOffData[ 'grossWeightLb'][ w ][h], interpol.givenAltitude );
                    var t2 = interpol.getNearestHigh( takeOffData[ 'grossWeightLb'][ w ][h][hh2], interpol.givenTemperature );
                    var distance2 =  takeOffData[ 'grossWeightLb'][ w ][h][hh2][ t2 ][ interpol.calculate ];

                    /* distance at higher alt and temp will be highter */
                    var distanceDiff = distance2 - distance1;
                    interpol.compAnswer = distanceDiff / ( (hh2 - hh ) / interpol.ALTITUDE_INCREMENT_UNIT );
                    interpol.compAnswer = distance1  + ( ( interpol.givenAltitude / interpol.ALTITUDE_INCREMENT_UNIT ) * d3 );
                    interpol.compAnswer = interpol.correctForNoneStandardTemp( interpol.givenWeight, hh, interpol.givenAltitude, interpol.givenTemperature, d4 );
                    var stop = 0;
                }
            }
	    }
        /*
        adjusting for headwind by % value once we have distance
        */
        else {
	    /* END we need to check for headwind interpolation if there are any */

	    /* END: Figure out what needs to be interpolated */

	    /* find LOW and HIGH WEIGHT */
	    var lowAndHighWeight = interpol.getLowAndHigh(takeOffData[ 'grossWeightLb'], givenWeight, "weight");
	    lowWeight = lowAndHighWeight.low;
	    highWeight = lowAndHighWeight.high;
	    showStep("find LOW and HIGH WEIGHT<br>Low: " + lowAndHighWeight.low + "<br>High: " + lowAndHighWeight.high);

	    // TODO: get proper headwinds
	    var h = "headwindNotProvided";
	    if (!interpol.adjustForHeadwindAtTheEnd) {
		    h = interpol.getNearestLow(takeOffData[ 'grossWeightLb'][ lowWeight ], givenHeadWind);
	    }

	    var lowAndHighAltitude = interpol.getLowAndHigh(takeOffData[ 'grossWeightLb'][ lowWeight ][ h ], givenAltitude, "altitude");
	    var highAltitude = interpol.getLowAndHigh(takeOffData[ 'grossWeightLb'][ highWeight ][ h ], givenAltitude, "altitude");
	    lowAltitude = lowAndHighAltitude.low;
	    highAltitude = lowAndHighAltitude.high;

	    //showStep( "Check if we have exact weight of if we need to interpolate between 2 weights:<br />low: " + lowWeight +  " high: " + highWeight )

	    var lowAltTemp = 0;
	    var highAltTemp = 0;
	    var hWind = 0;

	    if (interpol.adjustForHeadwindAtTheEnd) {
		    givenHeadWind = "headwindNotProvided";
	    }

	    /* START IF */

	    /*
	     get the take off distance for LOW altitude and both low and high weights

	     */
	    var extrapolatedHeadwind = takeOffData[ "grossWeightLb" ][ lowWeight][ givenHeadWind ];
	    if (extrapolatedHeadwind == undefined) {
		    extrapolatedHeadwind = interpol.getNearestLow(takeOffData[ "grossWeightLb" ][ lowWeight], givenHeadWind);
	    }

	    var lowTemperature;
	    var highTemperature;

	    var lowHeadWind;
	    var highHeadwind;
	    if (takeOffData[ "grossWeightLb" ][ lowWeight][ givenHeadWind ] == undefined) {
		    lowHeadWind = interpol.getNearestLow(takeOffData[ "grossWeightLb" ][ lowWeight], givenHeadWind);
		    highHeadwind = interpol.getNearestHigh(takeOffData[ "grossWeightLb" ][ lowWeight], givenHeadWind);
		    lowTemperature = interpol.getNearestLow(takeOffData[ "grossWeightLb" ][ lowWeight][ lowHeadWind ][lowAltitude], givenTemperature);
		    highTemperature = interpol.getNearestHigh(takeOffData[ "grossWeightLb" ][ lowWeight][ highHeadwind  ][lowAltitude], givenTemperature);

	    } else {
		    lowTemperature = interpol.getNearestLow(takeOffData[ "grossWeightLb" ][ lowWeight][ givenHeadWind ][lowAltitude], givenTemperature);
		    highTemperature = interpol.getNearestHigh(takeOffData[ "grossWeightLb" ][ lowWeight][ givenHeadWind  ][lowAltitude], givenTemperature);
	    }
	    var tempAltitude1 = interpol.getNearestLow(takeOffData[ "grossWeightLb" ][ lowWeight][ extrapolatedHeadwind ], lowAltitude);

	    var takeOffDistanceLowAltitude = interpol.getTakeOffDistance(lowWeight, highWeight, givenHeadWind, lowAltitude, tempAltitude1, calculate, lowTemperature);

	    showStep("Look up takeoff distance at low altitude of " + lowAltitude + " ft.: <strong>" + takeOffDistanceLowAltitude + " ft.</strong>");

	    var tempAltitude2 = interpol.getNearestHigh(takeOffData[ "grossWeightLb" ][ highWeight][ givenHeadWind ], highAltitude);

	    var handl = interpol.getLowAndHigh(takeOffData[ "grossWeightLb" ][ highWeight], givenHeadWind, "altitude");

	    //TODO: ACCESS distance directly if headwinds are available
	    // var lowHeadwindTakoff =  takeOffData[ "grossWeightLb" ][ highWeight][ handl.low ][ givenAltitude][ interpol.calculate ];

	    var takeOffDistanceHighAltitude = interpol.getTakeOffDistance(lowWeight, highWeight, givenHeadWind, highAltitude, tempAltitude2, calculate, highTemperature);
	    showStep("Look up takeoff distance at high altitude of " + highAltitude + " ft.: <strong>" + takeOffDistanceHighAltitude + " ft.</strong>");

	    /* END IF */


	    var takeOffDifference = 1;
	    if ((takeOffDistanceHighAltitude - takeOffDistanceLowAltitude ) > 0) {
		    takeOffDifference = takeOffDistanceHighAltitude - takeOffDistanceLowAltitude;
	    }

	    showStep('Difference between those 2: <strong>' + takeOffDifference + 'ft.</strong>');

	    var takeOffDistanceIncrease = 1;
	    var takeOffDistanceRequired = 0;


	    if (lowAltitude > 0) {
		    if ((highAltitude - lowAltitude) > 0) {
			    takeOffDistanceIncrease = takeOffDifference / ( (highAltitude - lowAltitude) / 100 );
		    } else {
			    takeOffDistanceIncrease = takeOffDifference / 100;
		    }

		    if ((givenAltitude - lowAltitude) > 0) {
			    takeOffDistanceRequired = takeOffDistanceLowAltitude + ( ( (givenAltitude - lowAltitude) / 100) * takeOffDistanceIncrease );
		    }
		    else {
			    takeOffDistanceRequired = takeOffDistanceLowAltitude;
		    }

		    showStep("Low altitude is GREATER than 0<br />Divide takeoff difference by altitude difference divided by 100<br />Takeoff distance incrases by <strong>" + takeOffDistanceIncrease + " ft. per 100 ft. of altitude increase.");
		    showStep("Take difference between given altitude and low altitude divided by 100 and multiply it by takeoff distance increase, then add this to 'low altitude' takeoff difference");

	    } else {
		    takeOffDistanceRequired = takeOffDistanceLowAltitude + (  (givenAltitude / 500) * ( takeOffDifference / (( highAltitude - givenAltitude ) / 100) ) );
	    }

	    //showStep( "Take of distance increases <strong>" + takeOffDistanceIncrease + " feet per 100 ft.</strong> of latitude.");
	    return interpol.correctForNoneStandardTemp(lowWeight, lowAltitude, givenAltitude, givenTemperature, takeOffDistanceRequired);
    }
    }

    /* ----------------------------------------------*
     *
     *  START UI INTERACTION
     *
     *-----------------------------------------------*/
    interpol.init();

    $('#test').click( function( e ){
        e.preventDefault();
        console.clear();
        stepNo = 1; // reset counter for problems solving step(s) display

        //showStep( 'Is given altitude of ' + givenAltitude + ' available in data table?' );
         var x  = interpolateForAltitude( interpol.givenAltitude, interpol.givenHeadWind, interpol.givenWeight, interpol.givenTemperature, interpol.calculate );

        if( interpol.surface == "sod"){
            x = interpol.correctForSurface( x, "sod")
        }

         if ( interpol.adjustForHeadwindAtTheEnd ){
             x = interpol.correctForHeadwind(x, interpol.headwindCorrection, 0.07, 10 );
         }

        showStep( "Final result: " + x );
        showAll();
        return;
    });

});