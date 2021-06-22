const prompt = require('prompt-sync')({sigint: true});

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
    const hatColumn = rand(4) + (width-4);
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
      let move = prompt('Which Way?').toLowerCase();
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
        console.log('Input d, r, u, or l to move (not case sensitive).');
        break;
        }
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
  checkPossibility() {
    let copiedField = JSON.parse(JSON.stringify(this.field));
    let start
    let findStart = copiedField.forEach((ele, dex) => {
      if (ele.includes(pathCharacter)) {
        start = [dex, ele.indexOf(pathCharacter)];
      }
    });

    let currentPath = start
    let pathsTaken = [start];
    let blockedPaths = [];
    let possiblePaths = [start];

    while (copiedField[currentPath[0]][currentPath[1]] !== hat && possiblePaths.length >= 1) {

      //console.log(`Possible paths list: ${possiblePaths}`)
      let currentPath = possiblePaths.pop();
      if (copiedField[currentPath[1]][currentPath[0]] === hat) {
          //console.log(`Found hat at ${currentPath}`)
          return true;
      }
      //console.log(`Current path is ${currentPath}`)
      let adjacentPaths = [[currentPath[0]+1, currentPath[1]], [currentPath[0]-1, currentPath[1]], [currentPath[0], currentPath[1]+1], [currentPath[0], currentPath[1]-1]];
      let existingAdjacents = adjacentPaths.filter(ele=> {
        if (ele[0] <= copiedField[0].length-1 && ele[1] <= copiedField.length-1 && ele[0] >= 0 && ele[1] >= 0) {
          return true;
        } else {return false}
      })
      
      existingAdjacents.forEach(ele => {
        if (copiedField[ele[1]][ele[0]] === hole) {
          //copiedField[ele[1]][ele[0]] = 'X';
          blockedPaths.push(ele);
        } if (copiedField[ele[1]][ele[0]] === fieldCharacter) {
          //console.log(`Pushing ${ele} to possiblePaths`)
          copiedField[ele[1]][ele[0]] = pathCharacter;
          pathsTaken.push(ele);
          possiblePaths.push(ele);
          } if (copiedField[ele[1]][ele[0]] === hat) {
              pathsTaken.push(ele)
              possiblePaths.push(ele)
              //console.log('The adjacent cell is the Hat!')
          }
      })
    } console.log('Maze is not completable')
    return false;
  }
}

//Set maze height, width, and probability of a new hole being generated.
const height = 12;
const width = 20;
const probability = 33;
//Creates a new maze, if the maze is not completable, auto generates a new maze and tries again. Logs the number of attempts taken to create a beatable maze. 
const createBeatableMaze = (height, width, probability) => {
    var field = new Field(Field.generateField(height, width, probability))
    var count = 1;
    while (field.checkPossibility() !== true) {
        //console.log(`Initial maze was unbeatable, generating new maze... Triggered ${count} times.`)
        count++
        field = new Field(Field.generateField(height, width, probability));
    } 
console.log('Welcome to the \'Find Your Hat\' maze game! Navigate the * around the O\'s until you reach the ^ symbol. Use U, D, L, and R to move.');
field.playGame();
}
createBeatableMaze(height, width, probability);
