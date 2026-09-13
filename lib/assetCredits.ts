export type AssetCredit = {
  name: string;
  author: string;
  license: string;
  url: string;
  usedFor: string;
};

export const ASSET_CREDITS: AssetCredit[] = [
  {
    name: "Car Kit",
    author: "Kenney",
    license: "CC0 1.0",
    url: "https://kenney.nl/assets/car-kit",
    usedFor: "Player car (hatchback-sports) and obstacle vehicles (taxi, truck, delivery, cone)",
  },
  {
    name: "Casino Audio",
    author: "Kenney",
    license: "CC0 1.0",
    url: "https://opengameart.org/content/54-casino-sound-effects-cards-dice-chips",
    usedFor: "Coin pickup sound",
  },
  {
    name: "Impact Sounds",
    author: "Kenney",
    license: "CC0 1.0",
    url: "https://kenney.nl/assets/impact-sounds",
    usedFor: "Crash sound",
  },
  {
    name: "Cool Highway",
    author: "MintoDog",
    license: "CC0",
    url: "https://opengameart.org/content/cool-highway",
    usedFor: "Background music loop",
  },
];

export const PROCEDURAL_CREDITS = [
  "Road, grass, lane markings, sky, stars, and roadside scenery are built in-game with procedural geometry and shaders.",
];
