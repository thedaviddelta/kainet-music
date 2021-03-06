import { FC, SyntheticEvent } from "react";
import { Image, useColorModeValue, BackgroundProps } from "@chakra-ui/react";
import { PlayerBar, ItemMetadata, TrackProgress, PlaybackButtons, QueuePopover, VolumeControl } from ".";
import { usePlayer } from "@hooks";

type Props = {
    bg: BackgroundProps["bg"],
    [key: string]: any
};

const Player: FC<Props> = (props) => {
    const {
        audioRef,
        sourceUrl,
        currentTrack,
        isTrackAlone,
        setup,
        onLoadError,
        isPlaybackEmpty,
        isPlaying,
        play,
        pause,
        currentTime,
        duration,
        setCurrentTime,
        volume,
        setVolume,
        canPrev,
        prev,
        next,
        isShuffle,
        toggleShuffle,
        isNotRepeating,
        isRepeatingAll,
        isRepeatingOne,
        toggleRepeat,
        remainingQueue,
        goTo
    } = usePlayer();

    type AudioEvent = SyntheticEvent<HTMLAudioElement> & { target: HTMLAudioElement };
    const selectedColor = useColorModeValue("kaihong.800", "kaihong.500");
    return (
        <>
            <audio
                ref={audioRef}
                src={sourceUrl}
                onPlay={play}
                onPause={pause}
                onEnded={next}
                loop={isRepeatingOne || (isRepeatingAll && isTrackAlone)}
                onLoadedMetadata={(e: AudioEvent) => (
                    setup(e.target.duration)
                )}
                onTimeUpdate={(e: AudioEvent) => (
                    setCurrentTime(e.target.currentTime)
                )}
                onError={onLoadError}
            />

            <PlayerBar
                itemMetadata={(props) => (
                    <ItemMetadata
                        title={currentTrack?.title ?? "No track"}
                        subtitlesList={[[currentTrack?.artist ?? "Unknown"]]}
                        showTooltip={true}
                        {...props}
                    />
                )}
                trackThumbnail={(props) => (
                    <Image
                        src={currentTrack?.thumbnails?.[currentTrack.thumbnails.length - 1] ?? ""}
                        fallbackSrc="/fallback.svg"
                        alt={currentTrack?.title ?? "No track"}
                        {...props}
                    />
                )}
                trackProgress={(props) => (
                    <TrackProgress
                        currentTime={currentTime}
                        duration={duration}
                        setCurrentTime={setCurrentTime}
                        {...props}
                    />
                )}
                playbackButtons={(props) => (
                    <PlaybackButtons
                        isPlaybackEmpty={isPlaybackEmpty}
                        isPlaying={isPlaying}
                        togglePlay={isPlaying ? pause : play}
                        canPrev={canPrev}
                        prev={prev}
                        next={next}
                        isShuffle={isShuffle}
                        toggleShuffle={toggleShuffle}
                        isNotRepeating={isNotRepeating}
                        isRepeatingOne={isRepeatingOne}
                        toggleRepeat={toggleRepeat}
                        selectedColor={selectedColor}
                        {...props}
                    />
                )}
                queuePopover={(props) => (
                    <QueuePopover
                        remainingQueue={remainingQueue}
                        goTo={goTo}
                        selectedColor={selectedColor}
                        {...props}
                    />
                )}
                volumeControl={(props) => (
                    <VolumeControl
                        volume={volume}
                        setVolume={setVolume}
                        {...props}
                    />
                )}
                {...props}
            />
        </>
    );
};

export default Player;
