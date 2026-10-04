// Shared, mutable, frame-rate state between the DOM and the 3D stage.
// Deliberately not React state: the render loop reads it every frame.

export type AnchorPose = {
  /** 0 = assembled, 1 = pieces pulled apart by one diamond-width. */
  explode: number;
  /** Size relative to the anchor element's height. */
  scale: number;
  /** Base colour of the pieces. */
  color: string;
  /** Emissive glow strength in the anchor's world. */
  glow: number;
  /** Idle spin speed (radians / second) around Y. */
  spin: number;
  /** How strongly the diamond tilts toward the cursor. */
  tilt: number;
};

export type Anchor = {
  el: HTMLElement;
  /** Element whose top edge marks where this anchor's territory begins. */
  section: HTMLElement;
  pose: AnchorPose;
};

export const anchors = new Map<string, Anchor>();

export const bus = {
  /** Index of the piece to pull forward (services), -1 for none. */
  focus: -1,
  /** Accumulated spin impulse (keystrokes in the contact form). */
  kick: 0,
  /** Burst impulse that blows the pieces apart then lets them snap back. */
  burst: 0,
  /** Preloader assembly progress, 0 → 1. */
  assembly: 0,
  /** 0 = held centre-screen for the preloader, 1 = following anchors. */
  handoff: 0,
  /** Whether the stage has rendered its first frame. */
  ready: false,
};

export function kickDiamond(amount = 1) {
  bus.kick += amount;
}

export function burstDiamond() {
  bus.burst = 1;
}
