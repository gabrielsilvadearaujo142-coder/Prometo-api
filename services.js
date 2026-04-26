import {searchUser} from "./voluntariosDb.js"

async function estrategiafunc(grupos){
    const estrategia = [];
    
    for(const grupo in grupos){
        const equipe = [];
        const membro = grupos[grupo];
        
        if (!membro || membro.length === 0) continue;
        const lider = membro[0];
        const suporte = membro[1] 
        const backup = membro[2] 
        
        for(let i = 3; i < membro.length; i++){
            equipe.push(membro[i]);
        }
        estrategia.push({
            'grupo': grupo,
            'lider': lider.nome,
            "restante da equipe" : equipe.map(p => p.nome),
            "plano" : `lider ${lider?.nome || "sem lider"} do time ${grupo} coorderna com o time. suporte ${suporte?.nome || "sem suporte" } e  backup: ${backup?.nome || "sem backup"}`
        })
    }
    return estrategia;
}
async function volunterOrganização(){
    let grupos = {
    tecnico: [],
    comunicacao: [],
    estrategico: [],
    operacional: []
}
    try{
        let res = await fetch("https://voluntarios-grupos-api-production.up.railway.app/grupos");
        let voluntarios = await res.json();
        for(const v of voluntarios){
            let id = v.voluntario_id;
            let grupo = v.grupo;
            let score = v.score;
            let dados = await searchUser(id);
            let habilidade = dados.habilidades
            grupos[grupo].push({"nome": dados.nome, "score": score, "id": id, "habilidade": habilidade});
        }
    } catch(err){
        return {error: err.name, motivo: err.message};
    }
    for(const grupoN in grupos){
        grupos[grupoN].sort((a,b)=>{return b.score - a.score || a.id - b.id});
        
        grupos[grupoN].forEach((p, i) => {
            p.rank = i + 1;
            p.lider = i === 0;
        }
        )
    }
    return grupos;
}


export {volunterOrganização, estrategiafunc};
