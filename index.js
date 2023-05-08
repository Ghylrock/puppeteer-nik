const puppeteer = require('puppeteer');
const parsenik = require("parsenik");
const cors = require('cors');
const express = require('express')
const app = express()

app.use(express.json());
app.use(cors({
  origin: /^https?:\/\/([a-z0-9]+\.)?ghylrock\.com(:\d+)?$/i,
  methods: 'POST'
}));

app.use(express.static('public'));

async function getData(nik){
  let [browser, page] = [null, null];
  browser = await puppeteer.launch({
      headless: true,
      args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
      ]
  });
  page = (await browser.pages())[0];
  await page.goto('https://cekdptonline.kpu.go.id/');

  try{
    await page.type(".form-control" , nik);
    const button = await page.waitForSelector('#root > main > div.container > div > div > div > div.card-body > div > div > div.wizard-buttons > button:nth-child(2)');
  
    button.click();
  
    await page.waitForResponse(response => response.url().startsWith('https://cekdptonline.kpu.go.id/apilhp'));
  
    const body = await page.evaluate((nik) => {
      const arr = [];
      try{
        arr.push({NIK: nik});
        arr.push({nama: document.querySelectorAll('.wizard-default')[0].querySelectorAll('.text-xl-left')[1].innerText});
        arr.push({TPS: document.querySelectorAll('.wizard-default')[0].querySelectorAll('.text-xl-left')[4].innerText});
        return arr;
      }catch{
        arr.push({ 'Keterangan' : 'Data salah atau nama belum terdaftar'})
        return arr;
      }
    }, nik);
    await browser.close();
    return body
  }catch{
    return [{ 'Keterangan' : 'Kesalahan Terjadi pada system, silahkan coba lagi.'}]
  }

}


app.post('/cekdpt', async (req, res) => {
  const id = String(req.body.nik).trim();
  const nik = parseInt(id);
  const hasil = parsenik.parse(nik);
  if (!hasil.valid) {
    res.send([{Error : "NIK salah atau tidak valid"}])
  }else{
    res.send(await getData(id))
  } 
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const port = 8080

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

