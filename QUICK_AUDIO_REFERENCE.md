# 🎵 Vehicle Audio - Quick Reference

## 🚀 Quick Start (30 seconds)

1. **Get sounds**: Open `http://localhost:5173/assets/sounds/sound-generator.html`
2. **Download all 4 sounds** (engine, idle, brake, collision)
3. **Move to**: `public/assets/sounds/`
4. **Race!** Audio plays automatically 🎉

---

## 📂 File Locations

```
public/assets/sounds/
  ├── engine.mp3 (or .wav)    ← Engine running sound
  ├── idle.mp3                ← Idle engine sound  
  ├── brake.mp3               ← Brake/skid sound
  └── collision.mp3           ← Crash sound
```

---

## 🎮 How Audio Plays

| Situation | Sound | Behavior |
|-----------|-------|----------|
| 🛑 Stopped | Idle | Low rumble |
| 🏎️ Moving | Engine | Pitch ↑ with speed |
| 🛑 Braking | Brake | Volume ↑ with force |
| 💥 Crash | Collision | One-shot impact |

---

## 🔧 Quick Tweaks

### Make engine louder/quieter:
`hooks/useVehicleAudio.js` line 60
```js
tryLoadAudio('engine', engineSoundRef, 'engine', 0.8)  // 0.0 to 1.0
```

### Change engine pitch range:
`hooks/useVehicleAudio.js` line 145
```js
const basePitch = 0.7      // Starting pitch
const pitchRange = 1.5     // How much pitch increases
const maxSpeed = 30        // Max speed for pitch calc
```

---

## 🎛️ Add Toggle Button (Optional)

In any component:
```jsx
import AudioControl from './AudioControl'
import useGameStore from '../store/gameStore'

const vehicleAudioState = useGameStore((state) => state.vehicleAudioState)

{vehicleAudioState && (
    <AudioControl 
        isAudioEnabled={vehicleAudioState.isAudioEnabled} 
        onToggle={vehicleAudioState.toggleAudio}
    />
)}
```

---

## ⌨️ Add Keyboard Mute (Optional)

`hooks/useInput.js` in `handleKeyDown`:
```js
if (e.key === 'm') {
    useGameStore.getState().vehicleAudioState?.toggleAudio()
}
```

---

## 🔍 Troubleshooting

**No sound?**
- ✅ Files in `public/assets/sounds/`?
- ✅ Race started? (not just in menu)
- ✅ Browser audio on?
- ✅ Check console for errors

**Can't find sounds?**
Free sources:
- https://freesound.org (search "car engine loop")
- https://mixkit.co/free-sound-effects/car/
- https://zapsplat.com (vehicles section)

---

## 📊 What's Included

✅ Dynamic engine sounds  
✅ Idle engine rumble  
✅ Brake/skid effects  
✅ Collision impacts  
✅ Speed-based pitch control  
✅ Volume-based on intensity  
✅ Race state awareness  
✅ Ground detection  
✅ Multi-format support (.mp3/.wav/.ogg)  
✅ Graceful fallback (no files needed to run)  
✅ Zero configuration  

---

## 📚 Full Documentation

- **Complete Guide**: `AUDIO_IMPLEMENTATION_SUMMARY.md`
- **Quick Start**: `VEHICLE_AUDIO_GUIDE.md`
- **UI Integration**: `AUDIO_INTEGRATION.md`
- **Audio Details**: `public/assets/sounds/README.md`

---

**That's it! Just add sounds and drive! 🏎️💨**
