export function generateRandom10DigitNumber() {
    let randomNum = '';
    for (let i = 0; i < 10; i++) {
      randomNum += Math.floor(Math.random() * 10);
    }
    return Number(randomNum);
  }