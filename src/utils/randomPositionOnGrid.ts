interface randomPositionOnGridArgs {
    gridSize?: number;
    threshold: number;
}

const randomPositionOnGrid = ({
    gridSize = 5, 
    threshold,
}: randomPositionOnGridArgs) => 
Math.floor(Math.random() * (threshold / gridSize)) * gridSize;

export default randomPositionOnGrid;