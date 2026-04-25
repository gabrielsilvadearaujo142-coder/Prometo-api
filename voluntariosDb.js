
const {Pool} = require("pg");
const pool = new Pool({
    host : process.env.HOST,
     user : process.env.USER,
    database : process.env.DATABASE,
    port : process.env.PORT,
    password : process.env.PASSWORD
});


async function getVolunteersByParticipacao(){
    try{
        const result = await pool.query(
        `SELECT v.id ,v.nome,
        v.habilidades, AVG(p.desempenho) as desempenho, 
        AVG(p.tempo_resposta) as tempo,
        SUM(CASE WHEN p.compareceu THEN 1 ELSE 0 END) as presenca FROM voluntarios v JOIN participacoes p ON v.id = p.voluntario_id GROUP BY v.id`
        );
        return result.rows;
    }catch(err){
        return {error: err.name, motivo: err.message};
    }
}
module.exports = {getVolunteersByParticipacao};