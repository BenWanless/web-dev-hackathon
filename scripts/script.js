let score = 0;
let numQuestions = 10
let curQuestion = 1
let answered = false;
const optionElements = document.querySelectorAll(".option");
let question
let correct
let categorySelect = document.querySelector('#category')
let difficultySelect = document.querySelector('#difficulty')
let selectedCategory = ''


updateScore();

axios.get('https://opentdb.com/api_category.php').then(response => {
    response.data.trivia_categories.forEach(category => {
        let option = document.createElement('option')
        option.setAttribute('value', category.id)
        option.innerHTML = category.name
        categorySelect.appendChild(option)
    })
})

document.querySelector('.submit').addEventListener('click', () => {
    document.querySelector('.content').style.display = 'flex'
    document.querySelector('.welcome').style.display = 'none'
    selectedCategory = categorySelect.options[categorySelect.selectedIndex].value
    remove()
    displayQuestion();
})

function displayQuestion() {
  axios
    .get(`https://opentdb.com/api.php?category=${selectedCategory}&difficulty=${difficultySelect.value}&amount=1&type=multiple`)
    .then((response) => {
      question = response.data.results[0];
      console.log(question);
      correct = question.correct_answer;

      const insertQuestion = document.querySelector(".question");
      const newQuestion = document.createElement("p");
      newQuestion.innerHTML = question.question;
      insertQuestion.appendChild(newQuestion);

      // const newCategory = document.createElement("p");
      // newCategory.innerHTML = `Category: ${question.category}`;
      // insertQuestion.appendChild(newCategory);

      let options = question.incorrect_answers;
      options.push(correct);

      options = shuffle(options);

      optionElements.forEach((el, i) => {
        el.innerHTML = options[i];
      });
    });
}

optionElements.forEach((el, i) => {
  el.addEventListener("click", () => {
    console.log("just before not answered:" + correct);

    if (!answered) {
      console.log(`innerHTML: ${el.innerHTML}    actual text: ${correct}`);
      if (el.innerHTML === correct) {
        score++;
        updateScore();
        el.classList.add("correct");
      } else {
        el.classList.add("wrong");
      }
      answered = true;
    }
  });
});

function remove() {
  document.querySelector(".question").innerHTML = "";
  document.querySelectorAll(".option").forEach((el) => {
    el.classList.remove("correct", "wrong");
    el.innerHTML = "";
  });
}

document.getElementById("btn").addEventListener("click", function () {
    if (curQuestion === numQuestions) {
        document.querySelector('.question-content').style.display = 'none'
        document.querySelector('.score').innerHTML = `Good job your score is: ${score/numQuestions*100}%!`
    }
    curQuestion++
  answered = false;
  remove();
  document.querySelector(".question-title").innerHTML = `Question ${curQuestion}`
  displayQuestion();
});

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function updateScore() {
  document.querySelector(".score").innerHTML = `Score: ${score}/${numQuestions}`;
}

document.querySelector('#restart').addEventListener('click', () => {
    location.reload(true)
})
