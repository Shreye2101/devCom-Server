// src/routes/insertRoute.js

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

router.get("/insert", async (req, res) => {
  try {
    const password = await bcrypt.hash("123456", 10);
    const documents = Array.from({ length: 50 }, () => {
      const allSkills = [
        "Java",
        "C++",
        "React.js",
        "Node.js",
        "Python",
        "Ruby",
        "Go",
        "Swift",
        "PHP",
        "Kotlin",
      ];
      const shuffledSkills = faker.helpers.shuffle(allSkills);
      const uniqueSkills = shuffledSkills.slice(0, 3);

      return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        age: faker.number.int({ min: 18, max: 60 }),
        gender: faker.helpers.arrayElement(["male", "female", "others"]),
        keySkills: uniqueSkills,
        emailId: faker.internet.email(),
        password: password,
        photoUrl: faker.image.avatar(),
        summary: faker.lorem.sentence(),
        location: faker.location.city(),
      };
    });

    const result = await User.insertMany(documents);
    console.log(`${result.length} documents were inserted`);

    res.status(200).json({ isSuccess: true, message: "50 users inserted!" });
  } catch (err) {
    console.error("Error inserting users:", err.message);
    res.status(500).json({ isSuccess: false, message: "Insertion failed" });
  }
});

module.exports = router;
