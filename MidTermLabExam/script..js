document.getElementById('description-btn').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default anchor behavior

    // Fetch the content of p1.txt
    fetch('p1.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Parse the response as text
        })
        .then(data => {
            // Display the content in the description container
            const container = document.getElementById('description-container');
            container.innerText = data; // Add the content to the container
            container.style.display = 'block'; // Show the container
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

document.getElementById("description-btn").addEventListener("click", function () {
    // Create an AJAX request to fetch the txt file
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "p1.txt", true); // Replace 'p1.txt' with your actual text file path
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // On success, display the content in the box
            var descriptionBox = document.getElementById("description-box");
            descriptionBox.innerHTML = xhr.responseText;
            descriptionBox.style.display = "block"; // Show the box
        }
    };
    xhr.send();
});