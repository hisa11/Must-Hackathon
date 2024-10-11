document.addEventListener('DOMContentLoaded', function() {
    const PORT = 3000; // サーバーのポート番号を定義

    document.getElementById('signupForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const signupMessage = document.getElementById('signupMessage');

        if (password !== confirmPassword) {
            signupMessage.textContent = 'パスワードが一致しません。';
            signupMessage.style.color = 'red';
            signupMessage.style.backgroundColor = 'lightblue'; // 背景色を水色に設定
            return; // パスワードが一致しない場合はここで処理を終了
        }

        fetch(`http://localhost:${PORT}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                signupMessage.textContent = 'サインアップ成功！';
                signupMessage.style.color = 'green';
                signupMessage.style.backgroundColor = ''; // 背景色をリセット

                // 2秒後にサインイン画面にリダイレクト
                setTimeout(function() {
                    window.location.href = '../login.html';
                }, 2000);
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            signupMessage.innerHTML = `<strong>${error.message}</strong>`;
            signupMessage.style.color = 'red';
            signupMessage.style.backgroundColor = 'lightblue'; // 背景色を水色に設定
        });
    });
});