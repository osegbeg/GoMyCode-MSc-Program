// 1. Queue Class Implementation
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift();
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.items[0];
  }

  isEmpty() {
    this.items.length === 0;
  }
}

// 2. PrinterQueue Class Implementation
class PrinterQueue {
  constructor() {
    this.queue = new Queue();
  }

  // Add a job with a name and page count
  addJob(name, pages) {
    const job = { name, pages };
    this.queue.enqueue(job);
    console.log(`[Added] Job: "${name}" (${pages} pages)`);
  }

  // Process the next job in line (FIFO)
  processJob() {
    const job = this.queue.dequeue();
    if (!job) {
      console.log("No print jobs in the queue.");
      return;
    }
    console.log(`[Printing] Processing "${job.name}" (${job.pages} pages)... Done.`);
  }

  // Print/Display all pending jobs in the queue
  printQueue() {
    if (this.queue.items.length === 0) {
      console.log("Printer queue is empty.");
      return;
    }
    console.log("--- Current Printer Queue ---");
    this.queue.items.forEach((job, index) => {
      console.log(`${index + 1}. Job: "${job.name}" | Pages: ${job.pages}`);
    });
    console.log("-----------------------------");
  }
}




// -------------TESTING THE CODE--------------------------//
// Initialize the printer system
const officePrinter = new PrinterQueue();

// Add multiple print jobs
officePrinter.addJob("Annual_Report.pdf", 15);
officePrinter.addJob("Meeting_Agenda.docx", 2);
officePrinter.addJob("Flight_Itinerary.pdf", 1);

// View the current queue
officePrinter.printQueue();

// Process the first job in line
officePrinter.processJob();

// View the updated queue
officePrinter.printQueue();

// Process remaining jobs
officePrinter.processJob();
officePrinter.processJob();

// Try processing when empty
officePrinter.processJob();