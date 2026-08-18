// We efne a node class for Doubly Linked List
class Node {
  constructor(name, phone) {
    this.name = name;
    this.phone = phone;
    this.prev = null;
    this.next = null;
  }
}

// Then we define the Doubly Linked List
class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  // Add node at the end of the list
  append(newNode) {
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
  }

  // Display forward from head to tail
  displayForward() {
    if (this.head === null) {
      console.log("No contacts available.");
      return;
    }
    let current = this.head;
    while (current !== null) {
      console.log(current.name + " - " + current.phone);
      current = current.next;
    }
  }

  // Display backward from tail to head
  displayBackward() {
    if (this.tail === null) {
      console.log("No contacts available.");
      return;
    }
    let current = this.tail;
    while (current !== null) {
      console.log(current.name + " - " + current.phone);
      current = current.prev;
    }
  }
}

//  Simple Naive Substring Match algorithm
function naiveSearch(text, pattern) {
  let n = text.length;
  let m = pattern.length;

  let textLower = text.toLowerCase();
  let patternLower = pattern.toLowerCase();

  for (let i = 0; i <= n - m; i++) {
    let match = true;
    for (let j = 0; j < m; j++) {
      if (textLower[i + j] !== patternLower[j]) {
        match = false;
        break;
      }
    }
    if (match === true) {
      return true;
    }
  }
  return false;
}

// Contact Manager System
class ContactManager {
  constructor() {
    this.list = new DoublyLinkedList();
    this.hashTable = {};
  }

  addContact(name, phone) {
    let newNode = new Node(name, phone);

    // Store in linked list
    this.list.append(newNode);

    // Store reference in hash table using lowercase name key
    this.hashTable[name.toLowerCase()] = newNode;

    console.log("Contact added.");
  }

  searchExactName(name) {
    let key = name.toLowerCase();
    if (this.hashTable[key]) {
      let contact = this.hashTable[key];
      console.log("Match found: " + contact.name + " - " + contact.phone);
    } else {
      console.log("No contact found with that exact name.");
    }
  }

  searchKeyword(keyword) {
    let current = this.list.head;
    let found = false;

    while (current !== null) {
      if (naiveSearch(current.name, keyword)) {
        console.log("Match found: " + current.name + " - " + current.phone);
        found = true;
      }
      current = current.next;
    }

    if (found === false) {
      console.log("No contacts matching the keyword.");
    }
  }
}

// Simple Menu Loop (Runs in Browser Console)
function runMenu() {
  let manager = new ContactManager();
  let running = true;

  while (running) {
    let choice = prompt(
      "1. Add Contact\n" +
      "2. Search by Keyword\n" +
      "3. Search by Exact Name\n" +
      "4. View All (Forward)\n" +
      "5. View All (Backward)\n" +
      "6. Exit\n\n" +
      "Enter option:"
    );

    if (choice === "1") {
      let name = prompt("Name:");
      let phone = prompt("Phone:");
      manager.addContact(name, phone);
    } else if (choice === "2") {
      let keyword = prompt("Search keyword:");
      manager.searchKeyword(keyword);
    } else if (choice === "3") {
      let name = prompt("Search exact name:");
      manager.searchExactName(name);
    } else if (choice === "4") {
      console.log("--- Contacts (Forward) ---");
      manager.list.displayForward();
    } else if (choice === "5") {
      console.log("--- Contacts (Backward) ---");
      manager.list.displayBackward();
    } else if (choice === "6") {
      console.log("Exiting application.");
      running = false;
    } else {
      console.log("Invalid option. Try again.");
    }
  }
}

// To run in browser developer console, simply call:
//runMenu();