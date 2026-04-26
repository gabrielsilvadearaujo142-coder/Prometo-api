
import  {Pool} from "pg";
const pool = new Pool({
    host : process.env.HOST,
     user : process.env.USER,
    database : process.env.DATABASE,
    port : process.env.PORT,
    password : process.env.PASSWORD
});


async function searchUser(id){
    try{
        const result = await pool.query("SELECT nome, habilidades FROM voluntarios WHERE id = $1", [id])
        return result.rows[0];
    }
    catch(err){
        return {error: err.name, motivo: err.message};
    }
}


export {searchUser};