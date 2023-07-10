fetch("http://localhost:3000/tags")
    .then(response => response.json())
    .then(data => {tags = data;})
    .catch(error => console.log(error))


export let tags = ["Placement Cell", "Exam Cell", "Admission Office", "Student Cell"];