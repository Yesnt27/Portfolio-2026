/*
  Songs for the About page music player (components/about/MusicPlayer.tsx).

  Each `src` is a 20-second snapshot, not the full song: cut in Resolve, then
  loudness-matched to -14 LUFS (so no song jumps out louder than the others),
  given a 0.35 s fade-in and 1.5 s fade-out, and encoded as 160 kbps MP3
  (~400 KB, plays in every browser including Safari on iPhone).

  Covers are 748 x 660 webp: 2x the 374 x 330 art box, so they stay sharp on
  retina screens.

  To add a song:
    1. Put the snapshot in public/audio/ (lowercase-with-hyphens.mp3).
    2. Put a cover in public/images/about/ (748 x 660 or larger).
    3. Add an entry below. Order here = play order; the player loops.
*/

export type Track = {
  id: string;
  /* Leave out to show just the artist. */
  title?: string;
  artist: string;
  src: string;
  cover: string;
};

export const playlist: Track[] = [
  {
    id: "the-weeknd",
    artist: "The Weeknd",
    src: "/audio/the-weeknd.mp3",
    cover: "/images/about/cover-the-weeknd.webp",
  },
  {
    id: "malcolm-todd",
    artist: "Malcolm Todd",
    src: "/audio/malcolm-todd.mp3",
    cover: "/images/about/cover-malcolm-todd.webp",
  },
  {
    id: "don-toliver",
    artist: "Don Toliver",
    src: "/audio/don-toliver.mp3",
    cover: "/images/about/cover-don-toliver.webp",
  },
  {
    id: "wave-to-earth",
    artist: "wave to earth",
    src: "/audio/wave-to-earth.mp3",
    cover: "/images/about/cover-wave-to-earth.webp",
  },
];
