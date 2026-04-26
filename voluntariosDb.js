
import  {Pool} from "pg";
const pool = new Pool({
    host : process.env.HOST_db,
     user : process.env.USER_db,
    database : process.env.DATABASE_db,
    port : Number(process.env.PORT_db),
    password : process.env.PASSWORD_db
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
