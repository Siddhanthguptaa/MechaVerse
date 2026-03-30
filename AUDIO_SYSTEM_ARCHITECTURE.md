# Vehicle Audio System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        VEHICLE COMPONENT                        │
│  (components/Vehicle.jsx)                                       │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ Calls hook with vehicleRef & wheelRefs
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VEHICLE AUDIO HOOK                           │
│  (hooks/useVehicleAudio.js)                                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Initialize Audio System                                   │  │
│  │ - Create AudioListener                                    │  │
│  │ - Create Audio sources (engine, idle, brake, collision)  │  │
│  │ - Load audio files (.mp3/.wav/.ogg)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Every Frame (useFrame)                                    │  │
│  │                                                           │  │
│  │  1. Get vehicle velocity & speed                         │  │
│  │  2. Check race state                                     │  │
│  │  3. Check wheels on ground                               │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────┐             │  │
│  │  │ ENGINE SOUND                           │             │  │
│  │  │ - Play when speed > 0.5                │             │  │
│  │  │ - Pitch: 0.7 + (speed/maxSpeed * 1.5) │             │  │
│  │  │ - Volume: 0.3 + (speed/maxSpeed * 0.5)│             │  │
│  │  └────────────────────────────────────────┘             │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────┐             │  │
│  │  │ IDLE SOUND                             │             │  │
│  │  │ - Play when speed < 0.5                │             │  │
│  │  │ - Volume: 0.25                         │             │  │
│  │  │ - Pitch: 1.0 (constant)                │             │  │
│  │  └────────────────────────────────────────┘             │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────┐             │  │
│  │  │ BRAKE SOUND                            │             │  │
│  │  │ - Detect deceleration                  │             │  │
│  │  │ - Play when decel > 0.1 & speed > 2   │             │  │
│  │  │ - Volume: min(0.6, decel * 0.5)       │             │  │
│  │  └────────────────────────────────────────┘             │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────┐             │  │
│  │  │ COLLISION SOUND                        │             │  │
│  │  │ - Detect velocity change > threshold   │             │  │
│  │  │ - Play if change > 3 units             │             │  │
│  │  │ - Cooldown: 500ms                      │             │  │
│  │  │ - Volume: min(0.8, impact/10)          │             │  │
│  │  └────────────────────────────────────────┘             │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Returns: { isAudioEnabled, toggleAudio, audioInitialized }    │
└────────────────┬─────────────────────────────────────────────────┘
                 │
                 │ Registers state in store
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        GAME STORE                                │
│  (store/gameStore.js)                                           │
│                                                                  │
│  vehicleAudioState: {                                           │
│    isAudioEnabled: boolean                                      │
│    toggleAudio: function                                        │
│  }                                                               │
└────────────────┬─────────────────────────────────────────────────┘
                 │
                 │ Can be accessed by
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   UI COMPONENTS (Optional)                       │
│  - AudioControl.jsx (toggle button)                             │
│  - Header.jsx (display control)                                 │
│  - RaceUI.jsx (in-race control)                                 │
│  - Keyboard shortcuts                                            │
└─────────────────────────────────────────────────────────────────┘
```

## Audio Decision Tree

```
┌──────────────────────────┐
│   Race State Check       │
│   Is racing?             │
└────────┬─────────────────┘
         │
    Yes  │  No
         │  └──► Don't play any sounds
         ▼
┌──────────────────────────┐
│   Speed Check            │
│   speed < 0.5?           │
└────────┬─────────────────┘
         │
    Yes  │  No
    ▼    │  ▼
┌────────┐  ┌────────────────┐
│ IDLE   │  │ ENGINE SOUND   │
│ SOUND  │  │ - Pitch varies │
└────────┘  │ - Volume varies│
            └────────────────┘
         │
         │ Check deceleration
         ▼
┌──────────────────────────┐
│   Braking?               │
│   decel > 0.1?           │
└────────┬─────────────────┘
         │
    Yes  │  No
    ▼    │  └──► Continue
┌────────┐
│ BRAKE  │
│ SOUND  │
└────────┘
         │
         │ Check velocity change
         ▼
┌──────────────────────────┐
│   Collision?             │
│   velocity Δ > 3?        │
└────────┬─────────────────┘
         │
    Yes  │  No
    ▼    │  └──► Continue
┌────────┐
│COLLISION│
│ SOUND  │
└────────┘
```

## Data Flow

```
Vehicle Movement
    ↓
Vehicle Rigid Body (Physics)
    ↓
    ├─→ translation() → position
    ├─→ linvel()      → velocity → calculate speed
    ├─→ angvel()      → angular velocity
    └─→ rotation()    → orientation
         ↓
useVehicleAudio Hook
    ↓
    ├─→ Calculate speed from velocity
    ├─→ Calculate deceleration (current vs previous)
    ├─→ Check race state
    └─→ Check wheels on ground
         ↓
Audio Calculations
    ↓
    ├─→ Engine pitch = 0.7 + (speed/30 * 1.5)
    ├─→ Engine volume = 0.3 + (speed/30 * 0.5)
    ├─→ Brake volume = min(0.6, deceleration * 0.5)
    └─→ Collision volume = min(0.8, velocityChange/10)
         ↓
Web Audio API (Three.js Audio)
    ↓
Browser Audio Output 🔊
```

## Component Relationships

```
┌────────────────────────────────────────────────────────┐
│                     App.jsx                            │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │              Canvas.jsx                      │    │
│  │                                               │    │
│  │  ┌─────────────────────────────────────┐    │    │
│  │  │        VehicleManager.jsx           │    │    │
│  │  │                                      │    │    │
│  │  │  ┌────────────────────────────┐    │    │    │
│  │  │  │    Vehicle.jsx             │    │    │    │
│  │  │  │    - chassisRef            │    │    │    │
│  │  │  │    - wheelRefs[]           │    │    │    │
│  │  │  │    ↓                       │    │    │    │
│  │  │  │  useVehiclePhysics()       │    │    │    │
│  │  │  │  useVehicleAudio() ←──────┼────┼────┼────── Audio Hook
│  │  │  │    ↓                       │    │    │    │
│  │  │  │  Register state in store  │    │    │    │
│  │  │  └────────────────────────────┘    │    │    │
│  │  └─────────────────────────────────────┘    │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │              Header.jsx                      │    │
│  │  - Gets audio state from store              │    │
│  │  - Displays AudioControl                    │    │
│  └──────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────┘
                        ↕
┌────────────────────────────────────────────────────────┐
│                  gameStore.js                          │
│  - vehicleAudioState                                  │
│  - setVehicleAudioState()                             │
└────────────────────────────────────────────────────────┘
```

## State Management

```
Local State (in useVehicleAudio hook)
├─ listenerRef (AudioListener)
├─ engineSoundRef (Audio)
├─ idleSoundRef (Audio)
├─ brakeSoundRef (Audio)
├─ collisionSoundRef (Audio)
├─ audioLoaderRef (AudioLoader)
├─ audioInitialized (boolean)
├─ isAudioEnabled (boolean)
├─ previousVelocity (Vector3)
└─ lastCollisionTime (timestamp)
         ↓
Global State (gameStore)
├─ vehicleAudioState
│   ├─ isAudioEnabled
│   └─ toggleAudio()
└─ setVehicleAudioState()
         ↓
Accessible from any component
```

## Audio Files Loading

```
useVehicleAudio Initialization
         ↓
tryLoadAudio() helper function
         ↓
Try formats in order:
    1. .mp3
    2. .wav
    3. .ogg
         ↓
    Found? ──Yes──► Load buffer → Set volume → Ready
         │
         No
         ↓
    Log "not found" → Continue without audio
```

## Performance Considerations

```
┌─────────────────────────────────────┐
│  Audio System Performance           │
├─────────────────────────────────────┤
│  Initialization: Once per vehicle   │
│  File Loading: Async, non-blocking  │
│  Frame Updates: ~60 FPS             │
│  Calculations per frame:            │
│    - Speed: √(vx² + vy² + vz²)     │
│    - Deceleration: prevSpeed - speed│
│    - Collision: velocityΔ           │
│    - Volume/Pitch adjustments       │
│  Audio playback: Hardware offloaded │
│  Memory: ~4 audio buffers cached    │
└─────────────────────────────────────┘
```

## Integration Points

```
1. Vehicle Component
   └─► Provides vehicleRef & wheelRefs
   
2. useVehicleAudio Hook
   ├─► Reads vehicle physics
   ├─► Controls audio playback
   └─► Exports state

3. Game Store
   ├─► Stores audio state
   └─► Makes it globally accessible

4. UI Components (Optional)
   └─► Can display/control audio

5. Input System (Optional)
   └─► Can add keyboard shortcuts
```

## Summary

The audio system is:
- **Modular**: Contained in one hook
- **Reactive**: Responds to vehicle state
- **Flexible**: Easy to customize
- **Performant**: Optimized for real-time
- **Robust**: Handles missing files
- **Integrated**: Works with existing systems
