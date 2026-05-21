export type VideoSection = "Theory" | "Manoeuvres";

export type VideoLesson = {
  id: string;
  topic: string;
  section: VideoSection;
  duration: string;
  /** YouTube video ID for embed (e.g. "dQw4w9WgXcQ"). */
  youtubeId: string;
};

export const THEORY_TOPICS: VideoLesson[] = [
  { id: "t-road-signs", topic: "Road Signs", section: "Theory", duration: "9:42", youtubeId: "VCcs3GiYqOM" },
  { id: "t-junctions", topic: "Junctions", section: "Theory", duration: "7:15", youtubeId: "v59Qz26Edyk" },
  { id: "t-roundabouts", topic: "Roundabouts", section: "Theory", duration: "11:03", youtubeId: "8GP76rDjAGI" },
  { id: "t-traffic-lights", topic: "Traffic Lights", section: "Theory", duration: "5:48", youtubeId: "tCT-DgsM-fQ" },
  { id: "t-motorways", topic: "Motorways", section: "Theory", duration: "12:27", youtubeId: "uo3DAJWZ-7Y" },
  { id: "t-speed-limits", topic: "Speed Limits", section: "Theory", duration: "4:32", youtubeId: "0NJoErsujGM" },
  { id: "t-vehicle-safety", topic: "Vehicle Safety", section: "Theory", duration: "8:11", youtubeId: "TVTQ8Z3T_Lo" },
  { id: "t-vulnerable-users", topic: "Vulnerable Road Users", section: "Theory", duration: "6:54", youtubeId: "F4cMBmmqxAg" },
  { id: "t-alcohol-drugs", topic: "Alcohol and Drugs", section: "Theory", duration: "5:22", youtubeId: "fZBjVy-pq8I" },
];

export const MANOEUVRE_TOPICS: VideoLesson[] = [
  { id: "m-turning-left", topic: "Turning Left", section: "Manoeuvres", duration: "6:18", youtubeId: "9KbVrJqYx88" },
  { id: "m-turning-right", topic: "Turning Right", section: "Manoeuvres", duration: "7:02", youtubeId: "rOZBcXf5_dw" },
  { id: "m-crossroads", topic: "Crossroads", section: "Manoeuvres", duration: "8:33", youtubeId: "ohTizQVDFcI" },
  { id: "m-roundabouts", topic: "Roundabouts", section: "Manoeuvres", duration: "9:51", youtubeId: "yndUC81fIYM" },
  { id: "m-parallel-parking", topic: "Parallel Parking", section: "Manoeuvres", duration: "10:24", youtubeId: "PuS3rIPGdLM" },
  { id: "m-bay-forward", topic: "Bay Parking Forward", section: "Manoeuvres", duration: "6:47", youtubeId: "B2_q_n4z3i4" },
  { id: "m-bay-reverse", topic: "Bay Parking Reverse", section: "Manoeuvres", duration: "8:09", youtubeId: "lIYsl5Z2vGM" },
  { id: "m-stopping-right", topic: "Stopping on the Right", section: "Manoeuvres", duration: "5:36", youtubeId: "lf6yX-S7Avg" },
];

export const ALL_VIDEO_LESSONS: VideoLesson[] = [...THEORY_TOPICS, ...MANOEUVRE_TOPICS];

export function findVideoLesson(id: string): VideoLesson | undefined {
  return ALL_VIDEO_LESSONS.find((v) => v.id === id);
}

export function youtubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`;
}

export function youtubeThumbnailUrl(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}
