// Modulos requeridos
let fs = require("fs"); // Módulo  de sistema de archivos
let dir = require("node-dir"); // Lee Archivos y subdirectorios
let path = require("path"); // Resuelve la ruta a absoluta
const fetch = require("node-fetch"); // Regresa Status de URL
const chalk = require("chalk");
const argv = require("yargs")
  .command("'Directorio a Validar'", "'-v ó --validate' y/o '-s ó --stats'", {
    validate: {
      default: false,
      alias: "v",
    },
    stats: {
      default: false,
      alias: "s",
    },
  })
  .help().argv;

// Variables requeridas
let regEx = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s\n)]+)(?=\))/g; // Patrón para encontrar links
let ruta = process.argv[2];
let opcion1 = argv.validate;
let opcion2 = argv.v;
let opcion3 = argv.stats;
let opcion4 = argv.s;
let expectMDLink = /\[([^\]]*)\]\(([^)]*)\)/g;
let filesMDLinks = []; //Array para guardar la inf (URL, Text, File)
let ok = 0;
let broken = 0;

const processLinks = (files) => {
  files.forEach((element) => {
    fs.readFile(element, "utf-8", (e, file) => {
      if (e) {
        console.error(e);
      } else {
        const linksFound = file.match(regEx);
         const textLinks = file
          .match(expectMDLink)
          .map((v) => v.split("](")[0].slice(1));
        linksFound.forEach((link, i) =>
          filesMDLinks.push({
            href: link,
            text: textLinks[i],
            file: element,
          })
        );
        console.log(`Links encontrados en directorio ${element}`, filesMDLinks);
        filesMDLinks = [];
        //console.log(`links encontrados en ${element}`, linksFound);
      }
    });
  });
};

// Coincide con los nombres de archivo con una extensión .md y excluye los dir node_modules
const mdLinks = (route) => {
  return new Promise((resolve, reject) => {
    rutaAbsRel = path.resolve(route);
    console.log("Ruta Convertida por resolve ", rutaAbsRel);
    console.log(chalk.green("Procesando informacion por favor espere....."));
    if (rutaAbsRel) {
      resolve(rutaAbsRel);
    } else {
      reject("ruta Invalida");
    }
  });
};

mdLinks(ruta)
  .then((respuesta) => {
    dir.readFiles(
      respuesta,
      { match: /.md$/, excludeDir: ["node_modules"] },
      (err, content, next) => {
        if (err) {
          console.log("error 1");
        }
        next();
      },
      (err, files) => {
        if (err) {
          console.log("Error al leer la ruta de archivos");
        } else {
          console.log(chalk.yellow("Rutas de archivos encontrados: "));
          console.log(files);
          if (
            (opcion1 === true || opcion2 === true) &&
            (opcion4 === true || opcion3 === true)
          ) {
           statsLinks(files)
           validateLinks(files);
           // console.log("Selecciono las dos Opciones");
          } else if (opcion4 === true || opcion3 === true) {
            statsLinks(files);
           // console.log("Opcion stats Seleccionada");
          } else if (opcion2 === true || opcion1 === true) {
            validateLinks(files);
            //console.log("Opcion validate Seleccionada");
          } else {
            processLinks(files)
            console.log("No selecciono opcion");
          }
          /* processLinks(files)
          validateLinks(files);
          statsLinks(files); */
        }
      }
    );
  })
  .catch((error) => {
    //console.log(error);
  });

const validateLinks = (files) => {
  files.forEach((element) => {
    fs.readFile(element, "utf8", (err, data) => {
      let statusLinks = data.match(regEx);
      for (let i = 0; i < statusLinks.length; i++) {
        fetch(statusLinks[i])
          .then((response) => {
            if (response.status === 200)
              console.log(
                ` File: ${element}\n Link: ${statusLinks[i]}\n ${ chalk.yellow (' ✔ ' + response.status)}\n`
              ); else
              console.log(
                ` File: ${element}\n Link: ${statusLinks[i]}\n ${ chalk.red (' ✖ ' + response.status)}\n`
              );
            return response;
          })
          .catch((error) => {
            console.log(
              "Hubo un problema con la solicitud Fetch:" + error.message
            );
          });
      }
    });
  });
};

const statsLinks = (files) => {
  files.forEach((element) => {
    fs.readFile(element, "utf8", (err, data) => {
      let statusLinks = data.match(regEx);
      for (let i = 0; i < statusLinks.length; i++) {
        fetch(statusLinks[i])
          .then((response) => {
            if (response.status === 200) ok++;
            return response;
          })
          .then((response) => {
            if (response.status !== 200) broken++;
            return response;
          })
          .then(() => {
            if (ok + broken === statusLinks.length)
              console.log(
                `${ chalk.green ('  ✔ Total :' + statusLinks.length)}\n  ${ chalk.blue ('✔ Unique :' + ok)}\n  ${ chalk.red ('✖ Broken :' + broken)}`
              );
          });
      }
    });
  });
};

module.exports = mdLinks;
module.exports = processLinks;
