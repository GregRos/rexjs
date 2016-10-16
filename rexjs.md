# rexjs - framework-agnostic data binding
`rexjs` is a javascript library for reactive programming, data-binding, and value propagation that can be used from any framework or library in any context on any platform.

## What's that mean?
Have a look at this code:

	let obj_ = Rexes.var_({a : 1});
	let num_ = obj_.member_(x => x.a).convert_({to: x => x + 1, from: x => x - 1});
	 
	expect(num_.value).toBe(2); //because that's obj_.value.a + 1
	
	num_.value = 5;
	expect(obj_.value).toBe({a : 4}); //updating num_ went back and updated the source, obj_!
	
	obj_.value = {a : 10}; //we can even update the whole object
	expect(num_.value).toBe(11);

That's what `rexjs` is all about!

In the above example, `obj_` is a `Rex`, a kind of smart variable. It has a dynamic `value` property (e.g. one with getter and setter). You can then apply transformations to it to get other smart variables that remember their connection to the original `Rex` and update it accordingly when they change.

`rexjs` can do even more than the example above suggests. It also manages *change notification*, as you can see in the following example:

	let num_changed = false;
	num_.changed.on(change => tally = num_changed = true);
	obj_.value = {a : 20}; //num_.changed fires
	expect(tally).toBe(true);

	let obj_changed = false;
	obj_.changed.on(change => obj_changed = true);
	num_.value = 5; //both num_.changed and obj_.changed fire
	expect(obj_changed).toBe(true);

Here, `changed` is a special event object that you can subscribe to using `on`. When you apply a Rex transformation on `obj_`, you get another Rex that is linked to its parent, so that when the parent's `changed` event is fired so is the child's (unless it can detect that there was no user-visible change from its perspective).

If you're just dealing with single Rexes, change notification isn't that important. However, it becomes crucial when you want to do data binding.

## The Basics
Here are the basis of working with `rexjs`:

### Rex
A rex is a smart variable that supports *data-binding*, change propagation, value propagation, and other things.

The base type of all Rex objects is `Rex<TChange>`, where `TChange` is the type of its change notification. This base rex exposes very little functionality because it is very general. There are several types of Rex objects that inherit from it.

1. `RexScalar<TValue>`, a common type of rex that manages a single value of type `TValue`. Note that it can also manage entire arrays or complex objects, but it always treats them as scalar values and does not recognize that they are composed of multiple elements.
2. `RexVector<TValue>`, a rex that manages a collection of values in an ordered list, similar to a javascript array. This rex serves as an actual collection. The `RexVector` supports differential change notification, providing information about what elements changed and how.

Rexes are almost always manipulated as one of the above types, though in practice they belong to different types such as `RexVar`, `RexConvert`, and so forth.

### Bases and Projections
A rex is either a *base* or a *projection*. A projection has a *source* rex which determines its value (usually, the projection applies a transformation on the source). A projection cannot exist without a source.

Example:
> RexConvert takes one rex as a source and a Conversion object, which consists of a forward converter and a backward converter.

> It is commonly used via the method `.convert_`, e.g.:
> 
> 	let converted =  Rexes.var_(1).convert_({to : x => x + 1, from : x => x - 1});

A *base* rex has no source and provides its own value.

Example:
> RexVar is backed by a variable. To be created, it only requires an initial value for that variable.
>
> 	let var_ = Rexes.var_(1);

#### Connection
When you create a projection rex from a source, each ends up with a reference of the other. 

The same happens to any object you link to a rex by subscribing it to the `changed` event. It will stick around for as long as the rex sticks around, even if you lose all other references to it.

This is important because it can cause memory leaks. Here is an example of the problem:

	let var_ = Rexes.var_(5);
	for (let i = 0; i < 1000; i++) {
		let newRex = var_.convert_(x => x + 1);
		//no more references to newRex
	}

In the above example, `var_` ends up with a 1000 references to rex objects that are notified when it changes. Although we know that they are unnecessary, the runtime will not recognize this and will keep them around and fire their empty handlers.

In order to detach a rex from any external object and allow it to be garbage collected, you usually need dispose of it using `close`:

	let var_ = Rexes.var_(5);
	for (let i = 0; i < 1000; i++) {
		let newRex = var_.convert_(x => x + 1);
		newRex.close();
	}


#### Transformation
A *rex transformation* is used to create another Rex (e.g. a projection) out of an existing one. One such transformation is `convert_`. A transformation is a function with the signature:

	(source : TInRex) => TOutRex

Where `TInRex` is the type of the input 

#### Connection
When you create a projection

A rex is either a *value source* or else a *value projection*. A rex that is a value source doesn't depend on any other rex for its value. A projection depends 

## Rexpressions
Rexpressions are entire sets of rexes, when seen together as a tree or graph. 



## The art and science of change propagation
`rexjs` is all about *change propagation*. It's also about *data-binding*, but that's a somewhat different story that we'll get into later.

`rexjs` is about synchronizing change between different parts of your application. It's a light and transparent layer that keeps your program together.

In `rexjs`, we model change propagation as sequences of transformations (called *rex transformations* on *Rexes*). These transformations 


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
	
	