document.addEventListener('DOMContentLoaded', function() {
    const viewUsersButton = document.getElementById('viewUsers');
    const userList = document.getElementById('userList');
    const addUserForm = document.getElementById('addUserForm');

    viewUsersButton.addEventListener('click', function() {
        fetch('/api/admin/users')
            .then(response => response.json())
            .then(data => {
                userList.innerHTML = '';
                data.forEach(user => {
                    const userItem = document.createElement('div');
                    userItem.textContent = `ID: ${user.id}, ユーザー名: ${user.username}, メール: ${user.email}`;
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = '削除';
                    deleteButton.addEventListener('click', function() {
                        fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
                            .then(response => response.json())
                            .then(result => {
                                alert(result.message);
                                viewUsersButton.click();
                            })
                            .catch(error => console.error('ユーザーの削除に失敗しました:', error));
                    });
                    userItem.appendChild(deleteButton);
                    userList.appendChild(userItem);
                });
            })
            .catch(error => console.error('ユーザー一覧の取得に失敗しました:', error));
    });

    addUserForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(addUserForm);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        fetch('/api/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message);
            addUserForm.reset();
            viewUsersButton.click();
        })
        .catch(error => console.error('ユーザーの追加に失敗しました:', error));
    });
});