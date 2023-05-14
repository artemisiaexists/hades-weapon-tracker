const express = require("express");

const PORT = process.env.PORT || 3001;

const cors = require("cors");
const app = express();
app.use(cors());
const fs = require("fs")

let data = [];
fs.readFile(
      "server/data.json",
      (err, res) => {
            if(!err){
                data = JSON.parse(res);
            } else {
                console.log(err)
            }
      }
)

app.get("/weapons", (req, res) => {
    const weapons = data.weapons;
    res.send({weapons})
});

app.post("/weapons", (req, res) => {
    const weaponI = req.headers.weapon;
    const level = req.headers.level;
    dataToChange = data.weapons[weaponI];
    if(parseInt(req.headers.heat) < 0) {
        if(parseInt(level) === 3) {
            for(var i = 0; i < 4; i++) {
                dataToChange.progress[i] = false;
            }
            dataToChange.heat = parseInt(dataToChange.heat) + 1;
        } else {
            for(var i = level; i > -1; i--) {
                dataToChange.progress[i] = true;
            }
        }
    } else {
        dataToChange.heat = req.headers.heat;
        for(var i = 0; i < 4; i++) {
            dataToChange.progress[i] = false;
        }
    }
    data.weapons[weaponI] = dataToChange;
    fs.writeFile(
        "server/data.json",
        JSON.stringify(data, null, 2),
        (err) => {console.log(err)})
    const weapons = data.weapons;
    res.send({weapons})
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
