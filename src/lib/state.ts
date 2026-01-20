/**
 * Interface defining the contract for state management operations.
 * @template T - The type of elements stored in the list.
 */
interface IEvent<T> {
	list: T[];
	set(event: T): void;
	getAll(): T[];
	get(index?: number): T;
	delete(index: number): boolean;
	clear(): void; // Added for advanced utility
	size(): number; // Added for advanced utility
}

/**
 * State Class
 * A generic class to manage a list of items with CRUD operations.
 * Implements the IEvent interface.
 *
 * @template T - The type of elements stored in the list.
 */
export class State<T> implements IEvent<T> {
	public list: T[];

	constructor() {
		this.list = [];
	}

	/**
	 * Adds an event/item to the end of the list.
	 *
	 * Time Complexity: O(1) - Amortized constant time for adding to the end of an array.
	 * Space Complexity: O(1) - No extra space proportional to input size is allocated.
	 * Cost: Very low.
	 */
	public set(event: T): void {
		this.list.push(event);
	}

	/**
	 * Retrieves a shallow copy of the entire list.
	 *
	 * Time Complexity: O(n) - Must iterate through all elements to create a copy.
	 * Space Complexity: O(n) - Allocates memory for the new array.
	 * Cost: Moderate to High depending on the size of the list.
	 */
	public getAll(): T[] {
		return [...this.list];
	}

	/**
	 * Retrieves an item at a specific index. Defaults to the first item if no index is provided.
	 *
	 * Time Complexity: O(1) - Direct access by index in an array.
	 * Space Complexity: O(1) - No extra space allocated.
	 * Cost: Very low.
	 */
	public get(index: number = 0): T {
		return this.list[index];
	}

	/**
	 * Deletes an item at a specific index.
	 *
	 * Time Complexity: O(n) - Array elements after the index need to be shifted to fill the gap.
	 * Space Complexity: O(1) - In-place operation.
	 * Cost: Moderate. Higher cost if deleting from the beginning of the list.
	 */
	public delete(index: number): boolean {
		if (index < 0 || index >= this.list.length) {
			return false;
		}
		this.list.splice(index, 1);
		return true;
	}

	/**
	 * Removes all items from the list.
	 *
	 * Time Complexity: O(1) - Reassigning reference or setting length is constant time.
	 * Space Complexity: O(1) - No new allocation, though garbage collection occurs later.
	 * Cost: Very low.
	 */
	public clear(): void {
		this.list = [];
	}

	/**
	 * Returns the current number of items in the list.
	 *
	 * Time Complexity: O(1) - Accessing the length property of an array.
	 * Space Complexity: O(1) - No extra space.
	 * Cost: Very low.
	 */
	public size(): number {
		return this.list.length;
	}
}

/**
 * StateBuilder Class
 * Implements the Builder Pattern to construct and configure a State object fluently.
 *
 * @template T - The type of elements the State will manage.
 */
export class StateBuilder<T> {
	private state: State<T>;

	constructor() {
		this.state = new State<T>();
	}

	/**
	 * Adds an item to the state being built.
	 *
	 * Time Complexity: O(1) - Delegates to State.set().
	 * Space Complexity: O(1).
	 * Cost: Very low.
	 */
	public add(event: T): StateBuilder<T> {
		this.state.set(event);
		return this;
	}

	/**
	 * Adds multiple items to the state being built.
	 *
	 * Time Complexity: O(n) - Iterates through the input array.
	 * Space Complexity: O(1) - Adds to existing list.
	 * Cost: Moderate (linear to input size).
	 */
	public addAll(events: T[]): StateBuilder<T> {
		for (const event of events) {
			this.state.set(event);
		}
		return this;
	}

	/**
	 * Resets the state being built to empty.
	 *
	 * Time Complexity: O(1).
	 * Space Complexity: O(1).
	 * Cost: Very low.
	 */
	public reset(): StateBuilder<T> {
		this.state.clear();
		return this;
	}

	/**
	 * Returns the constructed State object.
	 *
	 * Time Complexity: O(1).
	 * Space Complexity: O(1).
	 * Cost: Very low.
	 */
	public build(): State<T> {
		return this.state;
	}
}
