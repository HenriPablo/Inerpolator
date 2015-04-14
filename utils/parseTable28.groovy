def table = new File('rawTableData28.txt');
def dataFile = new File('tableData28Outpu.js')

print table;

def lb5500 = 5500;
def lb5100 = 5100;
def lb4700 = 4700;

def lbs = [5500, 5100, 4700];

def cnt = 0;
def cnt2 = 0;


def pressureAltitude =  "";
def groundRoll20 =      "";
def totalDist20 =       "";
def groundRoll30 =      "";
def totalDist30 =       "";
def groundRoll40 =      "";
def totalDist40 =       "";

println('\r--------------------------\r');

dataFile.withWriter{ out ->
table.splitEachLine('\t'){ items ->

    pressureAltitude = items[0];

    groundRoll20 = items[1];
    totalDist20 = items[2];

    groundRoll30 = items[3];
    totalDist30 = items[4];

    groundRoll40 = items[5];
    totalDist40 = items[6];

//    if( pressureAltitude == "0" ){
//
//        println( lbs[cnt] + " : {\r")
//        /* headwind */
//        println( "\tnull : { \r");
//    }
//
//
//    /* SEA LEVEL pressure altitude */
//    println( "\t\t" + pressureAltitude +  "  : { \r" )
//        /* temperatures */
//        println( "\t\t\t20 : {\r " );
//            println( "\t\t\t\t\"groundRoll\" : " + groundRoll20 + ",\r" );
//            println( "\t\t\t\t\"takeOffDistance\" : " + totalDist20 + "\r" );
//        println("\t\t\t },");
//
//        println( "\t\t\t30 : {\r");
//            println( "\t\t\t\t\"groundRoll\" : "  + groundRoll30 + ",\r" )
//            println( "\t\t\t\t\"takeOffDistance\" : "   + totalDist30  + "\r");
//        println( "\t\t\t},\r" );
//
//        println ( "\t\t\t40 : {\r");
//            println("\t\t\t\t\"groundRoll\" : " + groundRoll40 + ",\r" );
//            println("\t\t\t\t\"takeOffDistance\" :  " + totalDist40 + "\r" );
//
//
//        print( "\t\t } \r"); /* end alt */
//        if( pressureAltitude == "10000" ){
//            println( "\t}, \r")
//            cnt = cnt + 1;
//        }
//    println( "} \r")


    /* WRITE TO FILE */
     //dataFile.withWriter{ out ->


         if( pressureAltitude == "0" ){

             out.writeLine( "\""  + lbs[cnt2] + "\" : {\r")
             /* headwind */
             out.writeLine(  "\tnull : { \r");
         }


         /* SEA LEVEL pressure altitude */
         out.writeLine(  "\t\t" + pressureAltitude +  "  : { \r" )
         /* temperatures */
         out.writeLine(  "\t\t\t20 : {" );
         out.writeLine(  "\t\t\t\t\"groundRoll\" : " + groundRoll20 + ",\r" );
         out.writeLine(  "\t\t\t\t\"takeOffDistance\" : " + totalDist20 + "\r" );
         out.writeLine(  "\t\t\t },");

         out.writeLine(  "\t\t\t30 : {\r");
         out.writeLine(  "\t\t\t\t\"groundRoll\" : "  + groundRoll30 + ",\r" )
         out.writeLine(  "\t\t\t\t\"takeOffDistance\" : "   + totalDist30  + "\r");
         out.writeLine(  "\t\t\t},\r" );

         out.writeLine ( "\t\t\t40 : {\r");
         out.writeLine( "\t\t\t\t\"groundRoll\" : " + groundRoll40 + ",\r" );
         out.writeLine( "\t\t\t\t\"takeOffDistance\" :  " + totalDist40 + "\r" );


         out.writeLine(  "\t\t } \r"); /* end alt */


         if( pressureAltitude == "10000" ){
             out.writeLine(  "\t}, \r");
             out.writeLine(  "\t}, \r");
             cnt2 = cnt2 + 1;
         }

//    if( ( pressureAltitude == "10000" ) && ( cnt2 == 2 ) ){
//        out.writeLine(  "\t}, \r")
//    }
         out.writeLine(  "\t}, \r")



     }

}/* end printout */
