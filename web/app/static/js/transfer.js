const stepTargets = document.querySelectorAll('.step');
const formTargets = document.querySelectorAll('.form');
const uploadTargets = document.querySelectorAll('.upload');
const styleTargets = document.querySelectorAll('.style');
const stepprev = document.querySelectorAll('.step-status');
const choose_ex = document.querySelectorAll('.choose');
const choose_back = document.querySelectorAll('.choose_back');
const choose_style = document.querySelectorAll('.choose_style');
const targetName = document.querySelectorAll('.targetname');
const stBox = document.querySelectorAll('.stnoimgbox');

const uptp_single_Button = document.querySelector('#singleuploadbtn');
const uptp_double_Button = document.querySelector('#doubleuploadbtn');
const up_single_Button = document.querySelector('#singlefileupload');
const up_double_Button = document.querySelector('#doublefileupload');
const sttp_s_Button = document.querySelector('#severgiftbtn');
const sttp_d_Button = document.querySelector('#dallebtn');
const sttp_u_Button = document.querySelector('#useruploadbtn');
const st_s_Button = document.querySelector('#stylenorm');
const st_g_Button = document.querySelector('#stylegen');
const st_u_Button = document.querySelector('#stylefileupload');
const upload_0 = document.querySelector('#imageone-upload');
const realUpload_0 = document.querySelector('#chooseFile_1');
const upload_1 = document.querySelector('#image-upload_2');
const realUpload_1 = document.querySelector('#chooseFile_2');
const upload_2 = document.querySelector('#image-upload_3');
const realUpload_2 = document.querySelector('#chooseFile_3');
const upload_3 = document.querySelector('#style-upload');
const realUpload_3 = document.querySelector('#chooseFile_4');
const chat_Log = document.querySelector('#chat_log');
const chat_Button = document.querySelector('#textsend');
const img_Up1 = document.querySelector('#img-up1');
const img_Up2 = document.querySelector('#img-up2');
const img_Up3 = document.querySelector('#img-up3');
const img_Up4 = document.querySelector('#img-up4');

let currentStep = 0;
let uploadtype = 0;
let styletype = 0;
let normtype = 0;
let uploadnum =0;

let request_data = {
    encoding_type : "",
    content_target_name : null,
    content_target_image : null,
    style_name : null,
    style_image : null,
    person_transfer_bool : false,
    content_source_name : null,
    content_source_image : null
}

window.onload = function(){
    uptp_single_Button.addEventListener('click', ()=>{
        uploadtype = 0;
        stepNext();
    });
    
    uptp_double_Button.addEventListener('click', ()=>{
        uploadtype = 1;
        stepNext();
    });

    up_single_Button.addEventListener('click', ()=>{
        stepNext();
    });

    up_double_Button.addEventListener('click', ()=>{
        stepNext();
    });

    sttp_s_Button.addEventListener('click', ()=>{
        styletype = 0;
        stepNext();
    });

    sttp_d_Button.addEventListener('click', ()=>{
        styletype = 1;
        stepNext();
    });

    sttp_u_Button.addEventListener('click', ()=>{
        styletype = 2;
        stepNext();
    });

    st_s_Button.addEventListener('click', ()=>{
        stepNext();
        laststep();
    });

    st_g_Button.addEventListener('click', ()=>{
        stepNext();
        laststep();
    });


    st_u_Button.addEventListener('click', ()=>{
        stepNext();
        laststep();
    });

    chat_Button.addEventListener('click', ()=>{
        generative_send();
    });

    upload_0.addEventListener('click', () =>{
        realUpload_0.click()
    });

    upload_1.addEventListener('click', () =>{
        realUpload_1.click()
    });

    upload_2.addEventListener('click', () =>{
        realUpload_2.click()
    });

    upload_3.addEventListener('click', () =>{
        realUpload_3.click()
    });

}

function stepNext(){
    stepTargets[currentStep].classList.remove('active');
    stepTargets[currentStep].classList.add('prev');
    formTargets[currentStep].classList.add('hidden');

    stepTargets[currentStep + 1].classList.add('active');
    formTargets[currentStep + 1].classList.remove('hidden');

    if(currentStep == 0){
        uploadTargets[uploadtype].classList.remove('hidden');
    }else{
        uploadTargets[uploadtype].classList.add('hidden');
    }

    if(currentStep == 2){
        styleTargets[styletype].classList.remove('hidden');
    }
    currentStep = currentStep + 1;
}

function hide(){
    uploadTargets[uploadtype].classList.remove('hidden');
    choose_ex[uploadtype].classList.remove('hidden');
    choose_back[0].classList.remove('hidden');
    img_Up1.classList.add('hidden');
    img_Up2.classList.add('hidden');
    img_Up3.classList.add('hidden');
    targetName[uploadtype].textContent = "example.jpg";
    document.getElementById('fileName_3').textContent = "example.jpg";

    let button1 = document.getElementById('singlefileupload');
    button1.disabled = true;
    let button2 = document.getElementById('doublefileupload');
    button2.disabled = true;
    uploadnum = 0;

    if(currentStep == 0){
        uploadTargets[uploadtype].classList.add('hidden');
    }
}

function generative_clear(){
    chat_Log.replaceChildren();

    let gline = document.createElement('div');
    gline.classList.add('chatline');

    let gicon = document.createElement('div');
    gicon.classList.add('icon');
    gicon.classList.add('left');
    let gicontext = document.createTextNode("G");
    gicon.appendChild(gicontext);
    gline.appendChild(gicon);

    let gchat = document.createElement('div');
    gchat.classList.add('chat-text');
    gchat.classList.add('left');
    let gchattext = document.createTextNode("원하는 그림을 말씀해주세요");
    gchat.appendChild(gchattext);
    gline.appendChild(gchat);

    chat_Log.appendChild(gline);

    let input = document.getElementById('chat');
    input.value = null;

    const imgElement = document.querySelector('#gen-image');
    imgElement.classList.add('hidden');
}

function stepBack(step){
    stepTargets[currentStep].classList.remove('active');
    formTargets[currentStep].classList.add('hidden');

    if(currentStep ==3){
        styleTargets[styletype].classList.add('hidden');
        if(styletype == 2){
            choose_style[0].classList.remove('hidden');
            img_Up4.classList.add('hidden');
            document.getElementById('fileName_4').textContent = "example.jpg";
            let button3 = document.getElementById('stylefileupload');
            button3.disabled = true;
        }else if(styletype == 1){
            generative_clear();
            let button2 = document.getElementById('stylegen');
            button2.disabled = true;
        }else{
            stBox[normtype].classList.remove('select');
            let button1 = document.getElementById('stylenorm');
            button1.disabled = true;
        }
    }
    currentStep --;

    while(currentStep > step){
        stepTargets[currentStep].classList.remove('prev');
        formTargets[currentStep].classList.add('hidden');
        currentStep --;
    }
    stepTargets[currentStep].classList.remove('prev');
    stepTargets[currentStep].classList.add('active');
    formTargets[currentStep].classList.remove('hidden');
    if(step <= 1){ 
        hide();
        document.getElementById("check_1").checked = false;
        document.getElementById("check_2").checked = false;
    } else{
        uploadTargets[uploadtype].classList.add('hidden');
    }
}

function select_norm(input){
    stBox[normtype].classList.remove('select');
    stBox[input].classList.add('select');
    normtype = input;

    let button = document.getElementById('stylenorm');
    button.disabled = false;

    request_data.style_image = null;
    switch(input){
        case 0 :
            request_data.style_name = "0.png"
            break;
        case 1 :
            request_data.style_name = "1.png"
            break; 
        case 2 :
            request_data.style_name = "2.png"
            break;
        case 3 :
            request_data.style_name = "3.png"
            break;
        case 4 :
            request_data.style_name = "4.png"
            break;
        case 5 :
            request_data.style_name = "5.png"
            break;               
    }
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

async function laststep(){
    styleTargets[styletype].classList.add('hidden');

    for(let i =0; i<6; i++){
        stepTargets[i].classList.add('last');
    }

    if(document.getElementById("check_1").checked || document.getElementById("check_2").checked){
        request_data.person_transfer_bool = true;
    } 

    let parsing = request_data.content_target_image.type;
    let replaced_parsing = parsing.replace('image/', '.');
    request_data.encoding_type = replaced_parsing;
    request_data.content_target_image = await toBase64(request_data.content_target_image);
    request_data.style_image = request_data.style_image ? await toBase64(request_data.style_image) : null;
    request_data.content_source_image =  request_data.content_source_image ? await toBase64( request_data.content_source_image) : null;

    fetch('/sendfile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request_data)
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function generative_send(){
    let uline = document.createElement('div');
    uline.classList.add('chatline');

    let uicon = document.createElement('div');
    uicon.classList.add('icon');
    uicon.classList.add('right');
    let uicontext = document.createTextNode("I");
    uicon.appendChild(uicontext);
    uline.appendChild(uicon);

    let uchat = document.createElement('div');
    uchat.classList.add('chat-text');
    uchat.classList.add('right');
    let userchat = document.getElementById('chat').value;
    let uchattext = document.createTextNode(userchat);
    uchat.appendChild(uchattext);
    uline.appendChild(uchat);

    chat_Log.appendChild(uline);

    let gline = document.createElement('div');
    gline.classList.add('chatline');

    let gicon = document.createElement('div');
    gicon.classList.add('icon');
    gicon.classList.add('left');
    let gicontext = document.createTextNode("G");
    gicon.appendChild(gicontext);
    gline.appendChild(gicon);

    let gchat = document.createElement('div');
    gchat.classList.add('chat-text');
    gchat.classList.add('left');
    let gchattext = document.createTextNode("변환 중입니다...");
    gchat.appendChild(gchattext);
    gline.appendChild(gchat);

    chat_Log.appendChild(gline);
    chat_Log.scrollTop = chat_Log.scrollHeight;
    const prompt = userchat;

    let input = document.getElementById('chat');
    input.value = null;

    fetch('/gen_image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({prompt: prompt})
    })
    .then(response => response.blob())
    .then(blob => {
        request_data.style_image = blob;
        const imgElement = document.getElementById('gen-image');
        const imageUrl = URL.createObjectURL(request_data.style_image);
        imgElement.src = imageUrl;
        const imgquery = document.querySelector('#gen-image');
        imgquery.classList.remove('hidden');
        let button = document.getElementById('stylegen');
        button.disabled = false;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function loadcontent_target(input){
    request_data.content_target_image = input.files[0];
    request_data.content_target_name = request_data.content_target_image.name;

    let name = targetName[uploadtype];
    name.textContent = request_data.content_target_name;

    if(uploadtype == 0){
        img_Up1.classList.remove('hidden');
        document.getElementById('img-up1').src = URL.createObjectURL(request_data.content_target_image);
    }else{
        img_Up3.classList.remove('hidden');
        document.getElementById('img-up3').src = URL.createObjectURL(request_data.content_target_image);
    }
    
    choose_ex[uploadtype].classList.add('hidden');
    if(input.files.length > 0){
        let button1 = document.getElementById('singlefileupload');
        button1.disabled = false;
        if(uploadnum == 0){
            uploadnum = 1;
        }else{
            let button2 = document.getElementById('doublefileupload');
            button2.disabled = false;
        }
    }
}

function loadsource_target(input){
    request_data.content_source_image = input.files[0];
    request_data.content_source_name = request_data.content_source_image.name;

    let name = document.getElementById('fileName_3');
    name.textContent = request_data.content_source_name;

    img_Up2.classList.remove('hidden');
    document.getElementById('img-up2').src = URL.createObjectURL(request_data.content_source_image);      

    choose_back[0].classList.add('hidden');
    if(input.files.length > 0){
        if(uploadnum == 0){
            uploadnum = 1;
        }else{
            let button2 = document.getElementById('doublefileupload');
            button2.disabled = false;
        }
    }
}

function loadstyle(input){
    request_data.style_image = input.files[0];
    request_data.style_name = request_data.style_image.name;

    let name = document.getElementById('fileName_4');
    name.textContent = request_data.style_name;

    img_Up4.classList.remove('hidden');
    document.getElementById('img-up4').src = URL.createObjectURL(request_data.style_image);      

    choose_style[0].classList.add('hidden');

    if(input.files.length > 0){
            let button = document.getElementById('stylefileupload');
            button.disabled = false;
    }
}
