const express = require('express');
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

app.get('/logout', (req,res) => {
    res.clearCookie('username');
    res.clearCookie('img');
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
    console.log(req.body.username);
    console.log(req.body.email);
    console.log(req.body.password1);
    
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
    console.log(result);
    console.log(keys.length);
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
        console.log(result[count].username);
        console.log(result[count].password);

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

app.get('/register', async (req,res) => {
   
    return res.redirect('register.html');
    
})

app.get('/login', async (req,res) => {
   
    return res.redirect('login.html');
    
})


app.post('/checkLogin',async (req,res) => {
    let Inputusername = req.body.username;
    let Inputpassword = req.body.password1;
    let tablename ="userInfo";
    let sql = `SELECT id, username, email ,password,img FROM ${tablename}`;
    let result = await queryDB(sql);
    result = Object.assign({},result);
    var keys = Object.keys(result);
    console.log(result);
    console.log(keys.length);
    let i = 0;
    for(var count in result)
    {
        console.log(result[count].username);
        console.log(result[count].password);

        if(Inputusername===result[count].username && Inputpassword===result[count].password)
       {
           
        console.log("usercorrect");
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
    let tablename = "gamerec";
    let sql = `CREATE TABLE IF NOT EXISTS ${tablename} (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, username VARCHAR(255),gamename VARCHAR(255),score VARCHAR(255) `;
    let result = await queryDB(sql);
   
    let object;
    const outMsg =  req.body;
    //object[manypost] = outMsg;
    console.log(outMsg);
    res.redirect('game1.html');
    
   
     //console.log(typeof outMsg);
    
})



app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/register.html`);
});

