/**
 * Created by Greg on 02/10/2016.
 */
import {Rexes} from '../src';
import {ClosedError} from "../src/errors/index";
import {RexScalar} from "../src/rexes/scalar/index";
import {Rex} from "../src/rexes/base";
import {RexEvent} from "../src";
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

		describe("does not notify change when set to current value", () => {

			it("for numbers", () => {
				let num_ = ctor(0);
				num_.value = 0;
				num_.changed.on(() => tally += "a");
				num_.value = 0;
				expect(tally).toBe("");
			});
			it("for strings", () => {
				let str_= ctor("a");
				str_.changed.on(() => tally += "a");
			});
		});

		describe("operations on closed", () => {
			beforeEach(() => Var.close());
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
		baseTests(Rexes.var_);
	});

	describe("convert", () => {
		baseTests(x => Rexes.var_(x).convert_(x => x, x => x));
		let link1 = Rexes.var_(1);
		let link2 = link1.convert_(x => x * 2, x => x / 2);

		beforeEach(() => {
			link1 = Rexes.var_(1);
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

			it("link2 invalid when link1 is closed", () => {
				link1.close();
				expect(() => link2.value).toThrow();
			});

			it("when link2 is closed, link1 works", () => {
				link2.close();

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
					let a = link1.value;
					expect(() => link3.value).toThrow();

					link1.value = 5;
					expect(link1.value).toBe(5);
				});
			})
		});
	});

	describe("member", () => {
		let memberTest = (memberMaker : (bs : RexScalar<{a : number}>) => RexScalar<any>) => {
			baseTests(x => memberMaker(Rexes.var_({a : x})));
			let link1 = Rexes.var_({a : 1});
			let link2 = memberMaker(link1);
			beforeEach(() => {
				link1 = Rexes.var_({a : 1});
				link2 = memberMaker(link1);
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
		}
		memberTest(sc => sc.member_('a'));
		memberTest(sc => sc.member_(x => x.a))
	});

	describe("notify", () => {
		let notifier = new RexEvent<void>();
		baseTests(x => Rexes.var_(x).notify_(x => notifier));
		//this is the intended usage of the notify_ Rex:

		let notifierObject =(val : number) => {
			let _val = val;
			return {
				notifier: new RexEvent<number>(),
					get val() {
					return _val;
				},
				set val(newVal : number) {
					_val = newVal;
					this.notifier.fire(_val);
				}
			}
		};

		//note that notify_ doesn't make sense by itself, but it does when followed by member_.
		let link1 =  Rexes.var_(notifierObject(0));
		let link2 = link1.notify_(obj => obj.value.notifier);
		let link3 = link2.member_<number>('val');

		beforeEach(() => {
			link1 =  Rexes.var_(notifierObject(0));
			link2 = link1.notify_(obj => obj.value.notifier);
			link3 = link2.member_<number>('val');
		});

		describe("value propogation", () => {
			it("propagate back", () => {
				link3.value = 3;
				expect(link1.value.val).toBe(3);
			});

			it("propagate forward", () => {
				link1.value.val = 5;
				expect(link3.value).toBe(5);
			});

			it("set link1", () => {
				let origObject = link1.value;
				link1.value = notifierObject(2);
				expect(origObject.val).toBe(0);
				expect(link3.value).toBe(2);
				link3.value = 6;
				expect(link3.value).toBe(6);
				expect(link1.value.val).toBe(6);
				expect(origObject.val).toBe(0);
			});
		});
	});

	describe("silence", () => {
		//silence is tricky to test because it breaks the normal change propagation flow

		let link1 = Rexes.var_(0);
		let link2 = link1.silence_(change => change.value > 5);

		beforeEach(() => {
			link1 = Rexes.var_(0);
			link2 = link1.silence_(change => change.value > 5);
		});

		describe("change propagation", () => {
			it("raises/doesn't raise change correctly", () => {
				link2.changed.on(x => tally += x.value);
				link1.value = 1;
				expect(tally).toBe("1");
				link1.value = 6;
				expect(tally).toBe("1");
			});
		})
	})
});