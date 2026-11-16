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
  /** Where people get the app. */
  apkpure: 'https://apkpure.com/p/com.hautek.serafim',
  version: '1.3.0',
  build: '6',
  packageId: 'com.hautek.serafim',
  author: 'Bright Banda',
  credit: '@HAUTEK | BRIGHTBANDA',
  tagline: 'Connect across every sector.',
  description:
    'Serafim is a free chat and social app: chats with reactions, voice notes and stickers, a feed of posts and Circles, Echos that find people up for a chat, and Draw Together with friends. No ads, no subscription.',
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
