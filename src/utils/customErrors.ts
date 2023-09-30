export class WrongClientRequest extends Error {
  statusCode = 400;

  constructor(message: string) {
    super(message);

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, WrongClientRequest.prototype);
  }

  getErrorMessage() {
    return 'Error(custom): Wrong Client Request:' + this.message;
  }
}

// const err = new UserNotFoundError('User not found');
