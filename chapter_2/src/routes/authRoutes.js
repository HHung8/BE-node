import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

// Register a new user endpoing/auth/register
router.post('/register', (req,res) => {
    console.log(req)
    const {username, password} = req.body;
    // Validate đầu vào
    // if(!username || !password) {
    //     return res.status(400).send({message: "Username and password are required"})
    // }
    // if(password.length < 8) {
    //     return res.status(400).send({message: "Password must be a least 8 characters long"})
    // };

    // save the username and an irreversibly encrypted password;
    const hashedPassword = bcrypt.hashSync(password, 8); 
    // save the new user and hashed password to the database
    try {
        const insertUser = db.prepare(`INSERT INTO users(username, password) VALUES (?,?)`);
        const result = insertUser.run(username, hashedPassword);
        
        // now that we have a user. I want to add their first todo for them
        const defaultTodo = `Hello! Add your first todo!`
        const insertTodo = db.prepare(`INSERT INTO todos(user_id, task) VALUES(?, ?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)
        
        // create a token
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24h'});
        res.json({token});
    } catch (error) {
        console.log(error.message);
        res.sendStatus(503)
    }
});

router.post('/login', (req,res) => {
     // we get their email, and we look up the password associated with that em,ail in the database
    const {username, password} = req.body;
    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?');
        const user = getUser.get(username);
        // if we cannot find a user associated with that username, return out from the function
        if(!user) {
            return res.status(404).send({message: "User not found"});
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if(!passwordIsValid) {return res.status(401).send({message: "Invalid password"})}
        console.log(user)
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'});
        res.json({token});
    } catch (error) {
        console.log(error.message);
        res.sendStatus(503)
    } 
});

export default router;
