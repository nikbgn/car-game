const COIN_SRC = "/audio/coin.ogg";
const CRASH_SRC = "/audio/crash.ogg";
const BGM_SRC = "/audio/bgm.ogg";

const BGM_VOLUME = 0.32;
const SFX_VOLUME = 0.55;

class AudioManager {
  private unlocked = false;
  private bgm: HTMLAudioElement | null = null;
  private coinTemplate: HTMLAudioElement | null = null;
  private crashTemplate: HTMLAudioElement | null = null;

  private ensureTemplates() {
    if (typeof window === "undefined") return;

    if (!this.coinTemplate) {
      this.coinTemplate = new Audio(COIN_SRC);
      this.coinTemplate.preload = "auto";
    }
    if (!this.crashTemplate) {
      this.crashTemplate = new Audio(CRASH_SRC);
      this.crashTemplate.preload = "auto";
    }
    if (!this.bgm) {
      this.bgm = new Audio(BGM_SRC);
      this.bgm.preload = "auto";
      this.bgm.loop = true;
      this.bgm.volume = BGM_VOLUME;
    }
  }

  /** Call on first user gesture (browser autoplay policy). */
  unlock() {
    if (this.unlocked || typeof window === "undefined") return;
    this.unlocked = true;
    this.ensureTemplates();
  }

  startMusic() {
    if (!this.unlocked) return;
    this.ensureTemplates();
    if (!this.bgm) return;

    this.bgm.volume = BGM_VOLUME;
    void this.bgm.play().catch(() => {
      // Ignore autoplay race — next tap will retry via startGame
    });
  }

  private playOneShot(template: HTMLAudioElement | null, volume = SFX_VOLUME) {
    if (!this.unlocked || !template) return;
    const clip = template.cloneNode() as HTMLAudioElement;
    clip.volume = volume;
    void clip.play().catch(() => {});
  }

  playCoin() {
    if (!this.unlocked) return;
    this.ensureTemplates();
    this.playOneShot(this.coinTemplate, SFX_VOLUME);
  }

  playCrash() {
    if (!this.unlocked) return;
    this.ensureTemplates();
    this.stopMusic();
    this.playOneShot(this.crashTemplate, SFX_VOLUME * 1.1);
  }

  stopMusic() {
    if (!this.bgm) return;
    this.bgm.pause();
    this.bgm.currentTime = 0;
  }

  stopAll() {
    this.stopMusic();
  }
}

export const audioManager = new AudioManager();
