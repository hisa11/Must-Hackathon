async function fetchUserProfile() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('トークンが存在しません');
        }

        const response = await fetch('http://localhost:3000/api/auth/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // トークンをヘッダーに追加
            }
        });

        if (!response.ok) {
            throw new Error('ユーザー情報の取得に失敗しました');
        }

        const data = await response.json();
        console.log('User profile:', data);
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

fetchUserProfile();