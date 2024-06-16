let last_num = 0;
let board_data;

function load_boards() {
    let boards = document.getElementsByClassName("boards")[0];

    if (board_data.length <= 0) {
        let empty_text = document.createElement("div");
        empty_text.setAttribute("class", "empty_text")
        empty_text.innerHTML = "아직 사진이 없습니다.";
        boards.appendChild(empty_text);
        return
    }

    let start_num = last_num;

    if (last_num + 9 <= board_data.length) {
        last_num += 9;
    } else {
        last_num = board_data.length;
    }

    for(i = start_num; i < last_num; i++) {
        let board_block = document.createElement("div");
        board_block.setAttribute("class", "board_block");
        board_block.setAttribute("id", board_data[i][0]);
        
        let board_image = document.createElement("img");
        board_image.setAttribute("class", "board_image");
        board_image.setAttribute("src", board_data[i][1]);
        
        board_block.appendChild(board_image);

        if(board_data[i][2] != undefined) {
            let board_title = document.createElement("div");
            board_title.setAttribute("class", "board_title");
            board_title.innerHTML = board_data[i][2];
            
            board_block.appendChild(board_title);

            // 게시글 팝업
            board_block.addEventListener('click', function(){
                document.querySelector(".popup_block").classList.add('on');
                popup_data(board_block.id);
            })
        }
        else {
            // 보관함 팝업
            board_block.addEventListener('click', function(){
                document.querySelector(".savebox_popup_background").classList.add('on');

                let savebox_popup_image = document.querySelector(".savebox_popup_image");
                savebox_popup_image.setAttribute("id", board_block.id);
                savebox_popup_image.src = board_image.src;
                
                let savebox_download_button = document.getElementById("savebox_download_button");
                savebox_download_button.setAttribute("href", '/' + savebox_download_button.href.split('/').at(-2) + '/' + board_image.src.split('/').at(-1));
            })
        }
        
        boards.appendChild(board_block);
    }
    isFetching = false;
}

window.addEventListener("scroll", function () {
    const IS_END = (window.innerHeight + window.scrollY > document.body.offsetHeight);
    
    if (IS_END && !isFetching) {
        load_boards();
    }
});
