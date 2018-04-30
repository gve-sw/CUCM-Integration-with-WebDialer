//User Name and Password for authentication
var UserID = 'UserID';
var Password = 'CUCM password!';

//Device name and Line number of the source
var DeviceName = 'Device Name';
var LineNumber = 'Primary Line number';

//Counter value initialised to zero
var countFire = 0;
var countWater = 0;
var countStorm = 0;
document.getElementById("countfire").innerHTML = 0;
document.getElementById("countwater").innerHTML = 0;
document.getElementById("countstorm").innerHTML = 0;

//Sleep function to pause execution before ending the call
function sleep (time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }

//End Call feature
function endCall(){

            //Creating xmlHttp object
            var xmlhttp = new XMLHttpRequest();

            //Open request with SOAP URL
            xmlhttp.open('POST', 'https://Your-CUCM-address/webdialer/services/WebdialerSoapService70?wsdl', true);
            
            //SOAP request
            var strRequest =
                '<?xml version="1.0" encoding="utf-8"?>' +
                '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:WD70" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
                    '<soapenv:Header />' +
                        '<soapenv:Body>' +
                            '<urn:endCallSoap soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
                                '<in0 xsi:type="urn:Credential">' +
                                  '<userID xsi:type="xsd:string">'+UserID+'</userID>' +
                                  '<password xsi:type="xsd:string">'+Password+'</password>' +
                                '</in0>' +
                                '<in1 xsi:type="urn:UserProfile">' +
                                  '<user xsi:type="xsd:string">'+UserID+'</user>' +
                                  '<deviceName xsi:type="xsd:string">'+DeviceName+'</deviceName>' +
                                  '<lineNumber xsi:type="xsd:string">'+LineNumber+'</lineNumber>' +
                                '</in1>' +
                            '</urn:endCallSoap>' +
                        '</soapenv:Body>' +
                '</soapenv:Envelope>';

            //Request headers
            xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
            xmlhttp.setRequestHeader('SOAPAction', '"https://Your-CUCM-address/webdialer/services/WebdialerSoapService70"');

            //send the SOAP request
            xmlhttp.send(strRequest);

}

//Make Call feature
function makeCall(e) {

            //Fetching Button Id
            var buttonId = e.id;

            //Fetching the Destination number to make a Call
            var Destination = document.getElementById(buttonId).value;
            
            //Creating xmlHttp object
            var xmlhttp = new XMLHttpRequest();

            //Open request with SOAP URL
            xmlhttp.open('POST', 'https://Your-CUCM-address/webdialer/services/WebdialerSoapService70?wsdl', true);
            
            //SOAP request
            var strRequest =
                '<?xml version="1.0" encoding="utf-8"?>' +
                '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:WD70" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
                '<soapenv:Header />'+
                '<soapenv:Body>'+
                   '<urn:makeCallSoap soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">'+
                      '<in0 xsi:type="urn:Credential">'+
                         '<userID xsi:type="xsd:string">'+UserID+'</userID>'+
                         '<password xsi:type="xsd:string">'+Password+'</password>'+
                      '</in0>'+
                      '<in1 xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xsi:type="soapenc:string">'+Destination+'</in1>'+
                      '<in2 xsi:type="urn:UserProfile">'+
                         '<user xsi:type="xsd:string">UserID</user>'+
                         '<deviceName xsi:type="xsd:string">'+DeviceName+'</deviceName>'+
                         '<lineNumber xsi:type="xsd:string">'+LineNumber+'</lineNumber>'+
                      '</in2>'+
                   '</urn:makeCallSoap>'+
                '</soapenv:Body>'+
             '</soapenv:Envelope>';

            //Request headers
            xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
            xmlhttp.setRequestHeader('SOAPAction', '"https://Your-CUCM-address/webdialer/services/WebdialerSoapService70"');

            //display results in console once the response is received
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4) {
                     if (xmlhttp.status === 200) {
                          //Counter for button clicks
                          if (Destination == "6017"){
                            countFire++;
                          }
                          else if (Destination == "6022"){
                            countWater++;
                          }else if (Destination == "6023"){
                            countStorm++;
                          }else{
                            console.log("No input")
                          }
                          //Populating counter values in index.html
                          document.getElementById("countfire").innerHTML = countFire;
                          document.getElementById("countwater").innerHTML = countWater;
                          document.getElementById("countstorm").innerHTML = countStorm;

                          $(document.getElementById("success-alert")).fadeTo(2000, 1500).slideUp(1000, function(){
                          $(document.getElementById("success-alert")).slideUp(1000);
                          });   

                          //Pause execution for 10 seconds before ending the call
                          sleep(10000).then(() => {
                                   endCall();
                          });

                      } else { 
                              //Error handling 
                              $(document.getElementById("danger-alert")).fadeTo(2000, 1500).slideUp(1000, function(){
                              $(document.getElementById("danger-alert")).slideUp(1000);
                          }); 
                      }
                }
             };

            //send the SOAP request
            xmlhttp.send(strRequest);
        }