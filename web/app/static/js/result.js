window.onload = function() {
const stepTargets = document.querySelectorAll('.step');

    stepTargets[0].classList.remove('active');
    for(let i =0; i<5; i++){
        stepTargets[i].classList.add('prev');
        stepTargets[i].classList.add('last');
    }
    stepTargets[5].classList.add('active');
    stepTargets[5].classList.add('last');
}