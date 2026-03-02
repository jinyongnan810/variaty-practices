const searchInput = document.getElementById("search");
const searchForm = document.getElementById("submit");
const searchRandom = document.getElementById("random-btn");
const mealsHeading = document.getElementById("result-heading");
const mealsEl = document.getElementById("meals");
const mealsSingleEl = document.getElementById("single-meal");
const mealsSingleContainer = document.getElementById("single-meal-container");

// functions
const searchMeals = () => {
  // clear single meal
  mealsSingleEl.innerHTML = "";
  // search term
  const term = searchInput.value;
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term.trim()}`)
      .then((res) => res.json())
      .then((data) => {
        mealsHeading.innerHTML = `
            <h2>Search result for '${term.trim()}':</h2>
          `;
        if (data.meals) {
          addMealsToDOM(data.meals);
        } else {
          mealsHeading.innerHTML = `
            <h2>There a no result for '${term.trim()}:'</h2>
          `;
        }
      });
  }
};
const searchMealsRandom = () => {
  // clear single meal
  mealsSingleEl.innerHTML = "";
  mealsEl.innerHTML = "";
  mealsHeading.innerHTML = `<h2>Random meals:</h2>`;
  for (let i = 0; i < 4; i++) {
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.meals) {
          const meal = data.meals[0];
          mealsEl.innerHTML += `
          <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="meal-info" data-mealId="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
            </div>
          </div>`;
        }
      });
  }
};
const addMealsToDOM = (meals) => {
  mealsEl.innerHTML = meals
    .map(
      (meal) => `<div class="meal">
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
  <div class="meal-info" data-mealId="${meal.idMeal}">
      <h3>${meal.strMeal}</h3>
  </div>
  
</div>`,
    )
    .join("");
};
const fetchById = (id) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
      mealsSingleContainer.style.display = "flex";
    });
};
const addMealToDOM = (meal) => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push({
        name: meal[`strIngredient${i}`],
        num: meal[`strMeasure${i}`],
      });
    } else {
      break;
    }
  }
  mealsSingleEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>Category: ${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>Area: ${meal.strArea}</p>` : ""}
      </div>
      <div class="single-meal-main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((ing) => `<li>${ing.name} - ${ing.num}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
};

// event listeners
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchMeals();
});
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((el) => {
    if (el.classList) {
      return el.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const id = mealInfo.getAttribute("data-mealId");
    fetchById(id);
  }
});
searchRandom.addEventListener("click", () => searchMealsRandom());
mealsSingleContainer.addEventListener("click", (e) => {
  e.stopPropagation();
  if (e.target == mealsSingleContainer) {
    mealsSingleContainer.style.display = "none";
  }
});
