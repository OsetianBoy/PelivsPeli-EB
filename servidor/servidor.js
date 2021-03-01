const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const path = require( 'path' );
const cors = require( 'cors' );

const controladorCompetencias = require( './controladores/competenciasController' );
const controladorActorDirectorGenero = require( './controladores/actorDirectorGeneroController' );

const app = express();
const port = 8080;

app.use( express.static( path.join( __dirname, '/../cliente' ) ) );

app.use( cors() );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );

app.use( '/', express.static( path.join( __dirname, '/../cliente/html' ) ) );

app.get( '/competencias', controladorCompetencias.buscarCompetencias );
app.post('/competencias', controladorCompetencias.agregarCompetencias);
app.delete('/competencias/:id', controladorCompetencias.eliminarCompetencias);
app.get('/competencias/:id', controladorCompetencias.buscarCompetencia);
app.put('/competencias/:id', controladorCompetencias.editarCompetencias);

app.get('/competencias/:id/peliculas', controladorCompetencias.obtenerOpciones);

app.post('/competencias/:id/voto', controladorCompetencias.agregaVoto);
app.delete('/competencias/:id/votos', controladorCompetencias.eliminarVotos)
app.get('/competencias/:id/resultados', controladorCompetencias.obtenerResultados);

app.get('/generos', controladorActorDirectorGenero.buscarGeneros);
app.get('/directores', controladorActorDirectorGenero.buscarDirectores);
app.get('/actores', controladorActorDirectorGenero.buscarActores);

app.listen( port, () => {
	console.log( `Servidor corriendo en puerto: ${port}` );
} );
