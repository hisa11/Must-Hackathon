document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // フォームのデフォルト動作を無効化
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('Sending login request for username:', username); // ログ追加

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            console.log('Received response:', response); // ログ追加

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Login failed:', errorData.message);
                alert('ログイン失敗: ' + errorData.message);
                return;
            }

            const data = await response.json();
            console.log('Response data:', data); // ログ追加

            if (data.success) {
                alert('ログイン成功！');
                // トークンを保存するなどの処理を追加
                console.log('Token:', data.token); // トークンのログ追加
            } else {
                alert('ログイン失敗: ' + data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('ログイン中にエラーが発生しました。');
        }
    });
});