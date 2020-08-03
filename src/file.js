const fs = require('fs');
// __ muestra la ruta del archivo
const ruta = __dirname;
const file = process.argv[2];
//const ruta = process.argv[2];

fs.readFile(file, 'utf-8', (err, data) => {
  if (err) {
      console.log(err)
  }else {
      const lines = data.split(/ https?:\/\/(?!.*:\/\/)\S+(?=\)) /);
      lines.forEach(line => {
          console.log('texto', line)
      })
  }
})
console.log('probanding')


