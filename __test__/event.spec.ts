import {RexEvent, IDisposable} from "../src";
/**
 * Created by Greg on 02/10/2016.
 */


describe("events", () => {
	let event = new RexEvent<number>();
	let tally = "";
	beforeEach(() => {
		event.clear();
		tally = "";
	});

	describe("basic subscribe/unsubscribe support", () => {

		it("should basic subscribe", () => {
			event.fires(x => tally += x);
			event.fire(1);
			expect(tally).toBe("1");
		});

		it("should subscribe multiple times", () => {
			event.fires(x => tally += x);
			event.fires(x => tally += -x);
			event.fire(1);
			expect(tally).toBe("1-1");
		});

		it("should unsubscribe correctly", () => {
			let token = event.fires(x => tally += x);
			event.fire(1);
			expect(tally).toBe("1");
			token.close();
			event.fire(1);
			expect(tally).toBe("1");
		});

		it("should unsubscribe correctly xN", () => {
			let toks: IDisposable[] = [];
			for (let i = 0; i < 10; i++) {
				toks.push(event.fires(x => tally += i));
			}
			event.fire(0);
			expect(tally).toBe("0123456789");
			tally = "";
			toks[5].close();
			event.fire(0);
			expect(tally).toBe("012346789");

		});
	});

	describe("event subscribe/unsubscribe support", () => {
		let event2 = new RexEvent<number>("event2");
		beforeEach(() => {
			event2.clear();
		});
		it("should subscribe correctly", () => {
			event2.fires(event);
			event.fires(x => tally += x);
			event2.fire(1);
			expect(tally).toBe("1");
		});

		it("should unsubscribe correctly", () => {
			let tok = event2.fires(event);
			event.fires(x => tally += x);
			event2.fire(0);
			expect(tally).toBe("0");
			tok.close();
			event2.fire(1);
			expect(tally).toBe("0");
		})
	});

});