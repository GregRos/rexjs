/**
 * Created by Greg on 02/10/2016.
 */
import {IDisposable, DisposalToken} from "../src";

describe("disposal token", () => {
	let tally = "";
	let nTally = 0;
	beforeEach(() => {
		tally = "";
		nTally = 0;
	});

	it("disposes", () => {
		let token = new DisposalToken(() => tally += "a");
		token.close();
		expect(tally).toBe("a");
	});

	it("merges", () => {
		let tokens : DisposalToken[] = [] ;

		for (let i = 0; i < 10; i++) {
			tokens.push(new DisposalToken(() => tally += i));
		}
		let [fst, ...toks] = tokens;
		let total = fst.and(...toks);
		total.close();
		expect(tally).toBe("0123456789");
	});

	it("mutli-merges", () => {
		let tokens1 : DisposalToken[] = [];
		for (let i = 0; i < 10; i++) {
			tokens1.push(new DisposalToken(() => tally += i));
		}
		let tokens2 : DisposalToken[]  = [];
		for (let i = 0; i < 10; i++) {
			tokens2.push(new DisposalToken(() => tally += i));
		}
		let [fst1, ...rest1] = tokens1;
		let [fst2, ...rest2] = tokens2;
		let group1 = fst1.and(...rest1);
		let group2 = fst2.and(...rest2);
		let all = group1.and(group2);

		//check the merge was performed correctly...
		let privateList = (all as any)._disposalList as Function[];
		expect(privateList.length).toBe(20);
		all.close();
		expect(tally).toBe("01234567890123456789");
	})


});