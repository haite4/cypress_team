import { faker } from "@faker-js/faker";

class RandomValue {
  selectRandomValueFromArray(array: any[]) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  generateStringWithLength(length: number) {
    return faker.string.alphanumeric(length);
  }

  generateRandomNumber(minNumber: number, maxNumber: number) {
    return faker.number.int({ min: minNumber, max: maxNumber });
  }
}

export default new RandomValue();
