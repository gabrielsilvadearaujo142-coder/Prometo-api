// Configurando o server!
import express from "express"
import axios from "axios"
const API_KEY = process.env.APIKEY;
const app = express();
app.use(express.json())

import {volunterOrganização} from './services.js'
import {estrategiafunc} from './services.js'
const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>console.log("server running"));


//Rota que buscar as informações sobre o clima de uma cidade especifica!

app.get("/getWeather/:city", async (req, res)=>{
    const city = req.params.city;
    try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const dados = response.data;
        const result = {
            "cidade": dados.name,
            "temperatura": dados.main.temp,
            "descrição": dados.weather[0].description
        }
        res.json(result);
    } catch(error){
        res.status(500).json({error: error.name, motivo: error.message
        });
    }})

app.get("/volunteers/grupos", async (req, res)=>{
    try{
       const grupos = await volunterOrganização();
        const res = await estrategiafunc(grupos);
        res.status(200).json(res);
    } catch(err){
        res.status(500).json({error: err.name, motivo: err.message});
    }
})

