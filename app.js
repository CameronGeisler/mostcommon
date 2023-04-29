// Set up the Instagram App ID and Redirect URI
const appId = "2011593365861809";
const redirectUri = "https://camerongeisler.github.io/mostcommon/callback.html";
const responseType = "code";
const scope = "user_profile,user_media";

// Set up the Instagram API endpoint URLs
const apiBaseUrl = "https://graph.instagram.com";
const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=${responseType}`;
const tokenUrl = "https://api.instagram.com/oauth/access_token";

// Set up the Instagram API endpoints
const endpoints = {
  self: `${apiBaseUrl}/users/self`,
  media: `${apiBaseUrl}/users/self/media/recent`,
};

// Set up the Instagram API access token
let accessToken = null;

// Function to handle the Instagram authorization flow
function authorize() {
  const url = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile,user_media&response_type=code`;
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

// Function to handle the Instagram access token
function handleAccessToken() {
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  if (code) {
    const data = {
      client_id: appId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code: code,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data),
    };
    fetch(tokenUrl, options)
      .then((response) => response.json())
      .then((data) => {
        accessToken = data.access_token;
        // TODO: Handle the access token by retrieving the user's data and media
      })
      .catch((error) => console.error(error));
  }
}

// Call the handleAccessToken function when the page loads
handleAccessToken();

const dataDeletionUrl = "https://camerongeisler.github.io/mostcommon/deauthorize.html";

function handleDataDeletion(userId) {
    // TODO: Delete the user's data from your app
}

// Update the login button event listener
document.getElementById('login-btn').addEventListener('click', () => {
  // Replace with your own Instagram App ID and redirect URI
  const appId = '2011593365861809';
  const redirectUri = 'https://camerongeisler.github.io/mostcommon/callback.html';
  const responseType = 'code';
  const scope = 'user_profile';

  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;

  window.location.href = authUrl;
});
  
window.addEventListener("message", (event) => {
    if (event.origin === "https://www.instagram.com") {
      const data = JSON.parse(event.data);
      if (data.type === "DATA_DELETION_REQUEST") {
        handleDataDeletion(data.userId);
        window.location.href = dataDeletionUrl;
      }
    }
});

// Function to handle retrieving the user's followers
function getFollowers(access_token) {
  fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${access_token}`)
    .then(response => response.json())
    .then(data => {
      const userId = data.id;
      fetch(`https://graph.instagram.com/${userId}/followers?fields=id,username&access_token=${access_token}`)
        .then(response => response.json())
        .then(data => {
          const followers = data.data.map(user => user.id);
          const following = [];
          followers.forEach(user_id => {
            fetch(`https://graph.instagram.com/${user_id}/following?fields=id,username&access_token=${access_token}`)
              .then(response => response.json())
              .then(data => {
                following.push(...data.data);
                if (following.length === followers.length) {
                  const mutual_following = {};
                  following.forEach(followed_user => {
                    if (!followers.includes(followed_user.id)) {
                      if (mutual_following[followed_user.id]) {
                        mutual_following[followed_user.id]++;
                      } else {
                        mutual_following[followed_user.id] = 1;
                      }
                    }
                  });
                  const sorted_mutual_following = Object.entries(mutual_following).sort((a, b) => b[1] - a[1]);
                  const userList = document.getElementById('user-list');
                  sorted_mutual_following.forEach(([user_id, shared_connections]) => {
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
