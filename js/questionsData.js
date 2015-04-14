questionsData = {
    /* this is the worst case scenario where every value has to be interpolated */
    "6666" : {
        "temperature" : 22,
        "temperatureAdjustment" : "degreesAboveStandard",
        "pressurealtitude" : 3000,
        "weight" : 2500,
        "headwind" : 20,
        "adjustForHeadwindAtTheEnd" : false,
        "surface" : "asphalt",
        "calculate" : "groundRoll",
        "expectedAnswer": 230/* figure this out by hand */
    },
    "6753" : {
        "temperature" : 24,
        "temperatureAdjustment" : "degreesAboveStandard",
        "pressurealtitude" : 2500,
        "weight" : 2400,
        "headwind" : 25,
        "adjustForHeadwindAtTheEnd" : false,
        "surface" : "asphalt",
        "calculate" : "groundRoll",
        "expectedAnswer": 230
    },
    "6754" : {
        "temperature" : 25,
        "temperatureAdjustment" : "degreesAboveStandard",
        "pressurealtitude" : 2000,
        "weight" : 2200,
        "headwind" : 15,
        "adjustForHeadwindAtTheEnd" : false,
        "surface" : "asphalt",
        "calculate" : "groundRoll",
        "expectedAnswer": 261
    },
    "6755" : {
        "temperature" : 23,
        "temperatureAdjustment" : "degreesAboveStandard",
        "pressurealtitude" : 3000,
        "weight" : 2400,
        "headwind" : 15,
        "adjustForHeadwindAtTheEnd" : false,
        "surface" : "asphalt",
        "calculate" : "takeOffDistance",
        "expectedAnswer": 718
    },
    "6756" : {
        "temperature" : 3,
        "temperatureAdjustment" : "degreesAboveStandard",
        "pressurealtitude" : 6000,
        "weight" : 3000,
        "headwind" : 15,
        "adjustForHeadwindAtTheEnd" : false,
        "surface" : "asphalt",
        "calculate" : "takeOffDistance",
        "expectedAnswer": 1331
    },
    "6761" : {
        "temperature" : 20,
        "temperatureAdjustment" : "feetPerDegree",
        "pressurealtitude" : 1000,
        "weight" : 5300,
        "headwind" : "headwindLookUpValueNotAvailable",
        "headwindCorrection" : 15,
        "tailwind" : "tailwindNotProvided",
        "surface" : "sod",
        "adjustForHeadwindAtTheEnd" : true,
        "calculate" : "takeOffDistance",
        "expectedAnswer": 1724
    },
    "6762" : {
        "temperature" : 25,
        "temperatureAdjustment" : "feetPerDegree",
        "pressurealtitude" : 2500,
        "weight" : 5500,
        "headwind" : "headwindLookUpValueNotAvailable",
        "headwindCorrection" : -2,
        "tailwind" : 2,
        "surface": "asphalt",
        "adjustForHeadwindAtTheEnd" : true,
        "calculate" : "takeOffDistance",
        "expectedAnswer": 2462
    },
    "6763" : {
        "temperature" : 35,
        "temperatureAdjustment" : "feetPerDegree",
        "pressurealtitude" : 3000,
        "weight" : 5100,
        "headwind" : "headwindLookUpValueNotAvailable",
        "headwindCorrection" : 20,
        "tailwind" : "tailwindNotProvided",
        "surface" : "sod",
        "adjustForHeadwindAtTheEnd" : true,
        "calculate" :"takeOffDistance",
        "expectedAnswer": 2023
    }
};