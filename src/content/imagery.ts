/**
 * Image registry — the single source of truth for every photograph.
 *
 * PROVENANCE: these frames were generated to art direction and reviewed
 * individually, because HK United's own fleet photography was not available
 * at build time. They depict REPRESENTATIVE equipment and site conditions,
 * not specific HK United vehicles, sites or contracts.
 *
 * TO SWAP IN REAL PHOTOGRAPHY:
 *   1. Drop the file into `public/images/` keeping the same basename.
 *   2. Update `width` / `height` to the true intrinsic dimensions.
 *   3. Regenerate `blurDataURL` from the new pixels — a stale blur that
 *      resolves into a different image is worse than no placeholder.
 * No component reads a path directly; everything goes through this file.
 */

export interface ImageAsset {
  src: string;
  width: number;
  height: number;
  /** Meaningful alt text — these images carry information, not decoration. */
  alt: string;
  blurDataURL: string;
}

const asset = (
  src: string,
  width: number,
  height: number,
  alt: string,
  blurDataURL: string,
): ImageAsset => ({ src: `/images/${src}.webp`, width, height, alt, blurDataURL });

export const IMAGES = {
  /* ---- Hero & full-bleed statements ---------------------------------- */
  heroConvoy: asset(
    "hero-convoy-r3",
    1536,
    652,
    "A convoy of heavy dump trucks travelling a wide Ontario highway through mist at dawn.",
    "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAQCdASoQAAcAAsBMJZQCdADx+bvwAPjitoW7buC1wb+0tFS48Xunh/15wBioFMs9tMavXKqp8XgnklLf+BawiQlZ7hJDnAAAAA==",
  ),
  highwayAerial: asset(
    "highway-aerial-r3",
    1536,
    652,
    "Aerial view looking down on a divided highway cutting across Ontario farmland with heavy trucks spaced along it.",
    "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADwAQCdASoQAAcAAsBMJZACdAELX7lpYAAA/unhjiKsa02dfMPgsb2OuPRTIa577Vi2YGnWzZtGm4owinwAAA==",
  ),
  terminalAerial: asset(
    "terminal-aerial-r3",
    1526,
    1024,
    "Aerial view of a terminal yard with rows of dump trucks and trailers parked in formation.",
    "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAQAgCdASoQAAsAAsBMJQBOgCHQV9XMEmwAAP6yP7H0Fpnl337jyk7cIPSJp0bo7jCNmQCLvNPR6cFv/6igwE3AaFEwdHZYtSab0xdEU1gkh7QAAAA=",
  ),
  heroHighway: asset(
    "hero-highway-r3",
    1536,
    857,
    "Aerial view of a tri-axle dump truck travelling a multi-lane Ontario highway at dusk.",
    "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAQCdASoQAAkAAsBMJZACdAEQMW09+AD+wK/BhxsdAnGTy9C0HxhvopNBJf5YO1d8KTM8Pvqp4mAL78ng7xH7VdEupWBO0YrIH2UAAAA=",
  ),

  /* ---- Video posters -------------------------------------------------
     Extracted from frame 0 of the compressed clips, so the poster and the
     video's first frame are identical and the swap is invisible. */
  heroConvoyPoster: asset(
    "hero-convoy-poster-r3",
    1920,
    1080,
    "Aerial view of a convoy of blue heavy trucks travelling a misty Ontario highway at dawn.",
    "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADwAQCdASoQAAkAAsBMJYwCdAEO1FVVLAAA/qN/Rj6zuzaudVyZ2DVdZrosYrvickGLUJrg2OTcYAAA",
  ),
  terminalFleetPoster: asset(
    "terminal-fleet-poster-r3",
    1920,
    1080,
    "Aerial view of a terminal yard with hundreds of blue trucks and trailers parked in formation at dawn.",
    "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoQAAkAAsBMJZQCdAEO+XUzqhAA/eO+i51VF8lYBo54C160hcKJWVs+aInEuX9U2b28uvF6U46SqlvwAAA=",
  ),
  highwayAerialPoster: asset(
    "highway-aerial-poster-r3",
    1920,
    1080,
    "Aerial view of four blue heavy trucks spaced along a divided highway cutting across open Ontario farmland at golden hour.",
    "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADwAQCdASoQAAkAAsBMJYwCdAEO0uF4rwAA+p9QNAd3451+qJwUlPdJA0d8VAAA",
  ),

  /* ---- People -------------------------------------------------------- */
  driverPortrait: asset(
    "driver-portrait-r3",
    1024,
    1271,
    "A professional driver in a high-visibility vest standing beside the cab of a heavy truck.",
    "data:image/webp;base64,UklGRsgAAABXRUJQVlA4ILwAAABwBACdASoQABQAPtFUo0uoJKMhsAgBABoJbAC241/DyCIcQNTacKERsG44sAD+7iK+s2UnMkjS22h7q2gBjt663W/3oU/9GKeCua/JpcRhWWaO+mnL95v5PqFWfzYun//z843JWTYOndjky2mVYCszDynvd/OPENcAPWC2/Pf71bdzbC09zoX4bLo8pruJZ7dyULgVHpmyNf/MvfKt5fzpV2HFP4UTs3IYqrM+Qyu85APzPfIMiUOer94AAA==",
  ),
  fleetTerminal: asset(
    "fleet-terminal-r3",
    1024,
    1271,
    "A row of heavy dump trucks parked in formation at a terminal yard in fog at blue hour.",
    "data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAABwBACdASoQABQAPtFUo0uoJKMhsAgBABoJaACw/cAZIABEJcsPQHieY/1YAAD+cNyyO2+eVv/nYfdbzWBYuTEBilApbANIihSUtzRdz934u21huPV9ejnELPbIi/ZMaeEx+y4v3EgDCFIsL+kkjyakzs7JKe4UhKUAAA==",
  ),
  safetyInspection: asset(
    "safety-inspection-r3",
    1024,
    1271,
    "A driver's gloved hand inspecting a brake chamber and air line during a pre-trip safety inspection.",
    "data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAAAwBACdASoQABQAPtFUo0uoJKMhsAgBABoJZwAD5YnahNpnhEIwqGRgJuAA/ulD9FCEnMBzX32+E4R44MOPCwSPLP0B+T6qoEzGuSqDWaKCbOJPjaFIJv0MBg+56mtqt413Mk0aC0PYlBUpXaL0I04GHgtIyAYPkg3Cg8wpAAA=",
  ),

  /* ---- Fleet, keyed to FLEET[].slug in content/fleet.ts --------------- */
  fleetDumpTruck: asset(
    "fleet-dump-truck-r3",
    1024,
    1271,
    "A modern tri-axle dump truck parked on wet asphalt at an aggregate yard.",
    "data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAAAwBACdASoQABQAPtFUo0uoJKMhsAgBABoJZwDE2CHfah5Z/SSUvnTgIAAA/u1Osw9LALRzpzGKqjsBKnlx7YEqHyRJa7ixxq0JdKLXrFAwSIjPeWFzfK3cDF03Ir6UB4vKLfZHwz8ZJWTvvNsQGhaCO2KAAA==",
  ),
  fleetDumpTrailer: asset(
    "fleet-dump-trailer-r3",
    1526,
    1024,
    "A highway tractor pulling a large end-dump trailer along an open Ontario highway.",
    "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAACwAQCdASoQAAsAAsBMJbACdADprLpQAP7nbo6I7qu+f3uUdezziJxO7M/cxO5agjAEeS9d0BizUjzhXvCURjFiHXQ2eMDjCflMO4aEAAA=",
  ),
  fleetLiveBottom: asset(
    "fleet-live-bottom-r3",
    1024,
    1271,
    "The rear of a live bottom conveyor trailer discharging warm asphalt onto a road surface.",
    "data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAAAwBACdASoQABQAPtFUo0uoJKMhsAgBABoJZwC7ACKVcPypwZm6gELMOTgA/gq3D1gIO8GUAO/7zh9+S/YS3f2DeZnxe1Go0PvabRt1058z/d4rET8yGi6oXUr74BN6y3eWKMoA2CuMvFaGTDNRyjuof7XW+X97Hme7wcOc1xmq4AAA",
  ),
  fleetTanker: asset(
    "fleet-tanker-r3",
    1526,
    1024,
    "A polished stainless steel insulated tanker trailer parked at an industrial terminal.",
    "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAQAgCdASoQAAsAAsBMJYwAAsdlawoYfBcAAP7uPW1t05H1X4xeM3DwkuGvxDuWTQEdkiuySkp/r3tZOfx1yv6Mfm73+kqW+iciiSXZalnGuh7LUtgJeAAA",
  ),
  fleetWalkingFloor: asset(
    "fleet-walking-floor-r3",
    1024,
    1271,
    "A walking floor trailer with rear doors open showing the hydraulic slat floor.",
    "data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAADQAwCdASoQABQAPtFUo0uoJKMhsAgBABoJZQC+SCG8nb9/0Vp/xAAA/thRyN+EDQwXb6d7lPfvMNgZ2kcSVlcLSk8nH1h3I0pc2Pw3CoflscDdU77/QDKB3SFVzCAgmgVK58BAgc5UyPJl/7VWQ4u5kCnU2aWCAAA=",
  ),
  fleetFlatdeck: asset(
    "fleet-flatdeck-r3",
    1526,
    1024,
    "A flatdeck trailer loaded with strapped steel reinforcing bar and concrete culvert sections.",
    "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADwAQCdASoQAAsAAsBMJZwAAp/HJJsW4AAA/u4pt5Yv3HE0bEuTD+T+hvqu7n27XLc2G1TCXxA1w9RmGdw62uzot9bcOQNMAAA=",
  ),

  /* ---- Sectors, keyed to INDUSTRIES[].slug --------------------------- */
  industryConstruction: asset(
    "project-excavation-r3",
    1536,
    857,
    "A deep shored excavation for a downtown high-rise foundation, with an excavator loading a dump truck.",
    "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoQAAkAAsBMJZwAAvxVOWlCu3AA/uUu7fcaJWJbUL3dFLNtvYuy4RC7EcFIh2ii2g22fkiM1H/Ya/OgG4wAAA==",
  ),
  industryWaste: asset(
    "industry-waste-r3",
    1526,
    1024,
    "The interior of a waste transfer station with sorted material on a swept concrete floor.",
    "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAwAgCdASoQAAsAAsBMJZQCdAEQUMFTWKktAAD+9plaDNemk0FUf//Lbr8rkvpdDT1vR8cBmcZ3tA4VMlS57h2/TT1s6fUFEuhgXEoAAAA=",
  ),
  industryMining: asset(
    "industry-mining-r3",
    1526,
    1024,
    "Aerial view of a limestone quarry with terraced benches and graded stockpiles of crushed stone.",
    "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAQCdASoQAAsAAsBMJZQC7ADPdqDU5FAA/tzAThTKerzyuK7xQtYu26hKkHATemVwzed5svo1RNJ6UgmQlAr/wYJmmqFW5nPa9/DiXBR4NgsAAAA=",
  ),
  industryAgriculture: asset(
    "industry-agriculture-r3",
    1526,
    1024,
    "A row of tall grain storage silos at dusk with a truck loading at the base.",
    "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAABQAgCdASoQAAsAAsBMJQBOgMW01X2rtGvo/AAA/oMcmNSzMFrUoErzRt+8Y9pvbJWYb4uLWqcTVldIPOGyDK/kZRCCrXjmRLqA552iedkdT5tPD9rbGJnNfAAAAA==",
  ),
  industryEnergy: asset(
    "industry-energy-r3",
    1526,
    1024,
    "Heavy industrial energy infrastructure under construction with steel pipework and a crane.",
    "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADwAQCdASoQAAsAAsBMJZwAAuPpgKTxdEAA/u2ztqhmNinY6bmiSmPsngawjPPXfbDATPrG1PqojPaU/B9f6Q71LL1ikTuWh8vgAA==",
  ),

  /* ---- Operations ----------------------------------------------------- */
  paving: asset(
    "project-paving-r3",
    1536,
    857,
    "A night highway paving operation with a live bottom trailer discharging hot mix asphalt into a paver.",
    "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAAAQAgCdASoQAAkAAsBMJZQCdAERH07vs/wAAP75Y/pryrAISXaeFgjMjhNdjdQIwBdddo+R1MDpWym69OkyfU4KAAA=",
  ),
} as const satisfies Record<string, ImageAsset>;

export type ImageKey = keyof typeof IMAGES;

export interface VideoAsset {
  /** Path under /public, e.g. "/video/hero-convoy.mp4". */
  src: string;
  /** The still shown until the clip is decoding — always frame 0. */
  poster: ImageAsset;
}

/**
 * Background video loops. Each pairs with a poster above.
 * Sources are self-hosted under `public/video/` — H.264, audio stripped,
 * `+faststart`, ~1–2 MB each.
 */
export const VIDEOS = {
  heroConvoy: { src: "/video/hero-convoy.mp4", poster: IMAGES.heroConvoyPoster },
  terminalFleet: {
    src: "/video/terminal-fleet.mp4",
    poster: IMAGES.terminalFleetPoster,
  },
  highwayAerial: {
    src: "/video/highway-aerial.mp4",
    poster: IMAGES.highwayAerialPoster,
  },
} as const satisfies Record<string, VideoAsset>;

/** Fleet slug -> plate. Keeps `content/fleet.ts` free of asset paths. */
export const FLEET_IMAGE: Record<string, ImageAsset> = {
  "dump-truck": IMAGES.fleetDumpTruck,
  "dump-trailer": IMAGES.fleetDumpTrailer,
  "live-bottom": IMAGES.fleetLiveBottom,
  "tanker-trailer": IMAGES.fleetTanker,
  "walking-floor": IMAGES.fleetWalkingFloor,
  flatdeck: IMAGES.fleetFlatdeck,
};

/** Industry slug -> plate. */
export const INDUSTRY_IMAGE: Record<string, ImageAsset> = {
  construction: IMAGES.industryConstruction,
  "waste-management": IMAGES.industryWaste,
  mining: IMAGES.industryMining,
  agriculture: IMAGES.industryAgriculture,
  energy: IMAGES.industryEnergy,
};

/**
 * Service slug -> plate, keyed to SERVICES[].slug in content/services.ts.
 *
 * Each service shows a different frame so ten cards never repeat a
 * photograph side by side. The pairing is by subject, not by decoration:
 * environmental hauling gets the transfer station, snow removal gets the
 * open highway, and so on.
 */
export const SERVICE_IMAGE: Record<string, ImageAsset> = {
  "dump-truck-services": IMAGES.fleetDumpTruck,
  "tank-trailer-transport": IMAGES.fleetTanker,
  "aggregate-hauling": IMAGES.industryMining,
  "excavation-support": IMAGES.industryConstruction,
  "construction-materials": IMAGES.fleetFlatdeck,
  "heavy-hauling": IMAGES.fleetDumpTrailer,
  "snow-removal": IMAGES.heroHighway,
  "municipal-services": IMAGES.terminalAerial,
  "environmental-hauling": IMAGES.industryWaste,
  "industrial-transport": IMAGES.industryEnergy,
};
