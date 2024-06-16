window.onload = function() {
    document.join.addEventListener("keydown", evt => {
        if (evt.code === "Enter") evt.preventDefault();
    });
};

async function go2register(event) {
    event.preventDefault();  // 기본 폼 제출 동작을 막음
    window.location.href = '/register';
}

async function postdata(event) {
    event.preventDefault();  // 기본 폼 제출 동작을 막음

    const user_id = document.getElementById('user_id').value;
    const user_pw = document.getElementById('user_pw').value;
    
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user_id, pw: user_pw}),
    });
    const result = await response.json();

    if (result.exists) {
        if (result.pw_match) {
            document.getElementById('state_message').innerHTML = '<font color=blue>로그인 성공</font>';
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            document.getElementById('state_message').innerHTML = '<font color=red>비밀번호가 틀렸습니다</font>';
        }
    } else {
        document.getElementById('state_message').innerHTML = '<font color=red>등록된 사용자가 아닙니다</font>';
    }
}
