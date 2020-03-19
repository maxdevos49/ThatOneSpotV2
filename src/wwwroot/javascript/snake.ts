export enum SnakeDirection {
    UP = 0,
    RIGHT,
    DOWN,
    LEFT
}

export interface SnakeCell{
    x: number,
    y: number
}

export class Snake {

    public x: number;
    public y: number;

    private links: SnakeCell[];
    public direction: SnakeDirection;

    constructor(givenX: number, givenY: number, givenDirection: SnakeDirection) {

        this.links = [{
            x: givenX,
            y: givenY
        }];
        this.grow(2);
        this.direction = givenDirection;

    }

    /**
     * Moves the snake 1 block in a given direction
     */
    public move(): void {

        let head = this.links.pop();

        head.x = this.links[0].x;
        head.y = this.links[0].y;

        if (this.direction === SnakeDirection.UP) {
            head.y--;
        } else if (this.direction === SnakeDirection.DOWN) {
            head.y++;
        } else if (this.direction === SnakeDirection.LEFT) {
            head.x--;
        } else if (this.direction === SnakeDirection.RIGHT) {
            head.x++;
        }

        this.x = head.x;
        this.y = head.y;

        this.links.unshift(head);

    }

    /**
     * Adds a new link to the snake
     */
    public grow(num: number = 1) : void{
        for(let i = 0; i < num; i++){
            this.links.push({x:-1,y:-1});
        }
    }

    /**
     * Returns the array of links of the snake
     */
    public getLinks() : SnakeCell[]{
        return this.links;
    }

    /**
     * Returns the Amount of links in the snake
     */
    public getLength(): number {
        return this.links.length;
    }

}