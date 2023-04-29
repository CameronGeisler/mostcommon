document.getElementById('login-btn').addEventListener('click', () => {
    // Replace with your own Instagram App ID and redirect URI
    const appId = 'YOUR_APP_ID';
    const redirectUri = 'YOUR_REDIRECT_URI';
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