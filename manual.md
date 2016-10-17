# Rex
A rex is a smart variable that supports *data-binding*, change propagation, value propagation, and other things.

The abstract base type of all Rex objects is `Rex<TChange>`, where `TChange` is the type of its change notification. This base rex exposes very little functionality because it is very general. 

## Rex Capabilities
Each rex supports a set of features independent of its type:
s
1. Exposes a `changed` object event. This event is raised when the rex detects that a change may have occurred. It can also be fired manually (see `RexEvent` below). The event has a single argument, which is `TChange` and depends on the type of the rex.
2. Exposes a `meta` object. This object is meant to contain metadata concerning the `Rex`.
3. Exposes a `depends` object, which has info about the rex's dependencies.
4. Exposes an `info` object that contains information about the Rex.

Rexes, in principle, support both reading and writing operations. However, each rex object is structurally immutable. Only the value(s) it propagates is mutable.

## Rex Subtypes
There are several other abstract Rex types that inherit from Rex:

1. `RexScalar<TValue>`, a common type of rex that manages a single value of type `TValue`. Note that it can also manage entire arrays or complex objects, but it always treats them as scalar values and does not recognize that they are composed of multiple elements.
2. `RexVector<TValue>`, a rex that manages a collection of `TValue` in an ordered list, similar to a javascript array. This rex serves as an actual collection. The `RexVector` supports differential change notification, providing information about what elements changed and how.

Rexes are almost always manipulated as one of the above types, though in practice they belong to different types such as `RexVar`, `RexConvert`, and so forth.

### Parent and Child
A rex is either a *root* or a *child*. A projection has one or more *parent* rexes which determine its value (usually, a child applies a transformation on the parent's value). A child cannot exist without a parent.

Example:
> RexConvert takes one rex as a parent and a Conversion object, which consists of a forward converter and a backward converter.

> It is commonly used via the method `.convert_`, e.g.:
> 
> 	let converted =  Rexes.var_(1).convert_({to : x => x + 1, from : x => x - 1});

A *root* rex has no parent and provides its own value.

Example:
> RexVar is backed by a variable. To be created, it only requires an initial value for that variable.
>
> 	let var_ = Rexes.var_(1);

### Disposing of Rexes
When you create a child rex from a parent, each ends up with a reference of the other.

The same happens to any object you link to a rex by subscribing it to the `changed` event. It will stick around for as long as the rex sticks around, even if you lose all other references to it.

This is important because it can cause memory leaks. Here is an example of the problem:

	let var_ = Rexes.var_(5);
	for (let i = 0; i < 1000; i++) {
		let newRex = var_.convert_(x => x + 1);
		//no more references to newRex
	}

In the above example, `var_` ends up with a 1000 references to rex objects that are notified when it changes. Although we know that they are unnecessary, the runtime will not recognize this and will keep them around and fire their empty handlers.

In order to detach a rex from external objects and allow it to be garbage collected, you usually need dispose of it using `close`:

	let var_ = Rexes.var_(5);
	for (let i = 0; i < 1000; i++) {
		let newRex = var_.convert_(x => x + 1);
		newRex.close();
	}

Calling `close` on a rex has the following effects:

1. The rex's change notification event is cleared from all subscribers.
2. The rex closes all subscriptions to external events and may clear any other references of itself that it set up.
3. Further attempts to write or read the value of the rex (as opposed to its metadata) or subscribe to it throw an exception.

If a rex's ancestor is closed, that effectively means the rex is also closed, but it won't know about it. A rex with a closed ancestor will behave like this:

1. Its change event will still work as before.
2. Reading or writing its value will usually throw an exception.

If you have no other references to a rex or one of its descedants, closing it will usually cause the entire chain to become unreachable and eligible to be garbage collected.

### Transformation
A *rex transformation* is used to create a child rex out of an existing parent. One such transformation is `convert_`, which we have seen before. A transformation is a function with the signature:

	(source : TInRex) => TOutRex

Where `TInRex` is the type of the input and `TOutRex` is the type of the output. For convenience, rex transformations are defined as members on the prototypes to which they apply, and the input is the current instance.

For example, `convert_` applies to `RexScalar` objects and so is defined on the `RexScalar` prototype. Defining additional operations on a Rex is not considered mutation. You are free to define your own transformations.

The standard way of doing this is defining a type that extends the rex type you want to modify and then calling `Rexflect.mixin` like this:

	class ExtraRexOperations extends RexScalar<T> {
		transform1_(arg : any) {
			//...
		}
	}
	
	Rexflect.mixin(RexScalar, ExtraRexOperations);

And then declaring type definitions as appropriate. `Rexflect.mixin` also handles conflicts.

## RexEvent
The `rexjs` library has its own event object, called `RexEvent<TParam>`. This event is backed by an array of functions that are invoked with an argument of type `TParam` when the event is fired.

### Subscribing to an event
You use the `on` method to subscribe to an event:

	let wasChanged = false;
	let token = Rexes.var_(5).changed.on(change => wasChanged = true);
	
	expect(wasChanged).toBe(true);

After you subscribe to an event, you get a special `Subscription` token that manages your subscription to the event. You can do a few things with this token:

1. `close` it, e.g. `token.close()`. This cancels your subscription and removings your callback from the event's invocation list.
2. `freeze` it, e.g. `token.freeze()`, which freezes your subscription, causing any event firings to ignore your callback.
3. `unfreeze` it, e.g. `token.unfreeze()`, which returns your subscription to the unfrozen state.

In addition to subscribing by supplying a callback, you can also supply another `RexEvent`. If you do this, the event you supply will be fired when the current event is fired. You can use the `Subscription` token to manage the subscription here too.

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
	
	