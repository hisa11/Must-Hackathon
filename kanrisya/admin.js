document.addEventListener('DOMContentLoaded', function() {
    const PORT = 3000;

    // ユーザー一覧を表示する関数
    function displayUsers(users) {
        const userList = document.getElementById('userList');
        userList.innerHTML = ''; // 既存の内容をクリア

        users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.textContent = `ユーザー名: ${user.username}, メール: ${user.email}`;
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '削除';
            deleteButton.addEventListener('click', () => deleteUser(user.id));

            userItem.appendChild(deleteButton);
            userList.appendChild(userItem);
        });
    }

    // ユーザー一覧を取得する関数
    function fetchUsers() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('トークンが存在しません。ログインしてください。');
            return;
        }

        fetch(`http://localhost:${PORT}/api/admin/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('ネットワーク応答が正常ではありません');
            }
            return response.json();
        })
        .then(data => {
            displayUsers(data);
        })
        .catch(error => {
            const userList = document.getElementById('userList');
            userList.textContent = `エラー: ${error.message}`;
            userList.style.color = 'red';
        });
    }

    // ユーザーを削除する関数
    function deleteUser(userId) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('トークンが存在しません。ログインしてください。');
            return;
        }

        fetch(`http://localhost:${PORT}/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('ネットワーク応答が正常ではありません');
            }
            return response.json();
        })
        .then(result => {
            alert(result.message);
            fetchUsers(); // ユーザー一覧を更新
        })
        .catch(error => console.error('ユーザーの削除に失敗しました:', error));
    }

    // viewUsersボタンがクリックされたときにユーザー一覧を取得
    const viewUsersButton = document.getElementById('viewUsers');
    viewUsersButton.addEventListener('click', fetchUsers);

    // ユーザー追加フォームの送信イベントをリッスン
    const addUserForm = document.getElementById('addUserForm');
    addUserForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('トークンが存在しません。ログインしてください。');
            return;
        }

        const userData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        fetch(`http://localhost:${PORT}/api/admin/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('ネットワーク応答が正常ではありません');
            }
            return response.json();
        })
        .then(result => {
            alert(result.message);
            addUserForm.reset();
            viewUsersButton.click(); // ユーザー一覧を更新
        })
        .catch(error => console.error('ユーザーの追加に失敗しました:', error));
    });
});