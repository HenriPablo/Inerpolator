/** LOOP OVER TAKE OFF DATA */
for( var grossWeightLb in takeOffData ){

    var weight = "";

    if( takeOffData.hasOwnProperty( grossWeightLb ) ){

        weight = takeOffData[ grossWeightLb ];

        var headwinds = "";

        /*
         * KEY is 2200 under grossWeightLb
         * looping through WEIGHTS
         */
        for( var key in weight ){
            if( weight.hasOwnProperty( key ) ) {

                //console.log( 'Gross Weight LB: ' + key );
                headwinds = weight[ key ];

                var headwindSpeed = "";

                /* looping over HEADWINDS */
                //console.log( 'headwinds: ');
                for( var key in headwinds ){
                    //console.log( '\t' + key );
                    headwindSpeed = headwinds[ key ];

                    var altitudeAndTemperature = "";
                    /**
                     * looping over Above Sea Level Altitudes and Temperatures
                     *
                     * each Headwind contains sets of Ground Roll and Total Distance to Clear obstacle
                     * for given Altitude above sea level and Temperatures
                     */
                    for( var key in headwindSpeed ){
                        //console.log( '\t\t' + key );
                        altitudeAndTemperature = headwindSpeed[ key ] ;

                        /**
                         * loop over GROUND ROLL and TOTAL DISTANCE TO CLEAR OBSTACLE values
                         * keys are:
                         *      'groundRoll'
                         *      'takeOffDistance'
                         */
                        for( var key in altitudeAndTemperature){
                            //console.log( '\n\t\t\t--- Ground Roll and Total to Clear ---');
                            //console.log('\t\t\t' + key );

                            //console.log('\t\t\tGround Roll: ' + altitudeAndTemperature[key] );

                            if( altitudeAndTemperature.hasOwnProperty( 'groundRoll' ) ){
                                //console.log('\t\t\t\t\tGround Roll: ' + altitudeAndTemperature[ 'groundRoll' ] );
                            }
                            if( altitudeAndTemperature.hasOwnProperty( 'takeOffDistance' ) ){
                                //console.log('\t\t\t\t\tTotal To Clear: ' + altitudeAndTemperature[ 'takeOffDistance' ] );
                            }
                        }

                    }

                }

            }
            //console.log('------------------------------------');
        }
    }

}/* end loop over grossWeight */