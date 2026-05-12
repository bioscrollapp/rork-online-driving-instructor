# The Online Driving Instructor

A mobile app that makes learning for the UK theory test feel less like homework and more like a daily habit.

## Implementation status

### Onboarding
- [x] 3-slide swipeable onboarding flow with paging dots and Skip on every slide
  - [x] Slide 1 — Sophie hero, "Your personal driving instructor, in your pocket.", CTA "Let's Go"
  - [x] Slide 2 — Examiner Anne hero with "Hmph." speech bubble, stern intro copy
  - [x] Slide 3 — XP coins + streak flame, "Learn daily, earn XP, beat your streak.", final CTA "Start Learning"
- [x] Yellow halo around Sophie, chunky black CTA button
- [x] Final CTA / Skip routes into the main tab experience

### Navigation
- [x] Bottom tab navigation with four tabs: Home, Practice, Videos, Progress
- [x] Tab bar with lucide icons, warm-white background, black active state

### Home screen (Home tab)
- [x] Sophie avatar at the top with dynamic greeting ("Ready to smash it today? 🚗")
- [x] Daily streak counter pill (flame icon + day count)
- [x] XP total card with progress bar toward next level
- [x] Three lesson cards:
  - [x] Practice Questions (yellow)
  - [x] Video Lessons (black, white text)
  - [x] Mock Test (yellow)
- [x] Revision Priority banner at the bottom showing saved question count

### Practice tab
- [x] Intro/landing screen for drill sessions
- [x] Swipeable question card screen (15 DVSA / Highway Code questions)
  - [x] Sophie avatar in corner, swaps to stern Examiner Anne on wrong answer
  - [x] Green celebration + confetti + "+10 XP" burst on correct answer
  - [x] Red highlight + "Not quite — let's learn why" explanation on wrong
  - [x] Progress bar, XP chip, session summary screen

### Mock Test (stack route from Home)
- [x] Intro screen with stern Examiner Anne, format details, and Full / My Weak Questions options
- [x] Timed test flow with progress bar, countdown timer, A/B/C/D options and prev/next/submit
- [x] Results screen with pass/fail banner, score, category breakdown, review wrong answers, try again
- [x] Random 50-question selection from the full bank, 57-minute countdown, no in-test feedback
- [x] Auto-mark wrong answers into Revision Priority and persist mock results via MockResultsProvider (AsyncStorage)
- [x] Character-driven results banner — stern Examiner Anne on fail, Sophie praising on pass

### Videos tab
- [x] Video Lessons list with featured card, category filters, play buttons

### Progress tab
- [x] Sophie avatar with motivational message based on progress
- [x] Level badge card (e.g. Level 3 — Learner Driver) with XP progress bar
- [x] 30-day streak calendar with completed days highlighted yellow
- [x] Category performance horizontal bar chart per topic
- [x] Totals row: questions answered, accuracy, time spent learning
- [x] Badges grid with locked + unlocked achievements (First Test, 7 Day Streak, 100 Questions, Mock Pass)
- [x] Revision Priority entry card linking to dedicated screen

### Revision Priority screen
- [x] List of previously-wrong questions with category tags and attempt counts
- [x] "Practise Now" button on each row + "Practise all" CTA
- [x] Empty state with Sophie and encouraging message

### Premium upgrade (modal route from Home)
- [x] Sophie hero with crown chip and "Unlock Everything" headline
- [x] Free vs Premium feature comparison table
- [x] Lifetime £3.99 price card with coffee/resit reassurance copy
- [x] Yellow "Unlock Now" CTA + "One-time payment, no subscription ever"
- [x] Restore purchases link at the bottom

### Authentication (optional)
- [x] Guest mode by default — progress saved locally via AsyncStorage
- [x] Optional Rork Auth sign-in (Google + Apple) using `expo-web-browser` + `expo-secure-store`
- [x] Session counter; soft prompt appears on Home after 3 sessions inviting cloud sign-in (dismissable)
- [x] Sign-in required only at point of Premium purchase — CTA routes to `/sign-in?reason=premium` and returns to paywall
- [x] Sign-in screen with Sophie hero, contextual copy (premium / soft / manual), Google + Apple buttons, error card, “Continue as guest” skip
- [x] Settings shows Account section: signed-in email + provider chip + sign-out, or “Sign in to save progress” for guests

### Category selection (stack route from Practice)
- [x] Grid of all 14 topic categories as cards with lucide icons
- [x] Yellow selected state, black unselected
- [x] Per-category question counts and short blurbs
- [x] Sticky footer Start CTA launches `/quiz?category=...` filtered to that topic
- [x] Practice tab gains a By Topic entry card linking to `/categories`
- [x] Quiz screen filters questions when launched with a `category` param

### Level Up celebration (modal route)
- [x] Full-screen yellow background with confetti loop and decorative rings
- [x] Sophie avatar fades in, level badge springs in with rotation
- [x] Animated headline `LEVEL UP! 🎉` + sub-headline
- [x] Level number + title pill (e.g. Level 3 • Learner Driver)
- [x] List of newly unlocked features/badges (passed via `unlocks` query param, `|`-separated)
- [x] Black Continue button returns to previous screen

### Streak Lost screen (modal route)
- [x] Examiner Anne disappointed avatar with “Tut tut.” speech bubble
- [x] Animated dying flame fading + shrinking
- [x] Lost streak day-count badge with strike-through
- [x] “You broke your streak. Examiner Anne is not impressed.” copy
- [x] Yellow “Start Again” primary CTA + black “Set a Daily Reminder” secondary CTA (routes to Settings)

### Onboarding personalisation quiz (stack route after welcome)
- [x] 3-step quiz with progress bar, Skip and Back
- [x] Q1 test window: 2 weeks / 1 month / 2–3 months / Just exploring
- [x] Q2 learning style: Reading / Videos / Practice / A mix
- [x] Q3 accessibility: Dyslexia / ADHD / Neither / Prefer not to say
- [x] Sets accessibility defaults (dyslexia-friendly font + large text for dyslexia, large text + high contrast for ADHD)
- [x] PersonalisationProvider persists answers in AsyncStorage and exposes `homeMessage`
- [x] Home screen shows personalised Sophie message based on test window

### Deep link sharing
- [x] Share button on Progress screen header (next to streak pill)
- [x] Share my pass button shown only after passing a mock test
- [x] `shareProgress` helper builds branded message (score, level, streak)
- [x] Native share sheet on iOS/Android, Web Share API or clipboard fallback on web

### Settings screen (stack route from Home)
- [x] Profile header card with avatar, name, level chip
- [x] Accessibility toggles: Dyslexia-friendly font, Large text, High contrast, Read questions aloud, Sound effects
- [x] Notifications section with Daily reminder toggle and time picker modal
- [x] About section with app version and Rate the App button
- [x] Settings persisted with AsyncStorage via SettingsProvider

## Design language
- Bold yellow (#FBEE23) + black (#1A1A1A) on warm white (#FAFAF5)
- Chunky black borders on cards for a sticker / flat-illustration feel
- Playful but legible typography with heavy weights for headlines
- Characters Sophie (friendly) and Examiner Anne (stern) as recurring mascots

## Next up
- [x] Expand the question bank beyond the starter 5 (now 65 across 9 categories)
- [ ] Persist session XP into the global total
- [ ] Persist streak + XP with AsyncStorage
- [x] Video lessons list screen (Manoeuvres, Junctions, Theory Explained, Hazard Perception)
- [x] Full mock test flow with timer and results
- [x] Practise by category selection screen
- [x] Level up celebration screen
- [x] Streak lost screen
- [x] Onboarding personalisation quiz
- [x] Deep link / native share for progress and mock pass
