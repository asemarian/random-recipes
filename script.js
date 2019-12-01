const backgroundImage = document.getElementById("background-image");
const welcomePage = document.getElementById("welcome-page");
const getRandomRecipeButton = document.querySelector("#welcome-page>button");

const loadingOverlay = document.getElementById("loading-overlay");

const errorOverlay = document.getElementById("error-overlay");
const refreshPageButton = document.querySelector("#error-overlay>button");

const refreshRecipeButton = document.getElementById("refresh-recipe");

const recipePage = document.getElementById("recipe-page");
const recipeTitle = document.getElementById("recipe-title");
const recipeCategory = document.getElementById("recipe-category");
const recipeOrigin = document.getElementById("recipe-origin");
const recipeImage = document.getElementById("recipe-image");
const recipeDirections = document.getElementById("recipe-directions");
const recipeIngredients = document.querySelector("#ingredients>ul");

const directionsSection = document.getElementById("directions");
const ingredientsSection = document.getElementById("ingredients");



(function main() {
    refreshRecipeButton.addEventListener("click", getRandomRecipe);
    getRandomRecipeButton.addEventListener("click", showRecipePage);

    hideElement(recipePage);
    hideElement(loadingOverlay);
    hideElement(errorOverlay);

    (function setBackgroundImageRandomly() {
        backgroundImage.src = `welcome-background-${Math.ceil(Math.random() * 3)}.jpg`;
    })();
})();

function hideElement(element) {
    element.style.display = "none";
}

function showElement(element) {
    element.style.display = "flex";
}

function hideWelcomePage() {
    hideElement(backgroundImage);
    hideElement(welcomePage);
    showElement(recipePage);
}

function showRecipePage() {
    hideWelcomePage();
    getRandomRecipe();
}

function getRandomRecipe() {

    showElement(loadingOverlay);
    loadingOverlay.style.opacity = "1";

    const xhr = new XMLHttpRequest();
    xhr.timeout = 30000;
    xhr.open("GET", "https://www.themealdb.com/api/json/v1/1/random.php");
    xhr.onload = () => {

        let randomRecipe = JSON.parse(xhr.responseText).meals["0"];
        updateRecipeData(randomRecipe);
        recipeImage.onload = () => {
            directionsSection.scroll(0, 0);
            ingredientsSection.scroll(0, 0);
            window.scroll(0, 0);
            loadingOverlay.style.opacity = "0";
            loadingOverlay.addEventListener("transitionend", () => {
                hideElement(loadingOverlay);
            });
            refreshRecipeButton.style.animation = "slide-in 1.5s cubic-bezier(0,1.36,.39,1.56)";
            refreshRecipeButton.addEventListener("animationend", () => {
                window.onscroll = () => refreshRecipeButton.style.opacity = "0.5";
                directionsSection.onscroll = () => refreshRecipeButton.style.opacity = "0.5";
            });
        }
    }
    xhr.onerror = xhr.ontimeout = () => {
        showElement(errorOverlay);
        refreshPageButton.onclick = () => {
            location.reload();
        }
    }
    xhr.send();
}

function updateRecipeData(recipe) {
    clearCurrentRecipe();
    updateDetails(recipe);
    updateIngredients(recipe);
    updateDirections(recipe);
}

function clearCurrentRecipe() {
    recipeDirections.innerHTML = recipeIngredients.innerHTML = "";
}

function updateDetails(recipe) {
    recipeTitle.innerHTML = recipe["strMeal"];
    recipeCategory.innerHTML = `Category: ${recipe["strCategory"]}`;
    recipeOrigin.innerHTML = `Origin: ${recipe["strArea"]}`;
    recipeImage.src = recipe["strMealThumb"];
}

function updateIngredients(recipe) {
    for (let i = 1; recipe[`strIngredient${i}`]; i++) {
        recipeIngredients.innerHTML += `<li>${recipe[`strIngredient${i}`].toLowerCase()} (${recipe[`strMeasure${i}`].trim().toLowerCase()})</li>`;
    }
}

function updateDirections(recipe) {
    let recipeInstructions = recipe["strInstructions"].split(/\.\s/g);
    for (let i = 0; i < recipeInstructions.length; i++) {
        recipeDirections.innerHTML += `<li>${recipeInstructions[i]}</li>`;
    }
}