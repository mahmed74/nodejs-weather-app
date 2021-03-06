const http = require("http");
const fs = require("fs");
var requests = require("requests");


const homeFile = fs.readFileSync("Home.html", "utf-8" );

const replaceVal = (tempVal , orgVal) =>{
    let temperature = tempVal.replace("{%tempVal%}" , orgVal.main.temp);
     temperature = temperature.replace("{%tempMin%}" , orgVal.main.temp_min);
     temperature = temperature.replace("{%tempMax%}" , orgVal.main.temp_max);
     temperature = temperature.replace("{%location%}" , orgVal.name);
     temperature = temperature.replace("{%country%}" , orgVal.sys.country);
     temperature = temperature.replace("{%tempstatus%}" , orgVal.weather[0].main);
     
    return temperature;
}

const server = http.createServer((req,res)=>{
    if(req.url == "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Karachi&appid=b14425a6554d189a2d7dc18a8e7d7263")
        .on("data", (chunk)=>{

            console.log(chunk);
            const objData = JSON.parse(chunk);
            const arrData = [objData]
            // console.log(arrData[0].main.temp);
            const RealTimeData = arrData.map((val)=>replaceVal(homeFile , val)).join("");

            res.write(RealTimeData);
            // console.log(RealTimeData);
        })
        .on("end",(err)=>{
            if(err) return console.log("Connection closed due to error " , err);

            res.end();
        });
    }

})


server.listen(8000,"127.0.0.1");