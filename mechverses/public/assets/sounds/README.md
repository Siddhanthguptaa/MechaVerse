# Vehicle Audio Files

## Required Audio Files

Place the following audio files in this directory for realistic vehicle sounds:

### 1. **engine.mp3** 
- Engine running sound (revving)
- Should be a loopable sound
- Recommended: 2-5 seconds loop
- The system will dynamically adjust pitch (0.7x to 2.2x) based on vehicle speed
- **Sources to find free sounds:**
  - [Freesound.org](https://freesound.org/) - Search "car engine loop"
  - [Zapsplat.com](https://www.zapsplat.com/) - Free sound effects
  - [Mixkit.co](https://mixkit.co/free-sound-effects/car/) - Free car sounds

### 2. **idle.mp3**
- Idle engine sound (low rumble)
- Should be a loopable sound
- Plays when vehicle is stationary or moving very slowly
- Recommended: 2-5 seconds loop
- Lower pitch than engine sound

### 3. **brake.mp3**
- Tire skid/brake sound
- Should be a loopable sound
- Plays when vehicle is decelerating rapidly
- Recommended: 1-3 seconds loop
- Classic tire screech sound

### 4. **collision.mp3**
- Impact/crash sound
- One-shot sound (not looped)
- Plays when vehicle collides with objects
- Recommended: 0.5-2 seconds
- Metal crash or thump sound

## Audio Format Recommendations

- **Format**: MP3 (best compatibility) or OGG
- **Sample Rate**: 44.1 kHz
- **Bit Rate**: 128-192 kbps (good balance of quality and file size)
- **Channels**: Mono or Stereo (Mono recommended for smaller file size)

## Free Sound Resources

1. **Freesound.org** (CC licensed, free)
   - Engine loop: https://freesound.org/search/?q=car+engine+loop
   - Brake skid: https://freesound.org/search/?q=tire+skid
   - Collision: https://freesound.org/search/?q=car+crash

2. **Zapsplat.com** (Free with attribution)
   - Vehicle sounds: https://www.zapsplat.com/sound-effect-categories/vehicles/

3. **Mixkit.co** (Free license)
   - Car sounds: https://mixkit.co/free-sound-effects/car/

4. **OpenGameArt.org** (Free game assets)
   - Vehicle sounds: https://opengameart.org/

## Example Search Terms

- "car engine loop"
- "vehicle idle"
- "tire skid"
- "car brake screech"
- "vehicle crash"
- "metal impact"

## How the Audio System Works

The audio system automatically:
- **Adjusts engine pitch** based on vehicle speed (faster = higher pitch)
- **Adjusts engine volume** based on speed (louder when going faster)
- **Switches between idle and engine** sounds based on movement
- **Triggers brake sounds** when detecting rapid deceleration
- **Plays collision sounds** when detecting sudden velocity changes (impacts)
- **Only plays sounds during racing** (not in menu or waiting states)

## Installation Steps

1. Download your chosen audio files
2. Rename them to match the required names above
3. Place them in this directory (`public/assets/sounds/`)
4. Refresh your browser - the sounds will load automatically!

## Fallback Behavior

If audio files are not found, the game will:
- Log a message to the console
- Continue to work normally without sound
- You can add sounds later without code changes

## Audio Controls

The audio system is integrated into the Vehicle component and:
- Automatically plays/stops based on vehicle state
- Respects the race state (only plays during racing)
- Can be toggled on/off (future UI feature)

## Troubleshooting

**Sounds not playing?**
1. Check browser console for loading errors
2. Verify file names match exactly (case-sensitive)
3. Ensure files are in the correct format (MP3 or OGG)
4. Check browser audio permissions
5. Try refreshing the page (Ctrl+F5)

**Sounds are choppy or cut off?**
- Make sure audio files are properly looped (seamless loop points)
- Check file quality/bitrate isn't too low
- Try shorter loop durations (2-3 seconds)

**Sounds too loud/quiet?**
- Volumes are controlled in `hooks/useVehicleAudio.js`
- Adjust the volume values in the code (0.0 to 1.0 range)
