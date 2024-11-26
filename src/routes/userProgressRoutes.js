const express = require('express');
const router = express.Router();
const { conn } = require('../config/db')

// Getting progress of logged-in user across modules

const getProgress = async (username) => {
    try {
        const connection = await connectToDB();
        const [users] = connection.execute(
            'SELECT Users.username, UserProgress.* FROM Users u JOIN UserProgress p ON u.user_id = p.user_id WHERE u.username = ?',
            [username] 
        );
        await connection.end();
        res.status(201).json({message: 'User was registered successfully! Welcome, ', username})
        return users;
    } catch (err) {
        res.status(500).json({message: 'Oops! An error occured while updating progress of the user: ', error: err.message})
    }
};

// Updating user progress when completing a module or quiz

const updateProgress = async (username) => {
    const connection = await connectToDB();
    const [users] = connection.execute(
        
    );
    await connection.end();
    return users;
}