# 1. Introduction
This server app allows to test the business network tomsnetwork1 (see git to download the business application : https://github.com/tompoppe/tomsbusinessnetwork1/releases/tag/1.0)
it is designed to be used within a docker container

# 2. Getting the Server from Git :

https://github.com/tompoppe/app2.git

unzip the file to the installdir



# 3. Build instruction after download from git

cd installdir

npm install


# 4. Configuring the server. 
You need to edit the config.json file.
{
    "messageIODir":"./messageIODir",
    "BIC": "SWLBBE22",
    "outSubdir":"outDir"    
}
messageIODir : the root folder where the message files will be located
BIC: The sending BIC
outSubdir: The name of the subfolder (under messageIODir) where the sending files will be located


# 6 start the server server
cd installdir
node TomsMessageAdapter.js 

note: 
    The messageIODir must exist. The outSubdir will be created if it does not exist
    When started, all files from the outSubdir are removed !


# 7 Using the server
Pre requisite : the BNA application Tomsbusinessnetwork1 needs to be deployed on the ledger 
The server will create a mx file in the outSubdir (see config.json) each time a createMessageEvent transaction is executed this can be done using the TomsServer server app using the folowing curl command:
 
curl 'http://localhost:1338/createMessageEvent?card=admin@tomsnetwork1&uuid=1234567890'

## 7.3 executing a CreateMessageEvent using curl
This command creates an event ot type newMessage on the ledger
it takes two parameters :
card : the name of the business card
uuid : a unique reference (can be choosen freely)

curl 'http://localhost:81/createMessageEvent?card=admin@tomsnetwork1&uuid=1234567890'


# 8 Using the server in a docker container
## 8.1 Building the docker image
    cd installdir
    docker build -t imagename .

Pre requisites to use Business cards with Docker.
The business cards may not use localhost to point to the various services in the connection.json file
Exmaple of INCORRECT connection.json :
{"name":"hlfv1","x-type":"hlfv1","x-commitTimeout":300,"version":"1.0.0","client":{"organization":"Org1","connection":{"timeout":{"peer":{"endorser":"300","eventHub":"300","eventReg":"300"},"orderer":"300"}}},"channels":{"composerchannel":{"orderers":["orderer.example.com"],"peers":{"peer0.org1.example.com":{}}}},"organizations":{"Org1":{"mspid":"Org1MSP","peers":["peer0.org1.example.com"],"certificateAuthorities":["ca.org1.example.com"]}},"orderers":{"orderer.example.com":{"url":"grpc://localhost:7050"}},"peers":{"peer0.org1.example.com":{"url":"grpc://localhost:7051","eventUrl":"grpc://localhost:7053"}},"certificateAuthorities":{"ca.org1.example.com":{"url":"http://localhost:7054","caName":"ca.org1.example.com"}}}

Example of a correct connection.json
{"name":"hlfv1","x-type":"hlfv1","x-commitTimeout":300,"version":"1.0.0","client":{"organization":"Org1","connection":{"timeout":{"peer":{"endorser":"300","eventHub":"300","eventReg":"300"},"orderer":"300"}}},"channels":{"composerchannel":{"orderers":["orderer.example.com"],"peers":{"peer0.org1.example.com":{}}}},"organizations":{"Org1":{"mspid":"Org1MSP","peers":["peer0.org1.example.com"],"certificateAuthorities":["ca.org1.example.com"]}},"orderers":{"orderer.example.com":{"url":"grpc://orderer.example.com:7050"}},"peers":{"peer0.org1.example.com":{"url":"grpc://peer0.org1.example.com:7051","eventUrl":"grpc://peer0.org1.example.com"}},"certificateAuthorities":{"ca.org1.example.com":{"url":"http://ca.org1.example.com:7054","caName":"ca.org1.example.com"}}}

## 8.2 Create the docker container
cd installdir
docker run --network composer_default --name app2 --mount type=bind,source=/Users/tom/.composerDocker,target=/Users/tom/.composer --mount type=bind,source=/Users/tom/messageadapterIO,target=/usr/src/app2/messageIODir app2



notes : 
The target mount parameter must be the same as the path in the cardstore.json (note : if you need to update, you need to rebuild the docker image)
The -p maps the listen port to a port of your choice. 

## 8.3 Using the server in docker container :
See above, but change the port number in the url to the mapped port
