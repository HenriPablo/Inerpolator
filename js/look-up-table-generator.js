/**
 * Created by tomekpilot on 9/20/14.
 */

var interpol = {
    givenWeight : -1,
    givenHeadWind : -1,
    givenTemperature : -1,
    givenPressuerAltitude : -1,

    STANDARD_TEMP               : 15, // standard temperature at sea level 15 degrees Celsius
    WEIGHT_INCREMENT_UNIT       : 100,
    MAX_WEIGHT                  :5500, // look up table will be populated up to this widht
    DISTANCE_INCREMENT_UNIT     : 100,
    ALTITUDE_INCREMENT_UNIT     : 100,
    HEAD_WIND_INCREMENT_UNIT    : 5,
    HEAD_WIND_CORRECTION_INCREMENT : 10,
    HEAD_WIND_CORRECTION_PERCENT: 7,
    TEMPERATURE_INCREMENT_UNIT : 1, /* degrees Celcius */

    temperatureCorrectByPercent : function( distance, givenTemperature, temperatureAtAltitude ){
        var t = (givenTemperature - temperatureAtAltitude);
        var cnt = 0.0;
        for(var i = 0; i < t; i = i + 1 ){
            t = t / 14;
            cnt = cnt + 0.1;
        }
        return distance * ( 1 + cnt);
    },

    temperatureCorrectByDegree : function( distance, question, /*givenTermperature, nearestLowTemperarure, pressureAltitude, nearestLowAltitude,*/ lookUpData    ){
        /* standard temp change is 1 deg. per 500 or 2 deg. per 1000 */
        var lookupAltDiff = lookUpData.nearestHighAltitude - lookUpData.nearestLowAltitude;
        var lookupTempDiff = lookUpData.nearestHighTemperature - lookUpData.nearestLowTemperature;


        var altitudeIncreasePerDegree = (question.pressurealtitude - lookUpData.nearestLowAltitude ) / 500;

        var expectedTempAtAltitudeGiven = lookUpData.nearestHighTemperature - (  ( question.pressurealtitude - lookUpData.nearestLowAltitude ) / altitudeIncreasePerDegree ) ;


        var lookupTemperatureDifference = lookUpData.nearestHighTemperature - altitudeIncreasePerDegree;
        //var d1 = lookupTemperatureDifference / ( ( lookUpData.nearestHighAltitude - lookUpData.nearestLowAltitude ) / 500 )

        //var tIncraseUnit  = (lookUpData.nearestHighTemperature - lookUpData.nearestLowTemperature) / lookupTemperatureDifference;
        var  altitudeDifferenceInThousands = ( question.pressurealtitude - lookUpData.nearestLowAltitude ) / 1000;
        //var temperatureDifference = ( lookUpData.nearestLowTemperature - question.temperature )
        var tempIncrease = altitudeDifferenceInThousands * 2;
        var tempDiff = lookUpData.nearestLowTemperature - tempIncrease;
        if( tempDiff < 0 ){
            tempDiff = tempDiff * -1;
        }

        var tempAboveStandard = question.temperature - lookupTemperatureDifference; // tempDiff;
        var correctionUnits = tempAboveStandard / 14;

        // if there's no increase in temperature no need to correct for non-standard temperature;
        if( expectedTempAtAltitudeGiven == question.temperature){
            return distance;
        } else {
            return distance + ( distance *  ( ( correctionUnits * 10  ) / 100 ) );
        }
    },

    correctForSurface : function( takeOffDistance, surfaceType ){
        var correctedForSurface = takeOffDistance;

        if( surfaceType == "sod"){
            correctedForSurface =  (takeOffDistance * 1.08 );
        }
        //showStep("Takeoff distance of " + takeOffDistance + "ft. corrected for " + surfaceType + " surfce: <strong>" + correctedForSurface + "ft.</strong>");
        return correctedForSurface;

    },

    correctForHeadwind : function ( takeOffDistance, headOrTailWind ) {
        var correctedForHeadwind = 0;
        var totalPercentToCorrectBy = ( headOrTailWind / interpol.HEAD_WIND_CORRECTION_INCREMENT ) * interpol.HEAD_WIND_CORRECTION_PERCENT;

        /* correct for headwind */
        if( headOrTailWind > 0 )
        {
            correctedForHeadwind = takeOffDistance - ( takeOffDistance * ( totalPercentToCorrectBy / 100 ) );
        }
        else /* correct for tailwind */
        {
            correctedForHeadwind = takeOffDistance + ( takeOffDistance * 0.05 );
        }
        //showStep( "Takeoff distance of " + takeOffDistance + "ft. corrected to headwind of " + headOrTailWind + "kts.: <strong>" + correctedForHeadwind + "ft.</strong>");
        return correctedForHeadwind;

    },
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

    getHeadwindIncreaseUnit : function( distanceDifference, highWind, lowWind ){
        return distanceDifference / ( ( highWind - lowWind ) / interpol.HEAD_WIND_INCREMENT_UNIT );

    },

    getAdjustedDistance : function( distance, givenWind, lowWind, increaseUnit ){
        return distance - ( (givenWind - lowWind ) / interpol.HEAD_WIND_INCREMENT_UNIT * increaseUnit );
    },

    getWeightIncreaseUnit : function( weightDifference, highAltitude, lowAltitude ){
        return weightDifference / ( ( highAltitude - lowAltitude ) / interpol.ALTITUDE_INCREMENT_UNIT );
    },

    getFinalTakeOffDistance : function( adjustedDistance, givenAltitude, lowAltitude, increaseUnit ){
       return adjustedDistance  + (( givenAltitude - lowAltitude ) / interpol.ALTITUDE_INCREMENT_UNIT ) * increaseUnit;
    },

    getIncreaseUnitByTemperature : function( distance, highTemperature, lowTemperature ){
        return distance / ( ( highTemperature - lowTemperature ) / interpol.TEMPERATURE_INCREMENT_UNIT );
    },

    getFinalTakeOffDistanceByTemperature : function ( distance, nearestHighTemperature, givenTemperature, increaseUnit ) {
        return distance + ( (nearestHighTemperature - givenTemperature ) / interpol.TEMPERATURE_INCREMENT_UNIT ) * increaseUnit;
    },

    getFinalTakeOffDistanceByWeight : function( distance, givenWeight, nearestLowWeight, increaseUnit ){
        return distance + ((givenWeight - nearestLowWeight) / interpol.WEIGHT_INCREMENT_UNIT ) * increaseUnit;
    },

    getFinalIncreaseUnit : function( finalDifference, highWeight, lowWeight ){
        return finalDifference / ( (highWeight - lowWeight ) / interpol.WEIGHT_INCREMENT_UNIT );
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
    },
    calculateDistance : function( q, d ){
        var bucket = {};
        var final = 0;

        /* WEIGHTS */
        var lowWeight = d.nearestLowWeight;
        var highWeight = d.nearestHighWeight;
        var givenWeight = q.weight;
        bucket.lowWeight = lowWeight;
        bucket.lowHeadwindA = lowHeadwindA;

        /* HEADWINDS */
        var highHeadwindA = d.nearestHighHeadwind;
        var lowHeadwindA = d.nearestLowHeadwind;

        var highHeadwind2 = 0;
        var lowHeadwind2 = 0;
        var givenHeadwind = q.headwind;

        bucket.highHeadwindA  = highHeadwindA;
        bucket.lowHeadwindA = lowHeadwindA;
        bucket.givenHeadwind = givenHeadwind;

        /* ALTITUDES */
        var givenAltitude = q.pressurealtitude;
        var lowAltitudeA = d.nearestLowAltitude;
        var highAltitudeA = d.nearestHighAltitude;

        /* TEMPERATURES */


        var lowDistanceA = 0;   // q666: 245
        var highDistanceA = 0;  // q666: 295

        var lowDistanceB = 0;   // q666: 120
        var highDistanceB = 0;  // q666: 155

        var lowDistanceC = 0;   // q666: 370
        var highDistanceC = 0;  // q666: 455

        var lowDistanceD = 0;   // q666: 200
        var highDistanceD = 0;  // q666: 255

        var distanceDiffA = 0;
        var distanceDiffB = 0;
        var distanceDiffC = 0;
        var distanceDiffD = 0;

        var lowHighDistanceDiff = 0;
        var lowDistanceDif = 0;

        var highDistanceDif = 0;

        var correctedDistanceA = 0;
        var correctedDistanceB = 0;
        var correctedDistanceDiff = 0;



        /* GROUND ROLLS */
        if(q.calculate === "groundRoll") {
            lowDistanceA = d.nearestLowGroundRoll; // expected 205
            highDistanceA = d.nearestHighGroundRoll; // expected 245

            lowDistanceB = d.nearestLowGroundRoll2;//expected 370
            highDistanceB = d.nearestHighGroundRoll2;//expected 200

            lowDistanceC = d.nearestLowGroundRoll3;
            highDistanceC = d.nearestHighGroundRoll3;

            lowDistanceD = d.nearestLowGroundRoll4;
            highDistanceD = d.nearestHighGroundRoll4;
        }
        else /* TAKE-OFFS */
        {

            lowDistanceA = d.nearestLowTakeOffDistance;
            highDistanceA = d.nearestHighTakeOffDistance;

            lowDistanceB = d.nearestLowTakeOffDistance2;
            highDistanceB = d.nearestHighTakeOffDistance2;

            lowDistanceC = d.nearestLowTakeOffDistance3;
            highDistanceC = d.nearestHighTakeOffDistance3;

            lowDistanceD = d.nearestLowTakeOffDistance4;
            highDistanceD = d.nearestHighTakeOffDistance4;
        }

        distanceDiffA       = highDistanceA - lowDistanceA; //expected 40
        distanceDiffB       = highDistanceB - lowDistanceB; //expected 40

        lowDistanceDif      = lowDistanceB - lowDistanceA;
        highDistanceDif     = highDistanceB - highDistanceA;


        distanceDiffC       = highDistanceC - lowDistanceC;
        distanceDiffD       = highDistanceD - lowDistanceD;


        lowHighDistanceDiff = lowDistanceA - highDistanceA;

        if( distanceDiffA < 0) {
            distanceDiffA = distanceDiffA * -1;
        }

        if( distanceDiffB < 0) {
            distanceDiffB = distanceDiffB * -1;
        }

        if( lowHighDistanceDiff < 0 ){
            lowHighDistanceDiff = lowHighDistanceDiff * -1;
        }

        var increaseUnitA = 0;
        var increaseUnitB = 0;
        var increaseUnitFinal = 0;

        var corrDistA = 0;
        var corrDistB = 0;
        var distDiff = 0;

        /* question 0 */
        if( d.altitudeMatch == false &&
            d.headWindMatch == false &&
            d.temperatureMatch == false &&
            d.weightMatch == false )
        {

            /* altitude related items */
            var altitudeDifference = highAltitudeA - lowAltitudeA;


            /* low weight & low altitude takeoff distances difference */
            var d1 = lowDistanceA - lowDistanceB;

            /* low weight & high altitude takeoff distance difference */
            var d2 = highDistanceA - highDistanceB;

            /* high weight & low altitude takeoff distance difference */
            var d3 = lowDistanceC - lowDistanceD;

            /* high weight & high altitude takeoff distance difference */
            var d4 = highDistanceC - highDistanceD;


            /* PART 1 */
            /* increase unit low weight and low altitude headwind */
            var iuA =  interpol.getHeadwindIncreaseUnit( d1, highHeadwindA, lowHeadwindA );
            /* low weight and low altitude takeoff distance */
            var corrDistA = interpol.getAdjustedDistance( lowDistanceA, givenHeadwind, lowHeadwindA, iuA );


            /* increase unit for low weight and high altitude headwind */
            var iuB =  interpol.getHeadwindIncreaseUnit( d2, highHeadwindA, lowHeadwindA );

            var corrDistB = interpol.getAdjustedDistance( highDistanceA, givenHeadwind, lowHeadwindA, iuB );

            /* low weight take off difference for low and high altitudes */
            var lowWeightAltDiffA = corrDistB - corrDistA;
            var lowWeightAltIU = interpol.getWeightIncreaseUnit(  lowWeightAltDiffA, highAltitudeA, lowAltitudeA );

            /* final takeoff dist for low weight at given altitude */
            var finalLowWeightTakeOffDist = interpol.getFinalTakeOffDistance( corrDistA, givenAltitude, lowAltitudeA, lowWeightAltIU );


            /* PART 2 */
            /* increase unit high weight and low altitude headwind */
            var iuB = interpol.getHeadwindIncreaseUnit( d3, highHeadwindA, lowHeadwindA );

            /* high weight and low altitude takeoff distance */
            var corrDistC = interpol.getAdjustedDistance( lowDistanceC, givenHeadwind, lowHeadwindA, iuB );


            /* increase unit for high weight and high altitude headwind */
            var iuC = interpol.getHeadwindIncreaseUnit( d4, highHeadwindA, lowHeadwindA )

            var corrDistD = interpol.getAdjustedDistance( highDistanceC, givenHeadwind, lowHeadwindA, iuC )


            /* high weight take off difference for low and high altitudes */
            var highWeightAltDiffB = corrDistD - corrDistC;
            var highWeightAltIU = interpol.getWeightIncreaseUnit(  highWeightAltDiffB, highAltitudeA, lowAltitudeA );

            /* final takeoff dist for HIGH WEIGHT at given altitude */
            var finalHighWeightTakeOffDist = interpol.getFinalTakeOffDistance( corrDistC, givenAltitude, lowAltitudeA, highWeightAltIU );


            /* final dist diff */
            var finalDiff = finalHighWeightTakeOffDist - finalLowWeightTakeOffDist;

            /* final increase unit */
            var finalIU = interpol.getFinalIncreaseUnit( finalDiff, highWeight, lowWeight );

            final = finalLowWeightTakeOffDist + ( ( ( givenWeight - lowWeight) / interpol.WEIGHT_INCREMENT_UNIT ) * finalIU );
            console.log( final );
        }

        /* start question 1 */
        if( d.altitudeMatch == true &&
            d.headWindMatch == false &&
            d.temperatureMatch == false &&
            d.weightMatch == false )
        {
            increaseUnitA = interpol.getHeadwindIncreaseUnit(distanceDiffA, highHeadwindA, lowHeadwindA);
            correctedDistanceA = interpol.getAdjustedDistance( lowDistanceA, givenHeadwind, lowHeadwindA, increaseUnitA );

            increaseUnitB = interpol.getHeadwindIncreaseUnit(distanceDiffB, highHeadwindA, lowHeadwindA);
            correctedDistanceB = interpol.getAdjustedDistance( lowDistanceB, givenHeadwind, lowHeadwindA, increaseUnitB );

            correctedDistanceDiff = correctedDistanceB - correctedDistanceA;

            increaseUnitA  =  interpol.getFinalIncreaseUnit (correctedDistanceDiff, highWeight, lowWeight);
            final = interpol.getFinalTakeOffDistanceByWeight( correctedDistanceA, givenWeight, lowWeight, increaseUnitA );
        }
        /* end question 1 */

        /* start question 2 */
        if( d.altitudeMatch == false &&
            d.headWindMatch == true &&
            d.temperatureMatch == false &&
            d.lowAndHighAltitudesMatch == false &&
            d.lowAndHighTemperatureMatch == true &&
            d.weightMatch == true && q.calculate == "groundRoll" )
        {
            increaseUnitA = interpol.getWeightIncreaseUnit( distanceDiffA, highAltitudeA, lowAltitudeA );
            final = interpol.getFinalTakeOffDistance( lowDistanceA ,givenAltitude, lowAltitudeA, increaseUnitA );
        }/* question 2 */

        /* start question 3 */
        if( d.altitudeMatch == false &&
            d.headWindMatch == true &&
            d.temperatureMatch == false &&
            d.weightMatch == false )
        {
            increaseUnitA = interpol.getFinalIncreaseUnit( lowDistanceDif, highWeight, lowWeight );
            correctedDistanceA = interpol.getFinalTakeOffDistance( lowDistanceA, givenWeight, lowWeight, increaseUnitA );

            increaseUnitB = highDistanceDif / ( ( highWeight - lowWeight ) / interpol.WEIGHT_INCREMENT_UNIT );//63.75
            correctedDistanceB = highDistanceA + ( ( ( givenWeight - lowWeight) / interpol.WEIGHT_INCREMENT_UNIT ) * increaseUnitB ); // 742.5

            correctedDistanceDiff = correctedDistanceB - correctedDistanceA;
            increaseUnitFinal = interpol.getWeightIncreaseUnit( correctedDistanceDiff, d.nearestHighAltitude, d.nearestLowAltitude ); /* expecting her 4.5 */

            final = correctedDistanceA + ( ((givenAltitude - lowAltitudeA) / interpol.ALTITUDE_INCREMENT_UNIT ) * increaseUnitFinal );// 652.5
        }
        /* end question 3 */


        /* question 4 */
        if( d.altitudeMatch == false &&
            d.headWindMatch == true &&
            d.temperatureMatch == false &&
            d.weightMatch == true &&
            d.lowAndHighAltitudesMatch == false &&
            d.lowAndHighTemperatureMatch == true &&
            q.calculate == "takeOffDistance")
        {

            var a = interpol.getWeightIncreaseUnit( lowHighDistanceDiff, d.nearestHighAltitude, d.nearestLowAltitude );

            final = interpol.getFinalTakeOffDistance( lowDistanceA, q.pressurealtitude, d.nearestLowAltitude, a );

        }
        /* end question 4 */



        /* question 5 */
        if( d.altitudeMatch == true &&
            d.headWindMatch == true &&
            d.temperatureMatch == true &&
            d.weightMatch == false
        )
        {
            lowHighDistanceDiff = highDistanceA - lowDistanceA; // 330
            increaseUnitA =  interpol.getFinalIncreaseUnit(lowHighDistanceDiff, n5.nearestHighWeight, n5.nearestLowWeight );

            final = interpol.getFinalTakeOffDistanceByWeight( lowDistanceA, q6761.weight, n5.nearestLowWeight, increaseUnitA )
        }

        /* end question 5 */

        /* question 6 */
        if( d.altitudeMatch == false &&
            d.headWindMatch == true &&
            d.temperatureMatch == false &&
            d.weightMatch == true &&
            d.lowAndHighAltitudesMatch == false &&
            d.lowAndHighTemperatureMatch == false
        )
        {
            var increaseUnitA = interpol.getIncreaseUnitByTemperature( distanceDiffA , d.nearestHighTemperature, d.nearestLowTemperature);
            lowDistanceA = interpol.getFinalTakeOffDistanceByTemperature( lowDistanceA, q.temperature, d.nearestLowTemperature, increaseUnitA ); // 2,225

	        var increaseUnitB = interpol.getIncreaseUnitByTemperature( distanceDiffB, d.nearestHighTemperature, d.nearestLowTemperature );
            lowDistanceB = interpol.getFinalTakeOffDistanceByTemperature( lowDistanceB, d.nearestHighTemperature, q.temperature, increaseUnitB );// 2,465

            var n6Diff = lowDistanceB - lowDistanceA; // 240

            var distIncreaseUnit = interpol.getWeightIncreaseUnit( n6Diff, d.nearestHighAltitude, d.nearestLowAltitude );

            final = interpol.getFinalTakeOffDistance(lowDistanceA, q.pressurealtitude, d.nearestLowAltitude,  distIncreaseUnit );
        }
        /* end question 6 */


        /* question 7 */
        if( d.altitudeMatch == true &&
            d.headWindMatch == true &&
            d.temperatureMatch == false &&
            d.weightMatch == true &&
            d.lowAndHighAltitudesMatch == true &&
            d.lowAndHighTemperatureMatch == false )
        {
            // distance of increase per 1C of temp increase
            var increaseUnitA = interpol.getIncreaseUnitByTemperature( distanceDiffA, d.nearestHighTemperature, d.nearestLowTemperature );
            final = interpol.getFinalTakeOffDistanceByTemperature(d.nearestLowTakeOffDistance, d.nearestHighTemperature, q.temperature, increaseUnitA  );
        }
        /* end question 7 */



        if( q.surface != "asphalt"){
            final = interpol.correctForSurface( final, "sod");
        }
        if( q.adjustForHeadwindAtTheEnd ){
            final = interpol.correctForHeadwind( final, q.headwindCorrection )
        }

        if( q.temperatureAdjustment == "degreesAboveStandard"){
            final = interpol.temperatureCorrectByDegree( final, q, d );//260.7
        }

        return final;
    }
};

function test( givenWeight, givenHeadwind, givenTemperature, givenPressureAltitude ) {
    interpol.givenWeight = givenWeight;
    interpol.givenHeadWind = givenHeadwind;
    interpol.givenTemperature = givenTemperature;
    interpol.givenPressuerAltitude = givenPressureAltitude;

    var tree = {};

    var nearest = {
        "weightMatch": false,
        "headWindMatch": false,
        "altitudeMatch": false,
        "temperatureMatch": false,

        "nearestLowWeight" : -1,
        "nearestHighWeight" : -1,

        "nearestLowHeadwind" : -1,
        "nearestHighHeadwind" : -1,

        "nearestLowAltitude" : -1,
        "nearestHighAltitude" : -1,

        "nearestLowTemperature" : -1,
        "nearestHighTemperature" : -1,

        "nearestLowGroundRoll" : -1,
        "nearestHighGroundRoll": -1,

        "nearestLowTakeOffDistance" : -1,
        "nearestHighTakeOffDistance" : -1,

        "nearestLowGroundRoll2" : -1,
        "nearestHighGroundRoll2": -1,

        "nearestLowTakeOffDistance2" : -1,
        "nearestHighTakeOffDistance2" : -1,

        "nearestLowGroundRoll3" : -1,
        "nearestHighGroundRoll3": -1,

        "nearestLowTakeOffDistance3" : -1,
        "nearestHighTakeOffDistance3" : -1,

        "nearestLowGroundRoll4" : -1,
        "nearestHighGroundRoll4": -1,

        "nearestLowTakeOffDistance4" : -1,
        "nearestHighTakeOffDistance4" : -1,

        "lowWeight": {
            "weight": -1,

            "lowWind": {
                "speed": -1,

                "lowAltitude" :{
                    "altitude": -1,
                    "temperature": -1,
                    "takeOffDistance": -1,
                    "groundRoll": -1
                },

                "highAltitude" :{
                    "altitude": -1,
                    "temperature": -1,
                    "takeOffDistance": -1,
                    "groundRoll": -1
                }
            },

            "highWind": {
                "speed": -1,
                "lowAltitude" :{
                    "altitude": -1,
                    "temperature": -1,
                    "takeOffDistance": -1,
                    "groundRoll": -1
                },

                "highAltitude" :{
                    "altitude": -1,
                    "temperature": -1,
                    "takeOffDistance": -1,
                    "groundRoll": -1
                }
            }
        },

        "highWeight": {
            "weight" : -1,

            "lowWind": {
                "speed": -1,
                "lowAltitude" :{
                    "altitude": -1,
                    "temperature": -1,
                    "takeOffDistance": -1,
                    "groundRoll": -1
                },

                "highAltitude" :{
                    "altitude": -1,
                    "temperature": -1,
                    "takeOffDistance": -1,
                    "groundRoll": -1
                }

            },

            "highWind": {
                "speed": -1,
                "lowAltitude" :{
                    "altitude": -1,
                    "temperature": -1,
                    "takeOffDistance": -1,
                    "groundRoll": -1
                },

                "highAltitude" :{
                    "altitude": -1,
                    "temperature": -1,
                    "takeOffDistance": -1,
                    "groundRoll": -1
                }

            }
        }

    };

    var tempWeight ={};
    var temporaryAltitudes = [];
    var temporaryTermperature = [];
    var temporaryTakeOffDistance = [];
    var temporaryGroundRoll = [];

    var weightPath = "";
    var windPath = "";
    var altitudePath = "";
    var temperaturePath = "";


    console.dir( takeOffData );

    /* TAKE OFF DATA LOOP */
    for( var grossWeightLb in takeOffData ){

        var weight = "";

        if( takeOffData.hasOwnProperty( grossWeightLb ) ) {

            weight =  takeOffData[ grossWeightLb ];

            var headwinds = "";

            /*
             * START init loop of WEIGHTS
             *
             */
            var nextWeight = 0;
            for( var key in weight ) {
                if (weight.hasOwnProperty(key)) {
                    nextWeight = parseInt( key ) + 100 ;

                    // fill in missing weight in 100 LB increments
                    while( typeof weight[ nextWeight ] === "undefined" && key < interpol.MAX_WEIGHT ){
                        if( nextWeight === interpol.MAX_WEIGHT ){
                            break
                        } else {
                            weight[ nextWeight ] = Object();
                            nextWeight = nextWeight + 100;
                        }
                    }// END weight filler

                    if( parseInt( key ) == parseInt( interpol.givenWeight) ){
                        tempWeight = {};
                        tempWeight[ key ] = {};
                        break;
                    } else {
                        var xx =  key;

                        tempWeight[ xx ] = {};
                    }
                }
            }/* end init loop of WEIGHTS */
            /* go over the list and use get LOW and HIGH values */


            /* ADD WEIGHT(S) TO TREE */
            var nearestWeights = interpol.getLowAndHigh( tempWeight, interpol.givenWeight );

            if( nearestWeights.low == nearestWeights.high ){
                nearest.lowAndHighWeightsMatch = true;
            } else {
                nearest.lowAndHighWeightsMatch = false;
            }

            if(nearestWeights.low == interpol.givenWeight /* nearestWeights.high */ ){
                tree[ nearestWeights.low ] = {};// nearestWeights.low;
                nearest.weightMatch = true;
                nearest.lowWeight.weight = nearestWeights.low;
                nearest.highWeight.weight = nearestWeights.low;
                nearest.nearestLowWeight = nearestWeights.low;
                nearest.nearestHighWeight = nearestWeights.low;
                weightPath = "lowWeight";

            } else {
                nearest.weightMatch = false;
                tree[nearestWeights.low ] = {};//nearestWeights.low;
                tree[ nearestWeights.high ] = {};//nearestWeights.high;

                if( nearest.nearestLowWeight == -1 ){
                    nearest.nearestLowWeight = nearestWeights.low;
                }
                nearest.lowWeight.weight = nearestWeights.low;

                if( nearest.nearestHighWeight  == -1 ){
                    nearest.nearestHighWeight = nearestWeights.high;
                }
                nearest.highWeight.weight = nearestWeights.high;
            }


            /* check headwinds */
            var lowAndHighHeadwinds;

            for( key in tree ){
                if( takeOffData["grossWeightLb"].hasOwnProperty( key )){
                    //console.dir( takeOffData["grossWeightLb"][ key ] )
                    lowAndHighHeadwinds = interpol.getLowAndHigh( takeOffData["grossWeightLb"][ key ], interpol.givenHeadWind );

                    if( interpol.givenHeadWind == "headwindLookUpValueNotAvailable"){
                        lowAndHighHeadwinds.low = "headwindLookUpValueNotAvailable";
                        lowAndHighHeadwinds.high = "headwindLookUpValueNotAvailable";
                    }
                    if( lowAndHighHeadwinds.low == lowAndHighHeadwinds.high ){
                        nearest.lowAndHighHeadwindsMatch = true;
                    } else {
                        nearest.lowAndHighHeadwindsMatch = false;
                    }

                    if( lowAndHighHeadwinds.low == interpol.givenHeadWind /* lowAndHighHeadwinds.high */ ){
                        nearest.headWindMatch = true;
                        tree[ key ] [ lowAndHighHeadwinds.low ] = {};
                        nearest.lowWeight.lowWind.speed = lowAndHighHeadwinds.low;

                        nearest.nearestLowHeadwind = lowAndHighHeadwinds.low;
                        nearest.nearestHighHeadwind = lowAndHighHeadwinds.low;
                    }   else {
                        tree[ key ] [ lowAndHighHeadwinds.low ] = {};
                        tree[ key ] [ lowAndHighHeadwinds.high ] = {};

                        if( nearest.nearestLowHeadwind == -1 ){
                            nearest.nearestLowHeadwind = lowAndHighHeadwinds.low;
                        }
                        if( nearest.nearestHighHeadwind  == -1 ){
                            nearest.nearestHighHeadwind = lowAndHighHeadwinds.high;
                        }
                    }
                }

                var weight = key;

                /* check altitude and temperature */
                var lowAndHighAltitudes;
                for( key in tree[weight] ){
                    if( takeOffData["grossWeightLb"][ weight ].hasOwnProperty( key ) ){
                        lowAndHighAltitudes = interpol.getLowAndHigh( takeOffData["grossWeightLb"][ weight ][ key ], interpol.givenPressuerAltitude );

                        if( lowAndHighAltitudes.low == lowAndHighAltitudes.high){
                            nearest.lowAndHighAltitudesMatch = true;
                        } else {
                            nearest.lowAndHighAltitudesMatch = false;
                        }
                        if( lowAndHighAltitudes.low == interpol.givenPressuerAltitude /* lowAndHighAltitudes.high */){
                            nearest.altitudeMatch = true;
                            tree[ weight ][ key ][ lowAndHighAltitudes.low ] = {};
                        } else {
                            nearest.altitudeMatch = false;
                            tree[ weight ][ key ][ lowAndHighAltitudes.low ] = {};
                            tree[ weight ][ key ][ lowAndHighAltitudes.high ] = {};
                        }



                        if( nearest.nearestLowAltitude == -1 ){
                            nearest.nearestLowAltitude = lowAndHighAltitudes.low ;
                        }
                        if(  nearest.nearestHighAltitude == -1 ){
                            nearest.nearestHighAltitude  = lowAndHighAltitudes.high;
                        }
                    }

                    var headwinds = key;
                    var lowAndHighTemperatures;
                    for( key in tree[ weight ][ headwinds ]){
                        if( takeOffData["grossWeightLb"][ weight ][ headwinds ].hasOwnProperty( key )  ){
                            lowAndHighTemperatures = interpol.getLowAndHigh( takeOffData["grossWeightLb"][ weight ][ headwinds ][key ], interpol.givenTemperature );

                            if(( lowAndHighTemperatures.low == interpol.givenTemperature ) ||
                                ( lowAndHighTemperatures.high == interpol.givenTemperature )){
                                nearest.temperatureMatch = true;
                            }

                            if( lowAndHighTemperatures.low == lowAndHighTemperatures.high ){
                                nearest.lowAndHighTemperatureMatch = true;
                                tree[ weight ][ headwinds ][key][ lowAndHighTemperatures.low ] = {};
                            } else {
                                tree[ weight ][ headwinds ][key][ lowAndHighTemperatures.low ] = {};
                                tree[ weight ][ headwinds ][key][ lowAndHighTemperatures.high ] = {};

                                nearest.lowAndHighTemperatureMatch = false;
                            }

                            if( nearest.nearestLowTemperature == -1 ){
                                nearest.nearestLowTemperature = lowAndHighTemperatures.low ;
                            }
                            if( nearest.nearestHighTemperature == -1 ){
                                nearest.nearestHighTemperature = lowAndHighTemperatures.high;
                            }
                        }
                        var altitude = key;
                        var calculateAble;
                        for( key in tree[ weight ][ headwinds ][ altitude ]){
                            if( takeOffData["grossWeightLb"][ weight ][ headwinds ][altitude ].hasOwnProperty( key )){
                                tree[ weight ][ headwinds ][ altitude ][ key ]["groundRoll"] = takeOffData["grossWeightLb"][ weight ][ headwinds ][altitude][key ][ "groundRoll"];
                                tree[ weight ][ headwinds ][ altitude ][ key ]["takeOffDistance"] = takeOffData["grossWeightLb"][ weight ][ headwinds ][altitude][key ][ "takeOffDistance"];

                                temporaryGroundRoll.push( takeOffData["grossWeightLb"][ weight ][ headwinds ][altitude][key ][ "groundRoll"] );

                                temporaryTakeOffDistance.push( takeOffData["grossWeightLb"][ weight ][ headwinds ][altitude][key ][ "takeOffDistance"] );

                                if( temporaryGroundRoll.length == 2 ){
                                    nearest.nearestLowGroundRoll = temporaryGroundRoll[0];
                                    nearest.nearestHighGroundRoll = temporaryGroundRoll[1];
                                }
                                if( temporaryGroundRoll.length == 4 ){
                                    nearest.nearestLowGroundRoll2 = temporaryGroundRoll[2];
                                    nearest.nearestHighGroundRoll2 = temporaryGroundRoll[3];
                                }

                                if( temporaryGroundRoll.length == 6 ){
                                    nearest.nearestLowGroundRoll3 = temporaryGroundRoll[4];
                                    nearest.nearestHighGroundRoll3 = temporaryGroundRoll[5];
                                }

                                if( temporaryGroundRoll.length == 8 ){
                                    nearest.nearestLowGroundRoll4 = temporaryGroundRoll[6];
                                    nearest.nearestHighGroundRoll4 = temporaryGroundRoll[7];
                                }



                                if( temporaryTakeOffDistance.length == 2 ){
                                    nearest.nearestLowTakeOffDistance = temporaryTakeOffDistance[0];
                                    nearest.nearestHighTakeOffDistance = temporaryTakeOffDistance[1];
                                }
                                if( temporaryTakeOffDistance.length == 4 ){
                                    nearest.nearestLowTakeOffDistance2 = temporaryTakeOffDistance[2];
                                    nearest.nearestHighTakeOffDistance2 = temporaryTakeOffDistance[3];
                                }

                                if( temporaryTakeOffDistance.length == 6 ){
                                    nearest.nearestLowTakeOffDistance3 = temporaryTakeOffDistance[4];
                                    nearest.nearestHighTakeOffDistance3 = temporaryTakeOffDistance[5];
                                }

                                if( temporaryTakeOffDistance.length == 8 ){
                                    nearest.nearestLowTakeOffDistance4 = temporaryTakeOffDistance[6];
                                    nearest.nearestHighTakeOffDistance4 = temporaryTakeOffDistance[7];
                                }






                            }

                        }/* altitudes - temperatures loop */
                    }/* headwinds loop */
                }/* weights loop */
            }/* outter tree loop */
        }/* if takeoff data has gross weight */
    } /* end takeOffData LOOP */

    /* assign takeOffs and groundRolls to NEAREST tree */
    function getNearestGroundRoll( weight, headwind, altitude, groundRollOrTakeoff ){
        var s = takeOffData.grossWeightLb [ weight ] [ headwind ] [ altitude ]
        var t1 = 0;
        for( temp in s ){
            if( groundRollOrTakeoff == "groundRoll") {
                t1 = s[temp][ 'groundRoll' ];
            } else {
                t1 = s[temp][ 'takeOffDistance' ];
            }
        }
        return t1
    }
    function getNearestAltitude(){

    }

}
console.dir( takeOffData )
test();