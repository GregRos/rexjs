# Messengers
A `Messenger` object allows simple communication between parent and child components.

In general, instead of writing code like this:

	interface MyParentProps {
		parentData : ParentData;
	}
	class MyParent extends Component<{}, {}> {
	
	}
	let child = 
		<MyComponent 
			value={this.props.myChildProp} 
			onUpdate={x => this.handleChildUpdate}/>;
			
	