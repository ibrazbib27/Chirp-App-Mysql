import * as express from 'express';
import DB from "../db";
let router = express.Router();

//handles get chirp request
router.get("/:id/admin?", async (req, res) => {
    try {
        let id = await req.params.id;
        let chirp = await DB.chirp.GetChirp(id);
        res.json(chirp);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//handles posting new chirp
router.post("/add", async (req, res) => {
    try {
       await DB.chirp.CreateChirp(req.body);
       res.sendStatus(200);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//handles posting new username
router.post("/:username/checkusers", async (req, res) => {
    try {
        let name = await req.params.username;
        await DB.chirp.CreateUsers(name);
        res.sendStatus(200);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//handles chirp delete request
router.delete("/:id/admin", async (req, res) => {
    try {
        let id = await req.params.id;
        await DB.chirp.DeleteChirp(id);
        res.sendStatus(200);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//handles chirp updates
router.put("/:id/admin", async (req, res) => {
    try {
        let id = await req.params.id;
        await DB.chirp.UpdateChirp(id, req.body);
        res.sendStatus(200);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//handles users and mentions updates
router.put("/:username/updateusers", async (req, res) => {
    try {
        let username = await req.params.username;
        await DB.chirp.NewMention(username);

        res.sendStatus(200);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.put("/:id/cleanusers", async (req, res) => {
    try {
        let id = await req.params.id;
        await DB.chirp.UpdateMentions(parseInt(id));
        await DB.chirp.DeleteUsers();

        res.sendStatus(200);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

export default router;
