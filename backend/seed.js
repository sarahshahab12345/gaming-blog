// seed.js — Seed the database with initial data
// Run with: node seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Category = require("./models/Category");
const Post = require("./models/Post");

const categories = [
  { name: "Action", slug: "action", description: "Fast-paced action games", icon: "⚔️", color: "#ef4444" },
  { name: "Racing", slug: "racing", description: "Speed & racing games", icon: "🏎️", color: "#f97316" },
  { name: "Mobile Games", slug: "mobile-games", description: "Best mobile gaming", icon: "📱", color: "#8b5cf6" },
  { name: "RPG", slug: "rpg", description: "Role-playing adventures", icon: "🧙", color: "#10b981" },
  { name: "Strategy", slug: "strategy", description: "Think before you act", icon: "♟️", color: "#3b82f6" },
  { name: "Sports", slug: "sports", description: "Sports & simulation", icon: "⚽", color: "#f59e0b" },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // Clean existing data
  await Promise.all([User.deleteMany(), Category.deleteMany(), Post.deleteMany()]);
  console.log("Cleared existing data");

  // Create admin user
  const admin = await User.create({
    username: "admin",
    email: process.env.ADMIN_EMAIL || "admin@gamingblog.com",
    password: process.env.ADMIN_PASSWORD || "Admin@123456",
    role: "admin",
  });
  console.log(`Admin created: ${admin.email}`);

  // Create categories
  const cats = await Category.insertMany(categories);
  console.log(`${cats.length} categories created`);

  // Create sample posts
  const posts = [
    {
      title: "Top 10 Action Games of 2024 You Must Play",
      content: `<p>The gaming world in 2024 has been nothing short of spectacular. From breathtaking open worlds to tight, responsive combat systems, action games this year have raised the bar to extraordinary heights.</p><h2>1. Shadow's Edge</h2><p>Shadow's Edge redefines what an action game can be. With its fluid parkour system and visceral combat, every encounter feels unique and earned. The story weaves themes of redemption through 30+ hours of content.</p><h2>2. Neon Blitz</h2><p>A cyberpunk fever dream that combines bullet-hell mechanics with melee combat in ways that should feel chaotic but somehow feel perfectly orchestrated. Neon Blitz is a love letter to arcade classics.</p><p>Whether you prefer the methodical approach of stealth-action or the adrenaline rush of full-frontal combat, 2024 has something for every type of action fan.</p>`,
      excerpt: "2024 has been a massive year for action games. Here are the top 10 titles you absolutely cannot miss.",
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800",
      tags: ["action", "2024", "top-10", "must-play"],
    },
    {
      title: "Need for Speed vs Forza: Which Racing Game Wins in 2024?",
      content: `<p>The eternal debate among racing game fans continues: Need for Speed or Forza? Both franchises have dropped major titles this year, and we've spent hundreds of hours with both to give you the definitive verdict.</p><h2>Graphics & Immersion</h2><p>Forza Motorsport 2024 is an absolute visual powerhouse. The car models are photorealistic, and the tracks feel alive with dynamic weather and lighting. NFS doesn't quite match it technically but more than compensates with its neon-soaked urban environments.</p><h2>Car Selection & Customization</h2><p>Need for Speed wins here handily with its deep customization system. You can tune everything from the turbo whistle to the color of your brake calipers. Forza offers a broader car roster (500+) but customization feels more restrained.</p><h2>Verdict</h2><p>Choose Forza for a realistic simulation experience. Choose NFS if you want style, story, and an arcade thrill.</p>`,
      excerpt: "We put Need for Speed and Forza head-to-head in an epic showdown. Find out which racing game deserves your money.",
      image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800",
      tags: ["racing", "forza", "need-for-speed", "comparison"],
    },
    {
      title: "5 Mobile Games That Are Actually Worth Your Time",
      content: `<p>Mobile gaming has a reputation problem. For every gem, there are a thousand cash-grab clones. But 2024 has genuinely surprised us with the quality of games hitting phones and tablets.</p><h2>1. Pocket Realms</h2><p>A fully offline RPG with a 40-hour story, no ads, and no microtransactions. Pocket Realms feels like a full console RPG shrunk down to your pocket.</p><h2>2. Grid Runner</h2><p>An endless runner that evolves. The longer you play, the more the game mechanics change and layer. It's genuinely fascinating how the developers structured this.</p><h2>3. Battle Tactics</h2><p>Turn-based strategy that respects your time. Matches take 5-10 minutes, the meta is deep, and the community is active and friendly.</p>`,
      excerpt: "Cut through the noise — these 5 mobile games are genuinely great experiences that respect your time and wallet.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
      tags: ["mobile", "iOS", "android", "top-5"],
    },
  ];

  const categoryMap = {};
  cats.forEach((c) => (categoryMap[c.name] = c._id));
  const catKeys = ["Action", "Racing", "Mobile Games"];

  for (let i = 0; i < posts.length; i++) {
    await Post.create({ ...posts[i], category: categoryMap[catKeys[i]], author: admin._id });
  }

  console.log(`${posts.length} sample posts created`);
  console.log("\n✅ Seed complete!");
  console.log(`   Admin email:    ${admin.email}`);
  console.log(`   Admin password: ${process.env.ADMIN_PASSWORD || "Admin@123456"}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
