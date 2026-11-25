// Load environment variables from .env
require("dotenv").config();
const mongoose = require("mongoose");
const Person = require("./models/Person");

// Connect to MongoDB using MONGO_URI from .env
async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB via Mongoose.");
}

// 1. Create and Save a Single Person Document
async function createAndSavePerson(personData) {
  // Instantiate a new Person document conforming to personSchema
  const person = new Person(personData);
  // Persist the document to the database
  const savedPerson = await person.save();
  return savedPerson;
}

// 2. Create Many People Records with Model.create()
async function createManyPeople(arrayOfPeople) {
  // Inserts all objects in arrayOfPeople in a single batch
  const createdPeople = await Person.create(arrayOfPeople);
  return createdPeople;
}

// 3. Find All People Having a Given Name with Model.find()
async function findPeopleByName(personName) {
  return await Person.find({ name: personName });
}

// 4. Find One Person Who Likes a Specific Food with Model.findOne()
async function findOneByFood(food) {
  // Matches documents where `food` appears inside the `favoriteFoods` array
  return await Person.findOne({ favoriteFoods: food });
}

// 5. Find One Person by _id with Model.findById()
async function findPersonById(personId) {
  return await Person.findById(personId);
}

// 6. Classic Update: Find by _id, Edit (push "hamburger"), then Save
async function addHamburgerToFavorites(personId) {
  const person = await Person.findById(personId);
  if (!person) return null;

  person.favoriteFoods.push("hamburger");

  // If a schema field is declared as a plain Array (Mixed type), call:
  // person.markModified("favoriteFoods");
  // Here `favoriteFoods` is [String], so Mongoose tracks array mutations automatically.

  return await person.save();
}

// 7. Find One by Name and Update Age to 20 with findOneAndUpdate()
async function updateAgeByName(personName) {
  // `{ new: true }` ensures Mongoose returns the modified document rather than the old one
  return await Person.findOneAndUpdate(
    { name: personName },
    { $set: { age: 20 } },
    { new: true, runValidators: true }
  );
}

// 8. Delete One Person by _id (findByIdAndDelete in modern Mongoose; legacy: findByIdAndRemove)
async function deletePersonById(personId) {
  return await Person.findByIdAndDelete(personId);
}

// 9. Delete All People Named "Mary" (deleteMany in modern Mongoose; legacy: Model.remove)
async function deleteManyByName(targetName = "Mary") {
  // Returns operation summary including { acknowledged, deletedCount }
  return await Person.deleteMany({ name: targetName });
}

// 10. Chain Search Query Helpers: find burritos, sort by name, limit to 2, hide age
async function queryBurritoLovers() {
  return await Person.find({ favoriteFoods: "burritos" })
    .sort({ name: 1 }) // Ascending alphabetical sort by name
    .limit(2) // Return at most 2 documents
    .select("-age") // Exclude the `age` field from results
    .exec(); // Execute the query chain and return a Promise
}

// Demo execution runner to verify all functions end-to-end
async function runDemo() {
  try {
    await connectDB();

    // Clear previous demo data so repeated runs stay clean
    await Person.deleteMany({});

    // Create & save one person
    const single = await createAndSavePerson({
      name: "Golden-Joe",
      age: 26,
      favoriteFoods: ["jollof rice", "plantain"],
    });
    console.log("Created single person:", single);

    // Create multiple people
    const batch = await createManyPeople([
      { name: "Mary", age: 28, favoriteFoods: ["burritos", "salad"] },
      { name: "Mary", age: 34, favoriteFoods: ["burritos", "pasta"] },
      { name: "Denzel", age: 22, favoriteFoods: ["burritos", "steak"] },
      { name: "Victory", age: 25, favoriteFoods: ["burritos", "fish"] },
    ]);
    console.log("Created batch count:", batch.length);

    // Search queries
    console.log("Find by name 'Mary':", await findPeopleByName("Mary"));
    console.log("Find one who likes 'burritos':", await findOneByFood("burritos"));
    console.log("Find by ID:", await findPersonById(single._id));

    // Classic find -> edit -> save
    console.log("After adding hamburger:", await addHamburgerToFavorites(single._id));

    // findOneAndUpdate -> set age to 20
    console.log("Updated Denzel age to 20:", await updateAgeByName("Denzel"));

    // Chained query helpers
    console.log("Burrito lovers (sorted, limit 2, no age):", await queryBurritoLovers());

    // Delete one by ID
    console.log("Deleted single person:", await deletePersonById(single._id));

    // Delete all named "Mary"
    console.log("Deleted all 'Mary' records:", await deleteManyByName("Mary"));
  } catch (error) {
    console.error("Operation error:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

runDemo();

module.exports = {
  connectDB,
  createAndSavePerson,
  createManyPeople,
  findPeopleByName,
  findOneByFood,
  findPersonById,
  addHamburgerToFavorites,
  updateAgeByName,
  deletePersonById,
  deleteManyByName,
  queryBurritoLovers,
};
