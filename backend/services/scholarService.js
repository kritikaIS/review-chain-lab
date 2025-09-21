const axios = require('axios');
const cheerio = require('cheerio');

class ScholarService {
  constructor() {
    this.baseUrl = 'https://scholar.google.com';
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  }

  async verifyScholarProfile(profileUrl) {
    try {
      // Extract user ID from URL
      const userId = this.extractUserId(profileUrl);
      if (!userId) {
        throw new Error('Invalid Google Scholar profile URL');
      }

      // Fetch profile data
      const profileData = await this.fetchProfileData(userId);
      
      // Verify VIT email
      const isVITVerified = this.checkVITVerification(profileData);
      
      if (!isVITVerified) {
        throw new Error('Profile does not show verified VIT email. Please ensure your Google Scholar profile shows "Verified email at vitstudent.ac.in"');
      }

      return {
        success: true,
        profile: {
          name: profileData.name,
          email: profileData.email,
          institution: profileData.institution,
          verified: true,
          profileUrl: profileUrl,
          citations: profileData.citations,
          hIndex: profileData.hIndex,
          verifiedAt: new Date()
        }
      };
    } catch (error) {
      console.error('Scholar verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  extractUserId(url) {
    const match = url.match(/user=([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  }

  async fetchProfileData(userId) {
    try {
      const response = await axios.get(`${this.baseUrl}/citations?user=${userId}`, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Extract profile information
      const name = this.extractName($);
      const email = this.extractEmail($);
      const institution = this.extractInstitution($);
      const citations = this.extractCitations($);
      const hIndex = this.extractHIndex($);

      return {
        name,
        email,
        institution,
        citations,
        hIndex
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error('Google Scholar profile not found. Please check the URL.');
      }
      throw new Error('Failed to fetch Google Scholar profile. Please try again.');
    }
  }

  extractName($) {
    const nameElement = $('div#gsc_prf_in').first();
    return nameElement.text().trim() || 'Unknown';
  }

  extractEmail($) {
    // Look for verified email in the profile
    const emailText = $('div#gsc_prf_in').text();
    const emailMatch = emailText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    return emailMatch ? emailMatch[1] : null;
  }

  extractInstitution($) {
    const institutionElement = $('div#gsc_prf_in a').first();
    return institutionElement.text().trim() || 'Unknown Institution';
  }

  extractCitations($) {
    const citationsText = $('td.gsc_rsb_std').first().text();
    return parseInt(citationsText.replace(/,/g, '')) || 0;
  }

  extractHIndex($) {
    const hIndexText = $('td.gsc_rsb_std').eq(2).text();
    return parseInt(hIndexText) || 0;
  }

  checkVITVerification(profileData) {
    // Check if the profile shows VIT verification
    const email = profileData.email;
    const institution = profileData.institution;
    
    // Check for VIT email domain
    const hasVITEmail = email && email.includes('@vitstudent.ac.in');
    
    // Check for VIT institution
    const hasVITInstitution = institution && 
      (institution.toLowerCase().includes('vit') || 
       institution.toLowerCase().includes('vellore institute of technology'));
    
    return hasVITEmail || hasVITInstitution;
  }

  // Mock verification for development/testing
  async mockVerifyScholarProfile(profileUrl) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate 80% success rate
    if (Math.random() < 0.8) {
      const mockProfiles = [
        {
          name: "Dr. John Smith",
          email: "john.smith@vitstudent.ac.in",
          institution: "VIT University",
          citations: 1250,
          hIndex: 15
        },
        {
          name: "Dr. Sarah Chen",
          email: "sarah.chen@vitstudent.ac.in",
          institution: "VIT University",
          citations: 890,
          hIndex: 12
        },
        {
          name: "Prof. Michael Rodriguez",
          email: "m.rodriguez@vitstudent.ac.in",
          institution: "VIT University",
          citations: 2100,
          hIndex: 22
        }
      ];
      
      const randomProfile = mockProfiles[Math.floor(Math.random() * mockProfiles.length)];
      
      return {
        success: true,
        profile: {
          ...randomProfile,
          verified: true,
          profileUrl: profileUrl,
          verifiedAt: new Date()
        }
      };
    } else {
      return {
        success: false,
        error: "Profile verification failed. Please ensure your Google Scholar profile is public and shows 'Verified email at vitstudent.ac.in'"
      };
    }
  }
}

module.exports = new ScholarService();
