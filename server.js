const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let dataset = require("./dataset.json");

app.get("/api/meals", (req, res) => {
  res.json(dataset.meals);
});

app.get("/api/labels", (req, res) => {
  res.json(dataset.labels);
});

app.post("/api/updateMealSelection", (req, res) => {
  const { mealId, selected } = req.body;
  const meal = dataset.meals.find((m) => m.id === mealId);
  if (meal) {
    meal.selected = selected;
    fs.writeFileSync("./dataset.json", JSON.stringify(dataset, null, 2));
    res.json({ mealId, selected });
  } else {
    res.status(404).json({ message: "Meal not found" });
  }
});

app.post("/api/updateDrinkSelection", (req, res) => {
  const { mealId, drinkId } = req.body;
  const meal = dataset.meals.find((m) => m.id === mealId);
  if (meal) {
    if (!meal.selectedDrinks) {
      meal.selectedDrinks = [];
    }
    if (meal.selectedDrinks.includes(drinkId)) {
      meal.selectedDrinks = meal.selectedDrinks.filter((id) => id !== drinkId);
    } else {
      meal.selectedDrinks.push(drinkId);
    }
    fs.writeFileSync("./dataset.json", JSON.stringify(dataset, null, 2));
    res.json({ mealId, drinkId });
  } else {
    res.status(404).json({ message: "Meal not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
