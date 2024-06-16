# # WorkSpace Install Guide
Image Generation Server을 구동하기 위해서는 몇가지 환경세팅을 해주어야합니다.

# Diffusion
자세한 설명은 이 사이트를 참고하시면 됩니다.

diffusers: https://github.com/huggingface/diffusers

runwayml stable diffusion: https://github.com/runwayml/stable-diffusion

1. Ubuntu 22.04 설치

ViT-Adapter와는 반대로 호환성 문제가 없기 때문에 최신 우분투 버전인 22.04를 사용합니다.

2. CUDA 12.1 설치

현재 pytorch에서 CUDA 12.1 까지 정식적으로 지원하기 때문에 CUDA 12.1을 설치합니다.

3. 가상환경 설치

차례대로 터미널에 입력해주세요

```
sudo apt update
sudo apt install curl -y
curl --output anaconda.sh https://repo.anaconda.com/archive/Anaconda3-2024.02-1-Linux-x86_64.sh
sha256sum anaconda.sh
bash anaconda.sh
sudo vi ~/.bashrc
export PATH=~/anaconda3/bin:~/anaconda3/condabin:$PATH
source ~/.bashrc
conda create -n capstone python=3.10
conda activate capstone
```

4. 라이브러리 설치
```
conda install pytorch torchvision torchaudio pytorch-cuda=12.1 -c pytorch -c nvidia
conda install -c conda-forge diffusers
conda install -y flask
```

5. flask 실행
```
cd gen
flask run --host='0.0.0.0' --post='21221'
```