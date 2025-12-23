const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal");

async function searchMeals(e) {
  e.preventDefault();
  single_mealEl.innerHTML = "";
  const term = search.value;
  search.value = "";
  if (!term.trim()) {
    alert("Please enter a search term");
    return;
  }
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  if (!response.ok) {
    return alert("There was a problem with your search. Please try again.");
  }
  const data = await response.json();
  resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;
  if (data.meals === null) {
    return (resultHeading.innerHTML +=
      "<p>There were no search results. Try again!</p>");
  }
  mealsEl.innerHTML = data.meals
    .map(
      (meal) => `<div class=meal>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
  <div class="meal-info" data-mealid="${meal.idMeal}">
  <h3>${meal.strMeal}</h3>
  </div>
  </div>`
    )
    .join("");
}

async function getMealByID(id) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  if (!response.ok) {
    return alert(
      "There was a problem with finding that particular meal. Please try again."
    );
  }
  const data = await response.json();
  const meal = data.meals[0];
  return meal;
}

function addMealtoDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strMeasure${i}`]} - ${meal[`strIngredient${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `<div class="single-meal">
  <h1>${meal.strMeal}</h1>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
  <div class="single-meal-info">
  ${meal.strCategory && `<p>${meal.strCategory}</p>`}
  ${meal.strArea && `<p>${meal.strArea}</p>`}
  </div>
  <div class="main">
  <p>${meal.strInstructions}</p>
  <h2>Ingredients</h2>
  <ul>
  ${ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
  </ul>
  </div>
  </div>`;
}

async function getRandomMeal() {
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  if (!response.ok) {
    return alert("There was a problem with your search. Please try again.");
  }
  const data = await response.json();
  const randomMeal = data.meals[0];

  addMealtoDOM(randomMeal);
}

async function displaySingleMeal(e) {
  const mealInfo = e
    .composedPath()
    .find((item) => item.classList.contains("meal-info"));

  const id = mealInfo.dataset.mealid;

  const meal = await getMealByID(id);

  addMealtoDOM(meal);
}

// Event Listeners
submit.addEventListener("submit", searchMeals);
mealsEl.addEventListener("click", displaySingleMeal);
random.addEventListener("click", getRandomMeal);
