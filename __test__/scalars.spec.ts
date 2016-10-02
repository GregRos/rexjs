/**
 * Created by Greg on 02/10/2016.
 */
import {Rexs} from '../src';
import {ClosedError} from "../src/errors/index";
import {RexScalar} from "../src/rexes/scalar/index";
let throwsClosed = (f: () => void) => {
	expect(f).toThrowError(ClosedError);
};
let tally = "";
beforeEach(() => tally = "");
let baseTests = (ctor : <T>(init : T) => RexScalar<T>) => {
	describe("basic tests", () => {
		let Var = ctor(0);

		beforeEach(() => {
			Var = ctor(0)
		});

		it("isn't closed", () => expect(Var.isClosed).toBe(false));

		it("can read", () => {
			expect(Var.value).toBe(0);
		});

		it("can write", () => {
			Var.value = 1;
			expect(Var.value).toBe(1);
		});

		it("notifies change", () => {
			Var.changed.on(x => tally += "a");
			Var.value = 1;
			expect(tally).toBe("a");
		});

		it("notifies close", () => {
			Var.closing.on(x => tally += "closing");
			Var.close();
			expect(tally).toBe("closing");
		});

		describe("operations on closed", () => {
			beforeEach(() => Var.close());
			it("is closed", () =>
				expect(Var.isClosed).toBe(true));
			it("can close again", () => Var.close());
			it("throws on read", () => throwsClosed(() => Var.value));
			it("throws on write", () => throwsClosed(() => Var.value = 1));
			it("can access passive props", () => {
				Var.meta.name = "hi";
				let x = Var.info.type;
				let a = Var.depends;
			});
		});

		describe("special write operations", () => {
			let oVar = ctor({a: 1});
			beforeEach(() => {
				oVar = ctor({a: 1});
			});

			it("mutate", () => {
				let cToken = oVar.changed.on(x => tally += "a");
				let original = oVar.value;
				oVar.mutate(o => o.a = 2);
				expect(tally).toBe("a");
				expect(oVar.value.a).toBe(2);
				//mutate should change the reference:
				expect(oVar.value).not.toBe(original);
			});

			it("reduce", () => {
				oVar.reduce(({a}) => ({a: a + 1}));
				expect(oVar.value.a).toBe(2);
			});
		});
	});
};

describe("scalars", () => {

	describe("var", () => {
		baseTests(Rexs.var_);
	});

	describe("convert", () => {
		baseTests(x => Rexs.var_(x).convert_(x => x, x => x));
		let link1 = Rexs.var_(1);
		let link2 = link1.convert_(x => x * 2, x => x / 2);

		beforeEach(() => {
			link1 = Rexs.var_(1);
			link2 = link1.convert_(x => x * 2, x => x / 2);
		});

		describe("consistency tests", () => {
			it("notifies change in link1", () => {
				link2.changed.on(x => {
					tally += "a";
				});
				link1.value = 2;
				expect(link2.value).toBe(4);
				expect(tally).toBe("a");
			});

			it("sends change back to link1", () => {
				link1.changed.on(x => {
					tally += "a";
				});
				link2.value = 4;
				expect(tally).toBe("a");
				expect(link1.value).toBe(2);
			});

			it("closes when link1 is closed", () => {
				link2.closing.on(() => tally += "a");
				link1.close();
				expect(link2.isClosed).toBe(true);
				expect(tally).toBe("a");
			});

			it("when link2 is closed, link1 works", () => {
				link2.close();
				expect(link1.isClosed).toBe(false);
				link1.value = -1;
				expect(link1.value).toBe(-1);
				throwsClosed(() => link2.value);
			});

			it("has dependency info", () => {
				expect(link2.depends.source).toBe(link1);
			});

			describe("3 links", () => {
				let link3 = link2.convert_(x => x * 2, x => x / 2);
				beforeEach(() => {
					link3 = link2.convert_(x => x * 2, x => x / 2);
				});

				it("update propogates", () => {
					link3.value = 8;
					expect(link1.value).toBe(2);
					expect(link2.value).toBe(4);
					link2.value = 8;
					expect(link3.value).toBe(16);
					expect(link1.value).toBe(4);
				});

				it("closing link2 has the right effect", () => {
					link2.close();
					expect(link1.isClosed).toBe(false);
					expect(link3.isClosed).toBe(true);
					link1.value = 5;
					expect(link1.value).toBe(5);
				});
			})
		});
	});

	describe("member", () => {
		baseTests(x => Rexs.var_({a : x}).member_('a'));
		let link1 = Rexs.var_({a : 1});
		let link2 = link1.member_('a');
		beforeEach(() => {
			link1 = Rexs.var_({a : 1});
			link2 = link1.member_('a');
		});
		describe("consistency tests", () => {
			it("change propagates forward", () => {
				link2.changed.on(x => tally += x.value);
				link1.value = {a : 2};
				expect(tally).toBe("2");
			});

			it("change propagates back", () => {
				link1.value = {a: 1, b : 2} as any;
				link1.changed.on(x => tally += x.value.a);
				link2.value = 5;
				expect(tally).toBe("5");
				expect((link1.value as any).b).toBe(2);
			});
		});
	})
});