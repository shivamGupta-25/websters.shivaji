// Fallback data for sponsors
const sponsorsData = {
  sponsors: [
    { 
      id: "sponsor-1",
      name: "Sponsor1", 
      img: "/assets/webstersLogo.png", 
      website: "https://www.sponsor1.com",
      category: "gold",
      priority: 1
    },
    { 
      id: "sponsor-2", 
      name: "Sponsor2",
      img: "/assets/webstersLogo.png", 
      website: "https://www.sponsor2.com",
      category: "silver",
      priority: 2
    },
    { 
      id: "sponsor-3", 
      name: "Sponsor3",
      img: "/assets/webstersLogo.png", 
      website: null,
      category: "bronze",
      priority: 3
    },
    { 
      id: "sponsor-4", 
      name: "Sponsor4",
      img: "/assets/webstersLogo.png", 
      website: null,
      category: "general",
      priority: 4
    },
  ],
  categories: {
    general: "General",
    gold: "Gold",
    silver: "Silver", 
    bronze: "Bronze"
  },
  uiContent: {
    title: "Event Sponsors",
    subtitle: "Our Incredible Partners",
    description: "We extend our sincere gratitude to our sponsors who make this event possible. Their support enables us to create an exceptional experience for all participants.",
    showSection: false
  }
};

export default sponsorsData; 