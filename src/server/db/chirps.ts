import {Connection} from './index';


//returns all chirps
const getChirps  = async () => {

return new Promise((res, rej) => {
    Connection.query("SELECT * FROM chirpr.chirps;", (err, result) => {
        if(err) return rej(err);

        res(result);
    });
});
}

//returns chirps based on username parameter (advanced lab requirement)
const getUserChirps = async (name: string) => {
    return new Promise((res, rej) => {
        Connection.query(`CALL chirpr.spUserMentions(?);`, [name],(err, result, fields) => {
            if(err) return rej(err);
            res(result);
        });
    });
}

//posts new chirp to database
const createChirp = async (chirp: any) => {
    return new Promise((res, rej) => {
        Connection.query(`INSERT INTO chirpr.chirps (content, title, img_src, _created) ` +
            `VALUES ('${chirp.content}', '${chirp.title}', '${chirp.img_src}', '${chirp._created}');`, (err, result) => {
            if(err) return rej(err);

            res(result);
        });
    });
}

//updates new user values to user table and mentions table (used heavily with editing chirp and less with creating chirp)
const newMention = async (name: string) => {
    return new Promise((res, rej) => {
        Connection.query(`CALL chirpr.spMentionsInstanceUpdate(?);`, [name],(err, result, fields) => {
            if(err) return rej(err);
            res(result);
        });
    });
}

//any users no longer mentioned are deleted from the user table with this call
const deleteUsers = async () => {
    return new Promise((res, rej) => {
        Connection.query(`CALL chirpr.spMentionsCleanUp();`,(err, result, fields) => {
            if(err) return rej(err);
            res(result);
        });
    });
}

//user's mentions are tracked if they are no longer present in a particular chirp this call will confirm that and delete that particular mention instance in the mentions table
//indicating a user is not longer mentioned within a particular chirp
const updateMention = async (id: number) => {
    return new Promise((res, rej) => {

                    Connection.query(`CALL chirpr.spMentionsInstanceDelete(?);`, [id], (err, result, fields) => {
                        if (err) return rej(err);
                        res(result);
                    });

            });

}


//after a chirp is created unique user value entries are added to the user table and then the procedure call will update the mention tables
const createUsers = async (username: string) => {
    return new Promise((res, rej) => {

        Connection.query(`INSERT IGNORE INTO chirpr.users (name) ` +
            `VALUES (LCASE('${username}'));`, (err1, result1) => {
            if(err1) return rej(err1);
          else{
                Connection.query(`CALL chirpr.spMentionsInstanceUpdate(?);`, [username],(err2, result2, fields) => {
                    if(err2) return rej(err2);

                    res(result2);
                });
            }
            res(result1);
        });
    });
}

//gets chirp based on id
const getChirp = async (id: string) => {
    return new Promise((res, rej) => {
        Connection.query(`SELECT * FROM chirpr.chirps WHERE id = '${id}';`, (err, result) => {
            if(err) return rej(err);

            res(result);
        });
    });
}

//deletes chirp based on id and deletes all mentions of the chirp and deletes any unused usernames in the users table
const deleteChirp = async (id: string) => {
    return new Promise((res, rej) => {
        Connection.query(`DELETE FROM chirpr.mentions WHERE chirpid = '${id}';`, (err1, result1) => {
            if(err1) return rej(err1);
            else {
                Connection.query(`CALL chirpr.spMentionsCleanUp();`,(err2, result2, fields) => {
                    if(err2) return rej(err2);
                    else {
                        Connection.query(`DELETE FROM chirpr.chirps WHERE id = '${id}';`, (err3, result3) => {
                            if (err3) return rej(err3);

                            res(result3);
                        });
                    }
                    res(result2);
                });
            }
            res(result1);
        });
    });
}

//updates chirp based on id
const updateChirp = async (id: string, chirp: any) => {
    return new Promise((res, rej) => {

                Connection.query(`UPDATE chirpr.chirps ` +
                    `SET content = '${chirp.content}', title = '${chirp.title}', img_src = '${chirp.img_src}', _created = '${chirp._created}'` +
                    `WHERE id = '${id}'`, (err, result) => {
                    if (err) return rej(err);

                    res(result);
                });

    });
}
export default {
    CreateChirp: createChirp,
    DeleteChirp: deleteChirp,
    GetChirps: getChirps,
    GetUserChirps: getUserChirps,
    DeleteUsers: deleteUsers,
    NewMention: newMention,
    UpdateMentions: updateMention,
    GetChirp: getChirp,
    UpdateChirp: updateChirp,
    CreateUsers: createUsers
};