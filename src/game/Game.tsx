import React, { useRef, useState } from "react";
import Canvas from "../canvas/Canvas";
import draw from "../draw/draw";
import { GameWrapper } from "./Game.styles"
import useGameLogic from "./useGameLogic";
interface GameProps {}


export enum GameState {
    RUNNING,
    GAME_OVER,
    PAUSED,
}

const Game: React.FC<GameProps> = ({}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<GameState>(GameState.RUNNING);

    const onGameOver = () => setGameState(GameState.GAME_OVER)

    const { snakebody, onKeyDownHandler, foodPosition, resetGameState } = useGameLogic({
        canvasHeight: canvasRef.current?.height,
        canvasWidth: canvasRef.current?.width,
        onGameOver, 
        gameState,
    });
   
    const drawGame = (ctx: CanvasRenderingContext2D) => {
        draw({ctx, snakebody, foodPosition })
    };

    return (
        <GameWrapper tabIndex={0} onKeyDown={onKeyDownHandler}>
            <Canvas ref={canvasRef} draw={drawGame} />
            {gameState === GameState.GAME_OVER ? (
                <button onClick={() => {
                    setGameState(GameState.RUNNING);
                    resetGameState();
                }
                }>Play Again</button>
            ) : <button onClick={() => {
                setGameState(gameState === GameState.RUNNING ? GameState.PAUSED : GameState.RUNNING)
            }}>{gameState === GameState.RUNNING ? 'pause' : 'play'}</button>}
        </GameWrapper>
    );

};

export default Game;