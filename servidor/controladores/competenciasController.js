const con = require("../libs/conexiondb");

function buscarCompetencias(req, res) {
  const sql = `SELECT * FROM competencia`;

  con.query(sql, function(error, resultado, fields) {
    if (error) {
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }

    res.send(JSON.stringify(resultado));
  });
}

function obtenerOpciones(req, res) {
    const idCompetencia = req.params.id; 
    let sql = `SELECT * FROM competencia WHERE id = ${idCompetencia}`;

    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        if (resultado.length === 0) {
            console.log("El id ingresado no se corresponde con ninguna competencia");
            return res.status(404).send("El id ingresado no se corresponde con ninguna competencia");
        }

        const competencia = resultado[0];

        let sql = "SELECT pelicula.id, pelicula.poster, pelicula.titulo FROM pelicula", join = "", where = "";
            
        if (competencia.actor_id){
            join += " INNER JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id" ;
            where += " WHERE actor_pelicula.actor_id = " + competencia.actor_id;
        } 
        
        if (competencia.director_id){
            join += " INNER JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id" ;

            if (where.length > 0){
                where += " and ";
            } else {
                where += " WHERE ";
            }

            where +=  "director_pelicula.director_id = " + competencia.director_id;
        } 
        
        if (competencia.genero_id){
            if (where.length > 0){
                where += " and ";
            } else {
                where += " WHERE ";
            }

            where += "pelicula.genero_id = " + competencia.genero_id;
        }

        sql += join + where + " ORDER BY FLOOR(1 + RAND() * 100000)";
        
        con.query(sql, function(error, resultado, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }

            const response = {
                'competencia': competencia.nombre,
                'peliculas': resultado
            };
            
            res.send(JSON.stringify(response));    
        });             
    });
}

function agregaVoto(req, res) {
    const idCompetencia = req.params.id,
    idPelicula = req.body.idPelicula;     
    let sql = `SELECT * FROM competencia WHERE id = ${idCompetencia}`;
    
    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        if (resultado.length === 0) {
            console.log("El id ingresado no se corresponde con ninguna competencia");
            return res.status(404).send("El id ingresado no se corresponde con ninguna competencia");
        }

        sql = `SELECT * FROM pelicula WHERE id = ${idPelicula}`;
    
        con.query(sql, function(error, resultado, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
    
            if (resultado.length === 0) {
                console.log("No se encontro ninguna pelicula con este id");
                return res.status(404).send("El id no se corresponde con ninguna película");
            }

            sql = `INSERT INTO voto ( competencia_id, pelicula_id ) VALUES ( ${idCompetencia} , ${idPelicula} );`

            con.query(sql, function(error, resultado, fields) {
                if (error) {
                    console.log("Hubo un error en la insercion", error.message);
                    return res.status(500).JSON(error);
                }

                res.status(200).send();    
            });        
        });        
    });
}

function obtenerResultados(req, res) {
    const idCompetencia = req.params.id; 
    let sql = `SELECT * FROM competencia WHERE id =${idCompetencia};`
    
    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        if (resultado.length === 0) {
            console.log("El id no se corresponde con ninguna competencia");
            return res.status(404).send("El id no se corresponde con ninguna competencia");
        }

        const competencia = resultado[0];

        let sql = `SELECT voto.pelicula_id, pelicula.poster, pelicula.titulo, COUNT(pelicula_id) As votos FROM voto INNER JOIN pelicula ON voto.pelicula_id = pelicula.id WHERE voto.competencia_id = ${idCompetencia} GROUP BY voto.pelicula_id ORDER BY COUNT(pelicula_id) DESC LIMIT 3;`

        con.query(sql, function(error, resultado, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }

            const response = {
                'competencia': competencia.nombre,
                'resultados': resultado
            };
           
            res.send(JSON.stringify(response));    
        });             
    });
}

function agregarCompetencias(req, res) {    
    const nombreCompetencia = req.body.nombre;
    idGenero = req.body.genero;
    idDirector = req.body.director;
    idActor = req.body.actor;

    console.log("agregamos competencia", nombreCompetencia)

    if (!nombreCompetencia) {
        console.log("Debe ingresar el nombre de la competencia");
        return res.status(422).send("Debe ingresar el nombre de la competencia");    
    }

    let sql = `SELECT * FROM competencia WHERE nombre = '${nombreCompetencia}';`

    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        if (resultado.length === 1) {
            console.log("Ya existe una competencia con este nombre");
            return res.status(422).send("Ya existe una competencia con este nombre");
        }

        let sql = "SELECT count(pelicula.id) As cantidad FROM pelicula", join = "", where = "", campos = "nombre", valores = ") VALUES ('" + nombreCompetencia + "'";

        if (idGenero > 0) {
            if (where.length > 0){
                where += " and ";
            } else {
                where += " WHERE ";
            }

            where += "pelicula.genero_id = " + idGenero;
            campos += ",genero_id";
            valores += "," + idGenero;
        }
    
        if (idDirector > 0) {
            join += " INNER JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id" ;

            if (where.length > 0){
                where += " and ";
            } else {
                where += " WHERE ";
            }

            where +=  "director_pelicula.director_id = " + idDirector;
            campos += ",director_id";
            valores += "," + idDirector;
        }
    
        if (idActor > 0) {
            join += " INNER JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id" ;

            if (where.length > 0){
                where += " and ";
            } else {
                where += " WHERE ";
            }

            where += "actor_pelicula.actor_id = " + idActor;
            campos += ",actor_id";
            valores += "," + idActor;
        }


        sql += join + where;
        
        con.query(sql, function(error, resultado, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
            
            if (resultado.length === 0 || resultado[0].cantidad <= 1) {
                console.log("Con este criterio no hay 2 peliculas como minimo");
                return res.status(422).send("Con este criterio no hay 2 peliculas como minimo");
            }
    
            sql = "INSERT INTO competencia ("+ campos + valores + ")";

            con.query(sql, function(error, resultado, fields) {
                console.log(sql)
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(404).send("Hubo un error en la consulta");
                }

    
                res.status(200).send();    
            });                
        });        
    });
}

function eliminarVotos(req, res) {
    const idCompetencia = req.params.id; 
    let sql = `SELECT * FROM competencia WHERE id = ${idCompetencia};`
    
    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        if (resultado.length === 0) {
            console.log("No se encontro ninguna competencia con este id");
            return res.status(404).send("No se encontro ninguna competencia con este id");
        }

        let sql = `DELETE FROM voto WHERE voto.competencia_id = ${idCompetencia};`

        con.query(sql, function(error, resultado, fields) {
            if (error) {
                console.log("Hubo un error en la eliminacion de los votos", error.message);
                return res.status(500).send("Hubo un error en la eliminacion de los votos");
            }

            res.status(200).send();    
        });             
    });
}



function eliminarCompetencias(req, res) {
    const idCompetencia = req.params.id; 
    let sql = `SELECT * FROM competencia WHERE id = ${idCompetencia};`
    
    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        if (resultado.length === 0) {
            console.log("No se encontro ninguna competencia con este id");
            return res.status(404).send("No se encontro ninguna competencia con este id");
        }

        let sql = `DELETE FROM voto WHERE voto.competencia_id = ${idCompetencia};`

        con.query(sql, function(error, resultado, fields) {
            if (error) {
                console.log("Hubo un error en la eliminacion de los votos", error.message);
                return res.status(500).send("Hubo un error en la eliminación de los votos");
            }

            let sql = `DELETE FROM competencia WHERE id = ${idCompetencia};`

            con.query(sql, function(error, resultado, fields) {
                if (error) {
                    console.log("Hubo un error en la eliminacion de la competencia", error.message);
                    return res.status(500).send("Hubo un error en la eliminación de la competencia");
                }
    
                res.status(200).send();    
            });                
        });             
    });
}

function editarCompetencias(req, res) {
    const idCompetencia = req.params.id, 
    nombreCompetencia = req.body.nombre;

    if (!nombreCompetencia) {
        console.log("Debe completar el nombre de la competencia");
        return res.status(422).send("Debe completar el nombre de la competencia");    
    }

    let sql = "SELECT * FROM competencia WHERE nombre = '" + nombreCompetencia + "' and id <> " + idCompetencia;

    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        if (resultado.length === 1) {
            console.log("Ya hay otra competencia con este nombre");
            return res.status(422).send("Ya hay otra competencia con este nombre");
        }

        let sql = "SELECT * FROM competencia WHERE id = " + idCompetencia;
    
        con.query(sql, function(error, resultado, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }

            if (resultado.length === 0) {
                console.log("No se encontro ninguna competencia con este id");
                return res.status(404).send("No se encontro ninguna competencia con este id");
            }
        
            let sql = "UPDATE competencia SET nombre = '" + nombreCompetencia + "' WHERE id = " + idCompetencia;

            con.query(sql, function(error, resultado, fields) {
                if (error) {
                    console.log("Hubo un error en la modificacion de la competencia", error.message);
                    return res.status(500).send("Hubo un error en la modificacion de la competencia");
                }

                res.status(200).send();    
            });                
        });             
    });
}

function buscarCompetencia(req, res) {
    
    const idCompetencia = req.params.id; 
    let sql = "SELECT competencia.nombre, genero.nombre AS genero_nombre, actor.nombre AS actor_nombre, director.nombre AS director_nombre FROM competencia LEFT JOIN genero ON competencia.genero_id = genero.id LEFT JOIN actor ON competencia.actor_id = actor.id LEFT JOIN director ON competencia.director_id = director.id WHERE competencia.id = " + idCompetencia;
    
    con.query(sql, function(error, resultado, fields) {
        
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        if (resultado.length === 0) {
            console.log("No se encontro ninguna competencia con este id");
            return res.status(404).send("No se encontro ninguna competencia con este id");
        }

        res.send(JSON.stringify( resultado[0] ));    
    });
}


module.exports = {
  buscarCompetencias,
  obtenerOpciones,
  
  agregarCompetencias,
  eliminarCompetencias,
  buscarCompetencia,
  editarCompetencias,

  agregaVoto,
  eliminarVotos,
  obtenerResultados,
};
