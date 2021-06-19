const prompt = require('prompt-sync')({sigint: true});

//parameters for the game, height is the number of arrays, width is the length of each array, and hole probability is the likelihood of a hole being at an index.
const mapHeight = 12;
const mapWidth = 8;
const holeProbability = 33;

//defining global variables
const rand = (num) => { return Math.floor(Math.random() * num)};
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this.field = field;
  }
  print() {
    console.log((this.field.join('\n')))
  }
  static generateField(height, width, percentage) {
    let array = [];
    const hatRow = rand(2) + (height-2);
    const hatColumn = rand(width);
    for (let x = 0; x < height; x++) {
      let nestedArray = [];
      for (let i = 0; i < width; i++) {
        if (i === 0 && x === 0) {nestedArray.push(pathCharacter)} 
        else if (x === hatRow && i === hatColumn){nestedArray.push(hat)}
        else {
          let randNum = rand(100);
          if (randNum >= percentage) {nestedArray.push(fieldCharacter)} 
          else {nestedArray.push(hole)};
        }
      } 
    array.push(nestedArray);
    }
    return array;
  }
  playGame () {
    const numRows = this.field.length;
    const numCols = this.field[0].length;
    let gameOver = false;
    let position = [0, 0];
    while (gameOver === false) {
      this.print();
      let move = prompt('Which Way?');
      switch (move) {
        case 'd':
        position[0]++;
        break;
        case 'r':
        position[1]++;
        break;
        case 'u':
        position[0]--;
        break;
        case 'l':
        position[1]--;
        break;
        default:
        console.log('Input d, r, u, or l to move.');
        break;
        };
      if (position[0] < 0 || position[1] < 0 || position[0] > numRows-1 || position[1] > numCols-1) {
        gameOver = true;
        console.log('Out of Bounds! You lose.')
      } else if (this.field[position[0]][position[1]] === 'O') {
        gameOver = true;
        console.log('You fell into a hole! You lose.');
      } else if (this.field[position[0]][position[1]] === hat) {
        gameOver = true;
        console.log('Congratz! You found your hat!')
      } else { this.field[position[0]][position[1]] = pathCharacter }
    }
  }
}
console.log('Welcome to the find-your-hat maze game! Run this game in the terminal, use u, d, r, and l to navigate through a map to find the ^!')
const field = new Field(Field.generateField(mapHeight, mapWidth, holeProbability))
field.playGame();
