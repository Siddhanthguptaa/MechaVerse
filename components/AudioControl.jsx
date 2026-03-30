import { Volume2, VolumeX } from 'lucide-react'
import useGameStore from '../store/gameStore'

/**
 * Audio Control Button Component
 * Allows users to toggle vehicle audio on/off
 * Add this to your Header or UI component
 */
const AudioControl = ({ isAudioEnabled, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 
                       text-white transition-colors duration-200 border border-gray-600"
            title={isAudioEnabled ? 'Mute Audio' : 'Enable Audio'}
        >
            {isAudioEnabled ? (
                <>
                    <Volume2 size={20} />
                    <span className="text-sm font-medium">Audio On</span>
                </>
            ) : (
                <>
                    <VolumeX size={20} />
                    <span className="text-sm font-medium">Audio Off</span>
                </>
            )}
        </button>
    )
}

export default AudioControl
