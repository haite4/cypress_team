import { faker } from "@faker-js/faker";

class RandomValue {
  selectRandomValueFromArray(array: any[]) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  generateStringWithLength(length: number) {
    return faker.string.alpha(length);
  }

  generateRandomNumber(minNumber: number, maxNumber: number) {
    return faker.number.int({ min: minNumber, max: maxNumber });
  }

  firstName() {
    return faker.person.firstName();
  }

  lastName(){
    return faker.person.lastName();
  }

  phoneNumeric(length: number){
    return Array.from({ length: length }, () => Math.floor(Math.random() * 10)).join('');
  }
}

export default new RandomValue()