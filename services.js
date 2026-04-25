const {getVolunteersByParticipacao} = require("./voluntariosDb.js")



function definirExperiencia(exp){
    if(exp === "iniciante") return 1;
    if(exp === "intermediario") return 2;
    if(exp === "avancado") return 3;
    return 0;
}

function calcularScore(v){
    const tempo = Number(v.tempo);
    const desempenho = Number(v.desempenho);
    const presenca = Number(v.presenca);
    const experiencia = v.experiencia;
    const experienciaScore = null;
    try{
    experienciaScore = definirExperiencia(experiencia)
    } catch(err){
        return {error: err}
    }
    
    const score = desempenho * 0.5 + (10 - tempo) * 0.2 + presenca * 0.1 + 0.2 * experienciaScore;
    
    return Number(score.toFixed(2));
}

 function definirGrupos(habilidade = ""){
    if(habilidade.includes("medico")) return "saúde";
    if(habilidade.includes("resgate")) return "emergência";
    if(habilidade.includes("logistica")) return "logistica";
    return "apoio";
}

async function organizarGrupos(){
    //busca os usuarios pela presença
    let voluntarios;
    try{
    voluntarios = await getVolunteersByParticipacao();
    } catch(err){
        return {error: err};
    }
    //define os grupos
    const grupos = {
        emergência: [],
        saúde: [],
        logistica: [],
        apoio: []
    }
    //calcula o score individual de cada voluntario, e depois adiciona no array dentro do objeto que corresponde a cada profissão
    for (const v of voluntarios){
        try{
        const score = calcularScore(v);
        const grupo = definirGrupos(v.habilidades);
        }catch(err){
            throw err;
        }
        grupos[grupo].push({"nome": v.nome, "score" : score});
    }
    for(const g in grupos){
        grupos[g].sort((a,b) => b.score - a.score)
    }
    return grupos
}
