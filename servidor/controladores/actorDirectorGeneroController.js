const con = require("../libs/conexiondb");

function buscarActores(req, res) {
    const sql = `SELECT * FROM actor`

    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        res.send(JSON.stringify(resultado));
    });
}

function buscarDirectores(req, res) {
    const sql = `SELECT * FROM director`

    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        res.send(JSON.stringify(resultado));
    });
}

function buscarGeneros(req, res) {
    const sql = `SELECT * FROM genero`

    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        res.send(JSON.stringify(resultado));
    });
}

module.exports = {  
    buscarActores,
    buscarGeneros,
    buscarDirectores
};