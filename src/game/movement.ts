import { SEGMENT_SIZE } from "../draw/draw";
import { Direction, Position } from "./useGameLogic";

const createSnakeMovement = (gridSize = 5) => ({
    moveRight: (snakebody: Position[]) => {
        const bodyCopy = [...snakebody];
        const headPos = bodyCopy[bodyCopy.length - 1];
        bodyCopy.shift();
        return [...bodyCopy, {...headPos, x: headPos.x + gridSize}]
    },
    moveLeft: (snakebody: Position[]) => {
        const bodyCopy = [...snakebody];
        const headPos = bodyCopy[bodyCopy.length - 1];
        bodyCopy.shift();
        return [...bodyCopy, {...headPos, x: headPos.x - gridSize}]
    },
    moveDown: (snakebody: Position[]) => {
        const bodyCopy = [...snakebody];
        const headPos = bodyCopy[bodyCopy.length - 1];
        bodyCopy.shift();
        return [...bodyCopy, {...headPos, y: headPos.y + gridSize}]
    },
    moveUp: (snakebody: Position[]) => {
        const bodyCopy = [...snakebody];
        const headPos = bodyCopy[bodyCopy.length - 1];
        bodyCopy.shift();
        return [...bodyCopy, {...headPos, y: headPos.y - gridSize}]
    },
})


interface willSnakeHitTheFoodArgs {
    foodPosition: Position;
    snakeHeadPosition: Position;
    direction: Direction;
}

export const willSnakeHitTheFood = ({
    foodPosition,
    snakeHeadPosition,
    direction,
}: willSnakeHitTheFoodArgs) => {
    switch (direction) {
        case Direction.UP:
            return (
                foodPosition.x === snakeHeadPosition.x && 
                snakeHeadPosition.y - 5 === foodPosition.y
            );
            break;
        case Direction.DOWN:
            return (
                foodPosition.x === snakeHeadPosition.x && 
                snakeHeadPosition.y + 5 === foodPosition.y
            );
            break;
        case Direction.LEFT:
            return (
                foodPosition.y === snakeHeadPosition.y && 
                snakeHeadPosition.x - 5 === foodPosition.x
            );
            break;    
        case Direction.RIGHT:
            return (
                foodPosition.y === snakeHeadPosition.y && 
                snakeHeadPosition.x + 5 === foodPosition.x
            );
            break;
    
    }
};

export const hasSnakeEatenItself = (snakebody: Position[]) => {
    if (snakebody.length <= 1) {
        return false;
    }
    const head = snakebody[snakebody.length - 1];
    const body = snakebody.slice(0, snakebody.length - 1);

    return body.some(segment => segment.x === head.x && segment.y === head.y);

}


export default createSnakeMovement;