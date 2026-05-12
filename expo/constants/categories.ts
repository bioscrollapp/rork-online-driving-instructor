export type CategoryId =
  | "road-signs"
  | "junctions"
  | "roundabouts"
  | "traffic-lights"
  | "motorways"
  | "speed-limits"
  | "vehicle-safety"
  | "vulnerable-road-users"
  | "alcohol-drugs"
  | "motorway-rules"
  | "weather"
  | "documents-penalties"
  | "environmental"
  | "accidents-emergencies";

export type Category = {
  id: CategoryId;
  name: string;
  short: string;
  iconName:
    | "Octagon"
    | "Compass"
    | "RotateCw"
    | "TrafficCone"
    | "Route"
    | "Gauge"
    | "ShieldCheck"
    | "Footprints"
    | "Beer"
    | "Truck"
    | "CloudRain"
    | "FileText"
    | "Leaf"
    | "Siren";
  blurb: string;
};

const CATEGORIES: Category[] = [
  {
    id: "road-signs",
    name: "Road Signs",
    short: "Signs",
    iconName: "Octagon",
    blurb: "Shapes, colours & meanings",
  },
  {
    id: "junctions",
    name: "Junctions",
    short: "Junctions",
    iconName: "Compass",
    blurb: "Give way & priority",
  },
  {
    id: "roundabouts",
    name: "Roundabouts",
    short: "Roundabouts",
    iconName: "RotateCw",
    blurb: "Lane choice & exits",
  },
  {
    id: "traffic-lights",
    name: "Traffic Lights",
    short: "Lights",
    iconName: "TrafficCone",
    blurb: "Phases & filter arrows",
  },
  {
    id: "motorways",
    name: "Motorways",
    short: "Motorways",
    iconName: "Route",
    blurb: "Joining & lane discipline",
  },
  {
    id: "speed-limits",
    name: "Speed Limits",
    short: "Speed",
    iconName: "Gauge",
    blurb: "National & restricted",
  },
  {
    id: "vehicle-safety",
    name: "Vehicle Safety",
    short: "Safety",
    iconName: "ShieldCheck",
    blurb: "Tyres, lights, loads",
  },
  {
    id: "vulnerable-road-users",
    name: "Vulnerable Road Users",
    short: "VRUs",
    iconName: "Footprints",
    blurb: "Cyclists, kids, horses",
  },
  {
    id: "alcohol-drugs",
    name: "Alcohol and Drugs",
    short: "Alcohol",
    iconName: "Beer",
    blurb: "Limits & consequences",
  },
  {
    id: "motorway-rules",
    name: "Motorway Rules",
    short: "M-Rules",
    iconName: "Truck",
    blurb: "Hard shoulder & smart M-ways",
  },
  {
    id: "weather",
    name: "Weather Conditions",
    short: "Weather",
    iconName: "CloudRain",
    blurb: "Rain, ice, fog & wind",
  },
  {
    id: "documents-penalties",
    name: "Documents and Penalties",
    short: "Docs",
    iconName: "FileText",
    blurb: "Licence, MOT & points",
  },
  {
    id: "environmental",
    name: "Environmental Issues",
    short: "Eco",
    iconName: "Leaf",
    blurb: "Eco driving & emissions",
  },
  {
    id: "accidents-emergencies",
    name: "Accidents and Emergencies",
    short: "Emergency",
    iconName: "Siren",
    blurb: "First aid & breakdowns",
  },
];

export default CATEGORIES;

export function findCategoryByName(name: string): Category | undefined {
  const target = name.trim().toLowerCase();
  return CATEGORIES.find(
    (c) =>
      c.name.toLowerCase() === target ||
      c.id === target,
  );
}
