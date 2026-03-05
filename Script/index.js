
const createElements = (arr = []) => {
    const htmlElements = arr.map(el => `<span class="btn">${el}</span>`);
    return htmlElements.join("");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
    if (status === "true") {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }
    else {
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("word-container").classList.remove("hidden");
    }
};

const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(json => displayLessons(json.data));
};

const removeActive = () => {
    const lessonBtn = document.querySelectorAll(".lesson-btn");
    lessonBtn.forEach(btn => {
        btn.classList.remove("btn-active");
    });
};

const loadLevelWord = (id) => {
    manageSpinner("true");
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(json => {
            removeActive(); 
            const clickBtn = document.getElementById(`lesson-${id}`);
            clickBtn.classList.add("btn-active");
            displayLevelWord(json.data);
        });
};

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const json = await res.json();
    const wordDetail = json.data;
    displayWordDetail(wordDetail);
};

const displayWordDetail = (wordDetail) => {
    console.log(wordDetail);
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
                <div>
                <h2 class="text-2xl font-bold">${wordDetail.word} (<i class="fa-solid fa-microphone-lines"></i>:${wordDetail.pronunciation})</h2>
                </div>
                <div>
                    <h3 class="font-bold">Meaning</h3>
                    <p>${wordDetail.meaning || "No meaning available"}</p>
                </div>
                <div>
                    <h3 class="font-bold">Example</h3>
                    <p>${wordDetail.example || "No example available"}</p>
                </div>
                <div>
                    <h3 class="font-bold">Synonym</h3>
                    <div class="flex flex-wrap gap-2">${createElements(wordDetail.synonyms)}</div>
                </div>`;

    document.getElementById("word_modal").showModal();
};

const displayLevelWord = (level_word) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if (level_word.length === 0) {
        wordContainer.innerHTML = `
        <div class="font-Bangla col-span-full text-center rounded-xl py-10 space-y-6">
            <img class="w-24 mx-auto" src="./Images/alert-error.png" alt="">
            <p class="text-xl font-medium text-gray-400">
                এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
            </p>
            <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
        </div>`;
        manageSpinner("false");
        return;
    }

    level_word.forEach(level_word => {
        const wordDiv = document.createElement("div");
        wordDiv.innerHTML = `
        <div class="bg-white rounded-xl py-10 px-5 shadow-sm text-center space-y-4">
            <h2 class="font-bold text-2xl">
                ${level_word.word ? level_word.word : "Unknown Word"}
            </h2>
            <p class="font-semibold">Meaning /Pronunciation</p>

            <div class="font-Bangla font-2xl font-medium">
                "${level_word.meaning ? level_word.meaning : "No meaning available"} /
                ${level_word.pronunciation ? level_word.pronunciation : "No pronunciation available"}"
            </div>

            <div class="flex justify-between items-center">
                <button 
                  onclick="loadWordDetail('${level_word.id}')" 
                  class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
                  <i class="fa-solid fa-circle-info"></i>
                </button>

                <button onclick="pronounceWord('${level_word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
                  <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
        </div>
        `;
        wordContainer.append(wordDiv);
    });
    manageSpinner("false");
};

const displayLessons = lessons => {
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";

    for (let lesson of lessons) {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
        <button 
          id="lesson-${lesson.level_no}" 
          onclick="loadLevelWord(${lesson.level_no})" 
          class="btn btn-outline btn-primary lesson-btn w-full">
          <i class="fa-solid fa-book"></i> Lesson - ${lesson.level_no}
        </button>
        `;
        levelContainer.append(btnDiv);
    }
};

loadLessons();

document.getElementById("btn-search").addEventListener("click", () => { 
    removeActive();
    manageSpinner("true");

    const input = document.getElementById("input-search"); 
    const searchValue = input.value.trim().toLowerCase();

    if(!searchValue){
        alert("Please enter a word");
        return;
    }

    fetch('https://openapi.programming-hero.com/api/words/all')
    .then((res) => res.json())
    .then((json) => {
        const allWords = json.data;

        const filteredWords = allWords.filter((word) =>
            word.word.toLowerCase().includes(searchValue)
        );

        displayLevelWord(filteredWords);
    });
});