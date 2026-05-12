export type QuizQuestion = {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const questions: QuizQuestion[] = [
  {
    id: "q1",
    category: "Road Signs",
    question: "What does a circular sign with a red border mean?",
    options: [
      "A warning of a hazard ahead",
      "A mandatory instruction you must obey",
      "A direction to follow",
      "Information about a nearby service",
    ],
    correctIndex: 1,
    explanation:
      "Circular signs with a red border give orders. You must obey them. Examples include speed limits and no entry signs.",
  },
  {
    id: "q2",
    category: "Road Signs",
    question: "What shape are warning signs in the UK?",
    options: ["Circular", "Rectangular", "Triangular", "Diamond"],
    correctIndex: 2,
    explanation:
      "Warning signs are triangular with a red border. They alert you to hazards ahead such as bends, junctions or pedestrian crossings.",
  },
  {
    id: "q3",
    category: "Junctions",
    question:
      "You are approaching a junction and the traffic lights are red. When can you proceed?",
    options: [
      "When no traffic is coming",
      "When the lights turn green",
      "After waiting 10 seconds",
      "When you see amber",
    ],
    correctIndex: 1,
    explanation:
      "You must wait at red traffic lights until they turn green. Never proceed on red even if the road appears clear.",
  },
  {
    id: "q4",
    category: "Junctions",
    question:
      "What does a broken white line across your side of the road at a junction mean?",
    options: [
      "Stop and wait",
      "Give way to traffic on the main road",
      "You have priority",
      "No entry ahead",
    ],
    correctIndex: 1,
    explanation:
      "A broken white line at a junction means give way. You must give priority to traffic on the road you are joining.",
  },
  {
    id: "q5",
    category: "Roundabouts",
    question: "At a roundabout, who has priority?",
    options: [
      "Vehicles entering the roundabout",
      "The largest vehicle",
      "Traffic already on the roundabout",
      "Vehicles coming from the right",
    ],
    correctIndex: 2,
    explanation:
      "Traffic already on the roundabout has priority. You must give way to vehicles coming from your right before entering.",
  },
  {
    id: "q6",
    category: "Roundabouts",
    question:
      "You want to take the third exit at a roundabout. Which lane should you approach in?",
    options: ["Left lane", "Right lane", "Either lane", "Middle lane"],
    correctIndex: 1,
    explanation:
      "For exits past 12 o'clock on a roundabout, approach in the right lane, signal right on entry, then signal left to exit.",
  },
  {
    id: "q7",
    category: "Safety",
    question: "What is the stopping distance at 30mph in dry conditions?",
    options: ["12 metres", "23 metres", "53 metres", "36 metres"],
    correctIndex: 1,
    explanation:
      "At 30mph the total stopping distance is 23 metres — 9 metres thinking distance plus 14 metres braking distance.",
  },
  {
    id: "q8",
    category: "Safety",
    question: "When should you use your hazard warning lights?",
    options: [
      "When parking on double yellow lines",
      "When your vehicle has broken down and is a hazard",
      "When driving in fog",
      "When dropping children at school",
    ],
    correctIndex: 1,
    explanation:
      "Hazard lights should be used when your vehicle is stationary and poses a danger to other road users, such as a breakdown.",
  },
  {
    id: "q9",
    category: "Speed Limits",
    question:
      "What is the national speed limit on a single carriageway road for a car?",
    options: ["50mph", "60mph", "70mph", "80mph"],
    correctIndex: 1,
    explanation:
      "The national speed limit on a single carriageway for a car is 60mph. The 70mph limit applies to dual carriageways and motorways.",
  },
  {
    id: "q10",
    category: "Speed Limits",
    question: "What is the maximum speed limit on a motorway for a car?",
    options: ["60mph", "70mph", "80mph", "No limit"],
    correctIndex: 1,
    explanation:
      "The maximum speed limit on a motorway is 70mph unless signs indicate otherwise, such as on smart motorways.",
  },
  {
    id: "q11",
    category: "Alcohol and Drugs",
    question:
      "What is the legal blood alcohol limit for drivers in England and Wales?",
    options: [
      "50mg per 100ml of blood",
      "80mg per 100ml of blood",
      "100mg per 100ml of blood",
      "35mg per 100ml of blood",
    ],
    correctIndex: 1,
    explanation:
      "The legal limit in England and Wales is 80mg of alcohol per 100ml of blood. Scotland has a stricter limit of 50mg.",
  },
  {
    id: "q12",
    category: "Motorways",
    question: "What should you do if you miss your exit on a motorway?",
    options: [
      "Reverse along the hard shoulder",
      "Make a U-turn at the next gap",
      "Continue to the next exit",
      "Stop and wait for help",
    ],
    correctIndex: 2,
    explanation:
      "If you miss your exit you must continue to the next one. Never reverse on a motorway as this is extremely dangerous and illegal.",
  },
  {
    id: "q13",
    category: "Motorways",
    question: "When can you use the hard shoulder on a motorway?",
    options: [
      "When traffic is heavy",
      "To overtake slow vehicles",
      "In an emergency or breakdown",
      "When directed by a sat nav",
    ],
    correctIndex: 2,
    explanation:
      "The hard shoulder is only for emergencies or breakdowns unless signs indicate it is open as a running lane on a smart motorway.",
  },
  {
    id: "q14",
    category: "Vehicle Safety",
    question: "How often should you check your tyre pressure?",
    options: [
      "Once a year",
      "At least once a month",
      "Every six months",
      "Only at MOT time",
    ],
    correctIndex: 1,
    explanation:
      "Tyre pressure should be checked at least once a month and before long journeys. Always check when tyres are cold.",
  },
  {
    id: "q15",
    category: "Vulnerable Road Users",
    question: "You are passing a cyclist. How much space should you leave?",
    options: [
      "At least 0.5 metres",
      "At least 1 metre",
      "At least 1.5 metres",
      "As much as possible, at least 1.5 metres",
    ],
    correctIndex: 3,
    explanation:
      "The Highway Code states you should give cyclists at least 1.5 metres of space when overtaking, and more at higher speeds.",
  },
  {
    id: "q16",
    category: "Road Signs",
    question: "What does an upside-down triangular sign mean?",
    options: ["Stop", "Give way", "No entry", "End of restriction"],
    correctIndex: 1,
    explanation:
      "An inverted triangle with a red border is the only triangular sign pointing down. It means 'Give way' to traffic on the major road.",
  },
  {
    id: "q17",
    category: "Road Signs",
    question: "What colour are signs giving directions on motorways?",
    options: ["Green", "White", "Blue", "Brown"],
    correctIndex: 2,
    explanation:
      "Motorway direction signs have a blue background with white text. Green is for primary routes and white for non-primary roads.",
  },
  {
    id: "q18",
    category: "Road Signs",
    question: "A red circle with a white horizontal bar means what?",
    options: ["No entry", "No stopping", "No overtaking", "No through road"],
    correctIndex: 0,
    explanation:
      "A red circle with a single white horizontal bar means 'No entry for vehicular traffic'. Never proceed past this sign.",
  },
  {
    id: "q19",
    category: "Road Signs",
    question: "What does a blue circular sign usually indicate?",
    options: [
      "A warning of a hazard",
      "A positive instruction you must follow",
      "Information about a service",
      "A prohibition",
    ],
    correctIndex: 1,
    explanation:
      "Blue circular signs give a positive instruction, such as 'turn left ahead' or 'mini-roundabout'. You must obey them.",
  },
  {
    id: "q20",
    category: "Road Signs",
    question: "What does a sign showing a red ring with no symbol or number inside mean?",
    options: [
      "No vehicles allowed",
      "No waiting",
      "End of all restrictions",
      "National speed limit applies",
    ],
    correctIndex: 0,
    explanation:
      "An empty red circle means no vehicles of any kind are allowed beyond this point.",
  },
  {
    id: "q21",
    category: "Road Signs",
    question: "What does a white circle with a black diagonal stripe mean?",
    options: [
      "No overtaking",
      "End of restriction",
      "National speed limit applies",
      "Clearway ahead",
    ],
    correctIndex: 2,
    explanation:
      "This sign means the national speed limit applies — 60mph on single carriageways and 70mph on dual carriageways/motorways for cars.",
  },
  {
    id: "q22",
    category: "Road Signs",
    question: "A red triangle with an exclamation mark means what?",
    options: [
      "Stop immediately",
      "Other danger — read the plate",
      "Roadworks ahead",
      "Accident blackspot",
    ],
    correctIndex: 1,
    explanation:
      "This warns of 'other danger' not covered by other signs. A plate underneath will describe the specific hazard.",
  },
  {
    id: "q23",
    category: "Road Signs",
    question: "What does a yellow box with criss-cross lines on the road mean?",
    options: [
      "Bus stop",
      "Box junction — do not enter unless your exit is clear",
      "Pedestrian crossing",
      "Parking restricted",
    ],
    correctIndex: 1,
    explanation:
      "You must not enter a box junction unless your exit is clear. The only exception is when turning right and oncoming traffic is blocking you.",
  },
  {
    id: "q24",
    category: "Junctions",
    question: "What must you do at a 'Stop' sign?",
    options: [
      "Slow down and continue if clear",
      "Stop completely behind the line",
      "Sound horn before proceeding",
      "Wait 5 seconds then go",
    ],
    correctIndex: 1,
    explanation:
      "A Stop sign is the only octagonal sign. You must come to a complete stop behind the solid white line, then proceed only when safe.",
  },
  {
    id: "q25",
    category: "Junctions",
    question: "At an unmarked crossroads, who has priority?",
    options: [
      "Vehicles from the right",
      "Vehicles from the left",
      "The largest vehicle",
      "No one — proceed with caution",
    ],
    correctIndex: 3,
    explanation:
      "At unmarked crossroads no one has priority. Approach with extreme caution and be ready to give way.",
  },
  {
    id: "q26",
    category: "Junctions",
    question: "You are turning right at a junction. Oncoming traffic is also turning right. What is best practice?",
    options: [
      "Pass nearside-to-nearside if road markings allow",
      "Always pass offside-to-offside",
      "Stop and wave them through",
      "Reverse to give space",
    ],
    correctIndex: 0,
    explanation:
      "Where road markings or layout indicate, passing nearside-to-nearside gives a clearer view of oncoming traffic.",
  },
  {
    id: "q27",
    category: "Junctions",
    question: "What does a flashing amber traffic light at a pelican crossing mean?",
    options: [
      "Stop and wait",
      "Give way to pedestrians on the crossing",
      "Speed up to clear the crossing",
      "Lights are faulty — proceed with care",
    ],
    correctIndex: 1,
    explanation:
      "At a pelican crossing, flashing amber means you may proceed only if the crossing is clear of pedestrians.",
  },
  {
    id: "q28",
    category: "Junctions",
    question: "A solid white line along the centre of the road means what?",
    options: [
      "You may overtake",
      "Do not cross or straddle unless turning, passing a stationary vehicle, or a slow road user",
      "Lane for buses only",
      "Hard shoulder begins",
    ],
    correctIndex: 1,
    explanation:
      "You must not cross a solid white centre line except to turn into a side road, pass a stationary vehicle, or overtake a cyclist, horse or road maintenance vehicle moving at 10mph or less.",
  },
  {
    id: "q29",
    category: "Roundabouts",
    question: "You are taking the first exit at a roundabout (left turn). What signal should you use?",
    options: [
      "Right on approach, left on exit",
      "Left on approach, left on exit",
      "No signal needed",
      "Right on approach, right on exit",
    ],
    correctIndex: 1,
    explanation:
      "For the first exit, signal left on approach and keep the signal on as you exit. Approach in the left lane.",
  },
  {
    id: "q30",
    category: "Roundabouts",
    question: "What rules apply at a mini-roundabout?",
    options: [
      "You can drive straight over the central marking",
      "The same rules as a normal roundabout — give way to the right",
      "Vehicles entering have priority",
      "Signal only if turning right",
    ],
    correctIndex: 1,
    explanation:
      "Treat mini-roundabouts like any other roundabout — give way to traffic from the right. Avoid driving over the central marking where possible.",
  },
  {
    id: "q31",
    category: "Roundabouts",
    question: "You are going straight ahead at a roundabout. When should you signal left?",
    options: [
      "On approach",
      "As you pass the exit before the one you want",
      "Not at all",
      "Only if there are pedestrians",
    ],
    correctIndex: 1,
    explanation:
      "When going straight on, do not signal on approach. Signal left as you pass the exit just before the one you intend to take.",
  },
  {
    id: "q32",
    category: "Roundabouts",
    question: "Long vehicles may straddle lanes on a roundabout. Why?",
    options: [
      "They have priority",
      "They need extra room to manoeuvre",
      "The driver is lost",
      "It is illegal but common",
    ],
    correctIndex: 1,
    explanation:
      "Long vehicles may need to take a different line to negotiate a roundabout safely. Give them space and do not overtake on the inside.",
  },
  {
    id: "q33",
    category: "Roundabouts",
    question: "You see a horse rider approaching a roundabout in the left lane signalling right. Why?",
    options: [
      "They are lost",
      "They will be staying in the left lane to leave the roundabout safely",
      "They want you to overtake",
      "They are turning right immediately",
    ],
    correctIndex: 1,
    explanation:
      "Horse riders and cyclists often stay in the left lane while signalling right, so they can exit safely. Give them plenty of room.",
  },
  {
    id: "q34",
    category: "Motorways",
    question: "Who is NOT allowed on a motorway?",
    options: [
      "Lorries over 7.5 tonnes",
      "Learner car drivers without an approved instructor",
      "Motorcycles over 125cc",
      "Cars towing caravans",
    ],
    correctIndex: 1,
    explanation:
      "Learner drivers may use a motorway only when accompanied by an approved driving instructor in a car with dual controls. Pedestrians, cyclists, mopeds under 50cc and L-plate riders are not allowed.",
  },
  {
    id: "q35",
    category: "Motorways",
    question: "What do amber studs mark on a motorway?",
    options: [
      "The left edge of the carriageway",
      "Lane separators",
      "The right edge of the carriageway next to the central reservation",
      "Slip road exits",
    ],
    correctIndex: 2,
    explanation:
      "Amber studs mark the right-hand edge of the carriageway next to the central reservation. Red studs mark the left edge, white separate lanes, and green mark slip roads.",
  },
  {
    id: "q36",
    category: "Motorways",
    question: "On a smart motorway, a red X above a lane means what?",
    options: [
      "Lane closed — do not use",
      "End of speed limit",
      "Lane reserved for buses",
      "Roadworks ahead",
    ],
    correctIndex: 0,
    explanation:
      "A red X means the lane is closed. You must move out of it as soon as it is safe — driving in a closed lane is an offence.",
  },
  {
    id: "q37",
    category: "Motorways",
    question: "You are joining a motorway from a slip road. What should you do?",
    options: [
      "Stop at the end of the slip road",
      "Force your way into the nearest gap",
      "Adjust speed to match motorway traffic and merge into a safe gap",
      "Drive on the hard shoulder until clear",
    ],
    correctIndex: 2,
    explanation:
      "Use the slip road to build up speed to match the motorway traffic, then merge into a safe gap. Give way to traffic already on the motorway.",
  },
  {
    id: "q38",
    category: "Motorways",
    question: "What is the minimum tread depth required for car tyres in the UK?",
    options: ["1.0mm", "1.6mm", "2.0mm", "3.0mm"],
    correctIndex: 1,
    explanation:
      "The legal minimum tread depth for cars is 1.6mm across the central three-quarters of the tyre and around its entire circumference.",
  },
  {
    id: "q39",
    category: "Motorways",
    question: "You break down on a motorway. What is the first thing you should do once safely off the carriageway?",
    options: [
      "Phone a friend for advice",
      "Get out on the left and stand behind the barrier, then call for help",
      "Stay in the vehicle with seatbelt on",
      "Walk back along the hard shoulder to warn other drivers",
    ],
    correctIndex: 1,
    explanation:
      "Leave the vehicle by the left-hand door, get behind the safety barrier, and use an emergency phone or mobile to call for help. Never walk back along the carriageway.",
  },
  {
    id: "q40",
    category: "Speed Limits",
    question: "What is the speed limit in a built-up area unless signs say otherwise?",
    options: ["20mph", "30mph", "40mph", "50mph"],
    correctIndex: 1,
    explanation:
      "In built-up areas with street lighting, the default speed limit is 30mph unless signs indicate otherwise.",
  },
  {
    id: "q41",
    category: "Speed Limits",
    question: "What is the national speed limit on a dual carriageway for a car?",
    options: ["50mph", "60mph", "70mph", "80mph"],
    correctIndex: 2,
    explanation:
      "The national speed limit on a dual carriageway for cars and motorcycles is 70mph, the same as on a motorway.",
  },
  {
    id: "q42",
    category: "Speed Limits",
    question: "A car towing a trailer or caravan on a motorway has what maximum speed limit?",
    options: ["50mph", "60mph", "70mph", "Same as the towing vehicle"],
    correctIndex: 1,
    explanation:
      "Cars towing trailers or caravans are limited to 60mph on motorways and dual carriageways, and 50mph on single carriageways.",
  },
  {
    id: "q43",
    category: "Speed Limits",
    question: "You see a circular sign with '40' inside a red ring. What does it mean?",
    options: [
      "Minimum speed 40mph",
      "Recommended speed 40mph",
      "Maximum speed limit 40mph",
      "End of 40mph zone",
    ],
    correctIndex: 2,
    explanation:
      "A number in a red circle is a maximum speed limit. You must not exceed it.",
  },
  {
    id: "q44",
    category: "Speed Limits",
    question: "What is the speed limit in a 20mph zone with traffic-calming measures?",
    options: ["20mph", "25mph", "30mph", "As posted on each road"],
    correctIndex: 0,
    explanation:
      "A 20mph zone applies until you see a sign cancelling it. The limit covers all roads in the zone.",
  },
  {
    id: "q45",
    category: "Vehicle Safety",
    question: "What is the typical overall stopping distance at 70mph in dry conditions?",
    options: ["53 metres", "73 metres", "96 metres", "120 metres"],
    correctIndex: 2,
    explanation:
      "At 70mph the overall stopping distance is around 96 metres — about 24 car lengths. In wet weather it doubles, and in icy conditions it can be ten times longer.",
  },
  {
    id: "q46",
    category: "Vehicle Safety",
    question: "When should you use front fog lights?",
    options: [
      "At night on unlit roads",
      "When visibility is seriously reduced (less than 100m)",
      "When it is raining",
      "In heavy traffic",
    ],
    correctIndex: 1,
    explanation:
      "Front fog lights should only be used when visibility is seriously reduced — generally less than 100 metres. Switch them off when visibility improves to avoid dazzling others.",
  },
  {
    id: "q47",
    category: "Vehicle Safety",
    question: "Your steering wheel feels heavy. What is the most likely cause?",
    options: [
      "Wheel alignment is off",
      "Tyre pressures too low",
      "Worn brake pads",
      "Empty fuel tank",
    ],
    correctIndex: 1,
    explanation:
      "Under-inflated tyres make the steering feel heavy and increase fuel consumption and tyre wear.",
  },
  {
    id: "q48",
    category: "Vehicle Safety",
    question: "What does ABS help a driver do?",
    options: [
      "Brake harder than normal",
      "Stop in a shorter distance every time",
      "Maintain steering control during emergency braking",
      "Reduce engine wear",
    ],
    correctIndex: 2,
    explanation:
      "Anti-lock braking systems prevent the wheels locking under heavy braking, helping you keep steering control. ABS does not necessarily reduce stopping distance.",
  },
  {
    id: "q49",
    category: "Vehicle Safety",
    question: "You are about to drive an unfamiliar car. What should you check first?",
    options: [
      "Fuel level",
      "Mirror, seat and steering position adjustments",
      "Radio station",
      "Number plate",
    ],
    correctIndex: 1,
    explanation:
      "Always adjust your seat, head restraint, mirrors and steering wheel before setting off, so you can drive safely and comfortably.",
  },
  {
    id: "q50",
    category: "Vehicle Safety",
    question: "A red warning light showing a battery symbol on your dashboard means what?",
    options: [
      "Battery is fully charged",
      "There is a fault in the charging system",
      "Time for a service",
      "Engine is overheating",
    ],
    correctIndex: 1,
    explanation:
      "A battery warning light means the battery is not being charged properly. Stop as soon as it is safe and seek help — driving on may cause a breakdown.",
  },
  {
    id: "q51",
    category: "Vulnerable Road Users",
    question: "You see a pedestrian with a white stick with two reflective bands. What does this indicate?",
    options: [
      "The person is blind",
      "The person is deaf as well as blind",
      "The person is a child",
      "The person is a guide",
    ],
    correctIndex: 1,
    explanation:
      "A white stick with two red reflective bands indicates the person is both deaf and blind. Be especially patient and considerate.",
  },
  {
    id: "q52",
    category: "Vulnerable Road Users",
    question: "You are following a horse and rider. What should you do?",
    options: [
      "Sound your horn to alert the rider",
      "Pass closely so it is over quickly",
      "Slow down, give them plenty of room and pass wide and slow",
      "Flash your headlights",
    ],
    correctIndex: 2,
    explanation:
      "Pass horses slowly and at a distance of at least 2 metres at no more than 10mph. Never sound your horn or rev your engine.",
  },
  {
    id: "q53",
    category: "Vulnerable Road Users",
    question: "You are turning left at a junction. A cyclist is also going straight ahead on your left. What should you do?",
    options: [
      "Turn left in front of them",
      "Hold back and let the cyclist pass",
      "Sound your horn",
      "Speed up and turn quickly",
    ],
    correctIndex: 1,
    explanation:
      "Cyclists going straight on have priority. Hold back, do not cut across them, and only turn when it is safe.",
  },
  {
    id: "q54",
    category: "Vulnerable Road Users",
    question: "At a zebra crossing a pedestrian is waiting at the kerb. What should you do?",
    options: [
      "Continue if you can clear the crossing first",
      "Slow down and prepare to stop to let them cross",
      "Wave them across",
      "Sound your horn",
    ],
    correctIndex: 1,
    explanation:
      "You must give way to pedestrians waiting to cross at a zebra crossing. Do not wave them across — another vehicle may not have seen them.",
  },
  {
    id: "q55",
    category: "Vulnerable Road Users",
    question: "A school crossing patrol has stopped you with a 'Stop Children' sign. What must you do?",
    options: [
      "Slow down and continue if clear",
      "Stop and wait until the sign is withdrawn",
      "Drive around them carefully",
      "Sound horn before proceeding",
    ],
    correctIndex: 1,
    explanation:
      "You must stop when a school crossing patrol shows the 'Stop Children' sign and wait until they signal you may proceed. Failing to do so is an offence.",
  },
  {
    id: "q56",
    category: "Vulnerable Road Users",
    question: "You see an older person crossing the road slowly. What is the safest action?",
    options: [
      "Drive on quickly behind them",
      "Sound your horn to hurry them",
      "Be patient and allow them to cross in their own time",
      "Pull around them at speed",
    ],
    correctIndex: 2,
    explanation:
      "Older or disabled pedestrians may take longer to cross. Be patient and never rush or intimidate them.",
  },
  {
    id: "q57",
    category: "Alcohol and Drugs",
    question: "What is the legal blood alcohol limit for drivers in Scotland?",
    options: [
      "35mg per 100ml of blood",
      "50mg per 100ml of blood",
      "80mg per 100ml of blood",
      "There is no set limit",
    ],
    correctIndex: 1,
    explanation:
      "Scotland has a stricter limit of 50mg per 100ml of blood, compared with 80mg in England, Wales and Northern Ireland.",
  },
  {
    id: "q58",
    category: "Alcohol and Drugs",
    question: "You have had a few drinks at a party. What is the safest advice?",
    options: [
      "Have a strong coffee then drive",
      "Take a cold shower then drive",
      "Do not drive — find another way home",
      "Wait one hour per drink, then drive",
    ],
    correctIndex: 2,
    explanation:
      "There is no quick way to lower your blood alcohol level. The only safe option is not to drive — get a taxi, lift or public transport.",
  },
  {
    id: "q59",
    category: "Alcohol and Drugs",
    question: "You are taking prescription medication. What should you check before driving?",
    options: [
      "Whether it tastes bad",
      "Whether it may affect your ability to drive — read the label or ask the pharmacist",
      "How much it cost",
      "If it is in a child-proof bottle",
    ],
    correctIndex: 1,
    explanation:
      "Some medicines cause drowsiness or impair reactions. Always check the label or ask your doctor or pharmacist before driving.",
  },
  {
    id: "q60",
    category: "Alcohol and Drugs",
    question: "How long does alcohol typically remain in the body?",
    options: [
      "30 minutes",
      "A few hours, depending on amount and individual",
      "Exactly 12 hours",
      "Up to a week",
    ],
    correctIndex: 1,
    explanation:
      "Alcohol leaves the body at roughly one unit per hour, but varies by person. You can still be over the limit the morning after a heavy session.",
  },
  {
    id: "q61",
    category: "Alcohol and Drugs",
    question: "What is a typical penalty for driving while over the legal alcohol limit in the UK?",
    options: [
      "Points only",
      "A driving ban, unlimited fine and possible imprisonment",
      "A warning letter",
      "A fixed £60 fine",
    ],
    correctIndex: 1,
    explanation:
      "Drink-driving carries a minimum 12-month ban, an unlimited fine and up to 6 months in prison, plus a criminal record.",
  },
  {
    id: "q62",
    category: "Alcohol and Drugs",
    question: "How does alcohol affect your driving?",
    options: [
      "Improves reaction time",
      "Sharpens vision",
      "Slows reactions and impairs judgement",
      "Has no effect on driving ability",
    ],
    correctIndex: 2,
    explanation:
      "Alcohol slows reactions, impairs judgement and coordination, and gives a false sense of confidence — a dangerous combination behind the wheel.",
  },
  {
    id: "q63",
    category: "Road Signs",
    question: "What does a brown direction sign indicate?",
    options: [
      "Tourist attractions",
      "Motorway services",
      "Diversion route",
      "Roadworks",
    ],
    correctIndex: 0,
    explanation:
      "Brown signs point the way to tourist attractions and leisure facilities such as castles, gardens and theme parks.",
  },
  {
    id: "q64",
    category: "Junctions",
    question: "You are approaching green traffic lights. What should you do?",
    options: [
      "Always proceed at speed",
      "Check the way is clear and proceed if safe",
      "Stop and wait",
      "Sound your horn",
    ],
    correctIndex: 1,
    explanation:
      "Green means you may go if the way is clear. Watch out for pedestrians still crossing and traffic that has not cleared the junction.",
  },
  {
    id: "q65",
    category: "Vehicle Safety",
    question: "How can you reduce fuel consumption when driving?",
    options: [
      "Drive with the windows fully open at speed",
      "Carry extra weight in the boot",
      "Anticipate the road ahead and drive smoothly",
      "Accelerate hard between junctions",
    ],
    correctIndex: 2,
    explanation:
      "Smooth acceleration and braking, anticipating traffic and avoiding unnecessary weight all reduce fuel use, emissions and wear.",
  },
  {
    id: "q66",
    category: "Road Signs",
    question: "What does a blue circular sign usually indicate?",
    options: [
      "A warning of a hazard",
      "A positive instruction you must follow",
      "A prohibition",
      "Tourist information",
    ],
    correctIndex: 1,
    explanation:
      "Blue circles give a positive instruction, such as 'turn left ahead' or a minimum speed limit.",
  },
  {
    id: "q67",
    category: "Road Signs",
    question: "A red triangle pointing downwards on a sign means what?",
    options: ["Stop", "Give way", "No entry", "School ahead"],
    correctIndex: 1,
    explanation:
      "An inverted red triangle is the only triangular sign that points downwards. It tells you to give way to traffic on the major road.",
  },
  {
    id: "q68",
    category: "Road Signs",
    question: "What does a sign showing a red circle with a white horizontal bar mean?",
    options: [
      "No entry for vehicular traffic",
      "No overtaking",
      "One-way street",
      "No stopping",
    ],
    correctIndex: 0,
    explanation:
      "A red circle with a single white bar means no entry. You must not drive past it.",
  },
  {
    id: "q69",
    category: "Road Signs",
    question: "What colour are signs giving directions on motorways?",
    options: ["Green", "White", "Blue", "Brown"],
    correctIndex: 2,
    explanation:
      "Motorway direction signs have a blue background with white text and route numbers.",
  },
  {
    id: "q70",
    category: "Road Signs",
    question: "What does a sign with a white arrow on a blue circle pointing left mean?",
    options: [
      "Turn left ahead",
      "No left turn",
      "One way to the left only",
      "Keep left of the obstruction",
    ],
    correctIndex: 0,
    explanation:
      "Blue circular signs give positive instructions. An arrow pointing left means you must turn left ahead.",
  },
  {
    id: "q71",
    category: "Road Signs",
    question: "What does a yellow box with criss-cross lines painted on the road mean?",
    options: [
      "Bus stop area",
      "You must not enter unless your exit is clear",
      "Loading bay",
      "Parking for disabled badge holders",
    ],
    correctIndex: 1,
    explanation:
      "Yellow box junctions keep junctions clear. You may only enter if your exit is clear, except when turning right and only oncoming traffic prevents you.",
  },
  {
    id: "q72",
    category: "Road Signs",
    question: "What does a sign showing two children crossing with a triangular red border warn of?",
    options: [
      "Playground entrance",
      "School crossing patrol",
      "Children going to or from school",
      "Pedestrian zone",
    ],
    correctIndex: 2,
    explanation:
      "This warning sign means children may be crossing on their way to or from school. Reduce your speed and be ready to stop.",
  },
  {
    id: "q73",
    category: "Road Signs",
    question: "A green direction sign indicates what kind of road?",
    options: [
      "A motorway",
      "A primary route",
      "A non-primary route",
      "A tourist route",
    ],
    correctIndex: 1,
    explanation:
      "Green signs with white text are used on primary A-roads connecting major towns and cities.",
  },
  {
    id: "q74",
    category: "Road Signs",
    question: "What does a sign with a horse and rider mean?",
    options: [
      "Riding school ahead",
      "Accompanied horses or ponies likely in the road",
      "No horses allowed",
      "Bridleway crossing only",
    ],
    correctIndex: 1,
    explanation:
      "This warning sign tells you to expect horse riders ahead. Slow down and pass wide and slow.",
  },
  {
    id: "q75",
    category: "Road Signs",
    question: "What does a sign with a red ring and a motorbike and car symbol mean?",
    options: [
      "Motorbikes and cars only",
      "No motor vehicles",
      "Two-way traffic",
      "Vehicle weight limit",
    ],
    correctIndex: 1,
    explanation:
      "A red circle around a motorcycle and car symbol means no motor vehicles are allowed beyond the sign.",
  },
  {
    id: "q76",
    category: "Junctions",
    question: "You are turning right at a crossroads. An oncoming driver is also turning right. How should you normally pass?",
    options: [
      "Nearside to nearside",
      "Offside to offside",
      "Whichever is quicker",
      "You should reverse and let them go",
    ],
    correctIndex: 1,
    explanation:
      "Offside to offside is usually safer because you can see oncoming traffic clearly. Follow road markings if they direct otherwise.",
  },
  {
    id: "q77",
    category: "Junctions",
    question: "You are waiting to turn right out of a side road. What is the main hazard?",
    options: [
      "The car behind you",
      "Oncoming traffic and traffic from your right",
      "Pedestrians on the pavement",
      "Road surface markings",
    ],
    correctIndex: 1,
    explanation:
      "You must give way to traffic from both directions. Wait until there is a safe gap before emerging.",
  },
  {
    id: "q78",
    category: "Junctions",
    question: "What does a 'Stop' sign require you to do?",
    options: [
      "Slow down and proceed if clear",
      "Stop only if traffic is approaching",
      "Stop completely behind the line every time",
      "Sound your horn before entering",
    ],
    correctIndex: 2,
    explanation:
      "A Stop sign means you must stop completely at the line, then move off only when it is safe to do so.",
  },
  {
    id: "q79",
    category: "Junctions",
    question: "You are emerging from a junction with restricted view. What technique should you use?",
    options: [
      "Creep slowly forward until you can see clearly",
      "Pull straight out as soon as you can",
      "Sound your horn and emerge",
      "Wait for someone to wave you out",
    ],
    correctIndex: 0,
    explanation:
      "Creep-and-peep lets you see oncoming traffic without committing to the junction until you know it is safe.",
  },
  {
    id: "q80",
    category: "Junctions",
    question: "At an unmarked crossroads, who has priority?",
    options: [
      "Traffic from the right",
      "Traffic from the left",
      "The largest vehicle",
      "No one has priority",
    ],
    correctIndex: 3,
    explanation:
      "At an unmarked crossroads no road has priority. Approach with extreme care and be prepared to stop.",
  },
  {
    id: "q81",
    category: "Junctions",
    question: "You see double broken white lines across a side road as you approach. What do they mean?",
    options: [
      "Stop",
      "Give way to traffic on the major road",
      "No through road",
      "Two-way traffic merging",
    ],
    correctIndex: 1,
    explanation:
      "Double broken white lines accompanied by an inverted triangle marking mean give way to traffic on the major road.",
  },
  {
    id: "q82",
    category: "Junctions",
    question: "What should you do before turning left into a side road?",
    options: [
      "Sound your horn",
      "Check your nearside mirror for cyclists",
      "Wave on any pedestrians",
      "Speed up to clear the junction",
    ],
    correctIndex: 1,
    explanation:
      "Always check your nearside mirror and blind spot for cyclists or motorcyclists who may be alongside you.",
  },
  {
    id: "q83",
    category: "Junctions",
    question: "You are approaching a junction with a 'Give Way' sign. What must you do?",
    options: [
      "Stop completely every time",
      "Slow and give way to traffic on the main road",
      "Sound your horn before emerging",
      "Always stop for two seconds",
    ],
    correctIndex: 1,
    explanation:
      "Give way means slow down and only emerge when there is a safe gap in traffic. Stop only if necessary.",
  },
  {
    id: "q84",
    category: "Junctions",
    question: "You want to turn right onto a dual carriageway with a narrow central reserve. What should you do?",
    options: [
      "Treat it as one road and wait for a gap in both directions",
      "Cross in two stages, stopping in the gap",
      "Go quickly without stopping",
      "Use the hard shoulder",
    ],
    correctIndex: 0,
    explanation:
      "If the central reserve is too narrow for your vehicle, treat the dual carriageway as one road and wait for a gap in both directions.",
  },
  {
    id: "q85",
    category: "Junctions",
    question: "You're stopped in a queue at a junction. How can you help cyclists alongside you?",
    options: [
      "Edge forward to push them out",
      "Leave space and check for them before moving off",
      "Sound your horn so they know you are there",
      "Open your door so they go around",
    ],
    correctIndex: 1,
    explanation:
      "Cyclists often filter alongside stationary traffic. Always check before moving off and give them room.",
  },
  {
    id: "q86",
    category: "Roundabouts",
    question: "At a roundabout, who normally has priority?",
    options: [
      "Traffic already on the roundabout",
      "Traffic entering from your left",
      "The largest vehicle",
      "Traffic going straight ahead",
    ],
    correctIndex: 0,
    explanation:
      "In the UK you give way to traffic already on the roundabout, which approaches from your right.",
  },
  {
    id: "q87",
    category: "Roundabouts",
    question: "You are taking the third (right) exit from a roundabout. Which lane should you usually use?",
    options: [
      "The left-hand lane",
      "The right-hand lane",
      "Either lane",
      "The middle of the road",
    ],
    correctIndex: 1,
    explanation:
      "For exits past 12 o'clock you normally approach in the right-hand lane and signal right, then signal left after passing the exit before yours.",
  },
  {
    id: "q88",
    category: "Roundabouts",
    question: "When should you signal as you approach a roundabout to take the first exit (left)?",
    options: [
      "Right, on approach",
      "Left, on approach",
      "Do not signal",
      "Only signal once on the roundabout",
    ],
    correctIndex: 1,
    explanation:
      "Signal left on approach and stay in the left-hand lane to take the first exit.",
  },
  {
    id: "q89",
    category: "Roundabouts",
    question: "What should you do at a mini-roundabout?",
    options: [
      "Drive straight over it",
      "Treat it as a give-way junction",
      "Pass round it the same as a normal roundabout",
      "Stop and wait at all times",
    ],
    correctIndex: 2,
    explanation:
      "You must pass round the central marking of a mini-roundabout unless your vehicle is too large to do so.",
  },
  {
    id: "q90",
    category: "Roundabouts",
    question: "You are turning right at a roundabout. When should you signal left?",
    options: [
      "As you enter the roundabout",
      "After passing the exit before the one you want",
      "You don't need to signal at all",
      "Only after leaving the roundabout",
    ],
    correctIndex: 1,
    explanation:
      "Signal left after you pass the exit before the one you intend to take so following drivers know you are leaving.",
  },
  {
    id: "q91",
    category: "Roundabouts",
    question: "Why should you take extra care of cyclists at roundabouts?",
    options: [
      "They always go quickly",
      "They may stay in the left lane even when turning right",
      "They never signal",
      "They have priority over all vehicles",
    ],
    correctIndex: 1,
    explanation:
      "Cyclists and horse riders may keep to the left on a roundabout even when turning right. Give them plenty of room.",
  },
  {
    id: "q92",
    category: "Roundabouts",
    question: "What does a long vehicle straddling lanes at a roundabout indicate?",
    options: [
      "The driver is lost",
      "They need extra room to negotiate the roundabout",
      "They are about to break down",
      "They are giving way to you",
    ],
    correctIndex: 1,
    explanation:
      "Long vehicles may need to use both lanes to get around safely. Stay back and give them space.",
  },
  {
    id: "q93",
    category: "Roundabouts",
    question: "You are going straight ahead at a roundabout. Which lane should you normally use?",
    options: [
      "The left-hand lane",
      "The right-hand lane",
      "The hard shoulder",
      "Whichever is empty",
    ],
    correctIndex: 0,
    explanation:
      "For exits up to 12 o'clock, approach in the left-hand lane unless road markings or signs say otherwise.",
  },
  {
    id: "q94",
    category: "Roundabouts",
    question: "What sign warns you that you are approaching a roundabout?",
    options: [
      "A red triangle showing three curved arrows in a circle",
      "A blue circle with arrows",
      "A red octagon",
      "A green rectangle",
    ],
    correctIndex: 0,
    explanation:
      "Roundabouts are warned by a triangular warning sign showing three curved arrows in a circle.",
  },
  {
    id: "q95",
    category: "Roundabouts",
    question: "At a double mini-roundabout, what do you have to do?",
    options: [
      "Treat each roundabout separately",
      "Treat both as one roundabout",
      "Always go round the outside",
      "Stop completely between them",
    ],
    correctIndex: 0,
    explanation:
      "Treat each mini-roundabout separately and give way to traffic from your right at each one.",
  },
  {
    id: "q96",
    category: "Motorways",
    question: "You join a motorway from the slip road. What should you do?",
    options: [
      "Stop at the end of the slip road",
      "Match the speed of the motorway traffic and merge into a safe gap",
      "Cross to the right-hand lane immediately",
      "Drive on the hard shoulder until safe",
    ],
    correctIndex: 1,
    explanation:
      "Use the slip road to build up to the speed of the traffic on the motorway, then merge into a safe gap.",
  },
  {
    id: "q97",
    category: "Motorways",
    question: "Which vehicles are not allowed on a motorway?",
    options: [
      "Cars towing trailers",
      "Learner drivers in cars (unless with an approved instructor)",
      "Motorcycles over 125cc",
      "Vans under 3.5 tonnes",
    ],
    correctIndex: 1,
    explanation:
      "Learner drivers may only use a motorway when accompanied by an approved driving instructor in a car with dual controls.",
  },
  {
    id: "q98",
    category: "Motorways",
    question: "What do red flashing lights above every lane mean?",
    options: [
      "Slow down to 50mph",
      "You must not go beyond this signal in any lane",
      "Move to the left lane",
      "Roadworks ahead",
    ],
    correctIndex: 1,
    explanation:
      "Red flashing lights and a red 'X' over a lane mean you must not proceed in that lane. If shown over every lane, you must stop.",
  },
  {
    id: "q99",
    category: "Motorways",
    question: "What is the right-hand lane of a three-lane motorway used for?",
    options: [
      "Heavy goods vehicles",
      "Overtaking",
      "Slow traffic",
      "Vehicles towing trailers",
    ],
    correctIndex: 1,
    explanation:
      "The right-hand lane is for overtaking. Return to the centre or left lane when it is safe.",
  },
  {
    id: "q100",
    category: "Motorways",
    question: "What should you do if you miss your exit on a motorway?",
    options: [
      "Reverse along the hard shoulder",
      "Cut across the chevrons",
      "Continue to the next exit",
      "Stop and wait for help",
    ],
    correctIndex: 2,
    explanation:
      "Never reverse or cross the chevrons. Carry on to the next exit and rejoin from there.",
  },
  {
    id: "q101",
    category: "Motorways",
    question: "What colour are the reflective studs between the carriageway and the hard shoulder?",
    options: ["White", "Red", "Amber", "Green"],
    correctIndex: 1,
    explanation:
      "Red studs mark the left edge of the carriageway, between the running lane and the hard shoulder.",
  },
  {
    id: "q102",
    category: "Motorways",
    question: "What colour studs separate the carriageway from the central reservation?",
    options: ["White", "Red", "Amber", "Green"],
    correctIndex: 2,
    explanation:
      "Amber studs run along the right-hand edge of the carriageway, beside the central reservation.",
  },
  {
    id: "q103",
    category: "Motorways",
    question: "On a motorway, when can you use the hard shoulder?",
    options: [
      "To overtake slow vehicles",
      "In an emergency or breakdown only",
      "To stop and answer your phone",
      "For a short rest",
    ],
    correctIndex: 1,
    explanation:
      "The hard shoulder is for emergencies only, unless signs on a smart motorway tell you otherwise.",
  },
  {
    id: "q104",
    category: "Motorways",
    question: "What should you do on a smart motorway when a red 'X' is shown over a lane?",
    options: [
      "Use it for overtaking only",
      "Avoid that lane and merge safely",
      "Drive in it slowly",
      "Use it as the hard shoulder",
    ],
    correctIndex: 1,
    explanation:
      "A red X means the lane is closed. Move out of it as soon as it is safe to do so.",
  },
  {
    id: "q105",
    category: "Motorways",
    question: "What is the national speed limit for cars on a motorway?",
    options: ["60 mph", "70 mph", "80 mph", "50 mph"],
    correctIndex: 1,
    explanation:
      "The national speed limit on motorways is 70 mph for cars and motorcycles, unless lower limits are signed.",
  },
  {
    id: "q106",
    category: "Speed Limits",
    question: "What is the default speed limit in a built-up area with street lighting?",
    options: ["20 mph", "30 mph", "40 mph", "50 mph"],
    correctIndex: 1,
    explanation:
      "In built-up areas with street lighting the speed limit is normally 30 mph unless signs show otherwise.",
  },
  {
    id: "q107",
    category: "Speed Limits",
    question: "What is the national speed limit for cars on a single carriageway?",
    options: ["50 mph", "60 mph", "70 mph", "40 mph"],
    correctIndex: 1,
    explanation:
      "On a single carriageway with the national speed limit sign, the limit for cars is 60 mph.",
  },
  {
    id: "q108",
    category: "Speed Limits",
    question: "What is the national speed limit for cars on a dual carriageway?",
    options: ["50 mph", "60 mph", "70 mph", "80 mph"],
    correctIndex: 2,
    explanation:
      "Cars and motorcycles can travel up to 70 mph on a dual carriageway with the national speed limit sign.",
  },
  {
    id: "q109",
    category: "Speed Limits",
    question: "What does the national speed limit sign look like?",
    options: [
      "A red circle with 70 inside",
      "A white circle with a black diagonal stripe",
      "A blue square with white text",
      "A green triangle",
    ],
    correctIndex: 1,
    explanation:
      "A white circular sign with a single black diagonal line means the national speed limit applies.",
  },
  {
    id: "q110",
    category: "Speed Limits",
    question: "In a 20 mph zone you should:",
    options: [
      "Drive at 20 mph at all times",
      "Drive no more than 20 mph and slower if conditions need it",
      "Treat it as advisory",
      "Drive at 30 mph if the road is clear",
    ],
    correctIndex: 1,
    explanation:
      "20 mph is the maximum, not a target. Drive slower when there are pedestrians, cyclists or poor conditions.",
  },
  {
    id: "q111",
    category: "Speed Limits",
    question: "What is the speed limit for a car towing a caravan on a motorway?",
    options: ["50 mph", "60 mph", "70 mph", "40 mph"],
    correctIndex: 1,
    explanation:
      "Cars towing caravans or trailers are limited to 60 mph on a motorway and dual carriageway.",
  },
  {
    id: "q112",
    category: "Speed Limits",
    question: "What does a red ring with the number 40 mean?",
    options: [
      "Minimum speed 40 mph",
      "Maximum speed 40 mph",
      "Recommended speed 40 mph",
      "40 metres ahead",
    ],
    correctIndex: 1,
    explanation:
      "A red ring with a number is the maximum speed limit you must not exceed.",
  },
  {
    id: "q113",
    category: "Speed Limits",
    question: "What does a blue circle with a white number mean?",
    options: [
      "Maximum speed limit",
      "Minimum speed limit",
      "Advisory speed",
      "End of restrictions",
    ],
    correctIndex: 1,
    explanation:
      "A blue circle with a white number is a minimum speed limit. You should not drive slower than the figure shown.",
  },
  {
    id: "q114",
    category: "Speed Limits",
    question: "You are driving in heavy rain. What should you do about your speed?",
    options: [
      "Stick to the speed limit",
      "Slow down because stopping distances are at least doubled",
      "Drive faster to clear the rain",
      "Switch off ABS",
    ],
    correctIndex: 1,
    explanation:
      "In wet weather stopping distances are at least doubled. Slow down and increase the gap to the vehicle in front.",
  },
  {
    id: "q115",
    category: "Speed Limits",
    question: "What is the speed limit for a car on a single carriageway when towing a trailer?",
    options: ["40 mph", "50 mph", "60 mph", "70 mph"],
    correctIndex: 1,
    explanation:
      "Cars towing a trailer are limited to 50 mph on single carriageways and 60 mph on dual carriageways and motorways.",
  },
  {
    id: "q116",
    category: "Vehicle Safety",
    question: "How often should you check your tyre pressures?",
    options: [
      "Once a year",
      "At least once a week and before long journeys",
      "Only when a tyre looks flat",
      "Never — tyre pressures don't change",
    ],
    correctIndex: 1,
    explanation:
      "Check tyre pressures (when cold) at least weekly and before long trips. Correct pressures improve safety, handling and fuel economy.",
  },
  {
    id: "q117",
    category: "Vehicle Safety",
    question: "What is the legal minimum tread depth for car tyres in the UK?",
    options: ["1.0 mm", "1.6 mm", "2.5 mm", "3.0 mm"],
    correctIndex: 1,
    explanation:
      "Car tyres must have at least 1.6 mm of tread across the central three-quarters of the tyre and around its entire circumference.",
  },
  {
    id: "q118",
    category: "Vehicle Safety",
    question: "What is the first thing you should do if your car tyre bursts on a motorway?",
    options: [
      "Brake hard immediately",
      "Hold the steering wheel firmly and let the vehicle slow gradually",
      "Steer onto the central reservation",
      "Switch off the engine",
    ],
    correctIndex: 1,
    explanation:
      "Hold the wheel firmly and ease off the accelerator. Allow the speed to drop and pull onto the hard shoulder when safe.",
  },
  {
    id: "q119",
    category: "Vehicle Safety",
    question: "What should you check before starting any journey?",
    options: [
      "Tyres, lights, fluids and that mirrors are clean and adjusted",
      "Just the radio station",
      "Only the fuel level",
      "Whether your phone is charged",
    ],
    correctIndex: 0,
    explanation:
      "A walk-around check of tyres, lights, mirrors and fluid levels keeps you safe and legal.",
  },
  {
    id: "q120",
    category: "Vehicle Safety",
    question: "What does the brake warning light on the dashboard usually mean?",
    options: [
      "Brake fluid level is low or there is a brake fault",
      "You are braking hard",
      "ABS has failed",
      "Your handbrake is broken",
    ],
    correctIndex: 0,
    explanation:
      "The brake warning light usually indicates low fluid or a brake system fault. Stop safely and have it checked.",
  },
  {
    id: "q121",
    category: "Vehicle Safety",
    question: "You smell petrol while driving. What should you do?",
    options: [
      "Continue but drive slower",
      "Stop, switch off the engine and investigate",
      "Open the windows",
      "Speed up to reach a garage",
    ],
    correctIndex: 1,
    explanation:
      "A fuel smell can indicate a leak which is a fire risk. Stop safely, switch off and investigate or call for help.",
  },
  {
    id: "q122",
    category: "Vehicle Safety",
    question: "How can you tell if your wheels are out of balance?",
    options: [
      "The vehicle pulls to one side",
      "The steering wheel vibrates",
      "The brakes squeal",
      "The exhaust smokes",
    ],
    correctIndex: 1,
    explanation:
      "Vibration through the steering wheel at speed often points to wheel balance problems.",
  },
  {
    id: "q123",
    category: "Vehicle Safety",
    question: "Why should you not overload your vehicle?",
    options: [
      "It uses more fuel",
      "It can dangerously affect handling and braking",
      "It scratches the seats",
      "It voids your warranty",
    ],
    correctIndex: 1,
    explanation:
      "Overloading affects steering, braking and stability and is also illegal.",
  },
  {
    id: "q124",
    category: "Vehicle Safety",
    question: "What should you do before driving away after parking on a hill?",
    options: [
      "Just release the handbrake",
      "Check mirrors and blind spot, signal if needed, then move off",
      "Sound your horn",
      "Roll back to test the brakes",
    ],
    correctIndex: 1,
    explanation:
      "Always do a full mirrors-signal-manoeuvre routine. Check blind spots for cyclists or pedestrians.",
  },
  {
    id: "q125",
    category: "Vehicle Safety",
    question: "How should children under 3 travel in a car?",
    options: [
      "On an adult's lap",
      "In an appropriate child restraint",
      "Wearing an adult seat belt",
      "In the front passenger seat without restraint",
    ],
    correctIndex: 1,
    explanation:
      "Children under 3 must use a suitable child restraint. It is the driver's responsibility.",
  },
  {
    id: "q126",
    category: "Vulnerable Road Users",
    question: "You see a pedestrian with a white stick with a red band. What does this tell you?",
    options: [
      "They are blind",
      "They are deaf-blind",
      "They have a leg injury",
      "They are a school crossing patrol",
    ],
    correctIndex: 1,
    explanation:
      "A white stick with red bands indicates a person who is both deaf and blind. Take extra care.",
  },
  {
    id: "q127",
    category: "Vulnerable Road Users",
    question: "How should you pass a horse and rider?",
    options: [
      "Quickly and close to the horse",
      "Slowly, leaving plenty of room",
      "With your horn sounding",
      "Flash your lights to warn them",
    ],
    correctIndex: 1,
    explanation:
      "Slow down and pass wide and slow. Horses can be easily startled.",
  },
  {
    id: "q128",
    category: "Vulnerable Road Users",
    question: "What should you do when approaching a zebra crossing where someone is waiting to cross?",
    options: [
      "Slow down and be ready to stop",
      "Speed up to clear the crossing",
      "Wave them across",
      "Sound your horn",
    ],
    correctIndex: 0,
    explanation:
      "Slow down and stop if necessary. Never wave pedestrians across — another vehicle may be coming.",
  },
  {
    id: "q129",
    category: "Vulnerable Road Users",
    question: "Why should you take extra care around motorcyclists at junctions?",
    options: [
      "They go faster than cars",
      "They are smaller and harder to see",
      "They never have indicators",
      "They have priority over other traffic",
    ],
    correctIndex: 1,
    explanation:
      "Motorcyclists are easy to miss, especially at junctions. Always take a second look.",
  },
  {
    id: "q130",
    category: "Vulnerable Road Users",
    question: "You are passing a parked ice-cream van with children nearby. What should you do?",
    options: [
      "Sound your horn",
      "Slow right down and watch for children running out",
      "Speed past so you don't block traffic",
      "Flash your headlights",
    ],
    correctIndex: 1,
    explanation:
      "Children may run into the road without looking. Slow right down and be ready to stop.",
  },
  {
    id: "q131",
    category: "Vulnerable Road Users",
    question: "How much room should you leave when overtaking a cyclist?",
    options: [
      "As little as possible",
      "At least 1.5 metres at speeds up to 30 mph",
      "30 cm",
      "Just enough to get past",
    ],
    correctIndex: 1,
    explanation:
      "The Highway Code says leave at least 1.5 metres when passing a cyclist at speeds up to 30 mph, and more at higher speeds.",
  },
  {
    id: "q132",
    category: "Vulnerable Road Users",
    question: "Who has priority at a pedestrian crossing on a side road you are turning into?",
    options: [
      "Vehicles in the main road",
      "Pedestrians already crossing or waiting to cross",
      "You always have priority",
      "Cyclists only",
    ],
    correctIndex: 1,
    explanation:
      "Under the Hierarchy of Road Users, pedestrians waiting or crossing at a junction have priority over turning vehicles.",
  },
  {
    id: "q133",
    category: "Vulnerable Road Users",
    question: "What does a flashing amber light at a Pelican crossing mean?",
    options: [
      "Stop and wait",
      "Give way to pedestrians on the crossing",
      "Drive on at speed",
      "Pedestrians may not cross",
    ],
    correctIndex: 1,
    explanation:
      "Flashing amber means give way to any pedestrians still on the crossing. If clear, you may proceed.",
  },
  {
    id: "q134",
    category: "Vulnerable Road Users",
    question: "You see an elderly pedestrian crossing slowly. What should you do?",
    options: [
      "Sound your horn",
      "Be patient and wait until they finish crossing",
      "Drive around them",
      "Flash your lights",
    ],
    correctIndex: 1,
    explanation:
      "Be patient. Older pedestrians may take longer to cross — never rush them.",
  },
  {
    id: "q135",
    category: "Vulnerable Road Users",
    question: "What is a Toucan crossing designed for?",
    options: [
      "Pedestrians only",
      "Cyclists only",
      "Pedestrians and cyclists together",
      "Horses",
    ],
    correctIndex: 2,
    explanation:
      "At a Toucan crossing, pedestrians and cyclists may cross together when the green signal shows.",
  },
  {
    id: "q136",
    category: "Alcohol and Drugs",
    question: "How does alcohol affect your driving?",
    options: [
      "It improves reactions",
      "It slows reactions and impairs judgement",
      "It has no effect in small amounts",
      "It only affects vision",
    ],
    correctIndex: 1,
    explanation:
      "Even small amounts of alcohol slow reactions, reduce coordination and impair judgement.",
  },
  {
    id: "q137",
    category: "Alcohol and Drugs",
    question: "You have been at a party and feel okay to drive. What should you do?",
    options: [
      "Drive home if you feel fine",
      "Wait — you could still be over the limit",
      "Drink coffee and drive",
      "Drive with windows open",
    ],
    correctIndex: 1,
    explanation:
      "You can still be over the limit hours after drinking. The only safe option is not to drive.",
  },
  {
    id: "q138",
    category: "Alcohol and Drugs",
    question: "Your prescription medication says it can cause drowsiness. What should you do?",
    options: [
      "Drive carefully",
      "Avoid driving and check with your doctor or pharmacist",
      "Take a smaller dose before driving",
      "Drink coffee with it",
    ],
    correctIndex: 1,
    explanation:
      "Drugs that cause drowsiness affect your ability to drive. Get advice before driving.",
  },
  {
    id: "q139",
    category: "Alcohol and Drugs",
    question: "What is the best way to make sure you are fit to drive after drinking?",
    options: [
      "Drink black coffee",
      "Have a cold shower",
      "Don't drink at all if you plan to drive",
      "Drink water",
    ],
    correctIndex: 2,
    explanation:
      "Nothing speeds up the removal of alcohol from your body. The safest option is not to drink before driving.",
  },
  {
    id: "q140",
    category: "Alcohol and Drugs",
    question: "What might be a consequence of drink-driving in the UK?",
    options: [
      "A small fine only",
      "Loss of licence, large fine and possible prison",
      "Two penalty points",
      "Nothing — police rarely act",
    ],
    correctIndex: 1,
    explanation:
      "Drink-driving can lead to disqualification, an unlimited fine, a criminal record and up to 6 months in prison.",
  },
  {
    id: "q141",
    category: "Alcohol and Drugs",
    question: "You feel very tired after a long shift. What should you do before driving?",
    options: [
      "Drive with the radio loud",
      "Open the window",
      "Rest properly before starting your journey",
      "Drink an energy drink and go",
    ],
    correctIndex: 2,
    explanation:
      "Tiredness impairs reactions and judgement like alcohol. Rest properly before driving.",
  },
  {
    id: "q142",
    category: "Alcohol and Drugs",
    question: "You start to feel sleepy on a motorway. What is the best action?",
    options: [
      "Carry on but drive slower",
      "Stop at the next service area for a break",
      "Stop on the hard shoulder for a sleep",
      "Open the sunroof",
    ],
    correctIndex: 1,
    explanation:
      "Leave the motorway at the next service area or exit to take a proper break. Never sleep on the hard shoulder.",
  },
  {
    id: "q143",
    category: "Alcohol and Drugs",
    question: "Cannabis or other illegal drugs in your system while driving:",
    options: [
      "Can be detected at very low levels and lead to prosecution",
      "Are tested only if you cause a crash",
      "Are legal as long as you feel fine",
      "Are only an offence if combined with alcohol",
    ],
    correctIndex: 0,
    explanation:
      "It is illegal to drive with certain drugs above a very low limit, even if you feel unaffected.",
  },
  {
    id: "q144",
    category: "Alcohol and Drugs",
    question: "How long does it take for alcohol to leave the body?",
    options: [
      "It varies, often around one hour per unit",
      "15 minutes",
      "Always 12 hours",
      "It depends on what you ate",
    ],
    correctIndex: 0,
    explanation:
      "Roughly one unit per hour is a guide, but it varies by person. Morning-after driving can still be over the limit.",
  },
  {
    id: "q145",
    category: "Alcohol and Drugs",
    question: "A friend is over the limit and wants to drive home. What should you do?",
    options: [
      "Let them drive — it's their choice",
      "Try to stop them and arrange another way home",
      "Follow them in your car",
      "Let them drive but not too far",
    ],
    correctIndex: 1,
    explanation:
      "Stop them driving. Offer to call a taxi, arrange a lift or share a ride.",
  },
  {
    id: "q146",
    category: "Traffic Lights",
    question: "What does a steady amber traffic light mean?",
    options: [
      "Stop unless it would be unsafe to do so",
      "Speed up to clear the lights",
      "Get ready to go",
      "Slow down but keep moving",
    ],
    correctIndex: 0,
    explanation:
      "Amber means stop, unless you have already crossed the line or stopping would cause a collision.",
  },
  {
    id: "q147",
    category: "Traffic Lights",
    question: "The traffic lights are red and amber together. What should you do?",
    options: [
      "Go if the way is clear",
      "Stop and wait — do not pass",
      "Sound your horn",
      "Reverse",
    ],
    correctIndex: 1,
    explanation:
      "Red and amber together means stop and wait. Do not pass through until the light turns green.",
  },
  {
    id: "q148",
    category: "Traffic Lights",
    question: "Traffic lights are out of order. What should you do?",
    options: [
      "Treat the junction as if it had a stop sign",
      "Treat the junction as if no one has priority — proceed with care",
      "Carry on as normal",
      "Sound your horn before going",
    ],
    correctIndex: 1,
    explanation:
      "At a failed signal, treat it like an unmarked junction. Proceed with great care and give way as needed.",
  },
  {
    id: "q149",
    category: "Traffic Lights",
    question: "A green arrow filter on traffic lights means what?",
    options: [
      "You may go in the direction of the arrow even if other lights are red",
      "Stop completely",
      "Slow down",
      "Sound your horn",
    ],
    correctIndex: 0,
    explanation:
      "A green arrow filter lets you proceed in that direction, regardless of the main lights, provided the road is clear.",
  },
  {
    id: "q150",
    category: "Traffic Lights",
    question: "You are stopped in the front of a queue at red lights. When can you move off?",
    options: [
      "On red and amber together",
      "As soon as the lights change to green and the way is clear",
      "As soon as the car behind hoots",
      "On amber",
    ],
    correctIndex: 1,
    explanation:
      "Move off only when the light is green and the way is clear, including any pedestrians still crossing.",
  },
  {
    id: "q151",
    category: "Traffic Lights",
    question: "What does a red traffic light always mean?",
    options: [
      "Slow down",
      "Stop and wait behind the line",
      "Stop only if traffic is coming",
      "Give way",
    ],
    correctIndex: 1,
    explanation:
      "Red means stop. Wait behind the stop line until the lights change.",
  },
  {
    id: "q152",
    category: "Traffic Lights",
    question: "You see a flashing amber light at a Pelican crossing. What should you do?",
    options: [
      "Treat it as red",
      "Give way to any pedestrian on the crossing, then proceed if clear",
      "Drive on without stopping",
      "Stop completely for 10 seconds",
    ],
    correctIndex: 1,
    explanation:
      "At a Pelican crossing, flashing amber means give way to pedestrians on the crossing. Move off when it is clear.",
  },
  {
    id: "q153",
    category: "Traffic Lights",
    question: "At a level crossing, what does a steady red light with a flashing red below it mean?",
    options: [
      "Stop — a train is approaching",
      "Give way",
      "Speed up to clear the tracks",
      "Lights are faulty — proceed",
    ],
    correctIndex: 0,
    explanation:
      "At a level crossing, flashing red means stop and wait. A train is approaching — never cross.",
  },
  {
    id: "q154",
    category: "Traffic Lights",
    question: "What does a green traffic light mean?",
    options: [
      "You have right of way over everything",
      "You may go on if the way is clear",
      "Stop",
      "Slow down and be ready to stop",
    ],
    correctIndex: 1,
    explanation:
      "Green means proceed if the way is clear. Watch for pedestrians and other traffic in the junction.",
  },
  {
    id: "q155",
    category: "Traffic Lights",
    question: "Why should you not block a yellow box junction at traffic lights?",
    options: [
      "It is illegal and obstructs other traffic",
      "It damages the road surface",
      "It is allowed if your light is green",
      "It only matters at peak times",
    ],
    correctIndex: 0,
    explanation:
      "You must not enter a yellow box junction unless your exit is clear. Blocking it is an offence.",
  },
  {
    id: "q156",
    category: "Motorway Rules",
    question: "You are driving on a motorway. When may you use the right-hand lane?",
    options: [
      "For a normal cruise",
      "For overtaking only, returning to the left when safe",
      "To drive at low speed",
      "To use as the exit lane",
    ],
    correctIndex: 1,
    explanation:
      "The right-hand lane is for overtaking. Move back to a left-hand lane as soon as it is safe.",
  },
  {
    id: "q157",
    category: "Motorway Rules",
    question: "You break down on a motorway. What is the first thing you should do?",
    options: [
      "Stop in lane and put on hazards",
      "Pull onto the hard shoulder, switch on hazard lights and exit by the left side",
      "Reverse to the previous junction",
      "Walk back to the previous bridge",
    ],
    correctIndex: 1,
    explanation:
      "Pull as far left as possible, switch on hazards and leave the vehicle from the nearside. Use an emergency phone if possible.",
  },
  {
    id: "q158",
    category: "Motorway Rules",
    question: "What is the minimum recommended gap to the vehicle in front on a dry motorway?",
    options: [
      "One second",
      "Two seconds",
      "Five seconds",
      "Half a car length per 10 mph",
    ],
    correctIndex: 1,
    explanation:
      "Use the two-second rule on a dry road. In wet conditions double it to at least four seconds.",
  },
  {
    id: "q159",
    category: "Motorway Rules",
    question: "What does a flashing amber light above your lane on a motorway mean?",
    options: [
      "Lane closed",
      "There is a hazard ahead — slow down and be alert",
      "Speed limit of 70 still applies",
      "End of restrictions",
    ],
    correctIndex: 1,
    explanation:
      "Flashing amber lights warn of a hazard ahead such as a queue or accident. Slow down and follow any signed speed limit.",
  },
  {
    id: "q160",
    category: "Motorway Rules",
    question: "You are leaving a motorway. What should you do as you approach the slip road?",
    options: [
      "Brake heavily on the main carriageway",
      "Move to the left lane in good time and reduce speed gradually on the slip road",
      "Stop at the start of the slip road",
      "Cross the chevrons to take a shortcut",
    ],
    correctIndex: 1,
    explanation:
      "Move to the left lane in good time, signal and use the slip road to reduce speed — your speed feels deceptively slow.",
  },
  {
    id: "q161",
    category: "Motorway Rules",
    question: "On a smart motorway with no hard shoulder, where can you stop in an emergency?",
    options: [
      "Anywhere on the carriageway",
      "In an Emergency Refuge Area (ERA) where possible",
      "On the central reservation",
      "In lane one with hazards on",
    ],
    correctIndex: 1,
    explanation:
      "Try to reach an Emergency Refuge Area or leave at the next exit. If you cannot, stay in the vehicle with hazards on and call 999 if it is unsafe to leave.",
  },
  {
    id: "q162",
    category: "Motorway Rules",
    question: "What is the speed limit shown on overhead signs on a smart motorway?",
    options: [
      "Advisory only",
      "Mandatory — you must obey it",
      "Only for trucks",
      "Only at night",
    ],
    correctIndex: 1,
    explanation:
      "Variable speed limits on a smart motorway are mandatory and enforced by cameras.",
  },
  {
    id: "q163",
    category: "Motorway Rules",
    question: "Reflective studs on motorways — what colour marks the lane lines?",
    options: ["Red", "Amber", "White", "Green"],
    correctIndex: 2,
    explanation:
      "White studs separate the lanes on a motorway. Red on the left, amber on the right, green at slip roads.",
  },
  {
    id: "q164",
    category: "Motorway Rules",
    question: "You are driving on a motorway and notice fog. What should you do?",
    options: [
      "Use full beam headlights",
      "Use dipped headlights and rear fog lights when visibility is below 100 metres",
      "Use sidelights only",
      "Hold on closely behind another vehicle",
    ],
    correctIndex: 1,
    explanation:
      "In fog use dipped headlights. Use rear fog lights only when visibility is reduced to 100 metres or less, and switch them off when it improves.",
  },
  {
    id: "q165",
    category: "Motorway Rules",
    question: "Why should you avoid using your mobile phone while driving on a motorway?",
    options: [
      "It uses up battery quickly",
      "It is illegal and dangerously distracting",
      "It interferes with the radio",
      "It only matters in towns",
    ],
    correctIndex: 1,
    explanation:
      "Using a hand-held phone is illegal and seriously affects your concentration and reactions, especially at motorway speeds.",
  },
];

export default questions;
