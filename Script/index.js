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

const loadLebelWord = (lebel_no) => {
    const url = `https://openapi.programming-hero.com/api/level/${lebel_no}`;
    fetch(url)
        .then(res => res.json())
        .then(json => {
            removeActive(); 
            const clickbtn = document.getElementById(`lesson-${lebel_no}`);
            clickbtn.classList.add("btn-active");
            displaylebelWord(json.data);
        });
};

const lordWordDetail = async (lebel_word) => {
    const url = `https://openapi.programming-hero.com/api/word/${lebel_word}`;
    const res = await fetch(url);
    const json = await res.json();
    const wordDetail = json.data;
    displayWordDetail(wordDetail);
};

const displayWordDetail = (wordDetail) => {
    console.log(wordDetail);
    const detailsContainer = document.getElementById("details-container");
    detailsContainer.innerHTML = "Hi this is word details";
    document.getElementById("word_modal").showModal();
};

const displaylebelWord = (lebel_word) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if (lebel_word.length === 0) {
        wordContainer.innerHTML = `
        <div class="font-Bangla col-span-full text-center rounded-xl py-10 space-y-6">
            <img class="w-24 mx-auto" src="./Images/alert-error.png" alt="">
            <p class="text-xl font-medium text-gray-400">
                এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
            </p>
            <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
        </div>`;
        return;
    }

    lebel_word.forEach(lebel_word => {
        const wordDiv = document.createElement("div");
        wordDiv.innerHTML = `
        <div class="bg-white rounded-xl py-10 px-5 shadow-sm text-center space-y-4">
            <h2 class="font-bold text-2xl">
                ${lebel_word.word ? lebel_word.word : "Unknown Word"}
            </h2>
            <p class="font-semibold">Meaning /Pronounciation</p>

            <div class="font-Bangla font-2xl font-medium">
                "${lebel_word.meaning ? lebel_word.meaning : "No meaning available"} /
                ${lebel_word.pronunciation ? lebel_word.pronunciation : "No pronunciation available"}"
            </div>

            <div class="flex justify-between items-center">
                <button 
                  onClick="lordWordDetail('${lebel_word.word}')" 
                  class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
                  <i class="fa-solid fa-circle-info"></i>
                </button>

                <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
                  <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
        </div>
        `;
        wordContainer.append(wordDiv);
    });
};

const displayLessons = lessons => {
    const lebelContainer = document.getElementById("lebel-container");
    lebelContainer.innerHTML = "";

    for (let lesson of lessons) {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
        <button 
          id="lesson-${lesson.level_no}" 
          onclick="loadLebelWord(${lesson.level_no})" 
          class="btn btn-outline btn-primary lesson-btn w-full">
          <i class="fa-solid fa-book"></i> Lesson - ${lesson.level_no}
        </button>
        `;
        lebelContainer.append(btnDiv);
    }
};

loadLessons();