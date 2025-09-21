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
  trustRating: number;
  papersSubmitted: number;
  reviewsCompleted: number;
  walletAddress: string;
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
  email: "john.smith@university.edu",
  trustRating: 4.6,
  papersSubmitted: 8,
  reviewsCompleted: 24,
  walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
};