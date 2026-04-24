// Configurando o server!
const Express = require("express");
const axios = require("axios")
const API_KEY = '101f4a830be695cb0146630eff0489a3';
const app = Express();
app.use(Express.json())
app.listen(5000, ()=>console.log("server running"));


//Rota que buscar as informações sobre o clima de uma cidade especifica!

app.get("/getWeather/:city", async (req, res)=>{
    const cityParam = req.params.city;
    try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityParam}&appid=${API_KEY}&units=metric`);
        const dados = response.data;
        const result = {
            "cidade": dados.name,
            "temperatura": dados.main.temp,
            "descrição": data.weather[0].description
        }
        res.json(result);
    } catch(error){
        res.status(500).json({ERR: "erro ao buscar dado", motivo: error
        });
    }})