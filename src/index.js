var Alexa = require('alexa-sdk');
var convert = require('convert-units');
var secrets = require('./secrets.json');

var APP_ID = secrets.APP_ID;

var SKILL_NAME = "Smart Converter";

var SHORT_HELP_MESSAGE = "Um eine Liste der Möglichkeiten zu bekommen, frage: Welche Einheiten kannst du konvertieren?";
var HELP_MESSAGE = "Ich helfe dir gerne dabei, verschiedene Einheiten zu konvertieren." + " " + SHORT_HELP_MESSAGE;

/*
 * Currently supported conversions:
 * Length:
 * - mm (millimeter)
 * - cm (centimeter)
 * - m (meter)
 * - in (inch, zoll)
 * - ft-us (amerikanische fuß)
 * - ft (fuß)
 * - mi (meilen)
 * 
 * Mass:
 * - mcg (mikrogramm, microgramm)
 * - mg (milligramm)
 * - g (gramm)
 * - kg (kilogramm)
 * - oz (unze)
 * - lb (pfund)
 * 
 * Temperature:
 * - C (celsius)
 * - F (fahrenheit)
 * - K (kelvin)
 * 
 * Speed:
 * - m/s (meter pro sekunde)
 * - km/h (k. m. h., kilometer pro stunde)
 * - m/h (meter pro stunde)
 * - knot (knoten)
 * - ft/s (fuß pro sekunde)
 */

var handlers = {
    'LaunchRequest': function() {
        console.log("Calling 'LaunchRequest'");
        if(this.event.request.type == "LaunchRequest") {
            this.emit(':ask', "Was darf ich für dich konvertieren?", "Ich habe dich nicht verstanden, was kann ich für dich umwandeln?");
        }
        else {
            this.emit('ConvertUnitIntent');
        }
    },
    'MeasuresIntent': function() {
        console.log("Supported measures: " + convert().measures());
        this.emit(":ask", "Die folgenden Einheiten werden unterstützt: Länge, Masse, Temperaturen, Geschwindigkeit. Was möchtest du konvertieren?", "Was möchtest du konvertieren?");
    },
    'ConvertUnitIntent': function() {
        console.log("Calling 'ConvertUnitIntent'");
        var fromunit = isSlotValid(this.event.request, "fromunit");
        var tounit = isSlotValid(this.event.request, "tounit");
        var value = isSlotValid(this.event.request, "value");
        var speechOutput;

        if(value != false) {
            if(fromunit != false) {
                if(tounit != false) {
                    try {
                        var response = convert(value).from(fromunit).to(tounit);
                        console.log("Response is: " + response);
                        if(fromunit == "C") {
                            fromunit = "Grad Celsius"
                        }
                        else if(fromunit == "F") {
                            fromunit = "Grad Fahrenheit"
                        }
                        else if(fromunit == "K") {
                            fromunit = "Kelvin"
                        }

                        if(tounit == "C") {
                            tounit = "Grad Celsius"
                        }
                        else if(tounit == "F") {
                            tounit = "Grad Fahrenheit"
                        }
                        else if(tounit == "K") {
                            tounit = "Kelvin"
                        }

                        if(tounit == "mcg") {
                            tounit = "Mikrogramm"
                        }
                        if(fromunit == "mcg") {
                            fromunit = "Mikrogramm"
                        }

                        if(tounit == "knot") {
                            tounit = "Knoten"
                        }
                        if(fromunit == "knot") {
                            fromunit = "Knoten"
                        }

                        speechOutput = "<say-as interpret-as='unit'>" + value + fromunit + "</say-as> entsprechen <say-as interpret-as='unit'>" + response + tounit + "</say-as>";
                    } catch (error) {
                        if(error.message.includes("Unsupported unit")) {
                            console.log(error.message);
                            speechOutput = "Eine der Einheiten wird leider nicht unterstützt." + " " + SHORT_HELP_MESSAGE;
                            this.emit(":ask", speechOutput, speechOutput);
                        }
                        if(error.message.includes("Cannot convert incompatible measures")) {
                            console.log(error.message);
                            speechOutput = "Es tut mir leid, aber es ist nicht möglich " + this.event.request.intent.slots["fromunit"].value + " in " + this.event.request.intent.slots["tounit"].value + " zu konvertieren." + " " + SHORT_HELP_MESSAGE;
                            this.emit(":ask", speechOutput, speechOutput);
                        }
                    }
                }
                else {
                    console.log("Asking again for tounit");
                    this.emit(":ask", "tounit", "Ich konnte die Zieleinheit nicht verstehen. Kannst du bitte die gesamte Anfrage wiederholen?", "Wiederholst du bitte die gesamte Anfrage?");
                }
            }
            else {
                console.log("Asking again for fromunit");
                this.emit(":ask", "Ich habe leider die ursprüngliche Einheit nicht verstanden. Bist du so nett und wiederholst die gesamte Anfrage?", "Wiederholst du bitte die die gesamte Anfrage?");
            }
        }
        else {
            console.log("Asking again for value");
            this.emit(":ask", "Leider habe ich den zu konvertierenden Wert nicht verstanden. Kannst du deine gesamte Anfrage bitte wiederholen?", "Kannst du die gesamte Anfrage bitte wiederholen?");
        }
    
        this.emit(':tell', speechOutput);
    },
    'AMAZON.HelpIntent': function() {
        console.log("Calling 'AMAZON.HelpIntent'");
        this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
    },
    'AMAZON.CancelIntent': function() {
        this.emit(":tell", "Auf Wiedersehen!");
    },
    'AMAZON.StopIntent': function() {
        this.emit(":tell", "Auf Wiedersehen!");
    },
    'Unhandled': function() {
        console.log("Unhandled intent...");
        this.emit('AMAZON.HelpIntent');
    }
};

exports.handler = function(event, context, callback) {
    console.log("Starting lambda function for " + SKILL_NAME);
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function isSlotValid(request, slotName){
    var slot = request.intent.slots[slotName];
    // console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
    var slotValue;

    console.log("Checking slot value: " + slot.value);
    //if we have a slot, get the text and store it into speechOutput
    if (slot && slot.value && slot.value != '?') {
        //we have a value in the slot
        if(slot.hasOwnProperty("resolutions") && slot.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
            // successfully matched the slot by resolution
            slotValue = slot.resolutions.resolutionsPerAuthority[0].values[0].value.id;
            console.log("slotValue after resolution = " + slotValue);
        }
        else {
            slotValue = slot.value.toLowerCase();
        }
        
        return slotValue;
    } else {
        //we didn't get a value in the slot.
        return false;
    }
}