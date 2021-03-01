USE competencias;

CREATE TABLE IF NOT EXISTS competencia (
	`id` INT(5) NOT NULL AUTO_INCREMENT,
	`nombre` VARCHAR(90) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS voto (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `competencia_id` INT(11) NOT NULL,
    `pelicula_id` INT(11) unsigned,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`pelicula_id`) REFERENCES pelicula(`id`),
    FOREIGN KEY(`competencia_id`) REFERENCES competencia(`id`)
);
