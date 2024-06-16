var id_duplication_check = false;
var password_pass = false;
var name_pass = false;

window.onload = function() {
    var join = document.join; // form 데이터를 모두 join 변수에 저장
    var input = document.querySelectorAll('.check');
    var errorId = ["id_error", "pw_error", "pw_check_error", "name_error"];

    document.join.addEventListener("keydown", evt => {
        if (evt.code === "Enter") evt.preventDefault();
    });

    join.user_id.onkeyup = validateUserId;
    join.user_pw.onkeyup = validatePassword;
    join.user_pw_check.onkeyup = validatePasswordMatch;
    join.user_name.onkeyup = validateUserName;
};

function validateUserId() {
    var idLimit = /^[a-zA-Z0-9~!@#$%^&*()_-]{2,16}$/;
    var userId = document.getElementById('user_id').value;
    if (!idLimit.test(userId)) {
        id_duplication_check = false;
        document.getElementById('id_error').innerHTML = "2~16자의 영문 소대문자, 숫자와 특수기호'~!@#$%^&*()_-'만 사용 가능합니다.";
    } else if (!id_duplication_check) {
        document.getElementById('id_error').innerHTML = "중복 확인이 필요합니다";
    } else {
        id_duplication_check = true
        document.getElementById('id_error').innerHTML = " ";
    }
}

function validatePassword() {
    var pwLimit = /^[a-zA-Z0-9~!@#$%^&*()_-]{8,16}$/;
    var password = document.getElementById('user_pw').value;
    if (!pwLimit.test(password)) {
        password_pass = false;
        document.getElementById('pw_error').innerHTML = "8~16자리 숫자, 특수문자(~!@#$%^&*()_-), 영어로 작성해주세요";
    } else {
        password_pass = true;
        document.getElementById('pw_error').innerHTML = " ";
    }
    validatePasswordMatch(); // 비밀번호가 변경되면 비밀번호 확인도 다시 검사
}

function validatePasswordMatch() {
    var password = document.getElementById('user_pw').value;
    var confirmPassword = document.getElementById('user_pw_check').value;
    if (confirmPassword !== password) {
        password_pass = false;
        document.getElementById('pw_check_error').innerHTML = "비밀번호가 일치하지 않습니다";
    } else {
        password_pass = true;
        document.getElementById('pw_check_error').innerHTML = " ";
    }
}

function validateUserName() {
    var usernameLimit = /^[a-zA-Z0-9~!@#$%^&*()_-]{2,20}$/;
    var userName = document.getElementById('user_name').value;
    if (!usernameLimit.test(userName)) {
        name_pass = false;
        document.getElementById('name_error').innerHTML = "2~20자리 숫자, 특수문자(~!@#$%^&*()_-)만 가능합니다";
    } else {
        name_pass = true;
        document.getElementById('name_error').innerHTML = " ";
    }
}

async function checkUserId(event) {
    event.preventDefault();  // 기본 폼 제출 동작을 막음

    const userId = document.getElementById('user_id').value;
    const response = await fetch('/check_id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
    });

    const result = await response.json();

    if (result.exists) {
        id_duplication_check = false;
        document.getElementById('id_error').innerHTML = '사용 중인 ID입니다';
    } else {
        id_duplication_check = true;
        document.getElementById('id_error').innerHTML = '사용 가능합니다';
    }
}

async function postdata(event) {
    event.preventDefault();  // 기본 폼 제출 동작을 막음

    validateUserId();
    validatePassword();
    validatePasswordMatch();
    validateUserName();

    const user_id = document.getElementById('user_id').value;
    const user_pw = document.getElementById('user_pw').value;
    const user_name = document.getElementById('user_name').value;
    
    var all_check = true;

    if (!id_duplication_check) {
        document.getElementById('id_error').innerHTML = '<font color=red>중복 확인이 필요합니다</font>';
        all_check = false;
    }

    if (!password_pass) {
        document.getElementById('pw_error').innerHTML = '<font color=red>비밀번호를 확인해주세요</font>';
        all_check = false;
    }

    if (!name_pass) {
        document.getElementById('name_error').innerHTML = '<font color=red>이름을 확인해주세요</font>';
        all_check = false;
    }

    if (all_check) {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: user_id, pw: user_pw, user_name: user_name }),
        });
        const result = await response.json();

        if (result.exists) {
            id_duplication_check = false;
            document.getElementById('id_error').innerHTML = '사용 중인 ID입니다';
        } else {
            id_duplication_check = true;
            document.getElementById('id_error').innerHTML = '사용 가능합니다';
            if (!result.db_error) {
                document.getElementById('state_message').innerHTML = '<font color=blue>회원가입 성공</font>';
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                document.getElementById('state_message').innerHTML = 'DB 에러';
            }
        }
    }
}
