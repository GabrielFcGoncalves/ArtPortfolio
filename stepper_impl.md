# Stepper Component Documentation

The `Stepper` component is a robust, animated multi-step navigation system used to guide users through complex workflows (like creating campaigns or editing quizzes). It is built using **React** and **Framer Motion** (`motion/react`) for smooth transitions.

## Overview

Located at: `src/components/ui/Stepper.tsx`

The `Stepper` manages:

- **Current Step State**: Tracks the user's progress through a series of children.
- **Directional Animations**: Handles slide-in/out transitions based on whether the user is moving forward or backward.
- **Validation**: Supports synchronous and asynchronous validation for each step.
- **Progress Visualization**: Displays indicators with custom icons, completion states, and optional warnings.

---

## Core Components

### `Stepper`

The primary wrapper component that manages the state and provides navigation controls.

#### Key Props

| Prop                   | Type                                            | Description                                                                               |
| :--------------------- | :---------------------------------------------- | :---------------------------------------------------------------------------------------- |
| `children`             | `ReactNode`                                     | A list of `<Step />` components.                                                          |
| `initialStep`          | `number`                                        | The step to start on (defaults to 1).                                                     |
| `validateStep`         | `(step: number) => boolean \| Promise<boolean>` | A function called before moving to the next step. If return `false`, progress is blocked. |
| `onBeforeComplete`     | `() => Promise<boolean> \| boolean`             | Called on the final step before completion.                                               |
| `onFinalStepCompleted` | `() => void`                                    | Callback triggered after the final step.                                                  |
| `stepIcons`            | `LucideIcon[]`                                  | Array of icons for each step's active/inactive state.                                     |
| `stepCompletedIcons`   | `LucideIcon[]`                                  | Array of icons for each step's completed state.                                           |
| `stepWarnings`         | `number[]`                                      | Array of step numbers that should show a warning indicator.                               |

### `Step`

A simple wrapper for individual step content.

```tsx
<Step>
  <YourComponent />
</Step>
```

---

## Technical Workflow

### 1. Initial State

The component initializes `currentStep` (defaults to 1) and `direction` (set to 0). It uses `Children.toArray(children)` to manage steps dynamically.

### 2. Navigation

- **`handleNext`**: If `validateStep` is provided, it awaits validation. On success, sets `direction` to `1` and increments the step.
- **`handleBack`**: Sets `direction` to `-1` and decrements the step.
- **Direct Click**: Indicators allow users to return to previous steps (but not jump forward past unvalidated steps).

### 3. Animations

The `StepContentWrapper` uses `AnimatePresence` and `SlideTransition` to animate step changes.

- **Slide Forward**: New content slides in from the right (`80px`), old content slides out to the left (`-40px`).
- **Slide Backward**: New content slides in from the left (`-80px`), old content slides out to the right (`40px`).

### 4. Validation & Submission

Validation can be tied to a context or internal state.

```tsx
const validateStep = (step: number) => {
  if (step === 1 && !formData.name) {
    toast.error("Name is required");
    return false;
  }
  return true;
};
```

---

## Example Usage

Snippet from `CampaignStepperFlow.tsx`:

```tsx
import Stepper, { Step } from "@/components/ui/Stepper";

export default function CampaignFlow() {
  const validateStep = async (step: number) => {
    // Custom logic per step
    return true;
  };

  return (
    <Stepper
      initialStep={1}
      validateStep={validateStep}
      onBeforeComplete={submitCampaign}
      stepIcons={[BookOpen, UserRound, Package]}
      stepCompletedIcons={[BookOpenCheck, UserRoundCheck, PackageCheck]}
    >
      <Step>
        <CampaignForms />
      </Step>
      <Step>
        <TargetGroupSelector />
      </Step>
      <Step>
        <PhishingKitPicker />
      </Step>
    </Stepper>
  );
}
```

---

## UI/UX Features

- **Sticky Footer**: Navigation buttons are always accessible at the bottom.
- **Responsive Indicators**: Step connectors animate from 0% to 100% width upon completion.
- **Loading State**: The "Continue" button shows a spinner if `validateStep` is asynchronous.
- **Semantic Structure**: Uses a clear separation between Header (Indicators), Content (Animated Area), and Footer (Buttons).

this is the html for each step
convert it to react compoenents
put the component under /components/artpiece_creation_stepper/

first step

<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "surface-container-highest": "#e3e2e2",
              "primary": "#7a5642",
              "on-tertiary": "#ffffff",
              "primary-fixed": "#ffdbca",
              "tertiary-fixed-dim": "#b8cdaa",
              "surface-variant": "#e3e2e2",
              "on-primary-fixed": "#2e1506",
              "tertiary": "#516447",
              "secondary-fixed": "#ffdcbd",
              "surface": "#faf9f9",
              "error": "#ba1a1a",
              "on-tertiary-fixed-variant": "#3a4c31",
              "secondary": "#7c5730",
              "on-secondary": "#ffffff",
              "inverse-primary": "#ecbda4",
              "on-primary-fixed-variant": "#603f2d",
              "inverse-surface": "#2f3131",
              "background": "#faf9f9",
              "on-surface-variant": "#50443e",
              "surface-tint": "#7a5642",
              "surface-container-lowest": "#ffffff",
              "outline-variant": "#d4c3bb",
              "on-secondary-fixed-variant": "#61401b",
              "error-container": "#ffdad6",
              "primary-fixed-dim": "#ecbda4",
              "surface-dim": "#dadada",
              "on-tertiary-container": "#3c4d32",
              "surface-container-low": "#f4f3f3",
              "primary-container": "#dcae96",
              "on-background": "#1a1c1c",
              "tertiary-fixed": "#d4e9c4",
              "outline": "#82746d",
              "on-tertiary-fixed": "#101f09",
              "on-secondary-container": "#79542d",
              "surface-container-high": "#e9e8e8",
              "surface-container": "#eeeeee",
              "on-primary": "#ffffff",
              "on-surface": "#1a1c1c",
              "secondary-fixed-dim": "#eebd8e",
              "secondary-container": "#fdcb9b",
              "on-secondary-fixed": "#2c1600",
              "surface-bright": "#faf9f9",
              "tertiary-container": "#a9be9b",
              "inverse-on-surface": "#f1f0f0",
              "on-error": "#ffffff",
              "on-primary-container": "#62412e",
              "on-error-container": "#93000a"
            },
            fontFamily: {
              "headline": ["Manrope"],
              "body": ["Inter"],
              "label": ["Inter"]
            },
            borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #faf9f9;
            color: #1a1c1c;
        }
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>
</head>
<body class="bg-background text-on-background min-h-screen">
<!-- Background Dashboard (Artist OS) - Blurred/Dimmed -->
<div class="fixed inset-0 z-0 flex overflow-hidden">
<!-- SideNavBar -->
<aside class="fixed left-0 top-0 flex flex-col p-6 space-y-4 h-screen w-64 border-r border-primary/10 bg-[#f4f3f3] dark:bg-[#1a1c1c] font-['Inter'] text-sm font-medium transition-all duration-300 ease-in-out opacity-40 grayscale-[0.5] blur-[2px]">
<div class="flex items-center space-x-3 mb-8">
<div class="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-primary" data-icon="brush">brush</span>
</div>
<div>
<h1 class="font-['Manrope'] font-bold text-primary text-lg">The Atelier</h1>
<p class="text-xs text-on-surface-variant/70">Creative Studio</p>
</div>
</div>
<nav class="flex-1 space-y-2">
<div class="flex items-center space-x-3 p-3 text-on-surface-variant hover:text-primary hover:bg-[#ffffff]/50 rounded-lg">
<span class="material-symbols-outlined" data-icon="grid_view">grid_view</span>
<span>Gallery</span>
</div>
<div class="flex items-center space-x-3 p-3 text-on-surface-variant hover:text-primary hover:bg-[#ffffff]/50 rounded-lg">
<span class="material-symbols-outlined" data-icon="auto_awesome_motion">auto_awesome_motion</span>
<span>Collections</span>
</div>
<div class="flex items-center space-x-3 p-3 text-on-surface-variant hover:text-primary hover:bg-[#ffffff]/50 rounded-lg">
<span class="material-symbols-outlined" data-icon="analytics">analytics</span>
<span>Insights</span>
</div>
<div class="flex items-center space-x-3 p-3 text-primary bg-[#ffffff] rounded-lg shadow-sm">
<span class="material-symbols-outlined" data-icon="brush">brush</span>
<span>Atelier</span>
</div>
<div class="flex items-center space-x-3 p-3 text-on-surface-variant hover:text-primary hover:bg-[#ffffff]/50 rounded-lg">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span>Settings</span>
</div>
</nav>
</aside>
<!-- Main Content Area (Background) -->
<main class="ml-64 flex-1 p-12 opacity-30 blur-sm">
<header class="mb-12">
<h2 class="text-4xl font-headline font-extrabold tracking-tight text-primary mb-2">Artist Dashboard</h2>
<div class="h-1 w-24 bg-primary-container"></div>
</header>
<div class="grid grid-cols-12 gap-8">
<div class="col-span-8 space-y-8">
<div class="h-64 bg-surface-container-low rounded-xl"></div>
<div class="grid grid-cols-3 gap-6">
<div class="h-40 bg-surface-container-low rounded-xl"></div>
<div class="h-40 bg-surface-container-low rounded-xl"></div>
<div class="h-40 bg-surface-container-low rounded-xl"></div>
</div>
</div>
<div class="col-span-4 h-full bg-surface-container-low rounded-xl"></div>
</div>
</main>
</div>
<!-- Modal Overlay -->
<div class="fixed inset-0 z-[60] flex items-center justify-center bg-on-surface/10 backdrop-blur-sm px-4">
<!-- Modal Content: Add New Art Piece -->
<div class="bg-surface-container-lowest w-full max-w-2xl rounded-xl shadow-[0_10px_40px_rgba(122,86,66,0.06)] overflow-hidden flex flex-col">
<!-- Modal Header & Stepper -->
<div class="px-10 pt-10 pb-6 border-b border-outline-variant/20">
<div class="flex justify-between items-center mb-8">
<h2 class="text-2xl font-headline font-bold text-on-surface tracking-tight">Add New Art Piece</h2>
<button class="text-outline hover:text-primary transition-colors">
<span class="material-symbols-outlined" data-icon="close">close</span>
</button>
</div>
<!-- Stepper Indicator (50%) -->
<div class="space-y-3">
<div class="flex justify-between text-xs font-label font-medium text-on-surface-variant">
<span>BASIC METADATA</span>
<span class="text-primary">STEP 2 OF 4</span>
</div>
<div class="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
<div class="h-full bg-primary w-1/2 transition-all duration-500"></div>
</div>
</div>
</div>
<!-- Form Content -->
<div class="p-10 space-y-8 overflow-y-auto max-h-[716px] hide-scrollbar">
<!-- Field: Title -->
<div class="space-y-2">
<label class="block text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider" for="piece-title">Title of the Piece</label>
<input class="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 text-on-surface font-body transition-all placeholder:text-outline-variant" id="piece-title" placeholder="e.g., Whispers of the High Desert" type="text"/>
</div>
<!-- Field: The Story -->
<div class="space-y-2">
<label class="block text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider" for="piece-story">The Story</label>
<p class="text-[11px] text-outline mb-2">Narrate the inspiration, process, or the soul behind this creation.</p>
<textarea class="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 text-on-surface font-body transition-all placeholder:text-outline-variant resize-none" id="piece-story" placeholder="It began with the way the morning light hit the terracotta tiles..." rows="5"></textarea>
</div>
<!-- Field: Categories (Multi-select) -->
<div class="space-y-2">
<label class="block text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider">Categories</label>
<div class="relative">
<div class="w-full bg-surface-container-low px-4 py-3 flex flex-wrap gap-2 items-center min-h-[52px]">
<!-- Selected Tags -->
<span class="inline-flex items-center gap-1 bg-secondary-fixed text-on-secondary-container px-3 py-1 rounded-full text-xs font-medium">
                                Fine Art
                                <span class="material-symbols-outlined text-[14px] cursor-pointer" data-icon="close">close</span>
</span>
<span class="inline-flex items-center gap-1 bg-secondary-fixed text-on-secondary-container px-3 py-1 rounded-full text-xs font-medium">
                                Abstract
                                <span class="material-symbols-outlined text-[14px] cursor-pointer" data-icon="close">close</span>
</span>
<input class="flex-1 bg-transparent border-0 focus:ring-0 p-0 text-sm font-body min-w-[120px]" placeholder="Select more..." type="text"/>
<span class="material-symbols-outlined text-outline ml-auto" data-icon="expand_more">expand_more</span>
</div>
<!-- Dropdown Mock (Self-contained Visual) -->
<div class="hidden absolute top-full left-0 w-full mt-2 bg-surface-container-lowest shadow-[0_10px_40px_rgba(122,86,66,0.06)] rounded-lg p-2 z-10 border border-outline-variant/10">
<div class="p-2 hover:bg-surface-container-low rounded cursor-pointer text-sm">Oil Painting</div>
<div class="p-2 hover:bg-surface-container-low rounded cursor-pointer text-sm">Sculpture</div>
<div class="p-2 hover:bg-surface-container-low rounded cursor-pointer text-sm">Digital Print</div>
</div>
</div>
</div>
<!-- Visual Cue (Optional Graphic) -->
<div class="mt-8 p-6 bg-tertiary-container/10 rounded-xl border border-tertiary-container/20 flex items-start gap-4">
<span class="material-symbols-outlined text-tertiary" data-icon="auto_awesome">auto_awesome</span>
<div>
<h4 class="text-sm font-headline font-bold text-on-tertiary-container mb-1">Curation Tip</h4>
<p class="text-xs text-on-tertiary-container/80 leading-relaxed">Pieces with stories longer than 200 words tend to receive 40% more engagement from collectors in the gallery.</p>
</div>
</div>
</div>
<!-- Modal Footer (Actions) -->
<div class="px-10 py-8 bg-surface-container-low flex justify-between items-center">
<button class="flex items-center gap-2 text-primary font-headline font-bold text-sm px-6 py-2 hover:bg-primary-container/10 transition-colors rounded-lg">
<span class="material-symbols-outlined text-[20px]" data-icon="arrow_back">arrow_back</span>
                    Back
                </button>
<button class="bg-primary text-on-primary font-headline font-bold text-sm px-10 py-3 rounded hover:opacity-90 transition-all shadow-md active:scale-95">
                    Continue
                </button>
</div>
</div>
<!-- Decor Floating Elements for "Editorial" Feel -->
<div class="absolute top-20 right-20 w-32 h-32 bg-primary-container/20 rounded-full blur-3xl pointer-events-none"></div>
<div class="absolute bottom-20 left-20 w-48 h-48 bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none"></div>
</div>
</body></html>

second step

<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "surface-container-highest": "#e3e2e2",
              "primary": "#7a5642",
              "on-tertiary": "#ffffff",
              "primary-fixed": "#ffdbca",
              "tertiary-fixed-dim": "#b8cdaa",
              "surface-variant": "#e3e2e2",
              "on-primary-fixed": "#2e1506",
              "tertiary": "#516447",
              "secondary-fixed": "#ffdcbd",
              "surface": "#faf9f9",
              "error": "#ba1a1a",
              "on-tertiary-fixed-variant": "#3a4c31",
              "secondary": "#7c5730",
              "on-secondary": "#ffffff",
              "inverse-primary": "#ecbda4",
              "on-primary-fixed-variant": "#603f2d",
              "inverse-surface": "#2f3131",
              "background": "#faf9f9",
              "on-surface-variant": "#50443e",
              "surface-tint": "#7a5642",
              "surface-container-lowest": "#ffffff",
              "outline-variant": "#d4c3bb",
              "on-secondary-fixed-variant": "#61401b",
              "error-container": "#ffdad6",
              "primary-fixed-dim": "#ecbda4",
              "surface-dim": "#dadada",
              "on-tertiary-container": "#3c4d32",
              "surface-container-low": "#f4f3f3",
              "primary-container": "#dcae96",
              "on-background": "#1a1c1c",
              "tertiary-fixed": "#d4e9c4",
              "outline": "#82746d",
              "on-tertiary-fixed": "#101f09",
              "on-secondary-container": "#79542d",
              "surface-container-high": "#e9e8e8",
              "surface-container": "#eeeeee",
              "on-primary": "#ffffff",
              "on-surface": "#1a1c1c",
              "secondary-fixed-dim": "#eebd8e",
              "secondary-container": "#fdcb9b",
              "on-secondary-fixed": "#2c1600",
              "surface-bright": "#faf9f9",
              "tertiary-container": "#a9be9b",
              "inverse-on-surface": "#f1f0f0",
              "on-error": "#ffffff",
              "on-primary-container": "#62412e",
              "on-error-container": "#93000a"
            },
            fontFamily: {
              "headline": ["Manrope"],
              "body": ["Inter"],
              "label": ["Inter"]
            },
            borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="bg-surface text-on-surface font-body antialiased">
<div class="fixed inset-0 flex items-center justify-center z-[100] p-4 md:p-8">
<div class="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"></div>
<div class="relative w-full max-w-4xl bg-surface-container-lowest shadow-[0_10px_40px_rgba(122,86,66,0.06)] overflow-hidden flex flex-col max-h-[921px]">
<header class="p-8 border-b border-outline-variant/20 flex justify-between items-start">
<div>
<h2 class="text-2xl font-headline font-bold text-primary tracking-tight">Protection Settings</h2>
<p class="text-on-surface-variant font-label mt-1">Step 3 of 4: Safeguarding your creative intellectual property.</p>
</div>
<div class="flex flex-col items-end gap-2">
<div class="flex gap-1">
<div class="h-1.5 w-8 rounded-full bg-primary"></div>
<div class="h-1.5 w-8 rounded-full bg-primary"></div>
<div class="h-1.5 w-8 rounded-full bg-primary"></div>
<div class="h-1.5 w-8 rounded-full bg-surface-container-highest"></div>
</div>
<span class="text-[10px] font-bold uppercase tracking-widest text-primary/60">75% Complete</span>
</div>
</header>
<div class="flex-1 overflow-y-auto p-8 no-scrollbar">
<div class="grid grid-cols-1 md:grid-cols-12 gap-12">
<div class="md:col-span-7 space-y-10">
<section>
<div class="flex items-center gap-3 mb-6">
<span class="material-symbols-outlined text-primary" data-icon="security">security</span>
<h3 class="font-headline font-bold text-lg text-on-surface">Security &amp; Privacy</h3>
</div>
<div class="space-y-6">
<div class="flex items-center justify-between p-4 bg-surface-container-low transition-colors hover:bg-surface-container-high group">
<div class="flex flex-col">
<span class="font-semibold text-on-surface">Disable Right-Click</span>
<span class="text-xs text-on-surface-variant">Prevents visitors from saving images via context menu</span>
</div>
<label class="relative inline-flex items-center cursor-pointer">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
<div class="flex items-center justify-between p-4 bg-surface-container-low transition-colors hover:bg-surface-container-high">
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="font-semibold text-on-surface">NoAI Protections</span>
<span class="px-2 py-0.5 bg-secondary-fixed text-[10px] font-bold text-on-secondary-fixed rounded-full uppercase tracking-tighter">Recommended</span>
</div>
<span class="text-xs text-on-surface-variant">Adds metadata and CSS headers to block AI scrapers</span>
</div>
<label class="relative inline-flex items-center cursor-pointer">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
</section>
<section>
<div class="flex items-center gap-3 mb-6">
<span class="material-symbols-outlined text-primary" data-icon="brand_awareness">brand_awareness</span>
<h3 class="font-headline font-bold text-lg text-on-surface">Watermark Styling</h3>
</div>
<div class="bg-surface-container-low p-6 space-y-6">
<div class="flex items-center justify-between">
<span class="font-semibold text-on-surface text-sm">Apply Watermark</span>
<label class="relative inline-flex items-center cursor-pointer">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
<div class="grid grid-cols-2 gap-4">
<button class="flex flex-col items-center gap-3 p-4 border border-primary bg-surface-container-lowest shadow-sm">
<span class="material-symbols-outlined text-primary scale-125" data-icon="center_focus_weak">center_focus_weak</span>
<span class="text-xs font-bold uppercase tracking-widest">Center Logo</span>
</button>
<button class="flex flex-col items-center gap-3 p-4 border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container-lowest transition-all">
<span class="material-symbols-outlined text-on-surface-variant scale-125" data-icon="grid_view">grid_view</span>
<span class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tiled Text</span>
</button>
</div>
<div class="space-y-3">
<label class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Watermark Opacity</label>
<input class="w-full h-1.5 bg-surface-container-highest accent-primary appearance-none cursor-pointer" max="100" min="0" type="range" value="25"/>
<div class="flex justify-between text-[10px] font-medium text-on-surface-variant">
<span>Subtle (10%)</span>
<span>Heavy (80%)</span>
</div>
</div>
</div>
</section>
</div>
<div class="md:col-span-5">
<div class="sticky top-0 space-y-4">
<span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Live Preview</span>
<div class="aspect-[4/5] relative bg-surface-container-low overflow-hidden shadow-inner group">
<img class="w-full h-full object-cover" data-alt="Modern abstract painting with oil textures in warm terracotta and cream tones against a minimal background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO_y2hP15r63myE2RgbU90-8YOuPwbFTZmROoy73mxLgGUDlZ_fpKx6RJrKJWVKzu4xqk8dZ3r2ZVyf0U5cLeeIVz8alWmHztU_F6h8tgt2vwR2iIDjG9v2X2bQfg4XvRrUec7_QA4B9tdFDSEXYt3dTbcxh2Sg7cZLyTDYYcaBxV5_2JTuW5bCAVLAaExNguI3ZT3hvzlD5Kjpd3BXRy3lyjy5oVr6rH1phaCp6ALjMK4dSZkidWj7ydEXVmptgAuEaBhoLQAw6c"/>
<div class="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
<div class="flex flex-col items-center text-white text-center">
<span class="material-symbols-outlined text-6xl" data-icon="brush">brush</span>
<span class="font-headline font-bold text-lg tracking-tighter uppercase mt-2">The Atelier</span>
</div>
</div>
<div class="absolute top-4 right-4 px-2 py-1 bg-black/40 backdrop-blur-md text-[8px] font-bold text-white uppercase tracking-[0.2em]">
                                    Protected by The Curated Atelier
                                </div>
</div>
<p class="text-[11px] leading-relaxed text-on-surface-variant italic">
                                * This preview demonstrates how the central watermark will appear on high-resolution displays.
                            </p>
</div>
</div>
</div>
</div>
<footer class="p-8 bg-surface-container-low flex justify-between items-center">
<button class="flex items-center gap-2 text-primary font-bold text-sm hover:opacity-70 transition-opacity">
<span class="material-symbols-outlined text-sm" data-icon="arrow_back">arrow_back</span>
                    Back
                </button>
<div class="flex gap-4">
<button class="px-8 py-3 bg-tertiary text-on-tertiary text-sm font-bold tracking-wide hover:brightness-110 transition-all active:scale-95">
                        Continue
                    </button>
</div>
</footer>
</div>
</div>
<div class="flex h-screen w-full opacity-30 pointer-events-none select-none">
<aside class="h-screen w-64 bg-[#f4f3f3] p-6 space-y-4 flex flex-col border-r border-[#7a5642]/10">
<div class="flex items-center gap-3 mb-8">
<div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-on-primary">
<span class="material-symbols-outlined" data-icon="brush">brush</span>
</div>
<div>
<h1 class="font-headline font-bold text-[#7a5642] text-sm leading-none">The Atelier</h1>
<span class="text-[10px] text-on-surface-variant">Creative Studio</span>
</div>
</div>
<nav class="space-y-2 flex-1">
<div class="flex items-center gap-3 p-3 text-primary bg-white rounded-lg shadow-sm">
<span class="material-symbols-outlined" data-icon="grid_view">grid_view</span>
<span class="font-medium text-sm">Gallery</span>
</div>
<div class="flex items-center gap-3 p-3 text-on-surface-variant">
<span class="material-symbols-outlined" data-icon="auto_awesome_motion">auto_awesome_motion</span>
<span class="font-medium text-sm">Collections</span>
</div>
<div class="flex items-center gap-3 p-3 text-on-surface-variant">
<span class="material-symbols-outlined" data-icon="analytics">analytics</span>
<span class="font-medium text-sm">Insights</span>
</div>
</nav>
</aside>
<main class="flex-1 p-16 space-y-12 overflow-hidden">
<header class="flex justify-between items-end">
<div>
<h2 class="text-4xl font-headline font-extrabold tracking-tight text-primary">Studio Dashboard</h2>
<p class="text-on-surface-variant mt-2">Manage your curated collections and artist insights.</p>
</div>
<div class="flex gap-4">
<div class="w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</div>
<div class="w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant/30 overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Close-up portrait of a professional artist in a creative studio" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcZdSt1JdPX5ltEhJbWwn6TnHdxdFZDCIbBYLZFdGFZ24hrEgbQJZW3N0mzcQTHXad4m1ZX_BqBo5F72YPahs1cyMpC2hnwZL2xPXX41fvuBMJVA3kGmgG2FRHtJhXATVAwe3OLIU6A0IS4HxvY_CmfBZbBTU5R1HFQH7mt4tbbXnSK6aGeXD33ud5zz2S9Xf-7kKA7rpYuBYzKOAEHMHuK40FppnS6CAkOI7Jy5eef1Mp3ANk_PVqCKAQMLTxJ8rY3BRviaccgNQ"/>
</div>
</div>
</header>
<div class="grid grid-cols-3 gap-8">
<div class="bg-surface-container-low h-48"></div>
<div class="bg-surface-container-low h-48"></div>
<div class="bg-surface-container-low h-48"></div>
</div>
</main>
</div>
</body></html>

third step

<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "surface-container-highest": "#e3e2e2",
              "primary": "#7a5642",
              "on-tertiary": "#ffffff",
              "primary-fixed": "#ffdbca",
              "tertiary-fixed-dim": "#b8cdaa",
              "surface-variant": "#e3e2e2",
              "on-primary-fixed": "#2e1506",
              "tertiary": "#516447",
              "secondary-fixed": "#ffdcbd",
              "surface": "#faf9f9",
              "error": "#ba1a1a",
              "on-tertiary-fixed-variant": "#3a4c31",
              "secondary": "#7c5730",
              "on-secondary": "#ffffff",
              "inverse-primary": "#ecbda4",
              "on-primary-fixed-variant": "#603f2d",
              "inverse-surface": "#2f3131",
              "background": "#faf9f9",
              "on-surface-variant": "#50443e",
              "surface-tint": "#7a5642",
              "surface-container-lowest": "#ffffff",
              "outline-variant": "#d4c3bb",
              "on-secondary-fixed-variant": "#61401b",
              "error-container": "#ffdad6",
              "primary-fixed-dim": "#ecbda4",
              "surface-dim": "#dadada",
              "on-tertiary-container": "#3c4d32",
              "surface-container-low": "#f4f3f3",
              "primary-container": "#dcae96",
              "on-background": "#1a1c1c",
              "tertiary-fixed": "#d4e9c4",
              "outline": "#82746d",
              "on-tertiary-fixed": "#101f09",
              "on-secondary-container": "#79542d",
              "surface-container-high": "#e9e8e8",
              "surface-container": "#eeeeee",
              "on-primary": "#ffffff",
              "on-surface": "#1a1c1c",
              "secondary-fixed-dim": "#eebd8e",
              "secondary-container": "#fdcb9b",
              "on-secondary-fixed": "#2c1600",
              "surface-bright": "#faf9f9",
              "tertiary-container": "#a9be9b",
              "inverse-on-surface": "#f1f0f0",
              "on-error": "#ffffff",
              "on-primary-container": "#62412e",
              "on-error-container": "#93000a"
            },
            fontFamily: {
              "headline": ["Manrope"],
              "body": ["Inter"],
              "label": ["Inter"]
            },
            borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #faf9f9;
            color: #1a1c1c;
        }
        .font-headline { font-family: 'Manrope', sans-serif; }
    </style>
</head>
<body class="bg-surface text-on-surface">
<!-- Top Navigation Bar -->
<nav class="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 w-full bg-[#faf9f9]/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(122,86,66,0.06)]">
<div class="flex items-center gap-4">
<span class="text-xl font-bold text-[#7a5642] font-headline tracking-tight">The Curated Atelier</span>
</div>
<div class="hidden md:flex items-center gap-8">
<a class="font-headline tracking-tight text-[#7a5642] border-b-2 border-[#7a5642] transition-colors" href="#">Gallery</a>
<a class="font-headline tracking-tight text-[#50443e] hover:bg-[#f4f3f3] transition-colors" href="#">Collections</a>
<a class="font-headline tracking-tight text-[#50443e] hover:bg-[#f4f3f3] transition-colors" href="#">Insights</a>
</div>
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-primary cursor-pointer p-2 rounded-full hover:bg-surface-container-low" data-icon="search">search</span>
<span class="material-symbols-outlined text-primary cursor-pointer p-2 rounded-full hover:bg-surface-container-low" data-icon="notifications">notifications</span>
<div class="w-8 h-8 rounded-full bg-primary-container overflow-hidden">
<img alt="Artist Profile" data-alt="Close up portrait of a professional male artist with a creative aesthetic, soft gallery lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIGZm3GcxRReT9gHWaQ4_Xs1khw2pJ-iraidxNGV0qynRLjIKt33_ij-f2NFF0JWRAJw_XWHzkdz5e5T5rtq4f09ONoeQzAe9khvkARHjizkRMEnEUeGI18ac7watXFoMy87Vxr-qpAvL3DrK-0lyZNc0XotFbes0xGmta9BUXwKTa8hGTj_vNfBIiM1nlb5aAZe6K77gVo4yZ_ene0GPDSITDFGzJlnYcqfIjU1YiyHtEn2qGhFCP2tR4QvliLGrh-FnPAsXkyY4"/>
</div>
</div>
</nav>
<!-- Side Navigation Bar -->
<aside class="fixed left-0 top-0 hidden md:flex h-screen w-64 border-r border-[#7a5642]/10 bg-[#f4f3f3] flex-col p-6 pt-24 space-y-4">
<div class="mb-8">
<div class="flex items-center gap-3 mb-1">
<div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-on-primary" data-icon="brush">brush</span>
</div>
<div>
<h3 class="font-headline font-bold text-[#7a5642]">The Atelier</h3>
<p class="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Creative Studio</p>
</div>
</div>
</div>
<nav class="flex-1 space-y-1">
<a class="flex items-center gap-3 px-4 py-3 text-[#7a5642] bg-[#ffffff] rounded-lg shadow-sm font-medium transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="grid_view">grid_view</span>
<span>Gallery</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#50443e] hover:text-[#7a5642] hover:bg-[#ffffff]/50 rounded-lg font-medium transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="auto_awesome_motion">auto_awesome_motion</span>
<span>Collections</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#50443e] hover:text-[#7a5642] hover:bg-[#ffffff]/50 rounded-lg font-medium transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="analytics">analytics</span>
<span>Insights</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#50443e] hover:text-[#7a5642] hover:bg-[#ffffff]/50 rounded-lg font-medium transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="brush">brush</span>
<span>Atelier</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#50443e] hover:text-[#7a5642] hover:bg-[#ffffff]/50 rounded-lg font-medium transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span>Settings</span>
</a>
</nav>
<div class="pt-6 border-t border-outline-variant/20 space-y-1">
<a class="flex items-center gap-3 px-4 py-2 text-[#50443e] hover:text-[#7a5642] text-sm font-medium" href="#">
<span class="material-symbols-outlined text-lg" data-icon="help_outline">help_outline</span>
<span>Support</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 text-[#50443e] hover:text-[#7a5642] text-sm font-medium" href="#">
<span class="material-symbols-outlined text-lg" data-icon="archive">archive</span>
<span>Archive</span>
</a>
</div>
</aside>
<!-- Main Dashboard Content (The Backdrop) -->
<main class="md:ml-64 pt-24 pb-12 px-8">
<header class="mb-12">
<h1 class="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Artist OS</h1>
<p class="text-on-surface-variant font-body">Manage your creative ecosystem and digital archives.</p>
</header>
<!-- Mock Dashboard Content -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
<div class="bg-surface-container-lowest p-8 rounded-xl shadow-[0_10px_40px_rgba(122,86,66,0.06)] h-48 flex flex-col justify-end">
<p class="text-sm font-label text-on-surface-variant mb-1">Active Pieces</p>
<p class="text-3xl font-headline font-bold text-primary">24</p>
</div>
<div class="bg-surface-container-lowest p-8 rounded-xl shadow-[0_10px_40px_rgba(122,86,66,0.06)] h-48 flex flex-col justify-end">
<p class="text-sm font-label text-on-surface-variant mb-1">Collection Value</p>
<p class="text-3xl font-headline font-bold text-primary">$12,480</p>
</div>
<div class="bg-surface-container-lowest p-8 rounded-xl shadow-[0_10px_40px_rgba(122,86,66,0.06)] h-48 flex flex-col justify-end">
<p class="text-sm font-label text-on-surface-variant mb-1">Exhibition Requests</p>
<p class="text-3xl font-headline font-bold text-primary">3</p>
</div>
</div>
<div class="bg-surface-container-low rounded-xl p-8 mb-12">
<h2 class="text-xl font-headline font-bold text-on-surface mb-6">Recent Creations</h2>
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
<div class="aspect-square bg-surface-container-lowest rounded-lg overflow-hidden group">
<img alt="Artwork 1" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Modern abstract oil painting with warm earthy tones and heavy impasto textures" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8YXcW-wQ5CcU5GYblOxpmh4JVzZNl5o6GkRxGl7UOwl-qegS89Tja0RgGtQvm4rerXuLEeuXsiGMJMA8lIWWtMb7xYHM2pTLX1muzmhmfcaOIy7A_bD9oHkA3vXjYzcubcz0JMhgxMXAtWYyhw3mivVqlNwC5-_g_EHd6UgzxYr6xs6la6m7GqBcaWltpeHgVY7QPB8WlbFvMmjRhQmmslhdCefCfEdIc0I-83bVGfoF07z4F2DjB6AuuVrKQCTsd1ZC8KNls4UQ"/>
</div>
<div class="aspect-square bg-surface-container-lowest rounded-lg overflow-hidden group">
<img alt="Artwork 2" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Minimalist architectural photograph of a spiral staircase with dramatic shadows and warm light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZSoUClS8DvzahUoU2IO4wL-FMH3BNfrWyQr1az6R2RrT9dffnVy7n_JNQioTWOkuzs-ftjSzlaswi-g9njFC54osK7iazSGWMUmim1CMD9ybw2c6fc7ivIiiQtV1s_aG2qMJphwr9xs4OUj3TV-myHatEZPSZaFMb3HZStqnOKHAXbhLtAl4ZnFveN_067g0quN72qcRL50V63xpMoMLxxubMRQMquaOQygwR7eJLGTgftB6BOndOy_al8zp5XKgPyr_uBPmQkkU"/>
</div>
<div class="aspect-square bg-surface-container-lowest rounded-lg overflow-hidden group">
<img alt="Artwork 3" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Digital art piece featuring organic fluid shapes in shades of deep brown and sage green" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp9U_i0Is44X6qnHW8ov5j_TNI8mngtU8o0wZ6oJayN7jHlW-LFWHbGAJONQaB5_T4o4ye-m_KwJ2shDloHraOK8V-fzUvilWP1kPrXD0gOtuGY1HvdsPHtUJ93KNnSX-05gVF72Z-hxSuwxaXh7Tg4_2TU6T1CkOsCWpS3rZMYyF_cGzHbTi-OifCrfeIFlnqNQTzoMeZWkuq_H4o7XLwMi0mAQ7f7e9N10nyb2NUE9sK3zNbgSQBy9lvXvEW07qeDen1g0sC89A"/>
</div>
<div class="aspect-square bg-surface-container-lowest rounded-lg overflow-hidden group">
<img alt="Artwork 4" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Classic still life painting of ceramic vessels on a wooden table with soft morning light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe23-TLsLXi00bv70GS341fMrscthB8DnJE23p0xp8Sm8Ze4L581jrI1QP7_kc8g_v8d0PYMegtpKFMPo8bzYSZMzlKpk8XMlCestQXwSU3d0LMwSYCZMCzV60K_ZKWziEpE8-3OCIaLEmy5dlpMmdxRBfUURjGqvVQrO1ib5xjI5iMzIFFhM7sEzCPanqGZNPyfAO-Pmj-0YL-ji0u5ipshmelCxr9sfpd2aC2p5uRKIczxR98ixKK0H43s6E3Q70rrX4y4ZtUV4"/>
</div>
</div>
</div>
</main>
<!-- Modal Overlay -->
<div class="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 md:p-8">
<!-- Modal Container -->
<div class="bg-surface w-full max-w-4xl max-h-[921px] overflow-hidden rounded-xl shadow-[0_20px_80px_rgba(0,0,0,0.15)] flex flex-col">
<!-- Modal Header -->
<div class="px-8 py-6 flex justify-between items-center border-b border-outline-variant/10">
<div>
<h2 class="text-2xl font-headline font-bold text-primary">Add New Art Piece</h2>
<p class="text-sm text-on-surface-variant font-medium">Digital Atelier Asset Management</p>
</div>
<button class="p-2 hover:bg-surface-container-low rounded-full transition-colors">
<span class="material-symbols-outlined" data-icon="close">close</span>
</button>
</div>
<!-- Modal Content -->
<div class="flex-1 overflow-y-auto p-8 md:p-12">
<!-- Stepper -->
<div class="max-w-xs mx-auto mb-12">
<div class="flex items-center justify-between mb-2">
<span class="text-[10px] font-bold text-primary uppercase tracking-widest">Step 1: Upload</span>
<span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">25% Complete</span>
</div>
<div class="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-primary rounded-full" style="width: 25%;"></div>
</div>
</div>
<!-- Branded Upload Zone -->
<div class="relative group">
<div class="border-2 border-dashed border-outline-variant rounded-xl p-12 flex flex-col items-center justify-center transition-all duration-300 hover:border-primary hover:bg-surface-container-low cursor-pointer min-h-[400px]">
<div class="mb-8 w-24 h-24 bg-primary-container/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
<span class="material-symbols-outlined text-4xl text-primary" data-icon="upload_file">upload_file</span>
</div>
<h3 class="text-2xl font-headline font-bold text-on-surface mb-2">Drag &amp; Drop Your Masterpiece</h3>
<p class="text-on-surface-variant mb-12 text-center max-w-md">The Curated Atelier handles the digital preservation of your work with professional grade color profiles.</p>
<!-- The Struggle: Progress Bar Area -->
<div class="w-full max-w-md bg-surface-container-lowest rounded-lg p-6 shadow-sm border border-outline-variant/10">
<div class="flex justify-between items-center mb-3">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-sm text-primary" data-icon="brush">brush</span>
<span class="text-xs font-bold text-on-surface">The Struggle.png</span>
</div>
<span class="text-xs font-bold text-primary">75%</span>
</div>
<div class="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-primary transition-all duration-700" style="width: 75%;"></div>
</div>
<div class="mt-4 flex justify-between items-center">
<span class="text-[10px] text-on-surface-variant font-medium">Processing textures...</span>
<span class="text-[10px] text-on-surface-variant font-medium">8.4MB / 11.2MB</span>
</div>
</div>
<div class="mt-12 text-center">
<p class="text-xs font-bold text-primary mb-1">High-res PNG/JPG preferred. Max 100MB.</p>
<p class="text-[10px] text-outline uppercase tracking-wider">Raw formats supported via Atelier+ subscription</p>
</div>
</div>
</div>
</div>
<!-- Modal Footer -->
<div class="px-8 py-6 bg-surface-container-low flex justify-between items-center">
<button class="px-6 py-2.5 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
<span class="material-symbols-outlined text-lg" data-icon="arrow_back">arrow_back</span>
                    Cancel
                </button>
<button class="px-10 py-3 bg-primary text-on-primary rounded-md font-bold text-sm shadow-sm hover:bg-[#6a4a39] active:scale-95 transition-all duration-200 flex items-center gap-3">
                    Continue
                    <span class="material-symbols-outlined text-lg" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
</div>
<!-- Floating Action Button (FAB) - Suppressed as per instructions for Modal/Task screens -->
<!-- Navigation Shell suppressed on Mobile as per responsive pivot instructions -->
<div class="md:hidden fixed bottom-0 left-0 w-full bg-[#faf9f9] h-16 flex items-center justify-around z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
<span class="material-symbols-outlined text-[#7a5642]" data-icon="grid_view">grid_view</span>
<span class="material-symbols-outlined text-[#50443e]" data-icon="auto_awesome_motion">auto_awesome_motion</span>
<span class="material-symbols-outlined text-[#50443e]" data-icon="analytics">analytics</span>
<span class="material-symbols-outlined text-[#50443e]" data-icon="brush">brush</span>
<span class="material-symbols-outlined text-[#50443e]" data-icon="settings">settings</span>
</div>
</body></html>

fourth

<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "surface-container-highest": "#e3e2e2",
              "primary": "#7a5642",
              "on-tertiary": "#ffffff",
              "primary-fixed": "#ffdbca",
              "tertiary-fixed-dim": "#b8cdaa",
              "surface-variant": "#e3e2e2",
              "on-primary-fixed": "#2e1506",
              "tertiary": "#516447",
              "secondary-fixed": "#ffdcbd",
              "surface": "#faf9f9",
              "error": "#ba1a1a",
              "on-tertiary-fixed-variant": "#3a4c31",
              "secondary": "#7c5730",
              "on-secondary": "#ffffff",
              "inverse-primary": "#ecbda4",
              "on-primary-fixed-variant": "#603f2d",
              "inverse-surface": "#2f3131",
              "background": "#faf9f9",
              "on-surface-variant": "#50443e",
              "surface-tint": "#7a5642",
              "surface-container-lowest": "#ffffff",
              "outline-variant": "#d4c3bb",
              "on-secondary-fixed-variant": "#61401b",
              "error-container": "#ffdad6",
              "primary-fixed-dim": "#ecbda4",
              "surface-dim": "#dadada",
              "on-tertiary-container": "#3c4d32",
              "surface-container-low": "#f4f3f3",
              "primary-container": "#dcae96",
              "on-background": "#1a1c1c",
              "tertiary-fixed": "#d4e9c4",
              "outline": "#82746d",
              "on-tertiary-fixed": "#101f09",
              "on-secondary-container": "#79542d",
              "surface-container-high": "#e9e8e8",
              "surface-container": "#eeeeee",
              "on-primary": "#ffffff",
              "on-surface": "#1a1c1c",
              "secondary-fixed-dim": "#eebd8e",
              "secondary-container": "#fdcb9b",
              "on-secondary-fixed": "#2c1600",
              "surface-bright": "#faf9f9",
              "tertiary-container": "#a9be9b",
              "inverse-on-surface": "#f1f0f0",
              "on-error": "#ffffff",
              "on-primary-container": "#62412e",
              "on-error-container": "#93000a"
            },
            fontFamily: {
              "headline": ["Manrope"],
              "body": ["Inter"],
              "label": ["Inter"]
            },
            borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
          },
        },
      }
    </script>
<style>
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      }
      body { font-family: 'Inter', sans-serif; }
      h1, h2, h3 { font-family: 'Manrope', sans-serif; }
    </style>
</head>
<body class="bg-surface text-on-surface min-h-screen">
<!-- Sidebar (Suppressed for focused modal flow, but ghosted background visible) -->
<aside class="fixed left-0 top-0 h-screen w-64 bg-surface-container-low border-r border-primary/10 p-6 flex flex-col space-y-4 opacity-30 pointer-events-none">
<div class="flex items-center space-x-3 mb-8">
<div class="w-8 h-8 rounded bg-primary flex items-center justify-center text-on-primary font-headline font-bold">A</div>
<div>
<p class="font-headline font-bold text-primary">The Atelier</p>
<p class="text-xs text-on-surface-variant">Creative Studio</p>
</div>
</div>
<nav class="flex flex-col space-y-2">
<div class="flex items-center space-x-3 p-3 text-on-surface-variant"><span class="material-symbols-outlined">grid_view</span><span>Gallery</span></div>
<div class="flex items-center space-x-3 p-3 text-on-surface-variant"><span class="material-symbols-outlined">auto_awesome_motion</span><span>Collections</span></div>
<div class="flex items-center space-x-3 p-3 text-primary bg-surface-container-lowest rounded-lg shadow-sm font-medium"><span class="material-symbols-outlined">brush</span><span>Atelier</span></div>
</nav>
</aside>
<!-- Main Background Content (Artist OS Dashboard - Blurred) -->
<main class="ml-64 p-12 blur-sm pointer-events-none">
<header class="mb-16">
<h1 class="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Artist OS Dashboard</h1>
<p class="text-on-surface-variant">Manage your creative presence and active collections.</p>
</header>
<div class="grid grid-cols-12 gap-8">
<div class="col-span-8 space-y-8">
<div class="h-64 bg-surface-container-lowest rounded-xl shadow-[0_10px_40px_rgba(122,86,66,0.06)] p-8">
<div class="flex justify-between items-start mb-6">
<h2 class="text-xl font-bold">Recent Analytics</h2>
<span class="material-symbols-outlined text-outline">more_horiz</span>
</div>
<div class="w-full h-32 bg-surface-container-low rounded"></div>
</div>
<div class="grid grid-cols-2 gap-8">
<div class="h-48 bg-surface-container-lowest rounded-xl shadow-[0_10px_40px_rgba(122,86,66,0.06)]"></div>
<div class="h-48 bg-surface-container-lowest rounded-xl shadow-[0_10px_40px_rgba(122,86,66,0.06)]"></div>
</div>
</div>
<div class="col-span-4 h-full bg-surface-container-low rounded-xl"></div>
</div>
</main>
<!-- Modal Overlay -->
<div class="fixed inset-0 bg-on-background/20 backdrop-blur-md z-[60] flex items-center justify-center p-4">
<!-- Modal Container -->
<div class="bg-surface-container-lowest w-full max-w-2xl rounded-xl shadow-[0_20px_60px_rgba(122,86,66,0.12)] overflow-hidden flex flex-col">
<!-- Progress Stepper -->
<div class="px-10 pt-8 pb-4">
<div class="flex items-center justify-between mb-3">
<span class="text-xs font-semibold uppercase tracking-wider text-primary">Step 4 of 4: Finalize &amp; Publish</span>
<span class="text-xs font-bold text-tertiary">100% Complete</span>
</div>
<div class="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-tertiary w-full"></div>
</div>
</div>
<!-- Modal Content -->
<div class="p-10 space-y-10">
<!-- Section Header -->
<div class="space-y-1">
<h2 class="text-2xl font-extrabold tracking-tight text-on-surface">Commercial Details</h2>
<p class="text-on-surface-variant text-sm">Define how your artwork will be discovered and acquired.</p>
</div>
<!-- Visibility Settings -->
<section class="space-y-4">
<h3 class="text-sm font-bold text-on-surface uppercase tracking-widest">Visibility Settings</h3>
<div class="grid grid-cols-2 gap-4">
<label class="relative flex flex-col p-4 bg-surface-container-low rounded-xl border-2 border-primary cursor-pointer transition-all">
<input checked="" class="hidden" name="visibility" type="radio"/>
<div class="flex items-center justify-between mb-2">
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">public</span>
<div class="w-4 h-4 rounded-full border-4 border-primary bg-surface-container-lowest"></div>
</div>
<span class="font-bold text-on-surface">Public Portfolio</span>
<span class="text-xs text-on-surface-variant mt-1">Visible to all visitors and searchable in the Atelier gallery.</span>
</label>
<label class="relative flex flex-col p-4 bg-surface-container-low rounded-xl border-2 border-transparent hover:border-outline-variant cursor-pointer transition-all">
<input class="hidden" name="visibility" type="radio"/>
<div class="flex items-center justify-between mb-2">
<span class="material-symbols-outlined text-on-surface-variant">link</span>
<div class="w-4 h-4 rounded-full border border-outline bg-surface-container-lowest"></div>
</div>
<span class="font-bold text-on-surface">Private Link</span>
<span class="text-xs text-on-surface-variant mt-1">Only accessible via direct URL. Hidden from public exploration.</span>
</label>
</div>
</section>
<!-- Sale Status -->
<section class="space-y-4">
<h3 class="text-sm font-bold text-on-surface uppercase tracking-widest">Sale Status</h3>
<div class="space-y-3">
<!-- Option 1 -->
<div class="flex items-center p-4 bg-surface-container-low rounded-xl group hover:bg-surface-container-high transition-colors">
<input class="w-4 h-4 text-primary border-outline focus:ring-primary" id="showcase" name="sale_status" type="radio"/>
<label class="ml-4 flex-1" for="showcase">
<span class="block font-bold text-on-surface">Showcase Only</span>
<span class="block text-xs text-on-surface-variant">Display without purchase options. Useful for archival work.</span>
</label>
</div>
<!-- Option 2 (Active/Price) -->
<div class="p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm ring-1 ring-primary/5">
<div class="flex items-start mb-4">
<input checked="" class="mt-1 w-4 h-4 text-primary border-outline focus:ring-primary" id="fixed" name="sale_status" type="radio"/>
<label class="ml-4 flex-1" for="fixed">
<span class="block font-bold text-on-surface">Fixed Price</span>
<span class="block text-xs text-on-surface-variant">Set a specific value for instant acquisition.</span>
</label>
</div>
<div class="ml-8 flex items-center bg-surface-container-low rounded-lg px-4 py-2 group focus-within:bg-white transition-all border border-transparent focus-within:border-primary">
<span class="text-primary font-bold mr-2">$</span>
<input class="bg-transparent border-none focus:ring-0 w-full text-on-surface font-headline font-bold text-lg p-0" placeholder="0.00" type="number" value="1250.00"/>
<span class="text-xs font-bold text-outline-variant ml-2 uppercase">USD</span>
</div>
</div>
<!-- Option 3 -->
<div class="flex items-center p-4 bg-surface-container-low rounded-xl group hover:bg-surface-container-high transition-colors">
<input class="w-4 h-4 text-primary border-outline focus:ring-primary" id="commissions" name="sale_status" type="radio"/>
<label class="ml-4 flex-1" for="commissions">
<span class="block font-bold text-on-surface">Open for Commissions</span>
<span class="block text-xs text-on-surface-variant">Invite collectors to discuss custom variations of this style.</span>
</label>
</div>
</div>
</section>
<!-- Safety/NSFW -->
<section class="pt-2">
<label class="flex items-center p-5 bg-tertiary-container/10 border border-tertiary/20 rounded-xl cursor-pointer group">
<div class="relative flex items-center">
<input class="w-5 h-5 rounded border-tertiary text-tertiary focus:ring-tertiary" type="checkbox"/>
</div>
<div class="ml-4">
<span class="block font-bold text-on-tertiary-container text-sm">Sensitive Content / NSFW</span>
<span class="block text-xs text-on-tertiary-container/70">Flag this artwork for platform safety. Content may be blurred for some users.</span>
</div>
</label>
</section>
</div>
<!-- Footer Actions -->
<div class="p-10 bg-surface-container-low flex items-center justify-between mt-auto">
<button class="flex items-center space-x-2 text-primary font-bold px-4 py-2 hover:bg-surface-container-high rounded-lg transition-colors active:scale-95 duration-200">
<span class="material-symbols-outlined text-lg">arrow_back</span>
<span>Back</span>
</button>
<div class="flex space-x-4">
<button class="px-8 py-3 bg-primary text-on-primary font-headline font-bold rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all duration-200">
                        Publish Artwork
                    </button>
</div>
</div>
</div>
</div>
</body></html>
