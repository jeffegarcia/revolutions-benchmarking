import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as https from 'https';
import minimist from "minimist"

const args = minimist(process.argv.slice(2));
const testDuration = 600; // Duration of test in seconds. Enter 'none' if you wish to run the test indefinitely.
const inputRate = 1000; // Data rate in ms
var tracks = args.tracks; // Feature rate / Number of unique records per request
var locations = 50;
var lon = -117;
var lat = 33;
var alt = 100;
const hostname = args.hostname;
const port = '6143';
const path1 = '/geoevent/rest/receiver/rest-geojson-in-01';
const path2 = '/geoevent/rest/receiver/rest-geojson-in-02';
const path3 = '/geoevent/rest/receiver/rest-geojson-in-03';
const path4 = '/geoevent/rest/receiver/rest-geojson-in-04';
const path5 = '/geoevent/rest/receiver/rest-geojson-in-05';
const path6 = '/geoevent/rest/receiver/rest-geojson-in-06';
const path7 = '/geoevent/rest/receiver/rest-geojson-in-07';
const path8 = '/geoevent/rest/receiver/rest-geojson-in-08';
const path9 = '/geoevent/rest/receiver/rest-geojson-in-09';
const path10 = '/geoevent/rest/receiver/rest-geojson-in-10';
/*
const logFilepath1 = `/home/ec2-user/nodejs/dataGenerator/httpReceiver/multi/logs/pointslog_${tracks}_1.csv`
const logFilepath2 = `/home/ec2-user/nodejs/dataGenerator/httpReceiver/multi/logs/pointslog_${tracks}_2.csv`
const logFilepath3 = `/home/ec2-user/nodejs/dataGenerator/httpReceiver/multi/logs/pointslog_${tracks}_3.csv`
const logFilepath4 = `/home/ec2-user/nodejs/dataGenerator/httpReceiver/multi/logs/pointslog_${tracks}_4.csv`
const logFilepath5 = `/home/ec2-user/nodejs/dataGenerator/httpReceiver/multi/logs/pointslog_${tracks}_5.csv`
const logFilepath6 = `/home/ec2-user/nodejs/dataGenerator/httpReceiver/multi/logs/pointslog_${tracks}_6.csv`
const logFilepath7 = `/home/ec2-user/nodejs/dataGenerator/httpReceiver/multi/logs/pointslog_${tracks}_7.csv`
const logFilepath8 = `/home/ec2-user/nodejs/dataGenerator/httpReceiver/multi/logs/pointslog_${tracks}_8.csv`
const logFilepath9 = `/home/ec2-user/nodejs/dataGenerator/httpReceiver/multi/logs/pointslog_${tracks}_9.csv`
const logFilepath10 = `/home/ec2-user/nodejs/dataGenerator/httpReceiver/multi/logs/pointslog_${tracks}_10.csv`
*/
var currentTimeEpoch = 1704067200000; // Start time: Monday, January 1, 2024 12:00:00 AM UTC
var futureTimeEpoch = 1704067500000; // End time: Monday, January 1, 2024 12:05:00 AM UTC
var addTime = 60000;
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
const dataPoints = [];
const initLats = [];
let categoriesCount = 0;
let tracksCount = 0;
let messageCount = 0;
let locCount = 0;

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

function checkFile() {
  if (fs.existsSync(logFilepath)) {
    fs.unlinkSync(logFilepath);
  }
}

function sendData(path, logFilepath) {
  const startTime = Date.now();
  const options = { hostname, path, port, method: 'POST', headers: { 'Content-Type': 'application/json', }, };
  const req = https.request(options, (res) => {
    var statusCode = String(res.statusCode);
    res.on('data', () => { });
    res.on('end', () => {
      const endTime = new Date();
      const latency = endTime - startTime;
      const timestamp = Math.floor(new Date() / 1000);
      const message = `${messageCount},${timestamp},${statusCode},${latency}` + '\n';
      //fs.appendFileSync(logFilepath, message, (err) => { if (err) { console.error(err); } });
    });
  });
  req.on('error', (e) => { });
  if (locCount < locations) {
    const wrappedData = {
      type: "FeatureCollection",
      features: dataPoints.slice(tracksCount, tracksCount + tracks)
    }
    const postData = JSON.stringify(wrappedData);
    req.write(postData);
    req.end();
  } else {
    locCount = 0;
    tracksCount = 0;
    const wrappedData = {
      type: "FeatureCollection",
      features: dataPoints.slice(tracksCount, tracksCount + tracks)
    }
    const postData = JSON.stringify(wrappedData);
    req.write(postData);
    req.end();
  }
  tracksCount = tracksCount + tracks;
  locCount++;
  messageCount++;
}

let interval;

export function startTest() {
  let count = 1;
  var testStart = Math.floor(Date.now() / 1000);
  console.log("Test start:", new Date(), testStart);
  interval = setInterval(() => {
    sendData(path1, logFilepath1);
    sendData(path2, logFilepath2);
    sendData(path3, logFilepath3);
    sendData(path4, logFilepath4);
    sendData(path5, logFilepath5);
    sendData(path6, logFilepath6);
    sendData(path7, logFilepath7);
    sendData(path8, logFilepath8);
    sendData(path9, logFilepath9);
    sendData(path10, logFilepath10);
    count++;
    if (count > testDuration) {
      clearInterval(interval);
      var testEnd = Math.floor(Date.now() / 1000);
      console.log("Test end:", new Date(), testEnd);
    }
    else if (testDuration == 'none') {
      // do nothing
    }
  }, inputRate);
}

export function stopTest() {
  clearInterval(interval)
  var testEnd = Math.floor(Date.now() / 1000);
  console.log("Test manually stopped at:", new Date(), testEnd);
}

generateData();
//checkFile();
startTest();
