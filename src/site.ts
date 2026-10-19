/**
 * Facts about the app, taken from the Flutter project
 * (pubspec.yaml, lib/src/core/config/app_config.dart, docs/).
 */
export const site = {
  name: 'Serafim',
  domain: 'serafim.app',
  url: 'https://serafim.app',
  repo: 'https://github.com/BrightBanda/serafim',
  releases: 'https://github.com/BrightBanda/serafim/releases/latest',
  version: '1.0.2',
  build: '3',
  packageId: 'com.binaryforge.serafim',
  author: 'Binary Forge',
  tagline: 'Connect across every sector.',
  description:
    'Serafim is a free real-time messaging app with group chats, voice notes, stickers, link previews, and a Discover tab that finds people through shared interests. Your photos and voice notes never leave your phone.',
} as const;

/**
 * The interest catalog shipped in the app
 * (lib/src/data/interest_catalog.dart) — 9 categories, 89 interests.
 */
export const interestCategories: { name: string; items: string[] }[] = [
  {
    name: 'Sports',
    items: [
      'Soccer',
      'Basketball',
      'Running',
      'Cycling',
      'Swimming',
      'Tennis',
      'Volleyball',
      'Netball',
      'Boxing',
      'Gym & fitness',
      'Yoga',
      'Martial arts',
    ],
  },
  {
    name: 'Hobbies',
    items: [
      'Gaming',
      'Cooking',
      'Photography',
      'Reading',
      'Stargazing',
      'Gardening',
      'Writing',
      'Drawing',
      'Painting',
      'Knitting',
      'Collecting',
      'Board games',
    ],
  },
  {
    name: 'Entertainment',
    items: [
      'Movies',
      'Music',
      'Anime',
      'Podcasts',
      'Comics',
      'TV series',
      'Stand-up comedy',
      'K-drama',
      'Theatre',
      'Concerts',
    ],
  },
  {
    name: 'Music',
    items: [
      'Hip-hop',
      'Afrobeats',
      'Gospel',
      'Rock',
      'Jazz',
      'Classical',
      'Pop',
      'R&B',
      'Electronic',
      'Reggae',
      'Playing an instrument',
      'Singing',
    ],
  },
  {
    name: 'Tech',
    items: [
      'Programming',
      'Mobile apps',
      'Web design',
      'AI & machine learning',
      'Cybersecurity',
      'Robotics',
      'Electronics',
      'Open source',
      'Startups',
      '3D printing',
    ],
  },
  {
    name: 'Creative',
    items: [
      'Graphic design',
      'Fashion',
      'Film-making',
      'Animation',
      'Music production',
      'Poetry',
      'Crafts',
      'Interior design',
    ],
  },
  {
    name: 'Outdoors',
    items: [
      'Hiking',
      'Camping',
      'Fishing',
      'Travel',
      'Road trips',
      'Birdwatching',
      'Wildlife',
      'Beach days',
    ],
  },
  {
    name: 'Food & drink',
    items: [
      'Baking',
      'Street food',
      'Coffee',
      'Tea',
      'Vegan cooking',
      'Barbecue',
      'Trying new restaurants',
    ],
  },
  {
    name: 'Learning & life',
    items: [
      'Languages',
      'History',
      'Science',
      'Mathematics',
      'Philosophy',
      'Personal finance',
      'Entrepreneurship',
      'Volunteering',
      'Meditation',
      'Self-improvement',
    ],
  },
];

export const interestCount = interestCategories.reduce(
  (n, c) => n + c.items.length,
  0,
);
