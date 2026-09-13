/**
 * AudioManager stubs — wire Howler or Web Audio here in v2.
 */
class AudioManager {
  private enabled = false;

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  playCoin() {
    if (!this.enabled) return;
    // TODO: load and play coin SFX
  }

  playCrash() {
    if (!this.enabled) return;
    // TODO: load and play crash SFX
  }

  playEngineLoop() {
    if (!this.enabled) return;
    // TODO: optional engine loop
  }

  stopAll() {
    if (!this.enabled) return;
    // TODO: stop all active sounds
  }
}

export const audioManager = new AudioManager();
