import mongoose from 'mongoose';

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/draggable-table');
    console.log('MongoDB connected');
    
    // Get count of ideas
    const count = await mongoose.connection.db.collection('ideas').countDocuments();
    console.log(`Total ideas in database: ${count}`);
    
    // Get a sample of ideas to verify
    const ideas = await mongoose.connection.db.collection('ideas').find({}).limit(5).toArray();
    console.log('\nSample of ideas:');
    ideas.forEach(idea => {
      console.log(`- ${idea.title} (${idea.businessFunction || 'No business function'})`);
    });
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabase();
