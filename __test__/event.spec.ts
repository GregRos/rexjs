import {RexEvent, ISubscription} from "../src";
import {Subscription} from "../src/events/subscription";
/**
 * Created by Greg on 02/10/2016.
 */


describe("events", () => {
	let event = new RexEvent<number>();
	let tally = "";
	let sub : Subscription;
	beforeEach(() => {
		event.clear();
		tally = "";
	});

	describe("empty event", () => {
		it("should fire", () => {
			event.fire(1);
		});
	});

	describe("simple subscription", () => {
		beforeEach(() => sub = event.on(x => tally += x));
		it("should basic subscribe", () => {
			event.fire(1);
			expect(tally).toBe("1");
		});

		it("should subscribe twice", () => {
			event.on(x => tally += -x);
			event.fire(1);
			expect(tally).toBe("1-1");
		});

		describe("freezing", () => {
			let sub2 : Subscription;
			beforeEach(() => {
				sub2 = event.on(x => tally += -x);
			});

			it("should freeze", () => {
				sub2.freeze();
				event.fire(1);
				expect(tally).toBe("1");
			});

			it("freezing twice does nothing", () => {
				sub2.freeze();
				sub2.freeze();
				event.fire(1);
				expect(tally).toBe("1");
			});

			it("it should unfreeze", () => {
				sub2.freeze();
				event.fire(1);
				sub2.unfreeze();
				event.fire(1);
				expect(tally).toBe("11-1");
			});

			it("unfreeze on unfrozen does nothing", () => {
				sub.unfreeze();
				sub.unfreeze();
				event.fire(1);
				expect(tally).toBe("1-1");
			});
		});
	});

	describe("event subscribe/unsubscribe support", () => {
		let event2 = new RexEvent<number>("event2");
		beforeEach(() => {
			event2.clear();
		});
		it("should subscribe correctly", () => {
			event2.on(event);
			event.on(x => tally += x);
			event2.fire(1);
			expect(tally).toBe("1");
		});

		it("should unsubscribe correctly", () => {
			let tok = event2.on(event);
			event.on(x => tally += x);
			event2.fire(0);
			expect(tally).toBe("0");
			tok.close();
			event2.fire(1);
			expect(tally).toBe("0");
		})
	});

});