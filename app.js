const express = require("express");
const { registerFont, createCanvas, loadImage } = require('canvas');
registerFont('publicpixel.ttf', { family: 'Arial' });

const port = process.env.PORT || 3000;
const app = express();

var uptime = 0;

setInterval(function(){
    uptime++;
}, 1000);

const allowCrossDomain = function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
}

var viewerStat = {
    
};

function viewer(text) {
    const canvas = createCanvas(400, 200);
    const ctx = canvas.getContext('2d');

    // Fill the canvas.
    var sizePixel = 10;
    for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {
            ctx.fillStyle = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
            ctx.fillRect(i * sizePixel, j * sizePixel, sizePixel, sizePixel);
        }
    }

    // Draw overlay black
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Write Statistic
    ctx.fillStyle = '#fff';
    ctx.font = '40px Comic Sans MS';
    ctx.fillText('Statistic', 120, 30);

    // Write text
    ctx.fillStyle = '#fff';
    ctx.font = '25px Arial';
    ctx.fillText(text || 'Awesome!', 10, 40);
    
    ctx.font = '16px Arial';
    ctx.fillText('Powered with SimaBot Sevices', 10, 180);

    const buf = canvas.toBuffer('image/jpeg', { quality: 0.1 });
    return buf;
}

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send('<!DOCTYPE html> Hello World\n' + uptime + '\n' + new Date() + '\n' + '<img src="stat?pg=1">');
});

function getTotalViews(){
    const keys = Object.keys(viewerStat);
    var total = 0;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        total += viewerStat[key].viewers; 
    }
    return total;
}

app.get('/stat', (req, res) => {
    allowCrossDomain(req, res);
    res.setHeader('Content-Type', 'image/jpeg');
    var text = '';
    var pg;
    if (!req.query.pg){
        text = 'Error!';
    }else{
        pg = String(req.query.pg)
        if(pg.length > 128){
            text = 'Max PG length 128 chars!';
        }else{
            if (typeof viewerStat[pg] === 'undefined') {
                viewerStat[pg] = {
                    viewers: 0
                };
            }
            viewerStat[pg].viewers++;
            text += '\nViews: ' + viewerStat[pg].viewers;
            text += '\nPG name: ' + pg;
        }
    }
    text += '\nTotal views: ' + getTotalViews();
    res.send(viewer(text));
});

app.listen(port, () => console.log(`App listening on port ${port}!`));