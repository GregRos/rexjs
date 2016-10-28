/**
 * Created by Greg on 02/10/2016.
 */
import {ISubscription, Subscription} from "../src";
import {ClosedError, Errors} from "../src/errors";
import _ = require("lodash");
let tally = "";
interface SubscriptionTestMembers<T extends Subscription> {
	ctor(): T;
	name: string;
	closeValue: string;
	freezeValue: string;
	unfreezeValue: string;
}

let testsFor = <T extends Subscription>(members: SubscriptionTestMembers<T>) => {
	describe(`subscription name: ${members.name}`, () => {
		let nTally = 0;
		let token: Subscription;
		beforeEach(() => {
			tally = "";
			nTally = 0;
			token = members.ctor();
		});

		describe("basics", () => {

			it("is not closed", () => {
				expect(token.isClosed).toBe(false);
			});
			it("disposes", () => {
				token.close();
				expect(tally).toBe(members.closeValue);
			});

			it("freezes", () => {
				token.freeze();
				expect(tally).toBe(members.freezeValue);
			});

			it("unfreezes", () => {
				token.unfreeze();
				expect(tally).toBe(members.unfreezeValue);
			});
		});

		describe("redudant operations", () => {
			it("disposes twice, 2nd time is harmless", () => {
				token.close();
				token.close();
				expect(tally).toBe(members.closeValue);
			});
		});

		describe("actions on closed subscription", () => {
			beforeEach(() => {
				token.close();
				tally = "";
			});
			it("freezing", () => {
				token.freeze();
				expect(tally).toBe("");
			});

			it("unfreezing", () => {
				token.freeze();
				expect(tally).toBe("");
			});

			it("freezeWhile", () => {
				token.freezeWhile(() => {
				});
				expect(tally).toBe("");
			});
		});

		describe("extra functionality", () => {
			it("freezeWhile method", () => {
				token.freezeWhile(() => tally += "-");
				expect(tally).toBe(`${members.freezeValue}-${members.unfreezeValue}`);
			});

			it("merge tokens", () => {
				let [fst, ...rest] = _.range(0, 10).map(x => members.ctor());
				let merged = fst.and(...rest);
				expect(merged instanceof Subscription).toBe(true);
				merged.close();
				expect(tally).toBe(_.repeat(members.closeValue, 10))
			});
		});
	})
};

testsFor({
	ctor() {
		return new Subscription({
			close: () => tally += this.closeValue,
			freeze: () => tally += this.freezeValue,
			unfreeze: () => tally += this.unfreezeValue
		});
	},
	closeValue: "a",
	freezeValue: "b",
	unfreezeValue: "c",
	name: "Subscription"
});

testsFor({
	name: "MultiSubscriptionx1",
	closeValue: "c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,",
	unfreezeValue: "u0,u1,u2,u3,u4,u5,u6,u7,u8,u9,",
	freezeValue: "f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,",
	ctor() {
		let tokens: Subscription[] = [];
		for (let i = 0; i < 10; i++) {
			tokens.push(new Subscription({
				close: () => tally += `c${i},`,
				freeze: () => tally += `f${i},`,
				unfreeze: () => tally += `u${i},`
			}));
		}
		let [fst, ...rest] = tokens;
		return fst.and(...rest);
	}
});