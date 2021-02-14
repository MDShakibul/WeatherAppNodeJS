const http = require("http");
const requests = require("requests");
const fs = require("fs");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgval) => {
    let temperature = tempVal.replace("{%tempval%}", orgval.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
    temperature = temperature.replace("{%location%}", orgval.name);
    temperature = temperature.replace("{%country%}", orgval.sys.country);
    return temperature;

}

const server = http.createServer((req, res) =>{
   if(req.url == "/"){
    requests("http://api.openweathermap.org/data/2.5/weather?q=khulna&appid=0862076eab5c9862b0721525c008a0e5&units=metric")
        .on('data', (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        const realTimeDate = arrData.map(val => replaceVal(homeFile, val))
        .join("");
        res.write(realTimeDate);
    })
        .on('end', (err) => {
    if (err) return console.log('connection closed due to errors', err);
    res.end();
    });
   } 
});

server.listen(8000, "127.0.0.1");