# rexjs - framework-agnostic data binding
`rexjs` is a javascript library for reactive programming, data-binding, and value propagation that can be used from any framework or library in any context on any platform.

If you're wondering what that means exactly, read on.

## The Problem
A modern web application (or any application, really) is composed (or should be composed) of a tree of interlinked components (or, in some cases, a graph of them). This is true whether you're writing it in React, Angular, or some other well-organized framework. It is definitely a Good Thing(tm).

Each component is generally responsible for working with or displaying some subset of the data of the whole tree, such as a text editor responsible for editting and displaying some text and a more complex `EmployeeEditor` that lets you edit the details of a whole `Employee` object.

	interface Employee {
		id : number;
		name : string;
	}

Value propagation, then, is the art of moving values from parent components to child components, and sometimes between sibling components (if those exist), and synchronizing them when one of the components instigates a change (e.g. due to user interaction).

With the increasing complexity of web applications, value propagation and change notification requires an increasingly large amount of boilerplate, which can be a potential source of bugs and other issues. You can probably imagine how much of this boilerplate is required when confronted with a diagram like this:

![Employee-Company schema](http://image.prntscr.com/image/ff1adb0b474444c7a829148d5870a801.png)

One chain if propagation looks like this:

![Company->string propagation](http://image.prntscr.com/image/f5c5da298e254bba97ef30b11cc78b26.png)

`rexjs` makes value propagation and change notification a simple and elegant affair. It works using smart variables called Rexes that you can transform using special functions.

### Data binding
Data binding is when you take that final value in the above example (a string) and synchronize it with another existing object, like a textbox, so that the textbox and the string are identical. 

This is similar to the parent-child relationship above, in that a change in one should cause a change in the other.

Not all frameworks use data binding. React, for example, works very well without it, because every change in an input element causes the whole view to be invalidated. Instead of needed code to synchronize a textbox and an `Employee`'s name, the value is eventually passed down again.

`rexjs` supports data binding, but it is very useful without it, as value propagation is an issue in React as well as in other frameworks.

## Rexes
`rexjs` uses smart variables called `Rex`es to help propagate a value. It lets you apply complex transformations on it while retaining the link to the original, so that when one component along the chain of dependencies causes a change, all the components are notified correctly.

The most basic `Rex` is the `var_` type, which is backed by a variable. Here are some examples of how it can be used:

	let var_ = Rex.var_(1);
	var_.value = 5;
	let x = var_.value;

The only thing that sets `Var` apart is that it has no parents.
	
Using `var_` as a base, you can apply Rex transformations on it by calling other methods ending with an underscore to get Rex objects that rely on it:

	//creates a RexConvert that transforms the number into a string and back again.
	let string_ = var_.convert_(x => x.toString(), x => Number.parseFloat(x));

Here we've created a chain of Rexes that looks like this:

	number_ <=> string_

Now if we update either of the two, the other will also be updated automatically:

	number_.value = 5;
	expect(string_.value).toBe("5");
	string_.value = "10";
	expect(number_.value).toBe(10);

We can construct more and more elaborate chains of Rexes, or even entire trees of them. We can add another Rex as a child of `number_`:

	let doubled_ = number_.convert(x => x * 2, x => x / 2);
	doubled_.value = 10;
	expect(number_.value).toBe(5);
	expect(string_.value).toBe("5");
	
	