function signUp() {
    const name = document.getElementById("name").value.trim();
    const fatherName = document.getElementById("father-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const address = document.getElementById("address").value.trim();
    const gender = document.querySelector("input[name='gender']:checked")?.value;
    const agree = document.getElementById("privacy-policy").checked;

    const message = document.getElementById("message");

    if (!agree) {
        alert("You must agree to terms and conditions.");
        return;
    }

    if (!name || !fatherName || !email || !password || !gender || !address) {
        alert("Please fill all fields!");
        return;
    }

    // Save user data to localStorage
    localStorage.setItem("userName", name);
    localStorage.setItem("fatherName", fatherName);
    localStorage.setItem("userEmail", email);

    alert("User created successfully!");
}
function signIn() {
    const emailInput = document.getElementById("email").value.trim();
    const savedEmail = localStorage.getItem("userEmail");

    if (!savedEmail) {
        alert("No user found! Please sign up first.");
        return;
    }

    if (emailInput !== savedEmail) {
        alert("Email does not match!");
        return;
    }

    // Redirect to main.html
    window.location.href = "main.html";

}
//////////////////////////////////////////////////
//main.html script starts here...
const username = localStorage.getItem("userName"); // store in a variable
alert("Welcome " + username + "!"); // use variable, not string

let posts = JSON.parse(localStorage.getItem("posts")) || [];

const postText = document.getElementById("post-text");
const postImage = document.getElementById("post-image");
const postBtn = document.getElementById("post-btn");
const feed = document.getElementById("feed");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const themeToggle = document.getElementById("theme-toggle");


function savePosts() {
    localStorage.setItem("posts", JSON.stringify(posts));
}


postBtn.addEventListener("click", () => {
    const text = postText.value.trim();
    const imgURL = postImage.value.trim();

    if (!text && !imgURL) {
        alert("Write something or add an image!");
        return;
    }

    const newPost = {
        id: Date.now(),
        text,
        imgURL,
        likes: 0,
        reactions: { heart: 0, laugh: 0, wow: 0, sad: 0, like: 0 },
        time: new Date().toLocaleString(),
    };

    posts.unshift(newPost);
    savePosts();
    renderPosts();
    postText.value = "";
    postImage.value = "";
});


function renderPosts() {
    feed.innerHTML = "";

    let filteredPosts = posts.filter(post =>
        post.text.toLowerCase().includes(searchInput.value.toLowerCase())
    );

    if (sortSelect.value === "Oldest First") {
        filteredPosts.reverse();
    } else if (sortSelect.value === "Most Liked") {
        filteredPosts.sort((a, b) => b.likes - a.likes);
    }

    filteredPosts.forEach(post => {
        const postEl = document.createElement("div");
        postEl.className =
            "bg-white p-4 shadow-md rounded-lg border border-gray-200";

        postEl.innerHTML = `
            <p class="text-gray-900 mb-2">${post.text}</p>

            ${post.imgURL ? `<img src="${post.imgURL}" class="rounded-lg mb-2 w-full">` : ""}

            <p class="text-gray-500 text-sm">${post.time}</p>

            <!-- Reaction Buttons -->
            <div class="flex gap-4 mt-3 text-xl cursor-pointer">
                <span onclick="react('${post.id}', 'heart')">❤️ ${post.reactions.heart}</span>
                <span onclick="react('${post.id}', 'laugh')">😂 ${post.reactions.laugh}</span>
                <span onclick="react('${post.id}', 'wow')">😮 ${post.reactions.wow}</span>
                <span onclick="react('${post.id}', 'sad')">😢 ${post.reactions.sad}</span>
                <span onclick="react('${post.id}', 'like')">👍 ${post.reactions.like}</span>
            </div>

            <!-- Like Button -->
            <button onclick="toggleLike('${post.id}')" 
                class="mt-3 text-red-600 font-bold text-lg">
                ❤️ ${post.likes}
            </button>

            <!-- Edit/Delete Buttons -->
            <div class="flex justify-end gap-4 mt-3 text-xl">
                <button onclick="openEdit('${post.id}')" class="text-blue-600">✏️</button>
                <button onclick="deletePost('${post.id}')" class="text-red-600">🗑️</button>
            </div>
        `;

        feed.appendChild(postEl);
    });
}

renderPosts();


function deletePost(id) {
    if (!confirm("Delete this post?")) return;

    posts = posts.filter(p => p.id != id);
    savePosts();
    renderPosts();
}


function toggleLike(id) {
    const post = posts.find(p => p.id == id);
    post.likes = post.likes === 1 ? 0 : 1;
    savePosts();
    renderPosts();
}


function react(id, type) {
    const post = posts.find(p => p.id == id);
    post.reactions[type]++;
    savePosts();
    renderPosts();
}


function openEdit(id) {
    const post = posts.find(p => p.id == id);

    const text = prompt("Edit your post:", post.text);
    if (text === null) return;

    post.text = text;
    savePosts();
    renderPosts();
}


// searchInput.addEventListener("input", renderPosts);
// sortSelect.addEventListener("change", renderPosts);



// themeToggle.addEventListener("click", () => {
//     document.body.classList.toggle("bg-gray-900");
//     document.body.classList.toggle("text-white");

//     themeToggle.textContent =
//         themeToggle.textContent === "🌙" ? "☀️" : "🌙";
// });
// function logOut() {
//     window.location.href = "index.html"
// }
// function profile() {
//     window.location.href = "profile.html"
// }
// // On page load: Check for user and load profile data
// window.onload = () => {
//     // Retrieve user from localStorage
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (!user) {
//         // Redirect to login if no user
//         window.location.href = 'index.html';
//         return;
//     }
    
//     // Display user details
//     document.getElementById('user-name').textContent = user.name || 'N/A';
//     document.getElementById('user-dob').textContent = user.dob || 'N/A';
//     document.getElementById('user-email').textContent = user.email || 'N/A';
    
//     // Load and display videos
//     const videos = JSON.parse(localStorage.getItem('videos')) || [];
//     const videosList = document.getElementById('videos-list');
//     const noVideos = document.getElementById('no-videos');
    
//     if (videos.length === 0) {
//         noVideos.classList.remove('hidden');
//     } else {
//         videos.forEach(url => {
//             const videoDiv = document.createElement('div');
//             videoDiv.innerHTML = `<video controls class="w-full rounded"><source src="${url}" type="video/mp4">Your browser does not support the video tag.</video>`;
//             videosList.appendChild(videoDiv);
//         });
//     }
    
//     // Theme toggle functionality
//     document.getElementById('theme-toggle').addEventListener('click', () => {
//         document.body.classList.toggle('dark');
//         const btn = document.getElementById('theme-toggle');
//         btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
//     });
// };
