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
			event.on(x => tally += x);
			event.invoke(1);
			expect(tally).toBe("1");
		});

		it("should subscribe multiple times", () => {
			event.on(x => tally += x);
			event.on(x => tally += -x);
			event.invoke(1);
			expect(tally).toBe("1-1");
		});

		it("should unsubscribe correctly", () => {
			let token = event.on(x => tally += x);
			event.invoke(1);
			expect(tally).toBe("1");
			token.close();
			event.invoke(1);
			expect(tally).toBe("1");
		});

		it("should unsubscribe correctly xN", () => {
			let toks: IDisposable[] = [];
			for (let i = 0; i < 10; i++) {
				toks.push(event.on(x => tally += i));
			}
			event.invoke(0);
			expect(tally).toBe("0123456789");
			tally = "";
			toks[5].close();
			event.invoke(0);
			expect(tally).toBe("012346789");
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
			event2.invoke(1);
			expect(tally).toBe("1");
		})
	});

});