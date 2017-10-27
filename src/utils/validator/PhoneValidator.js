import BaseValidator from "./BaseValidator";

export default class PhoneValidator extends BaseValidator {
  static validate(text) {
    const re = /0[1-9]{9,13}/;
    return re.test(text);
  }
}
