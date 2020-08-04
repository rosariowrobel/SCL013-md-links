const fs = require ("fs");//Nos permite acceder al sistema de archivos, viene incorporado en node
let file = process.argv[2];//Toma lo que se le da desde consola
let options = file.includes
//const axios = require ('axios');//librería para hacer solicitudes HTTP
const fetch = require ("fetch");
const fetchUrl = fetch.fetchUrl;
//Función que lee el archivo
const getMd = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, file) => {
      if (err) {
        return reject(err)
      } else {
        resolve(file)
      }
    })
  })
}

//Función que lee los links de la ruta espeficificada
const expReg = /https?:\/\/(?!.*:\/\/)\S+(?=\))/g;
let arrLinks = [];
fs.readFile(file, "utf-8", (err,file) => {
  if (err){
    console.log(err);
  }else{
    let links = file.match(expReg);
    console.log(file.match(expReg));
    links.forEach(element => {
      getStatus(element)
      .then (res =>{
        console.log("El link", element, "es", res);
      })
      .catch (err => {
        console.log(err);
      })
    })
  }
  return arrLinks;
});
const getStatus = (url) => {
  return new Promise ((resolve, reject) => {
    fetchUrl(url, (error, meta) => {
      if (error) {
        reject (error)
      } else {
        resolve (meta.status);
      }
    })
  });
};


