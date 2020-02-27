import {Component, Injectable, Type} from '@angular/core';

export function testDecorator() {
  return (target: Type<void>) => {
    const original = target;

    const newConstructor: any = function newCtr(...args) {
      const c: any = function childConstructor(...args2) {
        return new original(...args2);
      };
      c.prototype = Object.create(original.prototype);
      const instance = new c(...args);

      instance.extra = {};

      return instance;
    };

    newConstructor.prototype = Object.create(target.prototype);

    return newConstructor;
  };
}

@Injectable()
export class TestServiceA {}

@Injectable()
@testDecorator()
export class TestServiceB extends TestServiceA {}

@Injectable()
// @testDecorator()
export class TestService extends TestServiceB {}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  providers: [TestService]
})
export class AppComponent  {
  constructor(private testService: TestService) {}
}
