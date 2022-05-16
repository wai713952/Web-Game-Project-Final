const express = require('express');
const moment = require('moment');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'public/img/');
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + req.cookies.username + path.extname(file.originalname));
    }
  });

const imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const con = mysql.createConnection({
    multipleStatements: true,
    host: "localhost",
    user: "root",
    password: "poomwar444",
    database: "finalwebgame"
})

con.connect(err => {
    if(err) throw(err);
    else{
        console.log("MySQL connected");
    }
})

const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        // query method
        con.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

const doublequeryDB = (sql1,sql2) => {
    if(sql1==null)
    {
        sql1 = ""
    }
    if(sql2==null)
    {
        sql2 = ""
    }
  
    return new Promise((resolve,reject) => {
        // query method
        con.query(sql1+sql2,[1,2],(err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

app.get('/logout', (req,res) => {
    res.clearCookie('username');
    res.clearCookie('img');
    res.clearCookie('accountPK');
    return res.redirect('login.html');
})


app.post('/profilepic', (req,res) => {
    let upload = multer({ storage: storage, fileFilter: imageFilter }).single('avatar');
    //console.log(req.file.filename);
    upload(req, res, (err) => {

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
        //console.log(req.file.filename);
        res.cookie('img',req.file.filename);
       
        updateImg(req.cookies.username,req.file.filename);
        //res.send('You uploaded this image filename: '+ req.file.filename);
        return res.redirect('game-menu.html');
    });
  
    
})

const updateImg = async (username, filen) => {
    let tablename = "userInfo";
    let sql = `UPDATE ${tablename} SET img = '${filen}' WHERE username = '${username}'`;
     await queryDB(sql);
    
}

app.post('/regisDB', async (req,res) => {
    // console.log(req.body.username);
    // console.log(req.body.email);
    // console.log(req.body.password1);
    
    let sql = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, username VARCHAR(255), email VARCHAR(100),password VARCHAR(100),img VARCHAR(100))";
    let result = await queryDB(sql);
    let tablename = "userInfo";
    let Inputusername = req.body.username;
    let Inputuserp1 = req.body.password1;
    let Inputuserp2 = req.body.password2;
    sql = `SELECT id, username FROM ${tablename}`;
    result = await queryDB(sql);
    result = Object.assign({},result);
    var keys = Object.keys(result);
    // console.log(result);
    // console.log(keys.length);
    if(keys.length==0)
    {
        if(Inputuserp1 ==Inputuserp2)
        {
            sql = `INSERT INTO userInfo (username, email, password,img) VALUES ("${req.body.username}", "${req.body.email}", "${req.body.password1}","avatar.png")`;
            result = await queryDB(sql);
            console.log("New record created successfullyone");
            return res.redirect('login.html');
        }
        else
        {
            return res.redirect('register.html?error=3');
        }
    }
    let i = 0;
    for(var count in result)
    {
        // console.log(result[count].username);
        // console.log(result[count].password);

        if(((Inputusername!==result[count].username && Inputuserp1 ==Inputuserp2) && ((i+1) ==keys.length ))|| i ==keys.length)
       {
        sql = `INSERT INTO userInfo (username, email, password,img) VALUES ("${req.body.username}", "${req.body.email}", "${req.body.password1}","avatar.png")`;
        result = await queryDB(sql);
        console.log("New record created successfullyone");
        return res.redirect('login.html');
       }
       else if(Inputusername===result[count].username||Inputuserp1 !==Inputuserp2)
       {
        return res.redirect('register.html?error=3');
       }
       else
       {
        i++;     
       }
    }

  /*  sql = `DELETE FROM ${tablename} `;
    result = await queryDB(sql);*/
   // res.end("New record created successfully");

})




app.post('/checkLogin',async (req,res) => {
    let Inputusername = req.body.username;
    let Inputpassword = req.body.password1;
    let tablename ="userInfo";
    let sql = `SELECT id, username, email ,password,img FROM ${tablename}`;
    let result = await queryDB(sql);
    result = Object.assign({},result);
    var keys = Object.keys(result);
    
    let i = 0;
    for(var count in result)
    {
        // console.log(result[count].username);
        // console.log(result[count].password);

        if(Inputusername===result[count].username && Inputpassword===result[count].password)
       {
        
        console.log("usercorrect");
        res.cookie('accountPK',result[count].id);
        res.cookie('username', result[count].username); //res.cookie('name', 'keroro',{maxAge: 10000},'path=/');
        res.cookie('img',result[count].img);
        //res.cookie('score',0);
        return res.redirect('game-menu.html');
       }
       else if((Inputusername!==result[count].username || Inputpassword!==result[count].password)&& (i+1) ==keys.length)
       {
        return res.redirect('login.html?error=1');
       }
       else
       {
        i++;     
       }

    }
    //console.log(result);
    // ถ้าเช็คแล้ว username และ password ถูกต้อง
    // return res.redirect('feed.html');
    // ถ้าเช็คแล้ว username และ password ไม่ถูกต้อง
    // return res.redirect('login.html?error=1')
})

app.post('/game1',async (req,res) => {
    const outMsg =  req.body;
    var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    console.log(mysqlTimestamp);
    let tablename = "gamerecord";
    let gamename = "rustbucket"
    let sql = `CREATE TABLE IF NOT EXISTS ${tablename} (rec_id INT AUTO_INCREMENT PRIMARY KEY,gamename VARCHAR(255),gamescore int, userID int,FOREIGN KEY (userID) REFERENCES userInfo(id)) `;
    let result = await queryDB(sql);
  
    sql = `INSERT INTO gamerecord (gamename,gamescore,userID,timestamps) VALUES("${gamename}",${outMsg["score"]},${req.cookies.accountPK},'${mysqlTimestamp}');`;
    result = await queryDB(sql);
  
  
 
    
    //object[manypost] = outMsg;
    console.log(outMsg["score"]);
    res.redirect('game/rustbucket/rustbucket.html');
     //console.log(typeof outMsg);
})

app.post('/game2',async (req,res) => {
    const outMsg =  req.body;
    var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
   
    let tablename = "gamerecord";
    let gamename = "shinji"
    let sql = `CREATE TABLE IF NOT EXISTS ${tablename} (rec_id INT AUTO_INCREMENT PRIMARY KEY,gamename VARCHAR(255),gamescore int, userID int,FOREIGN KEY (userID) REFERENCES userInfo(id)) `;
    let result = await queryDB(sql);
   
    sql = `INSERT INTO gamerecord (gamename,gamescore,userID,timestamps) VALUES("${gamename}",${outMsg["score"]},${req.cookies.accountPK},'${mysqlTimestamp}');`;
    result = await queryDB(sql);
 

    
    //object[manypost] = outMsg;
    console.log(outMsg["score"]);
    res.redirect('game/shinji/shinji.html');
     //console.log(typeof outMsg);
})

app.post('/game3',async (req,res) => {
    const outMsg =  req.body;
    var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    
    let tablename = "gamerecord";
    let gamename = "RPS"
    let sql = `CREATE TABLE IF NOT EXISTS ${tablename} (rec_id INT AUTO_INCREMENT PRIMARY KEY,gamename VARCHAR(255),gamescore int, userID int,FOREIGN KEY (userID) REFERENCES userInfo(id)) `;
    let result = await queryDB(sql);
    sql = `INSERT INTO gamerecord (gamename,gamescore,userID,timestamps) VALUES("${gamename}",${outMsg["score"]},${req.cookies.accountPK},'${mysqlTimestamp}');`;
    result = await queryDB(sql);
 

    //object[manypost] = outMsg;
    console.log(outMsg["score"]);
    res.redirect('game/shinji/shinji.html');
     //console.log(typeof outMsg);
})



app.get('/register', async (req,res) => {
   
    return res.redirect('register.html');
    
})

app.get('/login', async (req,res) => {
   
    return res.redirect('login.html');
    
})

app.get('/basketball', async (req,res) => {
   
    return res.redirect('game/rustbucket/rustbucket.html');
    
})

app.get('/shinji', async (req,res) => {
   
    return res.redirect('game/shinji/shinji.html');
    
})

app.get('/RPS', async (req,res) => {
   
    return res.redirect('game/RPS/RPS.html');
    
})

app.get('/MENU', async (req,res) => {
   
    return res.redirect('game-menu.html');
    
})

app.get('/MENU', async (req,res) => {
   
    return res.redirect('game-menu.html');
    
})

app.get('/commentpage', async (req,res) => {
 
    return res.redirect('commentINDEX.html');
    
})

app.post('/requestcomment', async (req,res) => {
    console.log(req.body);
  let sql1 = `select usergamerec ,gamenamerec, COUNT(*) from liketable where usergamerec=${req.cookies.commentuser} and gamenamerec="${req.cookies.gamename}" group by usergamerec ,gamenamerec ;`;
  let sql2 = ` select * from commenting where usergamerec=${req.cookies.commentuser} and gamenamerec="${req.cookies.gamename}" ;`;
    let result = await doublequeryDB(sql1,sql2);
    result = Object.assign({},result);
    console.log(result);
    res.json(result);
    res.end;
   
    
})

app.get('/readtableprofile', async (req,res) => {
    // let sortbyType = await req.body.sortType;
    // let sortby = await req.body.sortby;
    // let gamename = await req.body.gamename;
    // let sql;
    // console.log(sortbyType);
    // console.log(gamename);
    sql = `SELECT @rownum := @rownum + 1 AS ranking,gamename,gamescore,cast(timestamps as char) as timestamps FROM gamerecord 
    inner join userinfo u on u.id = gamerecord.userID
    ,(select @rownum := 0) r
     where userID=${req.cookies.accountPK} and gamename ="rustbucket"
    order by gamescore desc;`;

  /*  else
    {
        sql = `SELECT @rownum := @rownum + 1 AS ranking,gamename,gamescore,cast(timestamps as char) as timestamps FROM gamerecord 
    inner join userinfo u on u.id = gamerecord.userID
    ,(select @rownum := 0) r
     where userID=${req.cookies.accountPK} and gamename ="${gamename}"
    order by ${sortbyType} ${sortby};`;
    }*/
  
    let result = await queryDB(sql);
    result = Object.assign({},result);
    var keys = Object.keys(result);
    console.log(result);
    console.log(typeof result);
    console.log(keys);
    res.json(result);
    res.end;
    
})

app.post('/sendSelectTable', async(req,res)=>{
    
  /*  let sortbyType = await req.body.sortType;
    let sortby = await req.body.sortby;
    let gamename = await req.body.gamename;*/
     //console.log(req.body);
     const obj = req.body;
    //  console.log(obj["gamenames"]);
    let sql = `SELECT @rownum := @rownum + 1 AS ranking,gamename,gamescore,cast(timestamps as char) as timestamps FROM gamerecord 
    inner join userinfo u on u.id = gamerecord.userID
    ,(select @rownum := 0) r
     where userID=${req.cookies.accountPK} and gamename ="${obj["gamenames"]}"
    order by ${obj["sortTypes"]} ${obj["sortBys"]};`;
    let result = await queryDB(sql);
    result = Object.assign({},result);
    // console.log(typeof result);
    res.json(result);
    res.end;
    //res.render('game-profile.html',result);
   
 //   res.end(result);
 //res.setHeader('Content-Type', 'application/json');

}
) 

app.post('/sendhighSelectTable', async(req,res)=>{
  
       const obj = req.body;
      
       console.log(obj["gamenames"]);
     
       let sql = `CREATE TABLE IF NOT EXISTS commenting (
        comment_id INT AUTO_INCREMENT PRIMARY KEY,
        txt VARCHAR(255),
        timestamps timestamp,
        userID int,
        gamenamerec varchar(255),
        usergamerec int,
        FOREIGN KEY (userID) REFERENCES userinfo(id),
        FOREIGN KEY (usergamerec) REFERENCES gamerecord(userID)) ;` ;
       let result = await queryDB(sql);

        sql = `CREATE TABLE IF NOT EXISTS liketable (
            like_id INT AUTO_INCREMENT PRIMARY KEY,
            userID int,
            gamenamerec varchar(255),
            usergamerec int ,
            FOREIGN KEY (userID) REFERENCES userinfo(id),
            FOREIGN KEY (usergamerec) REFERENCES gamerecord(userID)
             );`
        ;
        result = await queryDB(sql);
        sql = `SELECT o.rec_id,  username,o.gamescore,cast(o.timestamps as char) as timestamps , o.gamename ,  l.likecount ,ID
        FROM \`gamerecord\` o   
        inner join userinfo u on u.id =o.userID
        left join( select usergamerec ,gamenamerec, COUNT(*)as likecount from liketable group by usergamerec ,gamenamerec   )l on l.usergamerec = o.userID and l.gamenamerec = o.gamename                             
          LEFT JOIN \`gamerecord\` b                           
           ON o.userID = b.userID and o.gamename = b.gamename AND o.gamescore < b.gamescore
        WHERE b.gamescore is NULL    and o.gamename ="${obj["gamenames"]}"
        order by ${obj["sortTypes"]} ${obj["sortBys"]}                           
         ;`;
      result = await queryDB(sql);
      result = Object.assign({},result);
      console.log(typeof result);
      res.json(result);
      res.end;
     
  
  }
  ) 

  app.post('/frontendleadboardname', async(req,res)=>{
      console.log(req.body);
    let sql = 'select ID,username from userinfo;';
    const obj = req.body;
    console.log(obj["gamename"]);
     res.cookie('commentuser',obj["usergamerec"]);
     res.cookie('gamename',obj["gamename"]);
     res.send({redirect: '/commentpage'});
     res.end;
  
 
   
}
) 


app.post('/comment', async(req,res)=>{
    console.log(req.body);
  let sql3 = `select ID,username from userinfo;`;
  let sql1 = '';
  let sql2 = '';
    let result = await doublequeryDB(sql3);
    console.log(result);
  // if(obj["usergamerec"]== null)
  // {
  //      console.log(obj["usergamerec"]);
  // }
  // else
  // {
      
  // }
 
}
) 




app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/register.html`);
});

