// Configurando o server!
const Express = require("express");
const app = Express();
const {getWeatherInfo, getAllWeatherInfo} = require("./cityDb.js");
app.use(Express.json())
app.listen(5000, ()=>console.log("server running"));


//Rota que buscar as informações sobre o tempo de uma cidade especifica em um banco de dados externo!

app.get("/getWeather/:city", async (req, res)=>{
    try{
    const result = await getWeatherInfo(req.params.city);
    res.json(result);
    } catch(error){
        res.status(500).json({ERR: "erro ao buscar dado", motivo: error
        });
    }
})

app.get("/getAllWeather", async (req, res)=>{
    try{
    const result = await getAllWeatherInfo();
    res.json(result);
    } catch(error){
        res.status(500).json({ERR: "erro ao buscar dado", motivo: error})
    }
})