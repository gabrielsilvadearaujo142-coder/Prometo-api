// Configurando o server!
import express from "express"
import axios from "axios"
const API_KEY = process.env.APIKEY;
const app = express();
app.use(express.json())

import {volunterOrganização, estrategiafunc} from './services.js';
import {searchUserById, createUser, deleteUserFromEverything} from './voluntariosDb.js'
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
        const result = await estrategiafunc(grupos);
        res.status(200).json(result);
    } catch(err){
        res.status(500).json({error: err.name, motivo: err.message});
    }
})

app.post("/createUser", async (req, res) => {
    try{
        const nome = req.body.nome;
        const idade = req.body.idade;
        const profissao = req.body.profissao;
        const experiencia = req.body.experiencia;
        const habilidades = req.body.habilidades;
        if(!nome || !idade || !profissao || !experiencia){
           return res.status(400).json({message: 'dados invalidos' })
        }
        const result = await createUser(nome, idade, profissao, experiencia, habilidades);
        if(result.error){
            return res.status(400).json(result);
        }
        res.status(201).json(result);
    }catch(err){
        res.status(500).json({error: err.name , motivo: err.message});
    }
})

app.delete("/deleteUser/:id", async (req, res) => {
    try{
    const nome = req.body.nome;
    const id = req.params.id;
    const result = await deleteUserFromEverything(id, nome);
        if(result.error){
            return res.status(400).json(result)
        }
        res.status(200).json({result});
    } catch(err){
        res.json({error: err.name, message: err.message});
    }
    
})