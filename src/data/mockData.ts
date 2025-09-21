export interface Paper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  category: string;
  status: "pending" | "under_review" | "reviewed" | "published";
  trustRating: number;
  reviewCount: number;
  submittedAt: string;
  content?: string;
}

export interface Review {
  id: string;
  paperId: string;
  reviewer: string;
  rating: number;
  comment: string;
  submittedAt: string;
  isAnonymous: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  institution?: string;
  department?: string;
  researchArea?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  trustRating: number;
  papersSubmitted: number;
  reviewsCompleted: number;
  walletAddress: string;
  points: number;
  level: string;
  joinedDate: string;
  dailyActivity?: ActivityData[];
  chatRequests?: ChatRequest[];
  sentRequests?: ChatRequest[];
  verificationData?: {
    scholarProfile?: any;
    emailVerified: boolean;
    completedAt: string;
  };
}

export interface ActivityData {
  date: string;
  contributions: number;
}

export interface ChatRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  pointsCost: number;
  message: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  acceptedAt?: string;
}

export const mockPapers: Paper[] = [
  {
    id: "1",
    title: "Quantum Computing Applications in Cryptographic Hash Functions",
    abstract: "This paper explores the potential impact of quantum computing on modern cryptographic systems, specifically focusing on hash functions used in blockchain technologies. We analyze various quantum algorithms and their implications for current security protocols.",
    authors: ["Dr. Sarah Chen", "Prof. Michael Rodriguez"],
    category: "Computer Science",
    status: "under_review",
    trustRating: 4.7,
    reviewCount: 12,
    submittedAt: "2024-01-15",
    content: "Full paper content would be displayed here..."
  },
  {
    id: "2",
    title: "Decentralized Identity Management Systems: A Comprehensive Survey",
    abstract: "We present a comprehensive survey of decentralized identity management systems, examining their architecture, security properties, and real-world implementations. This work provides insights into the future of digital identity verification.",
    authors: ["Dr. Emily Watson", "Dr. James Kim"],
    category: "Blockchain Technology",
    status: "pending",
    trustRating: 4.2,
    reviewCount: 8,
    submittedAt: "2024-01-20",
  },
  {
    id: "3",
    title: "Machine Learning Approaches to Peer Review Quality Assessment",
    abstract: "This study investigates the application of machine learning techniques to automatically assess the quality of peer reviews in academic publishing. We propose novel metrics and validation approaches for improving the review process.",
    authors: ["Prof. Lisa Anderson", "Dr. Robert Taylor"],
    category: "Artificial Intelligence",
    status: "reviewed",
    trustRating: 4.9,
    reviewCount: 15,
    submittedAt: "2024-01-10",
  },
  {
    id: "4",
    title: "Smart Contract Security: Formal Verification Methods",
    abstract: "We propose a formal verification framework for smart contract security analysis. Our approach combines static analysis with dynamic testing to identify potential vulnerabilities before deployment on blockchain networks.",
    authors: ["Dr. Alex Thompson", "Prof. Maria Gonzalez"],
    category: "Blockchain Technology",
    status: "published",
    trustRating: 4.8,
    reviewCount: 20,
    submittedAt: "2024-01-05",
  },
  {
    id: "5",
    title: "Distributed Consensus Mechanisms: Performance Analysis",
    abstract: "This paper provides a comprehensive performance analysis of various distributed consensus mechanisms used in blockchain systems. We compare throughput, latency, and energy consumption across different protocols.",
    authors: ["Dr. Kevin Liu", "Prof. Anna Petrov"],
    category: "Distributed Systems",
    status: "pending",
    trustRating: 4.1,
    reviewCount: 5,
    submittedAt: "2024-01-25",
  },
  {
    id: "6",
    title: "Privacy-Preserving Techniques in Academic Publishing",
    abstract: "We explore privacy-preserving techniques that can be implemented in academic publishing platforms while maintaining transparency and accountability. Our approach balances reviewer anonymity with trust verification.",
    authors: ["Dr. Sophie Martin", "Prof. David Wilson"],
    category: "Privacy & Security",
    status: "under_review",
    trustRating: 4.5,
    reviewCount: 10,
    submittedAt: "2024-01-18",
  }
];

export const mockReviews: Review[] = [
  {
    id: "1",
    paperId: "1",
    reviewer: "Anonymous Reviewer #1",
    rating: 5,
    comment: "Excellent work on quantum cryptography. The analysis is thorough and the implications are well-articulated. Minor suggestions for improving the experimental section.",
    submittedAt: "2024-01-22",
    isAnonymous: true,
  },
  {
    id: "2",
    paperId: "1",
    reviewer: "Dr. Alice Cooper",
    rating: 4,
    comment: "Strong theoretical foundation. The paper would benefit from more practical examples and implementation details. Overall, a valuable contribution to the field.",
    submittedAt: "2024-01-24",
    isAnonymous: false,
  },
  {
    id: "3",
    paperId: "2",
    reviewer: "Anonymous Reviewer #2",
    rating: 4,
    comment: "Comprehensive survey with good coverage of existing systems. Some newer developments in the field could be included. Well-structured and readable.",
    submittedAt: "2024-01-26",
    isAnonymous: true,
  },
];

export const mockUser: User = {
  id: "user1",
  name: "Dr. John Smith",
  email: "john.smith@vitstudent.ac.in",
  institution: "VIT University",
  department: "Computer Science",
  researchArea: "blockchain",
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
  joinedDate: "2024-01-15",
  dailyActivity: generateMockActivityData(),
  chatRequests: [],
  sentRequests: [],
  verificationData: {
    scholarProfile: {
      name: "Dr. John Smith",
      email: "john.smith@vitstudent.ac.in",
      institution: "VIT University",
      verified: true,
      profileUrl: "https://scholar.google.com/citations?user=johnsmith123",
      citations: 1250,
      hIndex: 15
    },
    emailVerified: true,
    completedAt: "2024-01-20T10:30:00Z"
  }
};

// Generate mock activity data for the past year
function generateMockActivityData(): ActivityData[] {
  const activity = [];
  const today = new Date();
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic activity patterns
    let contributions = 0;
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    if (!isWeekend) {
      // Higher activity on weekdays
      contributions = Math.random() < 0.7 ? Math.floor(Math.random() * 8) + 1 : 0;
    } else {
      // Lower activity on weekends
      contributions = Math.random() < 0.3 ? Math.floor(Math.random() * 4) + 1 : 0;
    }
    
    activity.push({
      date: date.toISOString().split('T')[0],
      contributions
    });
  }
  
  return activity;
}

// Mock other users for interaction features
export const mockUsers: User[] = [
  {
    id: "user2",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@vitstudent.ac.in",
    institution: "VIT University",
    department: "Computer Science",
    researchArea: "artificial-intelligence",
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
    joinedDate: "2023-11-20",
    dailyActivity: generateMockActivityData(),
    chatRequests: [],
    sentRequests: [],
    verificationData: {
      scholarProfile: {
        name: "Dr. Sarah Chen",
        email: "sarah.chen@vitstudent.ac.in",
        institution: "VIT University",
        verified: true,
        profileUrl: "https://scholar.google.com/citations?user=sarahchen456",
        citations: 890,
        hIndex: 12
      },
      emailVerified: true,
      completedAt: "2023-11-25T14:20:00Z"
    }
  },
  {
    id: "user3",
    name: "Prof. Michael Rodriguez",
    email: "m.rodriguez@vitstudent.ac.in",
    institution: "VIT University",
    department: "Electrical Engineering",
    researchArea: "cryptography",
    bio: "Cryptography expert with focus on post-quantum security and blockchain applications.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/michaelrodriguez",
      website: "https://mrodriguez.vit.edu"
    },
    trustRating: 4.9,
    papersSubmitted: 15,
    reviewsCompleted: 42,
    walletAddress: "0x9876543210fedcba9876543210fedcba98765432",
    points: 3200,
    level: "Platinum Tier",
    joinedDate: "2023-08-10",
    dailyActivity: generateMockActivityData(),
    chatRequests: [],
    sentRequests: [],
    verificationData: {
      scholarProfile: {
        name: "Prof. Michael Rodriguez",
        email: "m.rodriguez@vitstudent.ac.in",
        institution: "VIT University",
        verified: true,
        profileUrl: "https://scholar.google.com/citations?user=mrodriguez789",
        citations: 2100,
        hIndex: 22
      },
      emailVerified: true,
      completedAt: "2023-08-15T09:45:00Z"
    }
  }
];