const fs = require('fs');
const path = require ('path');
const file2 = process.argv[2];
//Condicion que verifica que si es un archivo que termina en  md

const md = (file)=>{

    if(file.slice(-3) == ".md"){
    console.log(file)
    
    }
    else{
      console.log("error");
      
    }};
  
    md(file2)

   // module.exports = mdLinks2;