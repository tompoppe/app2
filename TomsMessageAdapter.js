"use strict";
var https = require('https');
var url = require ('url');
var fs = require ('fs');
var path = require('path');
var compHelp = require ("./ComposerHelp.js");
var compHelper = new compHelp();


var config = readConfigFile();
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
this.bizNetworkConnection = new createBusinessNetworkConnection();
this.cardName = compHelper.createCardName(config.cardName);
var config = readConfigFile();
prepareIODir(config);
console.log (this.cardName);
this.bizNetworkConnection.connect(this.cardName)
.then((result) => {
  this.businessNetworkDefinition = result;
  console.log(this.businessNetworkDefinition);
  this.bizNetworkConnection.on('event',(event)=>{
      //event: { "$class": "org.namespace.BasicEvent", "eventId": "0000-0000-0000-000000#0" }
      console.log("Event "  + event.$type );
      console.log("Event " + event.eventId);
      console.log("json" +JSON.stringify (event));
      this.bizNetworkConnection.getTransactionRegistry('org.tompoppe.hyperledger.CreateMessageEvent')
      //this.bizNetworkConnection.getTransactionRegistry('org.tompoppe.hyperledger.DebitAccount')
      .then ((result) =>{
        const transactionId = getTransactionId(event.eventId);
        result.get(transactionId)
        .then((result) =>{
            console.log ("Transaction Found " + result.uuid);
            createMessageFile(result, config);

        })
        .catch((exception) =>{
          console.log("Transaction Not a createMessageEvent");
          return;
        });
      })      
      .catch ((exception) =>{
        console.log("exception" + exception);
      });
  })  
});
function createBusinessNetworkConnection(){
	const connectionOptions = readcardstoreFile ("cardstore.json")
	console.log("found cardstore file " + JSON.stringify(connectionOptions) )
	var clientConnection = new BusinessNetworkConnection(connectionOptions);
	return clientConnection;
}
function readcardstoreFile(cardstorFile){
	console.log("reading file " + cardstorFile);
	var data = fs.readFileSync (cardstorFile, );
	return JSON.parse(data);	
}

function getTransactionId(pEventid){
  var  rval = pEventid;
  rval = rval.split("#")[0];
  return rval;

}
function readConfigFile(){
	console.log("reading file config.json" );
	var data = fs.readFileSync ("config.json" );
	return JSON.parse(data);	
}
function createMessageFile( pTransaction, pConfig){
  var x = Math.floor((Math.random() * 100000000) + 1);
  var fileName = path.join(pConfig.messageIODir, pConfig.outSubdir, pConfig.BIC)  + "_" + String (x) +".mx";
  var template = readTemplateFile();
  //console.log("template = " + template);
  try{
    var res = (""+template).replace("##MSGID##", pTransaction.uuid);
    console.log ("writing " + fileName);
    fs.writeFileSync(fileName, res);
  }catch(e){
    console.log ("exception " + e);
  }
}

function readTemplateFile(){
    console.log("reading file template.xml" );
    var data = fs.readFileSync ("template.xml" );
    return data;	  
}

function prepareIODir(pConfig){
  var outDir = path.join(pConfig.messageIODir , pConfig.outSubdir);
  if (!fs.existsSync(outDir)) {
    console.log ("create dir " + outDir);
    fs.mkdirSync(outDir, 0o777);
  }else{
    fs.readdir(outDir, (err, files) => {
      if (err) throw err;
    
      for (const file of files) {
        console.log( "deleting " + file);
        fs.unlink(path.join(outDir, file), err => {
          if (err) throw err;
        });
      }
    });
    
  }

}

