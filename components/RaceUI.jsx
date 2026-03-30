
// RaceUI.jsx - UPDATED with Minimap integration

import { useEffect, useState } from 'react';
import useGameStore from '../store/gameStore';
import Minimap from "./Minimap";
import { useMultiplayer } from "../hooks/useMultiplayer.jsx";

// ===========================================
// START BUTTON COMPONENT
// ===========================================
export const StartButton = () => {
    const raceState = useGameStore((state) => state.raceState);
    const sceneLoaded = useGameStore((state) => state.sceneLoaded);
    const physicsEnabled = useGameStore((state) => state.physicsEnabled);
    const setRaceState = useGameStore((state) => state.setRaceState);
    const setStartTime = useGameStore((state) => state.setStartTime);
    const setStartPosition = useGameStore((state) => state.setStartPosition);
    const setHasPassedCheckpoint = useGameStore((state) => state.setHasPassedCheckpoint);
    const setPhysicsEnabled = useGameStore((state) => state.setPhysicsEnabled);

    useEffect(() => {
        console.log('🔍 Start Button Debug:', {
            raceState,
            sceneLoaded,
            physicsEnabled,
            isReady: sceneLoaded && physicsEnabled
        });
    }, [raceState, sceneLoaded, physicsEnabled]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!physicsEnabled) {
                console.log('⚡ Auto-enabling physics...');
                setPhysicsEnabled(true);
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [physicsEnabled, setPhysicsEnabled]);

    const handleStart = () => {
        console.log('🏁 Race Starting!');
        setRaceState('racing');
        setStartTime(Date.now());
        setStartPosition({ x: -10, y: 0, z: -10 });
        setHasPassedCheckpoint(false);

        if (!physicsEnabled) {
            setPhysicsEnabled(true);
        }
    };

    if (raceState !== 'waiting') return null;

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-auto">
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 min-w-[400px]">
                <h2 className="text-4xl font-bold text-white mb-6 text-center">
                    Ready to Race?
                </h2>

                <div className="mb-4 text-xs text-gray-400 text-center space-y-1">
                    <div>Scene: {sceneLoaded ? '✅' : '⏳'}</div>
                    <div>Physics: {physicsEnabled ? '✅' : '⏳'}</div>
                </div>

                <button
                    onClick={handleStart}
                    className="w-full px-12 py-4 rounded-xl font-bold text-xl transition-all duration-200 bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-green-500/50 hover:scale-105"
                >
                    START RACE
                </button>

                <p className="text-gray-400 text-sm mt-4 text-center">
                    Use Arrow Keys to drive
                </p>
            </div>
        </div>
    );
};

// ===========================================
// RACE HUD COMPONENT (WITH MINIMAP)
// ===========================================
export const RaceHUD = () => {
    const raceState = useGameStore((state) => state.raceState);
    const lapCount = useGameStore((state) => state.lapCount);
    const startTime = useGameStore((state) => state.startTime);
    const carPosition = useGameStore((state) => state.cameraTarget);

    const { remotePlayers } = useMultiplayer();

    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        if (raceState === 'racing' && startTime) {
            const interval = setInterval(() => {
                setCurrentTime(Date.now() - startTime);
            }, 10);
            return () => clearInterval(interval);
        }
    }, [raceState, startTime]);

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    };

    if (raceState !== 'racing') return null;

    return (
        <>
            {/* HUD */}
            <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md rounded-xl px-8 py-4 shadow-xl border border-white/20">
                    <div className="flex items-center gap-8">
                        <div className="text-center">
                            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Lap</div>
                            <div className="text-white text-3xl font-bold">{lapCount}/1</div>
                        </div>

                        <div className="w-px h-12 bg-white/20"></div>

                        <div className="text-center">
                            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Time</div>
                            <div className="text-green-400 text-3xl font-bold font-mono">
                                {formatTime(currentTime)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🗺️ MINIMAP */}
            <Minimap
                playerPosition={
                    carPosition
                        ? [carPosition.x, carPosition.y, carPosition.z]
                        : [0, 0, 0]
                }
                remotePlayers={remotePlayers}
            />
        </>
    );
};

// ===========================================
// RACE RESULTS COMPONENT
// ===========================================
export const RaceResults = () => {
    const raceState = useGameStore((state) => state.raceState);
    const startTime = useGameStore((state) => state.startTime);
    const finishTime = useGameStore((state) => state.finishTime);
    const bestLapTime = useGameStore((state) => state.bestLapTime);
    const resetRace = useGameStore((state) => state.resetRace);

    const [isNewRecord, setIsNewRecord] = useState(false);

    const lapTime = finishTime && startTime ? finishTime - startTime : 0;

    useEffect(() => {
        if (lapTime > 0 && (!bestLapTime || lapTime <= bestLapTime)) {
            setIsNewRecord(true);
        } else {
            setIsNewRecord(false);
        }
    }, [lapTime, bestLapTime]);

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    };

    if (raceState !== 'finished') return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-auto">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 shadow-2xl border-2 border-yellow-500/50 max-w-md w-full mx-4">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🏁</div>
                    <h2 className="text-4xl font-bold text-white mb-2">Race Complete!</h2>
                    {isNewRecord && (
                        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg px-4 py-2 inline-block">
                            <span className="text-yellow-400 font-bold">✨ NEW RECORD! ✨</span>
                        </div>
                    )}
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
                    <div className="text-gray-400 text-sm uppercase mb-2">Your Time</div>
                    <div className="text-green-400 text-5xl font-bold font-mono">{formatTime(lapTime)}</div>
                </div>

                <button
                    onClick={resetRace}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl"
                >
                    Race Again
                </button>
            </div>
        </div>
    );
};
