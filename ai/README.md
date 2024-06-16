# WorkSpace Install Guide
Ai Server을 구동하기 위해서는 몇가지 환경세팅을 해주어야합니다.

# ViT-Adapter
자세한 설명은 이 사이트를 참고하시면 됩니다.

https://github.com/czczup/ViT-Adapter/tree/main/segmentation

1. Ubuntu 20.04 설치

최신 버전인 22.04는 ViT-Adapter 호환성에 문제가 있어 20.04 버전에서 진행합니다.

2. CUDA 11.1 설치

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
conda create -n capstone python=3.8
conda activate capstone
```

4. 라이브러리 설치
```
pip install torch==1.9.0+cu111 torchvision==0.10.0+cu111 torchaudio==0.9.0 -f https://download.pytorch.org/whl/torch_stable.html
pip install mmcv-full==1.4.2 -f https://download.openmmlab.com/mmcv/dist/cu111/torch1.9.0/index.html
pip install timm==0.4.12
pip install mmdet==2.22.0
pip install mmsegmentation==0.20.2
conda install -y flask opencv pillow numpy
```

5. ViT-Adapter git clone
```
cd StyleTransfer_Capstone/ai
git clone https://github.com/czczup/ViT-Adapter.git
```

6. ops 파일 생성 및 실행
```
cd ViT-Adapter/segmentation
ln -s ../detection/ops ./
cd ops & sh make.sh
```

7. pretrain weight 다운
![스크린샷 2024-05-21 오후 9 29 57](https://github.com/STRCapstone/StyleTransfer_Capstone/assets/56315335/c1bf0b3a-9da6-46d7-8c77-b597b9e9a1c9)

다운로드 받은 파일을 ai/release 안에 넣어주세요

8. flask 실행
```
cd ai
flask run --host='0.0.0.0' --post='21220'
```