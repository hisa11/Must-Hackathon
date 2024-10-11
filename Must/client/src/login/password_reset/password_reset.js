document.addEventListener('DOMContentLoaded', function() {
    const PORT = 3000; // サーバーのポート番号を定義

    document.getElementById('passwordResetForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const resetMessage = document.getElementById('resetMessage');

        if (newPassword !== confirmPassword) {
            resetMessage.textContent = 'パスワードが一致しません。';
            resetMessage.style.color = 'red';
            resetMessage.style.backgroundColor = 'lightblue'; // 背景色を水色に設定
            return; // パスワードが一致しない場合はここで処理を終了
        }

        fetch(`http://localhost:${PORT}/api/auth/password_reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, newPassword })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                resetMessage.textContent = 'パスワード再設定成功！';
                resetMessage.style.color = 'green';
                resetMessage.style.backgroundColor = ''; // 背景色をリセット

                // 2秒後にログイン画面にリダイレクト
                setTimeout(function() {
                    window.location.href = '../login.html';
                }, 2000);
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            resetMessage.innerHTML = `<strong>${error.message}</strong>`;
            resetMessage.style.color = 'red';
            resetMessage.style.backgroundColor = 'lightblue'; // 背景色を水色に設定
        });
    });
});