import type { ComponentType } from "react";

import compositionSearchThumb from "../assets/thumbnails/compositionSearch.png";
import containerQueriesThumb from "../assets/thumbnails/containerQueries.png";
import glassmorphismThumb from "../assets/thumbnails/glassmorphism.png";
import intersectionObserverThumb from "../assets/thumbnails/intersectionObserver.png";
import optimisticUIThumb from "../assets/thumbnails/optimisticUIUpdates.png";
import progressStepsThumb from "../assets/thumbnails/progressSteps.png";
import scrollAnimationsThumb from "../assets/thumbnails/scrollDrivenAnimations.png";
import useLocalStorageThumb from "../assets/thumbnails/useLocalStorage.png";

export interface Trick {
  id: string;
  title: string;
  description: string;
  category: "CSS" | "JS" | "React";
  technologies: string[];
  thumbnail: string;
  githubUrl: string;
  component: () => Promise<{ default: ComponentType }>;
}

const trickList: Trick[] = [
  {
    id: "kins-page",
    title: "Kin's Page",
    description: "Memo/blog style page migrated from Kin's legacy project.",
    category: "JS",
    technologies: ["Markdown rendering", "Firestore API", "layout"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/KinsPage.tsx",
    component: () => import("../tricks/KinsPage"),
  },
  {
    id: "composition-search",
    title: "Composition Search (IME)",
    description:
      "Use onCompositionStart/onCompositionEnd so search waits until Japanese IME input is committed.",
    category: "React",
    technologies: ["React", "IME composition", "onCompositionStart"],
    thumbnail: compositionSearchThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/CompositionSearch.tsx",
    component: () => import("../tricks/CompositionSearch"),
  },
  {
    id: "glassmorphism",
    title: "Glassmorphism Card",
    description:
      "Frosted glass effect with backdrop-filter and translucent layers.",
    category: "CSS",
    technologies: ["backdrop-filter", "CSS", "opacity"],
    thumbnail: glassmorphismThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/Glassmorphism.tsx",
    component: () => import("../tricks/Glassmorphism"),
  },
  {
    id: "use-local-storage",
    title: "useLocalStorage Hook",
    description:
      "A custom hook that syncs React state with localStorage automatically.",
    category: "React",
    technologies: ["React hooks", "localStorage", "JSON"],
    thumbnail: useLocalStorageThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/UseLocalStorage.tsx",
    component: () => import("../tricks/UseLocalStorage"),
  },
  {
    id: "progress-steps",
    title: "Progress Steps",
    description:
      "A step indicator with active state, connecting line, and next/prev controls.",
    category: "JS",
    technologies: ["React state", "progress UI", "buttons"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/ProgressSteps.tsx",
    component: () => import("../tricks/ProgressSteps"),
  },
  {
    id: "blurry-loading",
    title: "Blurry Loading",
    description:
      "Blur reveal loading effect demo migrated from legacy project.",
    category: "JS",
    technologies: ["DOM", "CSS filter", "timers"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/BlurryLoading.tsx",
    component: () => import("../tricks/BlurryLoading"),
  },
  {
    id: "breakout-game",
    title: "Breakout Game",
    description: "Canvas breakout game demo migrated from legacy project.",
    category: "JS",
    technologies: ["Canvas", "game loop", "keyboard input"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/BreakoutGame.tsx",
    component: () => import("../tricks/BreakoutGame"),
  },
  {
    id: "dom-methods",
    title: "DOM Methods",
    description: "DOM array methods demo migrated from legacy project.",
    category: "JS",
    technologies: ["fetch", "array methods", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/DomMethods.tsx",
    component: () => import("../tricks/DomMethods"),
  },
  {
    id: "exapanse-tracker",
    title: "Exapanse Tracker",
    description: "Expense tracker demo migrated from legacy project.",
    category: "JS",
    technologies: ["localStorage", "forms", "state"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/ExapanseTracker.tsx",
    component: () => import("../tricks/ExapanseTracker"),
  },
  {
    id: "extending-cards",
    title: "Extending Cards",
    description: "Expanding cards interaction migrated from legacy project.",
    category: "CSS",
    technologies: ["events", "CSS transitions", "classes"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/ExtendingCards.tsx",
    component: () => import("../tricks/ExtendingCards"),
  },
  {
    id: "faq-collapse",
    title: "FAQ Collapse",
    description: "FAQ collapse interaction migrated from legacy project.",
    category: "CSS",
    technologies: ["events", "DOM", "classes"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/FaqCollapse.tsx",
    component: () => import("../tricks/FaqCollapse"),
  },
  {
    id: "form-validator-legacy",
    title: "Form Validator",
    description: "Validation flow migrated from legacy project.",
    category: "JS",
    technologies: ["forms", "validation", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/FormValidatorLegacy.tsx",
    component: () => import("../tricks/FormValidatorLegacy"),
  },
  {
    id: "form-wave-animation",
    title: "Form Wave Animation",
    description: "Wave label animation migrated from legacy project.",
    category: "CSS",
    technologies: ["CSS animation", "labels", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/FormWaveAnimation.tsx",
    component: () => import("../tricks/FormWaveAnimation"),
  },
  {
    id: "hangman-legacy",
    title: "Hangman",
    description: "Hangman mini-game migrated from legacy project.",
    category: "JS",
    technologies: ["SVG", "events", "game logic"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/HangmanLegacy.tsx",
    component: () => import("../tricks/HangmanLegacy"),
  },
  {
    id: "hidden-search",
    title: "Hidden Search",
    description: "Expandable search input migrated from legacy project.",
    category: "CSS",
    technologies: ["events", "focus", "transitions"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/HiddenSearch.tsx",
    component: () => import("../tricks/HiddenSearch"),
  },
  {
    id: "infinite-scroll",
    title: "Infinite Scroll",
    description: "Infinite scroll feed migrated from legacy project.",
    category: "JS",
    technologies: ["scroll", "fetch", "pagination"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/InfiniteScroll.tsx",
    component: () => import("../tricks/InfiniteScroll"),
  },
  {
    id: "key-codes",
    title: "Key Codes",
    description: "Keyboard event visualizer migrated from legacy project.",
    category: "JS",
    technologies: ["KeyboardEvent", "DOM", "events"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/KeyCodes.tsx",
    component: () => import("../tricks/KeyCodes"),
  },

  {
    id: "lyrics-search",
    title: "Lyrics Search",
    description: "Lyrics search demo migrated from legacy project.",
    category: "JS",
    technologies: ["API", "fetch", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/LyricsSearch.tsx",
    component: () => import("../tricks/LyricsSearch"),
  },
  {
    id: "meal-search",
    title: "Meal Search",
    description: "Meal finder demo migrated from legacy project.",
    category: "JS",
    technologies: ["API", "search", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/MealSearch.tsx",
    component: () => import("../tricks/MealSearch"),
  },
  {
    id: "memory-cards",
    title: "Memory Cards",
    description: "Flashcard interaction migrated from legacy project.",
    category: "JS",
    technologies: ["transforms", "localStorage", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/MemoryCards.tsx",
    component: () => import("../tricks/MemoryCards"),
  },
  {
    id: "menu-modal",
    title: "Menu Modal",
    description: "Menu and modal UI demo migrated from legacy project.",
    category: "JS",
    technologies: ["modal", "menu", "events"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/MenuModal.tsx",
    component: () => import("../tricks/MenuModal"),
  },
  {
    id: "mine-sweeper",
    title: "Mine Sweeper",
    description: "Mine sweeper game migrated from legacy project.",
    category: "JS",
    technologies: ["grid", "events", "game logic"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/MineSweeper.tsx",
    component: () => import("../tricks/MineSweeper"),
  },
  {
    id: "movie-seat",
    title: "Movie Seat",
    description: "Seat picker demo migrated from legacy project.",
    category: "JS",
    technologies: ["localStorage", "events", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/MovieSeat.tsx",
    component: () => import("../tricks/MovieSeat"),
  },
  {
    id: "music-player",
    title: "Music Player",
    description: "Audio player demo migrated from legacy project.",
    category: "JS",
    technologies: ["audio", "controls", "progress"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/MusicPlayer.tsx",
    component: () => import("../tricks/MusicPlayer"),
  },
  {
    id: "random-choice-picker",
    title: "Random Choice Picker",
    description: "Random picker demo migrated from legacy project.",
    category: "JS",
    technologies: ["timers", "random", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/RandomChoicePicker.tsx",
    component: () => import("../tricks/RandomChoicePicker"),
  },
  {
    id: "rotating-navigation",
    title: "Rotating Navigation",
    description: "Rotating nav effect migrated from legacy project.",
    category: "CSS",
    technologies: ["transforms", "navigation", "events"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/RotatingNavigation.tsx",
    component: () => import("../tricks/RotatingNavigation"),
  },
  {
    id: "scroll-animation-legacy",
    title: "Scroll Animation (Legacy)",
    description: "Scroll reveal demo migrated from legacy project.",
    category: "CSS",
    technologies: ["scroll", "classes", "transitions"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/ScrollAnimationLegacy.tsx",
    component: () => import("../tricks/ScrollAnimationLegacy"),
  },
  {
    id: "sortable-list",
    title: "Sortable List",
    description: "Drag and drop list demo migrated from legacy project.",
    category: "JS",
    technologies: ["drag and drop", "list", "events"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/SortableList.tsx",
    component: () => import("../tricks/SortableList"),
  },
  {
    id: "typing-game",
    title: "Typing Game",
    description: "Typing speed game migrated from legacy project.",
    category: "JS",
    technologies: ["timers", "input", "game logic"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/TypingGame.tsx",
    component: () => import("../tricks/TypingGame"),
  },
  {
    id: "exchange-rate-calculator",
    title: "Exchange Rate Calculator",
    description: "Currency conversion demo migrated from legacy project.",
    category: "JS",
    technologies: ["API", "currency", "forms"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/ExchangeRateCalculator.tsx",
    component: () => import("../tricks/ExchangeRateCalculator"),
  },
  {
    id: "newyear-countdown",
    title: "New Year CountDown",
    description: "Countdown timer demo migrated from legacy project.",
    category: "JS",
    technologies: ["Date", "timers", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/NewYearCountDown.tsx",
    component: () => import("../tricks/NewYearCountDown"),
  },
  {
    id: "number-guessing-game",
    title: "Number Guessing Game",
    description: "Speech-based guessing game migrated from legacy project.",
    category: "JS",
    technologies: ["Web Speech API", "game", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/NumberGuessingGame.tsx",
    component: () => import("../tricks/NumberGuessingGame"),
  },
  {
    id: "relaxer-legacy",
    title: "Relaxer",
    description: "Breathing exercise animation migrated from legacy project.",
    category: "JS",
    technologies: ["timers", "animation", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/RelaxerLegacy.tsx",
    component: () => import("../tricks/RelaxerLegacy"),
  },
  {
    id: "sass-demo",
    title: "Sass Demo",
    description: "Sass-based layout demo migrated from legacy project.",
    category: "CSS",
    technologies: ["Sass", "layout", "components"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/SassDemo.tsx",
    component: () => import("../tricks/SassDemo"),
  },
  {
    id: "sound-board",
    title: "Sound Board",
    description: "Soundboard demo migrated from legacy project.",
    category: "JS",
    technologies: ["audio", "buttons", "events"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/SoundBoard.tsx",
    component: () => import("../tricks/SoundBoard"),
  },
  {
    id: "speech-text-reader",
    title: "Speech Text Reader",
    description: "Text-to-speech cards demo migrated from legacy project.",
    category: "JS",
    technologies: ["SpeechSynthesis", "cards", "modal"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/SpeechTextReader.tsx",
    component: () => import("../tricks/SpeechTextReader"),
  },
  {
    id: "split-landing-page",
    title: "Split Landing Page",
    description: "Split hero interaction migrated from legacy project.",
    category: "CSS",
    technologies: ["hover", "layout", "transitions"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/SplitLandingPage.tsx",
    component: () => import("../tricks/SplitLandingPage"),
  },
  {
    id: "tesla-configuration",
    title: "Tesla Configuration",
    description: "Vehicle configuration UI migrated from legacy project.",
    category: "JS",
    technologies: ["state", "UI controls", "images"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/TeslaConfiguration.tsx",
    component: () => import("../tricks/TeslaConfiguration"),
  },
  {
    id: "video-legacy",
    title: "Video Player",
    description: "Custom video controls demo migrated from legacy project.",
    category: "JS",
    technologies: ["video", "controls", "progress"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/VideoLegacy.tsx",
    component: () => import("../tricks/VideoLegacy"),
  },
  {
    id: "winbox-landing-page",
    title: "Winbox Landing Page",
    description: "Landing page demo migrated from legacy project.",
    category: "JS",
    technologies: ["layout", "UI", "interactions"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/WinboxLandingPage.tsx",
    component: () => import("../tricks/WinboxLandingPage"),
  },
  {
    id: "scroll-animations",
    title: "Scroll-Driven Animations",
    description:
      "Animate elements on scroll using pure CSS animation-timeline.",
    category: "CSS",
    technologies: ["animation-timeline", "CSS", "scroll()"],
    thumbnail: scrollAnimationsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/ScrollAnimations.tsx",
    component: () => import("../tricks/ScrollAnimations"),
  },
  {
    id: "intersection-observer",
    title: "Intersection Observer",
    description:
      "Lazy-load images and trigger animations when elements enter the viewport.",
    category: "JS",
    technologies: ["IntersectionObserver", "JavaScript", "lazy loading"],
    thumbnail: intersectionObserverThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/IntersectionObserverDemo.tsx",
    component: () => import("../tricks/IntersectionObserverDemo"),
  },
  {
    id: "optimistic-ui",
    title: "Optimistic UI Updates",
    description:
      "Update the UI instantly before the server confirms, then reconcile.",
    category: "React",
    technologies: ["React", "useState", "async"],
    thumbnail: optimisticUIThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/OptimisticUI.tsx",
    component: () => import("../tricks/OptimisticUI"),
  },
  {
    id: "container-queries",
    title: "Container Queries",
    description:
      "Style components based on their parent size, not the viewport.",
    category: "CSS",
    technologies: ["@container", "CSS", "container-type"],
    thumbnail: containerQueriesThumb,
    githubUrl:
      "https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/src/tricks/ContainerQueries.tsx",
    component: () => import("../tricks/ContainerQueries"),
  },
];

const legacyThumbnailById: Record<string, string> = {
  "blurry-loading": "/thumbnails/legacy/blurry-loading.png",
  "breakout-game": "/thumbnails/legacy/breakout.png",
  "dom-methods": "/thumbnails/legacy/dom-methods.jpg",
  "exapanse-tracker": "/thumbnails/legacy/expance-tracker.jpg",
  "extending-cards": "/thumbnails/legacy/extending-cards.png",
  "faq-collapse": "/thumbnails/legacy/faq-collapse.png",
  "form-validator-legacy": "/thumbnails/legacy/form-validator.jpg",
  "form-wave-animation": "/thumbnails/legacy/form-wave-animation.png",
  "hangman-legacy": "/thumbnails/legacy/hangman.jpg",
  "hidden-search": "/thumbnails/legacy/hidden-search.png",
  "infinite-scroll": "/thumbnails/legacy/infinite-scroll.jpg",
  "key-codes": "/thumbnails/legacy/key-codes.png",
  "kins-page": "/thumbnails/legacy/kins-page.png",
  "lyrics-search": "/thumbnails/legacy/lyrics-search.jpg",
  "meal-search": "/thumbnails/legacy/meals-search.jpg",
  "memory-cards": "/thumbnails/legacy/memory-cards.jpg",
  "menu-modal": "/thumbnails/legacy/menu-modal.jpg",
  "mine-sweeper": "/thumbnails/legacy/mine-sweeper.png",
  "movie-seat": "/thumbnails/legacy/movie-seat.jpg",
  "music-player": "/thumbnails/legacy/music-player.png",
  "random-choice-picker": "/thumbnails/legacy/random-choice-picker.png",
  "rotating-navigation": "/thumbnails/legacy/rotating-navigation.png",
  "scroll-animation-legacy": "/thumbnails/legacy/scroll-animation.png",
  "sortable-list": "/thumbnails/legacy/sortable-list.png",
  "typing-game": "/thumbnails/legacy/typing-game.jpg",
  "exchange-rate-calculator": "/thumbnails/legacy/exchange-rate.jpg",
  "newyear-countdown": "/thumbnails/legacy/new-year.png",
  "number-guessing-game": "/thumbnails/legacy/guess-number.png",
  "relaxer-legacy": "/thumbnails/legacy/relaxer.png",
  "sass-demo": "/thumbnails/legacy/sass-demo.png",
  "sound-board": "/thumbnails/legacy/sound-board.png",
  "speech-text-reader": "/thumbnails/legacy/speech-text-reader.jpg",
  "split-landing-page": "/thumbnails/legacy/split-landing-page.png",
  "tesla-configuration": "/thumbnails/legacy/tesla-configuration.png",
  "video-legacy": "/thumbnails/legacy/video.jpg",
  "winbox-landing-page": "/thumbnails/legacy/winbox-landing-page.png",
};

const legacySourceFolderById: Record<string, string> = {
  "blurry-loading": "Blurry-Loading",
  "breakout-game": "Breakout-Game",
  "dom-methods": "Dom-Methods",
  "exapanse-tracker": "Exapanse-Tracker",
  "extending-cards": "Extending-Cards",
  "faq-collapse": "FAQ-Collapse",
  "form-validator-legacy": "Form-Validator",
  "form-wave-animation": "Form-Wave-Animation",
  "hangman-legacy": "Hangman",
  "hidden-search": "Hidden-Search",
  "infinite-scroll": "Infinite-Scroll",
  "key-codes": "Key-Codes",
  "kins-page": "Kins-Page",
  "lyrics-search": "Lyrics-Search",
  "meal-search": "Meal-Search",
  "memory-cards": "Memory-Cards",
  "menu-modal": "Menu-Modal",
  "mine-sweeper": "Mine-Sweeper",
  "movie-seat": "Movie-Seat",
  "music-player": "Music-Player",
  "random-choice-picker": "Random-Choice-Picker",
  "rotating-navigation": "Rotating-Navigation",
  "scroll-animation-legacy": "Scroll-Animation",
  "sortable-list": "Sortable-List",
  "typing-game": "Typing-Game",
  "exchange-rate-calculator": "Exchange-Rate-Calculator",
  "newyear-countdown": "NewYear-CountDown",
  "number-guessing-game": "Number-Guessing-Game",
  "relaxer-legacy": "Relaxer",
  "sass-demo": "Sass-Demo",
  "sound-board": "Sound-Board",
  "speech-text-reader": "Speech-Text-Reader",
  "split-landing-page": "Split-Landing-Page",
  "tesla-configuration": "Tesla-Configuration",
  "video-legacy": "Video",
  "winbox-landing-page": "Winbox-Landing-Page",
};

export const tricks: Trick[] = trickList.map((trick) => {
  const sourceFolder = legacySourceFolderById[trick.id];
  const githubUrl = sourceFolder
    ? `https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks/public/legacy-tricks/${sourceFolder}`
    : trick.githubUrl;

  if (trick.thumbnail === progressStepsThumb && trick.id !== "progress-steps") {
    const mappedThumbnail = legacyThumbnailById[trick.id];
    if (mappedThumbnail) {
      return { ...trick, githubUrl, thumbnail: mappedThumbnail };
    }
    return { ...trick, githubUrl, thumbnail: progressStepsThumb };
  }
  return { ...trick, githubUrl };
});
