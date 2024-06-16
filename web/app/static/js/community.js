async function load_community_page() {
    // 검색어
    let search_text = document.getElementsByClassName("search_text")[0].value;
    // 정렬
    let sort_by = document.getElementById("select_sort_by").value;

    // board 데이터 받아오기
    const response_data = await fetch('community', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'search_text': search_text, 'sort_by': sort_by})
    })
    .then(res => res.json())

    board_data = response_data.board_data;
    
    if (board_data.length == 0) {
        delete_top_button();
    }
    
    load_boards();
}

function delete_top_button() {    
    if (board_data.length <= 3) {
        let top_button = document.getElementsByClassName("to_top")[0];
        let footer = top_button.parentElement;
        footer.removeChild(top_button);
    }
}

function to_the_top(){
    const position = document.documentElement.scrollTop || document.body.scrollTop;
    if (position) {
        window.requestAnimationFrame(() => {
            window.scrollTo(0, position - position / 10);
            to_the_top();
        });
    }
}
