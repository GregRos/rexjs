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

# The Basics
Here are the basis of working with `rexjs`:

## Rex
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

## Parent and Child
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

## Disposing of Rexes
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

### RexEvent
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