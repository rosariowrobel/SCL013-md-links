/*module.exports = () => {
  // ...
};
*/

const fs = require('fs');
//const path=require('path');
const path = process.argv[2]; //toma el nombre del archivo
 console.log(process.argv[0], "esta funcionando el 0");
 console.log(process.argv[1], "funciona el 1");
 console.log(process.argv[2], "ARCHIVO MD NO ENCONTRADO");


 fs.readFile(path,'utf8', function (err, data) {
  console.log("leyendo archivo");
if(err){
  console.log(`Error ${err}`);

}else {
  console.log(data.trim().split('\n').filter(word => word.includes('https://')));
  
}
});
