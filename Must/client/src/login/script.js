document.addEventListener('DOMContentLoaded', function() {
    const PORT = 3000; // サーバーのポート番号を定義

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const loginMessage = document.getElementById('loginMessage');

        console.log(`Sending login request for username: ${username}`); // デバッグ用ログ

        fetch(`http://localhost:${PORT}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            console.log('Received response:', response); // デバッグ用ログ
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data); // デバッグ用ログ
            if (data.success) {
                loginMessage.textContent = 'ログイン成功！';
                loginMessage.style.color = 'green';
                loginMessage.style.backgroundColor = ''; // 背景色をリセット
                loginMessage.style.fontWeight = 'normal'; // フォントの太さをリセット
                // トークンをローカルストレージに保存
                localStorage.setItem('token', data.token);
                console.log('Token saved:', data.token); // トークンのログ追加
                setTimeout(() => {
                    window.location.href = '../user_home/user_home.html'; // ユーザーページにリダイレクト
                }, 1000);
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            console.error('Error during login:', error); // デバッグ用ログ
            loginMessage.innerHTML = `<strong>${error.message}</strong>`;
            loginMessage.style.color = 'red';
            loginMessage.style.backgroundColor = 'skyblue'; // 背景色を水色に設定
        });
    });
});