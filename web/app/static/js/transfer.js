const nextButton = document.querySelector('#next');
const stepTargets = document.querySelectorAll('.step');
const stepprev = document.querySelectorAll('.step-status');
let currentStep = 0;

nextButton.addEventListener('click', ()=>{
    stepTargets[currentStep].classList.remove('active');
    stepTargets[currentStep].classList.add('prev');

    stepTargets[currentStep + 1].classList.add('active');
    currentStep = currentStep + 1;
});

function step1Back(){
    let step1 = 0;

    stepTargets[currentStep].classList.remove('active');
    currentStep --;

    while(currentStep > step1){
        stepTargets[currentStep].classList.remove('prev');
        currentStep --;
    }
    stepTargets[currentStep].classList.remove('prev');
    stepTargets[currentStep].classList.add('active');
}

function step2Back(){
    let step2 = 1;

    stepTargets[currentStep].classList.remove('active');
    currentStep --;

    while(currentStep > step2){
        stepTargets[currentStep].classList.remove('prev');
        currentStep --;
    }
    stepTargets[currentStep].classList.remove('prev');
    stepTargets[currentStep].classList.add('active');

}

function step3Back(){
    let step3 = 2;

    stepTargets[currentStep].classList.remove('active');
    currentStep --;

    while(currentStep > step3){
        stepTargets[currentStep].classList.remove('prev');
        currentStep --;
    }
    stepTargets[currentStep].classList.remove('prev');
    stepTargets[currentStep].classList.add('active');

}

function step4Back(){
    let step1 = 3;

    stepTargets[currentStep].classList.remove('active');
    currentStep --;

    while(currentStep > step4){
        stepTargets[currentStep].classList.remove('prev');
        currentStep --;
    }
    stepTargets[currentStep].classList.remove('prev');
    stepTargets[currentStep].classList.add('active');

}

function step5Back(){
    let step5 = 4;

    stepTargets[currentStep].classList.remove('active');
    currentStep --;

    while(currentStep > step5){
        stepTargets[currentStep].classList.remove('prev');
        currentStep --;
    }
    stepTargets[currentStep].classList.remove('prev');
    stepTargets[currentStep].classList.add('active');

}