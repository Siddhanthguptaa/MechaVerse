import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Audio, AudioListener, AudioLoader } from 'three'
import useGameStore from '../store/gameStore'

/**
 * Vehicle Audio Hook
 * Handles engine, idle, brake, and collision sounds based on vehicle state
 * 
 * @param {Object} vehicleRef - Reference to the vehicle rigid body
 * @param {Array} wheelRefs - Array of wheel references to check contact
 * @returns {Object} - Audio controls and state
 */
const useVehicleAudio = (vehicleRef, wheelRefs = []) => {
    const raceState = useGameStore((state) => state.raceState)
    
    // Audio refs
    const listenerRef = useRef(null)
    const engineSoundRef = useRef(null)
    const idleSoundRef = useRef(null)
    const brakeSoundRef = useRef(null)
    const collisionSoundRef = useRef(null)
    
    // Audio loader
    const audioLoaderRef = useRef(new AudioLoader())
    
    // State
    const [audioInitialized, setAudioInitialized] = useState(false)
    const [isAudioEnabled, setIsAudioEnabled] = useState(true)
    
    // Previous velocity for collision detection
    const previousVelocity = useRef({ x: 0, y: 0, z: 0 })
    const lastCollisionTime = useRef(0)
    
    // Initialize audio system
    useEffect(() => {
        if (!vehicleRef.current || audioInitialized) return

        try {
            // Create audio listener
            const listener = new AudioListener()
            listenerRef.current = listener

            // Create audio sources
            engineSoundRef.current = new Audio(listener)
            idleSoundRef.current = new Audio(listener)
            brakeSoundRef.current = new Audio(listener)
            collisionSoundRef.current = new Audio(listener)

            // Set initial properties for engine sound
            if (engineSoundRef.current) {
                engineSoundRef.current.setLoop(true)
                engineSoundRef.current.setVolume(0)
            }

            // Set initial properties for idle sound
            if (idleSoundRef.current) {
                idleSoundRef.current.setLoop(true)
                idleSoundRef.current.setVolume(0)
            }

            // Set initial properties for brake sound
            if (brakeSoundRef.current) {
                brakeSoundRef.current.setLoop(true)
                brakeSoundRef.current.setVolume(0)
            }

            // Set initial properties for collision sound
            if (collisionSoundRef.current) {
                collisionSoundRef.current.setLoop(false)
                collisionSoundRef.current.setVolume(0)
            }

            // Load audio files (you'll need to add these files to your public/assets folder)
            const loader = audioLoaderRef.current

            // Helper function to try loading both .mp3 and .wav formats
            const tryLoadAudio = (sound, audioRef, baseName, volume) => {
                const formats = ['.mp3', '.wav', '.ogg']
                let loaded = false

                const tryFormat = (index) => {
                    if (index >= formats.length || loaded) {
                        if (!loaded) {
                            console.log(`${baseName} sound not found in any format, will work without it`)
                        }
                        return
                    }

                    loader.load(
                        `/assets/sounds/${baseName}${formats[index]}`,
                        (buffer) => {
                            if (audioRef.current && !loaded) {
                                audioRef.current.setBuffer(buffer)
                                audioRef.current.setVolume(volume)
                                loaded = true
                                console.log(`✓ Loaded ${baseName}${formats[index]}`)
                            }
                        },
                        undefined,
                        (error) => {
                            // Try next format
                            tryFormat(index + 1)
                        }
                    )
                }

                tryFormat(0)
            }

            // Try to load all sounds
            tryLoadAudio('engine', engineSoundRef, 'engine', 0.5)
            tryLoadAudio('idle', idleSoundRef, 'idle', 0.3)
            tryLoadAudio('brake', brakeSoundRef, 'brake', 0.4)
            tryLoadAudio('collision', collisionSoundRef, 'collision', 0.6)

            setAudioInitialized(true)

        } catch (error) {
            console.error('Error initializing vehicle audio:', error)
        }

        // Cleanup
        return () => {
            if (engineSoundRef.current?.isPlaying) engineSoundRef.current.stop()
            if (idleSoundRef.current?.isPlaying) idleSoundRef.current.stop()
            if (brakeSoundRef.current?.isPlaying) brakeSoundRef.current.stop()
            if (collisionSoundRef.current?.isPlaying) collisionSoundRef.current.stop()
        }
    }, [vehicleRef, audioInitialized])

    // Update audio based on vehicle state each frame
    useFrame(() => {
        if (!audioInitialized || !isAudioEnabled || !vehicleRef.current) return

        try {
            // Get vehicle velocity
            const velocity = vehicleRef.current.linvel()
            const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2)

            // Get angular velocity for detecting if wheels are spinning
            const angularVel = vehicleRef.current.angvel()
            const angularSpeed = Math.sqrt(angularVel.x ** 2 + angularVel.y ** 2 + angularVel.z ** 2)

            // Check if any wheels are on ground
            let wheelsOnGround = 0
            wheelRefs.forEach((wheelRef) => {
                if (wheelRef.current) {
                    wheelsOnGround++
                }
            })

            const isGrounded = wheelsOnGround > 0

            // ========== ENGINE SOUND ==========
            if (engineSoundRef.current) {
                const engineSound = engineSoundRef.current

                // Play engine sound when moving or race is active
                if (speed > 0.5 && raceState === 'racing' && isGrounded) {
                    if (!engineSound.isPlaying && engineSound.buffer) {
                        engineSound.play()
                    }

                    // Adjust pitch based on speed (0.5 to 2.0)
                    const basePitch = 0.7
                    const pitchRange = 1.5
                    const maxSpeed = 30 // Adjust based on your vehicle's max speed
                    const pitch = basePitch + (Math.min(speed, maxSpeed) / maxSpeed) * pitchRange
                    engineSound.setPlaybackRate(pitch)

                    // Adjust volume based on speed (0.3 to 0.8)
                    const baseVolume = 0.3
                    const volumeRange = 0.5
                    const volume = baseVolume + (Math.min(speed, maxSpeed) / maxSpeed) * volumeRange
                    engineSound.setVolume(volume)
                } else {
                    // Fade out engine sound
                    if (engineSound.isPlaying) {
                        const currentVolume = engineSound.getVolume()
                        if (currentVolume > 0.01) {
                            engineSound.setVolume(currentVolume * 0.95)
                        } else {
                            engineSound.stop()
                            engineSound.setVolume(0)
                        }
                    }
                }
            }

            // ========== IDLE SOUND ==========
            if (idleSoundRef.current) {
                const idleSound = idleSoundRef.current

                // Play idle sound when not moving much
                if (speed < 0.5 && raceState === 'racing' && isGrounded) {
                    if (!idleSound.isPlaying && idleSound.buffer) {
                        idleSound.play()
                    }
                    idleSound.setVolume(0.25)
                    idleSound.setPlaybackRate(1.0)
                } else {
                    // Fade out idle sound
                    if (idleSound.isPlaying) {
                        const currentVolume = idleSound.getVolume()
                        if (currentVolume > 0.01) {
                            idleSound.setVolume(currentVolume * 0.92)
                        } else {
                            idleSound.stop()
                            idleSound.setVolume(0)
                        }
                    }
                }
            }

            // ========== BRAKE/SKID SOUND ==========
            if (brakeSoundRef.current) {
                const brakeSound = brakeSoundRef.current

                // Detect braking (rapid deceleration while grounded)
                const prevSpeed = Math.sqrt(
                    previousVelocity.current.x ** 2 + 
                    previousVelocity.current.y ** 2 + 
                    previousVelocity.current.z ** 2
                )
                const deceleration = prevSpeed - speed
                const isBraking = deceleration > 0.1 && speed > 2 && isGrounded

                if (isBraking) {
                    if (!brakeSound.isPlaying && brakeSound.buffer) {
                        brakeSound.play()
                    }
                    // Volume based on deceleration intensity
                    const brakeVolume = Math.min(0.6, deceleration * 0.5)
                    brakeSound.setVolume(brakeVolume)
                } else {
                    // Fade out brake sound
                    if (brakeSound.isPlaying) {
                        const currentVolume = brakeSound.getVolume()
                        if (currentVolume > 0.01) {
                            brakeSound.setVolume(currentVolume * 0.85)
                        } else {
                            brakeSound.stop()
                            brakeSound.setVolume(0)
                        }
                    }
                }
            }

            // ========== COLLISION SOUND ==========
            if (collisionSoundRef.current) {
                const collisionSound = collisionSoundRef.current
                const currentTime = performance.now()

                // Detect sudden velocity changes (collisions)
                const velocityChange = Math.sqrt(
                    (velocity.x - previousVelocity.current.x) ** 2 +
                    (velocity.y - previousVelocity.current.y) ** 2 +
                    (velocity.z - previousVelocity.current.z) ** 2
                )

                // Play collision sound if impact is strong enough and cooldown has passed
                const impactThreshold = 3 // Adjust based on your game
                const collisionCooldown = 500 // ms between collision sounds

                if (velocityChange > impactThreshold && currentTime - lastCollisionTime.current > collisionCooldown) {
                    if (collisionSound.buffer) {
                        if (collisionSound.isPlaying) {
                            collisionSound.stop()
                        }
                        // Volume based on impact strength
                        const impactVolume = Math.min(0.8, velocityChange / 10)
                        collisionSound.setVolume(impactVolume)
                        collisionSound.play()
                        lastCollisionTime.current = currentTime
                    }
                }
            }

            // Store current velocity for next frame
            previousVelocity.current = { ...velocity }

        } catch (error) {
            console.error('Error updating vehicle audio:', error)
        }
    })

    // Toggle audio on/off
    const toggleAudio = () => {
        setIsAudioEnabled(!isAudioEnabled)
        if (isAudioEnabled) {
            // Stop all sounds
            if (engineSoundRef.current?.isPlaying) engineSoundRef.current.stop()
            if (idleSoundRef.current?.isPlaying) idleSoundRef.current.stop()
            if (brakeSoundRef.current?.isPlaying) brakeSoundRef.current.stop()
        }
    }

    return {
        isAudioEnabled,
        toggleAudio,
        audioInitialized,
    }
}

export default useVehicleAudio
