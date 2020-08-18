import * as express from 'express';
import DB from '../db';
let router = express.Router();

//handles get all chirps and get chirps by username request
router.get("/:username?", async (req, res) => {
    try {
        const username = await  req.params.username;
        let chirps;
        if(username)
            chirps = await DB.chirp.GetUserChirps(username);
        else
            chirps = await DB.chirp.GetChirps();

        res.json(chirps);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

export default router;