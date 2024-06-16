from src import *
from flask import Flask, request
import json, base64, cv2, os, gc, torch
from io import BytesIO
from PIL import Image
import torchvision.transforms as transforms
import numpy as np
current_path = os.path.dirname(os.path.abspath(__file__))
# 프로그램 실행시 아래 명령어로 실행. 포트번호는 변경 가능
# flask run --host='0.0.0.0' --port='21220'
app = Flask(__name__)

#파일 경로
content_path = current_path + "/data/content/"
style_path = current_path + "/data/style/"
# content path 폴더 생성
if not os.path.exists(content_path):
    os.makedirs(content_path)

# 모델 불러오기
transfer = Transfer()
segmenter = Segmenter()

@app.route('/upload', methods=['POST'])
def save_image():
    if request.method == 'POST':
        # json 형식으로 요청해야한다.
        print("request 받음")
        json_data = request.get_json()
        dict_data = json.loads(json.dumps(json_data))
        for key, value in dict_data.items():
            if type(value) is str:
                print(f"{key}: {value[:20]}")
            else:
                print(f"{key}: {value}")
        '''
        ==========================================
                        json info
        ==========================================
        person_transfer_bool *  : 인물 포함 이미지 변환을 요청했는지 유무. True = 인물포함 변환. False = 인물 제외 변환.
        encoding_type *         : 이미지 encoding 형식. ex).jpg, .png
        content_target_name *   : 최종적으로 유저가 이미지 변환을 요구하는 이미지
        content_target_image *  : 위의 이미지 데이터
        content_source_name     : 유저가 배경화면과 content_target_image와의 합성을 원했을 경우. None에서 이미지 이름을 받아온다
        content_source_image    : 위의 이미지 데이터
        style_name *            : 변환할 스타일 이미지 이름
        style_image *           : 위의 이미지 데이터
        
            * : 값이 항상 존재해야한다는 의미
        '''
        person_transfer_bool = dict_data['person_transfer_bool']
        encoding_type = dict_data['encoding_type']
        content_target_name = dict_data['content_target_name']
        content_target_image = dict_data['content_target_image']
        content_target_image = Image.open(BytesIO(base64.b64decode(content_target_image)))
        # image convert
        content_target_image = convert_to_rgb(content_target_image)
        
        resizing_width = 1000
        # 타겟 이미지 크기 추출
        width, height = content_target_image.size
        if width < height:
            decay_rate = round(resizing_width/height, 2)
        else:
            decay_rate = round(resizing_width/width, 2)
        
        # FHD보다 이미지가 작거나 같은 경우
        if decay_rate >= 1 :
            decay_rate = 1    
        width, height = int(width * decay_rate), int(height * decay_rate)
        
        # 이미지 크기 변환
        content_target_image = content_target_image.resize((width, height))
        # 이미지 이름 중복성 검사
        temp = content_target_name
        for i in range(101):
            if os.path.exists(f'{content_path}{temp}'):
                temp = content_target_name + str(i)
            else:
                content_target_image.save(f'{content_path}{temp}')
                content_target_name = temp
                break
            
            if i == 100:
                raise
        
        content_source_name = dict_data['content_source_name']
        content_source_image = dict_data['content_source_image']
        # 유저가 이미지와 배경화면 합성을 요구한 경우
        if content_source_image is not None:
            content_source_image = Image.open(BytesIO(base64.b64decode(content_source_image)))
            # image convert
            content_source_image = convert_to_rgb(content_source_image)
            # 이미지 크기 변환
            content_source_image = content_source_image.resize((width, height))
            # 이미지 이름 중복성 검사
            temp = content_source_name
            for i in range(101):
                if os.path.exists(f'{content_path}{temp}'):
                    temp = content_source_name + str(i)
                else:
                    content_source_image.save(f'{content_path}{temp}')
                    content_source_name = temp
                    break
                
                if i == 100:
                    raise
            
        # select, dall_e, custom
        style_image = dict_data['style_image']
        style_name = dict_data['style_name']
        # 제공하는 스타일을 적용하는 경우
        if style_image is None:
            style_image = Image.open(f'{style_path}{style_name}')
        # 커스텀 이미지(DALL-E, User Image)를 이용하는 경우
        else:
            style_image = Image.open(BytesIO(base64.b64decode(style_image)))
        # image convert
        style_image = convert_to_rgb(style_image)
        # 이미지 크기 변환
        style_image = style_image.resize((width, height))
        
        # 이미지 변환
        return processing(encoding_type, person_transfer_bool, 
                          content_target_image, content_target_name, style_image, 
                          content_source_image, content_source_name)

# 이미지가 RGBA 인경우 RGB로 변환
def convert_to_rgb(image:Image):
    if image.mode != 'RGB':
        image = image.convert('RGB')
    return image

# 이미지 변환 작업
def processing(encoding_type:str, person_transfer_bool:bool, 
               content_target_image:Image, content_target_name:str, style_image:Image, 
               content_source_image=None,content_source_name=None):
    '''
    현재 GPU 성능으로 보았을 때 Transfer의 가능한 이미지 크기가 약 HD 정도로 추정
    따라서 필연적으로 target_image보다 화질 저하가 발생한다.
    따라서 변환하는 이미지의 크기는 HD크기를 넘지 않는다.
    '''
    # 텐서 변환
    loader = transforms.Compose([
                transforms.ToTensor()])
    # PIL 이미지로 변환
    unloader = transforms.ToPILImage()
    print("style image size: ", style_image.size)
    style_image = loader(style_image).unsqueeze(0)
    
    # 오류 발생 시 True로 변함 
    exception = False
    try:
        # 배경이미지를 선택하지 않은 경우
        if content_source_image is None:
            print("content_target_image size: ", content_target_image.size)
            content_image = loader(content_target_image).unsqueeze(0)
            print(content_image.shape, "\n", style_image.shape)
            image = transfer.run_style_transfer(content_img=content_image, style_img=style_image, num_steps=300)
            image = unloader(image.squeeze(0))
            
            # 인물 변환
            if person_transfer_bool:
                mask = segmenter.run(content_target_name)
                reverse_mask = np.where(mask == 0, 1, 0).astype(np.uint8)

                image = image * reverse_mask
                content_mask = content_target_image * mask
                result = image + content_mask
                
            else:
                result = np.array(image)

        # 배경 이미지를 선택한 경우
        else:
            mask = segmenter.run(content_target_name)
            reverse_mask = np.where(mask == 0, 1, 0).astype(np.uint8)
            content_target_masked = content_target_image * mask
            
            # 인물 변환
            if person_transfer_bool:
                content_source_image = loader(content_source_image).unsqueeze(0)
                image = transfer.run_style_transfer(content_img=content_source_image, style_img=style_image, num_steps=300)
                image = unloader(image.squeeze(0))
                
                content_source_masked = image * reverse_mask
                result = content_target_masked + content_source_masked
            else:
                content_source_masked = content_source_image * reverse_mask
                content_image = content_target_masked + content_source_masked
                content_image = loader(Image.fromarray(content_image)).unsqueeze(0)
                image = transfer.run_style_transfer(content_img=content_image, style_img=style_image, num_steps=300)
                result = np.array(unloader(image.squeeze(0)))
            
        result.astype(np.uint8)
        result = cv2.cvtColor(result, cv2.COLOR_BGR2RGB)
        _, result = cv2.imencode(encoding_type, result)
        b64_string = base64.b64encode(result).decode('utf-8')
        file = {"img": b64_string}
        
    except Exception as e:
        exception = True
    
    # 임시로 저장한 이미지 삭제
    if os.path.exists(f'{content_path}{content_target_name}'):
        os.remove(f'{content_path}{content_target_name}')
    
    if content_source_name is not None:
        if os.path.exists(f'{content_path}{content_source_name}'):
            os.remove(f'{content_path}{content_source_name}')
    # Garbage collector
    gc.collect()
    torch.cuda.empty_cache()
    
    if exception:
        raise Exception
     
    return file

# # 테스트용 코드
# if __name__ == "__main__":
#     content_path = current_path + "/data/content/"
#     style_path = current_path + "/data/style/"
#     # content path 폴더 생성
#     if not os.path.exists(content_path):
#         os.makedirs(content_path)
      
#     transfer = Transfer()
#     segmenter = Segmenter()
    
#     app.run(host='0.0.0.0', port=21220, debug=True)