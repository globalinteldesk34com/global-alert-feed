export interface GeopoliticalEvent {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  region: string;
  country: string;
  coordinates: [number, number]; // [lat, lng]
  timestamp: string;
  source: string;
  category: string;
  tags: string[];
}

export const sampleEvents: GeopoliticalEvent[] = [
  {
    id: '1',
    title: 'Military buildup reported near Ukraine border',
    description: 'Satellite imagery shows significant movement of Russian troops and equipment near the Ukrainian border, raising international concerns.',
    severity: 'critical',
    region: 'Europe',
    country: 'Russia',
    coordinates: [50.4501, 30.5234],
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    source: 'CNN',
    category: 'military',
    tags: ['ukraine', 'russia', 'military']
  },
  {
    id: '2',
    title: 'Protests erupt in Tehran after economic sanctions',
    description: 'Thousands gathered in central Tehran protesting rising food prices and economic hardship following new international sanctions.',
    severity: 'high',
    region: 'Middle East',
    country: 'Iran',
    coordinates: [35.6892, 51.3890],
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    source: 'Reuters',
    category: 'civil-unrest',
    tags: ['iran', 'protest', 'economy']
  },
  {
    id: '3',
    title: 'Naval exercises in South China Sea',
    description: 'Joint military exercises between China and Russia in disputed waters, increasing regional tensions.',
    severity: 'high',
    region: 'Asia Pacific',
    country: 'China',
    coordinates: [16.0, 112.0],
    timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    source: 'BBC',
    category: 'military',
    tags: ['china', 'russia', 'naval', 'south-china-sea']
  },
  {
    id: '4',
    title: 'Diplomatic talks scheduled in Geneva',
    description: 'High-level diplomatic meetings between major powers to discuss ongoing tensions in Eastern Europe.',
    severity: 'medium',
    region: 'Europe',
    country: 'Switzerland',
    coordinates: [46.2044, 6.1432],
    timestamp: new Date(Date.now() - 67 * 60 * 1000).toISOString(),
    source: 'AP News',
    category: 'diplomatic',
    tags: ['diplomacy', 'geneva', 'negotiations']
  },
  {
    id: '5',
    title: 'Cyber attacks on government infrastructure',
    description: 'Coordinated cyber attacks targeting critical infrastructure in multiple European nations attributed to state actors.',
    severity: 'critical',
    region: 'Europe',
    country: 'Germany',
    coordinates: [52.5200, 13.4050],
    timestamp: new Date(Date.now() - 33 * 60 * 1000).toISOString(),
    source: 'Cyber Security News',
    category: 'cyber',
    tags: ['cyber-attack', 'infrastructure', 'germany']
  },
  {
    id: '6',
    title: 'Economic summit in Singapore',
    description: 'ASEAN leaders meet to discuss regional economic cooperation and trade agreements.',
    severity: 'low',
    region: 'Asia Pacific',
    country: 'Singapore',
    coordinates: [1.3521, 103.8198],
    timestamp: new Date(Date.now() - 89 * 60 * 1000).toISOString(),
    source: 'Financial Times',
    category: 'economic',
    tags: ['asean', 'trade', 'singapore']
  },
  {
    id: '7',
    title: 'Border tensions escalate in Kashmir',
    description: 'Increased military presence and skirmishes reported along the Line of Control between India and Pakistan.',
    severity: 'high',
    region: 'Asia',
    country: 'India',
    coordinates: [34.0837, 74.7973],
    timestamp: new Date(Date.now() - 156 * 60 * 1000).toISOString(),
    source: 'Al Jazeera',
    category: 'territorial',
    tags: ['india', 'pakistan', 'kashmir', 'border']
  },
  {
    id: '8',
    title: 'Climate summit preparations in Morocco',
    description: 'International delegates arrive in Marrakech for upcoming climate change negotiations.',
    severity: 'low',
    region: 'Africa',
    country: 'Morocco',
    coordinates: [31.6295, -7.9811],
    timestamp: new Date(Date.now() - 134 * 60 * 1000).toISOString(),
    source: 'UN News',
    category: 'environmental',
    tags: ['climate', 'morocco', 'negotiations']
  }
];

export const regions = ['All Regions', 'Europe', 'Asia Pacific', 'Middle East', 'Africa', 'Americas'];
export const severityLevels = ['critical', 'high', 'medium', 'low'] as const;
export const timeRanges = ['Last 24 hours', 'Last 7 days', 'Last 30 days', 'All time'];