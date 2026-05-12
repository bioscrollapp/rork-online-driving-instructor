export type VideoSection = "Theory" | "Manoeuvres";

export type VideoLesson = {
  id: string;
  topic: string;
  section: VideoSection;
  duration: string;
  videoUrl: string;
};

export const THEORY_TOPICS: VideoLesson[] = [
  { id: "t-road-signs", topic: "Road Signs", section: "Theory", duration: "3:00", videoUrl: "" },
  { id: "t-junctions", topic: "Junctions", section: "Theory", duration: "3:00", videoUrl: "" },
  { id: "t-roundabouts", topic: "Roundabouts", section: "Theory", duration: "3:00", videoUrl: "" },
  { id: "t-traffic-lights", topic: "Traffic Lights", section: "Theory", duration: "3:00", videoUrl: "" },
  { id: "t-motorways", topic: "Motorways", section: "Theory", duration: "3:00", videoUrl: "" },
  { id: "t-speed-limits", topic: "Speed Limits", section: "Theory", duration: "3:00", videoUrl: "" },
  { id: "t-vehicle-safety", topic: "Vehicle Safety", section: "Theory", duration: "3:00", videoUrl: "" },
  { id: "t-vulnerable-users", topic: "Vulnerable Road Users", section: "Theory", duration: "3:00", videoUrl: "" },
  { id: "t-alcohol-drugs", topic: "Alcohol and Drugs", section: "Theory", duration: "3:00", videoUrl: "" },
];

export const MANOEUVRE_TOPICS: VideoLesson[] = [
  { id: "m-turning-left", topic: "Turning Left", section: "Manoeuvres", duration: "3:00", videoUrl: "" },
  { id: "m-turning-right", topic: "Turning Right", section: "Manoeuvres", duration: "3:00", videoUrl: "" },
  { id: "m-crossroads", topic: "Crossroads", section: "Manoeuvres", duration: "3:00", videoUrl: "" },
  { id: "m-roundabouts", topic: "Roundabouts", section: "Manoeuvres", duration: "3:00", videoUrl: "" },
  { id: "m-parallel-parking", topic: "Parallel Parking", section: "Manoeuvres", duration: "3:00", videoUrl: "" },
  { id: "m-bay-forward", topic: "Bay Parking Forward", section: "Manoeuvres", duration: "3:00", videoUrl: "" },
  { id: "m-bay-reverse", topic: "Bay Parking Reverse", section: "Manoeuvres", duration: "3:00", videoUrl: "" },
  { id: "m-stopping-right", topic: "Stopping on the Right", section: "Manoeuvres", duration: "3:00", videoUrl: "" },
];

export const ALL_VIDEO_LESSONS: VideoLesson[] = [...THEORY_TOPICS, ...MANOEUVRE_TOPICS];

export function findVideoLesson(id: string): VideoLesson | undefined {
  return ALL_VIDEO_LESSONS.find((v) => v.id === id);
}
