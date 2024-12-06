/**
 * This file contains the logic for creating users, updating user info, and retrieving a user's information
 */
const { connectToDB } = require('../config/dbconnect')

// Testing function to retrieve all user profiles
const getAllUserProfiles = async() => {
    const connection = await connectToDB();
    const [userProfiles] = await connection.execute(
        `SELECT Users.user_id, Users.username, Users.email, UserProgress.quiz_id, UserProgress.score
        FROM Users 
        LEFT JOIN UserProgress ON Users.user_id = UserProgress.user_id`
    );
    await connection.end();
    return {userProfiles: userProfiles};
}

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
    try {
      const [users] = await connection.execute(
        'SELECT username, email, user_role FROM Users WHERE user_id = ?',
        [userId]
      );
      
      const [progress] = await connection.execute(
        'SELECT * FROM UserProgress WHERE user_id = ?',
        [userId]
      );
  
      return { user: users[0], progress };
    } finally {
      await connection.end();
    }
  };

  
const updateUserProfile = async (userId, updates) => {
  try {
      const connection = await connectToDB();
      const nonEmptyUpdates = {};
      for (const [k, v] of Object.entries(updates)) {
          if (v) {
              nonEmptyUpdates[k] = v;
          }
      }

      if (Object.keys(nonEmptyUpdates).length === 0) {
          await connection.end();
          return;
      }

      const sqlUpdates = [];
      const valueArray = [];
      for (const [field, value] of Object.entries(nonEmptyUpdates)) {
          sqlUpdates.push(`${field} = ?`);
          valueArray.push(value);
      }
      const sqlUpdatesString = sqlUpdates.join(', ');
      valueArray.push(userId);

      const updateQuery = `
          UPDATE Users
          SET ${sqlUpdatesString}
          WHERE user_id = ?
      `;
      await connection.execute(updateQuery, valueArray);
      await connection.end();
  } catch (err) {
      console.log('An error occurred while updating the given profile: ', err);
      throw err; // Propagate error to handler
  }
};


// Request logic to retrieve a user's profile information (along with their progress)
const handleGetProfile = async (req, res) => {
  try {
      
      const userId = req.user.user_id; 
      const { user, progress } = await getUserProfile(userId);
      
      if (!user) {
	  console.log('No user found for user_id:', userId)    
          return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({
          user_id: userId,
          username: user.username,
          email: user.email,
          role: user.user_role,
	  progress
      });
  } catch (err) {
      console.log("Profile retrieval error:", err);
      res.status(500).json({ message: 'Error retrieving profile', error: err.message });
  }
};
// Request handler to update a user's profile
const handleUpdateProfile = async (req, res) => {
  try {
      const { username, email, user_role } = req.body;
      const userId = req.user.user_id; 
      
      if (!username && !email) {
          return res.status(400).json({ message: 'No update data provided' });
      }

      await updateUserProfile(userId, { username, email, user_role });
      res.json({ message: 'Profile updated successfully' });
  } catch (err) {
      res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};


module.exports = {
    handleGetAllUserProfiles,
    handleGetProfile,
    handleUpdateProfile
};
