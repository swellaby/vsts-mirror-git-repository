import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('Array', () => {
    it('should return -1 when the value is not present', () => {
        expect(-1).to.equal([1, 2, 3].indexOf(4));
    });
});
