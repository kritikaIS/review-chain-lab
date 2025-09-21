const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Paper = require('./models/Paper');
const Review = require('./models/Review');
const Leaderboard = require('./models/Leaderboard');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/peerchain');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Mock data
const mockUsers = [
  {
    name: "Dr. John Smith",
    email: "john.smith@vitstudent.ac.in",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    institution: "VIT University",
    department: "Computer Science",
    researchArea: "Blockchain",
    bio: "Researcher focused on blockchain technology and distributed systems. Passionate about improving academic peer review processes through technology.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/johnsmith",
      github: "https://github.com/johnsmith",
      website: "https://johnsmith.vit.edu"
    },
    trustRating: 4.6,
    papersSubmitted: 8,
    reviewsCompleted: 24,
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    points: 1850,
    level: "Silver Tier",
    joinedDate: new Date("2024-01-15"),
    dailyActivity: [
      { date: '2025-09-21', contributions: 3, reviewsCompleted: 2, papersSubmitted: 1, pointsEarned: 50 },
      { date: '2025-09-20', contributions: 2, reviewsCompleted: 1, papersSubmitted: 0, pointsEarned: 25 },
      { date: '2025-09-19', contributions: 4, reviewsCompleted: 3, papersSubmitted: 1, pointsEarned: 75 },
      { date: '2025-09-18', contributions: 1, reviewsCompleted: 1, papersSubmitted: 0, pointsEarned: 15 },
      { date: '2025-09-17', contributions: 2, reviewsCompleted: 1, papersSubmitted: 0, pointsEarned: 20 }
    ],
    monthlyStats: {
      currentMonth: {
        reviewsCompleted: 8,
        papersSubmitted: 2,
        pointsEarned: 180,
        averageRating: 4.5
      },
      lastMonth: {
        reviewsCompleted: 12,
        papersSubmitted: 1,
        pointsEarned: 240,
        averageRating: 4.7
      }
    },
    githubActivity: {
      isActive: true,
      contributions: [
        { date: '2025-09-21', count: 3, color: 'green' },
        { date: '2025-09-20', count: 2, color: 'green' },
        { date: '2025-09-19', count: 4, color: 'green' }
      ],
      lastUpdated: new Date()
    },
    verificationData: {
      emailVerified: true,
      completedAt: new Date("2024-01-15")
    }
  },
  {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@vitstudent.ac.in",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    institution: "VIT University",
    department: "Computer Science",
    researchArea: "Artificial Intelligence",
    bio: "AI researcher specializing in machine learning applications in healthcare.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahchen",
      github: "https://github.com/sarahchen"
    },
    trustRating: 4.8,
    papersSubmitted: 12,
    reviewsCompleted: 35,
    walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    points: 2450,
    level: "Gold Tier",
    joinedDate: new Date("2023-11-20"),
    dailyActivity: [
      { date: '2025-09-21', contributions: 5, reviewsCompleted: 3, papersSubmitted: 1, pointsEarned: 75 },
      { date: '2025-09-20', contributions: 3, reviewsCompleted: 2, papersSubmitted: 0, pointsEarned: 45 },
      { date: '2025-09-19', contributions: 2, reviewsCompleted: 1, papersSubmitted: 0, pointsEarned: 25 }
    ],
    monthlyStats: {
      currentMonth: {
        reviewsCompleted: 15,
        papersSubmitted: 3,
        pointsEarned: 300,
        averageRating: 4.8
      },
      lastMonth: {
        reviewsCompleted: 18,
        papersSubmitted: 2,
        pointsEarned: 360,
        averageRating: 4.9
      }
    },
    verificationData: {
      emailVerified: true,
      completedAt: new Date("2023-11-20")
    }
  },
  {
    name: "Dr. Michael Johnson",
    email: "michael.johnson@vitstudent.ac.in",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    institution: "VIT University",
    department: "Data Science",
    researchArea: "Machine Learning",
    bio: "Data scientist with expertise in deep learning and neural networks.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/michaeljohnson",
      github: "https://github.com/michaeljohnson"
    },
    trustRating: 4.3,
    papersSubmitted: 6,
    reviewsCompleted: 18,
    walletAddress: "0x9876543210fedcba9876543210fedcba98765432",
    points: 1200,
    level: "Bronze Tier",
    joinedDate: new Date("2024-03-10"),
    dailyActivity: [
      { date: '2025-09-21', contributions: 2, reviewsCompleted: 1, papersSubmitted: 0, pointsEarned: 20 },
      { date: '2025-09-20', contributions: 1, reviewsCompleted: 1, papersSubmitted: 0, pointsEarned: 15 }
    ],
    monthlyStats: {
      currentMonth: {
        reviewsCompleted: 6,
        papersSubmitted: 1,
        pointsEarned: 120,
        averageRating: 4.2
      },
      lastMonth: {
        reviewsCompleted: 8,
        papersSubmitted: 2,
        pointsEarned: 160,
        averageRating: 4.4
      }
    },
    verificationData: {
      emailVerified: true,
      completedAt: new Date("2024-03-10")
    }
  }
];

const mockPapers = [
  {
    title: "Blockchain-Based Peer Review System for Academic Papers",
    abstract: "This paper presents a novel blockchain-based system for academic peer review that ensures transparency, immutability, and fairness in the review process. The system uses smart contracts to manage the review workflow and provides incentives for reviewers through a token-based reward system.",
    authors: [
      { name: "Dr. John Smith", email: "john.smith@vitstudent.ac.in", affiliation: "VIT University" },
      { name: "Dr. Sarah Chen", email: "sarah.chen@vitstudent.ac.in", affiliation: "VIT University" }
    ],
    keywords: ["blockchain", "peer review", "academic publishing", "smart contracts"],
    category: "Computer Science",
    doi: "10.1000/182",
    pdfUrl: "https://example.com/paper1.pdf",
    status: "under_review",
    averageRating: 4.2,
    totalReviews: 3
  },
  {
    title: "Machine Learning Approaches for Healthcare Data Analysis",
    abstract: "This research explores various machine learning techniques for analyzing healthcare data, including patient records, medical images, and treatment outcomes. We propose a novel deep learning architecture that achieves state-of-the-art performance on several healthcare datasets.",
    authors: [
      { name: "Dr. Sarah Chen", email: "sarah.chen@vitstudent.ac.in", affiliation: "VIT University" }
    ],
    keywords: ["machine learning", "healthcare", "deep learning", "medical data"],
    category: "Computer Science",
    doi: "10.1000/183",
    pdfUrl: "https://example.com/paper2.pdf",
    status: "accepted",
    averageRating: 4.7,
    totalReviews: 5
  },
  {
    title: "Distributed Systems for Large-Scale Data Processing",
    abstract: "This paper presents a comprehensive study of distributed systems architectures for processing large-scale datasets. We analyze various frameworks and propose optimizations for improving performance and scalability in distributed computing environments.",
    authors: [
      { name: "Dr. Michael Johnson", email: "michael.johnson@vitstudent.ac.in", affiliation: "VIT University" }
    ],
    keywords: ["distributed systems", "big data", "scalability", "performance"],
    category: "Computer Science",
    doi: "10.1000/184",
    pdfUrl: "https://example.com/paper3.pdf",
    status: "published",
    averageRating: 4.5,
    totalReviews: 4
  },
  {
    title: "Quantum Computing Applications in Cryptography",
    abstract: "This research explores the potential applications of quantum computing in cryptographic systems. We analyze quantum algorithms and their implications for current cryptographic protocols, proposing new quantum-resistant encryption methods.",
    authors: [
      { name: "Dr. John Smith", email: "john.smith@vitstudent.ac.in", affiliation: "VIT University" }
    ],
    keywords: ["quantum computing", "cryptography", "encryption", "security"],
    category: "Computer Science",
    doi: "10.1000/185",
    pdfUrl: "https://example.com/paper4.pdf",
    status: "under_review",
    averageRating: 4.0,
    totalReviews: 2
  },
  {
    title: "Natural Language Processing for Academic Text Analysis",
    abstract: "This paper presents novel approaches to natural language processing for analyzing academic texts. We develop models for automatic summarization, keyword extraction, and citation analysis in scholarly documents.",
    authors: [
      { name: "Dr. Sarah Chen", email: "sarah.chen@vitstudent.ac.in", affiliation: "VIT University" },
      { name: "Dr. Michael Johnson", email: "michael.johnson@vitstudent.ac.in", affiliation: "VIT University" }
    ],
    keywords: ["natural language processing", "text analysis", "academic papers", "summarization"],
    category: "Computer Science",
    doi: "10.1000/186",
    pdfUrl: "https://example.com/paper5.pdf",
    status: "accepted",
    averageRating: 4.6,
    totalReviews: 6
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Paper.deleteMany({});
    await Review.deleteMany({});
    await Leaderboard.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const users = await User.insertMany(mockUsers);
    console.log(`👥 Created ${users.length} users`);

    // Create papers with user references
    const papersWithUsers = mockPapers.map((paper, index) => ({
      ...paper,
      submittedBy: users[index % users.length]._id,
      submissionDate: new Date(Date.now() - (index * 7 * 24 * 60 * 60 * 1000)) // Spread over weeks
    }));

    const papers = await Paper.insertMany(papersWithUsers);
    console.log(`📄 Created ${papers.length} papers`);

    // Create reviews
    const mockReviews = [
      {
        paper: papers[0]._id,
        reviewer: users[1]._id,
        rating: 4,
        comment: "This is a well-researched paper with innovative ideas. The blockchain approach to peer review is novel and well-executed.",
        detailedFeedback: "The methodology is sound and the results are promising. However, I would like to see more discussion on scalability issues.",
        strengths: ["Innovative approach", "Clear methodology", "Good experimental design"],
        weaknesses: ["Limited scalability discussion", "Small sample size"],
        suggestions: ["Include more scalability analysis", "Expand the experimental evaluation"],
        isAnonymous: false,
        status: "submitted",
        isSaved: false,
        isAccepted: true,
        pointsAwarded: 15
      },
      {
        paper: papers[0]._id,
        reviewer: users[2]._id,
        rating: 5,
        comment: "Excellent work! This paper presents a groundbreaking approach to academic peer review using blockchain technology.",
        detailedFeedback: "The authors have done an outstanding job in designing and implementing the system. The results are impressive and the implications are significant.",
        strengths: ["Groundbreaking research", "Excellent implementation", "Clear presentation"],
        weaknesses: ["Could benefit from more real-world testing"],
        suggestions: ["Conduct more extensive real-world trials"],
        isAnonymous: false,
        status: "submitted",
        isSaved: false,
        isAccepted: true,
        pointsAwarded: 15
      },
      {
        paper: papers[1]._id,
        reviewer: users[0]._id,
        rating: 4,
        comment: "Good research on ML applications in healthcare. The proposed architecture shows promise.",
        detailedFeedback: "The deep learning architecture is well-designed and the experimental results are convincing. The healthcare focus is timely and important.",
        strengths: ["Relevant topic", "Good experimental design", "Clear results"],
        weaknesses: ["Limited comparison with existing methods"],
        suggestions: ["Add more comparative analysis"],
        isAnonymous: false,
        status: "submitted",
        isSaved: false,
        isAccepted: true,
        pointsAwarded: 15
      }
    ];

    const reviews = await Review.insertMany(mockReviews);
    console.log(`📝 Created ${reviews.length} reviews`);

    // Update papers with review references
    for (let i = 0; i < papers.length; i++) {
      const paperReviews = reviews.filter(review => review.paper.toString() === papers[i]._id.toString());
      await Paper.findByIdAndUpdate(papers[i]._id, {
        reviews: paperReviews.map(r => r._id),
        totalReviews: paperReviews.length,
        averageRating: paperReviews.length > 0 ? 
          paperReviews.reduce((sum, r) => sum + r.rating, 0) / paperReviews.length : 0
      });
    }

    // Create leaderboard
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const leaderboardData = {
      month: currentMonth,
      year: currentYear,
      rankings: users.map((user, index) => ({
        user: user._id,
        rank: index + 1,
        totalPoints: user.points,
        reviewsCompleted: user.reviewsCompleted,
        papersSubmitted: user.papersSubmitted,
        averageRating: user.trustRating,
        bonusPoints: index === 0 ? 100 : 0 // Top performer gets bonus
      })),
      topPerformer: {
        user: users[0]._id,
        bonusPointsAwarded: 100
      }
    };

    const leaderboard = await Leaderboard.create(leaderboardData);
    console.log(`🏆 Created leaderboard for ${currentMonth}/${currentYear}`);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Papers: ${papers.length}`);
    console.log(`- Reviews: ${reviews.length}`);
    console.log(`- Leaderboard: 1 (current month)`);
    console.log('\n🔑 Test credentials:');
    console.log('- john.smith@vitstudent.ac.in / password');
    console.log('- sarah.chen@vitstudent.ac.in / password');
    console.log('- michael.johnson@vitstudent.ac.in / password');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeding
connectDB().then(() => {
  seedDatabase();
});
