const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(json => displayLessons(json.data))
}

const displayLessons = lessons => {
    // 1.  get the container and clear it before adding new content
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";

    // 2. loop through the lessons and create buttons for each lesson
    for(let lesson of lessons){

        // 3. create a div element and set its innerHTML to a button with the lesson name
        
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
    <button class="btn btn-outline btn-primary">
    <i class="fa-solid fa-book"></i>
    Lesson- ${lesson.label_no}</button>
    `;

        // 4. append the button div to the container
    levelContainer.append(btnDiv);

    }
}
loadLessons();
