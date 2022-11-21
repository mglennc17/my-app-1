import { on } from "events";
import React, { useEffect, useState } from "react"
import { canHaveModifiers } from "typescript";
import { SEGMENT_SIZE } from "../draw/draw";
import randomPositionOnGrid from "../utils/randomPositionOnGrid";
import useInterval from "../utils/useInterval";
import { GameState } from "./Game";
import createSnakeMovement, { hasSnakeEatenItself, willSnakeHitTheFood } from "./movement";

export interface Position {
    x: number;
    y: number;
}

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

const MOVEMENT_SPEED = 50;

interface useGameLogicArgs {
    canvasWidth?: number;
    canvasHeight?: number;
    onGameOver: () => void;
    gameState: GameState;
}

const useGameLogic = ({canvasHeight, canvasWidth, onGameOver, gameState}:useGameLogicArgs) => {
    const [direction, setDirection] = useState<Direction | undefined>();
    const [snakebody, setSnakeBody] = useState<Position[]>([
        {
            x: 0,
            y: 0,
        },
    ]);

const resetGameState = () => {
    setDirection(undefined)
    setFoodPosition({
        x: randomPositionOnGrid({
            gridSize: SEGMENT_SIZE,
            threshold: canvasWidth!,
        }),
        y: randomPositionOnGrid({
            gridSize: SEGMENT_SIZE,
            threshold: canvasHeight!,
        }),
    });

    setSnakeBody([{
        x: randomPositionOnGrid({
            gridSize: SEGMENT_SIZE,
            threshold: canvasWidth!,
        }),
        y: randomPositionOnGrid({
            gridSize: SEGMENT_SIZE,
            threshold: canvasHeight!,
        }),
    }])
};

    const [foodPosition, setFoodPosition] = useState<Position | undefined>();

    const snakeHeadPosition = snakebody[snakebody.length - 1];
    const {moveDown, moveLeft, moveRight, moveUp} = createSnakeMovement();

    useEffect(() => {
        if (!canvasHeight || !canvasWidth) {
            return;
        }
        setFoodPosition({
            x: randomPositionOnGrid({
                gridSize: SEGMENT_SIZE,
                threshold: canvasWidth,
            }),
            y: randomPositionOnGrid({
                gridSize: SEGMENT_SIZE,
                threshold: canvasHeight,
            }),
        });

        setSnakeBody([{
            x: randomPositionOnGrid({
                gridSize: SEGMENT_SIZE,
                threshold: canvasWidth,
            }),
            y: randomPositionOnGrid({
                gridSize: SEGMENT_SIZE,
                threshold: canvasHeight,
            }),
        }])

    }, [canvasHeight, canvasWidth])

    const onKeyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) =>  {
        switch (event.code) {
            case 'KeyS':
                if (direction !== Direction.UP) {
                    setDirection(Direction.DOWN)
                }
                break;
            case 'KeyW':
                if (direction !== Direction.DOWN) {
                    setDirection(Direction.UP);
                }
                break;
            case 'KeyA':
                if (direction !== Direction.RIGHT) {
                    setDirection(Direction.LEFT);
                }
               break;
            case 'KeyD':
                if (direction !== Direction.LEFT) {
                    setDirection(Direction.RIGHT);
                }
                break;    
        }
    };
    
    const moveSnake = () => {
        let snakebodyAfterMovement: Position[] | undefined;
        switch (direction) {
            case Direction.UP:
                if(snakeHeadPosition.y > 0) {
                snakebodyAfterMovement = moveUp(snakebody);
                } else if (canvasWidth && snakeHeadPosition.x > canvasWidth / 2) {
                    setDirection(Direction.LEFT);
                } else {
                    setDirection(Direction.RIGHT);
                }
                break;
            case Direction.DOWN:
                if(canvasHeight && snakeHeadPosition.y < canvasHeight - SEGMENT_SIZE) {
                    snakebodyAfterMovement = moveDown(snakebody);
                } else if (canvasWidth && snakeHeadPosition.x > canvasWidth / 2) {
                    setDirection(Direction.LEFT);
                } else {
                    setDirection(Direction.RIGHT);
                }
                break;
            case Direction.LEFT:
                if(snakeHeadPosition.x > 0) {
                    snakebodyAfterMovement = moveLeft(snakebody);
                } else if (canvasHeight && snakeHeadPosition.y < canvasHeight / 2){
                    setDirection(Direction.DOWN);
                } else {
                    setDirection(Direction.UP);
                }
                break;
            case Direction.RIGHT:
                if (canvasWidth && snakeHeadPosition.x < canvasWidth - SEGMENT_SIZE) {
                    snakebodyAfterMovement = moveRight(snakebody);
                } else if (canvasHeight && snakeHeadPosition.y < canvasHeight / 2) {
                    setDirection(Direction.DOWN)
                } else {
                    setDirection(Direction.UP)
                }
                break;
        }
        
        if(snakebodyAfterMovement) {
            const isGameOver = hasSnakeEatenItself(snakebodyAfterMovement);
            if (isGameOver) {
                onGameOver();
            }
        }

        if(direction !== undefined && foodPosition && willSnakeHitTheFood({
            foodPosition,
            snakeHeadPosition,
            direction,
        }))  {
            setSnakeBody([
                ...snakebodyAfterMovement!,
                {x: foodPosition.x, y: foodPosition.y}
            ])
            setFoodPosition({
                x: randomPositionOnGrid({
                    threshold: canvasWidth!
                }),
                y: randomPositionOnGrid({
                    threshold: canvasHeight!
                }),
            })
        }    else if(snakebodyAfterMovement) {
            setSnakeBody(snakebodyAfterMovement);
        }
    };

    useInterval(moveSnake, gameState === GameState.RUNNING ? MOVEMENT_SPEED : null);

    return {
        snakebody,
        onKeyDownHandler,
        foodPosition,
        resetGameState,
    };
};

export default useGameLogic;
