const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal");

// Search meal and fetch from API
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
  <div class="meal-info" data-mealID="${meal.idMeal}">
  <h3>${meal.strMeal}</h3>
  </div>
  </div>`
    )
    .join("");
}

// Event Listeners
submit.addEventListener("submit", searchMeals);
