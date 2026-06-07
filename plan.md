# Plan: Replace Hero Mascot with Minimalist Floating Language Matrix

We will replace the large 3D Polly mascot, speech bubble, and "Meet Polly" text in the Hero section of `home_page.dart` with a modern, typography-forward "Floating Language Tags" Matrix.

## Key Changes
1. **Remove Polly Mascot & Speech Bubble States:**
   - Remove unused animation controllers, timers, and state variables:
     - `_parrotController`, `_parrotAnimation`
     - `_bubbleController`, `_bubbleOpacity`, `_bubbleSlide`
     - `_bubbleTextNotifier`, `_bubbleDone`
     - `_typeTimer`, `_bubbleDelay`
     - `_wingController`, `_wingRotation`
   - Clean up their initialization in `initState` and resource disposal in `dispose`.

2. **Create `_FloatingLanguageChip` Component:**
   - Implement a lightweight custom widget that handles its own float animation using a local `AnimationController` (sine-wave translation of ±7 pixels).
   - Offset starting times/phases to float independently.
   - Use `ClipRRect` -> `BackdropFilter` -> `Container` for glassmorphic visual.
   - Add hover effects (+5% scale and soft color glow using `BoxShadow`).
   - Supports Kanji ("日本語") and Devanagari ("हिन्दी") scripts.

3. **Create `_LanguageMatrix` Layout Component:**
   - Layout 6 chips using a responsive `Stack` and `Align` with staggered positions.
   - Wrap the entire matrix inside a `RepaintBoundary` to optimize scroll performance on web.

4. **Integrate into Hero Section:**
   - Replace `rightSection` in `_buildHeroSection` with `_LanguageMatrix`.

## Verification
- Compile and run analysis.
- Inspect staggered animation, hover/glow effect, and responsiveness on desktop and mobile.
