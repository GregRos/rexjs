# rexjs - framework-agnostic data binding
`rexjs` is a javascript library for reactive programming, data-binding, and value propagation that can be used from any framework or library in any context on any platform.

The library is currently in a development version.

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

In a different language, Rex objects might be linked using weak references, but proper weak references don't exist in JavaScript.

There are also specific options that allow you to mitigate the risk of leaky rexes.


#### Transformation
A *rex transformation* is used to create another Rex (e.g. a projection) out of an existing one. One such transformation is `convert_`. A transformation is a function with the signature:

	(source : TInRex) => TOutRex

Where `TInRex` is the type of the input 

## Binding
Rexes support data binding. Data binding is when you synchronize the values of two independent rexes, so that change in one results in change in the other.

This is achieved using an appropriate `Binding` object that subscribes to the change notifications of both rexes.

Although bindings can in theory exist separately from anything else, in order to maintain order and minimize rex leakage they are somewhat restricted.

Each binding has an `origin` and a `target`. A binding can be the `target` of a single binding but the origin of any number of bindings. This is ensured by a `binding` attribute every rex object possesses, which specifies the binding that targets it.

In order to establish a binding between two scalar rexes, you need to do the following:

	let var1_ = Rexes.var_(1);
	let var2_ = Rexes.var_(2);
	let binding = var1_.binding = var2_.toBinding({
		//binding parameters
	});

---
**Important:** The `Binding` object created by the `toBinding` method kicks in when the `binding` attribute of another rex is set, and it establishes that rex as the target. The binding object cannot be re-targted. So for example the following throws an error:

	let var3_ = Rexes.var_(3);
	var3_.binding = binding;
---
	

The `binding` object created above contains information about the binding and can be closed by invoking its `close` method. Calling this method causes it to subscribe from both of the rexes it binds and also nullifies the `binding` attribute of the target.

Before a binding is first established between two rexes, they will usually have different values. Before anything else happens, they have to be synchronized.

In all cases, the value of the binding target will be synchronized with the value of the origin. This is part of the rationale for a rex to be the target of only one binding -- being the target of a binding essentially means your value is set by something else, and for the sake of consistency only one thing should do that.