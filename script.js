//input
const fileInput = document.getElementById('json-upload');
const uploadButton = document.querySelector('.upload-btn');
const selectedFiles = document.getElementById('selected-files');

fileInput.addEventListener('change', () => {

    if (fileInput.files.length === 0) {

        selectedFiles.innerHTML = 'Belum ada file dipilih';
        return;

    }

    selectedFiles.innerHTML = '';

    Array.from(fileInput.files).forEach(file => {

        const fileItem = document.createElement('div');

        fileItem.textContent = `📄 ${file.name}`;

        selectedFiles.appendChild(fileItem);

    });

});


const infoWrapper = document.querySelector('.info-wrapper');

infoWrapper.innerHTML = `

   <div class="result-card">
        <h2>Followers</h2>
        <ul id="followers"></ul>
    </div>

    <div class="result-card">
        <h2>Not Following Back</h2>
        <ul id="not-following-back"></ul>
    </div>

    <div class="result-card">
        <h2>Following Back</h2>
        <ul id="following-back"></ul>
    </div>

    <div class="result-card">
        <h2>Following Hashtags</h2>
        <ul id="hashtags-list"></ul>
    </div>

    <div class="result-card">
        <h2>Recent Follow Requests</h2>
        <ul id="follow-requests-list"></ul>
    </div>

    <div class="result-card">
        <h2>Recently Unfollowed</h2>
        <ul id="recently-unfollowed"></ul>
    </div>

    <div class="result-card">
        <h2>Restricted Profiles</h2>
        <ul id="restricted-profiles"></ul>
    </div>

    `;

//result
const style = document.createElement('style');

style.innerHTML = `

    .result-card{
        background:white;
    border:1px solid #dbdbdb;
    border-radius:20px;
    padding:25px;
    transition:.2s;
}

    .result-card:hover{
        transform:translateY(-4px);
}

    .result-card h2{
        margin - bottom:20px;
    font-size:20px;
}

    .result-card ul{
        list - style:none;
    max-height:300px;
    overflow:auto;
}

    .result-card li{
        padding:10px 0;
    border-bottom:1px solid #f1f1f1;
    font-size:14px;
}

    `;

document.head.appendChild(style);

let followers = [];
let following = [];
let hashtags = [];
let followRequests = [];
let recentlyUnfollowed = [];

uploadButton.addEventListener('click', async () => {

    const files = fileInput.files;

    if (files.length === 0) {
        alert('Pilih file JSON terlebih dahulu');
        return;
    }

    followers = [];
    following = [];
    hashtags = [];
    followRequests = [];
    recentlyUnfollowed = [];
    restrictedProfiles = [];

    for (const file of files) {

        const text = await file.text();
        const json = JSON.parse(text);

        const name = file.name.toLowerCase();

        //followers
        if (name === 'followers_1.json') {

            followers = json.map(item => {
                return item.string_list_data?.[0]?.value;
            }).filter(Boolean);

        }

        //hashtags
        else if (name === 'following_hashtags.json') {

            const hashtagData =
                json.relationships_following_hashtags ||
                json;

            hashtags = hashtagData.map(item => {
                return item.string_list_data?.[0]?.value;
            }).filter(Boolean);

        }

        //following
        else if (name === 'following.json') {

            const followingData =
                json.relationships_following ||
                json;

            following = followingData.map(item => {
                return item.string_list_data?.[0]?.value;
            }).filter(Boolean);

        }

        //recent follow req
        else if (name === 'recent_follow_requests.json') {

            const requestData =
                json.relationships_permanent_follow_requests ||
                json;

            followRequests = requestData.map(item => {
                return item.string_list_data?.[0]?.value;
            }).filter(Boolean);

        }

        //recently unfoll
        else if (name === 'recently_unfollowed_profiles.json') {

            const unfollowedData =
                json.relationships_unfollowed_users ||
                json;

            recentlyUnfollowed = unfollowedData.map(item => {
                return item.string_list_data?.[0]?.value;
            }).filter(Boolean);

        }

        //restricted profiles
        else if (name === 'restricted_profiles.json') {

            const restrictedData =
                json.relationships_restricted_users ||
                json;

            restrictedProfiles = restrictedData.map(item => {
                return item.string_list_data?.[0]?.value;
            }).filter(Boolean);

        }

    }

    //not following back
    const notFollowingBack = following.filter(user => {
        return !followers.includes(user);
    });

    //following back
    const followingBack = following.filter(user => {
        return followers.includes(user);
    });

    document.querySelector('#followers')
        .previousElementSibling.textContent =
        `Followers (${followers.length})`;

    document.querySelector('#not-following-back')
        .previousElementSibling.textContent =
        `Not Following Back (${notFollowingBack.length})`;

    document.querySelector('#following-back')
        .previousElementSibling.textContent =
        `Following Back (${followingBack.length})`;

    document.querySelector('#hashtags-list')
        .previousElementSibling.textContent =
        `Following Hashtags (${hashtags.length})`;

    document.querySelector('#follow-requests-list')
        .previousElementSibling.textContent =
        `Recent Follow Requests (${followRequests.length})`;

    document.querySelector('#recently-unfollowed')
        .previousElementSibling.textContent =
        `Recently Unfollowed (${recentlyUnfollowed.length})`;

    document.querySelector('#restricted-profiles')
        .previousElementSibling.textContent =
        `Restricted Profiles (${restrictedProfiles.length})`;

    //render
    renderList('followers', followers);
    renderList('not-following-back', notFollowingBack);
    renderList('following-back', followingBack);
    renderList('hashtags-list', hashtags);
    renderList('follow-requests-list', followRequests);
    renderList('recently-unfollowed', recentlyUnfollowed);
    renderList('restricted-profiles', restrictedProfiles);

});

function renderList(elementId, data) {

    const element = document.getElementById(elementId);

    element.innerHTML = '';

    if (data.length === 0) {

        element.innerHTML = `
            <li>Tidak ada data</li>
        `;

        return;
    }

    data.forEach(username => {

        const li = document.createElement('li');

        const link = document.createElement('a');

        link.href = `https://www.instagram.com/${username}`;
        link.textContent = username;

        link.target = '_blank';

        link.rel = 'noopener noreferrer';

        link.classList.add('instagram-link');

        li.appendChild(link);

        element.appendChild(li);

    });

}

const sound1 = new Audio('sound/hey-antek-antek-asing-prabowo.mp3');
const sound2 = new Audio('sound/jokowi-saya-akan-lawan.mp3');
const clickmeBtn = document.getElementById('clickme-btn');

let clickCount = 0;

clickmeBtn.addEventListener('click', (e) => {

    e.preventDefault();

    clickCount++;

    if (clickCount % 2 !== 0) {

        sound1.currentTime = 0;
        sound1.play();

    }

    else {

        sound2.currentTime = 0;
        sound2.play();

    }

});