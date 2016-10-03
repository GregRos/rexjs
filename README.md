# rexjs - framework-agnostic data binding
`rexjs` is a highly extensible and framework-agnostic javascript library for data binding and value propogation. 

If you're wondering what that means exactly, read on.

## The Problem
A modern web application (or any application, really) is composed (or should be composed) of a tree of interlinked components (or, in some cases, a whole graph of them). This is true whether you're writing it in React, Angular, or some other future framework I know nothing about.

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

### Oh, and data binding
While in simple value propagation one value is transformed into a different form, data binding involves the synchornization of two different, independent values.

For example, we can use data binding if we want to link the texts of two textboxes together.

Still, one of the goals of `rexjs` is to implement data binding in a simple, elegant, and efficient manner.



