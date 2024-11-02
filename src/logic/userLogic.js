/**
 * This file contains the 
 */
const { connectToDB } = require('../config/dbconnect')

// Testing function to retrieve all user profiles
const getAllUserProfiles = async() => {
    const connection = await connectToDB();
    const [userProfiles] = await connection.query(
        `SELECT Users.user_id, Users.username, Users.email, UserProgress.quiz_id, UserProgress.score
        FROM Users 
        LEFT JOIN UserProgress ON Users.user_id = UserProgress.user_id`
    );
    await connection.end();
    return {userProfiles: userProfiles};
}

// Test route handler

const handleGetAllUserProfiles = async (req, res) => {
    try {
        const userProfiles = await getAllUserProfiles();
        res.json({
            profileData: userProfiles
        })
      } catch (err) {
        res.status(500).json({ message: 'Error retrieving profile', err});
      }
}

// Retrieve the information from a given user in the database
const getUserProfile = async (userId) => {
    const connection = await connectToDB();
    const [users] = await connection.execute(
      'SELECT username, email FROM Users WHERE user_id = ?',
      [userId]
    );
    const [progress] = await connection.execute(
      'SELECT * FROM UserProgress WHERE user_id = ?',
      [userId]
    );
    await connection.end();
    return { user: users[0], progress };
};
  
const updateUserProfile = async (userId, updates) => {
    try{
    const connection = await connectToDB();
    const nonEmptyUpdates = {};
    for (const [k, v] of Object.entries(updates)){
        if (v) {
            nonEmptyUpdates[k] = v; // set up a key value pair if the value is non empty
        }
    }
    // If there's nothing to update, then we stop the DB connection early.
    if (Object.keys(nonEmptyUpdates).length === 0){
        await connection.end();
        return;
    } 
    // Create SQL update string and values array
    const sqlUpdates = [];
    const valueArray = [];

    for (const [field, value] of Object.entries(nonEmptyUpdates)) {
        sqlUpdates.push(`${field} = ?`); // Building the SQL query with the keys
        valueArray.push(value);
    }

    const sqlUpdatesString = sqlUpdates.join(', ');
    // Add userId to values array
    valueArray.push(userId);

    // Construct and execute query
    const updateQuery = `
      UPDATE Users 
      SET ${sqlUpdatesString} 
      WHERE user_id = ?
    `;

    await connection.execute(updateQuery, valueArray);
    await connection.end();
    } catch(err){
        console.log('An error occured while updating the given profile: ', err);
    }
};


// Request logic to retrieve a user's profile information (along with their progress)
const handleGetProfile = async (req, res) => {
  try {
    const { user, progress } = await getUserProfile(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      username: user.username,
      email: user.email,
      progress
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving profile', err});
  }
};
// Request handler to update a user's profile
const handleUpdateProfile = async (req, res) => { 
  try {
    const { username, email } = req.body;
    
    if (!username && !email) {
      return res.status(400).json({ message: 'No update data provided' });
    }

    await updateUserProfile(req.user.id, { username, email });
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', err});
  }
};


module.exports = {
    handleGetProfile,
    handleUpdateProfile,
    handleGetAllUserProfiles // REMOVE LATER, TESTING ONLY
};