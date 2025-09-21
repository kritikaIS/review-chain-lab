// Database Setup Script
// Run this to test MongoDB connection and create sample data

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./backend/models/User');
const OTP = require('./backend/models/OTP');

async function setupDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/peerchain', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
    // Test data creation
    console.log('🧪 Creating test data...');
    
    // Create a test user
    const testUser = new User({
      name: "Dr. Test User",
      email: "test.user@vitstudent.ac.in",
      password: "testpassword123",
      institution: "VIT University",
      department: "Computer Science",
      researchArea: "blockchain",
      bio: "Test user for PeerChain platform",
      socialLinks: {
        linkedin: "https://linkedin.com/in/testuser",
        github: "https://github.com/testuser"
      },
      verificationData: {
        emailVerified: true,
        scholarProfile: {
          name: "Dr. Test User",
          email: "test.user@vitstudent.ac.in",
          institution: "VIT University",
          verified: true,
          profileUrl: "https://scholar.google.com/citations?user=test123",
          citations: 100,
          hIndex: 5,
          verifiedAt: new Date()
        },
        completedAt: new Date()
      }
    });
    
    await testUser.save();
    console.log('✅ Test user created successfully!');
    
    // Create a test OTP
    const testOTP = new OTP({
      email: "test.user@vitstudent.ac.in",
      otp: "123456",
      type: "email_verification"
    });
    
    await testOTP.save();
    console.log('✅ Test OTP created successfully!');
    
    // Show collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Show user count
    const userCount = await User.countDocuments();
    const otpCount = await OTP.countDocuments();
    
    console.log(`👥 Total users: ${userCount}`);
    console.log(`📧 Total OTPs: ${otpCount}`);
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your MONGODB_URI in .env file');
    console.log('2. Ensure MongoDB is running (local) or Atlas is accessible');
    console.log('3. Verify your connection string format');
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run setup
setupDatabase();
