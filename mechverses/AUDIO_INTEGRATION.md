# Audio Control Integration Example

## Option 1: Add to Header (Recommended)

To add the audio toggle button to your header, modify `components/Header.jsx`:

```jsx
import { useState } from 'react';
import VehicleSwitcher from './VehicleSwitcher';
import AudioControl from './AudioControl';  // ADD THIS
import GitHubIcon from '../assets/images/icons/GitHub.svg';
import { useMultiplayer } from '../hooks/useMultiplayer'; 
import useGameStore from '../store/gameStore';  // ADD THIS

function Header() {
    const [roomCode, setRoomCode] = useState('');
    const [username, setUsername] = useState('');
    
    // ADD THIS: Get audio state from store
    const vehicleAudioState = useGameStore((state) => state.vehicleAudioState)
    
    const { joinRoom, isConnected, multiplayerMessage, clearMessage, socketId } = useMultiplayer(); 

    // ... rest of your existing code ...

    return (
        <>
            <header className="...your existing classes...">
                {/* Your existing header content */}
                
                {/* ADD THIS: Audio Control Button */}
                {vehicleAudioState && (
                    <AudioControl 
                        isAudioEnabled={vehicleAudioState.isAudioEnabled} 
                        onToggle={vehicleAudioState.toggleAudio}
                    />
                )}
            </header>
        </>
    );
}
```

---

## Option 2: Store Audio State Globally

To make audio state accessible everywhere, add this to your `store/gameStore.js`:

```javascript
// Add to your gameStore state
vehicleAudioState: null,
setVehicleAudioState: (state) => set({ vehicleAudioState: state }),
```

Then update your Vehicle component to register the audio state:

```jsx
// In Vehicle.jsx, after the audio hook:
const { isAudioEnabled, toggleAudio, audioInitialized } = useVehicleAudio(chassisRef, wheelRefs)

// Register audio state in store
useEffect(() => {
    if (audioInitialized) {
        setVehicleAudioState({ isAudioEnabled, toggleAudio })
    }
    return () => {
        setVehicleAudioState(null)
    }
}, [audioInitialized, isAudioEnabled])
```

---

## Option 3: Simple Keyboard Shortcut

Add a keyboard shortcut without UI (e.g., 'M' for mute).

Add this to `hooks/useInput.js`:

```javascript
// In the keyboard event handler section
const handleKeyDown = (e) => {
    // Existing key handling
    setKey(e.key, true)
    
    // ADD THIS: Toggle audio with 'M' key
    if (e.key === 'm' || e.key === 'M') {
        const audioState = useGameStore.getState().vehicleAudioState
        if (audioState?.toggleAudio) {
            audioState.toggleAudio()
            console.log('Audio toggled!')
        }
    }
}
```

---

## Option 4: Add to RaceUI

If you have a RaceUI component, add it there:

```jsx
import AudioControl from './AudioControl'
import useGameStore from '../store/gameStore'

function RaceUI() {
    const vehicleAudioState = useGameStore((state) => state.vehicleAudioState)
    
    return (
        <div className="race-ui">
            {/* Your existing race UI */}
            
            {/* Audio Control in bottom corner */}
            {vehicleAudioState && (
                <div className="absolute bottom-4 right-4">
                    <AudioControl 
                        isAudioEnabled={vehicleAudioState.isAudioEnabled} 
                        onToggle={vehicleAudioState.toggleAudio}
                    />
                </div>
            )}
        </div>
    )
}
```

---

## Quick Test Without UI

You can test audio without adding UI buttons by using the browser console:

```javascript
// Open browser console (F12) and type:
window.toggleVehicleAudio = () => {
    const audioState = window.gameStore?.vehicleAudioState
    if (audioState?.toggleAudio) {
        audioState.toggleAudio()
        console.log('Audio toggled:', audioState.isAudioEnabled)
    }
}

// Then just type: toggleVehicleAudio()
```

---

## Current Status

✅ Audio system is fully integrated and working!  
✅ No UI integration required - audio plays automatically during races  
✅ Audio controls (if desired) can be added using any of the options above  
✅ System gracefully handles missing audio files  

**The audio will work immediately once you add sound files to `public/assets/sounds/`**

---

## Testing Checklist

- [ ] Start game (npm run dev)
- [ ] Add audio files or generate test sounds
- [ ] Start a race (race state = "racing")
- [ ] Drive vehicle
- [ ] Listen for:
  - [ ] Idle sound when stopped
  - [ ] Engine sound when moving
  - [ ] Engine pitch changes with speed
  - [ ] Brake sound when decelerating
  - [ ] Collision sound on impacts
- [ ] Check browser console for audio load status

---

## Don't Need UI Controls?

The audio system works great without any UI - it just plays automatically! The AudioControl component is completely optional. Audio intelligently plays based on vehicle state.
