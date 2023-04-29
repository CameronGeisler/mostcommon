document.getElementById('login-btn').addEventListener('click', () => {
    // Replace with your own Instagram App ID and redirect URI
    const appId = '1198550687530628';
    const redirectUri = '"https://camerongeisler.github.io/mostcommon/instagram/callback';
    const responseType = 'token';
    const scope = 'user_profile,user_media';

    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=${responseType}`;

    window.location.href = authUrl;
});

function getFollowers(access_token) {
    fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${access_token}`)
        .then(response => response.json())
        .then(data => {
            const userId = data.id;
            fetch(`https://graph.instagram.com/${userId}/friends?fields=id,username&access_token=${access_token}`)
                .then(response => response.json())
                .then(data => {
                    const following = data.data.map(user => user.id);
                    const followers = [];
                    following.forEach(user_id => {
                        fetch(`https://graph.instagram.com/${user_id}/friends?fields=id,username&access_token=${access_token}`)
                            .then(response => response.json())
                            .then(data => {
                                followers.push(...data.data);
                                if (followers.length === following.length) {
                                    const mutual_followers = {};
                                    followers.forEach(follower => {
                                        if (!following.includes(follower.id)) {
                                            if (mutual_followers[follower.id]) {
                                                mutual_followers[follower.id]++;
                                            } else {
                                                mutual_followers[follower.id] = 1;
                                            }
                                        }
                                    });
                                    const sorted_mutual_followers = Object.entries(mutual_followers).sort((a, b) => b[1] - a[1]);
                                    const userList = document.getElementById('user-list');
                                    sorted_mutual_followers.forEach(([user_id, shared_connections]) => {
                                        fetch(`https://graph.instagram.com/${user_id}?fields=id,username,profile_picture_url&access_token=${access_token}`)
                                            .then(response => response.json())
                                            .then(data => {
                                                const user = data;
                                                const userDiv = document.createElement('div');
                                                userDiv.classList.add('user');

                                                const img = document.createElement('img');
                                                img.src = user.profile_picture_url;
                                                userDiv.appendChild(img);

                                                const username = document.createElement('span');
                                                username.textContent = `${user.username} (${shared_connections} shared connections)`;
                                                userDiv.appendChild(username);

                                                const followBtn = document.createElement('button');
                                                followBtn.classList.add('follow-btn');
                                                followBtn.textContent = 'Follow';
                                                followBtn.onclick = () => {
                                                    alert(`Follow request sent to ${user.username}`);
                                                };
                                                userDiv.appendChild(followBtn);

                                                userList.appendChild(userDiv);
                                            });
                                    });
                                }
                            });
                    });
                });
        });
}

const urlParams = new URLSearchParams(window.location.hash.slice(1));
const access_token = urlParams.get('access_token');
if (access_token) {
    getFollowers(access_token);
}






// Set up the Instagram API endpoint URLs
const apiBaseUrl = "https://api.instagram.com/v1";
const authUrl = "https://api.instagram.com/oauth/authorize/";
const tokenUrl = "https://api.instagram.com/oauth/access_token/";

// Set up the Instagram App ID and Redirect URI
const appId = "1198550687530628";
const redirectUri = "https://camerongeisler.github.io/mostcommon/instagram/callback";
const deauthCallbackUrl = "https://camerongeisler.github.io/mostcommon/instagram/deauthorize"; // Replace with your own Deauthorize Callback URL

// Set up the Instagram API endpoints
const endpoints = {
  self: `${apiBaseUrl}/users/self`,
  media: `${apiBaseUrl}/users/self/media/recent`,
};

// Set up the Instagram API access token
let accessToken = null;

// Function to handle the Instagram authorization flow
function authorize() {
  const url = `${authUrl}?client_id=${appId}&redirect_uri=${redirectUri}&response_type=token`;
  window.location.href = url;
}

// Function to handle the Instagram deauthorization callback
function deauthorize(userId) {
  // TODO: Handle the deauthorization callback by removing the user's data from your app
}

// Function to retrieve the user's Instagram data
function getUserData() {
  const url = `${endpoints.self}?access_token=${accessToken}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // TODO: Handle the user's data by displaying it in your app
    })
    .catch((error) => console.error(error));
}

// Function to retrieve the user's Instagram media
function getUserMedia() {
  const url = `${endpoints.media}?access_token=${accessToken}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // TODO: Handle the user's media by displaying it in your app
    })
    .catch((error) => console.error(error));
}

// Function to handle the Instagram access token
function handleAccessToken() {
  const hash = window.location.hash.substr(1);
  const params = new URLSearchParams(hash);
  accessToken = params.get("access_token");
  const userId = params.get("user_id");
  if (accessToken) {
    // TODO: Handle the access token by retrieving the user's data and media
  } else if (userId) {
    // Handle the deauthorization callback by removing the user's data from your app
    deauthorize(userId);
  }
}

// Call the handleAccessToken function when the page loads
handleAccessToken();




const dataDeletionUrl = "https://example.com/instagram/data-deletion"; // Replace with your own Data Deletion Request URL

function handleDataDeletion(userId) {
    // TODO: Delete the user's data from your app
}
  
window.addEventListener("message", (event) => {
    if (event.origin === "https://www.instagram.com") {
      const data = JSON.parse(event.data);
      if (data.type === "DATA_DELETION_REQUEST") {
        handleDataDeletion(data.userId);
      }
    }
});