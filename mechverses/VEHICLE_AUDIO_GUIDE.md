# 🔊 Vehicle Audio System - Quick Start Guide

## What's Been Added

I've implemented a complete realistic vehicle audio system for your game! Here's what it does:

### Audio Features ✨

1. **Engine Sound** 🚗
   - Dynamically changes pitch based on vehicle speed
   - Louder and higher-pitched when accelerating
   - Smooth transitions between speeds

2. **Idle Sound** 💤
   - Low rumble when vehicle is stationary
   - Plays when speed is below 0.5 units
   - Automatically fades out when you start moving

3. **Brake/Skid Sound** 🛑
   - Plays when you brake hard or decelerate rapidly
   - Volume adjusts based on braking intensity
   - Classic tire screech effect

4. **Collision Sound** 💥
   - Triggers on impacts with objects or terrain
   - Volume based on impact strength
   - Cooldown prevents sound spam

### Smart Features 🧠

- **Speed-responsive**: Engine pitch increases with speed (realistic!)
- **Race state aware**: Only plays during actual racing
- **Ground detection**: Different behavior when airborne
- **Smooth fading**: No jarring audio cuts
- **Multi-format support**: Tries .mp3, .wav, and .ogg files
- **Graceful fallback**: Game works fine without audio files

---

## Getting Started (3 Options)

### Option 1: Quick Test with Generated Sounds (Recommended for Testing)

1. Open the sound generator:
   ```
   Navigate to: public/assets/sounds/sound-generator.html
   ```
   Or open it directly: `http://localhost:5173/assets/sounds/sound-generator.html`

2. Click "Preview" to hear each sound
3. Click "Download" for each sound type
4. Move the downloaded files to `public/assets/sounds/`
5. Refresh your game!

**Note**: Generated sounds are basic but functional for testing.

---

### Option 2: Use Realistic Free Sounds (Best for Production)

Download high-quality, free vehicle sounds from these sources:

#### 🎵 Recommended Sources:

1. **Freesound.org** (Best quality, CC licensed)
   - Engine: https://freesound.org/search/?q=car+engine+loop
   - Brake: https://freesound.org/search/?q=tire+skid
   - Collision: https://freesound.org/search/?q=car+crash

2. **Zapsplat.com** (Great selection, free with attribution)
   - Vehicles: https://www.zapsplat.com/sound-effect-categories/vehicles/

3. **Mixkit.co** (Free license, easy to use)
   - Car sounds: https://mixkit.co/free-sound-effects/car/

#### 📝 What to Download:

- **engine.mp3** - Loopable engine revving (2-5 seconds)
- **idle.mp3** - Loopable idle rumble (2-5 seconds)  
- **brake.mp3** - Loopable tire skid (1-3 seconds)
- **collision.mp3** - One-shot crash sound (0.5-2 seconds)

Place all files in: `public/assets/sounds/`

---

### Option 3: No Audio Files (Game Works Fine!)

The game will work perfectly without audio files. You'll just see console messages saying sounds weren't found. Add them later when you want!

---

## Testing the Audio System

1. **Start your game** (npm run dev)
2. **Enter a race** (race must be in "racing" state)
3. **Drive around**:
   - Stay still → Hear idle sound
   - Accelerate → Engine pitch increases
   - Brake hard → Hear skid sound
   - Crash into something → Hear collision

4. **Check browser console** for audio loading status:
   - ✓ Shows which sounds loaded successfully
   - Shows which sounds are missing

---

## File Structure

```
public/
  assets/
    sounds/
      ├── engine.mp3 (or .wav/.ogg)
      ├── idle.mp3
      ├── brake.mp3
      ├── collision.mp3
      ├── README.md (detailed documentation)
      └── sound-generator.html (sound generator tool)

hooks/
  └── useVehicleAudio.js (audio system logic)

components/
  └── Vehicle.jsx (integrated with audio)
```

---

## Customization

### Adjust Audio Volumes

Edit `hooks/useVehicleAudio.js` and change these values:

```javascript
// Line ~60-80: Initial volumes
tryLoadAudio('engine', engineSoundRef, 'engine', 0.5)  // 0.0 to 1.0
tryLoadAudio('idle', idleSoundRef, 'idle', 0.3)
tryLoadAudio('brake', brakeSoundRef, 'brake', 0.4)
tryLoadAudio('collision', collisionSoundRef, 'collision', 0.6)
```

### Adjust Engine Pitch Range

```javascript
// Line ~145: Engine pitch calculation
const basePitch = 0.7      // Minimum pitch
const pitchRange = 1.5     // Maximum pitch increase
const maxSpeed = 30        // Speed for maximum pitch
```

### Adjust Collision Sensitivity

```javascript
// Line ~247: Collision detection
const impactThreshold = 3       // Lower = more sensitive
const collisionCooldown = 500   // ms between sounds
```

---

## Troubleshooting

### ❌ No sounds playing?

1. Check browser console for errors
2. Verify files are in `public/assets/sounds/`
3. Check file names match exactly (case-sensitive!)
4. Try refreshing with Ctrl+F5
5. Check browser audio isn't muted
6. Make sure race state is "racing"

### ❌ Sounds are choppy?

- Ensure audio files are properly looped
- Check files aren't too large
- Try shorter loop durations (2-3 seconds)

### ❌ Engine sound doesn't change pitch?

- Check vehicle is actually moving (check speed in console)
- Verify `maxSpeed` value in useVehicleAudio.js matches your vehicle speeds
- Race must be in "racing" state

---

## Performance Notes

- Audio system is very lightweight
- No performance impact when audio files aren't loaded
- Uses Three.js built-in Audio system (Web Audio API)
- Sounds are loaded once and cached

---

## Next Steps

### Future Enhancements You Could Add:

1. **Audio toggle button** in UI
2. **Volume sliders** for each sound type
3. **Different engine sounds** per vehicle
4. **Turbo/supercharger** sounds
5. **Transmission shift** sounds
6. **Wind noise** when going fast
7. **Off-road terrain** sounds

---

## Files Modified

- ✅ Created `hooks/useVehicleAudio.js` - Audio system logic
- ✅ Modified `components/Vehicle.jsx` - Integrated audio hook
- ✅ Created `public/assets/sounds/` - Audio directory
- ✅ Created README and sound generator tool

---

## Need Help?

1. Check `public/assets/sounds/README.md` for detailed audio documentation
2. Open `sound-generator.html` to create test sounds
3. Check browser console for debugging info
4. All audio logging is prefixed with audio messages

---

## Summary

Your vehicle audio system is now **fully functional**! 🎉

- ✅ Code is integrated and ready
- ✅ System works with or without audio files
- ✅ Realistic speed-based engine sounds
- ✅ Brake and collision effects
- ✅ Easy to customize and extend

**Just add your audio files and drive! 🏎️💨**
