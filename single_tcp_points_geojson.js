import { faker } from "@faker-js/faker";
import * as net from "net";
import * as fs from "fs";
import minimist from "minimist"

const args = minimist(process.argv.slice(2));
const testDuration = 600; // Duration of test in seconds. Enter 'none' if you wish to run the test indefinitely.
const inputRate = 1000; // Data rate in ms
var tracks = args.tracks; // Feature rate / Number of unique records per request
var locations = 50;
var lon = -117;
var lat = 33;
var alt = 100;
var currentTimeEpoch = 1704067200000; // Start time: Monday, January 1, 2024 12:00:00 AM UTC
var futureTimeEpoch = 1704067500000; // End time: Monday, January 1, 2024 12:05:00 AM UTC
var addTime = 60;
const dataPoints = [];
const initLats = [];
const categories = ["Red", "Green", "Blue", "Yellow", "Purple"];
var names = [
  'Alpha',
  'Bravo',
  'Charlie',
  'Delta',
  'Echo',
  'Foxtrot',
  'Golf',
  'Hotel',
  'India',
  'Juliet',
  'Kilo',
  'Lima',
  'Mike',
  'November',
  'Oscar',
  'Papa',
  'Quebec',
  'Romeo',
  'Sierra',
  'Tango',
  'Uniform',
  'Victor',
  'Whiskey',
  'X-ray',
  'Yankee',
  'Zulu',
  'Alpha1',
  'Bravo1',
  'Charlie1',
  'Delta1',
  'Echo1',
  'Foxtrot1',
  'Golf1',
  'Hotel1',
  'India1',
  'Juliet1',
  'Kilo1',
  'Lima1',
  'Mike1',
  'November1',
  'Oscar1',
  'Papa1',
  'Quebec1',
  'Romeo1',
  'Sierra1',
  'Tango1',
  'Uniform1',
  'Victor1',
  'Whiskey1',
  'X-ray1',
  'Yankee1',
  'Zulu1',
  'Alpha2',
  'Bravo2',
  'Charlie2',
  'Delta2',
  'Echo2',
  'Foxtrot2',
  'Golf2',
  'Hotel2',
  'India2',
  'Juliet2',
  'Kilo2',
  'Lima2',
  'Mike2',
  'November2',
  'Oscar2',
  'Papa2',
  'Quebec2',
  'Romeo2',
  'Sierra2',
  'Tango2',
  'Uniform2',
  'Victor2',
  'Whiskey2',
  'X-ray2',
  'Yankee2',
  'Zulu2',
  'Alpha3',
  'Bravo3',
  'Charlie3',
  'Delta3',
  'Echo3',
  'Foxtrot3',
  'Golf3',
  'Hotel3',
  'India3',
  'Juliet3',
  'Kilo3',
  'Lima3',
  'Mike3',
  'November3',
  'Oscar3',
  'Papa3',
  'Quebec3',
  'Romeo3',
  'Sierra3',
  'Tango3',
  'Uniform3',
  'Victor3',
  'Whiskey3',
  'X-ray3',
  'Yankee3',
  'Zulu3',
  'Alpha4',
  'Bravo4',
  'Charlie4',
  'Delta4',
  'Echo4',
  'Foxtrot4',
  'Golf4',
  'Hotel4',
  'India4',
  'Juliet4',
  'Kilo4',
  'Lima4',
  'Mike4',
  'November4',
  'Oscar4',
  'Papa4',
  'Quebec4',
  'Romeo4',
  'Sierra4',
  'Tango4',
  'Uniform4',
  'Victor4',
  'Whiskey4',
  'X-ray4',
  'Yankee4',
  'Zulu4',
  'Alpha5',
  'Bravo5',
  'Charlie5',
  'Delta5',
  'Echo5',
  'Foxtrot5',
  'Golf5',
  'Hotel5',
  'India5',
  'Juliet5',
  'Kilo5',
  'Lima5',
  'Mike5',
  'November5',
  'Oscar5',
  'Papa5',
  'Quebec5',
  'Romeo5',
  'Sierra5',
  'Tango5',
  'Uniform5',
  'Victor5',
  'Whiskey5',
  'X-ray5',
  'Yankee5',
  'Zulu5',
  'Alpha6',
  'Bravo6',
  'Charlie6',
  'Delta6',
  'Echo6',
  'Foxtrot6',
  'Golf6',
  'Hotel6',
  'India6',
  'Juliet6',
  'Kilo6',
  'Lima6',
  'Mike6',
  'November6',
  'Oscar6',
  'Papa6',
  'Quebec6',
  'Romeo6',
  'Sierra6',
  'Tango6',
  'Uniform6',
  'Victor6',
  'Whiskey6',
  'X-ray6',
  'Yankee6',
  'Zulu6',
  'Alpha7',
  'Bravo7',
  'Charlie7',
  'Delta7',
  'Echo7',
  'Foxtrot7',
  'Golf7',
  'Hotel7',
  'India7',
  'Juliet7',
  'Kilo7',
  'Lima7',
  'Mike7',
  'November7',
  'Oscar7',
  'Papa7',
  'Quebec7',
  'Romeo7'
];
var categoriesCount = 0;
let tracksCount = 0;
let messageCount = 0;
let locCount = 0;
let count = 0;
var clients = [];

function initData() {
  var addLat = 16 / tracks;
  var trackNum = 1;
  for (let i = 0; i < tracks; i++) {
    if (categoriesCount > 4) {
      categoriesCount = 0;
    };
    const data = {
      type: "Feature",
      properties: {
        trackID: trackNum,
        keyword: names[i],
        category: categories[categoriesCount],
        bool: faker.datatype.boolean(),
        startTime: currentTimeEpoch,
        endTime: futureTimeEpoch,
      },
      geometry: {
        coordinates: [
          lon, Math.round(lat * 100) / 100, alt
        ],
        type: "Point"
      }
    }
    initLats.push(lat);
    dataPoints.push(data);
    categoriesCount++;
    trackNum++;
    lat = lat + addLat;
  }
  currentTimeEpoch = currentTimeEpoch + addTime;
  futureTimeEpoch = futureTimeEpoch + addTime;
}

function addData() {
  var addLon = 0.75;
  lon = lon + addLon;
  for (let i = 0; i < locations - 1; i++) {
    var trackNum = 1;
    var initLatNum = 0;
    for (let i = 0; i < tracks; i++) {
      if (categoriesCount > 4) {
        categoriesCount = 0;
      };
      const data = {
        type: "Feature",
        properties: {
          trackID: trackNum,
          keyword: names[i],
          category: categories[categoriesCount],
          bool: faker.datatype.boolean(),
          startTime: currentTimeEpoch,
          endTime: futureTimeEpoch,
        },
        geometry: {
          coordinates: [
            lon, Math.round(initLats[initLatNum] * 100) / 100, alt
          ],
          type: "Point"
        }
      };
      dataPoints.push(data);
      trackNum++;
      initLatNum++;
      categoriesCount++;
    }
    currentTimeEpoch = currentTimeEpoch + addTime;
    futureTimeEpoch = futureTimeEpoch + addTime;
    lon = lon + addLon;
  }
}

function generateData() {
  initData();
  addData();
}

function startTcp() {
  const server = net.createServer((socket) => {
    console.log('Client connected');
    clients.push(socket);
    socket.on('data', (data) => {
      console.log('Data received from client:', String(data));
    });
    socket.on('end', () => {
      console.log('Client disconnected');
      clients = clients.filter((client) => client !== socket);
    });
    socket.on('error', (err) => {
      console.error(`Connection error: ${err.message}`);
    });
  });
  server.listen(3004, '0.0.0.0')
};

function sendTcp() {
  clients.forEach((client) => {
    if (locCount < locations) {
      var wrappedData = {
        type: "FeatureCollection",
        features: dataPoints.slice(tracksCount, tracksCount + tracks)
      }
      var valuesToSend = JSON.stringify(wrappedData);
      client.write(valuesToSend); //.replace(/[\[\]']+/g, '') + ','
    } else {
      locCount = 0;
      tracksCount = 0;
      var wrappedData = {
        type: "FeatureCollection",
        features: dataPoints.slice(tracksCount, tracksCount + tracks)
      }
      var valuesToSend = JSON.stringify(wrappedData);
      client.write(valuesToSend);
    };
    tracksCount = tracksCount + tracks;
    locCount++;
    messageCount = messageCount + tracks;
  }, inputRate);
}

function startTest() {
  generateData();
  startTcp()
  var testStart = Math.floor(Date.now() / 1000);
  console.log("Test start:", new Date(), testStart);
  setInterval(() => {
    sendTcp();
    count++
    if (count > testDuration) {
      var testEnd = Math.floor(Date.now() / 1000);
      console.log("Test end:", new Date(), testEnd);
      process.exit(0);
    }
  }, 1000);
}

startTest();
