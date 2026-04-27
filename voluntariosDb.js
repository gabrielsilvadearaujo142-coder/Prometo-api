
import  {Pool} from "pg";
const pool = new Pool({
    host : process.env.HOST_db,
     user : process.env.USER_db,
    database : process.env.DATABASE_db,
    port : Number(process.env.PORT_db),
    password : process.env.PASSWORD_db
});


async function searchUserById(id){
    try{
        const result = await pool.query("SELECT nome, habilidades FROM voluntarios WHERE id = $1", [id])
        return result.rows[0] || null;
    }
    catch(err){
        return {error: err.name, motivo: err.message};
    }
}

async function createUser(nome, idade, profissao, experiencia, habilidades){
    if(!Array.isArray(habilidades) || habilidades.length === 0){
    return {error: "habilidades inválidas"};}
    const client = await pool.connect();
    try{
        await client.query("BEGIN");
        
        const result = await client.query("INSERT INTO voluntarios (nome, idade, habilidades, experiencia) VALUES($1, $2, $3, $4) RETURNING id;", [nome, idade, profissao, experiencia]);
        
        const id = result.rows[0].id;
        
          for(let i = 0; i < habilidades.length; i++){
              
             await client.query("INSERT INTO voluntarios_habilidades (voluntario_id, habilidade_id, nivel) VALUES ($1,$2,$3)", [id, (i + 1), habilidades[i]]);
          }
          await client.query("COMMIT");
          return {"new user": nome, "id": id,  message: "habilidades criadas"};
      }
    
      catch(err){
          await client.query("ROLLBACK");
        return {error: err.name, motivo: err.message};
    }finally{
        client.release();
    }
}

async function deleteUserFromEverything(id, nome){
    const client = await pool.connect();
    try{
        await client.query("BEGIN");
        await client.query("DELETE FROM voluntarios_habilidades WHERE voluntario_id = $1;", [id]);
        await client.query("DELETE FROM voluntarios WHERE id = $1 AND nome = $2;", [id, nome]);
        await client.query("COMMIT");
        return {message: `usuario ${nome} foi deletado/a`};
    }catch(err){
        await client.query("ROLLBACK");
        return {error: err.name, motivo: err.message};
    }finally{
        client.release();
    }
}
export {searchUserById, createUser, deleteUserFromEverything};
 