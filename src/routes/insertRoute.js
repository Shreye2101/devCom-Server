const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

router.get("/insert", async (req, res) => {
  try {
    const password = await bcrypt.hash("123456", 10);
    const documents = Array.from({ length: 50 }, () => {
      const skills = faker.helpers.shuffle([
        "Java", "C++", "React.js", "Node.js", "Python",
        "Ruby", "Go", "Swift", "PHP", "Kotlin"
      ]).slice(0, 3);

      return {
        firstName: faker.person.firstName().replace(/[^a-zA-Z]/g, ""),
        lastName: faker.person.lastName().replace(/[^a-zA-Z]/g, ""),

        age: faker.number.int({ min: 18, max: 60 }),
        gender: faker.helpers.arrayElement(["male", "female", "others"]),
        keySkills: skills,
        emailId: faker.internet.email(),
        password,
        photoUrl: faker.image.avatar(),
        summary: faker.lorem.sentence(),
        location: faker.location.city(),
      };
    });

    const result = await User.insertMany(documents);
    console.log(`${result.length} users inserted`);
    res.status(200).json({ isSuccess: true, message: "50 users inserted!" });
  } catch (err) {
    console.error("Insert failed:", err.message);
    res.status(500).json({ isSuccess: false, message: "Insertion failed" });
  }
});

module.exports = router;
